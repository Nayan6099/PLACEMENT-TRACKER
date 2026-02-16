import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Loading from '../components/common/Loading';
import api from '../services/api';
import { FiEdit2, FiTrash2, FiExternalLink } from 'react-icons/fi';
import { formatDate, getStatusColor } from '../utils/helpers';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingApp, setEditingApp] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const statuses = ['All', 'Applied', 'Interview Scheduled', 'Interview Done', 'Selected', 'Rejected'];

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      const params = statusFilter !== 'All' ? { status: statusFilter } : {};
      const { data } = await api.get('/applications', { params });
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (app) => {
    setEditingApp(app._id);
    setEditStatus(app.status);
    setEditNotes(app.notes);
  };

  const handleUpdate = async (appId) => {
    try {
      await api.put(`/applications/${appId}`, {
        status: editStatus,
        notes: editNotes
      });
      setEditingApp(null);
      fetchApplications();
      alert('Application updated successfully!');
    } catch (error) {
      alert('Failed to update application');
    }
  };

  const handleDelete = async (appId) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await api.delete(`/applications/${appId}`);
        fetchApplications();
        alert('Application deleted successfully!');
      } catch (error) {
        alert('Failed to delete application');
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Applications</h1>

        {/* Status Filter */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  statusFilter === status
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="card">
                {editingApp === app._id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{app.drive.companyName}</h3>
                        <p className="text-gray-600">{app.drive.jobRole}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Status</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="input-field"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Interview Done">Interview Done</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Notes</label>
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="input-field"
                        rows="3"
                        placeholder="Add your notes..."
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(app._id)}
                        className="btn-primary"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingApp(null)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{app.drive.companyName}</h3>
                        <p className="text-gray-600 font-medium">{app.drive.jobRole}</p>
                      </div>
                      <span className={`badge ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-sm">
                      <div>
                        <p className="text-gray-600">CTC</p>
                        <p className="font-semibold">{app.drive.ctc}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Location</p>
                        <p className="font-semibold">{app.drive.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Applied On</p>
                        <p className="font-semibold">{formatDate(app.appliedAt)}</p>
                      </div>
                    </div>

                    {app.notes && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Notes:</p>
                        <p className="text-sm text-gray-600 mt-1">{app.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link 
                        to={`/drives/${app.drive._id}`}
                        className="btn-secondary flex items-center"
                      >
                        View Details
                        <FiExternalLink className="ml-2" />
                      </Link>
                      <button
                        onClick={() => handleEdit(app)}
                        className="btn-primary flex items-center"
                      >
                        <FiEdit2 className="mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(app._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">No applications found</p>
            <p className="text-gray-400 mt-2">Start applying to placement drives to track them here</p>
            <Link to="/drives" className="btn-primary inline-block mt-4">
              Browse Drives
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
