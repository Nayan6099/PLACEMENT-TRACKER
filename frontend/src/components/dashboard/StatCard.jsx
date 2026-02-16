const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`${color} p-4 rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
