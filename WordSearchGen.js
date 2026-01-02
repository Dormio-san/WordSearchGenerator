// Directions: dx, dy pairs
const DIRECTIONS = {
  RIGHT:  { dx: 1,  dy: 0 },   // →
  LEFT:   { dx: -1, dy: 0 },   // ←
  DOWN:   { dx: 0,  dy: 1 },   // ↓
  UP:     { dx: 0,  dy: -1 },  // ↑
  DOWN_RIGHT: { dx: 1,  dy: 1 },   // ↘
  DOWN_LEFT:  { dx: -1, dy: 1 },   // ↙
  UP_RIGHT:   { dx: 1,  dy: -1 },  // ↗
  UP_LEFT:    { dx: -1, dy: -1 }   // ↖
};

// Create empty grid
function createEmptyGrid(rows, cols) {
  const grid = [];
  for (let y = 0; y < rows; y++) {
    const row = new Array(cols).fill(null);
    grid.push(row);
  }
  return grid;
}

// Try to place a single word in the grid with a given direction
function canPlaceWord(grid, word, startX, startY, direction) {
  const rows = grid.length;
  const cols = grid[0].length;
  const { dx, dy } = direction;

  for (let i = 0; i < word.length; i++) {
    const x = startX + dx * i;
    const y = startY + dy * i;

    // Check bounds
    if (x < 0 || x >= cols || y < 0 || y >= rows) {
      return false;
    }

    const cell = grid[y][x];
    // Cell must be empty or already contain the same letter
    if (cell !== null && cell !== word[i]) {
      return false;
    }
  }

  return true;
}

function placeWord(grid, word, startX, startY, direction) {
  const { dx, dy } = direction;
  for (let i = 0; i < word.length; i++) {
    const x = startX + dx * i;
    const y = startY + dy * i;
    grid[y][x] = word[i];
  }
}

function fillEmptyCellsWithRandomLetters(grid) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const rows = grid.length;
  const cols = grid[0].length;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === null) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        grid[y][x] = alphabet[randomIndex];
      }
    }
  }
}

function generateWordSearch(options) {
  const {
    words,
    rows,
    cols,
    allowedDirections = ["RIGHT", "DOWN"],
    maxRetriesPerWord = 200
  } = options;

  // Uppercase and trim words, filter out empty ones
  const cleanWords = words
    .map(w => w.trim().toUpperCase())
    .filter(w => w.length > 0);

  const grid = createEmptyGrid(rows, cols);

  // Build direction list from keys
  const directionList = allowedDirections.map(key => DIRECTIONS[key]).filter(Boolean);

  // Keep track of placements for answer sheet
  const placements = [];

  // Place each word
  for (const word of cleanWords) {
    let placed = false;

    for (let attempt = 0; attempt < maxRetriesPerWord && !placed; attempt++) {
      const dir = directionList[Math.floor(Math.random() * directionList.length)];
      const startX = Math.floor(Math.random() * cols);
      const startY = Math.floor(Math.random() * rows);

      if (canPlaceWord(grid, word, startX, startY, dir)) {
        placeWord(grid, word, startX, startY, dir);
        placements.push({
          word,
          startX,
          startY,
          dx: dir.dx,
          dy: dir.dy
        });
        placed = true;
      }
    }
	
    if (!placed) {
      console.warn(`Could not place word: ${word}`);
    }
  }

  // Fill remaining cells with random letters
  fillEmptyCellsWithRandomLetters(grid);

  return {
    grid,        // 2D array of letters
    placements,  // metadata for answer sheet
    words: cleanWords
  };
}