import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Shield, Plus, Edit, Trash2, Key } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

interface Permission {
  module: string
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
}

interface Role {
  id: string
  name: string
  code: string
  description: string
  permissions: Permission[]
  isSystemRole: boolean
  isActive: boolean
  userCount: number
}

const systemModules = [
  "Dashboard", "Appointments", "Patients", "Treatments", "Lab Reports", 
  "Staff", "Billing", "Inventory", "Analytics", "Settings"
]

const sampleRoles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    code: "SUPER_ADMIN",
    description: "Full system access with all permissions",
    permissions: systemModules.map(module => ({
      module,
      create: true,
      read: true,
      update: true,
      delete: true
    })),
    isSystemRole: true,
    isActive: true,
    userCount: 1
  },
  {
    id: "2",
    name: "Doctor",
    code: "DOCTOR",
    description: "Medical professional with patient care access",
    permissions: [
      { module: "Dashboard", create: false, read: true, update: false, delete: false },
      { module: "Appointments", create: true, read: true, update: true, delete: false },
      { module: "Patients", create: true, read: true, update: true, delete: false },
      { module: "Treatments", create: true, read: true, update: true, delete: false },
      { module: "Lab Reports", create: true, read: true, update: true, delete: false }
    ],
    isSystemRole: false,
    isActive: true,
    userCount: 5
  },
  {
    id: "3",
    name: "Nurse",
    code: "NURSE",
    description: "Nursing staff with patient support access",
    permissions: [
      { module: "Dashboard", create: false, read: true, update: false, delete: false },
      { module: "Appointments", create: false, read: true, update: true, delete: false },
      { module: "Patients", create: false, read: true, update: true, delete: false },
      { module: "Treatments", create: false, read: true, update: false, delete: false }
    ],
    isSystemRole: false,
    isActive: true,
    userCount: 8
  }
]

export function RoleMaster() {
  const [roles, setRoles] = useState<Role[]>(sampleRoles)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState<Partial<Role>>({})

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setFormData(role)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingRole(null)
    setFormData({
      permissions: systemModules.map(module => ({
        module,
        create: false,
        read: false,
        update: false,
        delete: false
      })),
      isSystemRole: false,
      isActive: true,
      userCount: 0
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingRole) {
      setRoles(roles.map(r => 
        r.id === editingRole.id ? { ...editingRole, ...formData } : r
      ))
    } else {
      const newRole: Role = {
        id: Date.now().toString(),
        name: "",
        code: "",
        description: "",
        permissions: [],
        isSystemRole: false,
        isActive: true,
        userCount: 0,
        ...formData
      }
      setRoles([...roles, newRole])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setRoles(roles.filter(r => r.id !== id))
  }

  const updatePermission = (moduleIndex: number, field: keyof Permission, value: boolean) => {
    const updatedPermissions = [...(formData.permissions || [])]
    updatedPermissions[moduleIndex] = {
      ...updatedPermissions[moduleIndex],
      [field]: value
    }
    setFormData({ ...formData, permissions: updatedPermissions })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Role Master</h1>
            <p className="text-muted-foreground">Define user roles and permissions</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Role</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRole ? "Edit Role" : "Add New Role"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Role Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter role name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Role Code *</Label>
                  <Input
                    id="code"
                    value={formData.code || ""}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="ROLE_CODE"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Role description and responsibilities"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Module Permissions</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isSystemRole"
                      checked={formData.isSystemRole || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, isSystemRole: checked })}
                    />
                    <Label htmlFor="isSystemRole">System Role</Label>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-40">Module</TableHead>
                        <TableHead className="text-center w-20">Create</TableHead>
                        <TableHead className="text-center w-20">Read</TableHead>
                        <TableHead className="text-center w-20">Update</TableHead>
                        <TableHead className="text-center w-20">Delete</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {systemModules.map((module, index) => {
                        const permission = formData.permissions?.[index] || {
                          module,
                          create: false,
                          read: false,
                          update: false,
                          delete: false
                        }
                        return (
                          <TableRow key={module}>
                            <TableCell className="font-medium">{module}</TableCell>
                            <TableCell className="text-center">
                              <input
                                type="checkbox"
                                checked={permission.create}
                                onChange={(e) => updatePermission(index, 'create', e.target.checked)}
                                className="rounded border-border"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <input
                                type="checkbox"
                                checked={permission.read}
                                onChange={(e) => updatePermission(index, 'read', e.target.checked)}
                                className="rounded border-border"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <input
                                type="checkbox"
                                checked={permission.update}
                                onChange={(e) => updatePermission(index, 'update', e.target.checked)}
                                className="rounded border-border"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <input
                                type="checkbox"
                                checked={permission.delete}
                                onChange={(e) => updatePermission(index, 'delete', e.target.checked)}
                                className="rounded border-border"
                              />
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingRole ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Details</TableHead>
                <TableHead>Permissions Summary</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{role.name}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {role.code}
                      </div>
                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                        {role.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">Modules:</span> {role.permissions.length}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((permission) => (
                          <Badge key={permission.module} variant="outline" className="text-xs">
                            {permission.module}
                          </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="text-lg font-medium">{role.userCount}</div>
                      <div className="text-xs text-muted-foreground">users</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.isSystemRole ? "default" : "secondary"}>
                      {role.isSystemRole ? "System" : "Custom"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.isActive ? "default" : "secondary"}>
                      {role.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(role)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!role.isSystemRole && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(role.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}