import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HiCalendarDays, 
  HiClock, 
  HiMapPin, 
  HiCurrencyDollar, 
  HiUsers, 
  HiTicket,
  HiArrowLeft,
  HiXMark
} from 'react-icons/hi2';
import axiosClient from '../utils/axiosClient';

const EventDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/events/${id}`);
      setEvent(response.data.event);
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load. Check your internet or script tag.");
      return;
    }

    setIsProcessing(true);
    
    const options = {
      key: "rzp_test_RmTdHULpSEGepE",
      amount: event.price * ticketCount * 100,
      currency: "INR",
      name: "EventEase",
      description: "Event Ticket Booking",
      handler: function (response) {
        console.log("Payment Success:", response);
        handleBookingSuccess(response);
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: "9999999999"
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handleBookingSuccess = async (paymentResponse) => {
    try {
      setIsProcessing(true);
      
      // Register for the event
      const response = await axiosClient.post(`/events/${event.id}/register`, {
        ticketCount: ticketCount,
        paymentId: paymentResponse.razorpay_payment_id || `pay_${Date.now()}`,
        orderId: paymentResponse.razorpay_order_id || `order_${Date.now()}`
      });
      
      if (response.data) {
        alert('🎉 Booking confirmed! Payment successful.');
        setShowBookingModal(false);
        setTicketCount(1);
        fetchEventDetails(); // Refresh event data
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      alert('Please login to book events');
      navigate('/login');
      return;
    }
    setShowBookingModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Event not found</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-black mb-4"
          >
            <HiArrowLeft className="w-5 h-5 mr-2" />
            Back to Events
          </button>
        </div>
      </div>

      {/* Event Details */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Event Header */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-black text-white text-sm font-medium rounded-full mb-4">
                      {event.category}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                  </div>
                </div>

                {/* Event Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <HiCalendarDays className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <HiClock className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium text-gray-900">
                        {new Date(event.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <HiMapPin className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <HiUsers className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Available</p>
                      <p className="font-medium text-gray-900">
                        {event.availableSeats}/{event.totalSeats} seats
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h2>
                  <p className="text-gray-600 leading-relaxed">{event.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <HiCurrencyDollar className="w-6 h-6 text-gray-600" />
                  <span className="text-3xl font-bold text-gray-900">${event.price}</span>
                </div>
                <p className="text-gray-500">per ticket</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleBookNow}
                  disabled={event.availableSeats === 0}
                  className="w-full flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <HiTicket className="w-5 h-5 mr-2" />
                  {event.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    {event.availableSeats > 0 
                      ? `${event.availableSeats} tickets remaining`
                      : 'No tickets available'
                    }
                  </p>
                </div>
              </div>

              {/* Event Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-4">Event Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Seats</span>
                    <span className="text-gray-900">{event.totalSeats}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Booked</span>
                    <span className="text-gray-900">{event.totalSeats - event.availableSeats}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Available</span>
                    <span className="text-gray-900">{event.availableSeats}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Book Tickets</h3>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <HiXMark className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">{event.title}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString()} • {event.location}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Tickets
                </label>
                <input
                  type="number"
                  min="1"
                  max={Math.min(event.availableSeats, 10)}
                  value={ticketCount}
                  onChange={(e) => setTicketCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span>Price per ticket:</span>
                  <span>${event.price}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Quantity:</span>
                  <span>{ticketCount}</span>
                </div>
                <div className="flex justify-between font-medium text-lg border-t border-gray-200 pt-2">
                  <span>Total Amount:</span>
                  <span>${(event.price * ticketCount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={handleRazorpayPayment}
                disabled={isProcessing}
                className="flex-1 bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-400"
              >
                {isProcessing ? 'Processing...' : 'Pay with Razorpay'}
              </button>
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 bg-white border border-black text-black py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;