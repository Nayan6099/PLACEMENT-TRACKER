export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const isDeadlinePassed = (deadline) => {
  return new Date(deadline) < new Date();
};

export const getDaysUntilDeadline = (deadline) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getStatusColor = (status) => {
  const colors = {
    'Applied': 'bg-blue-100 text-blue-800',
    'Interview Scheduled': 'bg-yellow-100 text-yellow-800',
    'Interview Done': 'bg-purple-100 text-purple-800',
    'Selected': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};
