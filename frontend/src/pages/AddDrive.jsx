import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import api from '../services/api';
import { FiBriefcase, FiArrowLeft } from 'react-icons/fi';

const AddDrive = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    jobRole: '',
    ctc: '',
    location: '',
    jobDescription: '',
    eligibilityCriteria: '',
    applicationLink: '',
    deadline: '',
    driveDate: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/drives', formData);
      alert('Placement drive added successfully!');
      navigate('/drives');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add drive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/drives')}
          className="flex items-center text-primary hover:underline mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to Drives
        </button>

        <div className="max-w-3xl mx-auto">
          <div className="card">
            <div className="flex items-center mb-6">
              <FiBriefcase className="text-3xl text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-800">Add New Placement Drive</h1>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Google"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Job Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="jobRole"
                    value={formData.jobRole}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Software Engineer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    CTC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ctc"
                    value={formData.ctc}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., 12-15 LPA"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Bangalore, Hyderabad"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Application Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Drive Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="driveDate"
                    value={formData.driveDate}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Application Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="applicationLink"
                  value={formData.applicationLink}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://company.com/careers/apply"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  className="input-field"
                  rows="5"
                  placeholder="Enter detailed job description..."
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Tip: Include responsibilities, required skills, and team information
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Eligibility Criteria <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="eligibilityCriteria"
                  value={formData.eligibilityCriteria}
                  onChange={handleChange}
                  className="input-field"
                  rows="4"
                  placeholder="e.g., CGPA >= 7.0, No active backlogs, B.Tech CSE/IT"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Tip: Mention CGPA, branch, backlog criteria, etc.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? 'Adding Drive...' : 'Add Placement Drive'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/drives')}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDrive;
