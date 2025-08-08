import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react"

const activities = [
  {
    id: 1,
    patient: "Sarah Johnson",
    action: "Completed IVF Consultation",
    time: "2 hours ago",
    status: "completed",
    type: "consultation"
  },
  {
    id: 2,
    patient: "Michael Smith",
    action: "Blood test results uploaded",
    time: "4 hours ago",
    status: "pending",
    type: "lab"
  },
  {
    id: 3,
    patient: "Emily Davis",
    action: "IVF cycle started - Day 1",
    time: "6 hours ago",
    status: "in-progress",
    type: "treatment"
  },
  {
    id: 4,
    patient: "James Wilson",
    action: "Appointment scheduled",
    time: "1 day ago",
    status: "scheduled",
    type: "appointment"
  },
  {
    id: 5,
    patient: "Lisa Brown",
    action: "Embryo transfer completed",
    time: "2 days ago",
    status: "completed",
    type: "procedure"
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-success" />
    case "pending":
      return <Clock className="h-4 w-4 text-warning" />
    case "in-progress":
      return <AlertCircle className="h-4 w-4 text-primary" />
    case "scheduled":
      return <Calendar className="h-4 w-4 text-muted-foreground" />
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge variant="default" className="bg-success text-success-foreground">Completed</Badge>
    case "pending":
      return <Badge variant="secondary" className="bg-warning text-warning-foreground">Pending</Badge>
    case "in-progress":
      return <Badge variant="default" className="bg-primary text-primary-foreground">In Progress</Badge>
    case "scheduled":
      return <Badge variant="outline">Scheduled</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30 transition-smooth hover:bg-muted/50">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {activity.patient.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.patient}</p>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(activity.status)}
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                  {getStatusBadge(activity.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}