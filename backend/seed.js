const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const { generateComplaintId } = require('./utils/complaintId');
const { getDepartmentForCategory, getInitialAssignedRole } = require('./utils/routing');

const DEMO_PASSWORD = 'Campus@123';

const DEMO_USERS = [
  { name: 'Ananya Admin', email: 'admin@complaintbuddy.com', role: 'admin', department: 'Administration' },
  { name: 'Rahul Mentor', email: 'mentor@complaintbuddy.com', role: 'mentor', department: 'Computer Engineering' },
  { name: 'Sunita HOD', email: 'hod@complaintbuddy.com', role: 'hod', department: 'Computer Engineering' },
  { name: 'Vikram Principal', email: 'principal@complaintbuddy.com', role: 'principal', department: 'Administration' },
  { name: 'Priya CR', email: 'cr@complaintbuddy.com', role: 'cr', department: 'Computer Engineering' },
  { name: 'Sam Student', email: 'student@complaintbuddy.com', role: 'student', department: 'Computer Engineering', studentId: 'STU2026001', year: 'Final Year' },
];

const DEMO_COMPLAINTS = [
  { title: 'Water leakage in Block A washroom', description: 'There has been a persistent water leakage near the second floor washroom in Block A for the past week.', category: 'Infrastructure', priority: 'High' },
  { title: 'Leakage near Block A stairs', description: 'Water leakage observed near the stairs of Block A, same area as before, getting worse.', category: 'Infrastructure', priority: 'Medium' },
  { title: 'Faculty not covering syllabus on time', description: 'Our subject faculty is behind schedule and it is affecting exam preparation for the whole class.', category: 'Academic', priority: 'Medium' },
  { title: 'Canteen food quality has dropped', description: 'The quality of food served in the canteen has dropped significantly over the last month.', category: 'Canteen', priority: 'Low' },
  { title: 'Harassment complaint against staff member', description: 'A student reported inappropriate behavior from a staff member during a lab session.', category: 'Harassment', priority: 'Urgent' },
  { title: 'Hostel WiFi not working', description: 'WiFi in the hostel has been down for three days, affecting online classes and assignments.', category: 'Hostel', priority: 'High' },
  { title: 'Bus route delay every morning', description: 'The college bus on route 4 has been consistently late by 20-30 minutes every morning this week.', category: 'Transport', priority: 'Medium' },
];

async function seed() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/complaintbuddy';
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB for seeding...');

  await User.deleteMany({});
  await Complaint.deleteMany({});
  console.log('Cleared existing users and complaints (demo reset)');

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
  const createdUsers = {};
  for (const u of DEMO_USERS) {
    const user = await User.create({ ...u, password: hashedPassword });
    createdUsers[u.role] = user;
  }
  createdUsers.student.mentorId = createdUsers.mentor._id;
  await createdUsers.student.save();
  console.log(`Created ${DEMO_USERS.length} demo users`);

  const student = createdUsers.student;
  for (let i = 0; i < DEMO_COMPLAINTS.length; i += 1) {
    const c = DEMO_COMPLAINTS[i];
    const complaintId = await generateComplaintId();
    const department = getDepartmentForCategory(c.category);
    const assignedRole = getInitialAssignedRole(c.priority, c.category);
    const statuses = ['Submitted', 'Under Review', 'In Progress', 'Resolved'];
    const status = statuses[i % statuses.length];
    await Complaint.create({
      complaintId,
      studentReference: student._id,
      title: c.title,
      description: c.description,
      category: c.category,
      priority: c.priority,
      department,
      assignedRole,
      status,
      resolvedAt: status === 'Resolved' ? new Date() : undefined,
      messages: [
        { senderRole: 'student', senderLabel: 'Anonymous Student', text: 'Please look into this as soon as possible.' },
      ],
    });
  }
  console.log(`Created ${DEMO_COMPLAINTS.length} demo complaints (labelled as demo data)`);

  console.log('\n=== DEMO LOGIN CREDENTIALS (all use the same password) ===');
  console.log(`Password: ${DEMO_PASSWORD}`);
  DEMO_USERS.forEach((u) => console.log(`${u.role.padEnd(10)} -> ${u.email}`));
  console.log('============================================================\n');

  await mongoose.disconnect();
  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
