export enum Difficulty {
  EASY,
  MEDIUM,
  HARD,
}

export type Logs = {
  id: string;
  title: string;
  notes: string;
  codes: string;
  createdAt: Date;
  updatedAt: Date;
  difficulty: Difficulty;
  userId: string;
};
