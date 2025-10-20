'use client';

import { useState } from 'react';
import { Plus, Calendar as CalendarIcon, Users, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { formatDate, getShortName } from '@/lib/duty-assignment';
import { getRoleColor } from '@/lib/duty-assignment';
import AddDutyDialog from '@/components/dialogs/AddDutyDialog';
import { Duty } from '@/types';

export default function DutiesPage() {
  const duties = useStore((state) => state.duties);
  const soldiers = useStore((state) => state.soldiers);
  const getSoldierById = useStore((state) => state.getSoldierById);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Сортируем наряды по дате (новые сверху)
  const sortedDuties = [...duties].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Группируем по типу
  const dutyStats = duties.reduce((acc, duty) => {
    acc[duty.type] = (acc[duty.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardDescription>Всего нарядов</CardDescription>
            <CardTitle className="text-3xl">{duties.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardDescription>Наряд по роте</CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {dutyStats['Наряд по роте'] || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardDescription>Наряд по штабу</CardDescription>
            <CardTitle className="text-3xl text-purple-600">
              {dutyStats['Наряд по штабу'] || 0}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-2xl">Наряды</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Управление нарядами и назначениями</CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 w-full sm:w-auto text-sm">
              <Plus className="w-4 h-4" />
              Создать наряд
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedDuties.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Нет нарядов</p>
                <p className="text-sm">Создайте первый наряд</p>
              </div>
            ) : (
              sortedDuties.map((duty) => (
                <DutyCard 
                  key={duty.id} 
                  duty={duty} 
                  getSoldierById={getSoldierById}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AddDutyDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </>
  );
}

function DutyCard({ duty, getSoldierById }: { duty: Duty; getSoldierById: (id: string) => any }) {
  const autoAssignDutyById = useStore((state) => state.autoAssignDutyById);
  const isFilled = duty.assignments.length >= duty.maxPersonnel;

  return (
    <div className="p-4 rounded-lg border bg-white/50 hover:bg-white/80 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{duty.type}</h3>
            <Badge variant={isFilled ? "default" : "secondary"}>
              {duty.assignments.length}/{duty.maxPersonnel}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">
            {formatDate(new Date(duty.date))}
          </p>
        </div>
        {!isFilled && (
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-2"
            onClick={() => autoAssignDutyById(duty.id)}
          >
            <Sparkles className="w-4 h-4" />
            Автоназначение
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {duty.assignments.map((assignment) => {
          const soldier = getSoldierById(assignment.soldierId);
          if (!soldier) return null;

          return (
            <div
              key={assignment.id}
              className="p-3 rounded-md border bg-white/70 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="font-medium text-sm">
                    {getShortName(soldier.lastName, soldier.firstName, soldier.middleName)}
                  </p>
                  <p className="text-xs text-gray-500">{soldier.rank}</p>
                </div>
              </div>
              <Badge className={getRoleColor(assignment.role)}>
                {assignment.role}
              </Badge>
            </div>
          );
        })}
        
        {/* Пустые слоты */}
        {Array.from({ length: duty.maxPersonnel - duty.assignments.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="p-3 rounded-md border border-dashed bg-gray-50/50 flex items-center justify-center text-gray-400 text-sm"
          >
            Не назначен
          </div>
        ))}
      </div>

      {duty.comment && (
        <div className="mt-3 p-2 rounded bg-blue-50/50 text-sm text-gray-700">
          <span className="font-medium">Комментарий:</span> {duty.comment}
        </div>
      )}
    </div>
  );
}
