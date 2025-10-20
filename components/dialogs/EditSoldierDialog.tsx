'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/store/useStore';
import { Rank, SoldierStatus, Soldier } from '@/types';
import { Trash2 } from 'lucide-react';

interface EditSoldierDialogProps {
  soldier: Soldier;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ranks: Rank[] = [
  'Рядовой', 'Ефрейтор', 'Младший сержант', 'Сержант', 'Старший сержант',
  'Старшина', 'Прапорщик', 'Старший прапорщик', 'Младший лейтенант',
  'Лейтенант', 'Старший лейтенант', 'Капитан', 'Майор', 'Подполковник', 'Полковник'
];

const statuses: SoldierStatus[] = ['В строю', 'В отпуске', 'В госпитале', 'В увольнении', 'Освобождён'];

export default function EditSoldierDialog({ soldier, open, onOpenChange }: EditSoldierDialogProps) {
  const updateSoldier = useStore((state) => state.updateSoldier);
  const deleteSoldier = useStore((state) => state.deleteSoldier);
  
  const [formData, setFormData] = useState({
    lastName: soldier.lastName,
    firstName: soldier.firstName,
    middleName: soldier.middleName,
    rank: soldier.rank,
    position: soldier.position,
    phone: soldier.phone,
    room: soldier.room,
    platoon: soldier.platoon,
    status: soldier.status,
    canBeStaffDuty: soldier.canBeStaffDuty,
  });

  useEffect(() => {
    setFormData({
      lastName: soldier.lastName,
      firstName: soldier.firstName,
      middleName: soldier.middleName,
      rank: soldier.rank,
      position: soldier.position,
      phone: soldier.phone,
      room: soldier.room,
      platoon: soldier.platoon,
      status: soldier.status,
      canBeStaffDuty: soldier.canBeStaffDuty,
    });
  }, [soldier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSoldier(soldier.id, formData);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (confirm('Вы уверены, что хотите удалить этого солдата?')) {
      deleteSoldier(soldier.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать данные солдата</DialogTitle>
          <DialogDescription>Измените информацию о военнослужащем</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastName">Фамилия *</Label>
              <Input
                id="lastName"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">Имя *</Label>
              <Input
                id="firstName"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">Отчество *</Label>
              <Input
                id="middleName"
                required
                value={formData.middleName}
                onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rank">Звание *</Label>
              <Select value={formData.rank} onValueChange={(value) => setFormData({ ...formData, rank: value as Rank })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ranks.map((rank) => (
                    <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Должность *</Label>
              <Input
                id="position"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platoon">Взвод *</Label>
              <Input
                id="platoon"
                required
                value={formData.platoon}
                onChange={(e) => setFormData({ ...formData, platoon: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Комната *</Label>
              <Input
                id="room"
                required
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Статус *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as SoldierStatus })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="canBeStaffDuty"
              checked={formData.canBeStaffDuty}
              onChange={(e) => setFormData({ ...formData, canBeStaffDuty: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300"
            />
            <Label htmlFor="canBeStaffDuty" className="cursor-pointer">
              Может быть дежурным по штабу
            </Label>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">История нарядов: {soldier.dutyHistory.length}</p>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="destructive" onClick={handleDelete} className="gap-2 mr-auto">
              <Trash2 className="w-4 h-4" />
              Удалить
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
