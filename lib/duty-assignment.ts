import { Soldier, Duty, DutyAssignment, DutyRole, SoldierStats } from '@/types';
import { generateId, getShortName } from './utils';

export { getShortName };

/**
 * Проверяет, доступен ли солдат для наряда
 */
export function isSoldierAvailable(soldier: Soldier): boolean {
  return soldier.status === 'В строю';
}

/**
 * Вычисляет статистику нарядов для солдата
 */
export function calculateSoldierStats(
  soldier: Soldier,
  allDuties: Duty[]
): SoldierStats {
  const assignments = soldier.dutyHistory;
  
  const dutiesByType: Record<string, number> = {};
  const dutiesByRole: Record<string, number> = {};
  
  assignments.forEach(assignment => {
    const duty = allDuties.find(d => d.id === assignment.dutyId);
    if (duty) {
      dutiesByType[duty.type] = (dutiesByType[duty.type] || 0) + 1;
    }
    dutiesByRole[assignment.role] = (dutiesByRole[assignment.role] || 0) + 1;
  });

  const lastDuty = assignments.length > 0
    ? assignments.sort((a, b) => b.date.getTime() - a.date.getTime())[0]
    : undefined;

  return {
    soldierId: soldier.id,
    totalDuties: assignments.length,
    dutiesByType,
    dutiesByRole,
    lastDutyDate: lastDuty?.date,
    replacementsMade: assignments.filter(a => a.replacedBy).length,
    replacementsReceived: 0, // Нужно считать отдельно
  };
}

/**
 * Автоматически распределяет солдат на наряд
 * Алгоритм:
 * 1. Фильтрует только доступных солдат
 * 2. Сортирует по количеству нарядов (меньше = приоритет)
 * 3. Учитывает дату последнего наряда
 * 4. Для наряда по штабу проверяет флаг canBeStaffDuty
 */
export function autoAssignDuty(
  duty: Duty,
  soldiers: Soldier[],
  allDuties: Duty[]
): DutyAssignment[] {
  const assignments: DutyAssignment[] = [];
  
  // Фильтруем доступных солдат
  let availableSoldiers = soldiers.filter(isSoldierAvailable);
  
  // Для наряда по штабу фильтруем только тех, кто может быть дежурным
  if (duty.type === 'Наряд по штабу') {
    availableSoldiers = availableSoldiers.filter(s => s.canBeStaffDuty);
  }
  
  // Сортируем по нагрузке (меньше нарядов = выше приоритет)
  const soldiersByLoad = availableSoldiers
    .map(soldier => ({
      soldier,
      stats: calculateSoldierStats(soldier, allDuties),
    }))
    .sort((a, b) => {
      // Сначала по количеству нарядов
      if (a.stats.totalDuties !== b.stats.totalDuties) {
        return a.stats.totalDuties - b.stats.totalDuties;
      }
      // Потом по дате последнего наряда (раньше = приоритет)
      const aDate = a.stats.lastDutyDate?.getTime() || 0;
      const bDate = b.stats.lastDutyDate?.getTime() || 0;
      return aDate - bDate;
    });

  // Назначаем солдат на роли
  for (let i = 0; i < Math.min(duty.roles.length, soldiersByLoad.length); i++) {
    const soldier = soldiersByLoad[i].soldier;
    const role = duty.roles[i];
    
    const assignment: DutyAssignment = {
      id: generateId(),
      soldierId: soldier.id,
      dutyId: duty.id,
      role,
      date: duty.date,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    assignments.push(assignment);
  }
  
  return assignments;
}

/**
 * Заменяет солдата в наряде
 */
export function replaceSoldier(
  assignment: DutyAssignment,
  newSoldierId: string,
  reason: string
): DutyAssignment {
  return {
    ...assignment,
    replacedBy: newSoldierId,
    replacementReason: reason,
    updatedAt: new Date(),
  };
}

/**
 * Получает цвет для роли
 */
export function getRoleColor(role: DutyRole): string {
  switch (role) {
    case 'Дежурный':
      return 'bg-red-500/20 text-red-700 border-red-500/30';
    case 'Дневальный':
      return 'bg-green-500/20 text-green-700 border-green-500/30';
    default:
      return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
  }
}

/**
 * Получает цвет для статуса солдата
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'В строю':
      return 'bg-green-500/20 text-green-700 border-green-500/30';
    case 'В отпуске':
      return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
    case 'В госпитале':
      return 'bg-red-500/20 text-red-700 border-red-500/30';
    case 'В увольнении':
      return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
    case 'Освобождён':
      return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    default:
      return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
  }
}
