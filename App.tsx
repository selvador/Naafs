

import React, { useState, useEffect } from 'react';
import { ViewState, ChatMessage, MoodEntry, UserProfile, UserRole, Therapist, Review, CaseFile, Language, Notification } from './types';
import { ChatInterface } from './components/ChatInterface';
import { MoodTracker } from './components/MoodTracker';
import { ProfilePage } from './components/ProfilePage';
import { TherapistDirectory } from './components/TherapistDirectory';
import { ManagementDashboard } from './components/ManagementDashboard';
import { CaseManagerDashboard } from './components/CaseManagerDashboard';
import { WelcomePage } from './components/WelcomePage';
import { AuthPage } from './components/AuthPage';
import { NotificationToast } from './components/NotificationToast';
import { generateMeditation } from './services/geminiService';
import { translations } from './translations';
import { MessageCircle, BarChart3, Leaf, User, Stethoscope, Shield, Share2, Sparkles, Briefcase, LogOut, Lock, ArrowRight } from 'lucide-react';

// Local Storage Keys
const STORAGE_KEYS = {
  MOODS: 'nafs_moods',
  CHATS: 'nafs_chats_v1',
  PROFILE: 'nafs_profile',
  THERAPISTS: 'nafs_therapists_v1',
  ROLE: 'nafs_user_role',
  CASES: 'nafs_cases_v1',
  HAS_VISITED: 'nafs_has_visited',
  LANG: 'nafs_language'
};

// Mock Data for Demo
const MOCK_THERAPISTS: Therapist[] = [
  {
    id: 't1',
    name: 'Dr. Amina Khalil',
    specialization: 'Clinical Psychologist',
    qualifications: 'PhD Psychology, Cairo University',
    bio: 'Specializing in anxiety and trauma recovery with a compassionate, evidence-based approach. 10+ years of experience helping patients find balance.',
    contact: 'amina.khalil@nafs.com',
    whatsapp: '1234567890', 
    isApproved: true,
    rating: 4.8,
    reviews: [
      { id: 'r1', authorName: 'Sarah', rating: 5, comment: 'Dr. Amina is wonderful. Very patient.', date: new Date().toISOString() }
    ]
  },
  {
    id: 't2',
    name: 'Youssef Karim',
    specialization: 'Life Coach',
    qualifications: 'Certified CBT Practitioner',
    bio: 'Helping you unlock your potential and navigate daily stressors with mindfulness and actionable strategies.',
    contact: 'youssef@nafs.com',
    whatsapp: '9876543210',
    isApproved: true,
    rating: 4.5,
    reviews: []
  },
  {
    id: 't3',
    name: 'Layla Ahmed',
    specialization: 'Psychiatrist',
    qualifications: 'MD, Psychiatry',
    bio: 'Awaiting approval for credentials.',
    contact: 'layla@test.com',
    isApproved: false, 
    rating: 0,
    reviews: []
  }
];

const MOCK_CASES: CaseFile[] = [
  {
    id: 'c1',
    patientName: 'Ahmed M.',
    age: '28',
    contact: 'ahmed.m@email.com',
    diagnosis: 'Generalized Anxiety Disorder',
    clinicalHistory: 'Patient reports ongoing sleep disturbances and high work-related stress. Previous history of mild panic attacks in 2021.',
    clinicalDirectives: 'Please focus on CBT techniques for anxiety management. Recommend weekly sessions. Integrate mindfulness exercises from the "Nafs" toolkit.',
    doctorOpinion: 'Patient shows good resilience but needs consistent reinforcement of coping mechanisms during high-stress work periods.',
    assignedTherapistIds: ['t1'],
    status: 'ACTIVE',
    lastUpdated: Date.now()
  },
  {
    id: 'c2',
    patientName: 'Mariam S.',
    age: '34',
    contact: 'mariam.s@email.com',
    diagnosis: 'Postpartum Depression',
    clinicalHistory: '3 months postpartum. Expressing feelings of isolation and overwhelm. Strong support system but hesitant to ask for help.',
    clinicalDirectives: 'Immediate support required. Focus on validation and gradual routine building. Coordinate with Psychiatrist if medication review is needed.',
    doctorOpinion: 'Monitoring mood fluctuations closely. Recommended participating in group therapy for shared experiences.',
    assignedTherapistIds: ['t1', 't2'],
    status: 'CRITICAL',
    lastUpdated: Date.now() - 86400000
  }
];

