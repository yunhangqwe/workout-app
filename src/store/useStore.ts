import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WorkoutPlan, WorkoutRecord, Reminder, Tab } from '../types'
import { defaultPlans } from '../data/defaultPlans'

interface AppState {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void

  plans: WorkoutPlan[]
  addPlan: (plan: WorkoutPlan) => void
  updatePlan: (plan: WorkoutPlan) => void
  deletePlan: (id: string) => void

  records: WorkoutRecord[]
  addRecord: (record: WorkoutRecord) => void
  deleteRecord: (id: string) => void

  reminder: Reminder
  setReminder: (reminder: Reminder) => void

  selectedPlanId: string | null
  setSelectedPlanId: (id: string | null) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      activeTab: 'today',
      setActiveTab: (tab) => set({ activeTab: tab }),

      plans: defaultPlans,
      addPlan: (plan) => set((state) => ({ plans: [plan, ...state.plans] })),
      updatePlan: (plan) =>
        set((state) => ({
          plans: state.plans.map((p) => (p.id === plan.id ? plan : p)),
        })),
      deletePlan: (id) =>
        set((state) => ({
          plans: state.plans.filter((p) => p.id !== id),
        })),

      records: [],
      addRecord: (record) =>
        set((state) => ({ records: [record, ...state.records] })),
      deleteRecord: (id) =>
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        })),

      reminder: { enabled: false, time: '08:00' },
      setReminder: (reminder) => set({ reminder }),

      selectedPlanId: null,
      setSelectedPlanId: (id) => set({ selectedPlanId: id }),
    }),
    {
      name: 'workout-app-storage',
      partialize: (state) => ({
        plans: state.plans,
        records: state.records,
        reminder: state.reminder,
      }),
    }
  )
)
