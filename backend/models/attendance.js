const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  date: { type: Date, required: true },  // Ensure that the date is required
  status: { type: String, enum: ['Present', 'Absent'], required: true }
});



module.exports = mongoose.model('Attendance', attendanceSchema);
