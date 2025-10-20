// Статусы солдата
export type SoldierStatus = 
  | 'В строю'
  | 'В отпуске'
  | 'В госпитале'
  | 'В увольнении'
  | 'Освобождён';

// Звания
export type Rank = 
  | 'Рядовой'
  | 'Ефрейтор'
  | 'Младший сержант'
  | 'Сержант'
  | 'Старший сержант'
  | 'Старшина'
  | 'Прапорщик'
  | 'Старший прапорщик'
  | 'Младший лейтенант'
  | 'Лейтенант'
  | 'Старший лейтенант'
  | 'Капитан'
  | 'Майор'
  | 'Подполковник'
  | 'Полковник';

// Типы нарядов
export type DutyType = 
  | 'Наряд по роте'
  | 'Наряд по штабу'
  | 'Патруль'
  | string; // Возможность добавить свой тип

// Роли в наряде
export type DutyRole = 
  | 'Дежурный'
  | 'Дневальный'
  | string; // Возможность добавить свою роль

// Роли пользователей системы
export type UserRole = 'Администратор' | 'Командир роты' | 'Пользователь';

// Пользователь системы (расширенный)
export interface User {
  id: string;
  email: string;
  password: string; // Хешированный
  username: string;
  role: UserRole;
  organizationId: string; // ID организации (для первого пользователя - создается автоматически)
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

// Организация (для мультитенантности)
export interface Organization {
  id: string;
  name: string;
  ownerId: string; // ID первого зарегистрированного пользователя
  createdAt: Date;
}

// Лог действий
export interface ActionLog {
  id: string;
  userId: string;
  userName: string;
  action: string; // 'create', 'update', 'delete'
  entityType: string; // 'soldier', 'duty', 'assignment'
  entityId: string;
  changes?: any; // Что изменилось
  timestamp: Date;
}

// Солдат
export interface Soldier {
  id: string;
  lastName: string;
  firstName: string;
  middleName: string;
  rank: Rank;
  position: string;
  phone: string;
  room: string;
  platoon: string;
  status: SoldierStatus;
  canBeStaffDuty: boolean; // Может ли быть дежурным по штабу
  dutyHistory: DutyAssignment[];
  createdAt: Date;
  updatedAt: Date;
}

// Назначение на наряд
export interface DutyAssignment {
  id: string;
  soldierId: string;
  dutyId: string;
  role: DutyRole;
  date: Date;
  replacedBy?: string; // ID солдата, который заменил
  replacementReason?: string;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Наряд
export interface Duty {
  id: string;
  type: DutyType;
  date: Date;
  assignments: DutyAssignment[];
  maxPersonnel: number; // Максимум человек (обычно 4)
  roles: DutyRole[]; // Роли для этого наряда
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

// История замен
export interface ReplacementHistory {
  id: string;
  dutyId: string;
  originalSoldierId: string;
  replacementSoldierId: string;
  reason: string;
  date: Date;
  approvedBy?: string;
  createdAt: Date;
}

// Статистика по солдату
export interface SoldierStats {
  soldierId: string;
  totalDuties: number;
  dutiesByType: Record<DutyType, number>;
  dutiesByRole: Record<DutyRole, number>;
  lastDutyDate?: Date;
  replacementsMade: number;
  replacementsReceived: number;
}

// Фильтры
export interface SoldierFilter {
  rank?: Rank;
  position?: string;
  platoon?: string;
  status?: SoldierStatus;
  search?: string;
}

export interface DutyFilter {
  type?: DutyType;
  dateFrom?: Date;
  dateTo?: Date;
  soldierId?: string;
}

// Настройки приложения
export interface AppSettings {
  dutyTypes: DutyType[];
  dutyRoles: DutyRole[];
  autoAssignEnabled: boolean;
  notificationsEnabled: boolean;
}


// Отчёт
export interface Report {
  id: string;
  type: 'duty-distribution' | 'soldier-stats' | 'replacements';
  dateFrom: Date;
  dateTo: Date;
  data: any;
  generatedAt: Date;
  generatedBy: string;
}
