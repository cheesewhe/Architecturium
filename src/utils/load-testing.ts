import { LoadTest, LoadTestResults, Bottleneck, AppSchema, AppMetrics } from '../types';

/**
 * Система нагрузочного тестирования
 * 
 * Симулирует нагрузку на архитектуру и выявляет узкие места
 */

/**
 * Выполняет нагрузочное тестирование
 */
export function runLoadTest(
  test: LoadTest,
  schema: AppSchema,
  metrics: AppMetrics
): LoadTestResults {
  // Базовые метрики на основе архитектуры
  const baseResponseTime = calculateBaseResponseTime(schema, metrics);
  const baseRPS = calculateBaseRPS(schema, metrics);

  // Влияние нагрузки
  const loadMultiplier = test.users / 100; // Чем больше пользователей, тем хуже
  const avgResponseTime = baseResponseTime * (1 + loadMultiplier * 0.5);
  const maxResponseTime = avgResponseTime * 2;
  const requestsPerSecond = baseRPS / (1 + loadMultiplier * 0.3);
  const errorRate = Math.min(10, loadMultiplier * 2);

  // Выявление узких мест
  const bottlenecks = identifyBottlenecks(schema, metrics, test.users);

  return {
    avgResponseTime,
    maxResponseTime,
    requestsPerSecond,
    errorRate,
    bottlenecks,
  };
}

/**
 * Рассчитывает базовое время отклика
 */
function calculateBaseResponseTime(_schema: AppSchema, metrics: AppMetrics): number {
  // Базовое время зависит от производительности
  const baseTime = 100; // мс
  const performanceFactor = (100 - metrics.ux.performance) / 100;
  return baseTime * (1 + performanceFactor);
}

/**
 * Рассчитывает базовые запросов в секунду
 */
function calculateBaseRPS(_schema: AppSchema, metrics: AppMetrics): number {
  // Базовый RPS зависит от производительности и стабильности
  const baseRPS = 1000;
  const performanceFactor = metrics.ux.performance / 100;
  const stabilityFactor = metrics.ux.stability / 100;
  return baseRPS * performanceFactor * stabilityFactor;
}

/**
 * Выявляет узкие места в архитектуре
 */
function identifyBottlenecks(
  schema: AppSchema,
  metrics: AppMetrics,
  users: number
): Bottleneck[] {
  const bottlenecks: Bottleneck[] = [];
  const allPanels = [...schema.frontend, ...schema.backend];
  const techIds = allPanels.map(p => p.technology.id);

  // Проверка на отсутствие кеширования при высокой нагрузке
  if (users > 500 && !techIds.includes('redis')) {
    bottlenecks.push({
      technology: 'Кеширование',
      issue: 'Отсутствует кеширование. При высокой нагрузке БД станет узким местом.',
      impact: 40,
      recommendation: 'Добавьте Redis для кеширования',
    });
  }

  // Проверка на отсутствие load balancer
  if (users > 1000 && !techIds.includes('nginx') && !techIds.includes('api-gateway')) {
    bottlenecks.push({
      technology: 'Load Balancing',
      issue: 'Отсутствует балансировка нагрузки. Один сервер не справится.',
      impact: 60,
      recommendation: 'Добавьте Nginx или API Gateway',
    });
  }

  // Проверка на медленную БД
  if (techIds.includes('mongodb') && !techIds.includes('redis') && users > 300) {
    bottlenecks.push({
      technology: 'MongoDB',
      issue: 'MongoDB без кеширования медленна при высокой нагрузке',
      impact: 35,
      recommendation: 'Добавьте Redis для кеширования запросов',
    });
  }

  // Проверка на сложность при масштабировании
  if (metrics.dev.complexity > 80 && users > 500) {
    bottlenecks.push({
      technology: 'Архитектура',
      issue: 'Высокая сложность затрудняет масштабирование',
      impact: 25,
      recommendation: 'Упростите архитектуру или используйте микросервисы',
    });
  }

  // Проверка на отсутствие message broker при микросервисах
  if (techIds.includes('microservices') && !techIds.includes('kafka') && !techIds.includes('rabbitmq')) {
    bottlenecks.push({
      technology: 'Микросервисы',
      issue: 'Микросервисы без message broker создают проблемы синхронизации',
      impact: 50,
      recommendation: 'Добавьте Kafka или RabbitMQ',
    });
  }

  return bottlenecks;
}

/**
 * Создаёт тест нагрузки
 */
export function createLoadTest(users: number, duration: number): LoadTest {
  return {
    id: `load-test-${Date.now()}`,
    name: `Нагрузка ${users} пользователей`,
    users,
    duration,
  };
}

