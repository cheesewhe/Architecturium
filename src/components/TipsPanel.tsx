import { motion, AnimatePresence } from 'framer-motion';
import { memo, useState, useEffect } from 'react';

interface TipsPanelProps {
  tips?: string[];
}

const defaultTips = [
  '💡 TypeScript + React - популярная комбинация в 2024!',
  '💡 Не забывайте про базу данных - вашему backend она нужна!',
  '💡 Слишком много технологий = выше сложность!',
  '💡 Redis с основной БД даёт огромный прирост производительности',
  '💡 Docker + Kubernetes - полноценная cloud-native архитектура',
  '💡 Следите за бюджетом - некоторые технологии стоят дорого',
  '💡 Используйте ✅ рекомендованные технологии для лучших результатов',
  '💡 TypeScript делает код стабильнее, но разработка чуть медленнее',
];

function TipsPanel({ tips = defaultTips }: TipsPanelProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const tipsToShow = tips.length > 0 ? tips : defaultTips;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % tipsToShow.length);
    }, 8000); // Меняем подсказку каждые 8 секунд

    return () => clearInterval(interval);
  }, [tipsToShow.length]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentTipIndex}
        className="tips-panel"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <div className="tips-icon">💡</div>
        <div className="tips-text">{tipsToShow[currentTipIndex]}</div>
      </motion.div>
    </AnimatePresence>
  );
}

export default memo(TipsPanel);

