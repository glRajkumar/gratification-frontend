import { useEffect } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSettings, useUpdateSettings } from "@/hooks/use-settings"
import {
  InputWrapper,
  SelectWrapper,
  SwitchWrapper,
} from "@/components/ui/field-wrapper-rhf"
import { Button } from "@/components/ui/button"
import { settingsSchema, type SettingsFormData } from "@/utils/schemas"
import { sendApiReq } from "@/services/send-api-req"
import { endpoints } from "@/services/endpoints"
import { toast } from "sonner"

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
})

const weekStartOptions = [
  { value: "monday", label: "Monday" },
  { value: "sunday", label: "Sunday" },
]

const defaultTagOptions = [
  { value: "positive", label: "Positive" },
  { value: "neutral", label: "Neutral" },
  { value: "negative", label: "Negative" },
]

const themeOptions = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
]

function SettingsPage() {
  const { data: settings, isLoading } = useSettings()
  const updateMutation = useUpdateSettings()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<SettingsFormData, any, SettingsFormData>({
    resolver: zodResolver(settingsSchema) as any,
    defaultValues: {
      weekStartDay: "monday",
      defaultTag: "positive",
      defaultScore: 1,
      showScoreOnDashboard: true,
      theme: "system",
    },
  })

  useEffect(() => {
    if (settings) {
      form.reset(settings)
    }
  }, [settings, form])

  function onSubmit(data: SettingsFormData) {
    updateMutation.mutate(data)
  }

  function handleExport() {
    sendApiReq<object>({ method: "GET", url: endpoints.export.get })
      .then((data) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `gratification-export-${new Date().toISOString().slice(0, 10)}.json`
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Data exported")
      })
      .catch(() => toast.error("Export failed"))
  }

  if (isLoading)
    return <div className="p-6 text-sm text-muted-foreground">Loading…</div>

  return (
    <div className="p-6 max-w-md space-y-8">
      <h1 className="text-lg font-semibold">Settings</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <section className="space-y-4">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Preferences
          </h2>
          <SelectWrapper
            name="weekStartDay"
            control={form.control}
            label="Week starts on"
            options={weekStartOptions}
            placeholder="Select day"
          />
          <SelectWrapper
            name="defaultTag"
            control={form.control}
            label="Default journal tag"
            options={defaultTagOptions}
            placeholder="Select tag"
          />
          <InputWrapper
            name="defaultScore"
            control={form.control}
            label="Default score value"
            type="number"
            min={1}
            max={10}
          />
          <SwitchWrapper
            name="showScoreOnDashboard"
            control={form.control}
            label="Show score on dashboard"
          />
          <SelectWrapper
            name="theme"
            control={form.control}
            label="Theme"
            options={themeOptions}
            placeholder="Select theme"
          />
        </section>

        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Saving…" : "Save settings"}
        </Button>
      </form>

      <section className="space-y-4 border-t pt-6">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Data
        </h2>
        <div>
          <p className="text-sm font-medium mb-1">Export all data</p>
          <p className="text-xs text-muted-foreground mb-3">
            Download a JSON file with all your journal entries, goals, habits, and more.
          </p>
          <Button variant="outline" onClick={handleExport}>
            Export data
          </Button>
        </div>
      </section>
    </div>
  )
}
