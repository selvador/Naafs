
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MoodEntry, Language } from '../types';
import { Smile, Meh, Frown, Activity, Heart } from 'lucide-react';
import { translations } from '../translations';

interface MoodTrackerProps {
  entries: MoodEntry[];
  onAddEntry: (score: number, tags: string[], note: string) => void;
  lang: Language;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/90 backdrop-blur-md p-3 border border-white/10 shadow-xl rounded-lg text-white">
        <p className="text-sm font-medium text-slate-300">{new Date(data.timestamp).toLocaleDateString()}</p>
        <p className="text-teal-400 font-bold">Mood: {data.score}/5</p>
        {data.tags.length > 0 && (
          <p className="text-xs text-slate-400 mt-1">{data.tags.join(', ')}</p>
        )}
      </div>
    );
  }
  return null;
};

export const MoodTracker: React.FC<MoodTrackerProps> = ({ entries, onAddEntry, lang }) => {
  const [selectedScore, setSelectedScore] = useState<number>(3);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const t = translations[lang];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < 3) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const handleSubmit = () => {
    onAddEntry(selectedScore, selectedTags, note);
    setNote('');
    setSelectedTags([]);
  };

  const chartData = useMemo(() => {
    return [...entries]
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(entry => ({
        ...entry,
        date: new Date(entry.timestamp).toLocaleDateString(undefined, { weekday: 'short' })
      }));
  }, [entries]);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="glass-panel rounded-3xl p-8 shadow-2xl shadow-black/20">
        <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
          <Activity className="w-6 h-6 text-teal-400" />
          {t.mood.title}
        </h2>
        
        <div className="flex justify-between items-center mb-8 bg-black/20 p-4 rounded-2xl border border-white/5">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setSelectedScore(num)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                selectedScore === num 
                  ? 'bg-teal-600 text-white shadow-[0_0_20px_rgba(45,212,191,0.4)] scale-110' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {num === 1 ? <Frown className="w-5 h-5" /> :
               num === 3 ? <Meh className="w-5 h-5" /> :
               num === 5 ? <Smile className="w-5 h-5" /> :
               <span className="font-bold font-serif">{num}</span>}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {t.mood.tags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-full text-sm transition-all border ${
                selectedTags.includes(tag)
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-[0_0_10px_rgba(45,212,191,0.2)]'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t.mood.notePlaceholder}
          className="glass-input w-full p-4 rounded-xl text-slate-200 mb-6 resize-none text-sm placeholder:text-slate-600"
          rows={2}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3.5 rounded-xl hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2 shadow-lg shadow-teal-900/30"
        >
          <Heart className="w-4 h-4" />
          {t.mood.log}
        </button>
      </div>

      {entries.length > 1 && (
        <div className="glass-panel rounded-3xl p-8 shadow-2xl shadow-black/20 h-72">
          <h3 className="text-lg font-serif text-slate-300 mb-6">Emotional Rhythm</h3>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                tick={{fontSize: 12, fill: '#94a3b8'}} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                domain={[1, 5]} 
                hide 
              />
              <Tooltip content={<CustomTooltip />} cursor={{stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2}} />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#2dd4bf" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#0f172a', stroke: '#2dd4bf', strokeWidth: 2 }} 
                activeDot={{ r: 6, fill: '#2dd4bf' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
