// API configuration for different environments
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? ''  // Use relative URLs in production (Vercel will handle routing)
  : 'http://localhost:5000';  // Use localhost in development

export const api = {
  // Auth endpoints
  login: `${API_BASE_URL}/api/auth/login`,
  register: `${API_BASE_URL}/api/auth/register`,

  // Job endpoints
  jobs: `${API_BASE_URL}/api/jobs`,

  // Candidate endpoints
  candidates: `${API_BASE_URL}/api/candidates`,
  trackCandidate: (email) => `${API_BASE_URL}/api/candidates/track/${email}`,

  // Interview endpoints
  interviews: `${API_BASE_URL}/api/interviews`,

  // Test endpoints
  tests: `${API_BASE_URL}/api/tests`,

  // Induction endpoints
  inductions: `${API_BASE_URL}/api/inductions`,

  // Email endpoints
  sendEmail: `${API_BASE_URL}/api/emails/send`
};

export default api;