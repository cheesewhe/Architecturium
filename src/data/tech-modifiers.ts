import { TechnologyModifier } from '../types';

/**
 * СИСТЕМА СКРЫТЫХ МОДИФИКАТОРОВ
 * 
 * Здесь описаны все реальные взаимодействия между технологиями.
 * Игрок их не видит напрямую, но они влияют на финальные параметры проекта.
 * 
 * Основано на реальных особенностях технологий в индустрии.
 */

export const technologyModifiers: Record<string, TechnologyModifier[]> = {
  // ============ ЯЗЫКИ ============
  
  js: [
    // JavaScript отлично работает с Node.js экосистемой
    {
      targetTechId: 'node',
      ux: { performance: 5, stability: 3 },
      dev: { developmentSpeed: 10, maintainability: 5 }
    },
    {
      targetTechId: 'react',
      ux: { performance: 5, userFriendliness: 5 },
      dev: { developmentSpeed: 8 }
    },
    {
      targetTechId: 'vue',
      ux: { performance: 5 },
      dev: { developmentSpeed: 10 } // Vue очень дружелюбен к JS
    },
    {
      targetTechId: 'express',
      dev: { developmentSpeed: 12 } // Express создан для JS
    },
    {
      targetTechId: 'mongodb',
      ux: { performance: 5 },
      dev: { developmentSpeed: 8 } // JSON-like синтаксис
    },
  ],

  ts: [
    // TypeScript - король типизированных систем
    {
      targetTechId: 'node',
      ux: { stability: 10 },
      dev: { maintainability: 12, complexity: 3 }
    },
    {
      targetTechId: 'react',
      ux: { stability: 8 },
      dev: { maintainability: 10, complexity: 5 }
    },
    {
      targetTechId: 'angular',
      ux: { stability: 15, performance: 8 },
      dev: { maintainability: 15, developmentSpeed: 5 }
    },
    {
      targetTechId: 'nestjs',
      ux: { stability: 15, performance: 10 },
      dev: { maintainability: 18, developmentSpeed: 8, complexity: 5 }
    },
    {
      targetTechId: 'graphql',
      ux: { stability: 8 },
      dev: { maintainability: 10 } // Типизированные схемы
    },
  ],

  python: [
    // Python - простота и скорость разработки
    {
      targetTechId: 'django',
      dev: { developmentSpeed: 15, maintainability: 10, complexity: -5 }
    },
    {
      targetTechId: 'fastapi',
      ux: { performance: 5 },
      dev: { developmentSpeed: 12, complexity: -3 }
    },
    {
      targetTechId: 'postgresql',
      dev: { developmentSpeed: 8, maintainability: 5 }
    },
    {
      targetTechId: 'mongodb',
      dev: { developmentSpeed: 10 }
    },
    {
      targetTechId: 'redis',
      dev: { developmentSpeed: 8 }
    },
  ],

  java: [
    // Java - enterprise мир
    {
      targetTechId: 'spring',
      ux: { performance: 12, stability: 15 },
      dev: { maintainability: 15, complexity: 8 }
    },
    {
      targetTechId: 'postgresql',
      ux: { stability: 10, performance: 8 },
      dev: { maintainability: 10 }
    },
    {
      targetTechId: 'mysql',
      ux: { stability: 8, performance: 7 },
      dev: { maintainability: 8 }
    },
    {
      targetTechId: 'docker',
      ux: { stability: 8 },
      dev: { maintainability: 10 } // Java хорошо контейнеризуется
    },
    {
      targetTechId: 'microservices',
      ux: { stability: 10, performance: 8 },
      dev: { maintainability: 12, complexity: 10 }
    },
  ],

  go: [
    // Go - производительность и конкурентность
    {
      targetTechId: 'docker',
      ux: { performance: 12, stability: 10 },
      dev: { developmentSpeed: 5 } // Go отлично для контейнеров
    },
    {
      targetTechId: 'kubernetes',
      ux: { performance: 10, stability: 10 },
      dev: { maintainability: 8 }
    },
    {
      targetTechId: 'microservices',
      ux: { performance: 15, stability: 10 },
      dev: { developmentSpeed: 5, maintainability: 8 }
    },
    {
      targetTechId: 'postgresql',
      ux: { performance: 8 },
      dev: { maintainability: 5 }
    },
    {
      targetTechId: 'redis',
      ux: { performance: 10 }
    },
  ],

  rust: [
    // Rust - максимальная производительность и безопасность
    {
      targetTechId: 'docker',
      ux: { performance: 15, stability: 12 }
    },
    {
      targetTechId: 'postgresql',
      ux: { performance: 12, stability: 10 }
    },
    {
      targetTechId: 'microservices',
      ux: { performance: 18, stability: 15 },
      dev: { complexity: 15 }
    },
  ],

  // ============ FRONTEND ФРЕЙМВОРКИ ============

  react: [
    {
      targetTechId: 'node',
      dev: { developmentSpeed: 8 }
    },
    {
      targetTechId: 'rest',
      ux: { performance: 5 },
      dev: { developmentSpeed: 8 }
    },
    {
      targetTechId: 'graphql',
      ux: { performance: 8, userFriendliness: 5 },
      dev: { developmentSpeed: 10 }
    },
    {
      targetTechId: 'webpack',
      ux: { performance: 5 },
      dev: { complexity: 5 }
    },
  ],

  vue: [
    {
      targetTechId: 'node',
      dev: { developmentSpeed: 10 }
    },
    {
      targetTechId: 'rest',
      dev: { developmentSpeed: 10, complexity: -3 }
    },
    {
      targetTechId: 'express',
      dev: { developmentSpeed: 8 }
    },
  ],

  angular: [
    {
      targetTechId: 'rest',
      ux: { stability: 8 },
      dev: { maintainability: 10, complexity: 5 }
    },
    {
      targetTechId: 'nestjs',
      ux: { stability: 12, performance: 8 },
      dev: { maintainability: 15, complexity: 8 }
    },
    {
      targetTechId: 'graphql',
      ux: { stability: 8 },
      dev: { maintainability: 8 }
    },
  ],

  svelte: [
    {
      targetTechId: 'node',
      ux: { performance: 8 },
      dev: { developmentSpeed: 8 }
    },
    {
      targetTechId: 'rest',
      ux: { performance: 5 },
      dev: { developmentSpeed: 8 }
    },
  ],

  // ============ BACKEND ФРЕЙМВОРКИ ============

  node: [
    {
      targetTechId: 'mongodb',
      ux: { performance: 8 },
      dev: { developmentSpeed: 10, maintainability: 5 }
    },
    {
      targetTechId: 'redis',
      ux: { performance: 10 },
      dev: { developmentSpeed: 8 }
    },
    {
      targetTechId: 'docker',
      ux: { stability: 5 },
      dev: { maintainability: 8 }
    },
  ],

  express: [
    {
      targetTechId: 'mongodb',
      dev: { developmentSpeed: 12 }
    },
    {
      targetTechId: 'postgresql',
      dev: { developmentSpeed: 8 }
    },
    {
      targetTechId: 'rest',
      dev: { developmentSpeed: 10, complexity: -3 }
    },
    {
      targetTechId: 'jwt',
      dev: { developmentSpeed: 8 }
    },
  ],

  nestjs: [
    {
      targetTechId: 'postgresql',
      ux: { stability: 10, performance: 5 },
      dev: { maintainability: 12, complexity: 5 }
    },
    {
      targetTechId: 'mongodb',
      ux: { stability: 8 },
      dev: { maintainability: 10, complexity: 5 }
    },
    {
      targetTechId: 'redis',
      ux: { performance: 8, stability: 5 },
      dev: { maintainability: 8, complexity: 3 }
    },
    {
      targetTechId: 'graphql',
      ux: { performance: 8, stability: 8 },
      dev: { maintainability: 12, developmentSpeed: 5, complexity: 5 }
    },
    {
      targetTechId: 'microservices',
      ux: { stability: 10, performance: 8 },
      dev: { maintainability: 15, complexity: 10 }
    },
    {
      targetTechId: 'docker',
      ux: { stability: 10 },
      dev: { maintainability: 10, complexity: 5 }
    },
  ],

  django: [
    {
      targetTechId: 'postgresql',
      ux: { stability: 12, performance: 5 },
      dev: { maintainability: 12, developmentSpeed: 10 }
    },
    {
      targetTechId: 'mysql',
      ux: { stability: 10 },
      dev: { maintainability: 10, developmentSpeed: 8 }
    },
    {
      targetTechId: 'redis',
      ux: { performance: 10 },
      dev: { developmentSpeed: 8 }
    },
    {
      targetTechId: 'rest',
      dev: { developmentSpeed: 12, complexity: -5 }
    },
  ],

  fastapi: [
    {
      targetTechId: 'postgresql',
      ux: { performance: 8, stability: 8 },
      dev: { developmentSpeed: 10 }
    },
    {
      targetTechId: 'mongodb',
      ux: { performance: 10 },
      dev: { developmentSpeed: 12 }
    },
    {
      targetTechId: 'redis',
      ux: { performance: 12 },
      dev: { developmentSpeed: 10 }
    },
    {
      targetTechId: 'rest',
      ux: { performance: 8 },
      dev: { developmentSpeed: 10 }
    },
  ],

  spring: [
    {
      targetTechId: 'postgresql',
      ux: { stability: 15, performance: 10 },
      dev: { maintainability: 15, complexity: 8 }
    },
    {
      targetTechId: 'mysql',
      ux: { stability: 12, performance: 8 },
      dev: { maintainability: 12 }
    },
    {
      targetTechId: 'redis',
      ux: { performance: 10, stability: 8 },
      dev: { maintainability: 10, complexity: 5 }
    },
    {
      targetTechId: 'microservices',
      ux: { stability: 15, performance: 12 },
      dev: { maintainability: 18, complexity: 12 }
    },
    {
      targetTechId: 'docker',
      ux: { stability: 12 },
      dev: { maintainability: 12 }
    },
    {
      targetTechId: 'kubernetes',
      ux: { stability: 15, performance: 10 },
      dev: { maintainability: 15, complexity: 15 }
    },
  ],

  // ============ БАЗЫ ДАННЫХ ============

  postgresql: [
    {
      targetTechId: 'redis',
      ux: { performance: 15, userFriendliness: 8 },
      dev: { complexity: 5 }
    },
    {
      targetTechId: 'docker',
      ux: { stability: 8 },
      dev: { maintainability: 10 }
    },
    {
      targetTechId: 'rest',
      ux: { stability: 8 },
      dev: { maintainability: 8 }
    },
  ],

  mongodb: [
    {
      targetTechId: 'redis',
      ux: { performance: 12 },
      dev: { complexity: 3 }
    },
    {
      targetTechId: 'docker',
      ux: { stability: 5 },
      dev: { maintainability: 8 }
    },
    {
      targetTechId: 'graphql',
      ux: { performance: 10, userFriendliness: 5 },
      dev: { developmentSpeed: 10 }
    },
  ],

  mysql: [
    {
      targetTechId: 'redis',
      ux: { performance: 12 },
      dev: { complexity: 3 }
    },
    {
      targetTechId: 'docker',
      ux: { stability: 5 },
      dev: { maintainability: 8 }
    },
  ],

  redis: [
    // Redis всегда улучшает производительность
    {
      targetTechId: 'rest',
      ux: { performance: 10, userFriendliness: 5 }
    },
    {
      targetTechId: 'graphql',
      ux: { performance: 12, userFriendliness: 5 }
    },
    {
      targetTechId: 'microservices',
      ux: { performance: 12, stability: 5 },
      dev: { complexity: 5 }
    },
  ],

  // ============ ПАТТЕРНЫ И API ============

  rest: [
    {
      targetTechId: 'jwt',
      ux: { stability: 5 },
      dev: { developmentSpeed: 8, complexity: 3 }
    },
    {
      targetTechId: 'oauth',
      ux: { stability: 8, userFriendliness: -3 },
      dev: { complexity: 8 }
    },
    {
      targetTechId: 'nginx',
      ux: { performance: 10, stability: 8 }
    },
  ],

  graphql: [
    {
      targetTechId: 'jwt',
      ux: { stability: 5 },
      dev: { developmentSpeed: 5, complexity: 5 }
    },
    {
      targetTechId: 'nginx',
      ux: { performance: 8, stability: 5 }
    },
  ],

  microservices: [
    {
      targetTechId: 'kafka',
      ux: { performance: 12, stability: 15 },
      dev: { maintainability: 12, complexity: 15 }
    },
    {
      targetTechId: 'rabbitmq',
      ux: { stability: 12, performance: 10 },
      dev: { maintainability: 10, complexity: 12 }
    },
    {
      targetTechId: 'docker',
      ux: { stability: 15, performance: 8 },
      dev: { maintainability: 15, complexity: 10 }
    },
    {
      targetTechId: 'kubernetes',
      ux: { stability: 18, performance: 15 },
      dev: { maintainability: 20, complexity: 20, cost: 15 }
    },
    {
      targetTechId: 'nginx',
      ux: { performance: 12, stability: 10 },
      dev: { complexity: 8 }
    },
  ],

  // ============ СЕРВИСЫ И ИНФРАСТРУКТУРА ============

  docker: [
    {
      targetTechId: 'kubernetes',
      ux: { stability: 15, performance: 10 },
      dev: { maintainability: 15, complexity: 15, cost: 12 }
    },
    {
      targetTechId: 'nginx',
      ux: { stability: 10, performance: 8 },
      dev: { maintainability: 10 }
    },
  ],

  nginx: [
    {
      targetTechId: 'docker',
      ux: { stability: 8, performance: 5 },
      dev: { maintainability: 8 }
    },
    {
      targetTechId: 'kubernetes',
      ux: { stability: 10, performance: 10 },
      dev: { maintainability: 10, complexity: 8 }
    },
  ],

  webpack: [
    {
      targetTechId: 'ts',
      dev: { developmentSpeed: 5, complexity: 8 }
    },
    {
      targetTechId: 'docker',
      dev: { complexity: 5 }
    },
  ],
};

