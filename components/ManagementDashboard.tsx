
import React from 'react';
import { Therapist, Language } from '../types';
import { Check, X, Shield, AlertCircle, User, FileText } from 'lucide-react';
import { translations } from '../translations';

interface ManagementDashboardProps {
  therapists: Therapist[];
  onUpdateStatus: (id: string, isApproved: boolean) => void;
  lang: Language;
}

export const ManagementDashboard: React.FC<ManagementDashboardProps> = ({ therapists, onUpdateStatus, lang }) => {
  const pendingTherapists = therapists.filter(t => !t.isApproved);
  const approvedTherapists = therapists.filter(t => t.isApproved);
  const t = translations[lang];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24">
      <div className="bg-black/40 backdrop-blur-xl text-white p-10 rounded-3xl shadow-2xl border border-white/10">
        <div className="flex items-center gap-6 mb-6">
           <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
             <Shield className="w-10 h-10 text-teal-400" />
           </div>
           <div>
             <h2 className="text-3xl font-serif">{t.admin.title}</h2>
             <p className="text-slate-400">{t.admin.subtitle}</p>
           </div>
        </div>
        <div className="flex gap-12 mt-8">
           <div className="text-center">
              <span className="text-4xl font-bold block text-white">{pendingTherapists.length}</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{t.admin.pending}</span>
           </div>
           <div className="w-px bg-white/10 h-16"></div>
           <div className="text-center">
              <span className="text-4xl font-bold block text-teal-400">{approvedTherapists.length}</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{t.admin.active}</span>
           </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-serif text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          {t.admin.pending}
        </h3>
        
        <div className="space-y-4">
          {pendingTherapists.length === 0 && (
            <div className="glass-panel p-10 rounded-3xl text-center text-slate-500 border-dashed border-white/10">
              All clear.
            </div>
          )}
          {pendingTherapists.map(therapist => (
              <div key={therapist.id} className="glass-panel p-8 rounded-3xl flex flex-col md:flex-row gap-8 animate-fade-in-up">
                 <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 overflow-hidden border border-white/10">
                      {therapist.avatar ? (
                         <img src={therapist.avatar} alt={therapist.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10" />
                      )}
                    </div>
                 </div>
                 <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-serif text-white">{therapist.name}</h4>
                        <p className="text-teal-400 font-medium">{therapist.specialization}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2 text-sm text-slate-400 font-light border-t border-white/5 pt-4">
                      <p><strong className="text-slate-200 font-medium">Bio:</strong> {therapist.bio}</p>
                      <p><strong className="text-slate-200 font-medium">Qualifications:</strong> {therapist.qualifications}</p>
                    </div>

                    <div className="mt-6 flex gap-4">
                      <button 
                        onClick={() => onUpdateStatus(therapist.id, true)}
                        className="flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-6 py-2 rounded-xl hover:bg-teal-500 hover:text-white transition-all shadow-lg shadow-teal-900/20"
                      >
                        <Check className="w-4 h-4" /> {t.admin.approve}
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(therapist.id, false)}
                        className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-400 px-6 py-2 rounded-xl hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/20 transition-all"
                      >
                        <X className="w-4 h-4" /> {t.admin.reject}
                      </button>
                    </div>
                 </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
