import { motion } from 'framer-motion';
import { memo, useState } from 'react';
import { LoadTestResults } from '../types';
import { runLoadTest, createLoadTest } from '../utils/load-testing';
import { AppSchema, AppMetrics } from '../types';

interface LoadTestPanelProps {
  schema: AppSchema;
  metrics: AppMetrics;
}

function LoadTestPanel({ schema, metrics }: LoadTestPanelProps) {
  const [testConfig, setTestConfig] = useState({ users: 100, duration: 60 });
  const [results, setResults] = useState<LoadTestResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTest = () => {
    setIsRunning(true);
    const test = createLoadTest(testConfig.users, testConfig.duration);
    
    // Симулируем выполнение теста
    setTimeout(() => {
      const testResults = runLoadTest(test, schema, metrics);
      setResults(testResults);
      setIsRunning(false);
    }, 2000);
  };

  const getResponseTimeColor = (time: number) => {
    if (time < 200) return '#10b981';
    if (time < 500) return '#f59e0b';
    return '#ef4444';
  };

  const getErrorRateColor = (rate: number) => {
    if (rate < 1) return '#10b981';
    if (rate < 5) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="load-test-panel">
      <h3>Нагрузочное тестирование</h3>

      <div className="test-config">
        <div className="config-item">
          <label>Пользователей:</label>
          <input
            type="number"
            min="10"
            max="10000"
            value={testConfig.users}
            onChange={(e) => setTestConfig(prev => ({ ...prev, users: parseInt(e.target.value) || 100 }))}
            disabled={isRunning}
          />
        </div>
        <div className="config-item">
          <label>Длительность (сек):</label>
          <input
            type="number"
            min="10"
            max="300"
            value={testConfig.duration}
            onChange={(e) => setTestConfig(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
            disabled={isRunning}
          />
        </div>
        <button
          className="run-test-btn"
          onClick={handleRunTest}
          disabled={isRunning}
        >
          {isRunning ? '⏳ Тестирование...' : '▶️ Запустить тест'}
        </button>
      </div>

      {results && (
        <motion.div
          className="test-results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4>Результаты теста</h4>

          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Среднее время отклика:</span>
              <span className="result-value" style={{ color: getResponseTimeColor(results.avgResponseTime) }}>
                {results.avgResponseTime.toFixed(0)} мс
              </span>
            </div>
            <div className="result-item">
              <span className="result-label">Максимальное время:</span>
              <span className="result-value" style={{ color: getResponseTimeColor(results.maxResponseTime) }}>
                {results.maxResponseTime.toFixed(0)} мс
              </span>
            </div>
            <div className="result-item">
              <span className="result-label">Запросов в секунду:</span>
              <span className="result-value">{results.requestsPerSecond.toFixed(0)} RPS</span>
            </div>
            <div className="result-item">
              <span className="result-label">Процент ошибок:</span>
              <span className="result-value" style={{ color: getErrorRateColor(results.errorRate) }}>
                {results.errorRate.toFixed(2)}%
              </span>
            </div>
          </div>

          {results.bottlenecks.length > 0 && (
            <div className="bottlenecks">
              <h4>Узкие места:</h4>
              {results.bottlenecks.map((bottleneck, idx) => (
                <div key={idx} className="bottleneck-item">
                  <div className="bottleneck-header">
                    <span className="bottleneck-tech">{bottleneck.technology}</span>
                    <span className="bottleneck-impact">Влияние: {bottleneck.impact}%</span>
                  </div>
                  <div className="bottleneck-issue">{bottleneck.issue}</div>
                  <div className="bottleneck-recommendation">
                    💡 {bottleneck.recommendation}
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.bottlenecks.length === 0 && (
            <div className="no-bottlenecks">
              <div className="success-icon">✅</div>
              <div className="success-text">Узких мест не обнаружено!</div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default memo(LoadTestPanel);

