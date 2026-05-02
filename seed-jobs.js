const jobs = [
  {
    title: 'Frontend Developer Intern',
    department: 'Engineering',
    location: 'Remote',
    description: 'Help build beautiful, responsive user interfaces using React and Tailwind CSS. You will work closely with our design team to implement Apple-like aesthetics and smooth animations.',
    skills: ['React', 'JavaScript', 'CSS', 'UI/UX']
  },
  {
    title: 'Backend Engineer Intern',
    department: 'Engineering',
    location: 'New York, NY',
    description: 'Design and build scalable APIs using Node.js and Express. You will learn about database management, authentication, and building robust microservices.',
    skills: ['Node.js', 'Express', 'MongoDB']
  },
  {
    title: 'UI/UX Design Intern',
    department: 'Design',
    location: 'Remote',
    description: 'Create intuitive and stunning user experiences. You will prototype new features in Figma and conduct user research to improve our core products.',
    skills: ['Figma', 'UI/UX']
  },
  {
    title: 'Data Science Intern',
    department: 'Data Analytics',
    location: 'San Francisco, CA',
    description: 'Analyze large datasets to extract meaningful insights. Build predictive models and dashboards to help guide our business decisions.',
    skills: ['Python', 'SQL', 'Machine Learning', 'Data Science']
  },
  {
    title: 'Product Management Intern',
    department: 'Product',
    location: 'Remote',
    description: 'Work with cross-functional teams to define product roadmaps, write specs, and conduct market research to launch new features.',
    skills: ['UI/UX', 'Figma']
  }
];

async function seedJobs() {
  for (const job of jobs) {
    try {
      const res = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
      });
      if (res.ok) {
        console.log(`✅ Added job: ${job.title}`);
      } else {
        console.error(`❌ Failed to add job: ${job.title}`);
      }
    } catch (err) {
      console.error(`Error adding ${job.title}:`, err.message);
    }
  }
}

seedJobs();
