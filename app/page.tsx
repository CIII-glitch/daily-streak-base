"use client";

import { useEffect, useState, useCallback } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

// Get today's date key for streak tracking
const getTodayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

// Get yesterday's date key
const getYesterdayKey = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
};

export default function Home() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [totalCheckIns, setTotalCheckIns] = useState(0);

  // Initialize MiniKit
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Load streak data from localStorage
  useEffect(() => {
    const savedStreak = localStorage.getItem("daily-streak-current");
    const savedLongest = localStorage.getItem("daily-streak-longest");
    const savedLastCheckIn = localStorage.getItem("daily-streak-last");
    const savedTotal = localStorage.getItem("daily-streak-total");
    
    const todayKey = getTodayKey();
    const yesterdayKey = getYesterdayKey();
    
    if (savedStreak) setStreak(parseInt(savedStreak) || 0);
    if (savedLongest) setLongestStreak(parseInt(savedLongest) || 0);
    if (savedTotal) setTotalCheckIns(parseInt(savedTotal) || 0);
    if (savedLastCheckIn) {
      setLastCheckIn(savedLastCheckIn);
      if (savedLastCheckIn === todayKey) {
        setCheckedInToday(true);
      } else if (savedLastCheckIn !== yesterdayKey && savedLastCheckIn !== todayKey) {
        // Streak broken - reset
        setStreak(0);
        localStorage.setItem("daily-streak-current", "0");
      }
    }
  }, []);

  // Handle check-in
  const handleCheckIn = useCallback(() => {
    if (checkedInToday) return;
    
    const todayKey = getTodayKey();
    const yesterdayKey = getYesterdayKey();
    
    let newStreak = 1;
    if (lastCheckIn === yesterdayKey) {
      newStreak = streak + 1;
    }
    
    const newLongest = Math.max(longestStreak, newStreak);
    const newTotal = totalCheckIns + 1;
    
    setStreak(newStreak);
    setLongestStreak(newLongest);
    setTotalCheckIns(newTotal);
    setCheckedInToday(true);
    setLastCheckIn(todayKey);
    setShowConfetti(true);
    
    localStorage.setItem("daily-streak-current", String(newStreak));
    localStorage.setItem("daily-streak-longest", String(newLongest));
    localStorage.setItem("daily-streak-last", todayKey);
    localStorage.setItem("daily-streak-total", String(newTotal));
    
    setTimeout(() => setShowConfetti(false), 2000);
  }, [checkedInToday, lastCheckIn, streak, longestStreak, totalCheckIns]);

  // Share results
  const shareStreak = () => {
    const text = `🔥 ${streak}-day streak on Daily Streak!\n\n📊 Total check-ins: ${totalCheckIns}\n🏆 Longest streak: ${longestStreak}\n\nCan you beat my streak?`;
    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // Get milestone message
  const getMilestoneMessage = () => {
    if (streak === 7) return "🎉 One week streak!";
    if (streak === 14) return "🔥 Two weeks strong!";
    if (streak === 30) return "👑 Monthly legend!";
    if (streak === 50) return "💎 50-day champion!";
    if (streak === 100) return "🏆 CENTURY CLUB!";
    if (streak === 365) return "🌟 FULL YEAR!";
    return null;
  };

  const milestone = getMilestoneMessage();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A1628] to-[#1E3A5F] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animationDelay: `${Math.random() * 0.5}s`,
                fontSize: `${Math.random() * 20 + 10}px`,
              }}
            >
              {["🔥", "⭐", "🎉", "✨", "💫"][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="text-center max-w-md w-full">
        {/* Logo/Title */}
        <div className="text-6xl mb-2">🔥</div>
        <h1 className="text-3xl font-bold text-orange-400 mb-1">Daily Streak</h1>
        <p className="text-gray-400 mb-8">Check in every day. Build your streak.</p>

        {/* Current Streak Display */}
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl p-8 mb-6 border border-orange-500/30">
          <div className="text-7xl font-bold text-orange-400 mb-2">
            {streak}
          </div>
          <p className="text-xl text-gray-300">day streak</p>
          
          {milestone && (
            <div className="mt-4 bg-yellow-500/20 rounded-xl p-3 text-yellow-300 font-semibold">
              {milestone}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#1E3A5F]/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{longestStreak}</div>
            <p className="text-sm text-gray-400">Longest Streak</p>
          </div>
          <div className="bg-[#1E3A5F]/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{totalCheckIns}</div>
            <p className="text-sm text-gray-400">Total Check-ins</p>
          </div>
        </div>

        {/* Check-in Button */}
        {checkedInToday ? (
          <div className="space-y-4">
            <div className="bg-green-600/20 border border-green-500/30 rounded-xl p-4">
              <p className="text-green-400 font-semibold">✓ Checked in today!</p>
              <p className="text-gray-400 text-sm mt-1">Come back tomorrow to continue your streak</p>
            </div>
            <button
              onClick={shareStreak}
              className="w-full bg-[#0052FF] hover:bg-[#0040CC] text-white px-6 py-4 rounded-xl font-semibold transition-colors"
            >
              Share Your Streak 🔗
            </button>
          </div>
        ) : (
          <button
            onClick={handleCheckIn}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-6 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-lg shadow-orange-500/25"
          >
            🔥 Check In Now
          </button>
        )}

        {/* User info */}
        {context?.user && (
          <p className="mt-6 text-gray-500 text-sm">
            Playing as @{context.user.username}
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall 2s ease-out forwards;
        }
      `}</style>
    </main>
  );
}
