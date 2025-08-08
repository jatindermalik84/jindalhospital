import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Building, Plus, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Building {
  id: string
  name: string
  code: string
  address: string
  city: string
  state: string
  pincode: string
  totalFloors: number
  builtUpArea: string
  buildingType: string
  yearBuilt: string
  facilities: string[]
  isActive: boolean
}

const sampleBuildings: Building[] = [
  {
    id: "1",
    name: "Main Medical Building",
    code: "MMB001",
    address: "123 Medical Plaza, Health Sector",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    totalFloors: 5,
    builtUpArea: "50000 sq ft",
    buildingType: "Medical Complex",
    yearBuilt: "2020",
    facilities: ["Parking", "Elevator", "Emergency Exit", "Power Backup"],
    isActive: true
  },
  {
    id: "2",
    name: "Administrative Block",
    code: "ADM001",
    address: "125 Medical Plaza, Health Sector",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    totalFloors: 3,
    builtUpArea: "15000 sq ft",
    buildingType: "Office Building",
    yearBuilt: "2019",
    facilities: ["Parking", "Cafeteria", "Conference Rooms"],
    isActive: true
  }
]

const buildingTypes = ["Medical Complex", "Office Building", "Residential", "Mixed Use", "Laboratory"]
const facilityOptions = ["Parking", "Elevator", "Emergency Exit", "Power Backup", "Cafeteria", "Conference Rooms", "Garden", "Security"]

export function BuildingMaster() {
  const [buildings, setBuildings] = useState<Building[]>(sampleBuildings)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null)
  const [formData, setFormData] = useState<Partial<Building>>({})

  const handleEdit = (building: Building) => {
    setEditingBuilding(building)
    setFormData(building)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingBuilding(null)
    setFormData({ facilities: [] })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingBuilding) {
      setBuildings(buildings.map(b => 
        b.id === editingBuilding.id ? { ...editingBuilding, ...formData } : b
      ))
    } else {
      const newBuilding: Building = {
        id: Date.now().toString(),
        name: "",
        code: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        totalFloors: 1,
        builtUpArea: "",
        buildingType: "",
        yearBuilt: "",
        facilities: [],
        isActive: true,
        ...formData
      }
      setBuildings([...buildings, newBuilding])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setBuildings(buildings.filter(b => b.id !== id))
  }

  const toggleFacility = (facility: string) => {
    const currentFacilities = formData.facilities || []
    const updatedFacilities = currentFacilities.includes(facility)
      ? currentFacilities.filter(f => f !== facility)
      : [...currentFacilities, facility]
    setFormData({ ...formData, facilities: updatedFacilities })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Building Master</h1>
            <p className="text-muted-foreground">Manage building information and facilities</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Building</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBuilding ? "Edit Building" : "Add New Building"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Building Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter building name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Building Code *</Label>
                  <Input
                    id="code"
                    value={formData.code || ""}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Unique building code"
                  />
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
                  <Label htmlFor="buildingType">Building Type *</Label>
                  <Select
                    value={formData.buildingType || ""}
                    onValueChange={(value) => setFormData({ ...formData, buildingType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select building type" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildingTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalFloors">Total Floors *</Label>
                  <Input
                    id="totalFloors"
                    type="number"
                    value={formData.totalFloors || ""}
                    onChange={(e) => setFormData({ ...formData, totalFloors: parseInt(e.target.value) })}
                    placeholder="Number of floors"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="builtUpArea">Built-up Area</Label>
                  <Input
                    id="builtUpArea"
                    value={formData.builtUpArea || ""}
                    onChange={(e) => setFormData({ ...formData, builtUpArea: e.target.value })}
                    placeholder="e.g., 5000 sq ft"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearBuilt">Year Built</Label>
                  <Input
                    id="yearBuilt"
                    value={formData.yearBuilt || ""}
                    onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                    placeholder="Year of construction"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Facilities</Label>
                <div className="grid grid-cols-3 gap-2">
                  {facilityOptions.map((facility) => (
                    <div key={facility} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={facility}
                        checked={(formData.facilities || []).includes(facility)}
                        onChange={() => toggleFacility(facility)}
                        className="rounded border-border"
                      />
                      <Label htmlFor={facility} className="text-sm cursor-pointer">
                        {facility}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingBuilding ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Buildings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Buildings List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Building Details</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Specifications</TableHead>
                <TableHead>Facilities</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buildings.map((building) => (
                <TableRow key={building.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{building.name}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {building.code}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {building.buildingType}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{building.city}, {building.state}</div>
                      <div className="text-muted-foreground">{building.pincode}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{building.totalFloors} floors</div>
                      <div className="text-muted-foreground">{building.builtUpArea}</div>
                      {building.yearBuilt && (
                        <div className="text-muted-foreground">Built: {building.yearBuilt}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {building.facilities.slice(0, 3).map((facility) => (
                        <Badge key={facility} variant="outline" className="text-xs">
                          {facility}
                        </Badge>
                      ))}
                      {building.facilities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{building.facilities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={building.isActive ? "default" : "secondary"}>
                      {building.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(building)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(building.id)}
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