'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/store/useStore';
import { Rank, SoldierStatus } from '@/types';

interface AddSoldierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ranks: Rank[] = [
  'Рядовой', 'Ефрейтор', 'Младший сержант', 'Сержант', 'Старший сержант',
  'Старшина', 'Прапорщик', 'Старший прапорщик', 'Младший лейтенант',
  'Лейтенант', 'Старший лейтенант', 'Капитан', 'Майор', 'Подполковник', 'Полковник'
];

const statuses: SoldierStatus[] = ['В строю', 'В отпуске', 'В госпитале', 'В увольнении', 'Освобождён'];

export default function AddSoldierDialog({ open, onOpenChange }: AddSoldierDialogProps) {
  const addSoldier = useStore((state) => state.addSoldier);
  
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    rank: 'Рядовой' as Rank,
    position: '',
    phone: '',
    room: '',
    platoon: '',
    status: 'В строю' as SoldierStatus,
    canBeStaffDuty: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSoldier(formData);
    onOpenChange(false);
    setFormData({
      lastName: '',
      firstName: '',
      middleName: '',
      rank: 'Рядовой',
      position: '',
      phone: '',
      room: '',
      platoon: '',
      status: 'В строю',
      canBeStaffDuty: false,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить солдата</DialogTitle>
          <DialogDescription>Заполните данные о военнослужащем</DialogDescription>
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
                placeholder="Например: Стрелок"
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
                placeholder="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Комната *</Label>
              <Input
                id="room"
                required
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="101"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+7 (999) 123-45-67"
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">Добавить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
