const Drive = require('../models/Drive');
const Application = require('../models/Application');

// @desc    Get all drives
// @route   GET /api/drives
// @access  Private
const getDrives = async (req, res) => {
  try {
    const { search, sort } = req.query;
    
    let query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { jobRole: { $regex: search, $options: 'i' } }
      ];
    }

    let drives = Drive.find(query);

    // Sorting
    if (sort === 'deadline') {
      drives = drives.sort({ deadline: 1 });
    } else if (sort === 'ctc') {
      drives = drives.sort({ ctc: -1 });
    } else {
      drives = drives.sort({ createdAt: -1 });
    }

    const result = await drives.populate('createdBy', 'name email');

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single drive
// @route   GET /api/drives/:id
// @access  Private
const getDriveById = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    res.json(drive);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create a new drive
// @route   POST /api/drives
// @access  Private
const createDrive = async (req, res) => {
  try {
    const {
      companyName,
      jobRole,
      ctc,
      location,
      jobDescription,
      eligibilityCriteria,
      applicationLink,
      deadline,
      driveDate
    } = req.body;

    const drive = await Drive.create({
      companyName,
      jobRole,
      ctc,
      location,
      jobDescription,
      eligibilityCriteria,
      applicationLink,
      deadline,
      driveDate,
      createdBy: req.user._id
    });

    res.status(201).json(drive);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a drive
// @route   PUT /api/drives/:id
// @access  Private
const updateDrive = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    // Check if user is the creator
    if (drive.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this drive' });
    }

    const updatedDrive = await Drive.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedDrive);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a drive
// @route   DELETE /api/drives/:id
// @access  Private
const deleteDrive = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    // Check if user is the creator
    if (drive.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this drive' });
    }

    await Drive.findByIdAndDelete(req.params.id);
    
    // Also delete all applications for this drive
    await Application.deleteMany({ drive: req.params.id });

    res.json({ message: 'Drive removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get upcoming drives (deadline not passed)
// @route   GET /api/drives/upcoming
// @access  Private
const getUpcomingDrives = async (req, res) => {
  try {
    const drives = await Drive.find({
      deadline: { $gte: new Date() }
    })
      .sort({ deadline: 1 })
      .limit(5)
      .populate('createdBy', 'name email');

    res.json(drives);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getDrives,
  getDriveById,
  createDrive,
  updateDrive,
  deleteDrive,
  getUpcomingDrives
};
