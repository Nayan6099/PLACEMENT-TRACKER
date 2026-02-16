const express = require('express');
const router = express.Router();
const {
  applyToDrive,
  getMyApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getDashboardStats
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/stats/dashboard', getDashboardStats);

router.route('/')
  .get(getMyApplications)
  .post(applyToDrive);

router.route('/:id')
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

module.exports = router;
