'use client';

import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { getStatusColor, getShortName } from '@/lib/duty-assignment';
import AddSoldierDialog from '@/components/dialogs/AddSoldierDialog';
import EditSoldierDialog from '@/components/dialogs/EditSoldierDialog';
import { Soldier } from '@/types';

export default function SoldiersPage() {
  const soldiers = useStore((state) => state.soldiers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSoldier, setEditingSoldier] = useState<Soldier | null>(null);

  const filteredSoldiers = soldiers.filter((soldier) => {
    const fullName = `${soldier.lastName} ${soldier.firstName} ${soldier.middleName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || 
           soldier.rank.toLowerCase().includes(query) ||
           soldier.position.toLowerCase().includes(query);
  });

  const stats = {
    total: soldiers.length,
    available: soldiers.filter(s => s.status === 'В строю').length,
    onLeave: soldiers.filter(s => s.status === 'В отпуске').length,
    inHospital: soldiers.filter(s => s.status === 'В госпитале').length,
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardDescription>Всего</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardDescription>В строю</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.available}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardDescription>В отпуске</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.onLeave}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardDescription>В госпитале</CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.inHospital}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-2xl">Личный состав</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Управление списком военнослужащих</CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 w-full sm:w-auto text-sm">
              <Plus className="w-4 h-4" />
              Добавить солдата
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <Button variant="outline" className="gap-2 text-sm">
              <Filter className="w-4 h-4" />
              Фильтры
            </Button>
          </div>

          <div className="space-y-2">
            {filteredSoldiers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-medium">Нет данных</p>
                <p className="text-sm">Добавьте первого солдата</p>
              </div>
            ) : (
              filteredSoldiers.map((soldier) => (
                <div
                  key={soldier.id}
                  onClick={() => setEditingSoldier(soldier)}
                  className="p-3 sm:p-4 rounded-lg border bg-white/50 hover:bg-white/80 transition-all cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <h3 className="font-semibold text-sm sm:text-lg">
                          {getShortName(soldier.lastName, soldier.firstName, soldier.middleName)}
                        </h3>
                        <Badge className={`${getStatusColor(soldier.status)} text-xs`}>
                          {soldier.status}
                        </Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                        <span className="font-medium">{soldier.rank}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{soldier.position}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{soldier.platoon} взвод</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Комн. {soldier.room}</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right text-xs sm:text-sm text-gray-500">
                      <p>Нарядов: {soldier.dutyHistory.length}</p>
                      {soldier.phone && <p className="hidden sm:block">{soldier.phone}</p>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AddSoldierDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      {editingSoldier && (
        <EditSoldierDialog
          soldier={editingSoldier}
          open={!!editingSoldier}
          onOpenChange={(open) => !open && setEditingSoldier(null)}
        />
      )}
    </>
  );
}
