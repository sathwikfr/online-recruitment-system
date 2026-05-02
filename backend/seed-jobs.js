const mongoose = require('mongoose');
require('dotenv').config();
const Job = require('./models/Job');

const jobs = [
  {
    title: 'AWS Developer Intern',
    department: 'Cloud Engineering',
    location: 'Remote',
    description: 'Help build, deploy, and maintain scalable cloud infrastructure on AWS. You will learn about cloud architecture, serverless functions, and CI/CD pipelines.',
    skills: ['AWS', 'Node.js', 'Python'],
    status: 'Open'
  },
  {
    title: 'Product Management Intern',
    department: 'Product',
    location: 'Remote',
    description: 'Work with cross-functional teams to define product roadmaps, write specs, and conduct market research to launch new features.',
    skills: ['UI/UX', 'Figma'],
    status: 'Open'
  },
  {
    title: 'Data Science Intern',
    department: 'Data Analytics',
    location: 'San Francisco, CA',
    description: 'Analyze large datasets to extract meaningful insights. Build predictive models and dashboards to help guide our business decisions.',
    skills: ['Python', 'SQL', 'Machine Learning', 'Data Science'],
    status: 'Open'
  },
  {
    title: 'UI/UX Design Intern',
    department: 'Design',
    location: 'Remote',
    description: 'Create intuitive and stunning user experiences. You will prototype new features in Figma and conduct user research to improve our core products.',
    skills: ['Figma', 'UI/UX'],
    status: 'Open'
  },
  {
    title: 'Backend Engineer Intern',
    department: 'Engineering',
    location: 'New York, NY',
    description: 'Design and build scalable APIs using Node.js and Express. You will learn about database management, authentication, and building robust microservices.',
    skills: ['Node.js', 'Express', 'MongoDB'],
    status: 'Open'
  },
  {
    title: 'Frontend Developer Intern',
    department: 'Engineering',
    location: 'Remote',
    description: 'Help build beautiful, responsive user interfaces using React and Tailwind CSS. You will work closely with our design team to implement Apple-like aesthetics and smooth animations.',
    skills: ['React', 'JavaScript', 'CSS', 'UI/UX'],
    status: 'Open'
  }
];

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Job.deleteMany({});
    console.log('🗑️  Cleared existing jobs');

    await Job.insertMany(jobs);
    console.log('✅ Seeded 6 job roles successfully!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding jobs:', err);
    process.exit(1);
  }
};

seedJobs();
