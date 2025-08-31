import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, ArrowRight } from 'lucide-react';
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-slate-600 font-bold">{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
      default:
        return 'bg-white border-slate-200';
    }
  };

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
        backgroundImage: 'url(/s04.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8 w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">🏆 Leaderboard</h1>
            <p className="text-slate-600">Top 10 Dell AI Stack Champions</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading leaderboard...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Try again
              </button>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">No scores yet. Be the first to complete the challenge!</p>
            </div>
          ) : (
            <div className="space-y-3 mb-8">
              {leaderboard.map((user, index) => {
                const rank = index + 1;
                const userIsCurrentUser = isCurrentUser(user);
                
                return (
                  <div 
                    key={user.id || index}
                    className={`p-4 border rounded-lg transition-all duration-200 ${getRankStyle(rank)} ${
                      userIsCurrentUser ? 'ring-2 ring-blue-400 shadow-lg' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getRankIcon(rank)}
                        <div>
                          <h3 className={`font-semibold ${userIsCurrentUser ? 'text-blue-700' : 'text-slate-800'}`}>
                            {user.name}
                            {userIsCurrentUser && <span className="ml-2 text-sm text-blue-600">(You)</span>}
                          </h3>
                          <p className="text-sm text-slate-600">
                            Completed in {formatTime(user.score)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${userIsCurrentUser ? 'text-blue-700' : 'text-slate-800'}`}>
                          {formatTime(user.score)}
                        </div>
                        <div className="text-sm text-slate-500">time</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={onNext}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <span>View Results</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;