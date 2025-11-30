import { Developer } from '../types';

/**
 * База данных разработчиков
 * 
 * Разработчики с разными специализациями и навыками
 */

export const availableDevelopers: Developer[] = [
  // Frontend разработчики
  {
    id: 'frontend-junior',
    name: 'Алексей Петров',
    specialization: 'frontend',
    skill: 45,
    salary: 80000,
    experience: 1,
  },
  {
    id: 'frontend-mid',
    name: 'Мария Иванова',
    specialization: 'frontend',
    skill: 70,
    salary: 150000,
    experience: 3,
  },
  {
    id: 'frontend-senior',
    name: 'Дмитрий Сидоров',
    specialization: 'frontend',
    skill: 90,
    salary: 250000,
    experience: 7,
  },
  
  // Backend разработчики
  {
    id: 'backend-junior',
    name: 'Иван Козлов',
    specialization: 'backend',
    skill: 50,
    salary: 90000,
    experience: 1,
  },
  {
    id: 'backend-mid',
    name: 'Елена Волкова',
    specialization: 'backend',
    skill: 75,
    salary: 160000,
    experience: 4,
  },
  {
    id: 'backend-senior',
    name: 'Андрей Морозов',
    specialization: 'backend',
    skill: 95,
    salary: 280000,
    experience: 8,
  },
  
  // DevOps
  {
    id: 'devops-mid',
    name: 'Сергей Лебедев',
    specialization: 'devops',
    skill: 80,
    salary: 200000,
    experience: 5,
  },
  {
    id: 'devops-senior',
    name: 'Ольга Новикова',
    specialization: 'devops',
    skill: 92,
    salary: 300000,
    experience: 10,
  },
  
  // DBA
  {
    id: 'dba-mid',
    name: 'Павел Соколов',
    specialization: 'dba',
    skill: 75,
    salary: 180000,
    experience: 4,
  },
  {
    id: 'dba-senior',
    name: 'Наталья Федорова',
    specialization: 'dba',
    skill: 88,
    salary: 270000,
    experience: 9,
  },
  
  // Fullstack
  {
    id: 'fullstack-mid',
    name: 'Роман Орлов',
    specialization: 'fullstack',
    skill: 68,
    salary: 170000,
    experience: 3,
  },
  {
    id: 'fullstack-senior',
    name: 'Анна Смирнова',
    specialization: 'fullstack',
    skill: 85,
    salary: 240000,
    experience: 6,
  },
];

