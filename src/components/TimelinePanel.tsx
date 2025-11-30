import { motion } from 'framer-motion';
import { memo } from 'react';
import { ProjectTimeline, ProjectPhase } from '../types';
import { getPhaseName, getPhaseDescription } from '../utils/timeline';

interface TimelinePanelProps {
  timeline: ProjectTimeline;
}

const PHASE_ORDER: ProjectPhase[] = ['planning', 'mvp', 'beta', 'production', 'maintenance'];

function TimelinePanel({ timeline }: TimelinePanelProps) {
  const currentPhaseIndex = PHASE_ORDER.indexOf(timeline.currentPhase);

  return (
    <div className="timeline-panel">
      <h3>Прогресс проекта</h3>
      
      <div className="timeline-info">
        <div className="timeline-phase">
          <div className="phase-name">{getPhaseName(timeline.currentPhase)}</div>
          <div className="phase-description">{getPhaseDescription(timeline.currentPhase)}</div>
        </div>
        
        <div className="timeline-stats">
          <div className="stat-item">
            <span className="stat-label">Дней прошло:</span>
            <span className="stat-value">{Math.floor(timeline.daysElapsed)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Осталось дней:</span>
            <span className="stat-value">{Math.ceil(timeline.estimatedDaysRemaining)}</span>
          </div>
        </div>
      </div>

      <div className="timeline-progress">
        <div className="progress-label">
          <span>Общий прогресс</span>
          <span className="progress-value">{timeline.totalProgress.toFixed(1)}%</span>
        </div>
        <div className="progress-bar-bg">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${timeline.totalProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="timeline-phases">
        {PHASE_ORDER.map((phase, index) => {
          const isCompleted = index < currentPhaseIndex;
          const isCurrent = index === currentPhaseIndex;
          const isUpcoming = index > currentPhaseIndex;

          return (
            <div
              key={phase}
              className={`timeline-phase-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isUpcoming ? 'upcoming' : ''}`}
            >
              <div className="phase-indicator">
                {isCompleted && '✓'}
                {isCurrent && '●'}
                {isUpcoming && '○'}
              </div>
              <div className="phase-label">{getPhaseName(phase)}</div>
              {isCurrent && (
                <div className="phase-progress-mini">
                  <div 
                    className="phase-progress-bar"
                    style={{ width: `${timeline.phaseProgress}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(TimelinePanel);

