import { render, screen, fireEvent } from '@testing-library/react';
import TechnologyPanel from '../TechnologyPanel';
import { Panel, Technology } from '../../types';

describe('TechnologyPanel', () => {
  const createMockTech = (overrides?: Partial<Technology>): Technology => ({
    id: 'test-tech',
    name: 'Test Technology',
    category: 'language',
    description: 'Test description',
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

  const createMockPanel = (tech: Technology): Panel => ({
    id: 'panel-1',
    technology: tech,
    x: 100,
    y: 200,
    connections: [],
  });

  it('should render technology information', () => {
    const tech = createMockTech({ name: 'React', category: 'framework' });
    const panel = createMockPanel(tech);

    render(
      <TechnologyPanel
        panel={panel}
        position={{ x: 100, y: 200 }}
        onRemove={jest.fn()}
        onUpdatePosition={jest.fn()}
      />
    );

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Фреймворк')).toBeInTheDocument();
    expect(screen.getByText(tech.description)).toBeInTheDocument();
  });

  it('should display correct category labels', () => {
    const categories = ['language', 'framework', 'pattern', 'library', 'database', 'service'];
    const labels = ['Язык', 'Фреймворк', 'Паттерн', 'Библиотека', 'БД', 'Сервис'];

    categories.forEach((category, index) => {
      const tech = createMockTech({ category: category as Technology['category'] });
      const panel = createMockPanel(tech);

      const { unmount } = render(
        <TechnologyPanel
          panel={panel}
          position={{ x: 0, y: 0 }}
          onRemove={jest.fn()}
          onUpdatePosition={jest.fn()}
        />
      );

      expect(screen.getByText(labels[index])).toBeInTheDocument();
      unmount();
    });
  });

  it('should call onRemove when remove button is clicked', () => {
    const tech = createMockTech();
    const panel = createMockPanel(tech);
    const onRemove = jest.fn();

    render(
      <TechnologyPanel
        panel={panel}
        position={{ x: 0, y: 0 }}
        onRemove={onRemove}
        onUpdatePosition={jest.fn()}
      />
    );

    const removeButton = screen.getByTitle('Удалить');
    fireEvent.click(removeButton);

    expect(onRemove).toHaveBeenCalledWith(panel.id);
  });

  it('should stop propagation on remove button click', () => {
    const tech = createMockTech();
    const panel = createMockPanel(tech);
    const onRemove = jest.fn();
    const parentClick = jest.fn();

    render(
      <div onClick={parentClick}>
        <TechnologyPanel
          panel={panel}
          position={{ x: 0, y: 0 }}
          onRemove={onRemove}
          onUpdatePosition={jest.fn()}
        />
      </div>
    );

    const removeButton = screen.getByTitle('Удалить');
    fireEvent.click(removeButton);

    expect(onRemove).toHaveBeenCalled();
    expect(parentClick).not.toHaveBeenCalled();
  });

  it('should apply correct border color for category', () => {
    const tech = createMockTech({ category: 'language' });
    const panel = createMockPanel(tech);

    const { container } = render(
      <TechnologyPanel
        panel={panel}
        position={{ x: 0, y: 0 }}
        onRemove={jest.fn()}
        onUpdatePosition={jest.fn()}
      />
    );

    const panelElement = container.querySelector('.tech-panel');
    expect(panelElement).toHaveStyle({ borderLeftColor: '#4a9eff' });
  });

  it('should position panel correctly', () => {
    const tech = createMockTech();
    const panel = createMockPanel(tech);
    const position = { x: 150, y: 250 };

    const { container } = render(
      <TechnologyPanel
        panel={panel}
        position={position}
        onRemove={jest.fn()}
        onUpdatePosition={jest.fn()}
      />
    );

    const panelElement = container.querySelector('.tech-panel');
    expect(panelElement).toHaveStyle({
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
    });
  });
});

