export type Game = {
  id: string
  rawgId: number;
  title: string;
  genres: string[];
  completed: boolean;
};

export type RawgGame = {
  id: number;
  title: string;
  genres: { name: string }[];
  released?: string;
};