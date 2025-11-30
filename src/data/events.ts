import { GameEvent, AppMetrics } from '../types';

/**
 * База данных случайных событий
 * 
 * События, которые могут произойти во время разработки
 */

export const gameEvents: GameEvent[] = [
  // Позитивные события
  {
    id: 'open-source-contributor',
    title: 'Open Source контрибьютор',
    description: 'Один из ваших разработчиков сделал значительный вклад в open source проект. Команда получила опыт!',
    type: 'positive',
    probability: 0.1,
    effects: {
      metrics: {
        dev: {
          developmentSpeed: 5,
          maintainability: 3,
        },
      } as Partial<AppMetrics>,
    },
  },
  {
    id: 'tech-conference',
    title: 'Техническая конференция',
    description: 'Ваша команда посетила техническую конференцию. Новые знания повысили эффективность!',
    type: 'positive',
    probability: 0.15,
    effects: {
      metrics: {
        dev: {
          developmentSpeed: 8,
        },
      } as Partial<AppMetrics>,
    },
  },
  {
    id: 'code-review-success',
    title: 'Успешный Code Review',
    description: 'Проведён отличный code review. Качество кода улучшилось!',
    type: 'positive',
    probability: 0.2,
    effects: {
      metrics: {
        ux: {
          stability: 5,
        },
        dev: {
          maintainability: 7,
        },
      } as Partial<AppMetrics>,
    },
  },
  {
    id: 'performance-optimization',
    title: 'Оптимизация производительности',
    description: 'Команда провела успешную оптимизацию. Производительность выросла!',
    type: 'positive',
    probability: 0.12,
    effects: {
      metrics: {
        ux: {
          performance: 10,
        },
      } as Partial<AppMetrics>,
    },
  },

  // Негативные события
  {
    id: 'bug-in-production',
    title: 'Критический баг в продакшене',
    description: 'Обнаружен критический баг в продакшене. Команда потратила время на исправление.',
    type: 'negative',
    probability: 0.15,
    effects: {
      metrics: {
        ux: {
          stability: -10,
        },
        dev: {
          developmentSpeed: -5,
        },
      } as Partial<AppMetrics>,
      timeline: { days: 3 },
    },
  },
  {
    id: 'team-burnout',
    title: 'Выгорание команды',
    description: 'Команда переработала. Производительность временно снизилась.',
    type: 'negative',
    probability: 0.1,
    effects: {
      metrics: {
        dev: {
          developmentSpeed: -15,
          maintainability: -5,
        },
      } as Partial<AppMetrics>,
      timeline: { days: 5 },
    },
  },
  {
    id: 'dependency-vulnerability',
    title: 'Уязвимость в зависимостях',
    description: 'Обнаружена критическая уязвимость в одной из библиотек. Нужно обновить зависимости.',
    type: 'negative',
    probability: 0.18,
    effects: {
      metrics: {
        ux: {
          stability: -8,
        },
        dev: {
          developmentSpeed: -8,
        },
      } as Partial<AppMetrics>,
      timeline: { days: 2 },
    },
  },
  {
    id: 'scope-creep',
    title: 'Раздувание требований',
    description: 'Заказчик добавил новые требования в середине разработки. Сроки сдвинулись.',
    type: 'negative',
    probability: 0.2,
    effects: {
      timeline: { days: 7 },
    },
  },

  // Нейтральные события с выбором
  {
    id: 'new-technology',
    title: 'Новая технология',
    description: 'Появилась новая перспективная технология. Стоит ли её изучить?',
    type: 'neutral',
    probability: 0.12,
    choices: [
      {
        id: 'adopt',
        text: 'Изучить и внедрить',
        effects: {
          metrics: {
            dev: {
              developmentSpeed: 10,
              complexity: 5,
            },
          } as Partial<AppMetrics>,
          timeline: { days: 5 },
        },
      },
      {
        id: 'skip',
        text: 'Пропустить',
        effects: {},
      },
    ],
  },
  {
    id: 'refactoring-opportunity',
    title: 'Возможность рефакторинга',
    description: 'Обнаружен технический долг. Рефакторить сейчас или позже?',
    type: 'neutral',
    probability: 0.15,
    choices: [
      {
        id: 'refactor-now',
        text: 'Рефакторить сейчас',
        effects: {
          metrics: {
            dev: {
              maintainability: 15,
              developmentSpeed: -10,
            },
          } as Partial<AppMetrics>,
          timeline: { days: 10 },
        },
      },
      {
        id: 'refactor-later',
        text: 'Отложить',
        effects: {
          metrics: {
            dev: {
              maintainability: -5,
            },
          } as Partial<AppMetrics>,
        },
      },
    ],
  },
  {
    id: 'scaling-decision',
    title: 'Решение о масштабировании',
    description: 'Трафик растёт. Нужно масштабировать инфраструктуру. Что делать?',
    type: 'neutral',
    probability: 0.1,
    choices: [
      {
        id: 'scale-now',
        text: 'Масштабировать сейчас',
        effects: {
          metrics: {
            ux: {
              performance: 15,
            },
            dev: {
              cost: 20,
              complexity: 10,
            },
          } as Partial<AppMetrics>,
          budget: -5000,
          timeline: { days: 14 },
        },
      },
      {
        id: 'wait',
        text: 'Подождать',
        effects: {
          metrics: {
            ux: {
              performance: -10,
              stability: -5,
            },
          } as Partial<AppMetrics>,
        },
      },
    ],
  },
];

