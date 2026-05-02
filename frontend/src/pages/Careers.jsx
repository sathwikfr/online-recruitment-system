import { useState, useEffect, useMemo, useRef } from 'react';
import { Upload, CheckCircle, XCircle, Briefcase, ChevronRight, LayoutDashboard, Loader2, Search, MapPin, Building2, Clock, Filter, ChevronDown, Bell, LogIn, UserPlus, LogOut, User, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', resumeUrl: '', linkedinUrl: '', skills: [] });
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [isEmployerDropdownOpen, setIsEmployerDropdownOpen] = useState(false);
  const employerDropdownRef = useRef(null);

  // Candidate auth state
  const [candidateUser, setCandidateUser] = useState(null);
  const [authModal, setAuthModal] = useState(null); // 'login' | 'register' | null
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [pendingRole, setPendingRole] = useState(null); // role to apply after login

  // Tracking state
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackEmail, setTrackEmail] = useState('');
  const [trackResults, setTrackResults] = useState(null);
  const [isTrackLoading, setIsTrackLoading] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (employerDropdownRef.current && !employerDropdownRef.current.contains(e.target)) {
        setIsEmployerDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load candidate session
  useEffect(() => {
    const saved = localStorage.getItem('candidateUser');
    if (saved) setCandidateUser(JSON.parse(saved));
  }, []);

  const handleCandidateAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    const endpoint = authModal === 'login' ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Authentication failed');
      if (authModal === 'login') {
        const user = { email: data.email };
        setCandidateUser(user);
        localStorage.setItem('candidateUser', JSON.stringify(user));
        setAuthModal(null);
        // If they were trying to apply, open the form now
        if (pendingRole) {
          setSelectedRole(pendingRole);
          setFormData(prev => ({ ...prev, email: data.email }));
          setPendingRole(null);
        }
      } else {
        // After register, switch to login
        setAuthModal('login');
        setAuthError('Account created! Please log in.');
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCandidateLogout = () => {
    setCandidateUser(null);
    localStorage.removeItem('candidateUser');
  };

  const handleApplyClick = (role) => {
    if (!candidateUser) {
      setPendingRole(role);
      setAuthModal('login');
      return;
    }
    setSelectedRole(role);
    setIsSuccess(false);
    setFormData({ name: '', email: candidateUser.email, resumeUrl: '', linkedinUrl: '', skills: [] });
    setResumeFile(null);
  };

  useEffect(() => {
    document.title = 'InternRecruit Careers';
    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/jobs');
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesLocation = job.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesDept = deptFilter === 'All' || job.department === deptFilter;
      return matchesSearch && matchesLocation && matchesDept;
    });
  }, [jobs, searchQuery, locationFilter, deptFilter]);

  const departments = useMemo(() => {
    const depts = ['All', ...new Set(jobs.map(j => j.department))];
    return depts;
  }, [jobs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('role', selectedRole.title);
    submitData.append('status', 'Applied');
    let linkedinUrl = formData.linkedinUrl;
    if (linkedinUrl && !linkedinUrl.startsWith('http')) {
      linkedinUrl = 'https://' + linkedinUrl;
    }
    submitData.append('linkedinUrl', linkedinUrl);
    formData.skills.forEach(skill => submitData.append('skills', skill));
    
    if (resumeFile) {
      submitData.append('resume', resumeFile);
    } else if (formData.resumeUrl) {
      submitData.append('resumeUrl', formData.resumeUrl);
    }

    try {
      let res;
      if (resumeFile) {
        // Use FormData for file upload
        res = await fetch('http://localhost:5000/api/candidates', {
          method: 'POST',
          body: submitData,
        });
      } else {
        // Use JSON for cleaner data submission when no file is present
        const jsonBody = {
          name: formData.name,
          email: formData.email,
          role: selectedRole.title,
          status: 'Applied',
          linkedinUrl: linkedinUrl,
          skills: formData.skills,
          resumeUrl: formData.resumeUrl
        };
        res = await fetch('http://localhost:5000/api/candidates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jsonBody),
        });
      }

      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', resumeUrl: '', linkedinUrl: '', skills: [] });
        setResumeFile(null);
      } else {
        const errData = await res.json();
        setError(errData.message || 'Application failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackEmail) return;
    setIsTrackLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/candidates/track/${trackEmail}`);
      const data = await res.json();
      setTrackResults(data);
    } catch (err) {
      console.error('Error tracking applications:', err);
    } finally {
      setIsTrackLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-700';
      case 'Shortlisted': return 'bg-purple-100 text-purple-700';
      case 'Interview': return 'bg-amber-100 text-amber-700';
      case 'Selected': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] font-sans text-[#444]">
      {/* Naukri-style Top Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-[#0078db] flex items-center gap-2">
                <Briefcase className="w-7 h-7" />
                Intern<span className="text-[#333]">Recruit</span> Careers
              </h1>
              <div className="hidden md:flex gap-6 text-[15px] font-medium text-gray-600">
                <a href="#" className="text-[#0078db] border-b-2 border-[#0078db] h-16 flex items-center">Jobs</a>
                <a href="#" className="hover:text-[#0078db] h-16 flex items-center">Companies</a>
                <a href="#" className="hover:text-[#0078db] h-16 flex items-center">Services</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Track Application */}
              <button 
                onClick={() => { setIsTrackModalOpen(true); setTrackResults(null); setTrackEmail(''); }}
                className="text-gray-600 hover:text-[#0078db] font-medium text-[14px] px-4 py-2 rounded-full border border-gray-200 hover:border-[#0078db] transition-all flex items-center gap-2"
              >
                <Bell size={15} />
                Track
              </button>

              {/* Candidate auth */}
              {candidateUser ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-[#0078db] font-semibold text-[13px] px-4 py-2 rounded-full">
                    <User size={14} />
                    {candidateUser.email.split('@')[0]}
                  </div>
                  <button onClick={handleCandidateLogout} className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50" title="Sign out">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <button onClick={() => { setAuthModal('login'); setAuthForm({ email: '', password: '' }); setAuthError(''); }}
                    className="text-[#0078db] font-semibold text-[15px] px-5 py-2 rounded-full border-2 border-[#0078db] hover:bg-[#0078db]/5 transition-all flex items-center gap-1.5">
                    <LogIn size={15} /> Login
                  </button>
                  <button onClick={() => { setAuthModal('register'); setAuthForm({ email: '', password: '' }); setAuthError(''); }}
                    className="bg-[#f05537] hover:bg-[#d94a2e] text-white font-semibold text-[15px] px-5 py-2 rounded-full transition-all shadow-sm flex items-center gap-1.5">
                    <UserPlus size={15} /> Register
                  </button>
                </>
              )}

              {/* For employers dropdown */}
              <div className="relative" ref={employerDropdownRef}>
                <button
                  onClick={() => setIsEmployerDropdownOpen(prev => !prev)}
                  className="flex items-center gap-1.5 text-[15px] font-semibold text-gray-700 hover:text-[#0078db] transition-colors px-2 py-2"
                >
                  For employers
                  <span className="text-[#f05537] font-bold text-[11px] -mt-3">▼</span>
                </button>
                {isEmployerDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <button
                      onClick={() => setIsEmployerDropdownOpen(false)}
                      className="w-full text-left px-5 py-3 text-[14px] text-gray-700 hover:bg-gray-50 hover:text-[#0078db] font-medium transition-colors"
                    >
                      InternRecruit Talent Cloud
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <Link
                      to="/login"
                      onClick={() => setIsEmployerDropdownOpen(false)}
                      className="flex items-center gap-2 px-5 py-3 text-[14px] text-gray-700 hover:bg-gray-50 hover:text-[#0078db] font-medium transition-colors"
                    >
                      <LayoutDashboard size={15} />
                      Admin Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-[#003d73] to-[#0078db] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Find your dream internship today</h2>
          <div className="bg-white p-2 rounded-[40px] shadow-2xl flex flex-col md:flex-row gap-2 max-w-4xl mx-auto border-4 border-white/20">
            <div className="flex-1 flex items-center px-6 border-b md:border-b-0 md:border-r border-gray-100">
              <Search className="text-gray-400 mr-3" size={20} />
              <input 
                type="text" 
                placeholder="Enter skills / designations / companies"
                className="w-full py-4 text-[16px] focus:outline-none text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-6">
              <MapPin className="text-gray-400 mr-3" size={20} />
              <input 
                type="text" 
                placeholder="Enter location"
                className="w-full py-4 text-[16px] focus:outline-none text-gray-700"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
            <button className="bg-[#0078db] hover:bg-[#0069c0] text-white px-10 py-4 rounded-[32px] font-bold text-lg transition-all shadow-lg">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <span className="font-bold text-gray-800 flex items-center gap-2">
                  <Filter size={18} className="text-[#0078db]" />
                  All Filters
                </span>
                <button 
                  onClick={() => { setDeptFilter('All'); setSearchQuery(''); setLocationFilter(''); }}
                  className="text-xs text-[#0078db] font-semibold uppercase hover:underline"
                >
                  Reset
                </button>
              </div>
              <div className="p-6 space-y-8">
                <div>
                  <h3 className="text-[15px] font-bold text-gray-800 mb-4">Department</h3>
                  <div className="space-y-3">
                    {departments.map(dept => (
                      <label key={dept} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input 
                            type="radio" 
                            name="dept"
                            checked={deptFilter === dept}
                            onChange={() => setDeptFilter(dept)}
                            className="w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#0078db] checked:bg-[#0078db] transition-all appearance-none cursor-pointer"
                          />
                          {deptFilter === dept && <div className="absolute inset-0 m-auto w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <span className={`text-[14px] ${deptFilter === dept ? 'text-[#0078db] font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                          {dept}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-[15px] font-bold text-gray-800 mb-4">Job Type</h3>
                  <div className="space-y-3">
                    {['Full Time', 'Part Time', 'Contract', 'Internship'].map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#0078db] focus:ring-[#0078db]" defaultChecked={type === 'Internship'} />
                        <span className="text-[14px] text-gray-600 group-hover:text-gray-900">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Results */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[18px] font-bold text-gray-800">
                {isLoading ? 'Searching jobs...' : `${filteredJobs.length} Jobs found`}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                Sort by: 
                <button className="flex items-center gap-1 font-semibold text-gray-800 hover:text-[#0078db]">
                  Relevance <ChevronDown size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="bg-white p-20 rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="animate-spin text-[#0078db]" size={40} />
                  <p className="font-medium text-gray-500">Curating the best roles for you...</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="bg-white p-20 rounded-2xl border border-gray-100 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="text-gray-300" size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">No jobs found matching your criteria</h4>
                  <p className="text-gray-500">Try adjusting your filters or search keywords</p>
                </div>
              ) : filteredJobs.map((role) => (
                <div 
                  key={role._id}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-[20px] font-bold text-gray-800 group-hover:text-[#0078db] transition-colors mb-2">{role.title}</h3>
                      <div className="flex items-center gap-6 text-[14px] text-gray-600 mb-4">
                        <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                          <Building2 size={16} className="text-gray-400" />
                          {role.department}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={16} className="text-gray-400" />
                          {role.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={16} className="text-gray-400" />
                          Just now
                        </span>
                      </div>
                      <p className="text-[14px] text-gray-500 line-clamp-2 mb-4 leading-relaxed">{role.description}</p>
                      <div className="flex gap-2 flex-wrap mb-4">
                        {role.skills.map(skill => (
                          <span key={skill} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-md text-[12px] font-medium border border-gray-100">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 flex-shrink-0">
                      <Briefcase className="text-gray-300" size={28} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-4">
                    <div className="flex items-center gap-2 text-[12px] text-gray-400">
                      <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded uppercase font-bold text-[10px]">🔥 Hot</span>
                      30+ Applicants
                    </div>
                    <button
                      onClick={() => handleApplyClick(role)}
                      className="group/btn relative bg-gradient-to-r from-[#0078db] to-[#7c3aed] text-white font-bold text-[13px] px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:scale-105 transition-all overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-1.5">
                        <Sparkles size={14} />
                        Apply Now
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Modal */}
      {isTrackModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-8 border-b border-gray-100 flex justify-between items-center bg-[#f8f9ff]">
              <div>
                <h2 className="text-[24px] font-bold text-[#333]">Track Your Application</h2>
                <p className="text-[15px] text-gray-500 mt-1">Get real-time updates on your status</p>
              </div>
              <button onClick={() => setIsTrackModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors bg-white p-2 rounded-full shadow-sm border border-gray-100">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-8 bg-white">
              <form onSubmit={handleTrack} className="flex gap-3 mb-8">
                <div className="relative flex-1">
                  <Bell className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    required 
                    type="email" 
                    value={trackEmail} 
                    onChange={(e) => setTrackEmail(e.target.value)} 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#0078db]/10 focus:border-[#0078db] bg-gray-50/50 text-[16px] transition-all" 
                    placeholder="name@example.com" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isTrackLoading}
                  className="bg-[#0078db] hover:bg-[#0069c0] text-white px-8 py-4 rounded-2xl font-bold active:scale-[0.98] transition-all flex items-center justify-center min-w-[120px] shadow-lg shadow-[#0078db]/20"
                >
                  {isTrackLoading ? <Loader2 className="animate-spin" size={24} /> : 'Track'}
                </button>
              </form>

              {trackResults && (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {trackResults.length === 0 ? (
                    <div className="text-center py-10 bg-orange-50 rounded-3xl border border-orange-100 px-6">
                      <p className="text-orange-800 font-bold mb-1">No applications found</p>
                      <p className="text-[14px] text-orange-600">We couldn't find any roles linked to <b>{trackEmail}</b>.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-1 w-8 bg-[#0078db] rounded-full"></div>
                        <h3 className="text-[13px] font-black text-gray-400 uppercase tracking-[2px]">Recent Submissions</h3>
                      </div>
                      <div className="space-y-4">
                        {trackResults.map((app) => (
                          <div key={app._id} className="p-5 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="font-bold text-[18px] text-[#333] mb-1">{app.role}</div>
                                <div className="text-[13px] text-gray-500 flex items-center gap-1.5 font-medium">
                                  <Clock size={14} /> 
                                  Applied on {new Date(app.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${getStatusColor(app.status)} shadow-sm`}>
                                {app.status}
                              </span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100/50">
                              <div className="flex justify-between text-[12px] font-bold text-gray-400 uppercase mb-2">
                                <span>Applied</span>
                                <span>Status</span>
                              </div>
                              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`absolute top-0 left-0 h-full transition-all duration-1000 ${
                                    app.status === 'Applied' ? 'w-1/4 bg-blue-500' :
                                    app.status === 'Shortlisted' ? 'w-1/2 bg-purple-500' :
                                    app.status === 'Interview' ? 'w-3/4 bg-amber-500' :
                                    app.status === 'Selected' ? 'w-full bg-green-500' : 'w-full bg-red-400'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Candidate Auth Modal */}
      {authModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="px-8 py-8 text-center" style={{background:'linear-gradient(135deg,#0078db,#7c3aed)'}}>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur">
                {authModal === 'login' ? <LogIn size={32} className="text-white" /> : <UserPlus size={32} className="text-white" />}
              </div>
              <h2 className="text-[24px] font-black text-white mb-1">
                {authModal === 'login' ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-white/70 text-[14px]">
                {authModal === 'login' ? 'Sign in to apply for jobs' : 'Join InternRecruit Careers'}
              </p>
            </div>
            <div className="p-8">
              {authError && (
                <div className={`mb-4 p-3 rounded-xl text-[13px] font-semibold flex items-center gap-2 ${
                  authError.includes('created') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                }`}>
                  {authError.includes('created') ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                  {authError}
                </div>
              )}
              <form onSubmit={handleCandidateAuth} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-black text-gray-400 uppercase tracking-wider mb-2">Email</label>
                  <input required type="email" value={authForm.email}
                    onChange={e => setAuthForm(p => ({...p, email: e.target.value}))}
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#0078db]/10 focus:border-[#0078db] text-[15px] transition-all"
                    placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-[12px] font-black text-gray-400 uppercase tracking-wider mb-2">Password</label>
                  <input required type="password" value={authForm.password}
                    onChange={e => setAuthForm(p => ({...p, password: e.target.value}))}
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#0078db]/10 focus:border-[#0078db] text-[15px] transition-all"
                    placeholder="••••••••" />
                </div>
                <button type="submit" disabled={authLoading}
                  className="w-full py-4 rounded-2xl font-bold text-white text-[15px] transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg"
                  style={{background:'linear-gradient(135deg,#0078db,#7c3aed)'}}>
                  {authLoading ? <Loader2 className="animate-spin" size={20}/> : (authModal === 'login' ? <><LogIn size={18}/>Sign In</> : <><UserPlus size={18}/>Create Account</>)}
                </button>
              </form>
              <div className="mt-6 text-center text-[14px] text-gray-500">
                {authModal === 'login' ? (
                  <>Don't have an account? <button onClick={() => { setAuthModal('register'); setAuthError(''); }} className="text-[#0078db] font-bold hover:underline">Register</button></>
                ) : (
                  <>Already have an account? <button onClick={() => { setAuthModal('login'); setAuthError(''); }} className="text-[#0078db] font-bold hover:underline">Login</button></>
                )}
              </div>
            </div>
            <div className="px-8 pb-6 flex justify-center">
              <button onClick={() => { setAuthModal(null); setPendingRole(null); }} className="text-gray-400 hover:text-gray-600 text-[13px] font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal - Naukri Style */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {isSuccess ? (
              <div className="p-16 text-center">
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle size={48} strokeWidth={2.5} />
                </div>
                <h2 className="text-[32px] font-black text-gray-800 mb-4 tracking-tight">Application Submitted!</h2>
                <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                  Great choice! We've received your application for <b>{selectedRole.title}</b>. We'll be in touch soon.
                </p>
                <button 
                  onClick={() => setSelectedRole(null)}
                  className="w-full bg-[#0078db] hover:bg-[#0069c0] text-white px-8 py-5 rounded-[24px] font-bold text-lg active:scale-[0.98] transition-all shadow-xl shadow-[#0078db]/20"
                >
                  Return to Job Board
                </button>
              </div>
            ) : (
              <>
                <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-[#f8f9ff]">
                  <div>
                    <span className="text-[12px] font-bold text-[#0078db] uppercase tracking-[3px] mb-1 block">Apply for Job</span>
                    <h2 className="text-[26px] font-black text-[#333] tracking-tight">{selectedRole.title}</h2>
                  </div>
                  <button onClick={() => setSelectedRole(null)} className="text-gray-400 hover:text-gray-600 transition-colors bg-white p-3 rounded-full shadow-sm border border-gray-100">
                    <XCircle size={28} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[14px] font-bold flex items-center gap-3">
                      <XCircle size={18} />
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                        <input 
                          required
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#0078db]/10 focus:border-[#0078db] bg-gray-50/30 text-[16px] transition-all font-medium"
                          placeholder="Your Name"
                        />
                      </div>
                      <div>
                        <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">Email ID</label>
                        <input 
                          required
                          type="email" 
                          value={formData.email}
                          readOnly={!!candidateUser}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className={`w-full px-5 py-4 rounded-2xl border text-[16px] font-medium transition-all ${
                            candidateUser 
                              ? 'border-blue-100 bg-blue-50/50 text-[#0078db] cursor-not-allowed' 
                              : 'border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#0078db]/10 focus:border-[#0078db] bg-gray-50/30'
                          }`}
                          placeholder="your.email@example.com"
                        />
                        {candidateUser && <p className="text-[11px] text-blue-500 mt-1 font-medium">✓ Verified from your account</p>}
                      </div>
                      <div>
                        <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">LinkedIn Profile</label>
                        <input 
                          type="url" 
                          value={formData.linkedinUrl}
                          onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                          className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#0078db]/10 focus:border-[#0078db] bg-gray-50/30 text-[16px] transition-all font-medium"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">Skill Match</label>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {selectedRole.skills.map(skill => {
                            const isSelected = formData.skills.includes(skill);
                            return (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    skills: isSelected 
                                      ? prev.skills.filter(s => s !== skill) 
                                      : [...prev.skills, skill]
                                  }));
                                }}
                                className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all border-2 ${
                                  isSelected 
                                    ? 'bg-[#0078db] text-white border-[#0078db] shadow-md shadow-[#0078db]/20' 
                                    : 'bg-white text-gray-500 border-gray-100 hover:border-[#0078db]/30 hover:text-[#0078db]'
                                }`}
                              >
                                {skill}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-10">
                    <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-3">Resume Upload</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                      />
                      <div className={`p-8 border-2 border-dashed rounded-[24px] transition-all text-center ${resumeFile ? 'border-green-400 bg-green-50/30' : 'border-gray-200 bg-gray-50 group-hover:border-[#0078db]/50'}`}>
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                          <Upload className={resumeFile ? 'text-green-500' : 'text-[#0078db]'} size={32} />
                        </div>
                        <h4 className="font-bold text-gray-700 mb-1">
                          {resumeFile ? resumeFile.name : 'Choose a file or drag it here'}
                        </h4>
                        <p className="text-gray-400 text-sm">PDF, DOC, DOCX up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" required className="w-5 h-5 rounded border-gray-300 text-[#0078db] focus:ring-[#0078db]" />
                      <span className="text-[13px] text-gray-500 group-hover:text-gray-700">I agree to the terms of service and privacy policy of InternRecruit Careers.</span>
                    </label>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#0078db] hover:bg-[#0069c0] text-white px-8 py-5 rounded-[24px] font-bold text-lg active:scale-[0.98] transition-all shadow-xl shadow-[#0078db]/20 flex justify-center items-center gap-3 disabled:opacity-70 mt-4"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle size={24} />}
                      {isSubmitting ? 'Sending Application...' : 'Send Application Now'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
