import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HiCalendarDays, 
  HiMapPin, 
  HiCurrencyDollar, 
  HiUsers, 
  HiTicket,
  HiArrowLeft
} from 'react-icons/hi2';
import axiosClient from '../utils/axiosClient';

const EventDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await axiosClient.get(`/events/${id}`);
      setEvent(response.data.event);
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookEvent = async () => {
    try {
      const response = await axiosClient.post('/registrations', {
        eventId: event.id,
        ticketCount: ticketCount
      });
      
      if (response.data) {
        alert('Event booked successfully!');
        setShowBookingModal(false);
        setTicketCount(1);
        fetchEventDetails(); // Refresh event data
      }
    } catch (error) {
      console.error('Error booking event:', error);
      alert('Failed to book event. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-black mb-6"
        >
          <HiArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="h-64 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
            <HiCalendarDays className="w-16 h-16 text-gray-400" />
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                  {event.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">{event.title}</h1>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">${event.price}</div>
                <div className="text-sm text-gray-500">per ticket</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <HiCalendarDays className="w-5 h-5 mr-2" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <HiMapPin className="w-5 h-5 mr-2" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <HiUsers className="w-5 h-5 mr-2" />
                <span>{event.availableSeats} seats available</span>
              </div>
            </div>

            {user && (
              <button
                onClick={() => setShowBookingModal(true)}
                className="flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <HiTicket className="w-5 h-5 mr-2" />
                Book Now
              </button>
            )}
          </div>
        </div>

        {/* Event Description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h2>
          <p className="text-gray-600 leading-relaxed">{event.description}</p>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Book Event</h3>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(event.date).toLocaleDateString()} • ${event.price}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Tickets
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={event.availableSeats}
                    value={ticketCount}
                    onChange={(e) => setTicketCount(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Price per ticket:</span>
                    <span>${event.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Quantity:</span>
                    <span>{ticketCount}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t border-gray-200 pt-2 mt-2">
                    <span>Total:</span>
                    <span>${(event.price * ticketCount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={handleBookEvent}
                  className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Confirm Booking
                </button>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setTicketCount(1);
                  }}
                  className="flex-1 bg-white border border-black text-black py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;