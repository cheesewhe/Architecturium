import { Challenge } from '../types';

/**
 * База данных челленджей
 * 
 * Различные сценарии и вызовы для игроков
 */

export const challenges: Challenge[] = [
  {
    id: 'startup-mvp',
    name: 'Startup MVP',
    description: 'Создайте минимально жизнеспособный продукт с ограниченным бюджетом',
    objectives: [
      {
        id: 'budget',
        description: 'Уложиться в бюджет $5,000',
        type: 'budget',
        target: 5000,
        current: 0,
        completed: false,
      },
      {
        id: 'time',
        description: 'Завершить MVP за 30 дней',
        type: 'time',
        target: 30,
        current: 0,
        completed: false,
      },
      {
        id: 'score',
        description: 'Достичь Total Score > 70',
        type: 'metric',
        target: 70,
        current: 0,
        completed: false,
      },
    ],
    constraints: {
      maxBudget: 5000,
      maxTime: 30,
      maxTechnologies: 5,
    },
    reward: '🏆 Startup Master',
  },
  {
    id: 'enterprise-grade',
    name: 'Enterprise Grade',
    description: 'Создайте надёжную enterprise-архитектуру',
    objectives: [
      {
        id: 'stability',
        description: 'UX Stability > 90',
        type: 'metric',
        target: 90,
        current: 0,
        completed: false,
      },
      {
        id: 'maintainability',
        description: 'Dev Maintainability > 85',
        type: 'metric',
        target: 85,
        current: 0,
        completed: false,
      },
      {
        id: 'tech-stack',
        description: 'Использовать Java + Spring + PostgreSQL',
        type: 'technology',
        target: 'java,spring,postgresql',
        current: '',
        completed: false,
      },
    ],
    constraints: {
      requiredTechnologies: ['java', 'spring', 'postgresql'],
    },
    reward: '🏢 Enterprise Architect',
  },
  {
    id: 'high-performance',
    name: 'High Performance',
    description: 'Создайте максимально производительную архитектуру',
    objectives: [
      {
        id: 'performance',
        description: 'UX Performance = 100',
        type: 'metric',
        target: 100,
        current: 0,
        completed: false,
      },
      {
        id: 'tech-performance',
        description: 'Использовать Redis для кеширования',
        type: 'technology',
        target: 'redis',
        current: '',
        completed: false,
      },
    ],
    reward: '⚡ Performance Master',
  },
  {
    id: 'budget-crisis',
    name: 'Budget Crisis',
    description: 'Создайте архитектуру с минимальным бюджетом',
    objectives: [
      {
        id: 'budget',
        description: 'Потратить < $1,000',
        type: 'budget',
        target: 1000,
        current: 0,
        completed: false,
      },
      {
        id: 'score',
        description: 'Достичь Total Score > 60',
        type: 'metric',
        target: 60,
        current: 0,
        completed: false,
      },
    ],
    constraints: {
      maxBudget: 1000,
      forbiddenTechnologies: ['kubernetes', 'elasticsearch-service'],
    },
    reward: '💰 Budget Master',
  },
  {
    id: 'microservices-challenge',
    name: 'Microservices Challenge',
    description: 'Создайте полноценную микросервисную архитектуру',
    objectives: [
      {
        id: 'microservices',
        description: 'Использовать архитектуру микросервисов',
        type: 'technology',
        target: 'microservices',
        current: '',
        completed: false,
      },
      {
        id: 'message-broker',
        description: 'Использовать message broker (Kafka или RabbitMQ)',
        type: 'technology',
        target: 'kafka,rabbitmq',
        current: '',
        completed: false,
      },
      {
        id: 'complexity',
        description: 'Удержать Complexity < 80',
        type: 'metric',
        target: 80,
        current: 100,
        completed: false,
      },
    ],
    constraints: {
      requiredTechnologies: ['microservices'],
    },
    reward: '🔗 Microservices Expert',
  },
];

