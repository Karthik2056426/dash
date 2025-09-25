import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from '@/components/ui/carousel';
import { ArrowLeft, Trophy, Medal, Award, Crown } from 'lucide-react';
import { useEventContext } from './EventContext';

interface CarouselViewProps {
  onBack: () => void;
}

const CarouselView = ({ onBack }: CarouselViewProps) => {
  const { events } = useEventContext();
  
  // Debug: Log events to console
  console.log('CarouselView - Events:', events);
  console.log('CarouselView - Events length:', events.length);
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
  events.forEach(event => {
    event.winners.forEach(winner => {
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
  let lastScore: number | undefined = undefined;
  let lastRank = 0;

  for (let i = 0; i < sortedSchools.length; i++) {
    const school = sortedSchools[i];

    if (lastScore === undefined) {
      // First item
      lastRank = 1;
      lastScore = school.score;
    } else if (school.score !== lastScore) {
      // New distinct score → increment rank by 1 (dense ranking)
      lastRank += 1;
      lastScore = school.score;
    }

    schoolsWithRanks.push({
      ...school,
      rank: lastRank,
    });
  }

  // Use events from context for the event carousel / latest winners panel
  const [api, setApi] = useState<CarouselApi>();

  // Auto-rotation enabled for event details
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000); // 4 seconds per slide

    return () => clearInterval(interval);
  }, [api]);

  const getSchoolColor = (school: string) => {
    const colors = {
      'OUR LADY OF MERCY SCHOOL': 'bg-red-100 text-red-800 border-red-200',
      'KRISTUJYOTHI INTERNATIONAL SCHOOL': 'bg-blue-100 text-blue-800 border-blue-200',
      'JEEVAS CMI CENTRAL SCHOOL ALUVA': 'bg-green-100 text-green-800 border-green-200',
      'DON BOSCO CENTRAL SCHOOL ALUVA': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'AUXILIUM SCHOOL KIDANGOOR, ANGAMALY': 'bg-purple-100 text-purple-800 border-purple-200',
      'DON BOSCO SENIOR SECONDARY SCHOOL VADUTHALA': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'MARIAM THRESIA PUBLIC SCHOOL': 'bg-pink-100 text-pink-800 border-pink-200',
      'VIMALA CENTRAL SCHOOL PERUMBAVOOR': 'bg-orange-100 text-orange-800 border-orange-200',
      'CHAVARA INTERNATIONAL VAZHAKULAM': 'bg-teal-100 text-teal-800 border-teal-200',
      'ANITA PUBLIC SCHOOL THANNIPUZHA': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'SEVENTH DAY ADVENTIST HIGHER SECONDARY SCHOOL KALOOR': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'VIMALAGIRI INTERNATIONAL SCHOOL MUVATTUPUZHA': 'bg-lime-100 text-lime-800 border-lime-200',
      'SANTHOME CENTRAL SCHOOL MOOKKANNOOR': 'bg-amber-100 text-amber-800 border-amber-200',
      'MARY WARD ENGLISH MEDIUM SCHOOL': 'bg-rose-100 text-rose-800 border-rose-200',
      'MAR ATHANASIUS INTERNATIONAL SCHOOL KOTHAMANGALAM': 'bg-violet-100 text-violet-800 border-violet-200',
      'VIDYA VIKAS SCHOOL': 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
      'JNANODAYA CENTRAL SCHOOL': 'bg-sky-100 text-sky-800 border-sky-200',
      'AUXILIUM ENGLISH MEDIUM SCHOOL': 'bg-slate-100 text-slate-800 border-slate-200',
      'ST. PATRICKS ACADEMY': 'bg-stone-100 text-stone-800 border-stone-200'
    };
    return colors[school as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-orange-500" />;
      case 4: return <Award className="h-5 w-5 text-green-500" />; // A+ position
      default: return null;
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 1: return <Trophy className="h-5 w-5 text-gray-400" />;
      case 2: return <Medal className="h-5 w-5 text-orange-500" />;
      default: return <Award className="h-5 w-5 text-gray-300" />;
    }
  };

  // Latest event and its top 3 winners (by position)
  const latestEvent = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  const topWinners = latestEvent ? [...latestEvent.winners].sort((a, b) => a.position - b.position).slice(0, 3) : [];

  return (
    <>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
      {/* Main Content - Split Layout */}
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Left Sidebar - School Standings (65%) */}
        <div className="w-full lg:w-[65%] bg-black/10 backdrop-blur-sm border-r border-white/10 p-2 sm:p-4 flex flex-col">
          {/* Top 3 Ranks - Static (only show if they have scores) */}
          {schoolsWithRanks.filter(school => school.score > 0).length > 0 && (
            <div className="space-y-1 mb-4">
              {schoolsWithRanks
                .filter(school => school.score > 0)
                .slice(0, 3)
                .map((school) => {
                  const borderGradient = school.rank === 1
                    ? 'from-yellow-400 via-yellow-300 to-yellow-500'
                    : school.rank === 2
                    ? 'from-sky-400 via-indigo-400 to-sky-500'
                    : 'from-fuchsia-500 via-purple-500 to-orange-400';
                  return (
                    <div key={school.name} className={`rounded-xl p-[2px] bg-gradient-to-r ${borderGradient}`}>
                      <div className="rounded-[10px] bg-black/40 px-3 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-xs shrink-0">
                            {school.rank}
                          </div>
                          <div className="min-w-0">
                            <div className="text-white font-semibold text-xl">
                              {school.name}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sky-300 text-2xl font-bold">{school.score}</div>
                          <div className="text-white/60 text-xs">pts</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* All Schools - Vertical Carousel */}
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="space-y-1 animate-scroll">
                {schoolsWithRanks.map((school) => (
                  <div key={school.name} className="rounded-xl p-[2px] bg-gradient-to-r from-slate-600 to-slate-700">
                    <div className="rounded-[10px] bg-black/40 px-3 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {school.rank}
                        </div>
                        <div className="min-w-0">
                          <div className="text-white font-semibold text-lg">
                            {school.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sky-300 text-2xl font-bold">{school.score}</div>
                        <div className="text-white/60 text-xs">pts</div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {schoolsWithRanks.map((school) => (
                  <div key={`${school.name}-duplicate`} className="rounded-xl p-[2px] bg-gradient-to-r from-slate-600 to-slate-700">
                    <div className="rounded-[10px] bg-black/40 px-3 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {school.rank}
                        </div>
                        <div className="min-w-0">
                          <div className="text-white font-semibold text-lg">
                            {school.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sky-300 text-2xl font-bold">{school.score}</div>
                        <div className="text-white/60 text-xs">pts</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Top Winners (35%) */}
        <div className="w-full lg:w-[35%] bg-black/5 backdrop-blur-sm p-2 sm:p-4">
          <div className="h-full flex flex-col relative">
            {/* Logo images at the top */}
            <div className="flex justify-between items-center mb-4">
              <img 
                src="/colablogo.png" 
                alt="Colab Logo" 
                className="h-32 w-auto opacity-80"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <img 
                src="/mainlogo.png" 
                alt="Main Logo" 
                className="h-24 w-auto opacity-80"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            <div className="flex-1 pt-16">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-full">
                <CardContent className="p-6 h-full">
                  <h3 className="text-white text-xl font-bold mb-6">Top Winners</h3>
                  {events.length > 0 ? (
                    <Carousel className="w-full h-full" setApi={setApi} opts={{ loop: true, skipSnaps: false, dragFree: false }}>
                      <CarouselContent className="h-full">
                        {events.map((event) => (
                          <CarouselItem key={event.id} className="h-full">
                            <div className="h-full flex flex-col">
                              <div className="text-center mb-4">
                                <h4 className="text-white text-lg font-semibold">{event.name}</h4>
                                <p className="text-white/70 text-sm">{event.category}</p>
                              </div>
                              <div className="flex-1 grid grid-cols-3 gap-4">
                                {event.winners
                                  .sort((a, b) => b.points - a.points)
                                  .slice(0, 3)
                                  .map((winner, index) => (
                                    <div key={winner.position} className="text-center">
                                      <div className="relative mx-auto mb-3 h-20 w-20 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
                                        <img
                                          src={winner.photo || '/placeholder.svg'}
                                          alt={winner.name}
                                          className="h-full w-full object-cover"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            if (target.src !== '/placeholder.svg') target.src = '/placeholder.svg';
                                          }}
                                        />
                                      </div>
                                      <div className="text-white font-semibold leading-tight truncate">{winner.name}</div>
                                      <div className="text-white/70 text-xs truncate">{winner.school}</div>
                                      <div className="text-sky-300 font-bold text-xl mt-1">{winner.points}</div>
                                      <div className="text-white/60 text-xs">points</div>
                                      <div className="mt-2 inline-block rounded-full px-3 py-1 text-[10px] font-bold bg-white/10 text-white border border-white/20">
                                        {winner.position === 1 ? '1ST' : winner.position === 2 ? '2ND' : winner.position === 3 ? '3RD' : 'A+'}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  ) : (
                    <div className="h-full flex items-center justify-center text-white/70">No events yet</div>
                  )}

                  <div className="mt-6 w-full flex items-center justify-center text-white/70 text-sm">
                    <Trophy className="h-6 w-6 text-white/60 mr-2" />
                    Congratulations to our top performers!
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>

      {/* Back Button - Bottom Right */}
      <Button 
        onClick={onBack}
        className="fixed bottom-6 right-6 text-white hover:text-white/80 z-50"
        size="lg"
        variant="ghost"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </Button>
      </div>
    </>
  );
};

export default CarouselView;
