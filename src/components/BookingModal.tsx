import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";
import API_BASE_URL from '../utils/api_url';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  location: string;
  serviceDuration: string; // Duration as a string like "2-2.5 hours"
  stylists: { id: string; name: string }[]; // Array of stylists
  onSubmit: (bookingDetails: {
    date: string;
    startTime: string;
    endTime: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    location: string,
    stylistId: string;
  }) => void;
}

// export function BookingModal({
//   isOpen,
//   onClose,
//   serviceTitle,
//   serviceDuration,
//   stylists,
//   location,
//   onSubmit,

// }: BookingModalProps) {
//   const [existingAppointments, setExistingAppointments] = useState<any[]>([]);

//   const fetchAppointments = async () => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/appointments`
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch appointments");
//       }
//       const data = await response.json();
//       setExistingAppointments(data);
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//     }
//   };

//   useEffect(() => {
//     if (isOpen) {
//       fetchAppointments();
//     }
//   }, [isOpen]);


//   const parseDuration = (duration: string): number => {
//     const numbers = duration.match(/\d+(\.\d+)?/g)?.map(Number); // Extract numbers

//     if (!numbers || numbers.length === 0) {
//       return 0;
//     }

//     const lastValue = numbers[numbers.length - 1]; // Take the last number
//     const lowerCaseDuration = duration.toLowerCase(); // Normalize input

//     if (lowerCaseDuration.includes("hour") || lowerCaseDuration.includes("hr")) {
//       return lastValue * 60; // Convert hours to minutes
//     }

