import { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle, XCircle, Loader2, User, ChevronDown } from 'lucide-react';

export default function Emails() {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    candidateId: '',
    type: 'selection',
    subject: '',
    message: ''
  });

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/candidates');
      const data = await res.json();
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateChange = (type) => {
    const candidate = candidates.find(c => c._id === emailData.candidateId);
    const name = candidate ? candidate.name : '[Candidate Name]';
    const role = candidate ? candidate.role : '[Role]';

    if (type === 'selection') {
      setEmailData({
        ...emailData,
        type,
        subject: `Offer of Internship: ${role} at InternRecruit`,
        message: `Dear ${name},\n\nWe are absolutely thrilled to offer you the position of ${role} at our company! Your performance during the interviews and tasks was outstanding.\n\nOur HR team will reach out shortly with your official offer letter and induction schedule.\n\nWelcome to the team!\n\nBest regards,\nThe InternRecruit Team`
      });
    } else {
      setEmailData({
        ...emailData,
        type,
        subject: `Update on your application for ${role}`,
        message: `Dear ${name},\n\nThank you for taking the time to apply and interview for the ${role} position. We appreciate your interest in our company.\n\nWhile your background is impressive, we have decided to move forward with other candidates whose qualifications more closely match our current needs.\n\nWe wish you the best of luck in your future endeavors.\n\nBest regards,\nThe InternRecruit Team`
      });
    }
  };

  // Trigger template update when candidate changes if a type is already selected
  const handleCandidateChange = (candidateId) => {
    setEmailData({ ...emailData, candidateId });
    // setTimeout to allow state to settle, then update template with new name
    setTimeout(() => {
      if (emailData.type) {
        // Mock a direct call to handleTemplateChange logic
        const candidate = candidates.find(c => c._id === candidateId);
        const name = candidate ? candidate.name : '[Candidate Name]';
        const role = candidate ? candidate.role : '[Role]';
        
        if (emailData.type === 'selection') {
          setEmailData(prev => ({
            ...prev,
            candidateId,
            subject: `Offer of Internship: ${role} at InternRecruit`,
            message: `Dear ${name},\n\nWe are absolutely thrilled to offer you the position of ${role} at our company! Your performance during the interviews and tasks was outstanding.\n\nOur HR team will reach out shortly with your official offer letter and induction schedule.\n\nWelcome to the team!\n\nBest regards,\nThe InternRecruit Team`
          }));
        } else {
          setEmailData(prev => ({
            ...prev,
            candidateId,
            subject: `Update on your application for ${role}`,
            message: `Dear ${name},\n\nThank you for taking the time to apply and interview for the ${role} position. We appreciate your interest in our company.\n\nWhile your background is impressive, we have decided to move forward with other candidates whose qualifications more closely match our current needs.\n\nWe wish you the best of luck in your future endeavors.\n\nBest regards,\nThe InternRecruit Team`
          }));
        }
      }
    }, 0);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccessMsg(data.message);
        setIsComposeOpen(false);
        setEmailData({ candidateId: '', type: 'selection', subject: '', message: '' });
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-[32px] font-black text-apple-text tracking-tight mb-1">Communications</h1>
          <p className="text-apple-text-secondary font-medium">Draft and dispatch official correspondence to your candidate pipeline.</p>
        </div>
        <button 
          onClick={() => {
            setIsComposeOpen(true);
            setEmailData({ candidateId: '', type: 'selection', subject: '', message: '' });
          }}
          className="bg-gradient-to-r from-[#0078db] to-[#0069c0] hover:scale-105 active:scale-[0.98] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-[#0078db]/20"
        >
          <Mail size={24} />
          Compose Notification
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle size={20} />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-gray-400">
          <Loader2 className="animate-spin text-[#0078db]" size={48} />
          <p className="font-bold uppercase tracking-widest text-[12px]">Opening directory...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] shadow-sm border border-apple-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-[12px] font-black text-gray-400 uppercase tracking-[2px]">
                  <th className="py-5 px-8">Recipient</th>
                  <th className="py-5 px-8">Target Role</th>
                  <th className="py-5 px-8">Current Pipeline Status</th>
                  <th className="py-5 px-8 text-right">Draft Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {candidates.map((candidate) => (
                  <tr key={candidate._id} className="hover:bg-[#fcfdff] transition-all group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-[#0078db] font-black text-lg border border-white shadow-sm">
                          {candidate.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="font-bold text-apple-text text-[16px] group-hover:text-[#0078db] transition-colors">{candidate.name}</div>
                          <div className="text-[13px] text-gray-400 font-medium">{candidate.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="font-bold text-gray-700 text-[14px]">{candidate.role}</div>
                    </td>
                    <td className="py-6 px-8">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[2px] border-2 ${
                        candidate.status === 'Selected' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        candidate.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                        'bg-gray-50 text-gray-400 border-gray-100'
                      }`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <button 
                        onClick={() => {
                          setEmailData({ ...emailData, candidateId: candidate._id });
                          setIsComposeOpen(true);
                        }}
                        className="bg-gray-50 hover:bg-[#0078db] hover:text-white text-gray-500 px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all inline-flex items-center gap-2 group-hover:scale-105"
                      >
                        <Send size={14} /> Compose
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isComposeOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]">
            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-[#f8f9ff]">
              <div>
                <span className="text-[12px] font-black text-[#0078db] uppercase tracking-[3px] mb-1 block">Messenger</span>
                <h2 className="text-[28px] font-black text-[#333] tracking-tight">Compose Notification</h2>
              </div>
              <button onClick={() => setIsComposeOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors bg-white p-3 rounded-full shadow-sm border border-gray-100">
                <XCircle size={28} />
              </button>
            </div>
            
            <form onSubmit={handleSendEmail} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-10 space-y-10 overflow-y-auto">
                <div className="grid grid-cols-2 gap-10">
                  <div>
                    <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-3">Recipient</label>
                    <div className="relative inline-block w-full text-left">
                      <select 
                        required
                        value={emailData.candidateId}
                        onChange={(e) => handleCandidateChange(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-medium text-[16px] appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select a candidate...</option>
                        {candidates.map(c => (
                          <option key={c._id} value={c._id}>{c.name} — {c.status}</option>
                        ))}
                      </select>
                      <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-3">Communication Type</label>
                    <div className="flex gap-4">
                      {['selection', 'rejection'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          disabled={!emailData.candidateId}
                          onClick={() => handleTemplateChange(type)}
                          className={`flex-1 py-4 rounded-2xl font-bold text-[12px] uppercase tracking-wider border-2 transition-all ${
                            emailData.type === type 
                              ? (type === 'selection' ? 'bg-[#0078db] text-white border-[#0078db] shadow-lg shadow-blue-500/20' : 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-500/20')
                              : 'bg-white text-gray-400 border-gray-100 hover:border-blue-200'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {type === 'selection' ? 'Offer / Selection' : 'Rejection Letter'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-3">Subject Line</label>
                  <input 
                    required
                    type="text" 
                    value={emailData.subject}
                    onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-bold text-[18px] text-gray-700"
                    placeholder="Invitation for Internship..."
                    disabled={!emailData.candidateId}
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-3">Message Content</label>
                  <textarea 
                    required
                    rows="10"
                    value={emailData.message}
                    onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                    className="w-full px-8 py-8 rounded-3xl border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-medium text-[16px] leading-relaxed resize-none text-gray-600"
                    placeholder="Draft your message here..."
                    disabled={!emailData.candidateId}
                  />
                </div>
              </div>
              
              <div className="p-10 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
                <div className="flex items-center gap-3 text-gray-400 font-bold text-[12px] uppercase tracking-wider">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Real-time synchronization enabled
                </div>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsComposeOpen(false)}
                    className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSending || !emailData.candidateId}
                    className="bg-[#0078db] hover:bg-[#0069c0] text-white px-10 py-4 rounded-2xl font-bold active:scale-[0.98] transition-all flex items-center gap-3 shadow-xl shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <>
                        <Loader2 size={24} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={24} />
                        <span>Dispatch Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
