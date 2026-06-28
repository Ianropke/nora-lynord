import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import App from './App';

describe('New Mini Games Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('Renders Stav Ordet Game', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Pallet Town'));
    fireEvent.click(screen.getByText('Stav Ordet'));
    
    // Verify the Pokédex screen placeholders render
    await waitFor(() => {
      expect(screen.getAllByText('_').length).toBeGreaterThan(0);
    });
  });

  it('Renders Ord-Toget Game', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Pallet Town'));
    fireEvent.click(screen.getByText('Ord-Toget'));
    
    // Test the unknown wagon placeholder
    expect(await screen.findByText('?')).toBeInTheDocument();
  });
});
