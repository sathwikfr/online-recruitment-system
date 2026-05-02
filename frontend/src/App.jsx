import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, PenTool, Mail, LogOut, BookOpen, Briefcase, CheckCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Candidates from './pages/Candidates';
import Interviews from './pages/Interviews';
import Tests from './pages/Tests';
import Inductions from './pages/Inductions';
import Emails from './pages/Emails';
import Login from './pages/Login';
import Careers from './pages/Careers';
import Jobs from './pages/Jobs';

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    shortlisted: 0,
    interviews: 0,
    selected: 0,
    rejected: 0
  });
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'InternRecruit';
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/candidates');
        const data = await res.json();
        setStats({
          total: data.length,
          shortlisted: data.filter(c => c.status === 'Shortlisted').length,
          interviews: data.filter(c => c.status === 'Interview').length,
          selected: data.filter(c => c.status === 'Selected').length,
          rejected: data.filter(c => c.status === 'Rejected').length
        });
        setRecentCandidates(data.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Applicants', value: stats.total, icon: <Users size={24} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Shortlisted', value: stats.shortlisted, icon: <Calendar size={24} />, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Interviews Scheduled', value: stats.interviews, icon: <Mail size={24} />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Hired Candidates', value: stats.selected, icon: <CheckCircle size={24} />, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-[32px] font-bold text-apple-text tracking-tight mb-2">Recruitment Overview</h1>
        <p className="text-apple-text-secondary font-medium">Welcome back! Here's what's happening with your hiring pipeline today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-apple-border/50 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <span className="text-[12px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
            </div>
            <div className="text-[32px] font-black text-apple-text mb-1">{stat.value}</div>
            <div className="text-[14px] font-bold text-apple-text-secondary uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-apple-border/50 overflow-hidden">
          <div className="p-8 border-b border-apple-border/30 flex justify-between items-center">
            <h3 className="text-[20px] font-bold text-apple-text tracking-tight">Recent Applications</h3>
            <Link to="/candidates" className="text-apple-blue font-bold text-[14px] hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[12px] font-black text-apple-text-secondary uppercase tracking-widest">
                  <th className="py-4 px-8">Candidate</th>
                  <th className="py-4 px-8">Role</th>
                  <th className="py-4 px-8">Status</th>
                  <th className="py-4 px-8">Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-apple-border/20">
                {isLoading ? (
                  <tr><td colSpan="4" className="py-12 text-center"><Loader2 className="animate-spin text-apple-blue mx-auto" /></td></tr>
                ) : recentCandidates.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 border border-white shadow-sm">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-apple-text group-hover:text-apple-blue transition-colors">{c.name}</div>
                          <div className="text-[12px] text-apple-text-secondary">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-8 text-[14px] font-medium text-gray-600">{c.role}</td>
                    <td className="py-5 px-8">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                        c.status === 'Applied' ? 'bg-blue-50 text-blue-600' :
                        c.status === 'Shortlisted' ? 'bg-purple-50 text-purple-600' :
                        c.status === 'Interview' ? 'bg-amber-50 text-amber-600' :
                        c.status === 'Selected' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-[13px] text-gray-400 font-medium">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#003d73] to-[#0078db] p-8 rounded-[32px] text-white shadow-xl shadow-blue-200">
            <h4 className="text-[20px] font-bold mb-2">Hiring Tip</h4>
            <p className="text-blue-50 text-[15px] leading-relaxed mb-6">Shortlisted candidates are 3x more likely to accept an offer if contacted within 48 hours.</p>
            <Link to="/candidates" className="bg-white text-[#0078db] px-6 py-3 rounded-2xl font-bold text-[14px] inline-block shadow-lg hover:scale-105 transition-transform">
              Review Candidates
            </Link>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-apple-border/50 shadow-sm">
            <h4 className="text-[18px] font-bold text-apple-text mb-6">Pipeline Health</h4>
            <div className="space-y-6">
              {[
                { label: 'Screening', val: 75, color: 'bg-blue-500' },
                { label: 'Interviewing', val: 45, color: 'bg-amber-500' },
                { label: 'Closing', val: 20, color: 'bg-green-500' },
              ].map((p, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[13px] font-bold text-gray-500 uppercase mb-2">
                    <span>{p.label}</span>
                    <span>{p.val}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ handleLogout }) {
  const links = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Candidates', path: '/candidates', icon: <Users size={20} /> },
    { name: 'Interviews', path: '/interviews', icon: <Calendar size={20} /> },
    { name: 'Tests & Tasks', path: '/tests', icon: <PenTool size={20} /> },
    { name: 'Inductions', path: '/inductions', icon: <BookOpen size={20} /> },
    { name: 'Emails', path: '/emails', icon: <Mail size={20} /> },
  ];

  return (
    <div className="w-[260px] bg-apple-bg h-screen fixed top-0 left-0 flex flex-col border-r border-apple-border z-50">
      <div className="p-8 pb-4">
        <h2 className="text-[20px] font-semibold text-apple-text tracking-tight flex items-center gap-3">
          <div className="h-8 w-8 bg-black rounded-xl flex items-center justify-center text-white shadow-sm">
            <Users size={18} strokeWidth={2} />
          </div>
          InternRecruit
        </h2>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-semibold text-apple-text-secondary uppercase tracking-wider mb-3 px-3">
          Menu
        </div>
        {links.map((link) => (
          <Link 
            key={link.name} 
            to={link.path}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white hover:shadow-sm text-[15px] font-medium text-apple-text transition-all group"
          >
            <div className="text-apple-text-secondary group-hover:text-apple-blue transition-colors">
              {link.icon}
            </div>
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-apple-border">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-xl hover:bg-red-50 hover:text-red-600 transition-all text-[15px] font-medium text-apple-text group"
        >
          <LogOut size={20} className="text-apple-text-secondary group-hover:text-red-600 transition-colors" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/careers" element={<Careers />} />
        
        {!isAuthenticated ? (
          <Route path="*" element={<Login setAuth={setIsAuthenticated} />} />
        ) : (
          <Route path="*" element={
            <div className="min-h-screen bg-apple-bg font-sans text-apple-text flex relative">
              <Sidebar handleLogout={handleLogout} />
              <main className="flex-1 ml-[260px] relative z-10 bg-apple-bg">
                <header className="h-20 border-b border-apple-border/50 bg-white/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-end px-10 gap-4">
                  <Link 
                    to="/jobs" 
                    className="flex items-center gap-2 text-[14px] font-medium text-apple-text-secondary hover:text-apple-blue transition-colors bg-white px-4 py-2 rounded-xl border border-apple-border shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-md"
                  >
                    <Briefcase size={16} />
                    Manage Jobs
                  </Link>
                  <Link 
                    to="/careers" 
                    target="_blank"
                    className="flex items-center gap-2 text-[14px] font-medium text-apple-text-secondary hover:text-apple-blue transition-colors bg-white px-4 py-2 rounded-xl border border-apple-border shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-md"
                  >
                    <Briefcase size={16} />
                    InternRecruit Careers Site
                  </Link>
                </header>
                <div className="pb-10">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/candidates" element={<Candidates />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/interviews" element={<Interviews />} />
                    <Route path="/tests" element={<Tests />} />
                    <Route path="/inductions" element={<Inductions />} />
                    <Route path="/emails" element={<Emails />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </div>
              </main>
            </div>
          } />
        )}
      </Routes>
    </Router>
  );
}
