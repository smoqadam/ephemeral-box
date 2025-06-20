"use client";

import { useState, useEffect, useRef } from "react";

export default function Timer() {
  const [mode, setMode] = useState<"timer" | "stopwatch">("timer");
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // in seconds
  const [timerInput, setTimerInput] = useState({ minutes: 5, seconds: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (mode === "timer") {
            if (prevTime <= 1) {
              setIsRunning(false);
              // Timer finished - you could add sound notification here
              return 0;
            }
            return prevTime - 1;
          } else {
            return prevTime + 1;
          }
        });
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
  }, [isRunning, mode]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const start = () => {
    if (mode === "timer" && time === 0) {
      setTime(timerInput.minutes * 60 + timerInput.seconds);
    }
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setTime(mode === "timer" ? 0 : 0);
  };

  const switchMode = (newMode: "timer" | "stopwatch") => {
    setMode(newMode);
    setIsRunning(false);
    setTime(0);
  };

  const addTime = (minutes: number) => {
    if (mode === "timer") {
      setTime(prevTime => prevTime + minutes * 60);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      {/* Mode Switch */}
      <div className="flex mb-8 bg-slate-200 rounded-lg p-1">
        <button
          onClick={() => switchMode("timer")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            mode === "timer" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
          }`}
        >
          Timer
        </button>
        <button
          onClick={() => switchMode("stopwatch")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            mode === "stopwatch" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
          }`}
        >
          Stopwatch
        </button>
      </div>

      {/* Timer Input (only for timer mode) */}
      {mode === "timer" && !isRunning && time === 0 && (
        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <label className="block text-sm font-medium text-slate-700 mb-2">Set Timer</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="59"
              value={timerInput.minutes}
              onChange={(e) => setTimerInput(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
              className="w-16 px-2 py-1 border border-slate-300 rounded text-center"
            />
            <span className="text-slate-600">min</span>
            <input
              type="number"
              min="0"
              max="59"
              value={timerInput.seconds}
              onChange={(e) => setTimerInput(prev => ({ ...prev, seconds: parseInt(e.target.value) || 0 }))}
              className="w-16 px-2 py-1 border border-slate-300 rounded text-center"
            />
            <span className="text-slate-600">sec</span>
          </div>
        </div>
      )}

      {/* Time Display */}
      <div className="text-center mb-8">
        <div className={`text-6xl font-mono font-bold ${
          mode === "timer" && time <= 10 && time > 0 ? "text-red-500" : "text-slate-800"
        }`}>
          {formatTime(time)}
        </div>
        {mode === "timer" && time === 0 && !isRunning && (
          <div className="text-red-500 font-medium mt-2">Time's up!</div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-6">
        {!isRunning ? (
          <button
            onClick={start}
            disabled={mode === "timer" && timerInput.minutes === 0 && timerInput.seconds === 0 && time === 0}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Start
          </button>
        ) : (
          <button
            onClick={pause}
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600"
          >
            Pause
          </button>
        )}
        <button
          onClick={reset}
          className="px-6 py-3 bg-slate-500 text-white rounded-lg font-medium hover:bg-slate-600"
        >
          Reset
        </button>
      </div>

      {/* Quick Timer Buttons (only for timer mode) */}
      {mode === "timer" && (
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => addTime(1)}
            className="py-2 bg-blue-100 text-blue-700 rounded font-medium hover:bg-blue-200"
          >
            +1 min
          </button>
          <button
            onClick={() => addTime(5)}
            className="py-2 bg-blue-100 text-blue-700 rounded font-medium hover:bg-blue-200"
          >
            +5 min
          </button>
          <button
            onClick={() => addTime(10)}
            className="py-2 bg-blue-100 text-blue-700 rounded font-medium hover:bg-blue-200"
          >
            +10 min
          </button>
        </div>
      )}
    </div>
  );
}
