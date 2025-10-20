import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Soldier, Duty, DutyAssignment, ReplacementHistory, AppSettings } from '@/types';
import { generateId } from '@/lib/utils';
import { autoAssignDuty } from '@/lib/duty-assignment';

interface Store {
  // Данные
  soldiers: Soldier[];
  duties: Duty[];
  replacements: ReplacementHistory[];
  settings: AppSettings;
  
  // Солдаты
  addSoldier: (soldier: Omit<Soldier, 'id' | 'dutyHistory' | 'createdAt' | 'updatedAt'>) => void;
  updateSoldier: (id: string, soldier: Partial<Soldier>) => void;
  deleteSoldier: (id: string) => void;
  
  // Наряды
  addDuty: (duty: Omit<Duty, 'id' | 'assignments' | 'createdAt' | 'updatedAt'>) => void;
  updateDuty: (id: string, duty: Partial<Duty>) => void;
  deleteDuty: (id: string) => void;
  autoAssignDutyById: (dutyId: string) => void;
  
  // Назначения
  addAssignment: (assignment: Omit<DutyAssignment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAssignment: (id: string, assignment: Partial<DutyAssignment>) => void;
  deleteAssignment: (id: string) => void;
  replaceAssignment: (assignmentId: string, newSoldierId: string, reason: string) => void;
  
  // Настройки
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // Утилиты
  getSoldierById: (id: string) => Soldier | undefined;
  getDutyById: (id: string) => Duty | undefined;
  clearAllData: () => void;
}

const defaultSettings: AppSettings = {
  dutyTypes: ['Наряд по роте', 'Наряд по штабу', 'Патруль'],
  dutyRoles: ['Дежурный', 'Дневальный'],
  autoAssignEnabled: true,
  notificationsEnabled: false,
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      soldiers: [],
      duties: [],
      replacements: [],
      settings: defaultSettings,
      
      // Солдаты
      addSoldier: (soldierData) => {
        const soldier: Soldier = {
          ...soldierData,
          id: generateId(),
          dutyHistory: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ soldiers: [...state.soldiers, soldier] }));
      },
      
      updateSoldier: (id, soldierData) => {
        set((state) => ({
          soldiers: state.soldiers.map((s) =>
            s.id === id ? { ...s, ...soldierData, updatedAt: new Date() } : s
          ),
        }));
      },
      
      deleteSoldier: (id) => {
        set((state) => ({
          soldiers: state.soldiers.filter((s) => s.id !== id),
        }));
      },
      
      // Наряды
      addDuty: (dutyData) => {
        const duty: Duty = {
          ...dutyData,
          id: generateId(),
          assignments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ duties: [...state.duties, duty] }));
        return duty.id;
      },
      
      updateDuty: (id, dutyData) => {
        set((state) => ({
          duties: state.duties.map((d) =>
            d.id === id ? { ...d, ...dutyData, updatedAt: new Date() } : d
          ),
        }));
      },
      
      deleteDuty: (id) => {
        set((state) => ({
          duties: state.duties.filter((d) => d.id !== id),
        }));
      },
      
      autoAssignDutyById: (dutyId) => {
        const duty = get().getDutyById(dutyId);
        if (!duty) return;
        
        const soldiers = get().soldiers;
        const allDuties = get().duties;
        
        const assignments = autoAssignDuty(duty, soldiers, allDuties);
        
        // Обновляем наряд с назначениями
        set((state) => ({
          duties: state.duties.map((d) =>
            d.id === dutyId ? { ...d, assignments, updatedAt: new Date() } : d
          ),
        }));
        
        // Обновляем историю солдат
        assignments.forEach((assignment) => {
          set((state) => ({
            soldiers: state.soldiers.map((s) =>
              s.id === assignment.soldierId
                ? { ...s, dutyHistory: [...s.dutyHistory, assignment], updatedAt: new Date() }
                : s
            ),
          }));
        });
      },
      
      // Назначения
      addAssignment: (assignmentData) => {
        const assignment: DutyAssignment = {
          ...assignmentData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        // Добавляем в наряд
        set((state) => ({
          duties: state.duties.map((d) =>
            d.id === assignment.dutyId
              ? { ...d, assignments: [...d.assignments, assignment], updatedAt: new Date() }
              : d
          ),
        }));
        
        // Добавляем в историю солдата
        set((state) => ({
          soldiers: state.soldiers.map((s) =>
            s.id === assignment.soldierId
              ? { ...s, dutyHistory: [...s.dutyHistory, assignment], updatedAt: new Date() }
              : s
          ),
        }));
      },
      
      updateAssignment: (id, assignmentData) => {
        set((state) => ({
          duties: state.duties.map((d) => ({
            ...d,
            assignments: d.assignments.map((a) =>
              a.id === id ? { ...a, ...assignmentData, updatedAt: new Date() } : a
            ),
          })),
        }));
        
        set((state) => ({
          soldiers: state.soldiers.map((s) => ({
            ...s,
            dutyHistory: s.dutyHistory.map((a) =>
              a.id === id ? { ...a, ...assignmentData, updatedAt: new Date() } : a
            ),
          })),
        }));
      },
      
      deleteAssignment: (id) => {
        set((state) => ({
          duties: state.duties.map((d) => ({
            ...d,
            assignments: d.assignments.filter((a) => a.id !== id),
          })),
        }));
        
        set((state) => ({
          soldiers: state.soldiers.map((s) => ({
            ...s,
            dutyHistory: s.dutyHistory.filter((a) => a.id !== id),
          })),
        }));
      },
      
      replaceAssignment: (assignmentId, newSoldierId, reason) => {
        const state = get();
        let originalSoldierId = '';
        let dutyId = '';
        
        // Находим оригинальное назначение
        state.duties.forEach((duty) => {
          const assignment = duty.assignments.find((a) => a.id === assignmentId);
          if (assignment) {
            originalSoldierId = assignment.soldierId;
            dutyId = duty.id;
          }
        });
        
        if (!originalSoldierId || !dutyId) return;
        
        // Создаём запись о замене
        const replacement: ReplacementHistory = {
          id: generateId(),
          dutyId,
          originalSoldierId,
          replacementSoldierId: newSoldierId,
          reason,
          date: new Date(),
          createdAt: new Date(),
        };
        
        // Обновляем назначение
        get().updateAssignment(assignmentId, {
          soldierId: newSoldierId,
          replacedBy: newSoldierId,
          replacementReason: reason,
        });
        
        // Добавляем в историю замен
        set((state) => ({
          replacements: [...state.replacements, replacement],
        }));
      },
      
      // Настройки
      updateSettings: (settingsData) => {
        set((state) => ({
          settings: { ...state.settings, ...settingsData },
        }));
      },
      
      // Утилиты
      getSoldierById: (id) => {
        return get().soldiers.find((s) => s.id === id);
      },
      
      getDutyById: (id) => {
        return get().duties.find((d) => d.id === id);
      },
      
      clearAllData: () => {
        set({
          soldiers: [],
          duties: [],
          replacements: [],
        });
      },
    }),
    {
      name: 'military-duty-storage',
    }
  )
);
