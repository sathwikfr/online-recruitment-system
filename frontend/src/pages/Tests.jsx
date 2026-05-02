import { useState, useEffect } from 'react';
import { PenTool, CheckCircle, XCircle, Award, FileText, Loader2, Users } from 'lucide-react';

export default function Tests() {
  const [tests, setTests] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isEvaluateModalOpen, setIsEvaluateModalOpen] = useState(false);
  const [newTest, setNewTest] = useState({
    candidateId: '',
    testScore: '',
    evaluationNotes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [testRes, candRes] = await Promise.all([
        fetch('http://localhost:5000/api/tests'),
        fetch('http://localhost:5000/api/candidates')
      ]);
      const testData = await testRes.json();
      const candData = await candRes.json();
      
      setTests(testData);
      setCandidates(candData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTest),
      });
      if (res.ok) {
        fetchData();
        setIsEvaluateModalOpen(false);
        setNewTest({ candidateId: '', testScore: '', evaluationNotes: '' });
      }
    } catch (error) {
      console.error('Error evaluating test:', error);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    return 'text-amber-600 bg-amber-50';
  };

  return (
    <div className="p-10 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-[32px] font-black text-apple-text tracking-tight mb-1">Assessments & Tasks</h1>
          <p className="text-apple-text-secondary font-medium">Evaluate technical submissions and determine team placements.</p>
        </div>
        <button 
          onClick={() => setIsEvaluateModalOpen(true)}
          className="bg-gradient-to-r from-[#0078db] to-[#0069c0] hover:scale-105 active:scale-[0.98] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-[#0078db]/20"
        >
          <PenTool size={24} />
          Evaluate Results
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-gray-400">
          <Loader2 className="animate-spin text-[#0078db]" size={48} />
          <p className="font-bold uppercase tracking-widest text-[12px]">Processing grades...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] shadow-sm border border-apple-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-[12px] font-black text-gray-400 uppercase tracking-[2px]">
                  <th className="py-5 px-8">Candidate Profile</th>
                  <th className="py-5 px-8 text-center">Score</th>
                  <th className="py-5 px-8">Assignment</th>
                  <th className="py-5 px-8">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tests.map((test) => (
                  <tr key={test._id} className="hover:bg-[#fcfdff] transition-all group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-indigo-600 font-black text-lg border border-white shadow-sm">
                          {test.candidateId?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="font-bold text-apple-text text-[16px] group-hover:text-[#0078db] transition-colors">{test.candidateId?.name || 'Unknown Candidate'}</div>
                          <div className="text-[13px] text-gray-400 font-bold uppercase tracking-wider">{test.candidateId?.role || 'Unknown Role'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex justify-center">
                        <div className={`flex items-center justify-center h-14 w-14 rounded-2xl font-black text-lg border-2 shadow-sm ${getScoreColor(test.testScore).replace('text-', 'text-').replace('bg-', 'bg-').split(' ')[0]} ${getScoreColor(test.testScore).split(' ')[1]} border-white`}>
                          {test.testScore}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0078db]">
                          <Users size={16} />
                        </div>
                        <span className="font-bold text-gray-700">{test.assignedTeam}</span>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <p className="text-[13px] text-gray-600 font-medium leading-relaxed italic">
                          {test.evaluationNotes ? `"${test.evaluationNotes}"` : 'No qualitative data.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
                {tests.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-24 text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award size={32} className="text-gray-200" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800">No assessments recorded</h4>
                      <p className="text-gray-400 font-medium">Results will appear here once candidates complete their tasks.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isEvaluateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-[#f8f9ff]">
              <div>
                <span className="text-[12px] font-black text-[#0078db] uppercase tracking-[3px] mb-1 block">Assessment</span>
                <h2 className="text-[28px] font-black text-[#333] tracking-tight">Evaluate Performance</h2>
              </div>
              <button onClick={() => setIsEvaluateModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors bg-white p-3 rounded-full shadow-sm border border-gray-100">
                <XCircle size={28} />
              </button>
            </div>
            <form onSubmit={handleEvaluate} className="p-10">
              <div className="space-y-8">
                <div>
                  <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">Subject Candidate</label>
                  <select 
                    required
                    value={newTest.candidateId}
                    onChange={(e) => setNewTest({...newTest, candidateId: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-medium text-[16px] appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Choose a candidate to grade</option>
                    {candidates.map(c => (
                      <option key={c._id} value={c._id}>{c.name} — {c.role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">Technical Score (0–100)</label>
                  <div className="relative">
                    <input 
                      required
                      type="number" 
                      min="0"
                      max="100"
                      value={newTest.testScore}
                      onChange={(e) => setNewTest({...newTest, testScore: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-bold text-[24px] text-[#0078db]" 
                      placeholder="95"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-black text-xl">/ 100</span>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <div className="flex-1 bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                      <div className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-1">85+ Core Team</div>
                      <div className="h-1 bg-emerald-200 rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-blue-50 p-3 rounded-2xl border border-blue-100">
                      <div className="text-[10px] font-black text-blue-600 uppercase tracking-wider mb-1">70+ Support</div>
                      <div className="h-1 bg-blue-200 rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-amber-50 p-3 rounded-2xl border border-amber-100">
                      <div className="text-[10px] font-black text-amber-600 uppercase tracking-wider mb-1">&lt;70 Training</div>
                      <div className="h-1 bg-amber-200 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[14px] font-black text-gray-400 uppercase tracking-wider mb-2">Evaluation Summary</label>
                  <textarea 
                    rows="4"
                    value={newTest.evaluationNotes}
                    onChange={(e) => setNewTest({...newTest, evaluationNotes: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-medium text-[16px] resize-none"
                    placeholder="Provide qualitative feedback on the submission..."
                  />
                </div>
              </div>
              <div className="mt-12 flex justify-end gap-4 border-t border-gray-100 pt-8">
                <button 
                  type="button"
                  onClick={() => setIsEvaluateModalOpen(false)}
                  className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="bg-[#0078db] hover:bg-[#0069c0] text-white px-10 py-4 rounded-2xl font-bold active:scale-[0.98] transition-all flex items-center gap-2 shadow-xl shadow-[#0078db]/20"
                >
                  <CheckCircle size={24} />
                  Submit Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
