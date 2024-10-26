const Attendance = require('../models/attendance');

// Mark attendance with a date
exports.markAttendance = async (req, res) => {
  try {
    const { studentName, status, date } = req.body;
    const attendanceDate = new Date(date);  // Ensure the date is passed as a Date object
    const newAttendance = new Attendance({ studentName, status, date: attendanceDate });
    await newAttendance.save();
    res.status(201).json({ message: 'Attendance marked successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark attendance', error });
  }
};

// Get attendance records with optional filtering by student name
exports.getAttendance = async (req, res) => {
  try {
    const { studentName } = req.query;
    let attendanceRecords;

    if (studentName) {
      // Filter by student name (case-insensitive)
      attendanceRecords = await Attendance.find({ studentName: { $regex: studentName, $options: 'i' } });
    } else {
      // Get all attendance records
      attendanceRecords = await Attendance.find();
    }

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve attendance', error });
  }
};
