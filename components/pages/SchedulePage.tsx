'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { formatDate, getShortName } from '@/lib/duty-assignment';
import { getRoleColor } from '@/lib/duty-assignment';

export default function SchedulePage() {
  const duties = useStore((state) => state.duties);
  const getSoldierById = useStore((state) => state.getSoldierById);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Получаем первый и последний день месяца
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Генерируем дни месяца
  const daysInMonth = [];
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    daysInMonth.push(new Date(d));
  }

  const monthName = currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDutiesForDate = (date: Date) => {
    return duties.filter(duty => {
      const dutyDate = new Date(duty.date);
      return dutyDate.toDateString() === date.toDateString();
    });
  };

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex flex-col gap-3">
          <div>
            <CardTitle className="text-lg sm:text-2xl">График нарядов</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Календарное представление нарядов</CardDescription>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8 sm:h-10 sm:w-10">
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/50 rounded-lg font-medium min-w-[160px] sm:min-w-[200px] text-center text-sm sm:text-base">
              {monthName}
            </div>
            <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 sm:h-10 sm:w-10">
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Дни недели */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
            <div key={day} className="text-center font-semibold text-xs sm:text-sm text-gray-600 py-1 sm:py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Календарная сетка */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Пустые ячейки до первого дня месяца */}
          {Array.from({ length: (firstDay.getDay() + 6) % 7 }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Дни месяца */}
          {daysInMonth.map((date) => {
            const dayDuties = getDutiesForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            return (
              <div
                key={date.toISOString()}
                className={`
                  aspect-square p-1 sm:p-2 rounded-lg border transition-all
                  ${isToday ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 bg-white/30'}
                  ${isWeekend ? 'bg-red-50/30' : ''}
                  ${dayDuties.length > 0 ? 'hover:bg-white/80 cursor-pointer' : ''}
                `}
              >
                <div className={`text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                  {date.getDate()}
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  {dayDuties.slice(0, 2).map((duty) => (
                    <div
                      key={duty.id}
                      className="text-[10px] sm:text-xs p-0.5 sm:p-1 rounded bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30"
                      title={duty.type}
                    >
                      <div className="font-medium truncate hidden sm:block">{duty.type}</div>
                      <div className="text-gray-600 text-center sm:text-left">
                        {duty.assignments.length}/{duty.maxPersonnel}
                      </div>
                    </div>
                  ))}
                  {dayDuties.length > 2 && (
                    <div className="text-[10px] text-center text-gray-500">+{dayDuties.length - 2}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Легенда */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-50"></div>
            <span>Сегодня</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-50/50"></div>
            <span>Выходной</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30"></div>
            <span>Есть наряд</span>
          </div>
        </div>

        {/* Список нарядов на текущий месяц */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold mb-4">Наряды в этом месяце ({duties.filter(d => {
            const dutyDate = new Date(d.date);
            return dutyDate.getMonth() === currentDate.getMonth() && 
                   dutyDate.getFullYear() === currentDate.getFullYear();
          }).length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {duties
              .filter(d => {
                const dutyDate = new Date(d.date);
                return dutyDate.getMonth() === currentDate.getMonth() && 
                       dutyDate.getFullYear() === currentDate.getFullYear();
              })
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((duty) => (
                <div key={duty.id} className="p-3 rounded-lg border bg-white/50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium">{duty.type}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        {formatDate(new Date(duty.date))}
                      </span>
                    </div>
                    <Badge>{duty.assignments.length}/{duty.maxPersonnel}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {duty.assignments.map((assignment) => {
                      const soldier = getSoldierById(assignment.soldierId);
                      if (!soldier) return null;
                      return (
                        <Badge key={assignment.id} className={getRoleColor(assignment.role)}>
                          {getShortName(soldier.lastName, soldier.firstName, soldier.middleName)} - {assignment.role}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
