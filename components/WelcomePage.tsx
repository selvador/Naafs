
import React from 'react';
import { UserRole, Language } from '../types';
import { Sparkles, User, Stethoscope, HeartHandshake, ArrowRight, ShieldCheck, LogIn, Globe } from 'lucide-react';
import { NafsLogo } from '../App';
import { translations } from '../translations';

interface WelcomePageProps {
  onStartJourney: (role: UserRole, title?: string) => void;
  onNavigateToAuth: (mode: 'LOGIN' | 'SIGNUP', role?: UserRole) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onStartJourney, onNavigateToAuth, lang, setLang }) => {
  const t = translations[lang];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative p-6 overflow-hidden">
      
      <div className="absolute top-6 right-6 z-50 flex gap-3">
        <div className="glass-panel p-1 rounded-full flex gap-1">
           {(['en', 'ar', 'fr'] as Language[]).map((l) => (
             <button
               key={l}
               onClick={() => setLang(l)}
               className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-colors ${lang === l ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
             >
               {l}
             </button>
           ))}
        </div>

        <button 
          onClick={() => onNavigateToAuth('LOGIN')}
          className="glass-panel px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium text-white hover:bg-white/10 transition-all border border-white/10 hover:border-teal-500/30 group"
        >
          <LogIn className="w-4 h-4 text-teal-400 group-hover:text-teal-300 rtl:ml-2" />
          {t.welcome.login}
        </button>
      </div>

      <div className="z-10 text-center max-w-3xl mx-auto animate-fade-in-up mb-16">
        <div className="flex justify-center mb-8">
           <div className="p-6 rounded-[2rem] bg-gradient-to-br from-teal-500/20 to-blue-600/20 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(45,212,191,0.2)] animate-pulse">
             <NafsLogo className="w-24 h-24" />
           </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-serif font-medium text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-blue-200 mb-6 tracking-tight">
          {t.welcome.title}
        </h1>
        
        <p className="text-xl text-slate-300 font-light leading-relaxed mb-8 max-w-2xl mx-auto">
          {t.welcome.subtitle}
        </p>

        <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"></div>
      </div>

      <div className="z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl w-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        
        <button 
          onClick={() => onStartJourney('PATIENT', 'Guest')}
          className="group glass-panel p-6 rounded-3xl text-left rtl:text-right hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/10 rounded-full blur-2xl group-hover:bg-slate-500/20 transition-all -mr-10 -mt-10 rtl:right-auto rtl:left-0 rtl:-ml-10"></div>
          <User className="w-8 h-8 text-slate-400 mb-4 group-hover:text-white transition-colors" />
          <h3 className="text-xl font-serif text-white mb-2">{t.welcome.guest}</h3>
          <p className="text-sm text-slate-400 mb-6 font-light">{t.welcome.guestDesc}</p>
          <div className="flex items-center text-xs font-medium text-slate-500 uppercase tracking-wider group-hover:text-slate-300">
            <ArrowRight className="w-3 h-3 mr-2 rtl:rotate-180 rtl:ml-2 rtl:mr-0" />
          </div>
        </button>

        <button 
          onClick={() => onNavigateToAuth('SIGNUP', 'PATIENT')}
          className="group glass-panel p-6 rounded-3xl text-left rtl:text-right hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden border-teal-500/30"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all -mr-10 -mt-10 rtl:right-auto rtl:left-0 rtl:-ml-10"></div>
          <HeartHandshake className="w-8 h-8 text-teal-400 mb-4 group-hover:text-white transition-colors" />
          <h3 className="text-xl font-serif text-white mb-2">{t.welcome.member}</h3>
          <p className="text-sm text-slate-400 mb-6 font-light">{t.welcome.memberDesc}</p>
          <div className="flex items-center text-xs font-medium text-teal-400 uppercase tracking-wider group-hover:text-teal-200">
            {t.welcome.signup} / {t.welcome.login} <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:mr-2 rtl:ml-0" />
          </div>
        </button>

        <button 
          onClick={() => onNavigateToAuth('SIGNUP', 'THERAPIST')}
          className="group glass-panel p-6 rounded-3xl text-left rtl:text-right hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all -mr-10 -mt-10 rtl:right-auto rtl:left-0 rtl:-ml-10"></div>
          <Stethoscope className="w-8 h-8 text-blue-400 mb-4 group-hover:text-white transition-colors" />
          <h3 className="text-xl font-serif text-white mb-2">{t.welcome.specialist}</h3>
          <p className="text-sm text-slate-400 mb-6 font-light">{t.welcome.specialistDesc}</p>
          <div className="flex items-center text-xs font-medium text-blue-400 uppercase tracking-wider group-hover:text-blue-200">
             <ArrowRight className="w-3 h-3 mr-2 rtl:rotate-180 rtl:ml-2 rtl:mr-0" />
          </div>
        </button>

        <button 
          onClick={() => onStartJourney('MANAGEMENT', 'Dr. ')}
          className="group glass-panel p-6 rounded-3xl text-left rtl:text-right hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all -mr-10 -mt-10 rtl:right-auto rtl:left-0 rtl:-ml-10"></div>
          <ShieldCheck className="w-8 h-8 text-purple-400 mb-4 group-hover:text-white transition-colors" />
          <h3 className="text-xl font-serif text-white mb-2">{t.welcome.admin}</h3>
          <p className="text-sm text-slate-400 mb-6 font-light">{t.welcome.adminDesc}</p>
          <div className="flex items-center text-xs font-medium text-purple-400 uppercase tracking-wider group-hover:text-purple-200">
             <ArrowRight className="w-3 h-3 mr-2 rtl:rotate-180 rtl:ml-2 rtl:mr-0" />
          </div>
        </button>

      </div>
      
      <button 
        onClick={() => onStartJourney('PATIENT', 'Guest')}
        className="mt-8 z-10 text-slate-500 text-sm hover:text-teal-400 transition-colors underline underline-offset-4 decoration-slate-700 hover:decoration-teal-500"
      >
        {t.welcome.quickGuest}
      </button>

      <div className="absolute bottom-6 text-center w-full opacity-40 text-xs text-slate-500 font-light">
        <p>© 2024 Nafs Project. AI-Augmented Mental Health Support.</p>
      </div>

    </div>
  );
};
