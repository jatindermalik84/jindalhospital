import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Plus, Edit, Trash2, Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface StaffType {
  id: string
  name: string
  code: string
  description: string
  category: string
  qualificationRequired: string[]
  responsibilities: string[]
  reportingTo?: string
  salaryRange: {
    min: number
    max: number
  }
  isActive: boolean
  staffCount: number
}

const staffCategories = ["Medical", "Administrative", "Technical", "Support", "Management"]
const qualificationOptions = [
  "MBBS", "MD", "MS", "Diploma", "BSc Nursing", "MSc Nursing", "B.Pharm", "M.Pharm",
  "BCA", "MCA", "MBA", "B.Com", "M.Com", "Certification Course", "Experience Based"
]

const sampleStaffTypes: StaffType[] = [
  {
    id: "1",
    name: "Senior Consultant",
    code: "SC001",
    description: "Senior medical consultant specializing in reproductive medicine",
    category: "Medical",
    qualificationRequired: ["MBBS", "MD"],
    responsibilities: ["Patient Consultation", "Treatment Planning", "Surgery", "Team Leadership"],
    reportingTo: "Medical Director",
    salaryRange: { min: 80000, max: 150000 },
    isActive: true,
    staffCount: 3
  },
  {
    id: "2",
    name: "Staff Nurse",
    code: "SN001",
    description: "Registered nurse providing patient care and support",
    category: "Medical",
    qualificationRequired: ["BSc Nursing"],
    responsibilities: ["Patient Care", "Medication Administration", "Patient Education", "Documentation"],
    reportingTo: "Nursing Supervisor",
    salaryRange: { min: 25000, max: 40000 },
    isActive: true,
    staffCount: 8
  },
  {
    id: "3",
    name: "Lab Technician",
    code: "LT001",
    description: "Laboratory technician for sample processing and testing",
    category: "Technical",
    qualificationRequired: ["Diploma", "B.Pharm"],
    responsibilities: ["Sample Collection", "Lab Testing", "Report Generation", "Equipment Maintenance"],
    reportingTo: "Lab Supervisor",
    salaryRange: { min: 20000, max: 35000 },
    isActive: true,
    staffCount: 4
  },
  {
    id: "4",
    name: "Receptionist",
    code: "RC001",
    description: "Front desk receptionist handling patient appointments and inquiries",
    category: "Administrative",
    qualificationRequired: ["B.Com", "Experience Based"],
    responsibilities: ["Appointment Scheduling", "Patient Registration", "Phone Handling", "File Management"],
    reportingTo: "Administrative Manager",
    salaryRange: { min: 15000, max: 25000 },
    isActive: true,
    staffCount: 2
  }
]

