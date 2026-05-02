import { useState, useEffect } from 'react';
import { BookOpen, Calendar as CalendarIcon, User, CheckCircle, XCircle, Loader2, ChevronDown } from 'lucide-react';
import api from '../api';

export default function Inductions() {
  const [inductions, setInductions] = useState([]);
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [newInduction, setNewInduction] = useState({
    candidateId: '',
    teamAssigned: '',
    onboardingDate: '',
    mentor: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [indRes, testRes] = await Promise.all([
        fetch(api.inductions),
        fetch(api.tests)
      ]);
      const indData = await indRes.json();
      const testData = await testRes.json();
      
      setInductions(indData);
      // We only want candidates who have completed the test and have a team assigned
      setTests(testData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCandidateChange = (candidateId) => {
    const selectedTest = tests.find(t => t.candidateId?._id === candidateId);
    setNewInduction({
      ...newInduction,
      candidateId,
      teamAssigned: selectedTest ? selectedTest.assignedTeam : ''
    });
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(api.inductions, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInduction),
      });
      if (res.ok) {
        fetchData();
        setIsScheduleModalOpen(false);
        setNewInduction({ candidateId: '', teamAssigned: '', onboardingDate: '', mentor: '' });
      }
    } catch (error) {
      console.error('Error scheduling induction:', error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${api.inductions}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const statusColors = {
    'Scheduled': 'bg-blue-50 text-blue-700 border-blue-200',
    'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <div className="p-10 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-[32px] font-black text-apple-text tracking-tight mb-1">Onboarding & Induction</h1>
          <p className="text-apple-text-secondary font-medium">Manage the transition of selected candidates into their respective teams.</p>
        </div>
        <button 
          onClick={() => setIsScheduleModalOpen(true)}
          className="bg-gradient-to-r from-[#0078db] to-[#0069c0] hover:scale-105 active:scale-[0.98] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-[#0078db]/20"
        >
          <BookOpen size={24} />
          Schedule Induction
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-gray-400">
          <Loader2 className="animate-spin text-[#0078db]" size={48} />
          <p className="font-bold uppercase tracking-widest text-[12px]">Preparing onboarding dashboard...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] shadow-sm border border-apple-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-[12px] font-black text-gray-400 uppercase tracking-[2px]">
                  <th className="py-5 px-8">New Hire</th>
                  <th className="py-5 px-8">Team Assignment</th>
                  <th className="py-5 px-8">Onboarding Schedule</th>
                  <th className="py-5 px-8">Status</th>
                  <th className="py-5 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {inductions.map((induction) => (
                  <tr key={induction._id} className="hover:bg-[#fcfdff] transition-all group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-emerald-600 font-black text-lg border border-white shadow-sm">
                          {induction.candidateId?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="font-bold text-apple-text text-[16px] group-hover:text-[#0078db] transition-colors">{induction.candidateId?.name || 'Unknown'}</div>
                          <div className="text-[13px] text-gray-400 font-medium">{induction.candidateId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="font-bold text-gray-700">{induction.teamAssigned}</div>
                      <div className="text-[12px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1">
                        <User size={14} className="text-blue-400" /> Mentor: {induction.mentor}
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-2.5 text-[14px] text-gray-600 font-medium">
                        <CalendarIcon size={16} className="text-[#0078db]" />
                        {new Date(induction.onboardingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[2px] border-2 ${statusColors[induction.status]}`}>
                        {induction.status}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div className="relative inline-block text-left">
                        <select 
                          value={induction.status}
                          onChange={(e) => updateStatus(induction._id, e.target.value)}
                          className="pl-4 pr-10 py-2 rounded-xl text-[12px] font-bold border-2 border-gray-100 bg-white cursor-pointer appearance-none focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/20 transition-all"
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                      </div>
                    </td>
                  </tr>
                ))}
                {inductions.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen size={32} className="text-gray-200" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800">No inductions scheduled</h4>
                      <p className="text-gray-400 font-medium">Initiate the onboarding process for your selected candidates.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Induction Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-[#f8f9ff]">
              <div>
                <span className="text-[12px] font-black text-[#0078db] uppercase tracking-[3px] mb-1 block">Onboarding</span>
                <h2 className="text-[28px] font-black text-[#333] tracking-tight">Initiate Induction</h2>
              </div>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors bg-white p-3 rounded-full shadow-sm border border-gray-100">
                <XCircle size={28} />
              </button>
            </div>
            <form onSubmit={handleSchedule} className="p-10">
              <div className="space-y-8">
                <div>
                  <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">New Hire Profile</label>
                  <select 
                    required
                    value={newInduction.candidateId}
                    onChange={(e) => handleCandidateChange(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-medium text-[16px] appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select from qualified candidates</option>
                    {tests.map(t => t.candidateId && (
                      <option key={t.candidateId._id} value={t.candidateId._id}>
                        {t.candidateId.name} — {t.candidateId.role} ({t.assignedTeam})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">Assigned Team</label>
                    <input 
                      readOnly
                      type="text" 
                      value={newInduction.teamAssigned}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-gray-400 cursor-not-allowed font-medium text-[16px]"
                      placeholder="Verified from assessments"
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">Start Date</label>
                    <input 
                      required
                      type="date" 
                      value={newInduction.onboardingDate}
                      onChange={(e) => setNewInduction({...newInduction, onboardingDate: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-medium text-[16px]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">Mentorship Assignment</label>
                  <input 
                    required
                    type="text" 
                    value={newInduction.mentor}
                    onChange={(e) => setNewInduction({...newInduction, mentor: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-medium text-[16px]"
                    placeholder="Enter mentor's full name"
                  />
                </div>
              </div>
              <div className="mt-12 flex justify-end gap-4 border-t border-gray-100 pt-8">
                <button 
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="bg-[#0078db] hover:bg-[#0069c0] text-white px-10 py-4 rounded-2xl font-bold active:scale-[0.98] transition-all flex items-center gap-2 shadow-xl shadow-[#0078db]/20"
                >
                  <CheckCircle size={24} />
                  Initiate Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
