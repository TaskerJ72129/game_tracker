export type GenreXPMap = Record<string, number>;

export type XPState = {
  totalXP: number;
  genreXP: GenreXPMap;
};

export type XPEvent = {
  id: string;
  amount: number;
  source: string;
  genres?: string[];
  gameTitle?: string;
  timestamp: number;
};