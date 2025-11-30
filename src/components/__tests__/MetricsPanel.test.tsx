import { render, screen } from '@testing-library/react';
import MetricsPanel from '../MetricsPanel';
import { AppMetrics } from '../../types';

describe('MetricsPanel', () => {
  const createMockMetrics = (overrides?: Partial<AppMetrics>): AppMetrics => ({
    ux: {
      performance: 75,
      stability: 80,
      userFriendliness: 70,
    },
    dev: {
      developmentSpeed: 65,
      maintainability: 75,
      complexity: 60,
      cost: 50,
    },
    ...overrides,
  });

  it('should render all UX metrics', () => {
    const metrics = createMockMetrics();
    render(<MetricsPanel metrics={metrics} />);

    expect(screen.getByText('Производительность')).toBeInTheDocument();
    expect(screen.getByText('Стабильность')).toBeInTheDocument();
    expect(screen.getByText('Удобство для пользователя')).toBeInTheDocument();
  });

  it('should render all Dev metrics', () => {
    const metrics = createMockMetrics();
    render(<MetricsPanel metrics={metrics} />);

    expect(screen.getByText('Скорость разработки')).toBeInTheDocument();
    expect(screen.getByText('Поддерживаемость')).toBeInTheDocument();
    expect(screen.getByText('Сложность')).toBeInTheDocument();
    expect(screen.getByText('Стоимость')).toBeInTheDocument();
  });

  it('should display metric values correctly', () => {
    const metrics = createMockMetrics({
      ux: { performance: 85.5, stability: 90.2, userFriendliness: 75.8 },
    });
    render(<MetricsPanel metrics={metrics} />);

    expect(screen.getByText('85.5%')).toBeInTheDocument();
    expect(screen.getByText('90.2%')).toBeInTheDocument();
    expect(screen.getByText('75.8%')).toBeInTheDocument();
  });

  it('should calculate and display UX score', () => {
    const metrics = createMockMetrics({
      ux: { performance: 80, stability: 80, userFriendliness: 80 },
    });
    render(<MetricsPanel metrics={metrics} />);

    // UX Score = (80 + 80 + 80) / 3 = 80
    expect(screen.getByText('80.0')).toBeInTheDocument();
  });

  it('should calculate and display Dev score', () => {
    const metrics = createMockMetrics({
      dev: {
        developmentSpeed: 80,
        maintainability: 80,
        complexity: 20, // Low complexity is good
        cost: 20, // Low cost is good
      },
    });
    render(<MetricsPanel metrics={metrics} />);

    // Dev Score = (80 + 80 + (100-20) - 20) / 4 = 55
    // But we just check that it's displayed
    const devScore = (80 + 80 + (100 - 20) - 20) / 4;
    expect(screen.getByText(devScore.toFixed(1))).toBeInTheDocument();
  });

  it('should calculate and display total score', () => {
    const metrics = createMockMetrics({
      ux: { performance: 80, stability: 80, userFriendliness: 80 },
      dev: {
        developmentSpeed: 80,
        maintainability: 80,
        complexity: 20,
        cost: 20,
      },
    });
    render(<MetricsPanel metrics={metrics} />);

    const uxScore = 80;
    const devScore = (80 + 80 + (100 - 20) - 20) / 4;
    const totalScore = (uxScore + devScore) / 2;

    expect(screen.getByText(totalScore.toFixed(1))).toBeInTheDocument();
  });

  it('should display section titles', () => {
    const metrics = createMockMetrics();
    render(<MetricsPanel metrics={metrics} />);

    expect(screen.getByText('👤 Пользовательский опыт')).toBeInTheDocument();
    expect(screen.getByText('💻 Параметры разработки')).toBeInTheDocument();
    expect(screen.getByText('Итоговая оценка')).toBeInTheDocument();
  });

  it('should handle zero metrics', () => {
    const metrics = createMockMetrics({
      ux: { performance: 0, stability: 0, userFriendliness: 0 },
      dev: { developmentSpeed: 0, maintainability: 0, complexity: 0, cost: 0 },
    });
    render(<MetricsPanel metrics={metrics} />);

    expect(screen.getByText('0.0%')).toBeInTheDocument();
  });

  it('should handle maximum metrics', () => {
    const metrics = createMockMetrics({
      ux: { performance: 100, stability: 100, userFriendliness: 100 },
      dev: { developmentSpeed: 100, maintainability: 100, complexity: 100, cost: 100 },
    });
    render(<MetricsPanel metrics={metrics} />);

    expect(screen.getByText('100.0%')).toBeInTheDocument();
  });
});

