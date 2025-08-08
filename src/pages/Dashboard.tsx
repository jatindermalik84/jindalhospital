import { StatsCard } from "@/components/StatsCard"
import { QuickActions } from "@/components/QuickActions"
import { RecentActivity } from "@/components/RecentActivity"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  Calendar, 
  Baby, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Heart
} from "lucide-react"

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg p-6 bg-primary text-primary-foreground">
        <div className="flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome to JINDAL IVF</h1>
            <p>The Joy of Parenthood - Dashboard Overview</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Patients"
          value="1,247"
          description="Active patients"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <StatsCard
          title="Today's Appointments"
          value="23"
          description="Scheduled consultations"
          icon={Calendar}
          trend={{ value: 8, isPositive: true }}
          variant="success"
        />
        <StatsCard
          title="Active IVF Cycles"
          value="45"
          description="Ongoing treatments"
          icon={Baby}
          trend={{ value: 5, isPositive: true }}
          variant="warning"
        />
        <StatsCard
          title="Success Rate"
          value="68%"
          description="This quarter"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
          variant="success"
        />
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <QuickActions />
        <RecentActivity />
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Today's Schedule</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: "09:00", patient: "Sarah Johnson", type: "IVF Consultation", status: "confirmed" },
              { time: "10:30", patient: "Michael Smith", type: "Blood Test Review", status: "waiting" },
              { time: "11:45", patient: "Emily Davis", type: "Embryo Transfer", status: "in-progress" },
              { time: "14:00", patient: "James Wilson", type: "First Consultation", status: "confirmed" },
              { time: "15:30", patient: "Lisa Brown", type: "Ultrasound Scan", status: "confirmed" },
            ].map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium w-16">{appointment.time}</div>
                  <div>
                    <p className="font-medium">{appointment.patient}</p>
                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {appointment.status === "confirmed" && (
                    <CheckCircle className="h-4 w-4 text-success" />
                  )}
                  {appointment.status === "waiting" && (
                    <Clock className="h-4 w-4 text-warning" />
                  )}
                  {appointment.status === "in-progress" && (
                    <AlertTriangle className="h-4 w-4 text-primary" />
                  )}
                  <span className="text-sm capitalize">{appointment.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}