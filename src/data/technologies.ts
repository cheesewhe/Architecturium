import { Technology } from '../types';
import { extendedTechnologies } from './extended-technologies';
import { technologyModifiers } from './tech-modifiers';

// Функция для объединения базовых и расширенных данных
function mergeTechnologyData(baseTech: Technology): Technology {
  const extended = extendedTechnologies[baseTech.id];
  const modifiers = technologyModifiers[baseTech.id];
  
  if (extended || modifiers) {
    return { 
      ...baseTech, 
      ...(extended || {}),
      modifiers: modifiers || undefined
    };
  }
  return baseTech;
}

const baseTechnologies: Technology[] = [
  // ЯЗЫКИ ПРОГРАММИРОВАНИЯ (от простых к сложным)
  {
    id: 'js',
    name: 'JavaScript',
    category: 'language',
    description: 'Универсальный язык веб-разработки',
    pros: ['Нет компиляции', 'Огромная экосистема', 'Легко начать'],
    cons: ['Слабая типизация', 'Много подводных камней'],
    // UX параметры
    performance: 70,
    stability: 65,
    userFriendliness: 85,
    // Dev параметры
    developmentSpeed: 90,
    maintainability: 60,
    complexity: 30, // ⭐ Самый простой для начала
    cost: 15,
  },
  {
    id: 'python',
    name: 'Python',
    category: 'language',
    description: 'Универсальный язык программирования',
    pros: ['Читаемый код', 'Быстрая разработка', 'Отличные библиотеки'],
    cons: ['Медленная производительность', 'GIL ограничения'],
    // UX параметры
    performance: 50,
    stability: 80,
    userFriendliness: 90,
    // Dev параметры
    developmentSpeed: 95,
    maintainability: 85,
    complexity: 25, // ⭐ Очень простой синтаксис
    cost: 10,
  },
  {
    id: 'ts',
    name: 'TypeScript',
    category: 'language',
    description: 'Типизированный язык программирования для современных веб-приложений',
    pros: ['Типизация снижает баги', 'Отличная поддержка IDE', 'Хорошая производительность'],
    cons: ['Требуется компиляция', 'Крутая кривая обучения'],
    // UX параметры
    performance: 80,
    stability: 90,
    userFriendliness: 85,
    // Dev параметры
    developmentSpeed: 75,
    maintainability: 90,
    complexity: 55, // Средняя - нужно изучить типы
    cost: 20,
  },
  {
    id: 'go',
    name: 'Go',
    category: 'language',
    description: 'Компилируемый язык от Google',
    pros: ['Высокая производительность', 'Простой синтаксис', 'Отличные concurrency'],
    cons: ['Меньше библиотек', 'Нет generic до 1.18', 'Простота может ограничивать'],
    // UX параметры
    performance: 90,
    stability: 88,
    userFriendliness: 80,
    // Dev параметры
    developmentSpeed: 70,
    maintainability: 80,
    complexity: 50, // Средняя - простой но специфичный
    cost: 25,
  },
  {
    id: 'java',
    name: 'Java',
    category: 'language',
    description: 'Объектно-ориентированный язык',
    pros: ['Зрелая экосистема', 'Много вакансий', 'Кросс-платформенность'],
    cons: ['Многословный код', 'Медленный старт JVM', 'Устаревший имидж'],
    // UX параметры
    performance: 80,
    stability: 92,
    userFriendliness: 78,
    // Dev параметры
    developmentSpeed: 65,
    maintainability: 85,
    complexity: 65, // Выше средней - много концепций
    cost: 35,
  },
  {
    id: 'rust',
    name: 'Rust',
    category: 'language',
    description: 'Системный язык программирования',
    pros: ['Безопасность памяти', 'Отличная производительность', 'Zero-cost abstractions'],
    cons: ['Крутая кривая обучения', 'Медленная компиляция', 'Меньше вакансий'],
    // UX параметры
    performance: 98,
    stability: 95,
    userFriendliness: 85,
    // Dev параметры
    developmentSpeed: 50,
    maintainability: 88,
    complexity: 90, // ⭐⭐⭐ Очень сложный!
    cost: 45,
  },

  // ФРЕЙМВОРКИ FRONTEND (от простых к сложным)
  {
    id: 'svelte',
    name: 'Svelte',
    category: 'framework',
    description: 'Компилируемый UI фреймворк',
    pros: ['Минимальный bundle', 'Реактивность из коробки', 'Простой синтаксис'],
    cons: ['Маленькое сообщество', 'Меньше библиотек', 'Новая технология'],
    // UX параметры
    performance: 92,
    stability: 75,
    userFriendliness: 90,
    // Dev параметры
    developmentSpeed: 85,
    maintainability: 75,
    complexity: 35, // ⭐ Самый простой frontend
    cost: 18,
  },
  {
    id: 'vue',
    name: 'Vue.js',
    category: 'framework',
    description: 'Прогрессивный фреймворк для создания UI',
    pros: ['Легко изучить', 'Хорошая документация', 'Компактность'],
    cons: ['Меньше вакансий', 'Меньше библиотек'],
    // UX параметры
    performance: 82,
    stability: 80,
    userFriendliness: 88,
    // Dev параметры
    developmentSpeed: 88,
    maintainability: 82,
    complexity: 40, // Очень доступный
    cost: 20,
  },
  {
    id: 'react',
    name: 'React',
    category: 'framework',
    description: 'Библиотека для создания пользовательских интерфейсов',
    pros: ['Компонентный подход', 'Огромное сообщество', 'Быстрая разработка'],
    cons: ['Быстрые изменения', 'Большой bundle размер'],
    // UX параметры
    performance: 80,
    stability: 85,
    userFriendliness: 88,
    // Dev параметры
    developmentSpeed: 85,
    maintainability: 80,
    complexity: 50, // Средняя сложность
    cost: 25,
  },
  {
    id: 'angular',
    name: 'Angular',
    category: 'framework',
    description: 'TypeScript фреймворк от Google',
    pros: ['Всё из коробки', 'TypeScript нативно', 'Структурированность'],
    cons: ['Сложный для новичков', 'Тяжёлый', 'Меньшая гибкость'],
    // UX параметры
    performance: 75,
    stability: 90,
    userFriendliness: 82,
    // Dev параметры
    developmentSpeed: 70,
    maintainability: 88,
    complexity: 70, // ⭐⭐ Сложный для новичков
    cost: 35,
  },

  // ФРЕЙМВОРКИ BACKEND (от простых к сложным)
  {
    id: 'express',
    name: 'Express.js',
    category: 'framework',
    description: 'Минималистичный веб-фреймворк для Node.js',
    pros: ['Простой', 'Гибкий', 'Огромная экосистема'],
    cons: ['Нет структуры', 'Нужно много настройки', 'Устаревающий'],
    // UX параметры
    performance: 75,
    stability: 75,
    userFriendliness: 80,
    // Dev параметры
    developmentSpeed: 90,
    maintainability: 65,
    complexity: 35, // ⭐ Простой минималистичный
    cost: 15,
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    category: 'framework',
    description: 'Современный Python веб-фреймворк',
    pros: ['Быстрый', 'Автогенерация документации', 'Type hints'],
    cons: ['Относительно новый', 'Меньше примеров', 'Async может быть сложным'],
    // UX параметры
    performance: 85,
    stability: 82,
    userFriendliness: 85,
    // Dev параметры
    developmentSpeed: 88,
    maintainability: 80,
    complexity: 45, // Средне-простой
    cost: 18,
  },
  {
    id: 'django',
    name: 'Django',
    category: 'framework',
    description: 'Веб-фреймворк на Python с батарейками',
    pros: ['Admin панель', 'ORM из коробки', 'Безопасность'],
    cons: ['Монолитный', 'Медленнее современных фреймворков'],
    // UX параметры
    performance: 65,
    stability: 92,
    userFriendliness: 85,
    // Dev параметры
    developmentSpeed: 85,
    maintainability: 88,
    complexity: 50, // Средняя - много концепций
    cost: 22,
  },
  {
    id: 'node',
    name: 'Node.js',
    category: 'framework',
    description: 'JavaScript runtime для серверной стороны',
    pros: ['Один язык для всего', 'Быстрая разработка', 'Большая экосистема'],
    cons: ['Однопоточность', 'Проблемы с CPU-задачами'],
    // UX параметры
    performance: 75,
    stability: 78,
    userFriendliness: 82,
    // Dev параметры
    developmentSpeed: 88,
    maintainability: 75,
    complexity: 45, // Доступный для JS разработчиков
    cost: 20,
  },
  {
    id: 'nestjs',
    name: 'NestJS',
    category: 'framework',
    description: 'Прогрессивный фреймворк для Node.js',
    pros: ['TypeScript из коробки', 'Архитектурные паттерны', 'Скалируемость'],
    cons: ['Сложнее для новичков', 'Больше boilerplate'],
    // UX параметры
    performance: 80,
    stability: 90,
    userFriendliness: 82,
    // Dev параметры
    developmentSpeed: 75,
    maintainability: 92,
    complexity: 65, // ⭐⭐ Требует понимания архитектуры
    cost: 30,
  },
  {
    id: 'spring',
    name: 'Spring Boot',
    category: 'framework',
    description: 'Enterprise Java фреймворк',
    pros: ['Мощные возможности', 'Корпоративный стандарт', 'Много интеграций'],
    cons: ['Сложность', 'Много магии', 'Тяжеловесный'],
    // UX параметры
    performance: 78,
    stability: 95,
    userFriendliness: 80,
    // Dev параметры
    developmentSpeed: 68,
    maintainability: 90,
    complexity: 75, // ⭐⭐ Enterprise уровень
    cost: 40,
  },

  // ПАТТЕРНЫ (от простых к сложным)
  {
    id: 'rest',
    name: 'REST API',
    category: 'pattern',
    description: 'Архитектурный стиль для веб-сервисов',
    pros: ['Простой', 'Стандартизированный', 'Легко кешируется'],
    cons: ['Избыточность', 'Подходит не для всех случаев'],
    // UX параметры
    performance: 80,
    stability: 88,
    userFriendliness: 85,
    // Dev параметры
    developmentSpeed: 90,
    maintainability: 85,
    complexity: 25, // ⭐ Очень простой концепт
    cost: 12,
  },
  {
    id: 'jwt',
    name: 'JWT Authentication',
    category: 'pattern',
    description: 'Токен-based аутентификация',
    pros: ['Stateless', 'Кросс-доменность', 'Мобильные приложения'],
    cons: ['Нельзя отозвать токен', 'Размер токена', 'Безопасность хранения'],
    // UX параметры
    performance: 88,
    stability: 85,
    userFriendliness: 80,
    // Dev параметры
    developmentSpeed: 82,
    maintainability: 80,
    complexity: 40, // Средне-простой
    cost: 15,
  },
  {
    id: 'websocket',
    name: 'WebSockets',
    category: 'pattern',
    description: 'Двусторонняя real-time коммуникация',
    pros: ['Низкая задержка', 'Real-time обновления', 'Эффективность'],
    cons: ['Сложнее масштабирование', 'Проблемы с прокси', 'Fallback нужен'],
    // UX параметры
    performance: 90,
    stability: 78,
    userFriendliness: 88,
    // Dev параметры
    developmentSpeed: 70,
    maintainability: 72,
    complexity: 50, // Средняя
    cost: 28,
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    category: 'pattern',
    description: 'Язык запросов для API',
    pros: ['Гибкие запросы', 'Меньше лишних данных', 'Сильная типизация'],
    cons: ['Сложнее кеширование', 'Больше overhead'],
    // UX параметры
    performance: 75,
    stability: 82,
    userFriendliness: 90,
    // Dev параметры
    developmentSpeed: 75,
    maintainability: 80,
    complexity: 60, // Выше средней
    cost: 32,
  },
  {
    id: 'oauth',
    name: 'OAuth 2.0',
    category: 'pattern',
    description: 'Протокол авторизации',
    pros: ['Безопасность', 'Социальные логины', 'Стандарт индустрии'],
    cons: ['Сложность реализации', 'Много flows', 'Нужен сервер авторизации'],
    // UX параметры
    performance: 80,
    stability: 92,
    userFriendliness: 75,
    // Dev параметры
    developmentSpeed: 65,
    maintainability: 78,
    complexity: 70, // ⭐⭐ Сложная спецификация
    cost: 40,
  },
  {
    id: 'cqrs',
    name: 'CQRS',
    category: 'pattern',
    description: 'Command Query Responsibility Segregation',
    pros: ['Масштабируемость чтения', 'Оптимизация запросов', 'Event sourcing'],
    cons: ['Сложность', 'Eventual consistency', 'Избыточность для простых систем'],
    // UX параметры
    performance: 85,
    stability: 80,
    userFriendliness: 70,
    // Dev параметры
    developmentSpeed: 55,
    maintainability: 75,
    complexity: 80, // ⭐⭐⭐ Продвинутый паттерн
    cost: 55,
  },
  {
    id: 'microservices',
    name: 'Microservices',
    category: 'pattern',
    description: 'Архитектура с независимыми сервисами',
    pros: ['Масштабируемость', 'Независимость', 'Гибкость'],
    cons: ['Сложность', 'Networking overhead', 'Управление данными'],
    // UX параметры
    performance: 82,
    stability: 75,
    userFriendliness: 72,
    // Dev параметры
    developmentSpeed: 60,
    maintainability: 70,
    complexity: 85, // ⭐⭐⭐ Очень сложная архитектура
    cost: 65,
  },

  // БАЗЫ ДАННЫХ (от простых к сложным)
  {
    id: 'redis',
    name: 'Redis',
    category: 'database',
    description: 'In-memory хранилище ключ-значение',
    pros: ['Очень быстрый', 'Отличное кеширование', 'Pub/Sub'],
    cons: ['Ограниченная память', 'Нет персистентности'],
    // UX параметры
    performance: 98,
    stability: 85,
    userFriendliness: 92,
    // Dev параметры
    developmentSpeed: 85,
    maintainability: 80,
    complexity: 35, // Простая концепция
    cost: 25,
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'database',
    description: 'NoSQL база данных',
    pros: ['Гибкая схема', 'Горизонтальное масштабирование', 'Быстрая разработка'],
    cons: ['Слабая консистентность', 'Больше памяти'],
    // UX параметры
    performance: 85,
    stability: 78,
    userFriendliness: 85,
    // Dev параметры
    developmentSpeed: 90,
    maintainability: 75,
    complexity: 40, // Простая для начала
    cost: 30,
  },
  {
    id: 'mysql',
    name: 'MySQL',
    category: 'database',
    description: 'Популярная реляционная СУБД',
    pros: ['Простая настройка', 'Хорошая производительность', 'Большое сообщество'],
    cons: ['Меньше фич чем PostgreSQL', 'Лицензирование Oracle', 'Ограничения масштабирования'],
    // UX параметры
    performance: 82,
    stability: 88,
    userFriendliness: 80,
    // Dev параметры
    developmentSpeed: 80,
    maintainability: 80,
    complexity: 45, // Средне-простая
    cost: 28,
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'database',
    description: 'Мощная реляционная СУБД',
    pros: ['ACID', 'Богатый функционал', 'Стандарты SQL'],
    cons: ['Сложная настройка', 'Требует много ресурсов'],
    // UX параметры
    performance: 80,
    stability: 95,
    userFriendliness: 82,
    // Dev параметры
    developmentSpeed: 75,
    maintainability: 90,
    complexity: 55, // Средняя - много возможностей
    cost: 35,
  },
  {
    id: 'elasticsearch',
    name: 'Elasticsearch',
    category: 'database',
    description: 'Поисковый движок и аналитика',
    pros: ['Мощный поиск', 'Масштабируемость', 'Аналитика в реальном времени'],
    cons: ['Сложная настройка', 'Требует много памяти', 'Eventual consistency'],
    // UX параметры
    performance: 88,
    stability: 80,
    userFriendliness: 90,
    // Dev параметры
    developmentSpeed: 65,
    maintainability: 75,
    complexity: 70, // ⭐⭐ Сложная настройка
    cost: 50,
  },

  // СЕРВИСЫ И ИНФРАСТРУКТУРА (от простых к сложным)
  {
    id: 'nginx',
    name: 'Nginx',
    category: 'service',
    description: 'Высокопроизводительный веб-сервер и reverse proxy',
    pros: ['Отличная производительность', 'Load balancing', 'Стабильность'],
    cons: ['Сложная конфигурация', 'Меньше динамических возможностей'],
    // UX параметры
    performance: 95,
    stability: 95,
    userFriendliness: 88,
    // Dev параметры
    developmentSpeed: 70,
    maintainability: 80,
    complexity: 55, // Средняя - конфигурация может быть сложной
    cost: 20,
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    category: 'service',
    description: 'CI/CD платформа от GitHub',
    pros: ['Интеграция с GitHub', 'Бесплатный tier', 'Простая настройка'],
    cons: ['Привязка к GitHub', 'Ограниченные минуты'],
    // UX параметры
    performance: 82,
    stability: 90,
    userFriendliness: 85,
    // Dev параметры
    developmentSpeed: 95,
    maintainability: 88,
    complexity: 35, // ⭐ Простой
    cost: 15,
  },
  {
    id: 'prometheus',
    name: 'Prometheus',
    category: 'service',
    description: 'Система мониторинга и alerting',
    pros: ['Мощный query язык', 'Time-series БД', 'Отличная интеграция'],
    cons: ['Нет долгосрочного хранения', 'Требует настройки'],
    // UX параметры
    performance: 85,
    stability: 90,
    userFriendliness: 95,
    // Dev параметры
    developmentSpeed: 75,
    maintainability: 85,
    complexity: 50, // Средняя
    cost: 25,
  },
  {
    id: 'grafana',
    name: 'Grafana',
    category: 'service',
    description: 'Платформа визуализации метрик',
    pros: ['Красивые дашборды', 'Много источников данных', 'Настраиваемость'],
    cons: ['Нужен источник данных', 'Может быть тяжёлой'],
    // UX параметры
    performance: 80,
    stability: 88,
    userFriendliness: 98,
    // Dev параметры
    developmentSpeed: 85,
    maintainability: 82,
    complexity: 40, // Простая
    cost: 20,
  },
  {
    id: 'vault',
    name: 'HashiCorp Vault',
    category: 'service',
    description: 'Управление секретами и шифрование',
    pros: ['Безопасное хранение', 'Динамические секреты', 'Аудит'],
    cons: ['Сложная настройка', 'Требует осторожности'],
    // UX параметры
    performance: 85,
    stability: 95,
    userFriendliness: 80,
    // Dev параметры
    developmentSpeed: 65,
    maintainability: 80,
    complexity: 65, // Выше средней
    cost: 35,
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'service',
    description: 'Контейнеризация приложений',
    pros: ['Изоляция', 'Портативность', 'Простое развёртывание'],
    cons: ['Дополнительный слой', 'Нужны знания'],
    // UX параметры
    performance: 88,
    stability: 85,
    userFriendliness: 85,
    // Dev параметры
    developmentSpeed: 80,
    maintainability: 88,
    complexity: 60, // Выше средней
    cost: 22,
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    category: 'service',
    description: 'Единая точка входа для микросервисов',
    pros: ['Централизованная маршрутизация', 'Rate limiting', 'Аутентификация'],
    cons: ['Единая точка отказа', 'Может быть узким местом'],
    // UX параметры
    performance: 85,
    stability: 88,
    userFriendliness: 88,
    // Dev параметры
    developmentSpeed: 75,
    maintainability: 85,
    complexity: 55, // Средняя
    cost: 30,
  },
  {
    id: 'rabbitmq',
    name: 'RabbitMQ',
    category: 'service',
    description: 'Message broker для асинхронной обработки',
    pros: ['Надёжность', 'Гибкая маршрутизация', 'Простая интеграция'],
    cons: ['Ниже производительность чем Kafka', 'Сложная настройка кластера'],
    // UX параметры
    performance: 80,
    stability: 90,
    userFriendliness: 82,
    // Dev параметры
    developmentSpeed: 70,
    maintainability: 80,
    complexity: 65, // Выше средней
    cost: 35,
  },
  {
    id: 'jenkins',
    name: 'Jenkins',
    category: 'service',
    description: 'Автоматизация CI/CD процессов',
    pros: ['Много плагинов', 'Гибкость', 'Self-hosted'],
    cons: ['Устаревший UI', 'Требует обслуживания', 'Сложная настройка'],
    // UX параметры
    performance: 75,
    stability: 80,
    userFriendliness: 70,
    // Dev параметры
    developmentSpeed: 75,
    maintainability: 70,
    complexity: 70, // ⭐⭐ Сложный
    cost: 30,
  },
  {
    id: 'kafka',
    name: 'Apache Kafka',
    category: 'service',
    description: 'Распределённая платформа потоковой передачи',
    pros: ['Высокая пропускная способность', 'Надёжность', 'Масштабируемость'],
    cons: ['Сложность', 'Требует инфраструктуры', 'Overhead для простых задач'],
    // UX параметры
    performance: 95,
    stability: 92,
    userFriendliness: 78,
    // Dev параметры
    developmentSpeed: 60,
    maintainability: 75,
    complexity: 75, // ⭐⭐ Сложная система
    cost: 50,
  },
  {
    id: 'elasticsearch-service',
    name: 'Elasticsearch (Service)',
    category: 'service',
    description: 'Поиск и аналитика логов приложения',
    pros: ['Полнотекстовый поиск', 'Аналитика', 'ELK Stack'],
    cons: ['Требует памяти', 'Сложная настройка'],
    // UX параметры
    performance: 88,
    stability: 85,
    userFriendliness: 92,
    // Dev параметры
    developmentSpeed: 70,
    maintainability: 78,
    complexity: 65, // Выше средней
    cost: 45,
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    category: 'service',
    description: 'Оркестрация контейнеров',
    pros: ['Автомасштабирование', 'Self-healing', 'Индустриальный стандарт'],
    cons: ['Очень сложный', 'Overkill для малых проектов', 'Крутая кривая обучения'],
    // UX параметры
    performance: 92,
    stability: 90,
    userFriendliness: 80,
    // Dev параметры
    developmentSpeed: 55,
    maintainability: 85,
    complexity: 90, // ⭐⭐⭐ Очень сложный!
    cost: 60,
  },
];

// Экспортируем объединённые данные
export const technologies: Technology[] = baseTechnologies.map(mergeTechnologyData);

