const Application = require('../models/Application');
const Drive = require('../models/Drive');

// @desc    Apply to a drive
// @route   POST /api/applications
// @access  Private
const applyToDrive = async (req, res) => {
  try {
    const { driveId, notes } = req.body;

    // Check if drive exists
    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      student: req.user._id,
      drive: driveId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this drive' });
    }

    // Create application
    const application = await Application.create({
      student: req.user._id,
      drive: driveId,
      notes: notes || ''
    });

    const populatedApplication = await Application.findById(application._id)
      .populate('drive')
      .populate('student', 'name email rollNumber');

    res.status(201).json(populatedApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all applications for current user
// @route   GET /api/applications
// @access  Private
const getMyApplications = async (req, res) => {
  try {
    const { status, sort } = req.query;
    
    let query = { student: req.user._id };
    
    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    let applications = Application.find(query)
      .populate('drive')
      .populate('student', 'name email rollNumber');

    // Sorting
    if (sort === 'deadline') {
      applications = applications.sort({ 'drive.deadline': 1 });
    } else {
      applications = applications.sort({ appliedAt: -1 });
    }

    const result = await applications;

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('drive')
      .populate('student', 'name email rollNumber');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if application belongs to user
    if (application.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this application' });
    }

    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private
const updateApplication = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if application belongs to user
    if (application.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status || application.status;
    application.notes = notes !== undefined ? notes : application.notes;
    application.updatedAt = Date.now();

    await application.save();

    const updatedApplication = await Application.findById(application._id)
      .populate('drive')
      .populate('student', 'name email rollNumber');

    res.json(updatedApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if application belongs to user
    if (application.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this application' });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({ message: 'Application removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/applications/stats/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    // Total drives available
    const totalDrives = await Drive.countDocuments({
      deadline: { $gte: new Date() }
    });

    // Applications by current user
    const myApplications = await Application.find({ student: req.user._id });
    const appliedCount = myApplications.length;

    // Status breakdown
    const statusCounts = await Application.aggregate([
      { $match: { student: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Upcoming deadlines (next 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const upcomingDeadlines = await Drive.find({
      deadline: { $gte: new Date(), $lte: sevenDaysFromNow }
    })
      .sort({ deadline: 1 })
      .limit(5)
      .select('companyName jobRole deadline');

    // Recent drives (last 5)
    const recentDrives = await Drive.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('companyName jobRole ctc location deadline');

    res.json({
      totalDrives,
      appliedCount,
      statusCounts,
      upcomingDeadlines,
      recentDrives
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  applyToDrive,
  getMyApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getDashboardStats
};
