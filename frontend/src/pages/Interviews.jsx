import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, FileText, CheckCircle, XCircle, Loader2, ChevronDown } from 'lucide-react';

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [newInterview, setNewInterview] = useState({
    candidateId: '',
    date: '',
    time: '',
    interviewer: ''
  });

  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, interviewId: null, feedback: '', status: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [intRes, candRes] = await Promise.all([
        fetch('http://localhost:5000/api/interviews'),
        fetch('http://localhost:5000/api/candidates')
      ]);
      const intData = await intRes.json();
      const candData = await candRes.json();
      
      setInterviews(intData);
      setCandidates(candData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInterview),
      });
      if (res.ok) {
        fetchData();
        setIsScheduleModalOpen(false);
        setNewInterview({ candidateId: '', date: '', time: '', interviewer: '' });
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
    }
  };

  const handleUpdateFeedback = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/interviews/${feedbackModal.interviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          feedback: feedbackModal.feedback, 
          status: feedbackModal.status 
        }),
      });
      if (res.ok) {
        fetchData();
        setFeedbackModal({ isOpen: false, interviewId: null, feedback: '', status: '' });
      }
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  const statusColors = {
    'Scheduled': 'bg-blue-50 text-blue-700 border-blue-200',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Cancelled': 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="p-10 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-[32px] font-black text-apple-text tracking-tight mb-1">Interview Sessions</h1>
          <p className="text-apple-text-secondary font-medium">Coordinate and record outcomes for candidate assessments.</p>
        </div>
        <button 
          onClick={() => setIsScheduleModalOpen(true)}
          className="bg-gradient-to-r from-[#0078db] to-[#0069c0] hover:scale-105 active:scale-[0.98] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-[#0078db]/20"
        >
          <CalendarIcon size={24} />
          Schedule Session
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-gray-400">
          <Loader2 className="animate-spin text-[#0078db]" size={48} />
          <p className="font-bold uppercase tracking-widest text-[12px]">Retrieving schedule...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {interviews.map((interview) => (
            <div key={interview._id} className="bg-white rounded-[32px] shadow-sm border border-apple-border/50 overflow-hidden flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="p-8 pb-4 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-[#0078db] font-black text-xl border border-white shadow-sm">
                    {interview.candidateId?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="font-black text-apple-text text-lg group-hover:text-[#0078db] transition-colors line-clamp-1">{interview.candidateId?.name || 'Unknown Candidate'}</h3>
                    <p className="text-[13px] text-gray-500 font-bold uppercase tracking-wider">{interview.candidateId?.role || 'Unknown Role'}</p>
                  </div>
                </div>
              </div>
              
              <div className="px-8 py-6 space-y-4 flex-1">
                <div className="flex items-center gap-4 text-[14px] text-gray-600 font-medium">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                    <CalendarIcon size={18} />
                  </div>
                  <span>{new Date(interview.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-4 text-[14px] text-gray-600 font-medium">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                    <Clock size={18} />
                  </div>
                  <span>{interview.time}</span>
                </div>
                <div className="flex items-center gap-4 text-[14px] text-gray-600 font-medium">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                    <User size={18} />
                  </div>
                  <span>Panel: <span className="text-apple-text font-bold">{interview.interviewer}</span></span>
                </div>
                
                {interview.feedback && (
                  <div className="mt-6 p-5 bg-[#f8f9ff] rounded-2xl border border-blue-50 relative">
                    <FileText size={16} className="absolute -top-2 -left-2 text-[#0078db] bg-white rounded-full p-0.5 shadow-sm" />
                    <p className="text-gray-600 text-[13px] leading-relaxed italic">"{interview.feedback}"</p>
                  </div>
                )}
              </div>

              <div className="p-8 pt-4">
                <div className="flex items-center justify-between mb-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[2px] ${statusColors[interview.status]}`}>
                    {interview.status}
                  </span>
                </div>
                <button 
                  onClick={() => setFeedbackModal({ 
                    isOpen: true, 
                    interviewId: interview._id, 
                    feedback: interview.feedback || '', 
                    status: interview.status 
                  })}
                  className="w-full py-4 bg-gray-50 hover:bg-[#0078db] hover:text-white text-gray-600 rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all shadow-inner active:scale-[0.98]"
                >
                  {interview.status === 'Scheduled' ? 'Record Outcome' : 'Modify Feedback'}
                </button>
              </div>
            </div>
          ))}

          {!isLoading && interviews.length === 0 && (
            <div className="col-span-full py-32 text-center bg-white rounded-[40px] border-4 border-dashed border-gray-50">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarIcon size={40} className="text-gray-200" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">No interviews scheduled</h3>
              <p className="text-gray-400 font-medium mb-8">Start assessing your talent by scheduling their first session.</p>
              <button 
                onClick={() => setIsScheduleModalOpen(true)}
                className="bg-[#0078db] text-white px-8 py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest shadow-xl shadow-blue-500/20"
              >
                Create First Session
              </button>
            </div>
          )}
        </div>
      )}

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-[#f8f9ff]">
              <div>
                <span className="text-[12px] font-black text-[#0078db] uppercase tracking-[3px] mb-1 block">Coordination</span>
                <h2 className="text-[28px] font-black text-[#333] tracking-tight">Schedule Interview</h2>
              </div>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors bg-white p-3 rounded-full shadow-sm border border-gray-100">
                <XCircle size={28} />
              </button>
            </div>
            <form onSubmit={handleSchedule} className="p-10">
              <div className="space-y-8">
                <div>
                  <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">Target Candidate</label>
                  <select 
                    required
                    value={newInterview.candidateId}
                    onChange={(e) => setNewInterview({...newInterview, candidateId: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-medium text-[16px] appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Choose from shortlisted pool</option>
                    {candidates.filter(c => c.status === 'Shortlisted').map(c => (
                      <option key={c._id} value={c._id}>{c.name} — {c.role}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">Session Date</label>
                    <input 
                      required
                      type="date" 
                      value={newInterview.date}
                      onChange={(e) => setNewInterview({...newInterview, date: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-medium text-[16px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">Session Time</label>
                    <input 
                      required
                      type="time" 
                      value={newInterview.time}
                      onChange={(e) => setNewInterview({...newInterview, time: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-medium text-[16px]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">Interviewer Panel</label>
                  <input 
                    required
                    type="text" 
                    value={newInterview.interviewer}
                    onChange={(e) => setNewInterview({...newInterview, interviewer: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-medium text-[16px]"
                    placeholder="e.g. Technical Team Lead"
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
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-[#f8f9ff]">
              <div>
                <span className="text-[12px] font-black text-[#0078db] uppercase tracking-[3px] mb-1 block">Assessment</span>
                <h2 className="text-[28px] font-black text-[#333] tracking-tight">Interview Outcome</h2>
              </div>
              <button onClick={() => setFeedbackModal({ isOpen: false, interviewId: null, feedback: '', status: '' })} className="text-gray-400 hover:text-gray-600 transition-colors bg-white p-3 rounded-full shadow-sm border border-gray-100">
                <XCircle size={28} />
              </button>
            </div>
            <form onSubmit={handleUpdateFeedback} className="p-10">
              <div className="space-y-8">
                <div>
                  <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">Final Status</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['Scheduled', 'Completed', 'Cancelled'].map((stat) => (
                      <button
                        key={stat}
                        type="button"
                        onClick={() => setFeedbackModal({...feedbackModal, status: stat})}
                        className={`py-3 rounded-2xl font-bold text-[12px] uppercase tracking-wider border-2 transition-all ${
                          feedbackModal.status === stat 
                            ? 'bg-[#0078db] text-white border-[#0078db] shadow-lg shadow-blue-500/20' 
                            : 'bg-white text-gray-500 border-gray-100 hover:border-blue-200'
                        }`}
                      >
                        {stat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">Interview Notes & Feedback</label>
                  <textarea 
                    rows="5"
                    value={feedbackModal.feedback}
                    onChange={(e) => setFeedbackModal({...feedbackModal, feedback: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-medium text-[16px] resize-none"
                    placeholder="How did the candidate perform? Highlight key strengths and areas of concern..."
                  />
                </div>
              </div>
              <div className="mt-12 flex justify-end gap-4 border-t border-gray-100 pt-8">
                <button 
                  type="button"
                  onClick={() => setFeedbackModal({ isOpen: false, interviewId: null, feedback: '', status: '' })}
                  className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="bg-[#0078db] hover:bg-[#0069c0] text-white px-10 py-4 rounded-2xl font-bold active:scale-[0.98] transition-all flex items-center gap-2 shadow-xl shadow-[#0078db]/20"
                >
                  <CheckCircle size={24} />
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
