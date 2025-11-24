const StatsCard = ({ title, value, change, icon: Icon }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-black' : 'text-gray-600'}`}>
              {change}
            </span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
          <Icon className="w-6 h-6 text-black" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;