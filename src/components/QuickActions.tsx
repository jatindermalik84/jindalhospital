import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Calendar, FileText, TestTube, Clock, Phone } from "lucide-react"

const quickActions = [
  {
    title: "New Patient",
    description: "Register new patient",
    icon: UserPlus,
    variant: "default" as const
  },
  {
    title: "Schedule Appointment",
    description: "Book consultation",
    icon: Calendar,
    variant: "secondary" as const
  },
  {
    title: "Add Report",
    description: "Upload lab results",
    icon: FileText,
    variant: "default" as const
  },
  {
    title: "IVF Cycle",
    description: "Start new cycle",
    icon: TestTube,
    variant: "default" as const
  },
  {
    title: "Emergency",
    description: "Urgent consultation",
    icon: Phone,
    variant: "destructive" as const
  },
  {
    title: "Quick Check-in",
    description: "Patient arrived",
    icon: Clock,
    variant: "default" as const
  }
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.title}
                variant={action.variant}
                className="h-auto flex-col p-4 space-y-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs opacity-80">{action.description}</div>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}