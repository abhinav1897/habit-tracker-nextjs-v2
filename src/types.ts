export interface Habit {
  id: string
  name: string
  emoji: string
  createdAt: string
}

export type Completions = Record<string, string[]>
