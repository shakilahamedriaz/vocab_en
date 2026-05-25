export interface User {
  id: string;
  email: string;
  name: string;
  daily_goal: number;
  streak: number;
  longest_streak: number;
  subscription_tier: string;
  theme: string;
  created_at: string;
}

export interface Word {
  id: string;
  word: string;
  part_of_speech: string;
  meaning: string;
  meaning_bengali?: string;
  pronunciation?: string;
  difficulty: string;
  ielts_band?: number;
  synonyms: string[];
  antonyms: string[];
  collocations: string[];
  examples: string[];
  tags: string[];
  category?: string;
  word_family?: Record<string, string>[];
  user_progress?: UserProgress;
}

export interface UserProgress {
  status: 'new' | 'learning' | 'familiar' | 'mastered';
  interval: number;
  repetitions: number;
  easiness_factor: number;
  next_review: string | null;
  accuracy: number;
}

export interface DueWord {
  word_id: string;
  word: string;
  part_of_speech: string;
  meaning: string;
  meaning_bengali?: string;
  pronunciation?: string;
  synonyms: string[];
  last_reviewed: string | null;
  current_interval: number;
  repetitions: number;
  easiness_factor: number;
  overdue_days: number;
  mastery_status: string;
}

export interface QuizQuestion {
  id: string;
  type: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface SRSStats {
  total_words: number;
  new: number;
  learning: number;
  familiar: number;
  mastered: number;
  due_today: number;
  completed_today: number;
  accuracy_today: number;
  streak: number;
}
