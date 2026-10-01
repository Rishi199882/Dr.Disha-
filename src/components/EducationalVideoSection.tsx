import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Subtitles, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Bookmark, 
  ArrowRight,
  Flame,
  HeartPulse,
  Dna
} from 'lucide-react';
import { CLINICAL_PROVIDER } from '../data/mockData';

interface Chapter {
  timeSec: number;
  timeLabel: string;
  title: string;
  summary: string;
  icon: 'dna' | 'pulse' | 'flame' | 'sparkle';
}

const CHAPTERS: Chapter[] = [
  {
    timeSec: 0,
    timeLabel: '00:00',
    title: 'The Silent Epidemic: Blood Sugar Swings & Cellular Fatigue',
    summary: 'How everyday refined carbohydrates and hidden fructose trigger postprandial glycemic excursions, spiking insulin and leading to chronic 3 PM exhaustion.',
    icon: 'flame'
  },
  {
    timeSec: 105,
    timeLabel: '01:45',
    title: 'Why Caloric Restriction Fails & Cellular Nourishment Wins',
    summary: 'Starvation diets crash basal metabolic rate (BMR). Targeted amino acids, polyphenols, and omega-3s stimulate mitochondrial biogenesis without metabolic slowdown.',
    icon: 'dna'
  },
  {
    timeSec: 200,
    timeLabel: '03:20',
    title: 'The 4-R Gut Barrier: Immunity, Neurotransmitters & Bloating',
    summary: 'Over 70% of the immune system resides in gut-associated lymphoid tissue (GALT). Learn how intestinal hyperpermeability triggers brain fog and systemic joint stiffness.',
    icon: 'pulse'
  },
  {
    timeSec: 300,
    timeLabel: '05:00',
    title: '4 Clinical Micro-Habits to Add 10+ Disease-Free Years',
    summary: 'Practical dietary architecture: 30g morning protein anchor, electrolyte-mineral osmolarity, 12-hour overnight digestive rest, and fiber diversity.',
    icon: 'sparkle'
  }
];

