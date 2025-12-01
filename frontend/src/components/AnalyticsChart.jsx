import { useState, useEffect } from 'react';
import { HiChartBarSquare } from 'react-icons/hi2';

const AnalyticsChart = ({ stats }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Generate sample monthly data for demonstration
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = months.map((month, index) => ({
      month,
      revenue: Math.floor(Math.random() * (stats.totalRevenue / 2)) + (index * 100),
      events: Math.floor(Math.random() * (stats.totalEvents / 2)) + (index * 2)
    }));
    setChartData(data);
  }, [stats]);

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
                    style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600 font-medium w-16 text-right">
                  ${data.revenue}
                </div>
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