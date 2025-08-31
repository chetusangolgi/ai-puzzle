import React, { useState, useEffect } from 'react';
import { getLeaderboard, UserData } from '../lib/supabase';

interface LeaderboardProps {
  onNext: () => void;
  currentUser?: {
    name: string;
    score: number;
  };
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onNext, currentUser }) => {
  const [leaderboard, setLeaderboard] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        setError('Failed to load leaderboard');
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onNext]);


  const isCurrentUser = (user: UserData) => {
    return currentUser && user.name === currentUser.name && user.score === currentUser.score;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="min-h-screen p-4 flex flex-col"
      style={{
        backgroundImage: 'url(/leader.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="flex-1 flex items-center justify-center relative">
        {currentUser && (
          <div className="absolute left-8 top-1/2 -translate-y-1/2  p-6 max-w-xl text-6xl" style={{ fontFamily: 'Roboto' }}>
           
            <p className="text-slate-700 font-light">
              <span>{currentUser.name.charAt(0).toUpperCase() + currentUser.name.slice(1)}</span> you took{' '}
              <span className="font-bold ">{formatTime(currentUser.score)}</span>{' '}
              <span className="font-bold">seconds</span> to complete
            </p>
          </div>
        )}
        <div className="rounded-lg p-8 w-full max-w-5xl ml-[800px]" style={{ fontFamily: 'Roboto' }}>
          

          {loading ? (
            <div className="text-center py-12" style={{ fontFamily: 'Roboto' }}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-600 font-light">Loading leaderboard...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12" style={{ fontFamily: 'Roboto' }}>
              <p className="text-red-600 mb-4 font-light">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-blue-600 hover:text-blue-700 underline font-light"
              >
                Try again
              </button>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12" style={{ fontFamily: 'Roboto' }}>
              <p className="text-slate-600 mb-4 font-light">No scores yet. Be the first to complete the challenge!</p>
            </div>
          ) : (
            <>
            
              
              
            
            
              <div className="mb-6 flex items-center">
                <div className="w-[16px] h-[54px] bg-[#1D2C3B] mr-8"></div>
                <div>
                  <h1 className="text-[64px] font-light text-[#1D2C3B] font-sans">
                    Top Players
                  </h1>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 pb-4 text-[#1D2C3B]">
                <div className="flex items-center space-x-32">
                  <span className="w-[24px] text-3xl font-light" style={{ fontFamily: 'Roboto' }}>
                    Rank
                  </span>
                  <span className="w-[24px] text-3xl font-light" style={{ fontFamily: 'Roboto' }}>
                    Name
                  </span>
                </div>
                <span className="w-[24px] text-3xl font-light text-right mr-[30px]" style={{ fontFamily: 'Roboto' }}>
                  Score
                </span>
              </div>
              <div className="space-y-1">
              {leaderboard.map((user, index) => {
                const rank = index + 1;
                const userIsCurrentUser = isCurrentUser(user);
                const isTopThree = rank <= 3;
                
                return (
                  <div 
                    key={user.id || index}
                    className={`p-4  transition-all duration-200 ${
                      userIsCurrentUser ? 'ring-2 ring-blue-400 shadow-lg' : ''
                    }`}
                    style={{ backgroundColor: '#1D2C3B' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-32">
                        <span className={`w-8 h-8 flex items-center justify-center text-white text-2xl font-light ${isTopThree ? 'font-semibold' : ''}`} style={{ fontFamily: 'Roboto' }}>
                          {rank.toString().padStart(2, '0')}
                        </span>
                        <div className={`text-white text-2xl font-light ${isTopThree ? 'font-semibold' : ''}`} style={{ fontFamily: 'Roboto' }}>
                          {user.name}
                        </div>
                      </div>
                      <div className={`text-white text-2xl font-light text-right ${isTopThree ? 'font-semibold' : ''}`} style={{ fontFamily: 'Roboto' }}>
                        {formatTime(user.score)}
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Leaderboard;