export function StaffTypeMaster() {
  const [staffTypes, setStaffTypes] = useState<StaffType[]>(sampleStaffTypes)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStaffType, setEditingStaffType] = useState<StaffType | null>(null)
  const [formData, setFormData] = useState<Partial<StaffType>>({})

  const handleEdit = (staffType: StaffType) => {
    setEditingStaffType(staffType)
    setFormData(staffType)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingStaffType(null)
    setFormData({
      qualificationRequired: [],
      responsibilities: [],
      salaryRange: { min: 0, max: 0 },
      isActive: true,
      staffCount: 0
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingStaffType) {
      setStaffTypes(staffTypes.map(st => 
        st.id === editingStaffType.id ? { ...editingStaffType, ...formData } : st
      ))
    } else {
      const newStaffType: StaffType = {
        id: Date.now().toString(),
        name: "",
        code: "",
        description: "",
        category: "",
        qualificationRequired: [],
        responsibilities: [],
        salaryRange: { min: 0, max: 0 },
        isActive: true,
        staffCount: 0,
        ...formData
      }
      setStaffTypes([...staffTypes, newStaffType])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setStaffTypes(staffTypes.filter(st => st.id !== id))
  }

  const toggleQualification = (qualification: string) => {
    const current = formData.qualificationRequired || []
    const updated = current.includes(qualification)
      ? current.filter(q => q !== qualification)
      : [...current, qualification]
    setFormData({ ...formData, qualificationRequired: updated })
  }

  const addResponsibility = () => {
    const responsibilities = formData.responsibilities || []
    setFormData({ 
      ...formData, 
      responsibilities: [...responsibilities, ""] 
    })
  }

  const updateResponsibility = (index: number, value: string) => {
    const responsibilities = [...(formData.responsibilities || [])]
    responsibilities[index] = value
    setFormData({ ...formData, responsibilities })
  }

  const removeResponsibility = (index: number) => {
    const responsibilities = formData.responsibilities?.filter((_, i) => i !== index) || []
    setFormData({ ...formData, responsibilities })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UserCheck className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Staff Type Master</h1>
            <p className="text-muted-foreground">Define staff categories and job specifications</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Staff Type</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingStaffType ? "Edit Staff Type" : "Add New Staff Type"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Staff Type Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter staff type name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Staff Type Code *</Label>
                  <Input
                    id="code"
                    value={formData.code || ""}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="ST001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category || ""}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportingTo">Reporting To</Label>
                  <Input
                    id="reportingTo"
                    value={formData.reportingTo || ""}
                    onChange={(e) => setFormData({ ...formData, reportingTo: e.target.value })}
                    placeholder="Supervisor/Manager title"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Job description and overview"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Required Qualifications</Label>
                <div className="grid grid-cols-3 gap-2">
                  {qualificationOptions.map((qualification) => (
                    <div key={qualification} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={qualification}
                        checked={(formData.qualificationRequired || []).includes(qualification)}
                        onChange={() => toggleQualification(qualification)}
                        className="rounded border-border"
                      />
                      <Label htmlFor={qualification} className="text-sm cursor-pointer">
                        {qualification}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Key Responsibilities</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addResponsibility}
                  >
                    Add Responsibility
                  </Button>
                </div>
                <div className="space-y-2">
                  {(formData.responsibilities || []).map((responsibility, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={responsibility}
                        onChange={(e) => updateResponsibility(index, e.target.value)}
                        placeholder="Enter responsibility"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeResponsibility(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minSalary">Minimum Salary (₹)</Label>
                  <Input
                    id="minSalary"
                    type="number"
                    value={formData.salaryRange?.min || ""}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      salaryRange: { 
                        ...formData.salaryRange, 
                        min: parseInt(e.target.value) || 0,
                        max: formData.salaryRange?.max || 0
                      } 
                    })}
                    placeholder="Minimum salary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxSalary">Maximum Salary (₹)</Label>
                  <Input
                    id="maxSalary"
                    type="number"
                    value={formData.salaryRange?.max || ""}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      salaryRange: { 
                        ...formData.salaryRange, 
                        min: formData.salaryRange?.min || 0,
                        max: parseInt(e.target.value) || 0
                      } 
                    })}
                    placeholder="Maximum salary"
                  />
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
                  {editingStaffType ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Staff Types Table */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Type Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Qualifications</TableHead>
                <TableHead>Salary Range</TableHead>
                <TableHead>Staff Count</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffTypes.map((staffType) => (
                <TableRow key={staffType.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{staffType.name}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {staffType.code}
                      </div>
                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                        {staffType.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {staffType.category}
                    </Badge>
                    {staffType.reportingTo && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Reports to: {staffType.reportingTo}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {staffType.qualificationRequired.slice(0, 2).map((qual) => (
                        <Badge key={qual} variant="secondary" className="text-xs">
                          {qual}
                        </Badge>
                      ))}
                      {staffType.qualificationRequired.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{staffType.qualificationRequired.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>₹{staffType.salaryRange.min.toLocaleString()}</div>
                      <div className="text-muted-foreground">to ₹{staffType.salaryRange.max.toLocaleString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="text-lg font-medium flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{staffType.staffCount}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={staffType.isActive ? "default" : "secondary"}>
                      {staffType.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(staffType)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(staffType.id)}
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