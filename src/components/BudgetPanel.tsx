import { motion } from 'framer-motion';
import { memo } from 'react';
import { Budget } from '../types';
import { getBudgetUsagePercent } from '../utils/budget';

interface BudgetPanelProps {
  budget: Budget;
}

function BudgetPanel({ budget }: BudgetPanelProps) {
  const usagePercent = getBudgetUsagePercent(budget);
  const isWarning = usagePercent > 80;
  const isCritical = usagePercent > 95;

  return (
    <div className="budget-panel">
      <h3>Бюджет проекта</h3>
      
      <div className="budget-info">
        <div className="budget-item">
          <span className="budget-label">Всего:</span>
          <span className="budget-value">${budget.total.toLocaleString()}</span>
        </div>
        
        <div className="budget-item">
          <span className="budget-label">Потрачено:</span>
          <span className={`budget-value ${isWarning ? 'warning' : ''} ${isCritical ? 'critical' : ''}`}>
            ${budget.spent.toLocaleString()}
          </span>
        </div>
        
        <div className="budget-item">
          <span className="budget-label">Осталось:</span>
          <span className={`budget-value ${isWarning ? 'warning' : ''} ${isCritical ? 'critical' : ''}`}>
            ${budget.remaining.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="budget-bar-container">
        <div className="budget-bar-bg">
          <motion.div
            className={`budget-bar-fill ${isWarning ? 'warning' : ''} ${isCritical ? 'critical' : ''}`}
            initial={{ width: 0 }}
            animate={{ width: `${usagePercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="budget-percent">{usagePercent.toFixed(1)}%</span>
      </div>

      {isCritical && (
        <motion.div
          className="budget-warning"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          ⚠️ Критически низкий бюджет!
        </motion.div>
      )}
      
      {isWarning && !isCritical && (
        <motion.div
          className="budget-warning"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          ⚠️ Бюджет почти исчерпан
        </motion.div>
      )}
    </div>
  );
}

export default memo(BudgetPanel);

