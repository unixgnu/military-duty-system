'use client';

import { useState, useEffect } from 'react';
import { Users, Calendar, BarChart3, RefreshCw, FileText, Settings, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import SoldiersPage from '@/components/pages/SoldiersPage';
import DutiesPage from '@/components/pages/DutiesPage';
import SchedulePage from '@/components/pages/SchedulePage';
import ReplacementsPage from '@/components/pages/ReplacementsPage';
import ReportsPage from '@/components/pages/ReportsPage';
import SettingsPage from '@/components/pages/SettingsPage';
import Loading from '@/components/Loading';
import Logo from '@/components/Logo';
import RegisterPage from '@/components/auth/RegisterPage';
import LoginPage from '@/components/auth/LoginPage';
import JoinOrganizationPage from '@/components/auth/JoinOrganizationPage';
import { useAuthStore } from '@/store/useAuthStore';

export default function Home() {
  const [activeTab, setActiveTab] = useState('soldiers');
  const [isLoading, setIsLoading] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'register' | 'join'>('login');
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const organization = useAuthStore((state) => state.organization);
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    // Минимальное время показа загрузки для плавности
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  // Если нет организации - показываем регистрацию
  if (!organization) {
    return (
      <RegisterPage
        onSuccess={() => setIsLoading(true)}
        onSwitchToLogin={() => setAuthView('login')}
        onSwitchToJoin={() => setAuthView('join')}
      />
    );
  }

  // Если не авторизован - показываем вход
  if (!isAuthenticated) {
    if (authView === 'register') {
      return (
        <RegisterPage
          onSuccess={() => setIsLoading(true)}
          onSwitchToLogin={() => setAuthView('login')}
          onSwitchToJoin={() => setAuthView('join')}
        />
      );
    }
    
    if (authView === 'join') {
      return (
        <JoinOrganizationPage
          onSuccess={() => setIsLoading(true)}
          onSwitchToLogin={() => setAuthView('login')}
        />
      );
    }
    
    return (
      <LoginPage
        onSuccess={() => setIsLoading(true)}
        onSwitchToRegister={() => setAuthView('register')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 animate-in fade-in duration-500">
      {/* Header */}
      <header className="glass border-b sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Logo size={32} className="sm:w-10 sm:h-10" />
              <div>
                <h1 className="text-base sm:text-xl font-bold text-gray-900">Система учёта нарядов</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">{organization?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{currentUser?.username}</p>
                <p className="text-xs text-gray-600">{currentUser?.role}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Выход</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="glass flex h-auto sm:inline-flex sm:h-12 items-center justify-start sm:justify-center rounded-xl p-1 overflow-x-auto w-full touch-manipulation">
            <TabsTrigger value="soldiers" className="gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm px-3 py-2.5 sm:px-3 sm:py-1.5 min-h-[44px] sm:min-h-0 touch-manipulation active:scale-95 transition-transform">
              <Users className="w-4 h-4 sm:w-4 sm:h-4 pointer-events-none" />
              <span className="hidden sm:inline pointer-events-none">Личный состав</span>
              <span className="sm:hidden pointer-events-none">Состав</span>
            </TabsTrigger>
            <TabsTrigger value="duties" className="gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm px-3 py-2.5 sm:px-3 sm:py-1.5 min-h-[44px] sm:min-h-0 touch-manipulation active:scale-95 transition-transform">
              <Calendar className="w-4 h-4 sm:w-4 sm:h-4 pointer-events-none" />
              <span className="pointer-events-none">Наряды</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm px-3 py-2.5 sm:px-3 sm:py-1.5 min-h-[44px] sm:min-h-0 touch-manipulation active:scale-95 transition-transform">
              <BarChart3 className="w-4 h-4 sm:w-4 sm:h-4 pointer-events-none" />
              <span className="pointer-events-none">График</span>
            </TabsTrigger>
            <TabsTrigger value="replacements" className="gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm px-3 py-2.5 sm:px-3 sm:py-1.5 min-h-[44px] sm:min-h-0 touch-manipulation active:scale-95 transition-transform">
              <RefreshCw className="w-4 h-4 sm:w-4 sm:h-4 pointer-events-none" />
              <span className="pointer-events-none">Замены</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm px-3 py-2.5 sm:px-3 sm:py-1.5 min-h-[44px] sm:min-h-0 touch-manipulation active:scale-95 transition-transform">
              <FileText className="w-4 h-4 sm:w-4 sm:h-4 pointer-events-none" />
              <span className="pointer-events-none">Отчёты</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm px-3 py-2.5 sm:px-3 sm:py-1.5 min-h-[44px] sm:min-h-0 touch-manipulation active:scale-95 transition-transform">
              <Settings className="w-4 h-4 sm:w-4 sm:h-4 pointer-events-none" />
              <span className="hidden sm:inline pointer-events-none">Настройки</span>
              <span className="sm:hidden pointer-events-none">Настр.</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="soldiers" className="space-y-4">
            <SoldiersPage />
          </TabsContent>

          <TabsContent value="duties" className="space-y-4">
            <DutiesPage />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <SchedulePage />
          </TabsContent>

          <TabsContent value="replacements" className="space-y-4">
            <ReplacementsPage />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <ReportsPage />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <SettingsPage />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
