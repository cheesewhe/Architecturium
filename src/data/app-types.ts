import { AppType } from '../types';

/**
 * База данных типов приложений
 * 
 * Разные типы приложений с различными требованиями
 */

export const appTypes: AppType[] = [
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Интернет-магазин с каталогом товаров, корзиной и оплатой',
    icon: '🛒',
    requirements: {
      performance: 90,
      stability: 95,
      userFriendliness: 85,
      developmentSpeed: 70,
      maintainability: 80,
      maxComplexity: 75,
      maxCost: 12000,
    },
    recommendedTechnologies: ['react', 'node', 'postgresql', 'redis', 'nginx'],
    challenges: [
      'Высокая нагрузка во время распродаж',
      'Безопасность платежей',
      'Управление инвентарём',
    ],
  },
  {
    id: 'social-network',
    name: 'Social Network',
    description: 'Социальная сеть с лентой новостей, сообщениями и профилями',
    icon: '👥',
    requirements: {
      performance: 85,
      stability: 90,
      userFriendliness: 90,
      developmentSpeed: 60,
      maintainability: 75,
      maxComplexity: 85,
      maxCost: 15000,
    },
    recommendedTechnologies: ['react', 'node', 'mongodb', 'redis', 'kafka'],
    challenges: [
      'Масштабирование для миллионов пользователей',
      'Real-time обновления',
      'Модерация контента',
    ],
  },
  {
    id: 'video-streaming',
    name: 'Video Streaming',
    description: 'Платформа для стриминга видео с высокой производительностью',
    icon: '🎬',
    requirements: {
      performance: 100,
      stability: 95,
      userFriendliness: 80,
      developmentSpeed: 50,
      maintainability: 70,
      maxComplexity: 90,
      maxCost: 20000,
    },
    recommendedTechnologies: ['react', 'node', 'redis', 'nginx', 'kubernetes'],
    challenges: [
      'Обработка больших объёмов данных',
      'CDN интеграция',
      'Адаптивный битрейт',
    ],
  },
  {
    id: 'iot',
    name: 'IoT Platform',
    description: 'Платформа для управления IoT устройствами',
    icon: '🌐',
    requirements: {
      performance: 80,
      stability: 95,
      userFriendliness: 70,
      developmentSpeed: 55,
      maintainability: 85,
      maxComplexity: 80,
      maxCost: 18000,
    },
    recommendedTechnologies: ['react', 'node', 'mongodb', 'kafka', 'docker'],
    challenges: [
      'Обработка миллионов событий',
      'Низкая задержка',
      'Надёжность соединений',
    ],
  },
  {
    id: 'mobile-app',
    name: 'Mobile App Backend',
    description: 'Backend для мобильного приложения',
    icon: '📱',
    requirements: {
      performance: 85,
      stability: 90,
      userFriendliness: 90,
      developmentSpeed: 75,
      maintainability: 80,
      maxComplexity: 70,
      maxCost: 10000,
    },
    recommendedTechnologies: ['node', 'postgresql', 'redis', 'nginx'],
    challenges: [
      'API для мобильных клиентов',
      'Push-уведомления',
      'Офлайн синхронизация',
    ],
  },
  {
    id: 'game-backend',
    name: 'Game Backend',
    description: 'Backend для онлайн-игры',
    icon: '🎮',
    requirements: {
      performance: 95,
      stability: 90,
      userFriendliness: 75,
      developmentSpeed: 60,
      maintainability: 70,
      maxComplexity: 85,
      maxCost: 16000,
    },
    recommendedTechnologies: ['node', 'redis', 'kafka', 'docker'],
    challenges: [
      'Real-time multiplayer',
      'Низкая задержка',
      'Античит система',
    ],
  },
  {
    id: 'fintech',
    name: 'FinTech',
    description: 'Финансовое приложение с высокими требованиями безопасности',
    icon: '💳',
    requirements: {
      performance: 85,
      stability: 100,
      userFriendliness: 80,
      developmentSpeed: 50,
      maintainability: 90,
      maxComplexity: 75,
      maxCost: 25000,
    },
    recommendedTechnologies: ['java', 'spring', 'postgresql', 'vault'],
    challenges: [
      'Соответствие регуляциям',
      'Безопасность данных',
      'Аудит и логирование',
    ],
  },
];

