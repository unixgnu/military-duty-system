'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { Plus, X, Trash2, Download, Upload, AlertTriangle, Database } from 'lucide-react';
import { generateDemoSoldiers, generateDemoDuties } from '@/lib/demo-data';

export default function SettingsPage() {
  const settings = useStore((state) => state.settings);
  const updateSettings = useStore((state) => state.updateSettings);
  const clearAllData = useStore((state) => state.clearAllData);
  const soldiers = useStore((state) => state.soldiers);
  const duties = useStore((state) => state.duties);
  const addSoldier = useStore((state) => state.addSoldier);
  const addDuty = useStore((state) => state.addDuty);
  const autoAssignDutyById = useStore((state) => state.autoAssignDutyById);

  const [newDutyType, setNewDutyType] = useState('');
  const [newDutyRole, setNewDutyRole] = useState('');

  const handleAddDutyType = () => {
    if (newDutyType.trim() && !settings.dutyTypes.includes(newDutyType.trim())) {
      updateSettings({
        dutyTypes: [...settings.dutyTypes, newDutyType.trim()],
      });
      setNewDutyType('');
    }
  };

  const handleRemoveDutyType = (type: string) => {
    updateSettings({
      dutyTypes: settings.dutyTypes.filter(t => t !== type),
    });
  };

  const handleAddDutyRole = () => {
    if (newDutyRole.trim() && !settings.dutyRoles.includes(newDutyRole.trim())) {
      updateSettings({
        dutyRoles: [...settings.dutyRoles, newDutyRole.trim()],
      });
      setNewDutyRole('');
    }
  };

  const handleRemoveDutyRole = (role: string) => {
    updateSettings({
      dutyRoles: settings.dutyRoles.filter(r => r !== role),
    });
  };

  const handleExportData = () => {
    const data = {
      soldiers,
      duties,
      settings,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `military-duty-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (confirm('Это заменит все текущие данные. Продолжить?')) {
          // Здесь нужно добавить логику импорта
          alert('Функция импорта будет реализована в следующей версии');
        }
      } catch (error) {
        alert('Ошибка при чтении файла');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (confirm('Вы уверены? Все данные будут удалены безвозвратно!')) {
      if (confirm('Последнее предупреждение! Это действие нельзя отменить.')) {
        clearAllData();
        alert('Все данные удалены');
      }
    }
  };

  const handleLoadDemoData = () => {
    if (soldiers.length > 0 || duties.length > 0) {
      if (!confirm('Это добавит демо-данные к существующим. Продолжить?')) {
        return;
      }
    }

    // Добавляем солдат
    const demoSoldiers = generateDemoSoldiers();
    demoSoldiers.forEach(soldier => addSoldier(soldier));

    // Добавляем наряды
    const demoDuties = generateDemoDuties();
    demoDuties.forEach(duty => {
      const dutyId = addDuty(duty) as any;
      // Автоматически назначаем солдат
      setTimeout(() => autoAssignDutyById(dutyId), 100);
    });

    alert('Демо-данные загружены!');
  };

  return (
    <div className="space-y-6">
      {/* Типы нарядов */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Типы нарядов</CardTitle>
          <CardDescription>Управление типами нарядов в системе</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Новый тип наряда..."
              value={newDutyType}
              onChange={(e) => setNewDutyType(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddDutyType()}
            />
            <Button onClick={handleAddDutyType} className="gap-2">
              <Plus className="w-4 h-4" />
              Добавить
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {settings.dutyTypes.map((type) => (
              <Badge key={type} variant="secondary" className="gap-2 px-3 py-1.5">
                {type}
                <button
                  onClick={() => handleRemoveDutyType(type)}
                  className="hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Роли в нарядах */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Роли в нарядах</CardTitle>
          <CardDescription>Управление ролями для назначения</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Новая роль..."
              value={newDutyRole}
              onChange={(e) => setNewDutyRole(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddDutyRole()}
            />
            <Button onClick={handleAddDutyRole} className="gap-2">
              <Plus className="w-4 h-4" />
              Добавить
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {settings.dutyRoles.map((role) => (
              <Badge key={role} variant="secondary" className="gap-2 px-3 py-1.5">
                {role}
                <button
                  onClick={() => handleRemoveDutyRole(role)}
                  className="hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Общие настройки */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Общие настройки</CardTitle>
          <CardDescription>Параметры работы системы</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/50">
            <div>
              <Label className="text-base font-medium">Автоматическое распределение</Label>
              <p className="text-sm text-gray-600">Автоматически назначать солдат на наряды</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoAssignEnabled}
              onChange={(e) => updateSettings({ autoAssignEnabled: e.target.checked })}
              className="w-5 h-5 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-white/50">
            <div>
              <Label className="text-base font-medium">Уведомления</Label>
              <p className="text-sm text-gray-600">Отправлять уведомления о назначениях</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => updateSettings({ notificationsEnabled: e.target.checked })}
              className="w-5 h-5 rounded"
            />
          </div>
        </CardContent>
      </Card>

      {/* Демо-данные */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Демо-данные</CardTitle>
          <CardDescription>Загрузить тестовые данные для ознакомления</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLoadDemoData} variant="outline" className="w-full gap-2">
            <Database className="w-4 h-4" />
            Загрузить демо-данные (20 солдат + 30 дней нарядов)
          </Button>
        </CardContent>
      </Card>

      {/* Импорт/Экспорт */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Резервное копирование</CardTitle>
          <CardDescription>Экспорт и импорт данных</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={handleExportData} variant="outline" className="w-full gap-2">
            <Download className="w-4 h-4" />
            Экспортировать все данные (JSON)
          </Button>
          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
              id="import-file"
            />
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => document.getElementById('import-file')?.click()}
            >
              <Upload className="w-4 h-4" />
              Импортировать данные
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Опасная зона */}
      <Card className="glass border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <CardTitle className="text-red-600">Опасная зона</CardTitle>
          </div>
          <CardDescription>Необратимые действия</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleClearData}
            variant="destructive"
            className="w-full gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Удалить все данные
          </Button>
          <p className="text-xs text-gray-600 mt-2">
            Это действие удалит всех солдат, наряды и историю. Данные нельзя будет восстановить.
          </p>
        </CardContent>
      </Card>

      {/* Информация о системе */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Информация о системе</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Версия:</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Солдат в базе:</span>
            <span className="font-medium">{soldiers.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Нарядов создано:</span>
            <span className="font-medium">{duties.length}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
