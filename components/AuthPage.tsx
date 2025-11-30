
import React, { useState, useRef } from 'react';
import { UserRole, Therapist, Language } from '../types';
import { ArrowRight, Mail, Lock, User, ArrowLeft, Loader2, Stethoscope, Upload, FileText, Check } from 'lucide-react';
import { NafsLogo } from '../App';
import { translations } from '../translations';

interface AuthPageProps {
  initialMode: 'LOGIN' | 'SIGNUP';
  initialRole?: UserRole;
  onLogin: (role: UserRole, name: string) => void;
  onRegisterTherapist: (data: Partial<Therapist>) => void;
  onBack: () => void;
  lang: Language;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode, initialRole = 'PATIENT', onLogin, onRegisterTherapist, onBack, lang }) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>(initialMode);
  const [roleType, setRoleType] = useState<UserRole>(initialRole === 'THERAPIST' ? 'THERAPIST' : 'PATIENT');
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [specialization, setSpecialization] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [bio, setBio] = useState('');
  const [contact, setContact] = useState('');
  const [certificateFile, setCertificateFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const t = translations[lang];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertificateFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!email || !password) {
      setError('Please fill in your credentials.');
      setIsLoading(false);
      return;
    }

    if (mode === 'SIGNUP') {
      if (!name) {
        setError('Please provide your full name.');
        setIsLoading(false);
        return;
      }

      if (roleType === 'THERAPIST') {
        if (!specialization || !qualifications || !contact) {
          setError('Please complete your professional profile fields.');
          setIsLoading(false);
          return;
        }
        if (!certificateFile) {
          setError('You must upload a valid license or certificate for verification.');
          setIsLoading(false);
          return;
        }

        onRegisterTherapist({
          name,
          contact: email, 
          specialization,
          qualifications,
          bio: bio || `Specialist in ${specialization}`,
          avatar: '' 
        });
      } else {
        onLogin('PATIENT', name);
      }
    } else {
      const displayName = name || email.split('@')[0];
      onLogin(roleType, displayName);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in-up py-20">
      <div className="w-full max-w-2xl">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t.common.back}
        </button>

        <div className="glass-panel p-8 md:p-10 rounded-3xl shadow-2xl shadow-black/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none rtl:right-auto rtl:left-0 rtl:-ml-20"></div>
          
          <div className="text-center mb-8 relative z-10">
            <div className="inline-block p-3 rounded-xl bg-teal-500/10 mb-4 border border-teal-500/20">
               <NafsLogo className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-serif text-white">
              {mode === 'SIGNUP' 
                ? (roleType === 'THERAPIST' ? t.auth.applySpecialist : t.auth.beginJourney) 
                : t.auth.welcomeBack}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="flex bg-black/20 p-1 rounded-xl mb-6 border border-white/5 max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => { setMode('LOGIN'); setError(''); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  mode === 'LOGIN' 
                    ? 'bg-white/10 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t.auth.loginToggle}
              </button>
              <button
                type="button"
                onClick={() => { setMode('SIGNUP'); setError(''); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  mode === 'SIGNUP' 
                    ? 'bg-teal-500/20 text-teal-300 shadow-sm border border-teal-500/20' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t.auth.signupToggle}
              </button>
            </div>

            {mode === 'SIGNUP' && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div 
                  onClick={() => setRoleType('PATIENT')}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col items-center text-center gap-2 ${
                    roleType === 'PATIENT' 
                      ? 'bg-teal-500/10 border-teal-500/50 text-white' 
                      : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'
                  }`}
                >
                  <User className={`w-6 h-6 ${roleType === 'PATIENT' ? 'text-teal-400' : 'text-slate-500'}`} />
                  <span className="text-sm font-medium">{t.welcome.member}</span>
                </div>
                <div 
                  onClick={() => setRoleType('THERAPIST')}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col items-center text-center gap-2 ${
                    roleType === 'THERAPIST' 
                      ? 'bg-blue-500/10 border-blue-500/50 text-white' 
                      : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'
                  }`}
                >
                  <Stethoscope className={`w-6 h-6 ${roleType === 'THERAPIST' ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span className="text-sm font-medium">{t.welcome.specialist}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {mode === 'SIGNUP' && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1 rtl:mr-1 rtl:ml-0">{t.auth.name}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="glass-input w-full p-3 rounded-xl text-sm"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 ml-1 rtl:mr-1 rtl:ml-0">{t.auth.email}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500 rtl:right-3 rtl:left-auto" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input w-full pl-10 p-3 rounded-xl text-sm rtl:pl-3 rtl:pr-10"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 ml-1 rtl:mr-1 rtl:ml-0">{t.auth.password}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500 rtl:right-3 rtl:left-auto" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input w-full pl-10 p-3 rounded-xl text-sm rtl:pl-3 rtl:pr-10"
                  />
                </div>
              </div>
            </div>

            {mode === 'SIGNUP' && roleType === 'THERAPIST' && (
              <div className="animate-fade-in space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-sm font-serif text-blue-300 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Professional Credentials
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400 ml-1">Specialization</label>
                    <select
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="glass-input w-full p-3 rounded-xl text-sm text-slate-200"
                    >
                      <option value="" className="bg-slate-900">Select Field...</option>
                      <option value="Clinical Psychologist" className="bg-slate-900">Clinical Psychologist</option>
                      <option value="Psychiatrist" className="bg-slate-900">Psychiatrist</option>
                      <option value="Therapist" className="bg-slate-900">Licensed Therapist</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 ml-1">Phone</label>
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="glass-input w-full p-3 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                    <label className="text-xs font-medium text-slate-400 ml-1">Qualifications</label>
                    <input
                      type="text"
                      value={qualifications}
                      onChange={(e) => setQualifications(e.target.value)}
                      className="glass-input w-full p-3 rounded-xl text-sm"
                    />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 ml-1">Upload License</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      certificateFile ? 'border-green-500/30 bg-green-500/10' : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept=".pdf,.jpg,.png" 
                      onChange={handleFileChange}
                    />
                    {certificateFile ? (
                       <div className="flex items-center gap-2 text-green-400">
                         <Check className="w-5 h-5" />
                         <span className="text-sm font-medium">Attached</span>
                       </div>
                    ) : (
                       <>
                         <Upload className="w-6 h-6 text-slate-400 mb-2" />
                         <span className="text-sm text-slate-400">Upload License ID (PDF/IMG)</span>
                       </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-xs text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white py-3.5 rounded-xl font-medium hover:opacity-90 transition-all shadow-lg mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                mode === 'SIGNUP' && roleType === 'THERAPIST' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-blue-900/20'
                  : 'bg-gradient-to-r from-teal-600 to-blue-600 shadow-teal-900/20'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'SIGNUP' 
                    ? (roleType === 'THERAPIST' ? t.auth.submitApp : t.auth.createAccount) 
                    : t.auth.enterSanctuary}
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
