import { useState, useEffect } from 'react';
import { Briefcase, Plus, Search, MoreVertical, XCircle, CheckCircle, Loader2, Trash2, ChevronDown } from 'lucide-react';

const COMMON_SKILLS = [
  'React', 'JavaScript', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 
  'Python', 'SQL', 'Machine Learning', 'Data Science', 'Figma', 
  'UI/UX', 'CSS', 'HTML', 'Git', 'AWS'
];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '', department: 'Engineering', location: 'Remote', description: '', skills: []
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/jobs/all');
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });
      if (res.ok) {
        fetchJobs();
        setIsAddModalOpen(false);
        setNewJob({ title: '', department: 'Engineering', location: 'Remote', description: '', skills: [] });
      }
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchJobs();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${id}`, { method: 'DELETE' });
      if (res.ok) fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const toggleSkill = (skill) => {
    setNewJob(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill) 
        : [...prev.skills, skill]
    }));
  };

  return (
    <div className="p-10 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-[32px] font-black text-apple-text tracking-tight mb-1">Job Postings</h1>
          <p className="text-apple-text-secondary font-medium">Manage your active internship listings and requirements.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-[#0078db] to-[#0069c0] hover:scale-105 active:scale-[0.98] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-[#0078db]/20"
        >
          <Plus size={24} />
          Post New Role
        </button>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-apple-border/50 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by role title, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all text-[14px] font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[12px] font-black text-gray-400 uppercase tracking-[2px]">
                <th className="py-5 px-8">Role & Department</th>
                <th className="py-5 px-8">Required Competencies</th>
                <th className="py-5 px-8">Status</th>
                <th className="py-5 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan="4" className="py-20 text-center"><Loader2 className="animate-spin text-blue-500 mx-auto" size={40} /></td></tr>
              ) : jobs.filter(j => j.title.toLowerCase().includes(searchQuery.toLowerCase())).map((job) => (
                <tr key={job._id} className="hover:bg-[#fcfdff] transition-all group">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0078db] border border-white shadow-sm">
                        <Briefcase size={24} />
                      </div>
                      <div>
                        <div className="font-bold text-apple-text text-[16px] group-hover:text-[#0078db] transition-colors">{job.title}</div>
                        <div className="text-[13px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{job.department} • {job.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex gap-1.5 flex-wrap max-w-[300px]">
                      {job.skills.map(s => (
                        <span key={s} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-[11px] font-bold border border-gray-100">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="relative w-fit">
                      <select 
                        value={job.status}
                        onChange={(e) => handleStatusChange(job._id, e.target.value)}
                        className={`pl-4 pr-10 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 cursor-pointer appearance-none transition-all ${job.status === 'Open' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-100 text-gray-500 border-gray-200'}`}
                      >
                        <option value="Open">Active</option>
                        <option value="Closed">Closed</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                    </div>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <button 
                      onClick={() => handleDelete(job._id)} 
                      className="text-gray-300 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all ml-1"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && jobs.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="text-gray-200" size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-gray-800">No active job postings</h4>
                    <p className="text-gray-400">Launch a new recruitment campaign to see it here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-[#f8f9ff]">
              <div>
                <span className="text-[12px] font-black text-[#0078db] uppercase tracking-[3px] mb-1 block">Recruitment</span>
                <h2 className="text-[28px] font-black text-[#333] tracking-tight">Post New Internship</h2>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors bg-white p-3 rounded-full shadow-sm border border-gray-100">
                <XCircle size={28} />
              </button>
            </div>
            <form onSubmit={handleAddJob} className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">Role Title</label>
                    <input 
                      required 
                      type="text" 
                      value={newJob.title} 
                      onChange={(e) => setNewJob({...newJob, title: e.target.value})} 
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-medium text-[16px]" 
                      placeholder="e.g. AWS Developer Intern" 
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">Department</label>
                    <input 
                      required 
                      type="text" 
                      value={newJob.department} 
                      onChange={(e) => setNewJob({...newJob, department: e.target.value})} 
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-medium text-[16px]" 
                      placeholder="e.g. Cloud Engineering" 
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">Location</label>
                    <input 
                      required 
                      type="text" 
                      value={newJob.location} 
                      onChange={(e) => setNewJob({...newJob, location: e.target.value})} 
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-medium text-[16px]" 
                      placeholder="e.g. Remote / NYC" 
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">Skills Required</label>
                    <div className="flex flex-wrap gap-2 pt-1 max-h-32 overflow-y-auto custom-scrollbar p-2 bg-white rounded-xl border border-gray-50">
                      {COMMON_SKILLS.map(skill => {
                        const isSelected = newJob.skills.includes(skill);
                        return (
                          <button 
                            type="button" 
                            key={skill} 
                            onClick={() => toggleSkill(skill)} 
                            className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all border-2 ${isSelected ? 'bg-[#0078db] text-white border-[#0078db] shadow-md shadow-blue-500/20' : 'bg-white text-gray-500 border-gray-50 hover:border-blue-500/30 hover:text-blue-500'}`}
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
                <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  required 
                  rows="4" 
                  value={newJob.description} 
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})} 
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-medium text-[16px] resize-none" 
                  placeholder="What will the intern work on?" 
                />
              </div>

              <div className="pt-8 border-t border-gray-100 flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="px-8 py-4 rounded-[20px] font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="bg-[#0078db] hover:bg-[#0069c0] text-white px-10 py-4 rounded-[20px] font-bold active:scale-[0.98] transition-all flex items-center gap-2 shadow-xl shadow-[#0078db]/20"
                >
                  <CheckCircle size={24} />
                  Publish Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
