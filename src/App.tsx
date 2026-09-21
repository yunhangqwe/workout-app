import { AnimatePresence, motion } from 'framer-motion'
import { BottomNav } from './components/BottomNav'
import { useStore } from './store/useStore'
import { TodayPage } from './pages/TodayPage'
import { PlansPage } from './pages/PlansPage'
import { TimerPage } from './pages/TimerPage'
import { RecordsPage } from './pages/RecordsPage'
import { ProfilePage } from './pages/ProfilePage'
import type { Tab } from './types'

const pages: Record<Tab, React.ComponentType> = {
  today: TodayPage,
  plans: PlansPage,
  timer: TimerPage,
  records: RecordsPage,
  profile: ProfilePage,
}

const directionMap: Record<Tab, number> = {
  today: 0,
  plans: 1,
  timer: 2,
  records: 3,
  profile: 4,
}

function App() {
  const activeTab = useStore((s) => s.activeTab)
  const Page = pages[activeTab]
  const direction = directionMap[activeTab]

  return (
    <div className="min-h-svh flex flex-col">
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: direction > 0 ? 24 : -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -24 : 24 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          >
            <Page />
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  )
}

export default App
