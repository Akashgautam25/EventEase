import { useState, useEffect } from 'react';
import { 
  HiCalendarDays, 
  HiMapPin, 
  HiCurrencyDollar, 
  HiUsers, 
  HiTicket,
  HiMagnifyingGlass,
  HiFunnel
} from 'react-icons/hi2';
import axiosClient from '../utils/axiosClient';

const Events = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);

  const categories = ['All', 'Technology', 'Workshop', 'Career', 'Entertainment', 'Sports', 'Academic', 'Cultural', 'Other'];

  useEffect(() => {
    fetchEvents();
  }, [searchTerm, selectedCategory, sortBy, sortOrder, currentPage]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 9,
        sort: sortBy,
        order: sortOrder
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
      
      const response = await axiosClient.get(`/events?${params}`);
      
      // Handle both response formats (with/without pagination)
      if (Array.isArray(response.data)) {
        setEvents(response.data);
        setPagination({});
      } else {
        setEvents(response.data.events || []);
        setPagination(response.data.pagination || {});
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookEvent = async () => {
    try {
      const response = await axiosClient.post(`/events/${selectedEvent.id}/register`, {
        ticketCount: ticketCount
      });
      
      if (response.data) {
        alert('Event registered successfully!');
        setShowBookingModal(false);
        setSelectedEvent(null);
        setTicketCount(1);
        fetchEvents();
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      const errorMessage = error.response?.data?.message || 'Failed to register for event';
      alert(errorMessage);
    }
  };

  const openBookingModal = (event) => {
    setSelectedEvent(event);
    setShowBookingModal(true);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };
  
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };
  
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Discover Events</h1>
          <p className="text-gray-600 mt-2">Find and book amazing events happening around you</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <HiFunnel className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category === 'All' ? '' : category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading events...</div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <HiCalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => handleSortChange('date')}
                  className={`px-4 py-2 rounded-lg ${sortBy === 'date' ? 'bg-black text-white' : 'bg-gray-200'}`}
                >
                  Sort by Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSortChange('price')}
                  className={`px-4 py-2 rounded-lg ${sortBy === 'price' ? 'bg-black text-white' : 'bg-gray-200'}`}
                >
                  Sort by Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Event Image Placeholder */}
                  <div className="h-48 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                    <HiCalendarDays className="w-12 h-12 text-gray-400" />
                  </div>

                  <div className="p-6">
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                        {event.category}
                      </span>
                    </div>

                    {/* Event Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                    
                    {/* Event Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <HiCalendarDays className="w-4 h-4 mr-2" />
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <HiMapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <HiUsers className="w-4 h-4 mr-2" />
                        {event.availableSeats || event.maxSeats} seats available
                      </div>
                    </div>

                    {/* Price and Book Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <HiCurrencyDollar className="w-5 h-5 text-gray-400" />
                        <span className="text-lg font-bold text-gray-900">{event.price || 0}</span>
                      </div>
                      <button
                        onClick={() => openBookingModal(event)}
                        className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <HiTicket className="w-4 h-4 mr-2" />
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 border rounded-lg ${
                      currentPage === i + 1 ? 'bg-black text-white' : 'bg-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Book Event</h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900">{selectedEvent.title}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(selectedEvent.date).toLocaleDateString()} • ${selectedEvent.price}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Tickets
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedEvent.availableSeats || selectedEvent.maxSeats || 10}
                  value={ticketCount}
                  onChange={(e) => setTicketCount(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Price per ticket:</span>
                  <span>${selectedEvent.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Quantity:</span>
                  <span>{ticketCount}</span>
                </div>
                <div className="flex justify-between font-medium border-t border-gray-200 pt-2 mt-2">
                  <span>Total:</span>
                  <span>${(selectedEvent.price * ticketCount).toFixed(2)}</span>
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
                  setSelectedEvent(null);
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
  );
};

export default Events;