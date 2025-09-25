
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Crown, Medal, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const LiveScoreboard = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Calculate school scores from all event winners
  const schoolMap: Record<string, { name: string; color: string; score: number; bgGradient: string }> = {
    'OUR LADY OF MERCY SCHOOL': { name: 'OUR LADY OF MERCY SCHOOL', color: 'red', score: 0, bgGradient: 'from-red-500 to-red-600' },
    'KRISTUJYOTHI INTERNATIONAL SCHOOL': { name: 'KRISTUJYOTHI INTERNATIONAL SCHOOL', color: 'blue', score: 0, bgGradient: 'from-blue-500 to-blue-600' },
    'JEEVAS CMI CENTRAL SCHOOL ALUVA': { name: 'JEEVAS CMI CENTRAL SCHOOL ALUVA', color: 'green', score: 0, bgGradient: 'from-green-500 to-green-600' },
    'DON BOSCO CENTRAL SCHOOL ALUVA': { name: 'DON BOSCO CENTRAL SCHOOL ALUVA', color: 'yellow', score: 0, bgGradient: 'from-yellow-500 to-yellow-600' },
    'AUXILIUM SCHOOL KIDANGOOR, ANGAMALY': { name: 'AUXILIUM SCHOOL KIDANGOOR, ANGAMALY', color: 'purple', score: 0, bgGradient: 'from-purple-500 to-purple-600' },
    'DON BOSCO SENIOR SECONDARY SCHOOL VADUTHALA': { name: 'DON BOSCO SENIOR SECONDARY SCHOOL VADUTHALA', color: 'indigo', score: 0, bgGradient: 'from-indigo-500 to-indigo-600' },
    'MAIRAM THRESIA PUBLIC SCHOOL': { name: 'MAIRAM THRESIA PUBLIC SCHOOL', color: 'pink', score: 0, bgGradient: 'from-pink-500 to-pink-600' },
    'VIMALA CENTRAL SCHOOL PERUMBAVOOR': { name: 'VIMALA CENTRAL SCHOOL PERUMBAVOOR', color: 'orange', score: 0, bgGradient: 'from-orange-500 to-orange-600' },
    'CHAVARA INTERNATIONAL VAZHAKULAM': { name: 'CHAVARA INTERNATIONAL VAZHAKULAM', color: 'teal', score: 0, bgGradient: 'from-teal-500 to-teal-600' },
    'ANITA PUBLIC SCHOOL THANNIPUZHA': { name: 'ANITA PUBLIC SCHOOL THANNIPUZHA', color: 'cyan', score: 0, bgGradient: 'from-cyan-500 to-cyan-600' },
    'SEVENTH DAY ADVENTIST HIGHER SECONDARY SCHOOL KALOOR': { name: 'SEVENTH DAY ADVENTIST HIGHER SECONDARY SCHOOL KALOOR', color: 'emerald', score: 0, bgGradient: 'from-emerald-500 to-emerald-600' },
    'VIMALAGIRI INTERNATIONAL SCHOOL MUVATTUPUZHA': { name: 'VIMALAGIRI INTERNATIONAL SCHOOL MUVATTUPUZHA', color: 'lime', score: 0, bgGradient: 'from-lime-500 to-lime-600' },
    'SANTHOME CENTRAL SCHOOL MOOKKANNOOR': { name: 'SANTHOME CENTRAL SCHOOL MOOKKANNOOR', color: 'amber', score: 0, bgGradient: 'from-amber-500 to-amber-600' },
    'MARY WARD ENGLISH MEDIUM SCHOOL': { name: 'MARY WARD ENGLISH MEDIUM SCHOOL', color: 'rose', score: 0, bgGradient: 'from-rose-500 to-rose-600' },
    'MAR ATHANASIUS INTERNATIONAL SCHOOL KOTHAMANGALAM': { name: 'MAR ATHANASIUS INTERNATIONAL SCHOOL KOTHAMANGALAM', color: 'violet', score: 0, bgGradient: 'from-violet-500 to-violet-600' },
    'VIDYA VIKAS SCHOOL': { name: 'VIDYA VIKAS SCHOOL', color: 'fuchsia', score: 0, bgGradient: 'from-fuchsia-500 to-fuchsia-600' },
    'JNANODAYA CENTRAL SCHOOL': { name: 'JNANODAYA CENTRAL SCHOOL', color: 'sky', score: 0, bgGradient: 'from-sky-500 to-sky-600' },
    'AUXILIUM ENGLISH MEDIUM SCHOOL': { name: 'AUXILIUM ENGLISH MEDIUM SCHOOL', color: 'slate', score: 0, bgGradient: 'from-slate-500 to-slate-600' },
    'ST. PATRICKS ACADEMY': { name: 'ST. PATRICKS ACADEMY', color: 'stone', score: 0, bgGradient: 'from-stone-500 to-stone-600' },
  };
  events.forEach((event: any) => {
    event.winners?.forEach((winner: any) => {
      if (schoolMap[winner.house]) {
        schoolMap[winner.house].score += winner.points;
      }
    });
  });
  const schools = Object.values(schoolMap);
  // Filter out schools with zero points and sort by score
  const schoolsWithPoints = schools.filter(school => school.score > 0);
  const maxScore = Math.max(...schoolsWithPoints.map(h => h.score), 1);
  const sortedSchools = [...schoolsWithPoints].sort((a, b) => b.score - a.score);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 1: return <Trophy className="h-6 w-6 text-gray-400" />;
      case 2: return <Medal className="h-6 w-6 text-orange-500" />;
      default: return <Award className="h-6 w-6 text-gray-300" />;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'border-yellow-400 shadow-yellow-100';
      case 1: return 'border-gray-300 shadow-gray-100';
      case 2: return 'border-orange-300 shadow-orange-100';
      default: return 'border-gray-200';
    }
  };

  return (
    <Card className="bg-white shadow-2xl border-0">
      <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center justify-center space-x-2">
          <Trophy className="h-8 w-8" />
          <span>Live School Standings</span>
        </CardTitle>
        <CardDescription className="text-blue-100">
          Updated in real-time • Last updated: {new Date().toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {sortedSchools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedSchools.map((school, index) => (
            <div 
              key={school.name}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${getRankColor(index)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getRankIcon(index)}
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 leading-tight">{school.name}</h3>
                    <p className="text-xs text-gray-500">#{index + 1} Position</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{school.score}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
              
              
              {index === 0 && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  LEADING
                </div>
              )}
            </div>
          ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">No schools have scored points yet.</p>
            <p className="text-gray-500 text-sm mt-2">Add event results to see school standings.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveScoreboard;
