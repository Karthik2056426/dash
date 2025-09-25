
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Calendar, Award, BarChart3, Settings, Presentation, Menu, X } from 'lucide-react';
import LiveScoreboard from '@/components/LiveScoreboard';
import EventResults from '@/components/EventResults';
import AdminDashboard from '@/components/AdminDashboard';
import AdminLogin from '@/components/AdminLogin';
import CarouselView from '@/components/CarouselView';
import { useEventContext } from '../components/EventContext';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const Index = () => {
  const [activeView, setActiveView] = useState<'public' | 'admin' | 'carousel' | 'login'>('public');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { events } = useEventContext();

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Calculate stats
  const totalEvents = events.length;
  // Participants: count unique winner names across all events
  const participants = Array.from(new Set(events.flatMap(e => e.winners.map(w => w.name)))).length;
  // Awards: total number of winner entries
  const awards = events.reduce((sum, e) => sum + e.winners.length, 0);
  // Avg Score per school
  const schoolScores: Record<string, number> = {};
  events.forEach(e => {
    e.winners.forEach(w => {
      schoolScores[w.school] = (schoolScores[w.school] || 0) + w.points;
    });
  });
  const avgScore = Object.values(schoolScores).length > 0 ? Math.round(Object.values(schoolScores).reduce((a, b) => a + b, 0) / Object.values(schoolScores).length) : 0;

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setActiveView('admin');
    } else {
      setActiveView('login');
    }
  };

  const handleLogin = () => {
    setActiveView('admin');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActiveView('public');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (activeView === 'login') {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (activeView === 'admin') {
    return <AdminDashboard onBack={handleLogout} />;
  }

  if (activeView === 'carousel') {
    return <CarouselView onBack={() => setActiveView('public')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-gradient-to-r from-blue-500 to-purple-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 sm:p-3 rounded-lg">
                <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Rangolsav 2025-'26</h1>
                <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Live Scoring & Results Dashboard</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-2">
              <Button 
                onClick={() => setActiveView('carousel')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Presentation className="h-4 w-4" />
                <span>Carousel View</span>
              </Button>
              <Button 
                onClick={handleAdminClick}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="flex flex-col space-y-2 pt-4">
                <Button 
                  onClick={() => {
                    setActiveView('carousel');
                    setMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="flex items-center space-x-2 justify-start"
                >
                  <Presentation className="h-4 w-4" />
                  <span>Carousel View</span>
                </Button>
                <Button 
                  onClick={() => {
                    handleAdminClick();
                    setMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="flex items-center space-x-2 justify-start"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Live Scoreboard */}
        <LiveScoreboard />
        
        {/* Event Results */}
        <EventResults />
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Total Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalEvents}</div>
              <p className="text-red-100">This semester</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Participants</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{participants}</div>
              <p className="text-blue-100">Active students</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Awards</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{awards}</div>
              <p className="text-green-100">Given out</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Avg Score</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgScore}</div>
              <p className="text-purple-100">Per house</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
