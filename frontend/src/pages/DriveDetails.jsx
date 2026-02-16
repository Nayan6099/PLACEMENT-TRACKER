import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Loading from '../components/common/Loading';
import api from '../services/api';
import { FiMapPin, FiDollarSign, FiCalendar, FiClock, FiExternalLink, FiArrowLeft } from 'react-icons/fi';
import { formatDate, isDeadlinePassed } from '../utils/helpers';

const DriveDetails = () => {
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrive();
  }, [id]);

  const fetchDrive = async () => {
    try {
      const { data } = await api.get(`/drives/${id}`);
      setDrive(data);
    } catch (error) {
      console.error('Error fetching drive:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post('/applications', { driveId: drive._id });
      alert('Application submitted successfully!');
      navigate('/my-applications');
    } catch (error) {
      if (error.response?.data?.message === 'Already applied to this drive') {
        alert('You have already applied to this drive');
      } else {
        alert('Failed to apply. Please try again.');
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Loading />;
  if (!drive) return <div className="text-center py-8">Drive not found</div>;

  const deadlinePassed = isDeadlinePassed(drive.deadline);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/drives" className="flex items-center text-primary hover:underline mb-6">
          <FiArrowLeft className="mr-2" />
          Back to Drives
        </Link>

        <div className="card max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{drive.companyName}</h1>
              <p className="text-xl text-gray-600 mt-2">{drive.jobRole}</p>
            </div>
            {deadlinePassed ? (
              <span className="badge bg-red-100 text-red-800">Deadline Passed</span>
            ) : (
              <span className="badge bg-green-100 text-green-800">Open</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center text-gray-700">
              <FiDollarSign className="mr-2 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">CTC</p>
                <p className="font-semibold">{drive.ctc}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <FiMapPin className="mr-2 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold">{drive.location}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <FiCalendar className="mr-2 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Application Deadline</p>
                <p className="font-semibold">{formatDate(drive.deadline)}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <FiClock className="mr-2 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Drive Date</p>
                <p className="font-semibold">{formatDate(drive.driveDate)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Job Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{drive.jobDescription}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Eligibility Criteria</h2>
              <p className="text-gray-700 whitespace-pre-line">{drive.eligibilityCriteria}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Application Link</h2>
              <a 
                href={drive.applicationLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center"
              >
                {drive.applicationLink}
                <FiExternalLink className="ml-2" />
              </a>
            </div>
          </div>

          {!deadlinePassed && (
            <div className="mt-8 flex gap-4">
              <a 
                href={drive.applicationLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary flex-1 text-center"
              >
                Visit Application Link
              </a>
              <button
                onClick={handleApply}
                disabled={applying}
                className="btn-primary flex-1"
              >
                {applying ? 'Submitting...' : 'Mark as Applied'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriveDetails;
