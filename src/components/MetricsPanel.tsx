import { motion, AnimatePresence } from 'framer-motion';
import { AppMetrics } from '../types';
import { useEffect, useRef, useState, useMemo, memo } from 'react';

interface MetricsPanelProps {
  metrics: AppMetrics;
}

function MetricsPanel({ metrics }: MetricsPanelProps) {
  const prevMetrics = useRef<AppMetrics | null>(null);
  const [metricDeltas, setMetricDeltas] = useState<Record<string, number>>({});

  useEffect(() => {
    if (prevMetrics.current) {
      const deltas: Record<string, number> = {};
      
      // UX deltas
      deltas['ux-performance'] = metrics.ux.performance - prevMetrics.current.ux.performance;
      deltas['ux-stability'] = metrics.ux.stability - prevMetrics.current.ux.stability;
      deltas['ux-userFriendliness'] = metrics.ux.userFriendliness - prevMetrics.current.ux.userFriendliness;
      
      // Dev deltas
      deltas['dev-developmentSpeed'] = metrics.dev.developmentSpeed - prevMetrics.current.dev.developmentSpeed;
      deltas['dev-maintainability'] = metrics.dev.maintainability - prevMetrics.current.dev.maintainability;
      deltas['dev-complexity'] = metrics.dev.complexity - prevMetrics.current.dev.complexity;
      deltas['dev-cost'] = metrics.dev.cost - prevMetrics.current.dev.cost;
      
      // Filter out zero deltas and update state
      const nonZeroDeltas: Record<string, number> = {};
      Object.keys(deltas).forEach(key => {
        if (Math.abs(deltas[key]) > 0.1) {
          nonZeroDeltas[key] = deltas[key];
        }
      });
      
      setMetricDeltas(nonZeroDeltas);
      
      // Clear deltas after 2 seconds
      setTimeout(() => setMetricDeltas({}), 2000);
    }
    prevMetrics.current = metrics;
  }, [metrics]);

  const uxScore = useMemo(() => 
    (metrics.ux.performance + metrics.ux.stability + metrics.ux.userFriendliness) / 3,
    [metrics.ux.performance, metrics.ux.stability, metrics.ux.userFriendliness]
  );
  
  const devScore = useMemo(() => 
    (metrics.dev.developmentSpeed + metrics.dev.maintainability + (100 - metrics.dev.complexity) - metrics.dev.cost) / 4,
    [metrics.dev.developmentSpeed, metrics.dev.maintainability, metrics.dev.complexity, metrics.dev.cost]
  );
  
  const totalScore = useMemo(() => (uxScore + devScore) / 2, [uxScore, devScore]);

  const renderMetricValue = (value: number, deltaKey: string) => {
    const delta = metricDeltas[deltaKey];
    const hasDelta = delta !== undefined && Math.abs(delta) > 0.1;
    
    return (
      <span className="metric-value">
        {value.toFixed(1)}%
        {hasDelta && (
          <motion.span
            className={`metric-delta ${delta > 0 ? 'positive' : 'negative'}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {delta > 0 ? '+' : ''}{delta.toFixed(1)}
          </motion.span>
        )}
      </span>
    );
  };

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
              {renderMetricValue(metrics.ux.performance, 'ux-performance')}
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
              {renderMetricValue(metrics.ux.stability, 'ux-stability')}
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
              {renderMetricValue(metrics.ux.userFriendliness, 'ux-userFriendliness')}
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
              {renderMetricValue(metrics.dev.developmentSpeed, 'dev-developmentSpeed')}
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
              {renderMetricValue(metrics.dev.maintainability, 'dev-maintainability')}
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
              <span className="metric-value warning">
                {metrics.dev.complexity.toFixed(1)}%
                {metricDeltas['dev-complexity'] && (
                  <motion.span
                    className={`metric-delta ${metricDeltas['dev-complexity'] > 0 ? 'negative' : 'positive'}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {metricDeltas['dev-complexity'] > 0 ? '+' : ''}{metricDeltas['dev-complexity'].toFixed(1)}
                  </motion.span>
                )}
              </span>
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
              <span className="metric-value warning">
                {metrics.dev.cost.toFixed(1)}%
                {metricDeltas['dev-cost'] && (
                  <motion.span
                    className={`metric-delta ${metricDeltas['dev-cost'] > 0 ? 'negative' : 'positive'}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {metricDeltas['dev-cost'] > 0 ? '+' : ''}{metricDeltas['dev-cost'].toFixed(1)}
                  </motion.span>
                )}
              </span>
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

export default memo(MetricsPanel);

