import { Achievement } from '../types';

/**
 * База данных достижений
 * 
 * 20+ достижений в различных категориях
 */

export const achievements: Achievement[] = [
  // Общие достижения
  {
    id: 'first-launch',
    name: 'Первый запуск',
    description: 'Добавьте первую технологию в проект',
    icon: '🚀',
    unlocked: false,
    category: 'general',
  },
  {
    id: 'full-stack',
    name: 'Full Stack Developer',
    description: 'Добавьте технологии и на Frontend, и на Backend',
    icon: '💻',
    unlocked: false,
    category: 'general',
  },
  {
    id: 'perfect-score',
    name: 'Идеальная архитектура',
    description: 'Достигните Total Score > 90',
    icon: '⭐',
    unlocked: false,
    category: 'general',
  },

  // Архитектурные достижения
  {
    id: 'modern-stack',
    name: 'Современный стек',
    description: 'Используйте TypeScript + React + Node.js',
    icon: '⚡',
    unlocked: false,
    category: 'architecture',
  },
  {
    id: 'enterprise',
    name: 'Enterprise уровень',
    description: 'Используйте Java + Spring + PostgreSQL',
    icon: '🏢',
    unlocked: false,
    category: 'architecture',
  },
  {
    id: 'python-stack',
    name: 'Python мастер',
    description: 'Используйте Python + Django + PostgreSQL',
    icon: '🐍',
    unlocked: false,
    category: 'architecture',
  },
  {
    id: 'microservices',
    name: 'Микросервисы',
    description: 'Используйте архитектуру микросервисов с message broker',
    icon: '🔗',
    unlocked: false,
    category: 'architecture',
  },
  {
    id: 'cloud-native',
    name: 'Cloud Native',
    description: 'Используйте Docker + Kubernetes',
    icon: '☁️',
    unlocked: false,
    category: 'architecture',
  },

  // Производительность
  {
    id: 'high-performance',
    name: 'Высокая производительность',
    description: 'Достигните UX Performance > 90',
    icon: '⚡',
    unlocked: false,
    category: 'performance',
  },
  {
    id: 'rocket-speed',
    name: 'Ракетная скорость',
    description: 'Достигните UX Performance = 100',
    icon: '🚀',
    unlocked: false,
    category: 'performance',
  },
  {
    id: 'caching-master',
    name: 'Мастер кеширования',
    description: 'Используйте Redis с основной БД',
    icon: '💾',
    unlocked: false,
    category: 'performance',
  },

  // Бюджетные достижения
  {
    id: 'budget-master',
    name: 'Бюджетный мастер',
    description: 'Создайте архитектуру с бюджетом < $2,000',
    icon: '💰',
    unlocked: false,
    category: 'budget',
  },
  {
    id: 'frugal',
    name: 'Экономный',
    description: 'Используйте только бесплатные технологии',
    icon: '💵',
    unlocked: false,
    category: 'budget',
  },
  {
    id: 'big-spender',
    name: 'Большой спонсор',
    description: 'Потратьте > $8,000 на технологии',
    icon: '💸',
    unlocked: false,
    category: 'budget',
  },

  // Челленджи
  {
    id: 'minimalist',
    name: 'Минималист',
    description: 'Создайте архитектуру из 3 технологий с Score > 80',
    icon: '🎯',
    unlocked: false,
    category: 'challenge',
  },
  {
    id: 'complexity-master',
    name: 'Мастер сложности',
    description: 'Создайте архитектуру с Complexity < 30',
    icon: '🧩',
    unlocked: false,
    category: 'challenge',
  },
  {
    id: 'tech-collector',
    name: 'Коллекционер технологий',
    description: 'Используйте 10+ технологий в одном проекте',
    icon: '📚',
    unlocked: false,
    category: 'challenge',
  },
  {
    id: 'compatibility-king',
    name: 'Король совместимости',
    description: 'Используйте только Preferred комбинации',
    icon: '👑',
    unlocked: false,
    category: 'challenge',
  },
  {
    id: 'rustacean',
    name: 'Rustacean',
    description: 'Используйте Rust в проекте',
    icon: '🦀',
    unlocked: false,
    category: 'challenge',
  },
  {
    id: 'go-gopher',
    name: 'Go Gopher',
    description: 'Используйте Go в проекте',
    icon: '🐹',
    unlocked: false,
    category: 'challenge',
  },
];

