import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Building, Plus, Edit, Trash2, MapPin } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface Branch {
  id: string
  name: string
  code: string
  companyId: string
  buildingId: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  managerName: string
  managerPhone: string
  operatingHours: string
  services: string[]
  isMainBranch: boolean
  isActive: boolean
}

const sampleBranches: Branch[] = [
  {
    id: "1",
    name: "Jindal IVF Main Branch",
    code: "JIM001",
    companyId: "1",
    buildingId: "1",
    address: "123 Medical Plaza, Health Sector",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    phone: "+91-11-12345678",
    email: "main@jindalivf.com",
    managerName: "Dr. Rajesh Kumar",
    managerPhone: "+91-9876543210",
    operatingHours: "Mon-Sat: 9:00 AM - 6:00 PM",
    services: ["IVF Treatment", "Consultation", "Lab Tests", "Surgery"],
    isMainBranch: true,
    isActive: true
  },
  {
    id: "2",
    name: "Jindal IVF Satellite Centre",
    code: "JIS001",
    companyId: "1",
    buildingId: "2",
    address: "456 Health Plaza, Medical District",
    city: "Gurgaon",
    state: "Haryana",
    pincode: "122001",
    phone: "+91-124-1234567",
    email: "satellite@jindalivf.com",
    managerName: "Dr. Priya Sharma",
    managerPhone: "+91-9876543211",
    operatingHours: "Mon-Sat: 10:00 AM - 5:00 PM",
    services: ["Consultation", "Lab Tests", "Basic Treatment"],
    isMainBranch: false,
    isActive: true
  }
]

const availableServices = ["IVF Treatment", "ICSI", "IUI", "Consultation", "Lab Tests", "Surgery", "Counseling", "Pharmacy"]

export function BranchMaster() {
  const [branches, setBranches] = useState<Branch[]>(sampleBranches)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [formData, setFormData] = useState<Partial<Branch>>({})

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch)
    setFormData(branch)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingBranch(null)
    setFormData({ services: [], isMainBranch: false, isActive: true })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingBranch) {
      setBranches(branches.map(b => 
        b.id === editingBranch.id ? { ...editingBranch, ...formData } : b
      ))
    } else {
      const newBranch: Branch = {
        id: Date.now().toString(),
        name: "",
        code: "",
        companyId: "",
        buildingId: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        email: "",
        managerName: "",
        managerPhone: "",
        operatingHours: "",
        services: [],
        isMainBranch: false,
        isActive: true,
        ...formData
      }
      setBranches([...branches, newBranch])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setBranches(branches.filter(b => b.id !== id))
  }

  const toggleService = (service: string) => {
    const currentServices = formData.services || []
    const updatedServices = currentServices.includes(service)
      ? currentServices.filter(s => s !== service)
      : [...currentServices, service]
    setFormData({ ...formData, services: updatedServices })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Branch Master</h1>
            <p className="text-muted-foreground">Manage branch locations and operations</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Branch</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBranch ? "Edit Branch" : "Add New Branch"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Branch Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter branch name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Branch Code *</Label>
                  <Input
                    id="code"
                    value={formData.code || ""}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Unique branch code"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyId">Company</Label>
                  <Select
                    value={formData.companyId || ""}
                    onValueChange={(value) => setFormData({ ...formData, companyId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Jindal IVF Centre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buildingId">Building</Label>
                  <Select
                    value={formData.buildingId || ""}
                    onValueChange={(value) => setFormData({ ...formData, buildingId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select building" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Main Medical Building</SelectItem>
                      <SelectItem value="2">Administrative Block</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Complete address"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city || ""}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state || ""}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode || ""}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="Pincode"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Branch phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Branch email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="managerName">Branch Manager *</Label>
                  <Input
                    id="managerName"
                    value={formData.managerName || ""}
                    onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    placeholder="Manager name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managerPhone">Manager Phone</Label>
                  <Input
                    id="managerPhone"
                    value={formData.managerPhone || ""}
                    onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })}
                    placeholder="Manager phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="operatingHours">Operating Hours</Label>
                <Input
                  id="operatingHours"
                  value={formData.operatingHours || ""}
                  onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                  placeholder="e.g., Mon-Sat: 9:00 AM - 6:00 PM"
                />
              </div>

              <div className="space-y-2">
                <Label>Services Offered</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableServices.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={service}
                        checked={(formData.services || []).includes(service)}
                        onChange={() => toggleService(service)}
                        className="rounded border-border"
                      />
                      <Label htmlFor={service} className="text-sm cursor-pointer">
                        {service}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isMainBranch"
                  checked={formData.isMainBranch || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, isMainBranch: checked })}
                />
                <Label htmlFor="isMainBranch">Main Branch</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingBranch ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Branches Table */}
      <Card>
        <CardHeader>
          <CardTitle>Branch Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch Details</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center space-x-2">
                        {branch.name}
                        {branch.isMainBranch && (
                          <Badge variant="default" className="text-xs">
                            Main
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {branch.code}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {branch.operatingHours}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{branch.city}, {branch.state}</span>
                      </div>
                      <div className="text-muted-foreground">{branch.phone}</div>
                      <div className="text-muted-foreground">{branch.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{branch.managerName}</div>
                      <div className="text-muted-foreground">{branch.managerPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {branch.services.slice(0, 2).map((service) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {branch.services.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{branch.services.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={branch.isMainBranch ? "default" : "secondary"}>
                      {branch.isMainBranch ? "Main Branch" : "Satellite"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={branch.isActive ? "default" : "secondary"}>
                      {branch.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(branch)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(branch.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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