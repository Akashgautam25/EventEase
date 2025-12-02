import { useState, useEffect } from 'react';
import { HiChartBarSquare } from 'react-icons/hi2';
import axiosClient from '../utils/axiosClient';

const AnalyticsChart = ({ stats }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchRegistrationData();
  }, [stats]);

  const fetchRegistrationData = async () => {
    try {
      const response = await axiosClient.get('/admin/registrations');
      const registrations = response.data.registrations || [];
      
      // Group registrations by month
      const monthlyData = {};
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      registrations.forEach(reg => {
        const date = new Date(reg.createdAt);
        const monthKey = months[date.getMonth()];
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { revenue: 0, registrations: 0 };
        }
        
        monthlyData[monthKey].revenue += reg.event.price * reg.ticketCount;
        monthlyData[monthKey].registrations += 1;
      });
      
      // Convert to chart format (last 6 months)
      const currentMonth = new Date().getMonth();
      const data = [];
      
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const monthName = months[monthIndex];
        data.push({
          month: monthName,
          revenue: monthlyData[monthName]?.revenue || 0,
          registrations: monthlyData[monthName]?.registrations || 0
        });
      }
      
      setChartData(data);
    } catch (error) {
      console.error('Error fetching registration data:', error);
      // Fallback to empty data
      setChartData([]);
    }
  };

  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
        <HiChartBarSquare className="w-6 h-6 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {chartData.map((data, index) => (
          <div key={data.month} className="flex items-center space-x-4">
            <div className="w-8 text-sm text-gray-600 font-medium">
              {data.month}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-black h-2 rounded-full transition-all duration-500"
                    style={{ width: `${maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600 font-medium w-20 text-right">
                  ${data.revenue.toFixed(2)}
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {data.registrations} registrations
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</div>
            <div className="text-sm text-gray-500">Total Revenue</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalEvents}</div>
            <div className="text-sm text-gray-500">Total Events</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;