const SocialButton = ({ href, color, children, label }: { href: string, color: string, children?: React.ReactNode, label: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg backdrop-blur-md bg-opacity-80 hover:bg-opacity-100 border border-white/10`}
    style={{ backgroundColor: color }}
    aria-label={label}
  >
    {children}
  </a>
);

export const NafsLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div className={`${className} relative flex items-center justify-center`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2dd4bf" /> 
          <stop offset="100%" stopColor="#60a5fa" /> 
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="60" height="60" rx="15" transform="rotate(45 50 50)" fill="url(#logoGradient)" fillOpacity="0.8" />
      <path d="M65 38C65 38 55 35 45 45C35 55 38 75 38 75L32 82M38 75L62 52C62 52 68 48 65 38Z" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M38 75L48 65" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  </div>
);

const GuestRestricted = ({ onSignup, onLogin, t }: { onSignup: () => void, onLogin: () => void, t: any }) => (
  <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
    <div className="glass-panel p-10 rounded-3xl max-w-md relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl"></div>
      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
        <Lock className="w-8 h-8 text-slate-300" />
      </div>
      <h2 className="text-2xl font-serif text-white mb-2">{t.welcome.member}</h2>
      <p className="text-slate-400 mb-8">
        {t.profile.guestMsg}
      </p>
      <div className="space-y-3">
        <button 
          onClick={onSignup}
          className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-teal-900/20 flex items-center justify-center gap-2"
        >
          {t.auth.createAccount} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </button>
        <button 
          onClick={onLogin}
          className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-medium transition-all border border-white/10"
        >
          {t.welcome.login}
        </button>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.WELCOME);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('SIGNUP');
  const [authInitialRole, setAuthInitialRole] = useState<UserRole>('PATIENT');
  const [language, setLanguage] = useState<Language>('en');
  
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [dailyQuote, setDailyQuote] = useState<string>("");
  
  const [userRole, setUserRole] = useState<UserRole>('PATIENT');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '', age: '', gender: '', contact: '', phoneNumber: '', emergencyContact: '',
    diagnosis: '', history: '', treatmentNotes: '', avatar: ''
  });

  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const currentUserId = 'current_user_123'; 
  const isGuest = userProfile.name === 'Guest';
  const t = translations[language];

  useEffect(() => {
    // Initialize Language
    const savedLang = localStorage.getItem(STORAGE_KEYS.LANG) as Language;
    if (savedLang) setLanguage(savedLang);

    const hasVisited = localStorage.getItem(STORAGE_KEYS.HAS_VISITED);
    if (hasVisited === 'true') {
       setView(ViewState.HOME);
    }

    const savedMoods = localStorage.getItem(STORAGE_KEYS.MOODS);
    if (savedMoods) setMoods(JSON.parse(savedMoods));

    const savedChats = localStorage.getItem(STORAGE_KEYS.CHATS);
    if (savedChats) setChats(JSON.parse(savedChats));

    const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));

    const savedRole = localStorage.getItem(STORAGE_KEYS.ROLE);
    if (savedRole) setUserRole(savedRole as UserRole);

    const savedTherapists = localStorage.getItem(STORAGE_KEYS.THERAPISTS);
    if (savedTherapists) {
      setTherapists(JSON.parse(savedTherapists));
    } else {
      setTherapists(MOCK_THERAPISTS);
    }

    const savedCases = localStorage.getItem(STORAGE_KEYS.CASES);
    if (savedCases) {
      setCases(JSON.parse(savedCases));
    } else {
      setCases(MOCK_CASES);
    }

    const quotes = [
      "Healing comes in waves. It's okay to rest in the trough.",
      "Your peace is more important than driving yourself crazy trying to understand why.",
      "The wound is the place where the Light enters you. - Rumi",
      "You are not a drop in the ocean. You are the entire ocean in a drop. - Rumi"
    ];
    setDailyQuote(quotes[new Date().getDate() % quotes.length]);
  }, []);

  // RTL and Language Effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(moods)); }, [moods]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats)); }, [chats]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ROLE, userRole); }, [userRole]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.THERAPISTS, JSON.stringify(therapists)); }, [therapists]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases)); }, [cases]);

  // Notifications Helper
  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleStartJourney = (role: UserRole, title?: string) => {
    setUserRole(role);
    if (title) {
      setUserProfile(prev => ({ ...prev, name: title === 'Guest' ? 'Guest' : (title + (prev.name || '')) }));
    }
    
    localStorage.setItem(STORAGE_KEYS.HAS_VISITED, 'true');
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    setView(ViewState.HOME);
  };

  const handleNavigateToAuth = (mode: 'LOGIN' | 'SIGNUP', role?: UserRole) => {
    setAuthMode(mode);
    setAuthInitialRole(role || 'PATIENT');
    setView(ViewState.AUTH);
  };

  const handleRegisterTherapist = (data: Partial<Therapist>) => {
    const newTherapist: Therapist = {
      id: Date.now().toString(),
      name: data.name || 'New Applicant',
      specialization: data.specialization || 'Specialist',
      qualifications: data.qualifications || '',
      bio: data.bio || '',
      contact: data.contact || '',
      whatsapp: '',
      isApproved: false, 
      rating: 0,
      reviews: [],
      avatar: data.avatar
    };

    setTherapists(prev => [...prev, newTherapist]);
    
    setUserProfile(prev => ({ ...prev, name: newTherapist.name }));
    setUserRole('THERAPIST');
    localStorage.setItem(STORAGE_KEYS.HAS_VISITED, 'true');
    
    addNotification("Application Submitted. Your profile is pending approval.", "info");
    setView(ViewState.HOME);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.HAS_VISITED);
    setView(ViewState.WELCOME);
  };

  const handleAddMood = async (score: number, tags: string[], note: string) => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      score, tags, note
    };
    setMoods(prev => [...prev, newEntry]);
    
    if (score <= 2) {
      const meditation = await generateMeditation(tags[0] || "stress", language);
      setChats(prev => [...prev, {
          id: Date.now().toString(), role: 'model',
          text: `I noticed you're feeling a bit low (${tags.join(', ')}). Here is a gentle moment for you:\n\n${meditation}`,
          timestamp: Date.now()
      }]);
    }
    addNotification("Mood logged successfully", "success");
  };

  const handleUpdateTherapistStatus = (id: string, isApproved: boolean) => {
    setTherapists(prev => prev.map(t => t.id === id ? { ...t, isApproved } : t));
    addNotification(`Therapist status updated to ${isApproved ? 'Approved' : 'Rejected'}`, isApproved ? 'success' : 'info');
  };

  const handleSaveTherapistProfile = (data: Partial<Therapist>) => {
    setTherapists(prev => {
      const exists = prev.find(t => t.id === currentUserId);
      if (exists) {
        return prev.map(t => t.id === currentUserId ? { ...t, ...data } : t);
      } else {
        const newTherapist: Therapist = {
          id: currentUserId,
          name: data.name || 'New Therapist',
          specialization: data.specialization || 'Therapist',
          qualifications: data.qualifications || '',
          bio: data.bio || '',
          contact: data.contact || '',
          whatsapp: data.whatsapp || '',
          isApproved: false,
          rating: 0,
          reviews: [],
          avatar: data.avatar
        };
        return [...prev, newTherapist];
      }
    });
    addNotification(t.common.saved, "success");
  };

  const handleAddReview = (therapistId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    setTherapists(prev => prev.map(t => {
      if (t.id === therapistId) {
        const newReview: Review = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          ...reviewData
        };
        const newReviews = [...t.reviews, newReview];
        const avgRating = newReviews.reduce((acc, r) => acc + r.rating, 0) / newReviews.length;
        return { ...t, reviews: newReviews, rating: avgRating };
      }
      return t;
    }));
    addNotification("Review added successfully", "success");
  };

  const handleSaveCase = (caseFile: CaseFile) => {
    setCases(prev => {
      const exists = prev.some(c => c.id === caseFile.id);
      if (exists) {
        return prev.map(c => c.id === caseFile.id ? caseFile : c);
      }
      return [...prev, caseFile];
    });
    addNotification("Case file updated successfully", "success");
  };

  const renderContent = () => {
    if (isGuest) {
       if ([ViewState.MOOD, ViewState.THERAPISTS, ViewState.MANAGEMENT, ViewState.CASE_MANAGER].includes(view)) {
          return <GuestRestricted onSignup={() => handleNavigateToAuth('SIGNUP')} onLogin={() => handleNavigateToAuth('LOGIN')} t={t} />;
       }
    }

    switch (view) {
      case ViewState.WELCOME:
        return <WelcomePage onStartJourney={handleStartJourney} onNavigateToAuth={handleNavigateToAuth} lang={language} setLang={setLanguage} />;
      case ViewState.AUTH:
        return (
          <AuthPage 
            initialMode={authMode} 
            initialRole={authInitialRole}
            onLogin={handleStartJourney} 
            onRegisterTherapist={handleRegisterTherapist}
            onBack={() => setView(ViewState.WELCOME)}
            lang={language}
          />
        );
      case ViewState.CHAT:
        return <ChatInterface messages={chats} setMessages={setChats} lang={language} />;
      case ViewState.MOOD:
        return <MoodTracker entries={moods} onAddEntry={handleAddMood} lang={language} />;
      case ViewState.PROFILE:
        return (
          <ProfilePage 
            profile={userProfile} 
            onSaveProfile={(profile) => {
               setUserProfile(profile);
               addNotification(t.common.saved, 'success');
            }} 
            role={userRole}
            onChangeRole={setUserRole}
            therapistProfile={therapists.find(t => t.name === userProfile.name)}
            onSaveTherapist={handleSaveTherapistProfile}
            onLogout={handleLogout}
            onGuestSignup={() => handleNavigateToAuth('SIGNUP')}
            lang={language}
            setLang={setLanguage}
          />
        );
      case ViewState.THERAPISTS:
        return <TherapistDirectory therapists={therapists} onAddReview={handleAddReview} lang={language} />;
      case ViewState.MANAGEMENT:
        return <ManagementDashboard therapists={therapists} onUpdateStatus={handleUpdateTherapistStatus} lang={language} />;
      case ViewState.CASE_MANAGER:
        return <CaseManagerDashboard cases={cases} therapists={therapists} onSaveCase={handleSaveCase} />;
      case ViewState.HOME:
      default:
        return (
          <div className="flex flex-col h-full justify-center max-w-4xl mx-auto pt-10 pb-20 animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-12">
              <div className="inline-block mb-4 p-4 rounded-full bg-teal-500/10 ring-1 ring-teal-500/30 backdrop-blur-xl">
                <NafsLogo className="w-20 h-20" />
              </div>
              <h1 className="text-5xl font-serif font-medium text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-blue-200 mb-4 tracking-tight">
                 {userProfile.name === 'Guest' ? t.home.guestGreeting : (userProfile.name ? `${t.home.greeting} ${userProfile.name.split(' ')[0]}` : t.welcome.title)}
              </h1>
              <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto italic">"{dailyQuote}"</p>
              
              {userRole === 'THERAPIST' && (
                 <div className="mt-6">
                    {therapists.find(t => t.name === userProfile.name)?.isApproved ? (
                        <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                            {t.home.activeStaff} Verified
                        </span>
                    ) : (
                         <div className="max-w-md mx-auto bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                           <p className="text-amber-400 font-medium mb-1 flex items-center justify-center gap-2">
                             <Briefcase className="w-4 h-4" /> {t.home.pendingStaff}
                           </p>
                         </div>
                    )}
                 </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
               <div 
                 onClick={() => setView(ViewState.CHAT)}
                 className={`group glass-panel rounded-3xl p-8 cursor-pointer hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden ${isGuest ? 'md:col-span-3' : ''}`}
               >
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl group-hover:bg-teal-500/30 transition-all rtl:right-auto rtl:-left-10"></div>
                  <MessageCircle className="w-10 h-10 text-teal-300 mb-4" />
                  <h3 className="text-2xl font-serif text-white mb-2">{t.home.chatTitle}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{t.home.chatDesc}</p>
               </div>

               {!isGuest && (
                 <>
                   <div 
                     onClick={() => setView(ViewState.MOOD)}
                     className="group glass-panel rounded-3xl p-8 cursor-pointer hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
                   >
                      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all rtl:right-auto rtl:-left-10"></div>
                      <BarChart3 className="w-10 h-10 text-blue-300 mb-4" />
                      <h3 className="text-2xl font-serif text-white mb-2">{t.home.moodTitle}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{t.home.moodDesc}</p>
                   </div>

                   <div 
                     onClick={() => setView(ViewState.THERAPISTS)}
                     className="group glass-panel rounded-3xl p-8 cursor-pointer hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
                   >
                      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all rtl:right-auto rtl:-left-10"></div>
                      <Stethoscope className="w-10 h-10 text-purple-300 mb-4" />
                      <h3 className="text-2xl font-serif text-white mb-2">{t.home.helpTitle}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{t.home.helpDesc}</p>
                   </div>
                 </>
               )}
               
               {(!isGuest && (userRole === 'CASE_MANAGER' || userRole === 'THERAPIST')) && (
                 <div 
                   onClick={() => setView(ViewState.CASE_MANAGER)}
                   className="group glass-panel rounded-3xl p-8 cursor-pointer hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
                 >
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all rtl:right-auto rtl:-left-10"></div>
                    <Briefcase className="w-10 h-10 text-indigo-300 mb-4" />
                    <h3 className="text-2xl font-serif text-white mb-2">Case Management</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Access patient files, clinical directives, and doctor opinions.</p>
                 </div>
               )}

               {isGuest && (
                 <div 
                   onClick={() => handleNavigateToAuth('SIGNUP')}
                   className="md:col-span-3 group glass-panel rounded-3xl p-8 cursor-pointer hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden border-dashed border-teal-500/30"
                 >
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-teal-500/20 rounded-full">
                          <Lock className="w-6 h-6 text-teal-300" />
                       </div>
                       <div>
                          <h3 className="text-xl font-serif text-white">{t.home.unlockTitle}</h3>
                          <p className="text-slate-400 text-sm">{t.home.unlockDesc}</p>
                       </div>
                       <ArrowRight className="ml-auto w-6 h-6 text-slate-500 group-hover:text-white transition-colors rtl:rotate-180 rtl:mr-auto rtl:ml-0" />
                    </div>
                 </div>
               )}
            </div>

            <div className="mt-12 mx-auto">
               <div className="glass-panel px-8 py-4 rounded-full flex items-center gap-6">
                 <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">Community</span>
                 <div className="h-4 w-px bg-white/10"></div>
                 <div className="flex gap-3">
                   <SocialButton href="#" color="transparent" label="Facebook"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></SocialButton>
                   <SocialButton href="#" color="transparent" label="X"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></SocialButton>
                   <SocialButton href="#" color="transparent" label="Instagram"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></SocialButton>
                 </div>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative text-slate-100 font-light overflow-hidden">
      
      <NotificationToast notifications={notifications} removeNotification={removeNotification} />

      {(view !== ViewState.WELCOME && view !== ViewState.AUTH) && (
        <header className="fixed top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-[100] pointer-events-none bg-gradient-to-b from-black/60 via-black/30 to-transparent">
          
          <button 
            className="flex items-center gap-3 pointer-events-auto cursor-pointer group transition-all focus:outline-none" 
            onClick={() => setView(ViewState.HOME)}
            title="Go to Home Dashboard"
          >
            <div className="relative">
               <div className="absolute inset-0 bg-teal-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <NafsLogo className="w-10 h-10 relative z-10 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
            </div>
            <span className="font-serif font-bold text-xl tracking-wide text-slate-100 group-hover:text-teal-300 transition-colors shadow-black drop-shadow-md">Nafs</span>
          </button>
          
          <div className="flex items-center gap-3 pointer-events-auto">
             <button
               onClick={handleLogout}
               className="p-2.5 rounded-full bg-black/20 border border-white/10 text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all backdrop-blur-md group"
               title={t.common.logout}
             >
               <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform rtl:group-hover:translate-x-0.5" />
             </button>

            <button 
              className="flex items-center gap-3 glass-panel px-4 py-2 rounded-full cursor-pointer hover:bg-white/10 transition-all hover:border-teal-500/30"
              onClick={() => setView(ViewState.PROFILE)}
            >
              <div className="text-right hidden sm:block rtl:text-left">
                 <p className="text-xs text-teal-400 font-bold uppercase tracking-wider">{isGuest ? t.welcome.guest : (userRole === 'PATIENT' ? 'Member' : userRole.replace('_', ' '))}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/20 overflow-hidden shadow-inner">
                {userProfile.avatar ? (
                  <img src={userProfile.avatar} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><User className="w-4 h-4 text-slate-400" /></div>
                )}
              </div>
            </button>
          </div>
        </header>
      )}

      <main className={`flex-1 overflow-y-auto relative z-10 custom-scrollbar ${(view !== ViewState.WELCOME && view !== ViewState.AUTH) ? 'p-4 pb-32 pt-24' : ''}`}>
        {renderContent()}
      </main>

      {(view !== ViewState.WELCOME && view !== ViewState.AUTH) && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[60] w-full max-w-md px-4 animate-fade-in-up pointer-events-auto">
          <nav className="glass-panel rounded-full p-2 flex justify-between items-center shadow-2xl shadow-teal-900/20 border-white/10 backdrop-blur-xl">
            <DockIcon 
              active={view === ViewState.HOME} 
              onClick={() => setView(ViewState.HOME)} 
              icon={<Sparkles className="w-6 h-6" />} 
              label="Home" 
            />
            <DockIcon 
              active={view === ViewState.CHAT} 
              onClick={() => setView(ViewState.CHAT)} 
              icon={<MessageCircle className="w-6 h-6" />} 
              label="Chat" 
            />
            
            {!isGuest && (
              <DockIcon 
                active={view === ViewState.MOOD} 
                onClick={() => setView(ViewState.MOOD)} 
                icon={<BarChart3 className="w-6 h-6" />} 
                label="Mood" 
              />
            )}

            {!isGuest && (
              <DockIcon 
                active={view === ViewState.THERAPISTS} 
                onClick={() => setView(ViewState.THERAPISTS)} 
                icon={<Stethoscope className="w-6 h-6" />} 
                label="Help" 
              />
            )}

            {(!isGuest && (userRole === 'MANAGEMENT' || userRole === 'THERAPIST')) && (
              <DockIcon 
                active={view === ViewState.MANAGEMENT} 
                onClick={() => setView(ViewState.MANAGEMENT)} 
                icon={<Shield className="w-6 h-6" />} 
                label="Admin" 
              />
            )}
            {(!isGuest && (userRole === 'CASE_MANAGER' || userRole === 'THERAPIST')) && (
              <DockIcon 
                active={view === ViewState.CASE_MANAGER} 
                onClick={() => setView(ViewState.CASE_MANAGER)} 
                icon={<Briefcase className="w-6 h-6" />} 
                label="Cases" 
              />
            )}
          </nav>
        </div>
      )}

    </div>
  );
};

const DockIcon = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`relative group p-3 sm:px-6 rounded-full transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
      active 
        ? 'bg-teal-500/20 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.3)]' 
        : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
    }`}
    title={label}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
      {icon}
    </div>
    {active && <span className="absolute -bottom-1 w-1 h-1 bg-teal-400 rounded-full"></span>}
  </button>
);

export default App;
