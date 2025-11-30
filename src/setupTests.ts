import '@testing-library/jest-dom';
import React from 'react';

// Mock для Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => React.createElement('div', props, children),
    span: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => React.createElement('span', props, children),
    button: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => React.createElement('button', props, children),
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => React.createElement(React.Fragment, {}, children),
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
  }),
}));

// Mock для window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

