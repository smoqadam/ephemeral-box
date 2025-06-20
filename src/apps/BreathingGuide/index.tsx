"use client";

import { useState, useEffect, useRef } from "react";

type BreathingPattern = {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdExhale?: number;
};

const breathingPatterns: BreathingPattern[] = [
  { name: "4-7-8 Relaxing", inhale: 4, hold: 7, exhale: 8 },
  { name: "Box Breathing", inhale: 4, hold: 4, exhale: 4, holdExhale: 4 },
  { name: "4-4-4 Simple", inhale: 4, hold: 4, exhale: 4 },
  { name: "Triangle Breathing", inhale: 4, hold: 4, exhale: 4 },
  { name: "Energizing 4-4-6", inhale: 4, hold: 4, exhale: 6 },
];

export default function BreathingGuide() {
  const [selectedPattern, setSelectedPattern] = useState(breathingPatterns[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold" | "exhale" | "holdExhale">("inhale");
  const [timeLeft, setTimeLeft] = useState(selectedPattern.inhale);
  const [cycle, setCycle] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(5); // minutes
  const [showGuide, setShowGuide] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Move to next phase
            const pattern = selectedPattern;
            let nextPhase: typeof currentPhase;
            let nextDuration: number;

            switch (currentPhase) {
              case "inhale":
                nextPhase = "hold";
                nextDuration = pattern.hold;
                break;
              case "hold":
                nextPhase = "exhale";
                nextDuration = pattern.exhale;
                break;
              case "exhale":
                if (pattern.holdExhale) {
                  nextPhase = "holdExhale";
                  nextDuration = pattern.holdExhale;
                } else {
                  nextPhase = "inhale";
                  nextDuration = pattern.inhale;
                  setCycle(c => c + 1);
                }
                break;
              case "holdExhale":
                nextPhase = "inhale";
                nextDuration = pattern.inhale;
                setCycle(c => c + 1);
                break;
            }

            setCurrentPhase(nextPhase);
            playSound();
            return nextDuration;
          }
          return prev - 1;
        });

        setTotalTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, currentPhase, selectedPattern]);

  // Auto-stop after session duration
  useEffect(() => {
    if (totalTime >= sessionDuration * 60 && isActive) {
      setIsActive(false);
    }
  }, [totalTime, sessionDuration, isActive]);

  const playSound = () => {
    // Create a simple beep sound
    if (typeof window !== 'undefined') {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = currentPhase === "inhale" ? 440 : 220;
      oscillator.type = "sine";
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  };

  const start = () => {
    setIsActive(true);
    setCurrentPhase("inhale");
    setTimeLeft(selectedPattern.inhale);
    setCycle(0);
    setTotalTime(0);
  };

  const stop = () => {
    setIsActive(false);
    setCurrentPhase("inhale");
    setTimeLeft(selectedPattern.inhale);
    setCycle(0);
    setTotalTime(0);
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case "inhale": return "Breathe In";
      case "hold": return "Hold";
      case "exhale": return "Breathe Out";
      case "holdExhale": return "Hold Empty";
    }
  };

  const getCircleScale = () => {
    const progress = (selectedPattern[currentPhase] - timeLeft) / selectedPattern[currentPhase];
    
    switch (currentPhase) {
      case "inhale":
        return 0.5 + (progress * 0.5); // Scale from 0.5 to 1
      case "exhale":
        return 1 - (progress * 0.5); // Scale from 1 to 0.5
      case "hold":
      case "holdExhale":
        return currentPhase === "hold" ? 1 : 0.5; // Stay at current size
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <h1 className="text-lg font-semibold text-slate-800 mb-4">Breathing Guide</h1>
        
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Pattern:</label>
            <select
              value={selectedPattern.name}
              onChange={(e) => {
                const pattern = breathingPatterns.find(p => p.name === e.target.value);
                if (pattern) {
                  setSelectedPattern(pattern);
                  if (!isActive) {
                    setTimeLeft(pattern.inhale);
                  }
                }
              }}
              disabled={isActive}
              className="px-3 py-1 border border-slate-300 rounded text-sm"
            >
              {breathingPatterns.map(pattern => (
                <option key={pattern.name} value={pattern.name}>{pattern.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Session:</label>
            <input
              type="number"
              min="1"
              max="60"
              value={sessionDuration}
              onChange={(e) => setSessionDuration(Number(e.target.value))}
              disabled={isActive}
              className="w-16 px-2 py-1 border border-slate-300 rounded text-sm text-center"
            />
            <span className="text-sm text-slate-600">min</span>
          </div>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-sm hover:bg-slate-300"
          >
            {showGuide ? "Hide" : "Show"} Guide
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Breathing Circle */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="relative mb-8">
            <div
              className={`w-64 h-64 rounded-full border-4 transition-all duration-1000 ease-in-out ${
                currentPhase === "inhale" 
                  ? "bg-blue-100 border-blue-400" 
                  : currentPhase === "exhale"
                  ? "bg-green-100 border-green-400"
                  : "bg-purple-100 border-purple-400"
              }`}
              style={{
                transform: `scale(${getCircleScale()})`,
                filter: `blur(${isActive ? 0 : 2}px)`
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-slate-800 mb-2">
                {getPhaseText()}
              </div>
              <div className="text-4xl font-mono font-bold text-slate-600">
                {timeLeft}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mb-4">
            {!isActive ? (
              <button
                onClick={start}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
              >
                Start Session
              </button>
            ) : (
              <button
                onClick={stop}
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
              >
                Stop
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="text-center text-slate-600">
            <div className="text-sm">
              Cycle: {cycle} | Time: {formatTime(totalTime)} / {formatTime(sessionDuration * 60)}
            </div>
            {isActive && (
              <div className="text-xs mt-1">
                {Math.round(((sessionDuration * 60 - totalTime) / (sessionDuration * 60)) * 100)}% remaining
              </div>
            )}
          </div>
        </div>

        {/* Instructions Panel */}
        {showGuide && (
          <div className="w-80 border-l border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">How to Use</h2>
            
            <div className="space-y-4 text-sm text-slate-700">
              <div>
                <h3 className="font-medium mb-2">Current Pattern: {selectedPattern.name}</h3>
                <ul className="space-y-1 text-xs">
                  <li>• Inhale: {selectedPattern.inhale}s</li>
                  <li>• Hold: {selectedPattern.hold}s</li>
                  <li>• Exhale: {selectedPattern.exhale}s</li>
                  {selectedPattern.holdExhale && <li>• Hold Empty: {selectedPattern.holdExhale}s</li>}
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Instructions</h3>
                <ol className="space-y-2 text-xs">
                  <li>1. Sit comfortably with your back straight</li>
                  <li>2. Close your eyes or soften your gaze</li>
                  <li>3. Follow the visual circle and text cues</li>
                  <li>4. Breathe naturally, don't force it</li>
                  <li>5. A gentle sound marks each phase transition</li>
                </ol>
              </div>

              <div>
                <h3 className="font-medium mb-2">Benefits</h3>
                <ul className="space-y-1 text-xs">
                  <li>• Reduces stress and anxiety</li>
                  <li>• Improves focus and concentration</li>
                  <li>• Lowers heart rate and blood pressure</li>
                  <li>• Promotes relaxation and sleep</li>
                </ul>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-xs text-blue-800">
                  💡 <strong>Tip:</strong> Start with shorter sessions (2-3 minutes) and gradually increase duration as you become more comfortable.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
