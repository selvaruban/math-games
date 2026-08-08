export const PATHS = {
  circle: 'M 50 8 A 42 42 0 1 1 50 92 A 42 42 0 1 1 50 8',
  square: 'M 10 10 H 90 V 90 H 10 Z',
  triangle: 'M 50 8 L 94 92 L 6 92 Z',
  star: 'M 50 6 L 61 38 L 95 38 L 67 59 L 77 91 L 50 71 L 23 91 L 33 59 L 5 38 L 39 38 Z',
  heart: 'M 50 88 C 20 62 8 40 20 26 C 32 12 46 16 50 26 C 54 16 68 12 80 26 C 92 40 80 62 50 88 Z',
  diamond: 'M 50 6 L 94 50 L 50 94 L 6 50 Z',
  pentagon: 'M 50 8 L 90 38 L 76 86 L 24 86 L 10 38 Z',
  hexagon: 'M 50 6 L 90 28 L 90 72 L 50 94 L 10 72 L 10 28 Z',
  oval: 'M 50 20 A 45 30 0 1 1 50 80 A 45 30 0 1 1 50 20',
}

export const SHAPE_NAMES = {
  circle: 'circle',
  square: 'square',
  triangle: 'triangle',
  star: 'star',
  heart: 'heart',
  diamond: 'diamond',
  pentagon: 'pentagon',
  hexagon: 'hexagon',
  oval: 'oval',
}

export const SHAPE_KINDS = Object.keys(PATHS)
