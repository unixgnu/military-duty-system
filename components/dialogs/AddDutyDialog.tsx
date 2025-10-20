'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/store/useStore';
import { DutyType, DutyRole } from '@/types';

interface AddDutyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddDutyDialog({ open, onOpenChange }: AddDutyDialogProps) {
  const addDuty = useStore((state) => state.addDuty);
  const autoAssignDutyById = useStore((state) => state.autoAssignDutyById);
  const settings = useStore((state) => state.settings);
  
  const [formData, setFormData] = useState({
    type: 'Наряд по роте' as DutyType,
    date: new Date().toISOString().split('T')[0],
    maxPersonnel: 4,
    roles: ['Дежурный', 'Дневальный', 'Дневальный', 'Дневальный'] as DutyRole[],
    comment: '',
    autoAssign: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dutyId = addDuty({
      type: formData.type,
      date: new Date(formData.date),
      maxPersonnel: formData.maxPersonnel,
      roles: formData.roles,
      comment: formData.comment,
    }) as any;

    // Автоматическое назначение, если включено
    if (formData.autoAssign && dutyId) {
      setTimeout(() => autoAssignDutyById(dutyId), 100);
    }

    onOpenChange(false);
    setFormData({
      type: 'Наряд по роте',
      date: new Date().toISOString().split('T')[0],
      maxPersonnel: 4,
      roles: ['Дежурный', 'Дневальный', 'Дневальный', 'Дневальный'],
      comment: '',
      autoAssign: true,
    });
  };

  const handleRoleChange = (index: number, value: DutyRole) => {
    const newRoles = [...formData.roles];
    newRoles[index] = value;
    setFormData({ ...formData, roles: newRoles });
  };

  const handleMaxPersonnelChange = (value: number) => {
    const newRoles = [...formData.roles];
    if (value > newRoles.length) {
      // Добавляем роли
      while (newRoles.length < value) {
        newRoles.push('Дневальный');
      }
    } else {
      // Удаляем роли
      newRoles.splice(value);
    }
    setFormData({ ...formData, maxPersonnel: value, roles: newRoles });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Создать наряд</DialogTitle>
          <DialogDescription>Заполните данные о наряде</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Тип наряда *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as DutyType })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {settings.dutyTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Дата *</Label>
              <Input
                id="date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPersonnel">Количество человек *</Label>
            <Input
              id="maxPersonnel"
              type="number"
              min={1}
              max={10}
              required
              value={formData.maxPersonnel}
              onChange={(e) => handleMaxPersonnelChange(parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Роли</Label>
            <div className="grid grid-cols-2 gap-2">
              {formData.roles.map((role, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-8">{index + 1}.</span>
                  <Select value={role} onValueChange={(value) => handleRoleChange(index, value as DutyRole)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {settings.dutyRoles.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Комментарий</Label>
            <Input
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Дополнительная информация..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoAssign"
              checked={formData.autoAssign}
              onChange={(e) => setFormData({ ...formData, autoAssign: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300"
            />
            <Label htmlFor="autoAssign" className="cursor-pointer">
              Автоматически назначить солдат
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">Создать</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
