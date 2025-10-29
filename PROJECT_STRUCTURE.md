# 📁 Структура проекта

```
app-architecture-builder/
│
├── 📄 Конфигурационные файлы
│   ├── package.json              # Зависимости и скрипты
│   ├── tsconfig.json             # TypeScript конфигурация
│   ├── tsconfig.node.json        # TypeScript для Vite
│   ├── vite.config.ts            # Vite настройки
│   ├── index.html                # HTML точка входа
│   └── .gitignore                # Git игнорируемые файлы
│
├── 📚 Документация
│   ├── README.md                 # Основная документация
│   ├── QUICKSTART.md             # Быстрый старт
│   ├── DEVELOPMENT.md            # Руководство разработчика
│   ├── GAME_DESIGN.md            # Игровой дизайн
│   ├── FEATURES.md               # Список возможностей
│   ├── CONTRIBUTING.md           # Руководство по контрибуции
│   ├── PROJECT_STRUCTURE.md      # Этот файл
│   └── LICENSE                   # MIT лицензия
│
├── .vscode/                      # VS Code настройки
│   └── extensions.json           # Рекомендуемые расширения
│
└── src/                          # Исходный код
    │
    ├── 🎯 Точки входа
    │   ├── main.tsx              # React точка входа
    │   └── index.css             # Глобальные стили
    │
    ├── 🏠 Главное приложение
    │   ├── App.tsx               # Главный компонент
    │   ├── App.css               # Стили приложения
    │   └── types.ts              # TypeScript типы
    │
    ├── 🧩 components/            # React компоненты
    │   ├── FrontendView.tsx      # Экран фронтенда
    │   ├── BackendView.tsx       # Экран бэкенда
    │   ├── TechnologyPanel.tsx   # Панель технологии
    │   ├── TechnologyPicker.tsx  # Выбор технологии
    │   ├── MetricsPanel.tsx      # Панель метрик
    │   └── styles.css            # Стили компонентов
    │
    ├── 📊 data/                  # Данные
    │   └── technologies.ts       # База технологий (31 шт)
    │
    └── 🛠️ utils/                 # Утилиты
        └── metrics.ts            # Расчёт метрик
```

## 📦 Основные файлы

### Конфигурация

**package.json**
- Зависимости: React, TypeScript, Framer Motion
- Скрипты: dev, build, preview
- Метаданные проекта

**tsconfig.json**
- Строгая типизация
- ES2020 + DOM
- React JSX

**vite.config.ts**
- React плагин
- HMR (Hot Module Replacement)

**index.html**
- Минималистичная HTML структура
- Подключение /src/main.tsx

### Исходный код

**src/main.tsx**
```typescript
// React точка входа
// - Создание root
// - StrictMode
// - Рендер App
```

**src/App.tsx**
```typescript
// Главный компонент приложения
// - State управление (appSchema)
// - Переключение Frontend/Backend
// - Интеграция всех компонентов
// - Показ метрик
```

**src/types.ts**
```typescript
// TypeScript интерфейсы:
// - Technology    (структура технологии)
// - Panel         (панель на экране)
// - AppSchema     (схема приложения)
// - AppMetrics    (метрики оценки)
```

### Компоненты

**FrontendView.tsx**
- Отображение Frontend экрана
- Drag & drop панелей
- Обработка кликов для добавления

**BackendView.tsx**
- Отображение Backend экрана
- Аналогичная структура с Frontend

**TechnologyPanel.tsx**
- Визуализация одной технологии
- Drag & drop функциональность
- Hover эффекты с деталями
- Цветовое кодирование по категориям

**TechnologyPicker.tsx**
- Модальное окно выбора
- Фильтрация по категориям
- Grid отображение технологий
- Анимации появления/исчезновения

**MetricsPanel.tsx**
- Отображение метрик приложения
- Анимированные progress bars
- Общий счёт
- Real-time обновления

### Данные

