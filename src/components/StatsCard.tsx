import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "success" | "warning" | "primary"
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  variant = "default" 
}: StatsCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-success/20 bg-success/5"
      case "warning":  
        return "border-warning/20 bg-warning/5"
      case "primary":
        return "border-primary/20 bg-primary/5"
      default:
        return "border-border bg-card"
    }
  }

  const getIconStyles = () => {
    switch (variant) {
      case "success":
        return "text-success"
      case "warning":
        return "text-warning" 
      case "primary":
        return "text-primary"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card className={`transition-smooth hover:shadow-brand ${getVariantStyles()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${getIconStyles()}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div className="flex items-center space-x-1 text-xs">
            <span className={trend.isPositive ? "text-success" : "text-destructive"}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
            <span className="text-muted-foreground">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}