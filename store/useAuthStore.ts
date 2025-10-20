import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Organization, ActionLog, UserRole } from '@/types';
import { generateId } from '@/lib/utils';

interface AuthStore {
  // Данные
  currentUser: User | null;
  users: User[];
  organization: Organization | null;
  actionLogs: ActionLog[];
  isAuthenticated: boolean;
  
  // Аутентификация
  register: (email: string, password: string, username: string, organizationName: string) => Promise<boolean>;
  joinOrganization: (email: string, password: string, username: string, organizationId: string, role: UserRole) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Управление пользователями (только для админа)
  addUser: (email: string, password: string, username: string, role: UserRole) => boolean;
  updateUser: (userId: string, updates: Partial<User>) => boolean;
  deleteUser: (userId: string) => boolean;
  
  // Логирование действий
  logAction: (action: string, entityType: string, entityId: string, changes?: any) => void;
  
  // Проверка прав
  canEdit: () => boolean;
  canDelete: () => boolean;
  canViewAll: () => boolean;
  isAdmin: () => boolean;
}

// Простое хеширование (в продакшене использовать bcrypt)
const hashPassword = (password: string): string => {
  return btoa(password + 'salt_key_2024'); // Base64 encoding
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      organization: null,
      actionLogs: [],
      isAuthenticated: false,
      
      // Регистрация первого пользователя (становится админом)
      register: async (email, password, username, organizationName) => {
        const state = get();
        
        // Проверка email
        if (state.users.find(u => u.email === email)) {
          return false;
        }
        
        const orgId = generateId();
        const userId = generateId();
        
        // Создаем организацию
        const organization: Organization = {
          id: orgId,
          name: organizationName,
          ownerId: userId,
          createdAt: new Date(),
        };
        
        // Создаем первого пользователя (админ)
        const user: User = {
          id: userId,
          email,
          password: hashPassword(password),
          username,
          role: 'Администратор',
          organizationId: orgId,
          createdAt: new Date(),
          lastLogin: new Date(),
          isActive: true,
        };
        
        set({
          organization,
          users: [user],
          currentUser: user,
          isAuthenticated: true,
        });
        
        get().logAction('register', 'user', userId, { username, role: 'Администратор' });
        
        return true;
      },
      
      // Присоединение к существующей организации
      joinOrganization: async (email, password, username, organizationId, role) => {
        const state = get();
        
        // Проверка: организация должна существовать
        if (!state.organization || state.organization.id !== organizationId) {
          return false;
        }
        
        // Проверка email
        if (state.users.find(u => u.email === email)) {
          return false;
        }
        
        const userId = generateId();
        
        // Создаем нового пользователя
        const user: User = {
          id: userId,
          email,
          password: hashPassword(password),
          username,
          role,
          organizationId,
          createdAt: new Date(),
          lastLogin: new Date(),
          isActive: true,
        };
        
        set({
          users: [...state.users, user],
          currentUser: user,
          isAuthenticated: true,
        });
        
        get().logAction('join', 'user', userId, { username, role });
        
        return true;
      },
      
      // Вход
      login: async (email, password) => {
        const state = get();
        const user = state.users.find(u => u.email === email && u.isActive);
        
        if (!user || !verifyPassword(password, user.password)) {
          return false;
        }
        
        const updatedUser = { ...user, lastLogin: new Date() };
        
        set({
          currentUser: updatedUser,
          isAuthenticated: true,
          users: state.users.map(u => u.id === user.id ? updatedUser : u),
        });
        
        get().logAction('login', 'user', user.id);
        
        return true;
      },
      
      // Выход
      logout: () => {
        const state = get();
        if (state.currentUser) {
          get().logAction('logout', 'user', state.currentUser.id);
        }
        
        set({
          currentUser: null,
          isAuthenticated: false,
        });
      },
      
      // Добавление пользователя (только админ)
      addUser: (email, password, username, role) => {
        const state = get();
        
        if (!state.currentUser || state.currentUser.role !== 'Администратор') {
          return false;
        }
        
        if (state.users.find(u => u.email === email)) {
          return false;
        }
        
        const user: User = {
          id: generateId(),
          email,
          password: hashPassword(password),
          username,
          role,
          organizationId: state.organization!.id,
          createdAt: new Date(),
          isActive: true,
        };
        
        set({
          users: [...state.users, user],
        });
        
        get().logAction('create', 'user', user.id, { username, role });
        
        return true;
      },
      
      // Обновление пользователя
      updateUser: (userId, updates) => {
        const state = get();
        
        if (!state.currentUser || state.currentUser.role !== 'Администратор') {
          return false;
        }
        
        set({
          users: state.users.map(u => 
            u.id === userId ? { ...u, ...updates } : u
          ),
        });
        
        get().logAction('update', 'user', userId, updates);
        
        return true;
      },
      
      // Удаление пользователя
      deleteUser: (userId) => {
        const state = get();
        
        if (!state.currentUser || state.currentUser.role !== 'Администратор') {
          return false;
        }
        
        // Нельзя удалить владельца организации
        if (userId === state.organization?.ownerId) {
          return false;
        }
        
        set({
          users: state.users.filter(u => u.id !== userId),
        });
        
        get().logAction('delete', 'user', userId);
        
        return true;
      },
      
      // Логирование действий
      logAction: (action, entityType, entityId, changes) => {
        const state = get();
        
        if (!state.currentUser) return;
        
        const log: ActionLog = {
          id: generateId(),
          userId: state.currentUser.id,
          userName: state.currentUser.username,
          action,
          entityType,
          entityId,
          changes,
          timestamp: new Date(),
        };
        
        set({
          actionLogs: [...state.actionLogs, log],
        });
      },
      
      // Проверка прав
      canEdit: () => {
        const user = get().currentUser;
        return user?.role === 'Администратор' || user?.role === 'Командир роты';
      },
      
      canDelete: () => {
        const user = get().currentUser;
        return user?.role === 'Администратор';
      },
      
      canViewAll: () => {
        return get().isAuthenticated;
      },
      
      isAdmin: () => {
        const user = get().currentUser;
        return user?.role === 'Администратор';
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
