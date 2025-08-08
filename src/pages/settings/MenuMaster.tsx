import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Menu, Plus, Edit, Trash2, ChevronRight, ArrowUp, ArrowDown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface MenuItem {
  id: string
  name: string
  path: string
  icon: string
  parentId?: string
  order: number
  isActive: boolean
  roles: string[]
  children?: MenuItem[]
}

const sampleMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Dashboard",
    path: "/",
    icon: "BarChart3",
    order: 1,
    isActive: true,
    roles: ["admin", "doctor", "nurse"]
  },
  {
    id: "2",
    name: "Patient Care",
    path: "",
    icon: "Heart",
    order: 2,
    isActive: true,
    roles: ["admin", "doctor", "nurse"],
    children: [
      {
        id: "2-1",
        name: "Appointments",
        path: "/appointments",
        icon: "Calendar",
        parentId: "2",
        order: 1,
        isActive: true,
        roles: ["admin", "doctor", "nurse"]
      },
      {
        id: "2-2",
        name: "Patients",
        path: "/patients",
        icon: "Users",
        parentId: "2",
        order: 2,
        isActive: true,
        roles: ["admin", "doctor", "nurse"]
      }
    ]
  },
  {
    id: "3",
    name: "Settings",
    path: "/settings",
    icon: "Settings",
    order: 10,
    isActive: true,
    roles: ["admin"]
  }
]

const availableIcons = [
  "BarChart3", "Heart", "Calendar", "Users", "Settings", "Building", "Shield", 
  "UserCheck", "FileText", "DollarSign", "Activity", "Baby", "Stethoscope"
]

const availableRoles = ["admin", "doctor", "nurse", "receptionist", "lab_technician"]

export function MenuMaster() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(sampleMenuItems)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState<Partial<MenuItem>>({})

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData(item)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({ roles: [], order: 1, isActive: true })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingItem) {
      const updateItems = (items: MenuItem[]): MenuItem[] => {
        return items.map(item => {
          if (item.id === editingItem.id) {
            return { ...item, ...formData }
          }
          if (item.children) {
            return { ...item, children: updateItems(item.children) }
          }
          return item
        })
      }
      setMenuItems(updateItems(menuItems))
    } else {
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name: "",
        path: "",
        icon: "Menu",
        order: 1,
        isActive: true,
        roles: [],
        ...formData
      }
      
      if (formData.parentId) {
        const updateItems = (items: MenuItem[]): MenuItem[] => {
          return items.map(item => {
            if (item.id === formData.parentId) {
              return {
                ...item,
                children: [...(item.children || []), newItem]
              }
            }
            if (item.children) {
              return { ...item, children: updateItems(item.children) }
            }
            return item
          })
        }
        setMenuItems(updateItems(menuItems))
      } else {
        setMenuItems([...menuItems, newItem])
      }
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    const deleteItem = (items: MenuItem[]): MenuItem[] => {
      return items.filter(item => {
        if (item.id === id) return false
        if (item.children) {
          item.children = deleteItem(item.children)
        }
        return true
      })
    }
    setMenuItems(deleteItem(menuItems))
  }

  const toggleRole = (role: string) => {
    const currentRoles = formData.roles || []
    const updatedRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role]
    setFormData({ ...formData, roles: updatedRoles })
  }

  const renderMenuTree = (items: MenuItem[], level = 0) => {
    return items.map((item) => (
      <div key={item.id}>
        <TableRow>
          <TableCell>
            <div className="flex items-center space-x-2" style={{ paddingLeft: `${level * 20}px` }}>
              {level > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground font-mono">
                  {item.path || "No path"}
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              <div className="text-sm">{item.icon}</div>
              <Badge variant="outline" className="text-xs">
                Order: {item.order}
              </Badge>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex flex-wrap gap-1">
              {item.roles.map((role) => (
                <Badge key={role} variant="secondary" className="text-xs">
                  {role}
                </Badge>
              ))}
            </div>
          </TableCell>
          <TableCell>
            <Badge variant={item.isActive ? "default" : "secondary"}>
              {item.isActive ? "Active" : "Inactive"}
            </Badge>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(item)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {item.children && renderMenuTree(item.children, level + 1)}
      </div>
    ))
  }

  const getParentOptions = () => {
    const getOptions = (items: MenuItem[], level = 0): { value: string; label: string }[] => {
      return items.flatMap(item => [
        { value: item.id, label: `${"  ".repeat(level)}${item.name}` },
        ...(item.children ? getOptions(item.children, level + 1) : [])
      ])
    }
    return getOptions(menuItems)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Menu className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Menu Master</h1>
            <p className="text-muted-foreground">Configure application navigation and menus</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Menu Item</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Menu Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter menu name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="path">Path</Label>
                  <Input
                    id="path"
                    value={formData.path || ""}
                    onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                    placeholder="/path (leave empty for parent menu)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select
                    value={formData.icon || ""}
                    onValueChange={(value) => setFormData({ ...formData, icon: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableIcons.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order || ""}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    placeholder="Display order"
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentId">Parent Menu (Optional)</Label>
                <Select
                  value={formData.parentId || ""}
                  onValueChange={(value) => setFormData({ ...formData, parentId: value || undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent menu (for submenu)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Parent (Top Level)</SelectItem>
                    {getParentOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Accessible to Roles</Label>
                <div className="grid grid-cols-3 gap-2">
                  {availableRoles.map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={role}
                        checked={(formData.roles || []).includes(role)}
                        onChange={() => toggleRole(role)}
                        className="rounded border-border"
                      />
                      <Label htmlFor={role} className="text-sm cursor-pointer capitalize">
                        {role.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingItem ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Menu Tree Table */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Menu Name & Path</TableHead>
                <TableHead>Icon & Order</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderMenuTree(menuItems)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}