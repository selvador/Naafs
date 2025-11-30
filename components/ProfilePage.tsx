
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, UserRole, Therapist, Language } from '../types';
import { User, Shield, Save, Lock, Stethoscope, FileCheck, BadgeCheck, Camera, Upload, Phone, Briefcase, LogOut, ArrowRight, Globe } from 'lucide-react';
import { translations } from '../translations';

interface ProfilePageProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  role: UserRole;
  onChangeRole: (role: UserRole) => void;
  therapistProfile: Therapist | undefined;
  onSaveTherapist: (data: Partial<Therapist>) => void;
  onLogout: () => void;
  onGuestSignup?: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ 
  profile, 
  onSaveProfile, 
  role, 
  onChangeRole,
  therapistProfile,
  onSaveTherapist,
  onLogout,
  onGuestSignup,
  lang,
  setLang
}) => {
  const [userForm, setUserForm] = useState<UserProfile>(profile);
  const [therapistForm, setTherapistForm] = useState<Partial<Therapist>>({
    name: '',
    specialization: '',
    qualifications: '',
    bio: '',
    contact: '',
    whatsapp: '',
    avatar: ''
  });

  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState<'PERSONAL' | 'PROFESSIONAL'>('PERSONAL');
  
  const userFileInputRef = useRef<HTMLInputElement>(null);
  const therapistFileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  useEffect(() => {
    setUserForm(profile);
  }, [profile]);

  useEffect(() => {
    if (therapistProfile) {
      setTherapistForm(therapistProfile);
    } else if (role === 'THERAPIST') {
      setTherapistForm(prev => ({ ...prev, name: profile.name, avatar: profile.avatar }));
    }
  }, [therapistProfile, role, profile.name, profile.avatar]);

  const handleUserChange = (field: keyof UserProfile, value: string) => {
    setUserForm(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleTherapistChange = (field: keyof Therapist, value: string) => {
    setTherapistForm(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'USER' | 'THERAPIST') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'USER') {
          setUserForm(prev => ({ ...prev, avatar: result }));
          setIsDirty(true);
        } else {
          setTherapistForm(prev => ({ ...prev, avatar: result }));
          setIsDirty(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (role === 'THERAPIST' && activeTab === 'PROFESSIONAL') {
      onSaveTherapist(therapistForm);
    } else {
      onSaveProfile(userForm);
    }
    setIsDirty(false);
  };

  const isGuest = profile.name === 'Guest';
  const isTherapistRole = role === 'THERAPIST';
  const isManagementRole = role === 'MANAGEMENT';
  const isCaseManagerRole = role === 'CASE_MANAGER';

  if (isGuest) {
    return (
      <div className="space-y-8 pb-32 max-w-4xl mx-auto animate-fade-in">
         <div className="glass-panel p-10 rounded-3xl text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-6 border border-white/10">
               <User className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-3xl font-serif text-white mb-2">{t.profile.guestTitle}</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              {t.profile.guestMsg}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={onGuestSignup}
                className="px-8 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-500 transition-all shadow-lg shadow-teal-900/20 flex items-center justify-center gap-2"
              >
                {t.profile.createProfile} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
              <button 
                onClick={onLogout}
                className="px-8 py-3 bg-white/5 text-slate-300 border border-white/10 rounded-xl font-medium hover:bg-white/10 transition-all"
              >
                {t.common.exit}
              </button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32 max-w-4xl mx-auto">
      <div className="glass-panel p-8 rounded-3xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
           <div>
             <h2 className="text-2xl font-serif text-white flex items-center gap-3">
               <User className="w-6 h-6 text-teal-400" />
               {t.profile.title}
             </h2>
           </div>
           
           <div className="flex flex-wrap gap-4 items-center">
              {/* Language Selector */}
              <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-lg border border-white/5">
                  <Globe className="w-4 h-4 text-slate-400 ml-2 rtl:mr-2 rtl:ml-0" />
                  {(['en', 'ar', 'fr'] as Language[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-colors ${lang === l ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {l}
                    </button>
                  ))}
              </div>

              <button 
                onClick={onLogout}
                className="p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-colors border border-red-500/10"
                title="Log Out"
              >
                <LogOut className="w-5 h-5 rtl:rotate-180" />
              </button>
           </div>
        </div>

        {isTherapistRole && (
          <div className="flex gap-8 border-b border-white/5 mt-8">
            <button
              onClick={() => setActiveTab('PERSONAL')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'PERSONAL' ? 'border-teal-500 text-teal-400' : 'border-transparent text-slate-500'
              }`}
            >
              {t.profile.personal}
            </button>
            <button
              onClick={() => setActiveTab('PROFESSIONAL')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'PROFESSIONAL' ? 'border-teal-500 text-teal-400' : 'border-transparent text-slate-500'
              }`}
            >
              {t.profile.professional}
            </button>
          </div>
        )}
      </div>

      {(role !== 'THERAPIST' || activeTab === 'PERSONAL') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-8 rounded-3xl">
            <div className="flex items-center gap-2 mb-8 pb-4 border-b border-white/5">
              <User className="w-5 h-5 text-slate-500" />
              <h3 className="text-lg font-medium text-slate-300">{t.profile.personal}</h3>
            </div>

            <div className="mb-8 flex flex-col items-center">
              <div 
                className="relative group cursor-pointer"
                onClick={() => userFileInputRef.current?.click()}
              >
                <div className="w-28 h-28 rounded-full bg-white/5 border-2 border-white/10 overflow-hidden flex items-center justify-center shadow-inner">
                  {userForm.avatar ? (
                    <img src={userForm.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-slate-600" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-all flex items-center justify-center backdrop-blur-sm">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <input 
                  type="file" 
                  ref={userFileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'USER')}
                />
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">{t.auth.name}</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => handleUserChange('name', e.target.value)}
                  className="glass-input w-full p-3 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Age</label>
                  <input
                    type="text"
                    value={userForm.age}
                    onChange={(e) => handleUserChange('age', e.target.value)}
                    className="glass-input w-full p-3 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Gender</label>
                  <input
                    type="text"
                    value={userForm.gender}
                    onChange={(e) => handleUserChange('gender', e.target.value)}
                    className="glass-input w-full p-3 rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Contact Info</label>
                 <input
                  type="text"
                  value={userForm.contact}
                  onChange={(e) => handleUserChange('contact', e.target.value)}
                  className="glass-input w-full p-3 rounded-xl"
                 />
               </div>
               <div>
                 <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">{t.profile.phoneNumber}</label>
                 <input
                  type="text"
                  value={userForm.phoneNumber || ''}
                  onChange={(e) => handleUserChange('phoneNumber', e.target.value)}
                  className="glass-input w-full p-3 rounded-xl"
                 />
               </div>
              </div>
            </div>
          </div>

           <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
             {!isManagementRole && !isTherapistRole && !isCaseManagerRole && (
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none rtl:right-auto rtl:left-0">
                 <Shield className="w-40 h-40 text-white" />
               </div>
             )}
             <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5 relative z-10">
               <div className="flex items-center gap-2">
                 <Shield className="w-5 h-5 text-slate-500" />
                 <h3 className="text-lg font-medium text-slate-500">
                   Clinical (Restricted)
                 </h3>
               </div>
               <span className="text-xs font-medium px-2 py-1 bg-white/5 text-slate-400 rounded flex items-center gap-1 border border-white/5">
                 <Lock className="w-3 h-3" /> Private
               </span>
             </div>
             <div className="space-y-4 relative z-10 opacity-50">
                <p className="text-sm text-slate-500 italic">Clinical records are encrypted and managed by specialists.</p>
             </div>
           </div>
        </div>
      )}

      {isTherapistRole && activeTab === 'PROFESSIONAL' && (
         <div className="glass-panel p-8 rounded-3xl">
            <div className="flex justify-between items-start mb-8 pb-4 border-b border-white/5">
               <div className="flex items-center gap-2">
                 <Stethoscope className="w-5 h-5 text-teal-400" />
                 <div>
                    <h3 className="text-lg font-medium text-white">{t.profile.professional}</h3>
                    <p className="text-xs text-slate-400">Public directory information.</p>
                 </div>
               </div>
               {therapistForm.isApproved ? (
                 <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold flex items-center gap-1 border border-green-500/20">
                   <BadgeCheck className="w-4 h-4" /> Verified
                 </span>
               ) : (
                 <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold flex items-center gap-1 border border-amber-500/20">
                   <FileCheck className="w-4 h-4" /> Pending
                 </span>
               )}
            </div>
            
            <div className="space-y-4">
                {/* Mock simplified fields for professional edit */}
                 <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Display Name</label>
                    <input
                      type="text"
                      value={therapistForm.name}
                      onChange={(e) => handleTherapistChange('name', e.target.value)}
                      className="glass-input w-full p-3 rounded-xl"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Specialization</label>
                        <input
                          type="text"
                          value={therapistForm.specialization}
                          onChange={(e) => handleTherapistChange('specialization', e.target.value)}
                          className="glass-input w-full p-3 rounded-xl"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Qualifications</label>
                        <input
                          type="text"
                          value={therapistForm.qualifications}
                          onChange={(e) => handleTherapistChange('qualifications', e.target.value)}
                          className="glass-input w-full p-3 rounded-xl"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Bio</label>
                    <textarea
                      value={therapistForm.bio}
                      onChange={(e) => handleTherapistChange('bio', e.target.value)}
                      rows={3}
                      className="glass-input w-full p-3 rounded-xl resize-none"
                    />
                </div>
            </div>
         </div>
      )}

      <div className="fixed bottom-28 sm:bottom-10 right-6 z-40 rtl:right-auto rtl:left-6">
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-xl backdrop-blur-md font-medium transition-all transform ${
            isDirty 
              ? 'bg-teal-500 text-white hover:scale-105 hover:bg-teal-400' 
              : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
          }`}
        >
          <Save className="w-5 h-5" />
          {isDirty ? t.common.save : t.common.saved}
        </button>
      </div>
    </div>
  );
};
