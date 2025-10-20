'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, TrendingUp } from 'lucide-react';
import { calculateSoldierStats } from '@/lib/duty-assignment';
import { getShortName } from '@/lib/duty-assignment';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

export default function ReportsPage() {
  const soldiers = useStore((state) => state.soldiers);
  const duties = useStore((state) => state.duties);

  // Статистика по солдатам
  const soldierStats = soldiers.map(soldier => ({
    soldier,
    stats: calculateSoldierStats(soldier, duties),
  })).sort((a, b) => b.stats.totalDuties - a.stats.totalDuties);

  // Данные для графика распределения нарядов
  const dutyDistributionData = soldierStats.slice(0, 10).map(({ soldier, stats }) => ({
    name: getShortName(soldier.lastName, soldier.firstName, soldier.middleName),
    наряды: stats.totalDuties,
  }));

  // Статистика по типам нарядов
  const dutyTypeStats = duties.reduce((acc, duty) => {
    acc[duty.type] = (acc[duty.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dutyTypePieData = Object.entries(dutyTypeStats).map(([name, value]) => ({
    name,
    value,
  }));

  // Общая статистика
  const totalAssignments = duties.reduce((sum, duty) => sum + duty.assignments.length, 0);
  const avgDutiesPerSoldier = soldiers.length > 0 ? (totalAssignments / soldiers.length).toFixed(1) : 0;
  const mostActiveSoldier = soldierStats[0];

  return (
    <div className="space-y-6">
      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardDescription>Всего нарядов</CardDescription>
            <CardTitle className="text-3xl">{duties.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardDescription>Всего назначений</CardDescription>
            <CardTitle className="text-3xl">{totalAssignments}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardDescription>Среднее на солдата</CardDescription>
            <CardTitle className="text-3xl">{avgDutiesPerSoldier}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardDescription>Замен выполнено</CardDescription>
            <CardTitle className="text-3xl">
              {duties.reduce((sum, duty) => 
                sum + duty.assignments.filter(a => a.replacedBy).length, 0
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* График распределения нарядов */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg sm:text-2xl">Распределение нарядов по солдатам</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Топ-10 солдат по количеству нарядов</CardDescription>
        </CardHeader>
        <CardContent>
          {dutyDistributionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dutyDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="наряды" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500 text-sm">
              Нет данных для отображения
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Типы нарядов */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg sm:text-2xl">Распределение по типам</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Статистика типов нарядов</CardDescription>
          </CardHeader>
          <CardContent>
            {dutyTypePieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={dutyTypePieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dutyTypePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                Нет данных для отображения
              </div>
            )}
          </CardContent>
        </Card>

        {/* Топ солдат */}
        <Card className="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg sm:text-2xl">Топ солдат</CardTitle>
                <CardDescription className="text-xs sm:text-sm">По количеству нарядов</CardDescription>
              </div>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {soldierStats.slice(0, 5).map(({ soldier, stats }, index) => (
                <div key={soldier.id} className="flex items-center justify-between p-3 rounded-lg bg-white/50">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
                      ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'}
                    `}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">
                        {getShortName(soldier.lastName, soldier.firstName, soldier.middleName)}
                      </p>
                      <p className="text-xs text-gray-600">{soldier.rank}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{stats.totalDuties} нарядов</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Детальная таблица */}
      <Card className="glass">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-2xl">Детальная статистика</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Полная информация по всем солдатам</CardDescription>
            </div>
            <Button variant="outline" className="gap-2 w-full sm:w-auto text-sm">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Экспорт в Excel</span>
              <span className="sm:hidden">Экспорт</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm">№</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm">ФИО</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm">Звание</th>
                  <th className="text-center p-2 sm:p-3 font-semibold text-xs sm:text-sm">Всего</th>
                  <th className="text-center p-2 sm:p-3 font-semibold text-xs sm:text-sm">Рота</th>
                  <th className="text-center p-2 sm:p-3 font-semibold text-xs sm:text-sm">Штаб</th>
                  <th className="text-center p-2 sm:p-3 font-semibold text-xs sm:text-sm">Патр.</th>
                </tr>
              </thead>
              <tbody>
                {soldierStats.map(({ soldier, stats }, index) => (
                  <tr key={soldier.id} className="border-b hover:bg-white/50">
                    <td className="p-2 sm:p-3 text-xs sm:text-sm">{index + 1}</td>
                    <td className="p-2 sm:p-3 font-medium text-xs sm:text-sm">
                      {getShortName(soldier.lastName, soldier.firstName, soldier.middleName)}
                    </td>
                    <td className="p-2 sm:p-3 text-xs text-gray-600">{soldier.rank}</td>
                    <td className="p-2 sm:p-3 text-center font-semibold text-xs sm:text-sm">{stats.totalDuties}</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">{stats.dutiesByType['Наряд по роте'] || 0}</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">{stats.dutiesByType['Наряд по штабу'] || 0}</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">{stats.dutiesByType['Патруль'] || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
