import { calculateAdvancedMetrics } from '../advanced-metrics';
import { AppSchema, Technology } from '../../types';

describe('calculateAdvancedMetrics', () => {
  const createMockTech = (id: string, overrides?: Partial<Technology>): Technology => ({
    id,
    name: `Tech ${id}`,
    category: 'language',
    description: 'Test tech',
    pros: [],
    cons: [],
    performance: 50,
    stability: 50,
    userFriendliness: 50,
    developmentSpeed: 50,
    maintainability: 50,
    complexity: 50,
    cost: 50,
    ...overrides,
  });

  const createMockPanel = (tech: Technology, id: string = tech.id) => ({
    id,
    technology: tech,
    x: 0,
    y: 0,
    connections: [],
  });

  describe('empty schema', () => {
    it('should return zero metrics for empty schema', () => {
      const schema: AppSchema = { frontend: [], backend: [] };
      const metrics = calculateAdvancedMetrics(schema);

      expect(metrics.ux.performance).toBe(0);
      expect(metrics.ux.stability).toBe(0);
      expect(metrics.ux.userFriendliness).toBe(0);
      expect(metrics.dev.developmentSpeed).toBe(0);
      expect(metrics.dev.maintainability).toBe(0);
      expect(metrics.dev.complexity).toBe(0);
      expect(metrics.dev.cost).toBe(0);
    });
  });

  describe('base metrics calculation', () => {
    it('should calculate average metrics from technologies', () => {
      const tech1 = createMockTech('tech1', { performance: 80, stability: 70, userFriendliness: 60 });
      const tech2 = createMockTech('tech2', { performance: 60, stability: 80, userFriendliness: 70 });

      const schema: AppSchema = {
        frontend: [createMockPanel(tech1)],
        backend: [createMockPanel(tech2)],
      };

      const metrics = calculateAdvancedMetrics(schema);

      expect(metrics.ux.performance).toBeCloseTo(70, 1);
      expect(metrics.ux.stability).toBeCloseTo(75, 1);
      expect(metrics.ux.userFriendliness).toBeCloseTo(65, 1);
    });

    it('should increase complexity with more technologies', () => {
      const techs = Array.from({ length: 5 }, (_, i) => 
        createMockPanel(createMockTech(`tech${i}`))
      );

      const schema: AppSchema = {
        frontend: techs,
        backend: [],
      };

      const metrics = calculateAdvancedMetrics(schema);
      expect(metrics.dev.complexity).toBeGreaterThan(30);
    });
  });

  describe('compatibility impact', () => {
    it('should apply preferred bonuses', () => {
      const tech1 = createMockTech('tech1', {
        compatibility: {
          preferred: ['tech2'],
          compatible: [],
          incompatible: [],
        },
      });
      const tech2 = createMockTech('tech2');

      const schema: AppSchema = {
        frontend: [createMockPanel(tech1)],
        backend: [createMockPanel(tech2)],
      };

      const metrics = calculateAdvancedMetrics(schema);
      expect(metrics.ux.performance).toBeGreaterThan(50);
      expect(metrics.ux.stability).toBeGreaterThan(50);
    });

    it('should apply incompatible penalties', () => {
      const tech1 = createMockTech('tech1', {
        compatibility: {
          preferred: [],
          compatible: [],
          incompatible: ['tech2'],
        },
      });
      const tech2 = createMockTech('tech2');

      const schema: AppSchema = {
        frontend: [createMockPanel(tech1)],
        backend: [createMockPanel(tech2)],
      };

      const metrics = calculateAdvancedMetrics(schema);
      expect(metrics.ux.performance).toBeLessThan(50);
      expect(metrics.ux.stability).toBeLessThan(50);
      expect(metrics.dev.complexity).toBeGreaterThan(50);
    });
  });

  describe('hidden modifiers', () => {
    it('should apply hidden modifiers when target tech is present', () => {
      const tech1 = createMockTech('tech1', {
        modifiers: [{
          targetTechId: 'tech2',
          ux: { performance: 10, stability: 5 },
          dev: { developmentSpeed: 8 },
        }],
      });
      const tech2 = createMockTech('tech2');

      const schema: AppSchema = {
        frontend: [createMockPanel(tech1)],
        backend: [createMockPanel(tech2)],
      };

      const metrics = calculateAdvancedMetrics(schema);
      expect(metrics.ux.performance).toBeGreaterThan(50);
      expect(metrics.ux.stability).toBeGreaterThan(50);
      expect(metrics.dev.developmentSpeed).toBeGreaterThan(50);
    });

    it('should not apply modifiers when target tech is absent', () => {
      const tech1 = createMockTech('tech1', {
        modifiers: [{
          targetTechId: 'tech2',
          ux: { performance: 10 },
        }],
      });

      const schema: AppSchema = {
        frontend: [createMockPanel(tech1)],
        backend: [],
      };

      const metrics = calculateAdvancedMetrics(schema);
      expect(metrics.ux.performance).toBe(50);
    });
  });

  describe('specific rules', () => {
    it('should apply TypeScript rule', () => {
      const ts = createMockTech('ts');
      const schema: AppSchema = {
        frontend: [createMockPanel(ts)],
        backend: [],
      };

      const metrics = calculateAdvancedMetrics(schema);
      expect(metrics.ux.stability).toBeGreaterThan(50);
      expect(metrics.dev.maintainability).toBeGreaterThan(50);
      expect(metrics.dev.complexity).toBeGreaterThan(50);
    });

    it('should apply JavaScript without TypeScript rule', () => {
      const js = createMockTech('js');
      const schema: AppSchema = {
        frontend: [createMockPanel(js)],
        backend: [],
      };

      const metrics = calculateAdvancedMetrics(schema);
      expect(metrics.dev.developmentSpeed).toBeGreaterThan(50);
      expect(metrics.ux.stability).toBeLessThan(50);
    });

    it('should apply NestJS + TypeScript rule', () => {
      const ts = createMockTech('ts');
      const nestjs = createMockTech('nestjs');
      const schema: AppSchema = {
        frontend: [createMockPanel(ts)],
        backend: [createMockPanel(nestjs)],
      };

      const metrics = calculateAdvancedMetrics(schema);
      expect(metrics.ux.stability).toBeGreaterThan(50);
      expect(metrics.dev.maintainability).toBeGreaterThan(50);
    });

    it('should apply NestJS without TypeScript penalty', () => {
      const nestjs = createMockTech('nestjs');
      const schema: AppSchema = {
        frontend: [],
        backend: [createMockPanel(nestjs)],
      };

      const metrics = calculateAdvancedMetrics(schema);
      expect(metrics.ux.stability).toBeLessThan(50);
      expect(metrics.dev.complexity).toBeGreaterThan(50);
    });

    it('should apply Redis + database rule', () => {
      const redis = createMockTech('redis');
      const postgresql = createMockTech('postgresql');
      const schema: AppSchema = {
        frontend: [],
        backend: [createMockPanel(redis), createMockPanel(postgresql)],
      };

      const metrics = calculateAdvancedMetrics(schema);
      expect(metrics.ux.performance).toBeGreaterThan(50);
    });

    it('should apply Docker + Kubernetes rule', () => {
      const docker = createMockTech('docker');
      const k8s = createMockTech('kubernetes');
      const schema: AppSchema = {
        frontend: [],
        backend: [createMockPanel(docker), createMockPanel(k8s)],
      };

      const metrics = calculateAdvancedMetrics(schema);
      expect(metrics.ux.stability).toBeGreaterThan(50);
      expect(metrics.dev.complexity).toBeGreaterThan(50);
      expect(metrics.dev.cost).toBeGreaterThan(50);
    });

    it('should apply Kubernetes without Docker penalty', () => {
      const k8s = createMockTech('kubernetes');
      const schema: AppSchema = {
        frontend: [],
        backend: [createMockPanel(k8s)],
      };

      const metrics = calculateAdvancedMetrics(schema);
      expect(metrics.ux.stability).toBeLessThan(50);
      expect(metrics.dev.complexity).toBeGreaterThan(50);
    });
  });

  describe('penalties', () => {
    it('should apply penalty for too many technologies', () => {
      const techs = Array.from({ length: 10 }, (_, i) => 
        createMockPanel(createMockTech(`tech${i}`))
      );

      const schema: AppSchema = {
        frontend: techs,
        backend: [],
      };

      const metrics = calculateAdvancedMetrics(schema);
      expect(metrics.dev.complexity).toBeGreaterThan(50);
      expect(metrics.dev.cost).toBeGreaterThan(50);
    });

    it('should apply penalty for missing frontend', () => {
      const backend = createMockTech('node');
      const schema: AppSchema = {
        frontend: [],
        backend: [createMockPanel(backend)],
      };

      const metrics = calculateAdvancedMetrics(schema);
      expect(metrics.ux.userFriendliness).toBeLessThan(50);
      expect(metrics.dev.developmentSpeed).toBeLessThan(50);
    });

    it('should apply penalty for missing backend', () => {
      const frontend = createMockTech('react');
      const schema: AppSchema = {
        frontend: [createMockPanel(frontend)],
        backend: [],
      };

      const metrics = calculateAdvancedMetrics(schema);
      expect(metrics.ux.userFriendliness).toBeLessThan(50);
      expect(metrics.dev.developmentSpeed).toBeLessThan(50);
    });
  });

  describe('metric bounds', () => {
    it('should clamp metrics between 0 and 100', () => {
      const tech1 = createMockTech('tech1', {
        performance: 0,
        stability: 0,
        compatibility: {
          preferred: [],
          compatible: [],
          incompatible: ['tech2'],
        },
      });
      const tech2 = createMockTech('tech2', {
        compatibility: {
          preferred: [],
          compatible: [],
          incompatible: ['tech1'],
        },
      });

      const schema: AppSchema = {
        frontend: [createMockPanel(tech1)],
        backend: [createMockPanel(tech2)],
      };

      const metrics = calculateAdvancedMetrics(schema);

      expect(metrics.ux.performance).toBeGreaterThanOrEqual(0);
      expect(metrics.ux.performance).toBeLessThanOrEqual(100);
      expect(metrics.ux.stability).toBeGreaterThanOrEqual(0);
      expect(metrics.ux.stability).toBeLessThanOrEqual(100);
    });
  });
});

