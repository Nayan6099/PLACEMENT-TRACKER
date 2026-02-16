import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import api from '../services/api';
import { FiMail, FiArrowLeft, FiCheck } from 'react-icons/fi';

const EmailParser = () => {
  const [emailText, setEmailText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(false);
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

  // Simple AI-like parser using regex and keywords
  const parseEmail = () => {
    setParsing(true);
    
    // Extract company name (look for known patterns)
    const companyMatch = emailText.match(/(?:Company|Organisation|Organization):\s*([^\n]+)/i) ||
                        emailText.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:is|has|invites)/);
    
    // Extract job role
    const roleMatch = emailText.match(/(?:Role|Position|Job Title):\s*([^\n]+)/i) ||
                     emailText.match(/(?:for|as)\s+(?:a\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})\s+(?:role|position)/i);
    
    // Extract CTC/Salary
    const ctcMatch = emailText.match(/(?:CTC|Package|Salary):\s*([^\n]+)/i) ||
                    emailText.match(/(\d+(?:\.\d+)?(?:\s*-\s*\d+(?:\.\d+)?)?\s*(?:LPA|Lakhs|Lacs))/i);
    
    // Extract location
    const locationMatch = emailText.match(/(?:Location|Office|Work Location):\s*([^\n]+)/i) ||
                         emailText.match(/(?:in|at)\s+((?:[A-Z][a-z]+,?\s*)+)(?:\s+office)?/);
    
    // Extract deadline
    const deadlineMatch = emailText.match(/(?:Deadline|Last Date|Apply by):\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i) ||
                         emailText.match(/(?:before|by)\s+(\d{1,2}(?:st|nd|rd|th)?\s+[A-Z][a-z]+\s+\d{4})/i);
    
    // Extract drive date
    const driveDateMatch = emailText.match(/(?:Drive Date|Interview Date|Assessment):\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i);
    
    // Extract application link
    const linkMatch = emailText.match(/(https?:\/\/[^\s]+)/i);
    
    // Extract eligibility
    const eligibilityMatch = emailText.match(/(?:Eligibility|Criteria|Requirements):([\s\S]*?)(?:\n\n|$)/i);
    
    // Extract job description (take a large chunk after certain keywords)
    const descMatch = emailText.match(/(?:Description|Responsibilities|About the role):([\s\S]*?)(?:Eligibility|Requirements|$)/i);

    const newFormData = {
      companyName: companyMatch ? companyMatch[1].trim() : '',
      jobRole: roleMatch ? roleMatch[1].trim() : '',
      ctc: ctcMatch ? ctcMatch[1].trim() : '',
      location: locationMatch ? locationMatch[1].trim() : '',
      deadline: deadlineMatch ? convertToDateFormat(deadlineMatch[1]) : '',
      driveDate: driveDateMatch ? convertToDateFormat(driveDateMatch[1]) : '',
      applicationLink: linkMatch ? linkMatch[1].trim() : '',
      eligibilityCriteria: eligibilityMatch ? eligibilityMatch[1].trim() : '',
      jobDescription: descMatch ? descMatch[1].trim() : ''
    };

    setFormData(newFormData);
    setParsed(true);
    setParsing(false);
  };

  // Convert various date formats to YYYY-MM-DD
  const convertToDateFormat = (dateStr) => {
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (e) {
      // If conversion fails, return empty
    }
    return '';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await api.post('/drives', formData);
      alert('Placement drive added successfully!');
      navigate('/drives');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add drive');
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

        <div className="max-w-4xl mx-auto">
          <div className="card mb-6">
            <div className="flex items-center mb-4">
              <FiMail className="text-3xl text-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Parse Email to Add Drive</h1>
                <p className="text-gray-600 text-sm">Paste your placement drive email below</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> For best results, include details like Company Name, Role, CTC, 
                Location, Deadline, Drive Date, Application Link, and Eligibility Criteria in the email.
              </p>
            </div>

            <textarea
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              className="input-field font-mono text-sm"
              rows="12"
              placeholder="Paste your placement drive email here...

Example:
Company: Google India
Role: Software Engineer
CTC: 25 LPA
Location: Bangalore
Deadline: 31/12/2024
Drive Date: 15/01/2025
Application Link: https://careers.google.com/apply

Eligibility:
- CGPA >= 7.5
- No active backlogs
- B.Tech CSE/IT

Description:
Google is hiring for Software Engineer role..."
            />

            <button
              onClick={parseEmail}
              disabled={!emailText || parsing}
              className="btn-primary w-full mt-4"
            >
              {parsing ? 'Parsing...' : 'Parse Email'}
            </button>
          </div>

          {parsed && (
            <div className="card">
              <div className="flex items-center mb-6">
                <FiCheck className="text-2xl text-green-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">Review & Edit Parsed Details</h2>
              </div>

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
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Deadline <span className="text-red-500">*</span>
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
                    required
                  />
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
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Add Placement Drive
                  </button>
                  <button
                    type="button"
                    onClick={() => setParsed(false)}
                    className="btn-secondary flex-1"
                  >
                    Parse Again
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailParser;
