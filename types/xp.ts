export type GenreXPMap = Record<string, number>;

export type XPState = {
  totalXP: number;
  genreXP: GenreXPMap;
};
