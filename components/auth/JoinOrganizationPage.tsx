'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/store/useAuthStore';
import Logo from '@/components/Logo';
import { User, Mail, Lock, Building2, UserCircle } from 'lucide-react';
import { UserRole } from '@/types';

interface JoinOrganizationPageProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function JoinOrganizationPage({ onSuccess, onSwitchToLogin }: JoinOrganizationPageProps) {
  const joinOrganization = useAuthStore((state) => state.joinOrganization);
  const organization = useAuthStore((state) => state.organization);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationId: '',
    role: 'Пользователь' as UserRole,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Валидация
    if (!formData.username || !formData.email || !formData.password || !formData.organizationId) {
      setError('Заполните все поля');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Пароль должен быть минимум 6 символов');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    if (!formData.email.includes('@')) {
      setError('Некорректный email');
      return;
    }
    
    setLoading(true);
    
    const success = await joinOrganization(
      formData.email,
      formData.password,
      formData.username,
      formData.organizationId,
      formData.role
    );
    
    setLoading(false);
    
    if (success) {
      onSuccess();
    } else {
      setError('Неверный ID организации или email уже используется');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size={64} />
          </div>
          <CardTitle className="text-2xl">Присоединиться к организации</CardTitle>
          <CardDescription>
            Введите ID организации для присоединения
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organizationId" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                ID организации *
              </Label>
              <Input
                id="organizationId"
                placeholder="Получите у администратора"
                value={formData.organizationId}
                onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                required
              />
              {organization && (
                <p className="text-xs text-gray-600">
                  Текущая организация: <strong>{organization.name}</strong>
                  <br />
                  ID: <code className="bg-gray-100 px-1 rounded">{organization.id}</code>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Ваше имя *
              </Label>
              <Input
                id="username"
                placeholder="Иван Иванов"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Пароль *
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Минимум 6 символов"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Подтвердите пароль *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Повторите пароль"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                Роль
              </Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Пользователь">Пользователь (только просмотр)</SelectItem>
                  <SelectItem value="Командир роты">Командир роты (редактирование)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600">
                Администратор может изменить вашу роль позже
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
              <p className="text-xs">
                <strong>Как получить ID организации?</strong>
                <br />
                Попросите администратора вашей организации предоставить ID.
                Он может найти его в разделе "Настройки".
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Присоединение...' : 'Присоединиться'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:underline font-medium"
              >
                Войти
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
