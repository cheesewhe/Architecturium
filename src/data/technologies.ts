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
    performance: 70,
    stability: 75,
    usability: 90,
    price: 10,
    complexity: 30, // ⭐ Самый простой для начала
  },
  {
    id: 'python',
    name: 'Python',
    category: 'language',
    description: 'Универсальный язык программирования',
    pros: ['Читаемый код', 'Быстрая разработка', 'Отличные библиотеки'],
    cons: ['Медленная производительность', 'GIL ограничения'],
    performance: 50,
    stability: 85,
    usability: 95,
    price: 25,
    complexity: 25, // ⭐ Очень простой синтаксис
  },
  {
    id: 'ts',
    name: 'TypeScript',
    category: 'language',
    description: 'Типизированный язык программирования для современных веб-приложений',
    pros: ['Типизация снижает баги', 'Отличная поддержка IDE', 'Хорошая производительность'],
    cons: ['Требуется компиляция', 'Крутая кривая обучения'],
    performance: 85,
    stability: 90,
    usability: 80,
    price: 20,
    complexity: 55, // Средняя - нужно изучить типы
  },
  {
    id: 'go',
    name: 'Go',
    category: 'language',
    description: 'Компилируемый язык от Google',
    pros: ['Высокая производительность', 'Простой синтаксис', 'Отличные concurrency'],
    cons: ['Меньше библиотек', 'Нет generic до 1.18', 'Простота может ограничивать'],
    performance: 90,
    stability: 88,
    usability: 82,
    price: 30,
    complexity: 50, // Средняя - простой но специфичный
  },
  {
    id: 'java',
    name: 'Java',
    category: 'language',
    description: 'Объектно-ориентированный язык',
    pros: ['Зрелая экосистема', 'Много вакансий', 'Кросс-платформенность'],
    cons: ['Многословный код', 'Медленный старт JVM', 'Устаревший имидж'],
    performance: 75,
    stability: 90,
    usability: 75,
    price: 45,
    complexity: 65, // Выше средней - много концепций
  },
  {
    id: 'rust',
    name: 'Rust',
    category: 'language',
    description: 'Системный язык программирования',
    pros: ['Безопасность памяти', 'Отличная производительность', 'Zero-cost abstractions'],
    cons: ['Крутая кривая обучения', 'Медленная компиляция', 'Меньше вакансий'],
    performance: 95,
    stability: 92,
    usability: 60,
    price: 35,
    complexity: 90, // ⭐⭐⭐ Очень сложный!
  },

  // ФРЕЙМВОРКИ FRONTEND (от простых к сложным)
  {
    id: 'svelte',
    name: 'Svelte',
    category: 'framework',
    description: 'Компилируемый UI фреймворк',
    pros: ['Минимальный bundle', 'Реактивность из коробки', 'Простой синтаксис'],
    cons: ['Маленькое сообщество', 'Меньше библиотек', 'Новая технология'],
    performance: 88,
    stability: 78,
    usability: 92,
    price: 20,
    complexity: 35, // ⭐ Самый простой frontend
  },
  {
    id: 'vue',
    name: 'Vue.js',
    category: 'framework',
    description: 'Прогрессивный фреймворк для создания UI',
    pros: ['Легко изучить', 'Хорошая документация', 'Компактность'],
    cons: ['Меньше вакансий', 'Меньше библиотек'],
    performance: 75,
    stability: 80,
    usability: 90,
    price: 25,
    complexity: 40, // Очень доступный
  },
  {
    id: 'react',
    name: 'React',
    category: 'framework',
    description: 'Библиотека для создания пользовательских интерфейсов',
    pros: ['Компонентный подход', 'Огромное сообщество', 'Быстрая разработка'],
    cons: ['Быстрые изменения', 'Большой bundle размер'],
    performance: 80,
    stability: 85,
    usability: 85,
    price: 30,
    complexity: 50, // Средняя сложность
  },
  {
    id: 'angular',
    name: 'Angular',
    category: 'framework',
    description: 'TypeScript фреймворк от Google',
    pros: ['Всё из коробки', 'TypeScript нативно', 'Структурированность'],
    cons: ['Сложный для новичков', 'Тяжёлый', 'Меньшая гибкость'],
    performance: 72,
    stability: 85,
    usability: 70,
    price: 40,
    complexity: 70, // ⭐⭐ Сложный для новичков
  },

  // ФРЕЙМВОРКИ BACKEND (от простых к сложным)
  {
    id: 'express',
    name: 'Express.js',
    category: 'framework',
    description: 'Минималистичный веб-фреймворк для Node.js',
    pros: ['Простой', 'Гибкий', 'Огромная экосистема'],
    cons: ['Нет структуры', 'Нужно много настройки', 'Устаревающий'],
    performance: 75,
    stability: 80,
    usability: 88,
    price: 30,
    complexity: 35, // ⭐ Простой минималистичный
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    category: 'framework',
    description: 'Современный Python веб-фреймворк',
    pros: ['Быстрый', 'Автогенерация документации', 'Type hints'],
    cons: ['Относительно новый', 'Меньше примеров', 'Async может быть сложным'],
    performance: 75,
    stability: 82,
    usability: 88,
    price: 35,
    complexity: 45, // Средне-простой
  },
  {
    id: 'django',
    name: 'Django',
    category: 'framework',
    description: 'Веб-фреймворк на Python с батарейками',
    pros: ['Admin панель', 'ORM из коробки', 'Безопасность'],
    cons: ['Монолитный', 'Медленнее современных фреймворков'],
    performance: 60,
    stability: 90,
    usability: 90,
    price: 45,
    complexity: 50, // Средняя - много концепций
  },
  {
    id: 'node',
    name: 'Node.js',
    category: 'framework',
    description: 'JavaScript runtime для серверной стороны',
    pros: ['Один язык для всего', 'Быстрая разработка', 'Большая экосистема'],
    cons: ['Однопоточность', 'Проблемы с CPU-задачами'],
    performance: 70,
    stability: 80,
    usability: 85,
    price: 40,
    complexity: 45, // Доступный для JS разработчиков
  },
  {
    id: 'nestjs',
    name: 'NestJS',
    category: 'framework',
    description: 'Прогрессивный фреймворк для Node.js',
    pros: ['TypeScript из коробки', 'Архитектурные паттерны', 'Скалируемость'],
    cons: ['Сложнее для новичков', 'Больше boilerplate'],
    performance: 75,
    stability: 85,
    usability: 70,
    price: 50,
    complexity: 65, // ⭐⭐ Требует понимания архитектуры
  },
  {
    id: 'spring',
    name: 'Spring Boot',
    category: 'framework',
    description: 'Enterprise Java фреймворк',
    pros: ['Мощные возможности', 'Корпоративный стандарт', 'Много интеграций'],
    cons: ['Сложность', 'Много магии', 'Тяжеловесный'],
    performance: 70,
    stability: 92,
    usability: 65,
    price: 55,
    complexity: 75, // ⭐⭐ Enterprise уровень
  },

  // ПАТТЕРНЫ (от простых к сложным)
  {
    id: 'rest',
    name: 'REST API',
    category: 'pattern',
    description: 'Архитектурный стиль для веб-сервисов',
    pros: ['Простой', 'Стандартизированный', 'Легко кешируется'],
    cons: ['Избыточность', 'Подходит не для всех случаев'],
    performance: 80,
    stability: 85,
    usability: 90,
    price: 20,
    complexity: 25, // ⭐ Очень простой концепт
  },
  {
    id: 'jwt',
    name: 'JWT Authentication',
    category: 'pattern',
    description: 'Токен-based аутентификация',
    pros: ['Stateless', 'Кросс-доменность', 'Мобильные приложения'],
    cons: ['Нельзя отозвать токен', 'Размер токена', 'Безопасность хранения'],
    performance: 85,
    stability: 82,
    usability: 85,
    price: 15,
    complexity: 40, // Средне-простой
  },
  {
    id: 'websocket',
    name: 'WebSockets',
    category: 'pattern',
    description: 'Двусторонняя real-time коммуникация',
    pros: ['Низкая задержка', 'Real-time обновления', 'Эффективность'],
    cons: ['Сложнее масштабирование', 'Проблемы с прокси', 'Fallback нужен'],
    performance: 88,
    stability: 80,
    usability: 75,
    price: 35,
    complexity: 50, // Средняя
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    category: 'pattern',
    description: 'Язык запросов для API',
    pros: ['Гибкие запросы', 'Меньше лишних данных', 'Сильная типизация'],
    cons: ['Сложнее кеширование', 'Больше overhead'],
    performance: 70,
    stability: 80,
    usability: 85,
    price: 30,
    complexity: 60, // Выше средней
  },
  {
    id: 'oauth',
    name: 'OAuth 2.0',
    category: 'pattern',
    description: 'Протокол авторизации',
    pros: ['Безопасность', 'Социальные логины', 'Стандарт индустрии'],
    cons: ['Сложность реализации', 'Много flows', 'Нужен сервер авторизации'],
    performance: 75,
    stability: 88,
    usability: 70,
    price: 40,
    complexity: 70, // ⭐⭐ Сложная спецификация
  },
  {
    id: 'cqrs',
    name: 'CQRS',
    category: 'pattern',
    description: 'Command Query Responsibility Segregation',
    pros: ['Масштабируемость чтения', 'Оптимизация запросов', 'Event sourcing'],
    cons: ['Сложность', 'Eventual consistency', 'Избыточность для простых систем'],
    performance: 82,
    stability: 75,
    usability: 60,
    price: 65,
    complexity: 80, // ⭐⭐⭐ Продвинутый паттерн
  },
  {
    id: 'microservices',
    name: 'Microservices',
    category: 'pattern',
    description: 'Архитектура с независимыми сервисами',
    pros: ['Масштабируемость', 'Независимость', 'Гибкость'],
    cons: ['Сложность', 'Networking overhead', 'Управление данными'],
    performance: 75,
    stability: 70,
    usability: 60,
    price: 70,
    complexity: 85, // ⭐⭐⭐ Очень сложная архитектура
  },

  // БАЗЫ ДАННЫХ (от простых к сложным)
  {
    id: 'redis',
    name: 'Redis',
    category: 'database',
    description: 'In-memory хранилище ключ-значение',
    pros: ['Очень быстрый', 'Отличное кеширование', 'Pub/Sub'],
    cons: ['Ограниченная память', 'Нет персистентности'],
    performance: 95,
    stability: 85,
    usability: 80,
    price: 35,
    complexity: 35, // Простая концепция
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'database',
    description: 'NoSQL база данных',
    pros: ['Гибкая схема', 'Горизонтальное масштабирование', 'Быстрая разработка'],
    cons: ['Слабая консистентность', 'Больше памяти'],
    performance: 80,
    stability: 80,
    usability: 85,
    price: 40,
    complexity: 40, // Простая для начала
  },
  {
    id: 'mysql',
    name: 'MySQL',
    category: 'database',
    description: 'Популярная реляционная СУБД',
    pros: ['Простая настройка', 'Хорошая производительность', 'Большое сообщество'],
    cons: ['Меньше фич чем PostgreSQL', 'Лицензирование Oracle', 'Ограничения масштабирования'],
    performance: 78,
    stability: 85,
    usability: 85,
    price: 40,
    complexity: 45, // Средне-простая
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'database',
    description: 'Мощная реляционная СУБД',
    pros: ['ACID', 'Богатый функционал', 'Стандарты SQL'],
    cons: ['Сложная настройка', 'Требует много ресурсов'],
    performance: 75,
    stability: 90,
    usability: 80,
    price: 50,
    complexity: 55, // Средняя - много возможностей
  },
  {
    id: 'elasticsearch',
    name: 'Elasticsearch',
    category: 'database',
    description: 'Поисковый движок и аналитика',
    pros: ['Мощный поиск', 'Масштабируемость', 'Аналитика в реальном времени'],
    cons: ['Сложная настройка', 'Требует много памяти', 'Eventual consistency'],
    performance: 85,
    stability: 78,
    usability: 70,
    price: 60,
    complexity: 70, // ⭐⭐ Сложная настройка
  },

  // СЕРВИСЫ И ИНФРАСТРУКТУРА (от простых к сложным)
  {
    id: 'nginx',
    name: 'Nginx',
    category: 'service',
    description: 'Высокопроизводительный веб-сервер',
    pros: ['Отличная производительность', 'Load balancing', 'Стабильность'],
    cons: ['Сложная конфигурация', 'Меньше динамических возможностей'],
    performance: 95,
    stability: 95,
    usability: 70,
    price: 60,
    complexity: 55, // Средняя - конфигурация может быть сложной
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'service',
    description: 'Контейнеризация приложений',
    pros: ['Изоляция', 'Портативность', 'Простое развёртывание'],
    cons: ['Дополнительный слой', 'Нужны знания'],
    performance: 85,
    stability: 80,
    usability: 75,
    price: 40,
    complexity: 60, // Выше средней
  },
  {
    id: 'rabbitmq',
    name: 'RabbitMQ',
    category: 'service',
    description: 'Message broker для асинхронной обработки',
    pros: ['Надёжность', 'Гибкая маршрутизация', 'Простая интеграция'],
    cons: ['Ниже производительность чем Kafka', 'Сложная настройка кластера'],
    performance: 75,
    stability: 88,
    usability: 78,
    price: 50,
    complexity: 65, // Выше средней
  },
  {
    id: 'kafka',
    name: 'Apache Kafka',
    category: 'service',
    description: 'Распределённая платформа потоковой передачи',
    pros: ['Высокая пропускная способность', 'Надёжность', 'Масштабируемость'],
    cons: ['Сложность', 'Требует инфраструктуры', 'Overhead для простых задач'],
    performance: 90,
    stability: 88,
    usability: 60,
    price: 70,
    complexity: 75, // ⭐⭐ Сложная система
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    category: 'service',
    description: 'Оркестрация контейнеров',
    pros: ['Автомасштабирование', 'Self-healing', 'Индустриальный стандарт'],
    cons: ['Очень сложный', 'Overkill для малых проектов', 'Крутая кривая обучения'],
    performance: 88,
    stability: 85,
    usability: 55,
    price: 80,
    complexity: 90, // ⭐⭐⭐ Очень сложный!
  },
];

// Экспортируем объединённые данные
export const technologies: Technology[] = baseTechnologies.map(mergeTechnologyData);

