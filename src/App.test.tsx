import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Nora Lynord App Test Suite', () => {
  beforeEach(() => {
    // Clear localStorage to ensure fresh progress state for each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('Use Case 1: Initial App Load & Basic Navigation', async () => {
    render(<App />);
    expect(screen.getByText('Noras Pokédex')).toBeInTheDocument();
    expect(screen.getByText('Pallet Town')).toBeInTheDocument();
    expect(screen.getByText('Level 5: Unova')).toBeInTheDocument();
    expect(screen.getByText('Level 6: Kalos')).toBeInTheDocument();

    // Click on world 1
    fireEvent.click(screen.getByText('Pallet Town'));
    
    // Check if we navigated to the World Menu
    expect(await screen.findByText(/Rute 1/)).toBeInTheDocument();
    expect(screen.getByText('Fang Ordet!')).toBeInTheDocument();
    expect(screen.getByText('Lyt og Lær')).toBeInTheDocument();
  });

  it('Use Case 2: Back Navigation from World Menu', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Pallet Town'));
    
    expect(await screen.findByText('Lyt og Lær')).toBeInTheDocument();

    // Go back to World Map
    const backBtn = screen.getByLabelText('Gå tilbage');
    fireEvent.click(backBtn);

    expect(await screen.findByText('Noras Pokédex')).toBeInTheDocument();
  });

  it('Use Case 3: "Find Ordet" Mode (Correct)', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Pallet Town'));
    fireEvent.click(screen.getByText('Fang Ordet!'));

    // Wait for FindScreen to be fully rendered
    await screen.findByText('jeg', { selector: 'button' });

    // The first word is "jeg". We must find the button with "jeg".
    const optionBtns = screen.queryAllByRole('button');
    const correctBtn = optionBtns.find(btn => btn.textContent === 'jeg');
    expect(correctBtn).toBeDefined();
    
    // Pick correct word
    fireEvent.click(correctBtn!);

    // Should transition to next word "er" shortly after
    await waitFor(() => {
      const nextWordBtns = screen.queryAllByRole('button');
      const hasEr = nextWordBtns.some(b => b.textContent === 'er');
      expect(hasEr).toBe(true);
    }, { timeout: 2500 });
  });

  it('Use Case 4: "Find Ordet" Mode (Incorrect)', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Pallet Town'));
    fireEvent.click(screen.getByText('Fang Ordet!'));

    // Wait for FindScreen to be fully rendered
    await screen.findByText('jeg', { selector: 'button' });

    // The first word is "jeg". We pick an incorrect option.
    const optionBtns = screen.queryAllByRole('button');
    // Find a button that is NOT "jeg" and NOT "Gå tilbage" and NOT "Tryk for at høre ordet"
    const incorrectBtn = optionBtns.find(btn => 
      btn.textContent !== 'jeg' && btn.textContent !== '' && btn.textContent !== 'Tryk for at høre ordet'
    );
    
    expect(incorrectBtn).toBeDefined();
    
    // Pick incorrect word
    fireEvent.click(incorrectBtn!);

    // Wait and verify we do NOT advance to the next word ("er"). We should still see "jeg" in the options.
    // It shakes, but stays on "jeg".
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
    });
    
    const currentBtns = screen.queryAllByRole('button');
    const buttonTexts = currentBtns.map(b => b.textContent);
    expect(buttonTexts).toContain('jeg');
  });

  it('Use Case 5: "Lyt og Lær" Mode', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Pallet Town'));
    fireEvent.click(screen.getByText('Lyt og Lær'));

    // Initial word is "jeg"
    expect(screen.getByText('jeg')).toBeInTheDocument();
    
    // Play audio
    const playBtn = screen.getByText('Tryk for at lytte');
    fireEvent.click(playBtn);
    
    // Go to next word
    fireEvent.click(screen.getByText('Næste →'));
    expect(screen.getByText('er')).toBeInTheDocument();
  });

  it('Use Case 10: World Completion & Badge Unlock', async () => {
    render(<App />);
    
    // Go to World 1 Find Ordet
    fireEvent.click(screen.getByText('Pallet Town'));
    fireEvent.click(screen.getByText('Fang Ordet!'));

    // World 1 has 10 words. 
    const expectedWords = ["jeg", "er", "en", "det", "du", "og", "kan", "vi", "har", "den"];
    
    for (let i = 0; i < expectedWords.length; i++) {
      const targetWord = expectedWords[i];
      
      // Wait for the correct word button to render AND be clickable (not disabled).
      // We must query inside waitFor because the component re-renders when advancing to the next word.
      let correctBtn: HTMLElement | undefined;
      await waitFor(() => {
        const optionBtns = screen.queryAllByRole('button');
        correctBtn = optionBtns.find(btn => btn.textContent === targetWord && !btn.hasAttribute('disabled'));
        expect(correctBtn).toBeDefined();
      }, { timeout: 2500 });

      fireEvent.click(correctBtn!);
    }

    // After the last word, the completion screen should show
    expect(await screen.findByText('Gotcha!', undefined, { timeout: 4000 })).toBeInTheDocument();
    expect(screen.getByText(/Alle 10 ord fanget!/)).toBeInTheDocument();
    
    // Complete the world to get back
    fireEvent.click(screen.getByText('Fortsæt'));
    
    // Wait for World Menu Screen to appear
    expect(await screen.findByText('Rute 1 · Vælg en øvelse')).toBeInTheDocument();

    // Verify badge count increased (starts at 0, goes to 10 for 10 perfect matches)
    fireEvent.click(screen.getByLabelText('Gå tilbage'));
    expect(await screen.findByText('Noras Pokédex')).toBeInTheDocument();
    
    expect(await screen.findByText('10')).toBeInTheDocument(); // 10 stars earned
    // Verify 1/48 badges earned
    expect(screen.getByText('1 / 72 badges optjent')).toBeInTheDocument();
  }, 15000);
});
