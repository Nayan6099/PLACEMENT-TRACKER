import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import StatCard from '../components/dashboard/StatCard';
import Loading from '../components/common/Loading';
import api from '../services/api';
import { FiBriefcase, FiCheckCircle, FiCalendar, FiClock } from 'react-icons/fi';
import { formatDate } from '../utils/helpers';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/applications/stats/dashboard');
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const getStatusCount = (status) => {
    const statusObj = stats?.statusCounts?.find(s => s._id === status);
    return statusObj?.count || 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Drives Available"
            value={stats?.totalDrives || 0}
            icon={<FiBriefcase className="text-2xl text-white" />}
            color="bg-blue-500"
          />
          <StatCard
            title="Applications Submitted"
            value={stats?.appliedCount || 0}
            icon={<FiCheckCircle className="text-2xl text-white" />}
            color="bg-green-500"
          />
          <StatCard
            title="Interview Scheduled"
            value={getStatusCount('Interview Scheduled')}
            icon={<FiCalendar className="text-2xl text-white" />}
            color="bg-yellow-500"
          />
          <StatCard
            title="Selected"
            value={getStatusCount('Selected')}
            icon={<FiCheckCircle className="text-2xl text-white" />}
            color="bg-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Deadlines */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FiClock className="mr-2 text-primary" />
              Upcoming Deadlines
            </h2>
            {stats?.upcomingDeadlines?.length > 0 ? (
              <div className="space-y-3">
                {stats.upcomingDeadlines.map((drive) => (
                  <div key={drive._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{drive.companyName}</p>
                      <p className="text-sm text-gray-600">{drive.jobRole}</p>
                    </div>
                    <span className="text-sm font-medium text-red-600">
                      {formatDate(drive.deadline)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming deadlines</p>
            )}
          </div>

          {/* Recent Drives */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FiBriefcase className="mr-2 text-primary" />
              Recently Added Drives
            </h2>
            {stats?.recentDrives?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentDrives.map((drive) => (
                  <div key={drive._id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-gray-800">{drive.companyName}</p>
                      <span className="text-sm font-medium text-green-600">{drive.ctc}</span>
                    </div>
                    <p className="text-sm text-gray-600">{drive.jobRole}</p>
                    <p className="text-xs text-gray-500 mt-1">{drive.location}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent drives</p>
            )}
            <Link to="/drives" className="btn-primary w-full mt-4 block text-center">
              View All Drives
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
