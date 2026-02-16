const express = require('express');
const router = express.Router();
const {
  getDrives,
  getDriveById,
  createDrive,
  updateDrive,
  deleteDrive,
  getUpcomingDrives
} = require('../controllers/driveController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getDrives)
  .post(createDrive);

router.get('/upcoming', getUpcomingDrives);

router.route('/:id')
  .get(getDriveById)
  .put(updateDrive)
  .delete(deleteDrive);

module.exports = router;