export const EducationalVideoSection: React.FC<{ onBookConsultation: () => void }> = ({ onBookConsultation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(380); // 6 mins 20 secs
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25 | 1.5>(1);
  const [showCaptions, setShowCaptions] = useState(true);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // Virtual video playback ticker
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, duration]);

  // Sync active chapter based on current time
  useEffect(() => {
    for (let i = CHAPTERS.length - 1; i >= 0; i--) {
      if (currentTime >= CHAPTERS[i].timeSec) {
        setActiveChapterIndex(i);
        break;
      }
    }
  }, [currentTime]);

  const handleSeek = (timeSec: number) => {
    setCurrentTime(timeSec);
    setIsPlaying(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentChapter = CHAPTERS[activeChapterIndex];

  return (
    <div className="bg-stone-900 text-stone-100 py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-stone-800 relative overflow-hidden">
      {/* Background ambient medical glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-950/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-md border border-emerald-800/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Masterclass with Dr. Disha</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-white font-bold tracking-tight">
            Why Nutritional Biochemistry Dictates Your Daily Energy & Lifespan
          </h2>
          <p className="text-sm text-stone-400 leading-relaxed">
            Not sure where to begin your wellness journey? Watch this 6-minute clinical orientation by Dr. Disha breaking down the real science behind metabolic exhaustion, food sensitivities, and sustainable cellular nourishment.
          </p>
        </div>

        {/* Video Player & Interactive Chapter Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Video Viewport (Col 8) */}
          <div className="lg:col-span-8 bg-stone-950 rounded-2xl border border-stone-800 overflow-hidden shadow-2xl flex flex-col justify-between">
            
            {/* Visual Canvas / Frame Simulation */}
            <div className="relative aspect-video bg-gradient-to-br from-stone-950 via-stone-900 to-emerald-950 flex flex-col justify-between p-6 sm:p-8 select-none">
              
              {/* Top Watermark / Status */}
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span>Clinical Education Series</span>
                </span>
                <span className="font-mono text-emerald-400 bg-stone-900/80 px-2 py-0.5 rounded border border-stone-700">
                  HD 1080p · 60fps
                </span>
              </div>

              {/* Center Play Button Overlay */}
              <div className="text-center my-auto space-y-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg hover:scale-105 transition-all cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                </button>
                <div className="text-xs text-stone-300 font-medium">
                  {isPlaying ? 'Playing Clinical Lecture' : 'Click to Watch Lesson with Dr. Disha'}
                </div>
              </div>

              {/* Dynamic Closed Captions */}
              {showCaptions && (
                <div className="bg-stone-950/90 border border-stone-700/80 rounded-xl p-3 max-w-xl mx-auto text-center text-xs text-stone-200 leading-relaxed shadow-lg">
                  <span className="text-emerald-400 font-semibold block text-[10px] uppercase tracking-wider mb-0.5">
                    Dr. Disha [Narrator]:
                  </span>
                  &ldquo;{currentChapter.summary}&rdquo;
                </div>
              )}
            </div>

            {/* Video Controls Bar */}
            <div className="p-4 bg-stone-900 border-t border-stone-800 space-y-3">
              
              {/* Progress Scrubber */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => setCurrentTime(Number(e.target.value))}
                  className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] font-mono text-stone-400">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-emerald-400 font-medium">{currentChapter.title}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setCurrentTime(0)}
                    className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
                    title="Restart from beginning"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Playback Speed */}
                  <div className="flex items-center gap-1 bg-stone-800 p-0.5 rounded-lg text-[11px] font-mono">
                    {([1, 1.25, 1.5] as const).map(speed => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`px-2 py-0.5 rounded font-medium ${
                          playbackSpeed === speed ? 'bg-emerald-700 text-white' : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>

                  {/* Captions Toggle */}
                  <button
                    onClick={() => setShowCaptions(!showCaptions)}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                      showCaptions ? 'text-emerald-400 bg-emerald-950/70 border border-emerald-800/80' : 'text-stone-400'
                    }`}
                  >
                    <Subtitles className="w-4 h-4" />
                    <span className="hidden sm:inline">CC</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Interactive Chapter Navigator & Takeaways (Col 4) */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-stone-950 rounded-2xl border border-stone-800 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Interactive Chapters</span>
                </span>
                <span className="text-[11px] text-stone-500 font-mono">4 Lessons</span>
              </div>

              <div className="space-y-2">
                {CHAPTERS.map((ch, idx) => {
                  const isActive = activeChapterIndex === idx;
                  return (
                    <div
                      key={ch.timeSec}
                      onClick={() => handleSeek(ch.timeSec)}
                      className={`cursor-pointer p-3 rounded-xl border text-xs transition-all space-y-1 ${
                        isActive
                          ? 'bg-emerald-950/60 border-emerald-600/80 text-white shadow-xs'
                          : 'bg-stone-900/60 border-stone-800/80 text-stone-400 hover:bg-stone-900 hover:text-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="text-emerald-400 font-semibold">{ch.timeLabel}</span>
                        {isActive && (
                          <span className="text-emerald-300 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            <span>Currently Playing</span>
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold leading-snug text-stone-100">{ch.title}</h4>
                      <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                        {ch.summary}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Consultation CTA */}
            <div className="p-5 bg-gradient-to-br from-emerald-950 to-stone-950 rounded-2xl border border-emerald-800/60 space-y-3">
              <h4 className="font-serif-display text-base font-bold text-white">
                Ready to Personalize This for Your Body?
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Skip the generic diets. Dr. Disha designs a custom metabolic protocol based on your real blood labs, microbiome, and CGM data.
              </p>
              <button
                onClick={onBookConsultation}
                className="w-full py-2.5 px-4 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Book Clinical Intake with Dr. Disha</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
