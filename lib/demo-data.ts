import { Soldier, Duty, Rank, SoldierStatus } from '@/types';
import { generateId } from './utils';

export function generateDemoSoldiers(): Omit<Soldier, 'id' | 'dutyHistory' | 'createdAt' | 'updatedAt'>[] {
  const firstNames = ['Иван', 'Петр', 'Сергей', 'Алексей', 'Дмитрий', 'Андрей', 'Михаил', 'Александр', 'Владимир', 'Николай'];
  const lastNames = ['Иванов', 'Петров', 'Сидоров', 'Смирнов', 'Козлов', 'Васильев', 'Федоров', 'Михайлов', 'Соколов', 'Новиков'];
  const middleNames = ['Иванович', 'Петрович', 'Сергеевич', 'Алексеевич', 'Дмитриевич', 'Андреевич', 'Михайлович', 'Александрович', 'Владимирович', 'Николаевич'];
  
  const ranks: Rank[] = ['Рядовой', 'Ефрейтор', 'Младший сержант', 'Сержант'];
  const positions = ['Стрелок', 'Пулеметчик', 'Гранатометчик', 'Снайпер', 'Радист', 'Водитель'];
  const statuses: SoldierStatus[] = ['В строю', 'В строю', 'В строю', 'В строю', 'В отпуске', 'В увольнении'];
  
  const soldiers: Omit<Soldier, 'id' | 'dutyHistory' | 'createdAt' | 'updatedAt'>[] = [];
  
  for (let i = 0; i < 20; i++) {
    soldiers.push({
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      middleName: middleNames[Math.floor(Math.random() * middleNames.length)],
      rank: ranks[Math.floor(Math.random() * ranks.length)],
      position: positions[Math.floor(Math.random() * positions.length)],
      phone: `+7 (${Math.floor(Math.random() * 900 + 100)}) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 90 + 10)}-${Math.floor(Math.random() * 90 + 10)}`,
      room: `${Math.floor(Math.random() * 3 + 1)}${Math.floor(Math.random() * 10 + 1)}`,
      platoon: `${Math.floor(Math.random() * 3 + 1)}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      canBeStaffDuty: Math.random() > 0.7,
    });
  }
  
  return soldiers;
}

export function generateDemoDuties(): Omit<Duty, 'id' | 'assignments' | 'createdAt' | 'updatedAt'>[] {
  const types = ['Наряд по роте', 'Наряд по штабу', 'Патруль'];
  const duties: Omit<Duty, 'id' | 'assignments' | 'createdAt' | 'updatedAt'>[] = [];
  
  // Создаем наряды на следующие 30 дней
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    // 1-2 наряда в день
    const dutiesPerDay = Math.floor(Math.random() * 2) + 1;
    for (let j = 0; j < dutiesPerDay; j++) {
      const type = types[Math.floor(Math.random() * types.length)];
      duties.push({
        type,
        date,
        maxPersonnel: 4,
        roles: ['Дежурный', 'Дневальный', 'Дневальный', 'Дневальный'],
        comment: Math.random() > 0.7 ? 'Усиленный наряд' : '',
      });
    }
  }
  
  return duties;
}
