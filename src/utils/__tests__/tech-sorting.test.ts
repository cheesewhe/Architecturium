import { sortTechnologies, getRecommendationLabel } from '../tech-sorting';
import { AppSchema, Technology } from '../../types';

describe('tech-sorting', () => {
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
    complexity: overrides?.complexity ?? 50,
    cost: 50,
    ...overrides,
  });

  describe('sortTechnologies', () => {
    describe('empty schema', () => {
      it('should sort by complexity when schema is empty', () => {
        const techs = [
          createMockTech('complex', { complexity: 80 }),
          createMockTech('simple', { complexity: 20 }),
          createMockTech('medium', { complexity: 50 }),
        ];

        const schema: AppSchema = { frontend: [], backend: [] };
        const sorted = sortTechnologies(techs, schema);

        expect(sorted[0].id).toBe('simple');
        expect(sorted[1].id).toBe('medium');
        expect(sorted[2].id).toBe('complex');
      });
    });

    describe('one selected technology', () => {
      it('should sort by recommendation for one selected tech', () => {
        const selected = createMockTech('selected', {
          compatibility: {
            preferred: ['preferred'],
            compatible: ['compatible'],
            incompatible: ['incompatible'],
          },
        });

        const techs = [
          createMockTech('incompatible'),
          createMockTech('compatible'),
          createMockTech('preferred'),
          createMockTech('neutral'),
        ];

        const schema: AppSchema = {
          frontend: [{
            id: 'panel1',
            technology: selected,
            x: 0,
            y: 0,
            connections: [],
          }],
          backend: [],
        };

        const sorted = sortTechnologies(techs, schema);

        // Preferred should be first
        expect(sorted[0].id).toBe('preferred');
        // Incompatible should be last
        expect(sorted.findIndex(t => t.id === 'incompatible')).toBeGreaterThan(0);
      });
    });

    describe('multiple selected technologies', () => {
      it('should sort by recommendation for multiple selected techs', () => {
        const selected1 = createMockTech('selected1', {
          compatibility: {
            preferred: ['tech1'],
            compatible: [],
            incompatible: [],
          },
        });

        const selected2 = createMockTech('selected2', {
          compatibility: {
            preferred: ['tech1'],
            compatible: [],
            incompatible: [],
          },
        });

        const techs = [
          createMockTech('tech1'),
          createMockTech('tech2'),
          createMockTech('tech3'),
        ];

        const schema: AppSchema = {
          frontend: [{
            id: 'panel1',
            technology: selected1,
            x: 0,
            y: 0,
            connections: [],
          }],
          backend: [{
            id: 'panel2',
            technology: selected2,
            x: 0,
            y: 0,
            connections: [],
          }],
        };

        const sorted = sortTechnologies(techs, schema);
        // tech1 should be first as it's preferred by both
        expect(sorted[0].id).toBe('tech1');
      });

      it('should sort by complexity when scores are equal', () => {
        const selected = createMockTech('selected');
        const techs = [
          createMockTech('tech1', { complexity: 30 }),
          createMockTech('tech2', { complexity: 20 }),
          createMockTech('tech3', { complexity: 40 }),
        ];

        const schema: AppSchema = {
          frontend: [{
            id: 'panel1',
            technology: selected,
            x: 0,
            y: 0,
            connections: [],
          }],
          backend: [],
        };

        const sorted = sortTechnologies(techs, schema);
        // Should sort by complexity when recommendation scores are equal
        expect(sorted[0].complexity).toBeLessThanOrEqual(sorted[1].complexity);
      });
    });

    describe('modifiers influence', () => {
      it('should boost score for techs with modifiers', () => {
        const selected = createMockTech('selected');
        const techWithModifier = createMockTech('withModifier', {
          modifiers: [{
            targetTechId: 'selected',
            ux: { performance: 10, stability: 5 },
            dev: { developmentSpeed: 8 },
          }],
        });
        const techWithoutModifier = createMockTech('withoutModifier');

        const techs = [techWithModifier, techWithoutModifier];

        const schema: AppSchema = {
          frontend: [{
            id: 'panel1',
            technology: selected,
            x: 0,
            y: 0,
            connections: [],
          }],
          backend: [],
        };

        const sorted = sortTechnologies(techs, schema);
        expect(sorted[0].id).toBe('withModifier');
      });
    });
  });

  describe('getRecommendationLabel', () => {
    describe('empty selection', () => {
      it('should return complexity label when no techs selected', () => {
        const tech = createMockTech('tech', { complexity: 30 });
        const label = getRecommendationLabel(tech, []);

        expect(label).toBe('⭐ Просто');
      });

      it('should return correct complexity labels', () => {
        expect(getRecommendationLabel(createMockTech('tech', { complexity: 20 }), [])).toBe('⭐ Просто');
        expect(getRecommendationLabel(createMockTech('tech', { complexity: 40 }), [])).toBe('⭐⭐ Средне');
        expect(getRecommendationLabel(createMockTech('tech', { complexity: 60 }), [])).toBe('⭐⭐⭐ Сложно');
        expect(getRecommendationLabel(createMockTech('tech', { complexity: 80 }), [])).toBe('⭐⭐⭐⭐ Очень сложно');
      });
    });

    describe('with selected technologies', () => {
      it('should return "Рекомендуется" for high score', () => {
        const selected = createMockTech('selected', {
          compatibility: {
            preferred: ['tech'],
            compatible: [],
            incompatible: [],
          },
        });
        const tech = createMockTech('tech', {
          compatibility: {
            preferred: ['selected'],
            compatible: [],
            incompatible: [],
          },
        });

        const label = getRecommendationLabel(tech, [selected]);
        expect(label).toBe('✅ Рекомендуется');
      });

      it('should return "Совместимо" for medium score', () => {
        const selected = createMockTech('selected', {
          compatibility: {
            preferred: [],
            compatible: ['tech'],
            incompatible: [],
          },
        });
        const tech = createMockTech('tech');

        const label = getRecommendationLabel(tech, [selected]);
        expect(label).toBe('○ Совместимо');
      });

      it('should return "Несовместимо" for incompatible techs', () => {
        const selected = createMockTech('selected', {
          compatibility: {
            preferred: [],
            compatible: [],
            incompatible: ['tech'],
          },
        });
        const tech = createMockTech('tech', {
          compatibility: {
            preferred: [],
            compatible: [],
            incompatible: ['selected'],
          },
        });

        const label = getRecommendationLabel(tech, [selected]);
        expect(label).toBe('❌ Несовместимо');
      });

      it('should return null for neutral techs', () => {
        const selected = createMockTech('selected');
        const tech = createMockTech('tech');

        const label = getRecommendationLabel(tech, [selected]);
        expect(label).toBeNull();
      });
    });
  });
});

