import { motion, AnimatePresence } from 'framer-motion';
import { memo, useState, useMemo } from 'react';
import { Developer, Budget } from '../types';
import { availableDevelopers } from '../data/developers';
import DeveloperCard from './DeveloperCard';

interface HireDeveloperModalProps {
  budget: Budget;
  currentTeam: Developer[];
  onHire: (developer: Developer) => void;
  onClose: () => void;
}

function HireDeveloperModal({ budget, currentTeam, onHire, onClose }: HireDeveloperModalProps) {
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);

  const available = useMemo(() => {
    const hiredIds = new Set(currentTeam.map(d => d.id));
    let devs = availableDevelopers.filter(d => !hiredIds.has(d.id));
    
    if (selectedSpecialization) {
      devs = devs.filter(d => d.specialization === selectedSpecialization);
    }
    
    return devs;
  }, [currentTeam, selectedSpecialization]);

  const specializations = ['frontend', 'backend', 'devops', 'dba', 'fullstack'];

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          className="modal-content hire-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="modal-header">
            <h2>Нанять разработчика</h2>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>

          <div className="hire-filters">
            <button
              className={`filter-btn ${!selectedSpecialization ? 'active' : ''}`}
              onClick={() => setSelectedSpecialization(null)}
            >
              Все
            </button>
            {specializations.map(spec => (
              <button
                key={spec}
                className={`filter-btn ${selectedSpecialization === spec ? 'active' : ''}`}
                onClick={() => setSelectedSpecialization(spec)}
              >
                {spec.charAt(0).toUpperCase() + spec.slice(1)}
              </button>
            ))}
          </div>

          <div className="developers-grid">
            {available.length === 0 ? (
              <div className="empty-state">
                <p>Нет доступных разработчиков</p>
              </div>
            ) : (
              available.map(dev => (
                <DeveloperCard
                  key={dev.id}
                  developer={dev}
                  onHire={() => {
                    onHire(dev);
                    onClose();
                  }}
                  canAfford={budget.remaining >= dev.salary}
                />
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default memo(HireDeveloperModal);

