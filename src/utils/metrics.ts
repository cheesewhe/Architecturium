import { AppSchema, AppMetrics } from '../types';

export function calculateMetrics(schema: AppSchema): AppMetrics {
  const allPanels = [...schema.frontend, ...schema.backend];
  
  if (allPanels.length === 0) {
    return {
      ux: {
        performance: 0,
        stability: 0,
        userFriendliness: 0,
      },
      dev: {
        developmentSpeed: 0,
        maintainability: 0,
        complexity: 0,
        cost: 0,
      },
    };
  }

  // Средние значения всех технологий
  const avgPerformance = allPanels.reduce((sum, p) => sum + p.technology.performance, 0) / allPanels.length;
  const avgStability = allPanels.reduce((sum, p) => sum + p.technology.stability, 0) / allPanels.length;
  const avgUserFriendliness = allPanels.reduce((sum, p) => sum + p.technology.userFriendliness, 0) / allPanels.length;
  const avgDevelopmentSpeed = allPanels.reduce((sum, p) => sum + p.technology.developmentSpeed, 0) / allPanels.length;
  const avgMaintainability = allPanels.reduce((sum, p) => sum + p.technology.maintainability, 0) / allPanels.length;
  const avgComplexity = allPanels.reduce((sum, p) => sum + p.technology.complexity, 0) / allPanels.length;
  const avgCost = allPanels.reduce((sum, p) => sum + p.technology.cost, 0) / allPanels.length;

  // Проверка на совместимость технологий
  const compatibilityBonus = checkCompatibility(schema);

  // Базовая проверка (есть ли и фронт, и бэк)
  const hasFrontend = schema.frontend.length > 0;
  const hasBackend = schema.backend.length > 0;
  const completenessBonus = (hasFrontend && hasBackend) ? 10 : 0;

  return {
    ux: {
      performance: Math.min(100, avgPerformance + compatibilityBonus.perf),
      stability: Math.min(100, avgStability + compatibilityBonus.stab),
      userFriendliness: Math.min(100, avgUserFriendliness + completenessBonus),
    },
    dev: {
      developmentSpeed: Math.min(100, avgDevelopmentSpeed),
      maintainability: Math.min(100, avgMaintainability),
      complexity: Math.min(100, avgComplexity),
      cost: Math.min(100, avgCost),
    },
  };
}

function checkCompatibility(schema: AppSchema): { perf: number; stab: number } {
  let perfBonus = 0;
  let stabBonus = 0;

  const allPanels = [...schema.frontend, ...schema.backend];
  const techIds = allPanels.map(p => p.technology.id);
  
  // JS/TS + Node.js - полный стек на одном языке
  const hasJSRuntime = techIds.some(id => id === 'js' || id === 'ts');
  const hasNode = techIds.includes('node');
  if (hasJSRuntime && hasNode) {
    perfBonus += 5;
    stabBonus += 5;
  }

  // TypeScript - типобезопасность
  const hasTypeScript = techIds.includes('ts');
  if (hasTypeScript) {
    stabBonus += 2;
  }

  // React + TypeScript - идеальная пара
  const hasReact = techIds.includes('react');
  if (hasReact && hasTypeScript) {
    perfBonus += 3;
    stabBonus += 3;
  }

  // Vue + TypeScript
  const hasVue = techIds.includes('vue');
  if (hasVue && hasTypeScript) {
    perfBonus += 2;
    stabBonus += 2;
  }

  // NestJS требует TypeScript
  const hasNestJS = techIds.includes('nestjs');
  if (hasNestJS && hasTypeScript) {
    perfBonus += 4;
    stabBonus += 4;
  }

  // PostgreSQL + REST API - классика
  const hasPostgres = techIds.includes('postgresql');
  const hasREST = techIds.includes('rest');
  if (hasPostgres && hasREST) {
    stabBonus += 3;
  }

  // MongoDB + GraphQL - современный стек
  const hasMongo = techIds.includes('mongodb');
  const hasGraphQL = techIds.includes('graphql');
  if (hasMongo && hasGraphQL) {
    perfBonus += 3;
  }

  // Redis + любая БД - кеширование
  const hasRedis = techIds.includes('redis');
  const hasDB = techIds.some(id => 
    ['postgresql', 'mongodb', 'mysql', 'elasticsearch'].includes(id)
  );
  if (hasRedis && hasDB) {
    perfBonus += 5;
  }

  // Docker + Kubernetes - контейнеризация
  const hasDocker = techIds.includes('docker');
  const hasK8s = techIds.includes('kubernetes');
  if (hasDocker && hasK8s) {
    perfBonus += 4;
    stabBonus += 4;
  }

  // Nginx + любой backend framework - load balancing
  const hasNginx = techIds.includes('nginx');
  const hasBackendFramework = techIds.some(id => 
    ['node', 'nestjs', 'express', 'django', 'fastapi', 'spring'].includes(id)
  );
  if (hasNginx && hasBackendFramework) {
    perfBonus += 3;
    stabBonus += 2;
  }

  // Kafka/RabbitMQ + Microservices - event-driven
  const hasMessageBroker = techIds.some(id => ['kafka', 'rabbitmq'].includes(id));
  const hasMicroservices = techIds.includes('microservices');
  if (hasMessageBroker && hasMicroservices) {
    perfBonus += 5;
    stabBonus += 3;
  }

  // JWT/OAuth - аутентификация
  const hasAuth = techIds.some(id => ['jwt', 'oauth'].includes(id));
  if (hasAuth) {
    stabBonus += 2;
  }

  // Штраф за несовместимости
  // Microservices без message broker - сложно
  if (hasMicroservices && !hasMessageBroker) {
    stabBonus -= 3;
  }

  // Kubernetes без Docker - не имеет смысла
  if (hasK8s && !hasDocker) {
    stabBonus -= 5;
  }

  return { perf: perfBonus, stab: stabBonus };
}

