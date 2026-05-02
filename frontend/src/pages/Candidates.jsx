import { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, CheckCircle, XCircle, Loader2, Upload, FileText, Trash2, ChevronDown, Users, Link as LinkIcon } from 'lucide-react';

export default function Candidates() {
  const [roleSkills, setRoleSkills] = useState({});

  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [resumeFilter, setResumeFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candRes, jobsRes] = await Promise.all([
          fetch('http://localhost:5000/api/candidates'),
          fetch('http://localhost:5000/api/jobs')
        ]);
        const candData = await candRes.json();
        const jobsData = await jobsRes.json();
        
        setCandidates(candData);
        setJobs(jobsData);
        
        const mapping = {};
        jobsData.forEach(job => {
          mapping[job.title] = job.skills;
        });
        setRoleSkills(mapping);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateMatchScore = (candidate) => {
    const required = roleSkills[candidate.role];
    if (!required || !candidate.skills || candidate.skills.length === 0) return 0;
    const matchCount = candidate.skills.filter(s => required.includes(s)).length;
    return Math.round((matchCount / required.length) * 100);
  };

  const fetchCandidates = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/candidates');
      const data = await res.json();
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setCandidates(candidates.map(c => c._id === id ? { ...c, status: newStatus } : c));
    try {
      await fetch(`http://localhost:5000/api/candidates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (error) {
      console.error('Error updating status:', error);
      fetchCandidates();
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (!window.confirm('Are you sure you want to permanently remove this candidate?')) return;
    
    // Optimistic UI update
    const previousCandidates = [...candidates];
    setCandidates(candidates.filter(c => c._id !== id));

    try {
      const res = await fetch(`http://localhost:5000/api/candidates/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete');
    } catch (error) {
      console.error('Error deleting candidate:', error);
      setCandidates(previousCandidates); // Revert on failure
    }
  };

  const statusColors = {
    'Applied': 'bg-blue-50 text-blue-600 border-blue-100',
    'Shortlisted': 'bg-purple-50 text-purple-600 border-purple-100',
    'Interview': 'bg-amber-50 text-amber-600 border-amber-100',
    'Selected': 'bg-green-50 text-green-600 border-green-100',
    'Rejected': 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <div className="p-10 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-[32px] font-black text-apple-text tracking-tight">Candidates Dashboard</h1>
          <p className="text-apple-text-secondary font-medium mt-1">Review, manage, and disposition your incoming talent pool.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-apple-border/50 mb-8 flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, email or skills..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all text-[15px] font-medium"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-5 py-3.5 rounded-2xl border border-gray-100 bg-white text-[14px] font-bold text-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer shadow-sm"
          >
            <option value="All">All Applied Roles</option>
            {[...new Set(jobs.map(j => j.title))].map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-5 py-3.5 rounded-2xl border border-gray-100 bg-white text-[14px] font-bold text-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer shadow-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select 
            value={resumeFilter}
            onChange={(e) => setResumeFilter(e.target.value)}
            className="px-5 py-3.5 rounded-2xl border border-gray-100 bg-white text-[14px] font-bold text-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer shadow-sm"
          >
            <option value="All">Resume Status</option>
            <option value="Yes">With Resume</option>
            <option value="No">No Resume</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-apple-border/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-[12px] font-black text-gray-400 uppercase tracking-[2px]">
              <th className="py-5 px-8">Candidate Information</th>
              <th className="py-5 px-8">Applied Role & Match</th>
              <th className="py-5 px-8">Resume & Profile</th>
              <th className="py-5 px-8">Status</th>
              <th className="py-5 px-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                    <p className="font-bold text-gray-400">Loading your talent pool...</p>
                  </div>
                </td>
              </tr>
            ) : candidates
                .filter(c => 
                  (roleFilter === 'All' || c.role === roleFilter) &&
                  (statusFilter === 'All' || c.status === statusFilter) &&
                  (resumeFilter === 'All' || (resumeFilter === 'Yes' ? !!c.resumeUrl : !c.resumeUrl)) &&
                  (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())))
                )
                .map((candidate) => (
              <tr key={candidate._id} className="hover:bg-[#fcfdff] transition-all group">
                <td className="py-6 px-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-[#0078db] font-black text-lg border border-white shadow-sm">
                      {candidate.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-apple-text text-[17px] group-hover:text-[#0078db] transition-colors">{candidate.name}</div>
                      <div className="text-[13px] text-gray-500 font-medium">{candidate.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-6 px-8">
                  <div className="font-bold text-gray-700 mb-2">{candidate.role}</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 max-w-[120px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          calculateMatchScore(candidate) >= 80 ? 'bg-green-500' : 
                          calculateMatchScore(candidate) >= 50 ? 'bg-amber-400' : 'bg-gray-300'
                        }`}
                        style={{ width: `${calculateMatchScore(candidate)}%` }}
                      ></div>
                    </div>
                    <span className={`text-[12px] font-black ${
                      calculateMatchScore(candidate) >= 80 ? 'text-green-600' : 
                      calculateMatchScore(candidate) >= 50 ? 'text-amber-500' : 'text-gray-400'
                    }`}>
                      {calculateMatchScore(candidate)}% Match
                    </span>
                  </div>
                </td>
                <td className="py-6 px-8">
                  <div className="flex flex-col gap-2">
                    {candidate.resumeUrl && (
                      <a 
                        href={candidate.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-blue-50 text-[#0078db] hover:bg-[#0078db] hover:text-white px-4 py-2 rounded-xl font-bold text-[11px] flex items-center gap-2 transition-all w-fit shadow-sm shadow-blue-100/50"
                      >
                        <FileText size={14} /> Resume
                      </a>
                    )}
                    {candidate.linkedinUrl && (
                      <a 
                        href={candidate.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-[#0a66c2]/10 text-[#0a66c2] hover:bg-[#0a66c2] hover:text-white px-4 py-2 rounded-xl font-bold text-[11px] flex items-center gap-2 transition-all w-fit shadow-sm shadow-blue-100/50"
                      >
                        <LinkIcon size={14} /> LinkedIn Profile
                      </a>
                    )}
                    {!candidate.resumeUrl && !candidate.linkedinUrl && (
                      <span className="flex items-center gap-2 text-gray-300 text-[10px] font-black uppercase tracking-wider">
                        <XCircle size={14} /> Resume Missing
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-6 px-8">
                  <div className="relative w-fit">
                    <select 
                      value={candidate.status}
                      onChange={(e) => handleStatusChange(candidate._id, e.target.value)}
                      className={`pl-4 pr-10 py-2 rounded-full text-[11px] font-black uppercase tracking-wider border-2 cursor-pointer focus:outline-none transition-all appearance-none ${statusColors[candidate.status]}`}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview">Interview</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                  </div>
                </td>
                <td className="py-6 px-8 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {candidate.status === 'Applied' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(candidate._id, 'Shortlisted')}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20"
                        >
                          Shortlist
                        </button>
                        <button 
                          onClick={() => handleStatusChange(candidate._id, 'Rejected')}
                          className="bg-white hover:bg-red-50 text-red-500 border border-red-100 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleDeleteCandidate(candidate._id)}
                      className="text-gray-300 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all ml-1"
                      title="Delete Permanently"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && candidates.length === 0 && (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="text-gray-200" size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800">No matching candidates found</h4>
                  <p className="text-gray-400">Try broadening your search or filter criteria</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
