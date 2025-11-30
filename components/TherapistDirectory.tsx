
import React, { useState, useMemo } from 'react';
import { Therapist, Review, Language } from '../types';
import { Star, User, CheckCircle, MapPin, MessageSquare, ArrowLeft, Phone, Mail, Filter, GraduationCap, Award, Briefcase, ScrollText } from 'lucide-react';
import { translations } from '../translations';

interface TherapistDirectoryProps {
  therapists: Therapist[];
  onAddReview: (therapistId: string, review: Omit<Review, 'id' | 'date'>) => void;
  lang: Language;
}

export const TherapistDirectory: React.FC<TherapistDirectoryProps> = ({ therapists, onAddReview, lang }) => {
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', authorName: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const t = translations[lang];

  const approvedTherapists = therapists.filter(t => t.isApproved);

  const specializations = useMemo(() => {
    const specs = new Set(approvedTherapists.map(t => t.specialization));
    return Array.from(specs).sort();
  }, [approvedTherapists]);

  const filteredTherapists = useMemo(() => {
    if (activeFilter === 'ALL') return approvedTherapists;
    return approvedTherapists.filter(t => t.specialization === activeFilter);
  }, [approvedTherapists, activeFilter]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTherapist && newReview.comment && newReview.authorName) {
      onAddReview(selectedTherapist.id, newReview);
      setNewReview({ rating: 5, comment: '', authorName: '' });
      setShowReviewForm(false);
    }
  };

  if (selectedTherapist) {
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <button 
          onClick={() => setSelectedTherapist(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t.common.back}
        </button>

        <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl shadow-black/30">
          <div className="p-8 border-b border-white/5 bg-gradient-to-r from-teal-900/20 to-transparent">
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="w-28 h-28 rounded-full border-4 border-white/10 overflow-hidden shadow-lg">
                {selectedTherapist.avatar ? (
                  <img src={selectedTherapist.avatar} alt={selectedTherapist.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center"><User className="w-12 h-12 text-slate-500" /></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-3xl font-serif text-white">{selectedTherapist.name}</h2>
                  <CheckCircle className="w-6 h-6 text-teal-400" />
                </div>
                <p className="text-teal-400 font-medium text-lg mb-3">{selectedTherapist.specialization}</p>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-200">{selectedTherapist.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="font-serif text-xl text-white mb-3">About</h3>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line font-light">{selectedTherapist.bio}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                   <h3 className="font-serif text-xl text-white">{t.therapist.reviews}</h3>
                   <button 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="text-sm font-medium text-teal-400 hover:text-teal-300"
                   >
                     {showReviewForm ? t.common.cancel : 'Add Review'}
                   </button>
                </div>

                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="glass-panel p-6 rounded-xl mb-6 animate-fade-in">
                    <div className="mb-4">
                      <input 
                        type="text" 
                        required
                        placeholder="Your Name"
                        value={newReview.authorName}
                        onChange={e => setNewReview({...newReview, authorName: e.target.value})}
                        className="glass-input w-full p-2 rounded-lg mb-3"
                      />
                       <textarea 
                        required
                        placeholder="Feedback..."
                        value={newReview.comment}
                        onChange={e => setNewReview({...newReview, comment: e.target.value})}
                        className="glass-input w-full p-2 rounded-lg resize-none"
                        rows={3}
                      />
                    </div>
                    <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-500 transition-colors">
                      Submit
                    </button>
                  </form>
                )}

                <div className="space-y-4">
                  {selectedTherapist.reviews.length === 0 ? (
                    <p className="text-slate-500 italic text-sm">No reviews yet.</p>
                  ) : (
                    selectedTherapist.reviews.map(review => (
                      <div key={review.id} className="border-b border-white/5 pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-200">{review.authorName}</span>
                        </div>
                        <p className="text-slate-400 text-sm">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
               <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-teal-500/20 transition-colors">
                  <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ScrollText className="w-32 h-32 text-teal-500" />
                  </div>

                  <h4 className="font-serif text-lg text-white mb-6 flex items-center gap-2 relative z-10">
                    <GraduationCap className="w-5 h-5 text-teal-400" />
                    {t.therapist.credentials}
                  </h4>
                  
                  <div className="space-y-4 relative z-10">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-300">
                              <Briefcase className="w-3.5 h-3.5" />
                           </div>
                           <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">{t.therapist.specialization}</p>
                        </div>
                        <p className="text-white font-medium pl-1">
                            {selectedTherapist.specialization}
                        </p>
                    </div>
                    
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="p-1.5 bg-purple-500/20 rounded-lg text-purple-300">
                              <Award className="w-3.5 h-3.5" />
                           </div>
                           <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">{t.therapist.qualifications}</p>
                        </div>
                        <p className="text-slate-200 font-light text-sm leading-relaxed pl-1">
                            {selectedTherapist.qualifications}
                        </p>
                    </div>
                  </div>
               </div>

               <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <h4 className="font-medium text-slate-200 mb-4">{t.therapist.connect}</h4>
                  <div className="space-y-3 mb-6">
                    {selectedTherapist.whatsapp ? (
                        <a 
                          href={`https://wa.me/${selectedTherapist.whatsapp}`} 
                          target="_blank"
                          rel="noreferrer"
                          className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-lg font-medium hover:bg-[#20bd5a] transition-colors shadow-lg shadow-green-900/20"
                        >
                           WhatsApp
                        </a>
                    ) : null}
                    {selectedTherapist.contact && (
                      <a 
                        href={`mailto:${selectedTherapist.contact}`}
                        className="w-full flex items-center justify-center gap-2 bg-transparent text-slate-300 border border-white/10 py-3 rounded-lg font-medium hover:bg-white/5 transition-colors"
                      >
                        <Mail className="w-5 h-5" /> Email
                      </a>
                    )}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif text-white mb-2">{t.therapist.title}</h2>
        <p className="text-slate-400 font-light">{t.therapist.subtitle}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-in">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
            activeFilter === 'ALL'
              ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-[0_0_10px_rgba(45,212,191,0.2)]'
              : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-slate-200'
          }`}
        >
          {t.therapist.all}
        </button>
        {specializations.map(spec => (
          <button
            key={spec}
            onClick={() => setActiveFilter(spec)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
              activeFilter === spec
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-[0_0_10px_rgba(45,212,191,0.2)]'
                : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-slate-200'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTherapists.length === 0 ? (
           <div className="col-span-full text-center py-12 glass-panel rounded-2xl border-dashed border-white/10">
             <p className="text-slate-500">{t.therapist.noSpecialists}</p>
           </div>
        ) : (
          filteredTherapists.map(therapist => (
            <div 
              key={therapist.id}
              onClick={() => setSelectedTherapist(therapist)}
              className="glass-panel rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl border-2 border-white/10 overflow-hidden">
                  {therapist.avatar ? (
                    <img src={therapist.avatar} alt={therapist.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center"><User className="w-6 h-6 text-slate-500" /></div>
                  )}
                </div>
                {therapist.rating > 0 && (
                  <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-amber-400">{therapist.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              
              <h3 className="font-serif text-xl text-white mb-1 group-hover:text-teal-300 transition-colors">
                {therapist.name}
              </h3>
              <p className="text-teal-500 text-sm font-medium mb-3 uppercase tracking-wide">{therapist.specialization}</p>
              <p className="text-slate-400 text-sm line-clamp-2 mb-6 font-light leading-relaxed">
                {therapist.bio}
              </p>
              
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> {therapist.reviews.length} {t.therapist.reviews}
                </span>
                <span className="text-teal-400 font-medium group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform flex items-center gap-1">
                  {t.therapist.viewProfile} →
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
    