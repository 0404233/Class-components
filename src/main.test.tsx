import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const renderMock = vi.fn();
const rootMock = vi.fn(() => ({ render: renderMock }));

vi.mock('react-dom/client', () => ({
  createRoot: rootMock,
}));

describe('Main', () => {
  let rootDiv: HTMLDivElement;

  beforeEach(() => {
    rootDiv = document.createElement('div');
    rootDiv.id = 'root';
    document.body.appendChild(rootDiv);
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.resetModules();
  });

  it('Render the App', async () => {
    await import('./main');

    expect(rootMock).toHaveBeenCalledWith(rootDiv);
    expect(renderMock).toHaveBeenCalledTimes(1);
  });

  it('Throw error if havent root element', async () => {
    document.body.innerHTML = '';
    await expect(import('./main')).rejects.toThrow('Root element not found');
  });
});
