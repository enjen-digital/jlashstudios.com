import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaStar } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import API_BASE_URL from '../utils/api_url';

interface Slot {
    date: string;
    time: string;
}

interface Artist {
    id: number;
    name: string;
    profileImg: string;
    rating: number;
    reviews: number;
    price: string;
    service: string;
    availableSlots: Slot[];
}

const ArtistAvailability: React.FC = () => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<{ [key: number]: string }>({});
    const [apiLoading, setApiLoading] = useState(false);
    //
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingData, setBookingData] = useState({
        stylist_id: 0,
        salon_name: "Your Salon Name",
        date: "",
        start_time: "",
        end_time: "",
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        service: "",
        location: ""
    });
    //
    const location = useLocation();
    console.log("location->>", location);

    const { serviceTitle, servicePrice, location: serviceLocation } = location.state || {};

    const formattedPrice = servicePrice ? Number(servicePrice).toFixed(2) : "0.00";
    const [bookingConfirmation, setBookingConfirmation] = useState<string | null>(null);
    const selectedDateString = selectedDate.toLocaleDateString("en-CA"); // Ensures YYYY-MM-DD format

    useEffect(() => {
        setSelectedSlot({});
        const fetchArtists = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/artist`);
                if (!response.ok) {
                    throw new Error("Failed to fetch artists");
                }
                const data: Artist[] = await response.json();
                setArtists(data);

                // Extract available dates
                const uniqueDates = new Set<string>();
                data.forEach(artist => {
                    artist.availableSlots.forEach(slot => {
                        uniqueDates.add(slot.date); // Ensure correct format
                    });
                });
                setAvailableDates(Array.from(uniqueDates));
            } catch (error) {
                console.error("Error fetching artists:", error);
            }
        };

        fetchArtists();
    }, []);

    // Filter artists who have available slots for the selected date
    const filteredArtists = artists.filter((artist) =>
        artist.availableSlots.some((slot) => slot.date === selectedDateString)
    );

    // Auto-select the first available slot when the date changes
    useEffect(() => {
        filteredArtists.forEach((artist) => {
            const firstSlot = artist.availableSlots.find((slot) => slot.date === selectedDateString);
            if (firstSlot) {
                setSelectedSlot((prev) => ({ ...prev, [artist.id]: firstSlot.time }));
            }
        });
    }, [selectedDate, artists]);

    const tileClassName = ({ date }: { date: Date }) => {
        const dateString = date.toISOString().split("T")[0];
        return availableDates.includes(dateString) ? "text-black rounded-lg" : "";
    };

    const handleSlotSelection = (artistId: number, slot: string) => {
        setSelectedSlot((prev) => ({ ...prev, [artistId]: slot }));
    };

    const openBookingModal = (artist: Artist) => {
        if (!selectedSlot[artist.id]) return;

        const [startTime, endTime] = selectedSlot[artist.id].split(" - ");
        setSelectedArtist(artist);
        setBookingData({
            stylist_id: artist.id,
            salon_name: serviceLocation || "",
            date: selectedDateString,
            start_time: startTime,
            end_time: endTime,
            customer_name: "",
            customer_phone: "",
            customer_email: "",
            service: serviceTitle || "Default Service",
            location: serviceLocation || ""
        });

        setIsModalOpen(true);
    };

    const submitBooking = async () => {
        // Validation checks
        if (!bookingData.customer_name.trim()) {
            toast.error("Full Name is required");
            return;
        }

        if (!bookingData.customer_email.trim() || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(bookingData.customer_email)) {
            toast.error("Enter a valid email address");
            return;
        }

        if (!bookingData.customer_phone.trim() || !/^\d{10,15}$/.test(bookingData.customer_phone)) {
            toast.error("Enter a valid phone number (10-15 digits)");
            return;
        }

        setApiLoading(true); // Show loader while submitting

        try {
            const response = await fetch(`${API_BASE_URL}/api/appointments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "Pragma": "no-cache",
                    "Expires": "0",
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                throw new Error("Failed to book appointment");
            }

            const result = await response.json();
            console.log("result___>>>",result);
            
            setBookingConfirmation(`🎉 Congratulations, ${result.data.customer_name}! Your appointment with ${result.data.stylist.user.name} has been successfully booked. See you soon!`);
            // Close modal after success
            setIsModalOpen(false);
            setTimeout(() => setBookingConfirmation(null), 10000);
        } catch (error) {
            console.error("Error booking appointment:", error);
            toast.error("Error booking appointment");
        } finally {
            setApiLoading(false); // Hide loader after request completes
        }
    };

    
    const formatTimeTo12Hour = (time: string) => {
        const [startTime, endTime] = time.split(" - ");
        return `${convertTo12Hour(startTime)} - ${convertTo12Hour(endTime)}`;
    };

    const convertTo12Hour = (time: string) => {
        const [hour, minute] = time.split(":").map(Number);
        const period = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
    };

    return (
        <div className="flex flex-col min-h-screen bg-white px-4 py-6">
            <div className="flex justify-center mb-6 mt-6">
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold text-center mb-2">Select an Available Date</h2>
                    <Calendar
                        onChange={(date) => setSelectedDate(date as Date)}
                        value={selectedDate}
                        tileClassName={tileClassName}
                        className="w-full border rounded-lg p-4"
                    />
                    <p className="text-center mt-2 font-medium">
                        Selected Date: {selectedDate.toDateString()}
                    </p>
                    <p className="text-center text-gray-600 text-sm">
                        Available Dates: {availableDates.join(", ")}
                    </p>
                </div>
            </div>

            {bookingConfirmation && (
                <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-center">
                    {bookingConfirmation}
                </div>
            )}

            {filteredArtists.length === 0 ? (
                <div className="flex justify-center items-center h-40">
                    <div className="bg-red-100 text-red-600 p-4 rounded-lg shadow-lg text-center font-bold text-lg">
                        🚫 No available slots for {selectedDate.toDateString()}.
                    </div>
                </div>
            ) : (
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredArtists.map((artist) => {
                        const filteredSlots = artist.availableSlots.filter(
                            (slot) => slot.date === selectedDateString
                        );

                        return (
                            <div key={artist.id} className="flex flex-col p-4 border rounded-lg shadow-md">
                                <div className="flex items-center">
                                    <img
                                        src={artist.profileImg || "https://via.placeholder.com/150"}
                                        alt={artist.name}
                                        className="w-16 h-16 rounded-full border"
                                    />
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold">{artist.name}</h3>
                                        <div className="flex items-center text-yellow-500">
                                            {Array.from({ length: artist.rating }, (_, index) => (
                                                <FaStar key={index} />
                                            ))}
                                            <span className="text-gray-600 text-sm ml-1">({artist.reviews})</span>
                                        </div>
                                        <p className="text-lg font-bold">${formattedPrice}</p>
                                        <p className="text-gray-500">{serviceTitle}</p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h4 className="text-md font-semibold mb-2">Available Time Slots</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {filteredSlots.map((slot) => (
                                            <button
                                                key={slot.time}
                                                className={`px-3 py-1 border rounded-md ${selectedSlot[artist.id] === slot.time
                                                    ? "bg-red-500 text-white"
                                                    : "bg-gray-100"
                                                    }`}
                                                onClick={() => handleSlotSelection(artist.id, slot.time)}
                                            >
                                                {formatTimeTo12Hour(slot.time)}
                                            </button>
                                        ))}
                                    </div>
                                    {selectedSlot[artist.id] && (
                                        <p className="text-green-600 mt-2">
                                            Selected Time: {formatTimeTo12Hour(selectedSlot[artist.id])}
                                        </p>
                                    )}
                                </div>

                                <button
                                    className={`mt-4 px-6 py-2 rounded-full transition-colors ${selectedSlot[artist.id]
                                        ? "bg-theme-primary text-white hover:bg-theme-primary-hover"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                    onClick={() => openBookingModal(artist)}
                                    disabled={!selectedSlot[artist.id]}
                                >
                                    Book Now
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
            {apiLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
                    <div className="flex flex-col items-center">
                        <svg
                            className="animate-spin h-12 w-12 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                        </svg>
                        <p className="text-white mt-3">Please Wait...</p>
                    </div>
                </div>
            )}
            {/* modal for form */}
            {isModalOpen && selectedArtist && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-96 max-h-[90vh] overflow-y-auto relative">
                        {/* Close Button */}
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl transition"
                            onClick={() => setIsModalOpen(false)}
                        >
                            &times;
                        </button>

                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white text-center py-3 rounded-t-xl">
                            <h2 className="text-lg font-bold">
                                Confirm Your Booking with {selectedArtist.name}
                            </h2>
                        </div>

                        {/* Artist Details */}
                        <div className="flex items-center mt-4 px-4">
                            <img
                                src={selectedArtist.profileImg || "https://via.placeholder.com/150"}
                                alt={selectedArtist.name}
                                className="w-14 h-14 rounded-full border-2 border-green-500"
                            />
                            <div className="ml-3">
                                <h3 className="text-lg font-semibold">{selectedArtist.name}</h3>
                                <p className="text-gray-500 text-sm">{serviceTitle || "Selected Service"}</p>
                            </div>
                        </div>

                        {/* Input Fields (Scrollable) */}
                        <div className="mt-4 px-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full border p-2 rounded-lg mb-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                onChange={(e) => setBookingData({ ...bookingData, customer_name: e.target.value })}
                            />

                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full border p-2 rounded-lg mb-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                onChange={(e) => setBookingData({ ...bookingData, customer_email: e.target.value })}
                            />

                            <input
                                type="tel"
                                placeholder="Phone Number"
                                className="w-full border p-2 rounded-lg mb-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                onChange={(e) => setBookingData({ ...bookingData, customer_phone: e.target.value })}
                            />
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-between mt-5 px-4">
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg w-1/3 hover:bg-gray-400 transition"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-lg w-1/2 hover:bg-green-600 transition shadow-md"
                                onClick={submitBooking}
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ArtistAvailability;
