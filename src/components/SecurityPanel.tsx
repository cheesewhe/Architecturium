import { motion } from 'framer-motion';
import { memo } from 'react';
import { SecurityMetrics } from '../types';
import { getSeverityColor } from '../utils/security';

interface SecurityPanelProps {
  security: SecurityMetrics;
}

function SecurityPanel({ security }: SecurityPanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="security-panel">
      <h3>Безопасность</h3>

      <div className="security-score">
        <div className="score-circle" style={{ borderColor: getScoreColor(security.score) }}>
          <span className="score-value">{security.score}</span>
          <span className="score-label">/100</span>
        </div>
        <div className="score-status">
          {security.score >= 80 && '✅ Безопасно'}
          {security.score >= 60 && security.score < 80 && '⚠️ Требует внимания'}
          {security.score < 60 && '❌ Критично'}
        </div>
      </div>

      {security.vulnerabilities.length > 0 && (
        <div className="security-vulnerabilities">
          <h4>Уязвимости ({security.vulnerabilities.length})</h4>
          {security.vulnerabilities.map(vuln => (
            <motion.div
              key={vuln.id}
              className="vulnerability-item"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ borderLeftColor: getSeverityColor(vuln.severity) }}
            >
              <div className="vuln-header">
                <span className={`vuln-severity ${vuln.severity}`}>
                  {vuln.severity.toUpperCase()}
                </span>
                <span className="vuln-tech">{vuln.affectedTech}</span>
              </div>
              <div className="vuln-description">{vuln.description}</div>
              {vuln.fix && (
                <div className="vuln-fix">
                  <strong>Решение:</strong> {vuln.fix}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {security.compliance.length > 0 && (
        <div className="security-compliance">
          <h4>Соответствие стандартам</h4>
          {security.compliance.map((comp, idx) => (
            <div key={idx} className={`compliance-item ${comp.compliant ? 'compliant' : 'non-compliant'}`}>
              <div className="compliance-header">
                <span className="compliance-standard">{comp.standard}</span>
                <span className="compliance-status">
                  {comp.compliant ? '✅ Соответствует' : '❌ Не соответствует'}
                </span>
              </div>
              {comp.issues.length > 0 && (
                <ul className="compliance-issues">
                  {comp.issues.map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {security.vulnerabilities.length === 0 && security.compliance.every(c => c.compliant) && (
        <div className="security-success">
          <div className="success-icon">🛡️</div>
          <div className="success-text">Архитектура безопасна!</div>
        </div>
      )}
    </div>
  );
}

export default memo(SecurityPanel);