**data/technologies.ts**
- 31 технология (на данный момент)
- 6 языков программирования
- 10 фреймворков
- 7 архитектурных паттернов
- 5 баз данных
- 5 сервисов

Категории:
- `language` - Языки
- `framework` - Фреймворки
- `pattern` - Паттерны
- `library` - Библиотеки
- `database` - Базы данных
- `service` - Сервисы

### Утилиты

**utils/metrics.ts**
- `calculateMetrics()` - основной расчёт
- `checkCompatibility()` - бонусы за совместимость
- Средние значения параметров
- Проверка полноты архитектуры

### Стили

**index.css**
- CSS reset
- Глобальные стили
- Тёмная тема (#0a0e1a)

**App.css**
- Стили главного приложения
- Header и навигация
- Layout структура

**components/styles.css**
- Все стили компонентов
- Анимации
- Hover эффекты
- Адаптивность

## 🎨 Цветовая палитра

```css
/* Фоны */
--bg-main: #0a0e1a;
--bg-card: #1a1f2e;
--bg-dark: #0f1218;

/* Границы */
--border-main: #2a2f3e;

/* Текст */
--text-primary: #ffffff;
--text-secondary: #c0c0c0;
--text-muted: #8b8b8b;

/* Категории технологий */
--language: #4a9eff;
--framework: #7c3aed;
--pattern: #ec4899;
--library: #10b981;
--database: #f59e0b;
--service: #ef4444;

/* Метрики */
--performance: #4a9eff;
--stability: #10b981;
--usability: #f59e0b;
--cost: #ef4444;
```

## 🔄 Поток данных

```
User Click
    ↓
App.tsx (openPicker)
    ↓
TechnologyPicker (показ модального окна)
    ↓
User выбирает технологию
    ↓
App.tsx (handleAddPanel)
    ↓
Обновление appSchema state
    ↓
Расчёт метрик (calculateMetrics)
    ↓
Рендер FrontendView/BackendView
    ↓
TechnologyPanel отображается
```

## 🚀 Расширение проекта

### Добавить новый компонент
1. Создать файл в `src/components/`
2. Добавить стили в `components/styles.css`
3. Импортировать в родительский компонент

### Добавить новую технологию
1. Открыть `src/data/technologies.ts`
2. Добавить объект в массив
3. Заполнить все поля

### Добавить новую метрику
1. Обновить интерфейс `AppMetrics` в `types.ts`
2. Изменить `calculateMetrics` в `utils/metrics.ts`
3. Добавить отображение в `MetricsPanel.tsx`

### Добавить новую фичу
1. Создать ветку: `git checkout -b feature/название`
2. Реализовать фичу
3. Обновить документацию
4. Создать Pull Request

## 📈 Метрики проекта

- **Компоненты**: 5
- **Технологии**: 31
- **Категории**: 6
- **Типы**: 4 интерфейса
- **Файлы документации**: 7
- **Строк кода**: ~1500+

## 🔧 Зависимости

### Production
- react: ^18.2.0
- react-dom: ^18.2.0
- framer-motion: ^10.16.4

### Development
- @types/react: ^18.2.37
- @types/react-dom: ^18.2.15
- @vitejs/plugin-react: ^4.2.0
- typescript: ^5.2.2
- vite: ^5.0.0

## 📝 Соглашения о коде

### Именование файлов
- Компоненты: `PascalCase.tsx`
- Утилиты: `camelCase.ts`
- Типы: `types.ts`
- Стили: `kebab-case.css`

### Структура компонента
```typescript
// 1. Imports
import { ... } from '...';

// 2. Interface для props
interface ComponentProps {
  prop: type;
}

// 3. Компонент
export default function Component({ prop }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Handlers
  const handleClick = () => {};
  
  // 6. Render
  return <div>...</div>;
}
```

### Стили
- Используйте классы, не inline стили
- БЭМ методология опционально
- Mobile-first подход

---

**Структура проекта спроектирована для легкого расширения и поддержки!**

