import { motion } from 'framer-motion';
import { AppMetrics } from '../types';

interface MetricsPanelProps {
  metrics: AppMetrics;
}

export default function MetricsPanel({ metrics }: MetricsPanelProps) {
  const uxScore = (metrics.ux.performance + metrics.ux.stability + metrics.ux.userFriendliness) / 3;
  const devScore = (metrics.dev.developmentSpeed + metrics.dev.maintainability + (100 - metrics.dev.complexity) - metrics.dev.cost) / 4;
  const totalScore = (uxScore + devScore) / 2;

  return (
    <div className="metrics-panel">
      <h3>Параметры проекта</h3>

      {/* UX Метрики */}
      <div className="metrics-section">
        <h4 className="section-title">👤 Пользовательский опыт</h4>
        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-label">
              <span>Производительность</span>
              <span className="metric-value">{metrics.ux.performance.toFixed(1)}%</span>
            </div>
            <div className="metric-bar-bg">
              <motion.div
                className="metric-bar-fill"
                style={{ background: '#4a9eff' }}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.ux.performance}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-label">
              <span>Стабильность</span>
              <span className="metric-value">{metrics.ux.stability.toFixed(1)}%</span>
            </div>
            <div className="metric-bar-bg">
              <motion.div
                className="metric-bar-fill"
                style={{ background: '#10b981' }}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.ux.stability}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-label">
              <span>Удобство для пользователя</span>
              <span className="metric-value">{metrics.ux.userFriendliness.toFixed(1)}%</span>
            </div>
            <div className="metric-bar-bg">
              <motion.div
                className="metric-bar-fill"
                style={{ background: '#a78bfa' }}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.ux.userFriendliness}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dev Метрики */}
      <div className="metrics-section">
        <h4 className="section-title">💻 Параметры разработки</h4>
        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-label">
              <span>Скорость разработки</span>
              <span className="metric-value">{metrics.dev.developmentSpeed.toFixed(1)}%</span>
            </div>
            <div className="metric-bar-bg">
              <motion.div
                className="metric-bar-fill"
                style={{ background: '#22c55e' }}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.dev.developmentSpeed}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-label">
              <span>Поддерживаемость</span>
              <span className="metric-value">{metrics.dev.maintainability.toFixed(1)}%</span>
            </div>
            <div className="metric-bar-bg">
              <motion.div
                className="metric-bar-fill"
                style={{ background: '#3b82f6' }}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.dev.maintainability}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-label">
              <span>Сложность</span>
              <span className="metric-value warning">{metrics.dev.complexity.toFixed(1)}%</span>
            </div>
            <div className="metric-bar-bg">
              <motion.div
                className="metric-bar-fill warning"
                style={{ background: '#f59e0b' }}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.dev.complexity}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-label">
              <span>Стоимость</span>
              <span className="metric-value warning">{metrics.dev.cost.toFixed(1)}%</span>
            </div>
            <div className="metric-bar-bg">
              <motion.div
                className="metric-bar-fill warning"
                style={{ background: '#ef4444' }}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.dev.cost}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="metrics-summary">
        <h4>Итоговая оценка</h4>
        <div className="summary-scores">
          <div className="score-item">
            <span className="score-label">UX</span>
            <span className="score-value">{uxScore.toFixed(1)}</span>
          </div>
          <div className="score-item">
            <span className="score-label">Dev</span>
            <span className="score-value">{devScore.toFixed(1)}</span>
          </div>
        </div>
        <div className="summary-value">
          {totalScore.toFixed(1)}
        </div>
      </div>
    </div>
  );
}

