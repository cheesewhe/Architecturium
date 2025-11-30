import { SecurityMetrics, SecurityVulnerability, ComplianceStatus, AppSchema, Technology } from '../types';

/**
 * Система безопасности
 * 
 * Проверяет безопасность архитектуры и соответствие стандартам
 */

/**
 * Анализирует безопасность архитектуры
 */
export function analyzeSecurity(schema: AppSchema): SecurityMetrics {
  const allPanels = [...schema.frontend, ...schema.backend];
  const technologies = allPanels.map(p => p.technology);
  const techIds = technologies.map(t => t.id);

  const vulnerabilities: SecurityVulnerability[] = [];
  const compliance: ComplianceStatus[] = [];

  // Проверка на известные уязвимости технологий
  checkTechnologyVulnerabilities(techIds, vulnerabilities);

  // Проверка соответствия стандартам
  checkCompliance(techIds, technologies, compliance);

  // Рассчитываем общий score безопасности
  const baseScore = 100;
  const vulnerabilityPenalty = vulnerabilities.reduce((sum, v) => {
    const penalties: Record<SecurityVulnerability['severity'], number> = {
      low: 2,
      medium: 5,
      high: 10,
      critical: 20,
    };
    return sum + penalties[v.severity];
  }, 0);

  const compliancePenalty = compliance.filter(c => !c.compliant).length * 5;

  const score = Math.max(0, baseScore - vulnerabilityPenalty - compliancePenalty);

  return {
    score,
    vulnerabilities,
    compliance,
  };
}

/**
 * Проверяет уязвимости технологий
 */
function checkTechnologyVulnerabilities(
  techIds: string[],
  vulnerabilities: SecurityVulnerability[]
): void {
  // JavaScript без TypeScript - больше уязвимостей
  if (techIds.includes('js') && !techIds.includes('ts')) {
    vulnerabilities.push({
      id: 'js-no-types',
      severity: 'medium',
      description: 'JavaScript без TypeScript увеличивает риск ошибок типов',
      affectedTech: 'js',
      fix: 'Используйте TypeScript для лучшей безопасности типов',
    });
  }

  // Отсутствие аутентификации
  if (!techIds.includes('jwt') && !techIds.includes('oauth')) {
    vulnerabilities.push({
      id: 'no-auth',
      severity: 'critical',
      description: 'Отсутствует система аутентификации',
      affectedTech: 'all',
      fix: 'Добавьте JWT или OAuth для аутентификации',
    });
  }

  // MongoDB без валидации
  if (techIds.includes('mongodb') && !techIds.includes('mongoose')) {
    vulnerabilities.push({
      id: 'mongodb-no-validation',
      severity: 'high',
      description: 'MongoDB без валидации схемы может привести к некорректным данным',
      affectedTech: 'mongodb',
      fix: 'Используйте Mongoose или другую библиотеку валидации',
    });
  }

  // Отсутствие HTTPS/SSL
  if (!techIds.includes('nginx') && !techIds.includes('api-gateway')) {
    vulnerabilities.push({
      id: 'no-ssl',
      severity: 'high',
      description: 'Рекомендуется использовать reverse proxy с SSL',
      affectedTech: 'all',
      fix: 'Добавьте Nginx или API Gateway для SSL/TLS',
    });
  }

  // Небезопасные зависимости
  if (techIds.includes('express') && !techIds.includes('helmet')) {
    vulnerabilities.push({
      id: 'express-no-helmet',
      severity: 'medium',
      description: 'Express без Helmet уязвим к XSS и другим атакам',
      affectedTech: 'express',
      fix: 'Используйте Helmet для защиты заголовков',
    });
  }
}

/**
 * Проверяет соответствие стандартам
 */
function checkCompliance(
  techIds: string[],
  _technologies: Technology[],
  compliance: ComplianceStatus[]
): void {
  // PCI DSS (для платежей)
  const hasPaymentTech = techIds.some(id => ['stripe', 'payment'].includes(id));
  if (hasPaymentTech) {
    const issues: string[] = [];
    
    if (!techIds.includes('vault')) {
      issues.push('Требуется безопасное хранение ключей (HashiCorp Vault)');
    }
    
    if (!techIds.includes('postgresql') && !techIds.includes('mysql')) {
      issues.push('Требуется реляционная БД для транзакций');
    }

    compliance.push({
      standard: 'PCI-DSS',
      compliant: issues.length === 0,
      issues,
    });
  }

  // GDPR (для персональных данных)
  const hasUserData = true; // Предполагаем, что есть пользовательские данные
  if (hasUserData) {
    const issues: string[] = [];
    
    if (!techIds.includes('vault')) {
      issues.push('Требуется шифрование персональных данных');
    }
    
    if (!techIds.includes('postgresql') && !techIds.includes('mysql')) {
      issues.push('Требуется БД с поддержкой шифрования');
    }

    compliance.push({
      standard: 'GDPR',
      compliant: issues.length === 0,
      issues,
    });
  }

  // HIPAA (для медицинских данных) - если есть соответствующий тип приложения
  // SOC2 - для enterprise приложений
  if (techIds.includes('java') && techIds.includes('spring')) {
    compliance.push({
      standard: 'SOC2',
      compliant: techIds.includes('vault') && techIds.includes('prometheus'),
      issues: [],
    });
  }
}

/**
 * Получает цвет для уровня серьёзности
 */
export function getSeverityColor(severity: SecurityVulnerability['severity']): string {
  const colors: Record<SecurityVulnerability['severity'], string> = {
    low: '#f59e0b',
    medium: '#f97316',
    high: '#ef4444',
    critical: '#dc2626',
  };
  return colors[severity];
}

