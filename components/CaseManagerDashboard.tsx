

import React, { useState } from 'react';
import { CaseFile, CaseStatus, Therapist } from '../types';
import { FileText, Users, Activity, Plus, Save, Search, AlertTriangle, CheckCircle, Clock, Brain, Edit2, TrendingUp, Stethoscope } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

interface CaseManagerDashboardProps {
  cases: CaseFile[];
  therapists: Therapist[];
  onSaveCase: (caseFile: CaseFile) => void;
}

// Mock Data for "Patient Journey" visualization since we can't link real user data yet
const generateMockMoodData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    score: Math.floor(Math.random() * 3) + 2 // Random score 2-5
  }));
};

export const CaseManagerDashboard: React.FC<CaseManagerDashboardProps> = ({ cases, therapists, onSaveCase }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [formData, setFormData] = useState<Partial<CaseFile>>({});
  const [mockMoodData, setMockMoodData] = useState(generateMockMoodData());

  const activeCase = cases.find(c => c.id === selectedCaseId);

  const handleNewCase = () => {
    const newId = Date.now().toString();
    setFormData({
      id: newId,
      patientName: '',
      age: '',
      contact: '',
      diagnosis: '',
      clinicalHistory: '',
      clinicalDirectives: '',
      doctorOpinion: '',
      assignedTherapistIds: [],
      status: 'ACTIVE',
      lastUpdated: Date.now()
    });
    setSelectedCaseId(newId);
    setIsEditing(true);
    setMockMoodData(generateMockMoodData());
  };

  const handleEditCase = (c: CaseFile) => {
    setSelectedCaseId(c.id);
    setFormData(c);
    setIsEditing(true);
    setMockMoodData(generateMockMoodData()); // Regenerate mock data for effect
  };

  const handleSave = () => {
    if (formData.patientName && formData.id) {
      onSaveCase({
        ...formData as CaseFile,
        lastUpdated: Date.now()
      });
      setIsEditing(false);
    }
  };

  const toggleTherapist = (therapistId: string) => {
    const current = formData.assignedTherapistIds || [];
    if (current.includes(therapistId)) {
      setFormData(prev => ({ ...prev, assignedTherapistIds: current.filter(id => id !== therapistId) }));
    } else {
      setFormData(prev => ({ ...prev, assignedTherapistIds: [...current, therapistId] }));
    }
  };

  const filteredCases = cases.filter(c => 
    c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case 'ACTIVE': return 'text-teal-400 bg-teal-400/10 border-teal-400/20';
      case 'CRITICAL': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'REVIEW': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'ARCHIVED': return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 max-w-7xl mx-auto pb-24 px-4 md:px-0">
      
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 sticky top-0">
           <div className="flex items-center justify-between">
             <h2 className="text-xl font-serif text-white flex items-center gap-2">
               <Brain className="w-6 h-6 text-purple-400" />
               Case Roster
             </h2>
             <button 
               onClick={handleNewCase}
               className="p-2 bg-teal-600 rounded-full hover:bg-teal-500 transition-colors shadow-lg shadow-teal-900/20"
             >
               <Plus className="w-5 h-5 text-white" />
             </button>
           </div>
           
           <div className="relative">
             <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
             <input 
               type="text" 
               placeholder="Search patients..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="glass-input w-full pl-10 p-2.5 rounded-xl text-sm"
             />
           </div>

           <div className="flex flex-col gap-3 mt-2 overflow-y-auto max-h-[60vh] custom-scrollbar pr-2">
             {filteredCases.length === 0 && (
               <p className="text-center text-slate-500 text-sm py-4">No cases found.</p>
             )}
             {filteredCases.map(c => (
               <div 
                 key={c.id}
                 onClick={() => {
                   setSelectedCaseId(c.id);
                   setIsEditing(false);
                   setMockMoodData(generateMockMoodData());
                 }}
                 className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                   selectedCaseId === c.id 
                     ? 'bg-white/10 border-white/20 shadow-lg' 
                     : 'bg-white/5 border-transparent hover:bg-white/10'
                 }`}
               >
                 <div className="flex justify-between items-start mb-2">
                   <span className="font-medium text-slate-200">{c.patientName}</span>
                   <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getStatusColor(c.status)}`}>
                        {c.status}
                      </span>
                   </div>
                 </div>
                 <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-slate-400 truncate flex-1">{c.diagnosis}</p>
                    <button 
                        onClick={(e) => { 
                        e.stopPropagation(); 
                        handleEditCase(c); 
                        }}
                        className="px-3 py-1.5 bg-white/5 hover:bg-teal-500/20 rounded-lg text-slate-300 hover:text-teal-300 transition-colors border border-white/5 flex items-center gap-2 text-xs font-medium group"
                        title="Edit Case"
                    >
                        <Edit2 className="w-3 h-3 group-hover:text-teal-300" /> Edit
                    </button>
                 </div>
                 <p className="text-[10px] text-slate-600 mt-2">Updated: {new Date(c.lastUpdated).toLocaleDateString()}</p>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Main Detail Panel */}
      <div className="flex-1">
        {selectedCaseId ? (
          <div className="glass-panel p-8 rounded-3xl h-full animate-fade-in overflow-y-auto custom-scrollbar max-h-[calc(100vh-100px)]">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5 sticky top-0 bg-slate-900/50 backdrop-blur-md z-10">
               <div>
                 <h2 className="text-3xl font-serif text-white mb-1">
                   {isEditing ? (formData.patientName || 'New Case') : activeCase?.patientName}
                 </h2>
                 <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><Activity className="w-4 h-4 text-teal-400"/> Case ID: #{selectedCaseId.slice(-6)}</span>
                    {!isEditing && <span className="text-slate-500">Last updated: {new Date(activeCase?.lastUpdated || 0).toLocaleString()}</span>}
                 </div>
               </div>
               
               <div className="flex gap-3">
                 {!isEditing ? (
                   <button 
                     onClick={() => handleEditCase(activeCase!)}
                     className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl border border-white/10 transition-colors text-sm flex items-center gap-2"
                   >
                     <Edit2 className="w-3.5 h-3.5" /> Edit File
                   </button>
                 ) : (
                   <>
                     <button 
                       onClick={() => setIsEditing(false)}
                       className="px-4 py-2 hover:text-white text-slate-400 text-sm"
                     >
                       Cancel
                     </button>
                     <button 
                       onClick={handleSave}
                       className="flex items-center gap-2 px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-lg shadow-teal-900/20 transition-colors text-sm font-medium"
                     >
                       <Save className="w-4 h-4" /> Save Changes
                     </button>
                   </>
                 )}
               </div>
            </div>

            {/* Content Form/View */}
            <div className="space-y-8">
              
              {/* Patient Journey Insights - VISIBLE TO DOCTORS */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="md:col-span-2 glass-panel bg-white/5 p-5 rounded-2xl border border-white/5">
                      <h3 className="text-teal-400 font-serif text-sm mb-4 flex items-center gap-2 uppercase tracking-wider">
                        <TrendingUp className="w-4 h-4" /> Patient Journey (Last 7 Days)
                      </h3>
                      <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={mockMoodData}>
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                            <Tooltip 
                              contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px'}}
                              itemStyle={{color: '#2dd4bf'}}
                            />
                            <Line type="monotone" dataKey="score" stroke="#2dd4bf" strokeWidth={3} dot={{fill: '#0f172a', strokeWidth: 2}} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                   </div>
                   <div className="glass-panel bg-white/5 p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
                      <div>
                        <h3 className="text-slate-400 font-serif text-sm mb-2 uppercase tracking-wider">Avg. Mood</h3>
                        <p className="text-3xl font-bold text-white">3.8<span className="text-sm text-slate-500 font-normal">/5</span></p>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs text-slate-500 mb-1">Last Check-in</p>
                        <p className="text-sm text-slate-300">Yesterday, 8:30 PM</p>
                      </div>
                   </div>
               </div>

              {/* Demographics Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Patient Name</label>
                  {isEditing ? (
                    <input 
                      value={formData.patientName || ''} 
                      onChange={e => setFormData({...formData, patientName: e.target.value})}
                      className="glass-input w-full p-3 rounded-xl"
                    />
                  ) : (
                    <p className="text-lg text-slate-200">{activeCase?.patientName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Age / Contact</label>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input 
                        placeholder="Age"
                        value={formData.age || ''} 
                        onChange={e => setFormData({...formData, age: e.target.value})}
                        className="glass-input w-1/3 p-3 rounded-xl"
                      />
                      <input 
                        placeholder="Contact"
                        value={formData.contact || ''} 
                        onChange={e => setFormData({...formData, contact: e.target.value})}
                        className="glass-input w-2/3 p-3 rounded-xl"
                      />
                    </div>
                  ) : (
                    <p className="text-lg text-slate-200">{activeCase?.age} yrs • {activeCase?.contact}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Status</label>
                  {isEditing ? (
                     <select 
                       value={formData.status} 
                       onChange={e => setFormData({...formData, status: e.target.value as CaseStatus})}
                       className="glass-input w-full p-3 rounded-xl text-slate-200"
                     >
                       <option value="ACTIVE" className="bg-slate-900">Active Treatment</option>
                       <option value="REVIEW" className="bg-slate-900">Under Review</option>
                       <option value="CRITICAL" className="bg-slate-900">Critical Care</option>
                       <option value="ARCHIVED" className="bg-slate-900">Closed / Archived</option>
                     </select>
                  ) : (
                    <span className={`inline-block px-3 py-1 rounded-lg border text-sm font-bold ${getStatusColor(activeCase?.status || 'ACTIVE')}`}>
                      {activeCase?.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Doctor's Opinion / Notes Field */}
              <div className="glass-panel p-5 rounded-2xl border border-blue-500/20 bg-blue-900/5">
                <h3 className="text-blue-400 font-serif text-lg mb-3 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" /> Doctor's Opinion & Clinical Notes
                </h3>
                <div className="relative">
                  {isEditing ? (
                    <textarea 
                      value={formData.doctorOpinion || ''}
                      onChange={e => setFormData({...formData, doctorOpinion: e.target.value})}
                      className="glass-input w-full p-3 rounded-xl h-32 resize-none border-blue-500/30 focus:border-blue-400"
                      placeholder="Enter your professional opinion, observation, and private clinical notes here..."
                    />
                  ) : (
                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap italic">
                        {activeCase?.doctorOpinion || "No clinical opinion recorded yet."}
                        </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Clinical Data */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div>
                      <h3 className="text-teal-400 font-serif text-lg mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5" /> Clinical Snapshot
                      </h3>
                      <div className="bg-black/20 rounded-2xl p-5 border border-white/5">
                        <label className="block text-xs font-medium text-slate-500 mb-2">Primary Diagnosis</label>
                        {isEditing ? (
                          <input 
                            value={formData.diagnosis || ''}
                            onChange={e => setFormData({...formData, diagnosis: e.target.value})}
                            className="glass-input w-full p-3 rounded-xl mb-4"
                          />
                        ) : (
                          <p className="text-white font-medium mb-4">{activeCase?.diagnosis}</p>
                        )}

                        <label className="block text-xs font-medium text-slate-500 mb-2">History & Observations</label>
                        {isEditing ? (
                          <textarea 
                            value={formData.clinicalHistory || ''}
                            onChange={e => setFormData({...formData, clinicalHistory: e.target.value})}
                            className="glass-input w-full p-3 rounded-xl h-32 resize-none"
                          />
                        ) : (
                          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{activeCase?.clinicalHistory}</p>
                        )}
                      </div>
                   </div>

                   <div>
                      <h3 className="text-purple-400 font-serif text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> Case Manager Directives
                      </h3>
                      <div className="bg-purple-900/10 rounded-2xl p-5 border border-purple-500/20 relative overflow-hidden">
                         {/* High tech decorative line */}
                         <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/50"></div>
                         
                         <p className="text-xs text-purple-300 mb-3 uppercase tracking-widest font-bold">Recommendations for Team</p>
                         {isEditing ? (
                            <textarea 
                              value={formData.clinicalDirectives || ''}
                              onChange={e => setFormData({...formData, clinicalDirectives: e.target.value})}
                              className="glass-input w-full p-3 rounded-xl h-32 resize-none bg-purple-900/20 border-purple-500/30 focus:border-purple-400 placeholder:text-purple-300/30"
                              placeholder="Enter instructions, treatment focus, or protocols for the assigned specialists..."
                            />
                          ) : (
                            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                              {activeCase?.clinicalDirectives || "No specific directives logged."}
                            </p>
                          )}
                      </div>
                   </div>
                </div>

                {/* Team Assignment */}
                <div>
                   <h3 className="text-blue-400 font-serif text-lg mb-3 flex items-center gap-2">
                     <Users className="w-5 h-5" /> Care Team Assignment
                   </h3>
                   <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                     <div className="p-4 bg-white/5 border-b border-white/5">
                       <p className="text-xs text-slate-400">Select specialists to follow this case and adhere to directives.</p>
                     </div>
                     <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                       {therapists.map(therapist => {
                         const isAssigned = isEditing 
                            ? formData.assignedTherapistIds?.includes(therapist.id)
                            : activeCase?.assignedTherapistIds.includes(therapist.id);
                         
                         return (
                           <div 
                             key={therapist.id}
                             onClick={() => isEditing && toggleTherapist(therapist.id)}
                             className={`p-4 flex items-center justify-between border-b border-white/5 transition-colors ${
                               isEditing ? 'cursor-pointer hover:bg-white/5' : ''
                             } ${isAssigned ? 'bg-teal-900/10' : ''}`}
                           >
                             <div className="flex items-center gap-3">
                               <div className={`w-2 h-2 rounded-full ${isAssigned ? 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]' : 'bg-slate-700'}`}></div>
                               <div>
                                 <p className={`font-medium ${isAssigned ? 'text-teal-200' : 'text-slate-400'}`}>{therapist.name}</p>
                                 <p className="text-xs text-slate-500">{therapist.specialization}</p>
                               </div>
                             </div>
                             {isAssigned && <CheckCircle className="w-4 h-4 text-teal-400" />}
                           </div>
                         );
                       })}
                     </div>
                   </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl h-full flex flex-col items-center justify-center text-slate-500 p-12 text-center border-dashed border-white/10">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-serif text-slate-300 mb-2">No Case Selected</h3>
            <p className="max-w-xs mx-auto">Select a patient file from the roster or initialize a new case entry to begin management.</p>
          </div>
        )}
      </div>
    </div>
  );
};
