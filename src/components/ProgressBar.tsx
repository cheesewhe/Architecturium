import { motion } from 'framer-motion';
import { memo } from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  color?: string;
  showValue?: boolean;
}

function ProgressBar({ progress, label, color = '#4a9eff', showValue = true }: ProgressBarProps) {
  return (
    <div className="progress-bar-container">
      {label && (
        <div className="progress-bar-label">
          <span>{label}</span>
          {showValue && <span className="progress-bar-value">{progress.toFixed(1)}%</span>}
        </div>
      )}
      <div className="progress-bar-background">
        <motion.div
          className="progress-bar-fill"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default memo(ProgressBar);

