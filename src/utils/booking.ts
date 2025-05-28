export function handleBooking(service?: string, location?: 'Sun Prairie' | 'Waunakee') {
  // TODO: Replace this URL with your actual booking system URL
  const bookingUrl = 'https://calendly.com/your-booking-url';
  
  // Open booking URL in a new tab
  window.open(bookingUrl, '_blank');
}