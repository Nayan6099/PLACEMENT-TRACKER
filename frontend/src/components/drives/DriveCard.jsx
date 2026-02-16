import { Link } from 'react-router-dom';
import { FiMapPin, FiDollarSign, FiCalendar, FiClock } from 'react-icons/fi';
import { formatDate, getDaysUntilDeadline, isDeadlinePassed } from '../../utils/helpers';

const DriveCard = ({ drive, showApplyButton = false, onApply }) => {
  const daysLeft = getDaysUntilDeadline(drive.deadline);
  const deadlinePassed = isDeadlinePassed(drive.deadline);

  return (
    <div className="card hover:shadow-lg transition duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{drive.companyName}</h3>
          <p className="text-gray-600 font-medium">{drive.jobRole}</p>
        </div>
        {!deadlinePassed ? (
          <span className={`badge ${daysLeft <= 3 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {daysLeft > 0 ? `${daysLeft} days left` : 'Today'}
          </span>
        ) : (
          <span className="badge bg-gray-100 text-gray-800">Expired</span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <FiDollarSign className="mr-2" />
          <span>{drive.ctc}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FiMapPin className="mr-2" />
          <span>{drive.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FiCalendar className="mr-2" />
          <span>Deadline: {formatDate(drive.deadline)}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FiClock className="mr-2" />
          <span>Drive Date: {formatDate(drive.driveDate)}</span>
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-2">
        {drive.jobDescription}
      </p>

      <div className="flex gap-2">
        <Link 
          to={`/drives/${drive._id}`} 
          className="btn-secondary flex-1 text-center"
        >
          View Details
        </Link>
        {showApplyButton && !deadlinePassed && (
          <button 
            onClick={() => onApply(drive._id)}
            className="btn-primary flex-1"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default DriveCard;