//     return lastValue; // If in minutes, return as is
//   };

  const formik = useFormik({
    initialValues: {
      date: "",
      startTime: "",
      endTime: "",
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      stylistId: "",
    },
    validationSchema: Yup.object({
      date: Yup.string().required("Date is required"),
      startTime: Yup.string().required("Start time is required"),
      customerName: Yup.string().required("Name is required"),
      customerPhone: Yup.string()
        .required("Phone is required")
        .matches(/^[0-9]+$/, "Phone number must contain only numbers")
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must not exceed 15 digits"),
      customerEmail: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      stylistId: Yup.string().required("Stylist is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await onSubmit({
          date: values.date,
          startTime: values.startTime,
          endTime: values.endTime,
          customerName: values.customerName,
          customerPhone: values.customerPhone,
          customerEmail: values.customerEmail,
          location: location,
          stylistId: values.stylistId
        });
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Failed to submit booking. Please try again.");
      } finally {
        resetForm();
        onClose();
      }
    },
  });

  useEffect(() => {
    if (formik.values.startTime && serviceDuration) {
      console.log("serviceDuration", serviceDuration);

      const durationInMinutes = parseDuration(serviceDuration);
      console.log("durationInMinutes", durationInMinutes);

      const startTime = new Date(`1970-01-01T${formik.values.startTime}:00`);
      const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);
      const endTimeString = format(endTime, "HH:mm");
      formik.setFieldValue("endTime", endTimeString);
    }
  }, [formik.values.startTime, serviceDuration]);

  const isSunday = (date: Date): boolean => {
    return date?.getDay() === 0;
  };

  const isTimeInRange = (time: Date): boolean => {
    if (isNaN(time?.getTime())) {
      console.error("Invalid time value");
      return false;
    }

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    const startTime = 8 * 60;
    const endTime = 18 * 60 + 30;

    return totalMinutes >= startTime && totalMinutes <= endTime;
  };

  const filterTime = (time: Date) => {
    if (!isTimeInRange(time)) {
      return false;
    }

    const selectedDate = formik.values.date;
    const selectedStylist = String(formik.values.stylistId);
    const durationInMinutes = parseDuration(serviceDuration);

    if (!selectedDate || !selectedStylist) return true;

    const formattedTime = format(time, "HH:mm:ss");
    const selectedTimeInMinutes = time.getHours() * 60 + time.getMinutes();
    const endTimeInMinutes = selectedTimeInMinutes + durationInMinutes;

    return !existingAppointments.some((appointment) => {
      if (
        appointment.date === selectedDate &&
        String(appointment.stylist_id) === selectedStylist
      ) {
        const startMinutes = parseInt(appointment.start_time.split(":")[0]) * 60 +
          parseInt(appointment.start_time.split(":")[1]);
        const endMinutes = parseInt(appointment.end_time.split(":")[0]) * 60 +
          parseInt(appointment.end_time.split(":")[1]);

        return (
          (selectedTimeInMinutes >= startMinutes && selectedTimeInMinutes < endMinutes) ||
          (endTimeInMinutes > startMinutes && endTimeInMinutes <= endMinutes) ||
          (selectedTimeInMinutes <= startMinutes && endTimeInMinutes >= endMinutes)
        );
      }
      return false;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl relative">
        <X
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer"
        />
        <h2 className="text-xl font-bold mb-4 text-center">
          Book {serviceTitle}
        </h2>
        <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Select Stylist */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Artist
            </label>
            <select
              name="stylistId"
              value={formik.values.stylistId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Select a Artist
              </option>
              {stylists.map((stylist) => (
                <option key={stylist.id} value={stylist.id}>
                  {stylist.user.name}
                </option>
              ))}
            </select>
            {formik.touched.stylistId && formik.errors.stylistId ? (
              <div className="text-red-500 text-sm">
                {formik.errors.stylistId}
              </div>
            ) : null}
          </div>

          {/* Combined Date and Time Picker */}
          <div className="col-span-2 w-full">
            <label className="block text-sm font-medium text-gray-700">
              Date and Time
            </label>
            <DatePicker
              selected={
                formik.values.date && formik.values.startTime
                  ? new Date(`${formik.values.date}T${formik.values.startTime}`)
                  : null
              }
              onChange={(date: Date | null) => {
                if (date) {
                  const dateString = format(date, "yyyy-MM-dd");
                  let timeString = format(date, "HH:mm");

                  // Set default time if invalid (e.g., midnight)
                  const selectedTime = new Date(date);
                  if (selectedTime.getHours() === 0 && selectedTime.getMinutes() === 0) {
                    timeString = "09:00"; // Default to 9:00 AM
                  }

                  formik.setFieldValue("date", dateString);
                  formik.setFieldValue("startTime", timeString);
                }
              }}
              showTimeSelect
              timeFormat="h:mm aa"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd h:mm aa"
              className="w-full p-2 border border-gray-300 rounded-md"
              minDate={new Date()}
              filterDate={(date) => !isSunday(date)}
              filterTime={filterTime} // Ensure this is active
            />
            {formik.touched.date && formik.errors.date ? (
              <div className="text-red-500 text-sm">{formik.errors.date}</div>
            ) : null}
            {formik.touched.startTime && formik.errors.startTime ? (
              <div className="text-red-500 text-sm">
                {formik.errors.startTime}
              </div>
            ) : null}
          </div>
          {/* Location (Read-Only Field) */}
          {/* Customer Name */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="customerName"
              value={formik.values.customerName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border border-gray-300 rounded-md"
            />

            {formik.touched.customerName && formik.errors.customerName ? (
              <div className="text-red-500 text-sm">
                {formik.errors.customerName}
              </div>
            ) : null}
          </div>

          {/* Customer Phone */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Your Phone
            </label>
            <input
              type="tel"
              name="customerPhone"
              value={formik.values.customerPhone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {formik.touched.customerPhone && formik.errors.customerPhone ? (
              <div className="text-red-500 text-sm">
                {formik.errors.customerPhone}
              </div>
            ) : null}
          </div>

          {/* Customer Email */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Your Email
            </label>
            <input
              type="email"
              name="customerEmail"
              value={formik.values.customerEmail}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {formik.touched.customerEmail && formik.errors.customerEmail ? (
              <div className="text-red-500 text-sm">
                {formik.errors.customerEmail}
              </div>
            ) : null}
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-theme-primary text-white rounded-md hover:bg-theme-primary-hover"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
