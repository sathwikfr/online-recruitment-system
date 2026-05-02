const job = {
  title: 'AWS Developer Intern',
  department: 'Cloud Engineering',
  location: 'Remote',
  description: 'Help build, deploy, and maintain scalable cloud infrastructure on AWS. You will learn about cloud architecture, serverless functions, and CI/CD pipelines.',
  skills: ['AWS', 'Node.js', 'Python']
};

fetch('http://localhost:5000/api/jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(job)
}).then(res => {
  if (res.ok) console.log('✅ Added job: AWS Developer Intern');
  else console.error('❌ Failed to add job');
}).catch(console.error);
