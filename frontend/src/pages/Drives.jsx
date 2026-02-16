import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import DriveCard from '../components/drives/DriveCard';
import Loading from '../components/common/Loading';
import api from '../services/api';
import { FiSearch, FiFilter, FiPlus, FiMail } from 'react-icons/fi';

const Drives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrives();
  }, [searchTerm, sortBy]);

  const fetchDrives = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (sortBy && sortBy !== 'latest') params.sort = sortBy;

      const { data } = await api.get('/drives', { params });
      setDrives(data);
    } catch (error) {
      console.error('Error fetching drives:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (driveId) => {
    try {
      await api.post('/applications', { driveId });
      alert('Application submitted successfully!');
      navigate('/my-applications');
    } catch (error) {
      if (error.response?.data?.message === 'Already applied to this drive') {
        alert('You have already applied to this drive');
      } else {
        alert('Failed to apply. Please try again.');
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Placement Drives</h1>
          
          <div className="flex gap-3">
            <Link
              to="/drives/parse-email"
              className="btn-secondary flex items-center"
            >
              <FiMail className="mr-2" />
              Parse Email
            </Link>
            <Link
              to="/drives/add"
              className="btn-primary flex items-center"
            >
              <FiPlus className="mr-2" />
              Add Drive
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company name or job role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            <div className="relative">
              <FiFilter className="absolute left-3 top-3 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field pl-10"
              >
                <option value="latest">Latest First</option>
                <option value="deadline">Deadline (Earliest)</option>
                <option value="ctc">CTC (Highest)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Drives Grid */}
        {drives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drives.map((drive) => (
              <DriveCard 
                key={drive._id} 
                drive={drive} 
                showApplyButton={true}
                onApply={handleApply}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No placement drives found</p>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search or filters' : 'Be the first to add a placement drive!'}
            </p>
            <div className="flex justify-center gap-3">
              <Link to="/drives/add" className="btn-primary">
                Add Drive Manually
              </Link>
              <Link to="/drives/parse-email" className="btn-secondary">
                Parse from Email
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drives;
