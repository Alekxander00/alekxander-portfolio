// Cada letra tiene una categoría única
export const lettersData = [
  { letter: 'A', category: 'Animation', index: 0 },
  { letter: 'L', category: 'Logic', index: 1 },
  { letter: 'E', category: 'Experience', index: 2 },
  { letter: 'K', category: 'Kode', index: 3 },
  { letter: 'X', category: 'Xpression', index: 4 },
  { letter: 'A', category: 'Art', index: 5 },
  { letter: 'N', category: 'Narrative', index: 6 },
  { letter: 'D', category: 'Design', index: 7 },
  { letter: 'E', category: 'Edition', index: 8 },
  { letter: 'R', category: 'Research', index: 9 },
];

// Para validación en CategoryView
export const validCategories = lettersData.map(item => item.category);