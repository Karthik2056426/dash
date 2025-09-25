
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
    'MARIAM THRESIA PUBLIC SCHOOL': { name: 'MARIAM THRESIA PUBLIC SCHOOL', color: 'pink', score: 0, bgGradient: 'from-pink-500 to-pink-600' },
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
      if (schoolMap[winner.school]) {
        schoolMap[winner.school].score += winner.points;
      }
    });
  });
  const schools = Object.values(schoolMap);
  // Sort all schools by score (including those with 0 points)
  const sortedSchools = [...schools].sort((a, b) => b.score - a.score);
  
  // Calculate ranks with proper tie handling - dense ranking (1,1,2,3)
  const schoolsWithRanks = [] as Array<{ name: string; color: string; score: number; bgGradient: string; rank: number }>;
  let currentRank = 1;
  
  for (let i = 0; i < sortedSchools.length; i++) {
    const school = sortedSchools[i];
    
    // If this is not the first school and has different score than previous, increment rank
    if (i > 0 && school.score !== sortedSchools[i - 1].score) {
      currentRank = i + 1;
    }
    
    schoolsWithRanks.push({
      ...school,
      rank: currentRank
    });
  }

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
        <div className="space-y-4 sm:space-y-6">
          {/* First Row - 10 Schools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10 gap-2 sm:gap-3">
            {schoolsWithRanks.slice(0, 10).map((school, index) => (
              <div 
                key={school.name}
                className={`relative p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${getRankColor(index)}`}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getRankIcon(index)}
                    <span className="ml-1 text-xs font-bold text-gray-600">#{school.rank}</span>
                  </div>
                  <h3 className="text-xs font-bold text-gray-800 leading-tight mb-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{school.name}</h3>
                  <div className="text-lg font-bold text-gray-900">{school.score}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
                
                {index === 0 && school.score > 0 && (
                  <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                    LEADING
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Second Row - 9 Schools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-2 sm:gap-3">
            {schoolsWithRanks.slice(10, 19).map((school, index) => (
              <div 
                key={school.name}
                className={`relative p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${getRankColor(index + 10)}`}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getRankIcon(index + 10)}
                    <span className="ml-1 text-xs font-bold text-gray-600">#{school.rank}</span>
                  </div>
                  <h3 className="text-xs font-bold text-gray-800 leading-tight mb-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{school.name}</h3>
                  <div className="text-lg font-bold text-gray-900">{school.score}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveScoreboard;
