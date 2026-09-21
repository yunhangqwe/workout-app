export type WorkoutType = 'strength' | 'cardio' | 'flexibility'

export interface Exercise {
  id: string
  name: string
  sets?: number
  reps?: string
  duration?: number // seconds
  rest?: number // seconds between sets
}

export interface WorkoutPlan {
  id: string
  name: string
  type: WorkoutType
  description: string
  duration: number // estimated minutes
  exercises: Exercise[]
  color: string
  isCustom?: boolean
}

export interface WorkoutRecord {
  id: string
  date: string // YYYY-MM-DD
  planId: string
  planName: string
  type: WorkoutType
  duration: number // actual seconds
  completed: boolean
  completedAt: number
}

export interface Reminder {
  enabled: boolean
  time: string // HH:mm
}

export type Tab = 'today' | 'plans' | 'timer' | 'records' | 'profile'
