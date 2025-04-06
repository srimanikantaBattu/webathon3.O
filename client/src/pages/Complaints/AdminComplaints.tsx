"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, AlertCircle, Clock, MapPin, FileText, Tag } from "lucide-react"

interface Complaint {
  _id: string
  imageName: string
  title: string
  description: string
  location: string
  category: string
  urgency: string
  status: string
  imageUrl: string
}

function AdminComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("pending")

  // Fix the infinite re-render by adding an empty dependency array
  useEffect(() => {
    getDetails()
  }, [])

  async function getDetails() {
    try {
      setLoading(true)
      const result = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/complaints-api/files`)
      setComplaints(result.data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch complaints. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function approveComplaint(id: string) {
    try {
      const result = await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/complaints-api/update/${id}`)
      console.log(result.data)

      if (!result.data.success) {
        throw new Error(result.data.message)
      }

      // Update local state to reflect the change
      setComplaints(
        complaints.map((complaint) => (complaint._id === id ? { ...complaint, status: "approved" } : complaint)),
      )
    } catch (err) {
      setError("Failed to approve complaint. Please try again.")
      console.error(err)
    }
  }

  // Filter complaints based on active tab
  const filteredComplaints = complaints.filter((complaint) => complaint.status === activeTab)

  // Get urgency color
  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "high":
        return "destructive"
      case "medium":
        return "outline"
      case "low":
        return "default"
      default:
        return "default"
    }
  }

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Complaints Management</h1>

      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="pending">
            Pending
            <Badge variant="secondary" className="ml-2">
              {complaints.filter((c) => c.status === "pending").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved
            <Badge variant="secondary" className="ml-2">
              {complaints.filter((c) => c.status === "approved").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected
            <Badge variant="secondary" className="ml-2">
              {complaints.filter((c) => c.status === "rejected").length}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredComplaints.length === 0 ? (
        <Alert className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No complaints</AlertTitle>
          <AlertDescription>There are no {activeTab} complaints at the moment.</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint._id} className="overflow-hidden">
              {complaint.imageName && (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={complaint.imageUrl}
                    alt={complaint.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=400"
                    }}
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{complaint.title}</CardTitle>
                  <Badge variant={getUrgencyColor(complaint.urgency)} className="capitalize">
                    {complaint.urgency}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" />
                  <span className="capitalize">{complaint.category}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <p className="text-sm">{complaint.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{complaint.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Status: <span className="capitalize">{complaint.status}</span>
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                {complaint.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Implement reject functionality if needed
                        setComplaints(
                          complaints.map((c) => (c._id === complaint._id ? { ...c, status: "rejected" } : c)),
                        )
                      }}
                    >
                      Reject
                    </Button>
                    <Button onClick={() => approveComplaint(complaint._id)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Complaints Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-[200px] w-full" />
            <CardHeader>
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/3 mt-2" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AdminComplaints