"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { CheckCircle, Clock, Eye, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner" // Changed from @/components/ui/use-toast to sonner

// Define the outing type
interface Outing {
  _id: string
  purpose: string
  fatherNumber: string
  outingDate: string
  outingTime: string
  returnTime: string
  name: string
  rollno: string
  mobile: string
  email: string
  fathername: string
  father_mobile: string
  room_no: string
  branch: string
  startyear: string
  status: "pending" | "approved"
  requestDate: string
}


export default function CheckOutings() {
  const [outings, setOutings] = useState<Outing[]>([])
  const [selectedOuting, setSelectedOuting] = useState<Outing | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Filter outings based on status
  const filteredOutings = statusFilter === "all" ? outings : outings.filter((outing) => outing.status === statusFilter)
  useEffect(() => {
      getRequestDetails()
  })
  async function getRequestDetails() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/outings-api/get-outings`)
      setOutings(response.data.data)
    } catch (error) {
      console.error("Error fetching outings:", error)
    }
  }

  // Handle approve outing
  const handleApprove = async (outingId: string) => {
    // Update the outing status
    const updatedOutings = outings.map((outing) =>
      outing._id === outingId ? { ...outing, status: "approved" as const } : outing,
    )

    const result = await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/outings-api/update-outing/${outingId}`)

    if (!result.data.success) {
      toast.error(result.data.message)
      return
    }


    // Find the approved outing for console log
    const approvedOuting = updatedOutings.find((outing) => outing._id === outingId)

    // Log the approved outing data
    console.log("Approved Outing:", approvedOuting)

    // Update state
    setOutings(updatedOutings)

    // If the selected outing is the one being approved, update it
    if (selectedOuting && selectedOuting._id === outingId) {
      setSelectedOuting({ ...selectedOuting, status: "approved" })
    }


    // Show success toast using Sonner instead of the previous toast implementation
    toast.success("Outing Approved", {
      description: `You have approved the outing request for ${approvedOuting?.name}.`,
    })
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP")
    } catch (error) {
      return dateString
    }
  }

  // View outing details
  const viewOutingDetails = (outing: Outing) => {
    setSelectedOuting(outing)
    setDetailsOpen(true)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Student Outing Requests</CardTitle>
              <CardDescription>Manage and approve student outing requests</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Outing Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOutings.length > 0 ? (
                  filteredOutings.map((outing) => (
                    <TableRow key={outing._id}>
                      <TableCell className="font-medium">{outing.name}</TableCell>
                      <TableCell>{outing.rollno}</TableCell>
                      <TableCell>{formatDate(outing.outingDate)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            outing.status === "pending"
                              ? "bg-amber-500 hover:bg-amber-600"
                              : outing.status === "approved"
                                ? "bg-emerald-500 hover:bg-emerald-600"
                                : "bg-slate-500 hover:bg-slate-600"
                          }
                        >
                          {outing.status.charAt(0).toUpperCase() + outing.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => viewOutingDetails(outing)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApprove(outing._id)}
                            disabled={outing.status !== "pending"}
                            className={outing.status === "pending" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No outing requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Outing Details Dialog */}
      {selectedOuting && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Outing Request Details</DialogTitle>
              <DialogDescription>Complete information about the student's outing request</DialogDescription>
            </DialogHeader>

            <div className="grid gap-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{selectedOuting.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedOuting.rollno} • {selectedOuting.branch}
                  </p>
                </div>
                <Badge
                  className={
                    selectedOuting.status === "pending"
                      ? "bg-amber-500 hover:bg-amber-600"
                      : selectedOuting.status === "approved"
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : "bg-slate-500 hover:bg-slate-600"
                  }
                >
                  {selectedOuting.status.charAt(0).toUpperCase() + selectedOuting.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Contact Information</h4>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm">Email: {selectedOuting.email}</p>
                    <p className="text-sm">Mobile: {selectedOuting.mobile}</p>
                    <p className="text-sm">Room No: {selectedOuting.room_no}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Parent Information</h4>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm">Father: {selectedOuting.fathername}</p>
                    <p className="text-sm">Father's Mobile: {selectedOuting.father_mobile}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Outing Details</h4>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      {formatDate(selectedOuting.outingDate)} • {selectedOuting.outingTime} to{" "}
                      {selectedOuting.returnTime}
                    </p>
                  </div>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Purpose</h4>
                    <p className="text-sm mt-1 p-3 bg-muted rounded-md">{selectedOuting.purpose}</p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Request submitted on {formatDate(selectedOuting.requestDate)}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
              <Button
                onClick={() => handleApprove(selectedOuting._id)}
                disabled={selectedOuting.status !== "pending"}
                className={selectedOuting.status === "pending" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}