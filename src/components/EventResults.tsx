
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Medal, Award, Search, Filter, Calendar, Users } from 'lucide-react';
import { useState } from 'react';
import { useEventContext } from './EventContext';

const EventResults = () => {
  const { events } = useEventContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');

  const getSchoolColor = (school: string) => {
    const colors = {
      'OUR LADY OF MERCY SCHOOL': 'bg-red-100 text-red-800 border-red-200',
      'KRISTUJYOTHI INTERNATIONAL SCHOOL': 'bg-blue-100 text-blue-800 border-blue-200',
      'JEEVAS CMI CENTRAL SCHOOL ALUVA': 'bg-green-100 text-green-800 border-green-200',
      'DON BOSCO CENTRAL SCHOOL ALUVA': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'AUXILIUM SCHOOL KIDANGOOR, ANGAMALY': 'bg-purple-100 text-purple-800 border-purple-200',
      'DON BOSCO SENIOR SECONDARY SCHOOL VADUTHALA': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'MAIRAM THRESIA PUBLIC SCHOOL': 'bg-pink-100 text-pink-800 border-pink-200',
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
      case 1: return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 2: return <Medal className="h-4 w-4 text-gray-400" />;
      case 3: return <Award className="h-4 w-4 text-orange-500" />;
      case 4: return <Award className="h-4 w-4 text-green-500" />; // A+ position
      default: return null;
    }
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    const matchesGrade = filterGrade === 'all' || event.gradeLevel === filterGrade;
    return matchesSearch && matchesCategory && matchesGrade;
  });

  return (
    <Card className="bg-white shadow-xl">
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span>Event Results</span>
            </CardTitle>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Group">Group</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterGrade} onValueChange={setFilterGrade}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="Junior">Junior</SelectItem>
                <SelectItem value="Middle">Middle</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
                  <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </span>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{event.category}</span>
                    </Badge>
                    <Badge variant="secondary">{event.gradeLevel}</Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {event.winners.map((winner) => (
                  <div 
                    key={winner.position}
                    className="p-4 rounded-lg border-2 border-dashed hover:border-solid transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getPositionIcon(winner.position)}
                        <span className="font-semibold text-gray-700">
                          {winner.position === 1 ? '1st' : winner.position === 2 ? '2nd' : winner.position === 3 ? '3rd' : winner.position === 4 ? 'A+' : `${winner.position}th`} Place
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{winner.points} pts</span>
                    </div>
                    <div className="space-y-2">
                      <Badge className={getSchoolColor(winner.house)}>{winner.house}</Badge>
                      <p className="font-medium text-gray-800">{winner.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventResults;
