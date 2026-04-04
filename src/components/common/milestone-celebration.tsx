import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const MILESTONE_META: Record<
  string,
  { icon: string; title: string; subtitle: string; color: string }
> = {
  first_8_day: {
    icon: "◈",
    title: "First 8.0+ Day",
    subtitle: "You hit 8 or higher for the first time. A new level unlocked.",
    color: "text-amber-400",
  },
  personal_best_day: {
    icon: "◉",
    title: "Personal Best",
    subtitle: "Today's score beats everything before it. New record.",
    color: "text-emerald-400",
  },
  first_positive_month: {
    icon: "◑",
    title: "First Positive Month",
    subtitle: "Your monthly score went positive for the first time.",
    color: "text-sky-400",
  },
  best_month_ever: {
    icon: "◐",
    title: "Best Month Ever",
    subtitle: "This month beats every previous month on record.",
    color: "text-violet-400",
  },
  better_floor: {
    icon: "▲",
    title: "Rising Floor",
    subtitle: "Your worst day this month was better than your worst day last month.",
    color: "text-teal-400",
  },
  comeback: {
    icon: "↑",
    title: "Comeback",
    subtitle: "Today's score is 5+ points above your 7-day average.",
    color: "text-orange-400",
  },
  streak_7: {
    icon: "🔥",
    title: "7-Day Streak",
    subtitle: "One full week. The habit is forming.",
    color: "text-amber-400",
  },
  streak_14: {
    icon: "🔥",
    title: "14-Day Streak",
    subtitle: "Two weeks without breaking. Consistency is a skill.",
    color: "text-amber-400",
  },
  streak_30: {
    icon: "🔥",
    title: "30-Day Streak",
    subtitle: "One month straight. You've built a real habit.",
    color: "text-amber-500",
  },
  streak_60: {
    icon: "🔥",
    title: "60-Day Streak",
    subtitle: "Two months. This is who you are now.",
    color: "text-amber-500",
  },
  streak_100: {
    icon: "🔥",
    title: "100-Day Streak",
    subtitle: "Triple digits. Exceptional.",
    color: "text-amber-500",
  },
  streak_365: {
    icon: "🌟",
    title: "365-Day Streak",
    subtitle: "One full year. You showed up every single day.",
    color: "text-amber-400",
  },
}

interface MilestoneCelebrationProps {
  type: string
  onDone: () => void
}

export function MilestoneCelebration({ type, onDone }: MilestoneCelebrationProps) {
  const [visible, setVisible] = useState(true)
  const meta = MILESTONE_META[type] ?? {
    icon: "◉",
    title: "Milestone Reached",
    subtitle: "You hit a new milestone.",
    color: "text-emerald-400",
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 400)
    }, 4500)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm transition-opacity duration-400",
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
      onClick={() => { setVisible(false); setTimeout(onDone, 400) }}
    >
      <div className="text-center space-y-4 px-8">
        <div
          className={cn(
            "text-8xl animate-bounce",
            type.startsWith("streak_365") ? "" : "",
          )}
        >
          {meta.icon}
        </div>
        <h2 className={cn("text-3xl font-bold", meta.color)}>{meta.title}</h2>
        <p className="text-muted-foreground max-w-xs">{meta.subtitle}</p>
        <p className="text-xs text-muted-foreground">Tap anywhere to continue</p>
      </div>
    </div>
  )
}
