import { useState } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Building, 
  Building2, 
  Users, 
  Menu, 
  Shield, 
  UserCheck, 
  Settings as SettingsIcon,
  UserPlus,
  KeyRound,
  UserCog
} from "lucide-react"

const adminMenuItems = [
  { 
    title: "Company Master", 
    url: "/settings/company", 
    icon: Building2,
    description: "Manage company information"
  },
  { 
    title: "Building Master", 
    url: "/settings/buildings", 
    icon: Building,
    description: "Manage building information"
  },
  { 
    title: "Branch Master", 
    url: "/settings/branches", 
    icon: Building,
    description: "Manage branch locations"
  },
  { 
    title: "Menu Master", 
    url: "/settings/menus", 
    icon: Menu,
    description: "Configure application menus"
  },
  { 
    title: "Role Master", 
    url: "/settings/roles", 
    icon: Shield,
    description: "Define user roles"
  },
  { 
    title: "Staff Type Master", 
    url: "/settings/staff-types", 
    icon: UserCheck,
    description: "Define staff categories"
  },
  { 
    title: "Staff Master", 
    url: "/settings/staff", 
    icon: Users,
    description: "Manage staff information"
  },
  { 
    title: "Role Assignment", 
    url: "/settings/role-assignment", 
    icon: UserCog,
    description: "Assign roles to users"
  },
  { 
    title: "Guest Type Master", 
    url: "/settings/guest-types", 
    icon: UserPlus,
    description: "Manage guest user types"
  }
]

export function Settings() {
  const location = useLocation()
  const isMainSettings = location.pathname === "/settings"

  if (!isMainSettings) {
    return <Outlet />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg p-6 bg-primary text-primary-foreground">
        <div className="flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">System Settings</h1>
            <p>Configure and manage system components</p>
          </div>
        </div>
      </div>

      {/* Admin Settings Grid */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Master Data Management</h2>
          <p className="text-muted-foreground">Configure foundational data and system settings</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {adminMenuItems.map((item) => (
            <NavLink key={item.url} to={item.url}>
              <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border-2 hover:border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base group-hover:text-primary transition-colors">
                          {item.title}
                        </CardTitle>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs text-primary">
                      Admin
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}