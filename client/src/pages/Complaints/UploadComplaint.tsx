"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { Toaster, toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, FileImage, Loader2, MapPin, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

function UploadComplaint() {
  const [file, setFile] = useState<File | null>(null)
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [complaint, setComplaint] = useState({
    title: "",
    description: "",
    location: "",
    category: "general",
    urgency: "medium",
  })

  // Create a ref for the file input
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch existing complaints
  async function getFiles() {
    setLoading(true)
    try {
      const result = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/complaints-api/files`)
      setFiles(result.data)
    } catch (error) {
      toast.error("Failed to load existing complaints")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getFiles()
  }, [])

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setComplaint((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select field changes
  const handleSelectChange = (name: string, value: string) => {
    setComplaint((prev) => ({ ...prev, [name]: value }))
  }

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Submit complaint
  async function handleUpload() {
    if (!file) {
      toast.error("Please select an image for your complaint")
      return
    }

    if (!complaint.title || !complaint.description) {
      toast.error("Please provide a title and description for your complaint")
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("title", complaint.title)
    formData.append("description", complaint.description)
    formData.append("location", complaint.location)
    formData.append("category", complaint.category)
    formData.append("urgency", complaint.urgency)
    console.log(formData)
     const result = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/complaints-api/upload`, formData)
     console.log(result.data)

    try {

      // Reset form on success
      setFile(null)
      setComplaint({
        title: "",
        description: "",
        location: "",
        category: "general",
        urgency: "medium",
      })

      // Refresh the list
      getFiles()

      toast.success("Your complaint has been successfully submitted")
    } catch (error) {
      toast.error("There was an error submitting your complaint")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get urgency badge color
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "high":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "critical":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-100"
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Add Sonner Toaster component */}
      <Toaster position="top-right" richColors />

      <div className="mb-8 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Complaint Portal</h1>
          <p className="text-muted-foreground">Submit and track your complaints to help improve our community</p>
        </div>

        <Tabs defaultValue="submit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="submit">Submit Complaint</TabsTrigger>
            <TabsTrigger value="history">Complaint History</TabsTrigger>
          </TabsList>

          <TabsContent value="submit" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Submit a New Complaint</CardTitle>
                <CardDescription>Provide details about the issue you're experiencing</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Image Upload Section with preview */}
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-base font-medium">
                    Upload Evidence
                  </Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      {/* Hidden file input with ref */}
                      <Input
                        ref={fileInputRef}
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      {/* Clickable upload area */}
                      <div
                        onClick={triggerFileInput}
                        className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/50 px-4 py-8 text-center transition-colors hover:bg-muted/50"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <span className="text-sm font-medium">Click to upload an image</span>
                          <span className="text-xs text-muted-foreground">JPG, PNG or GIF, up to 10MB</span>
                        </div>
                      </div>

                      {/* Alternative button for file upload */}
                      <Button type="button" variant="outline" onClick={triggerFileInput} size="sm" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Select Image
                      </Button>
                    </div>

                    {file ? (
                      <div className="flex flex-col gap-2">
                        <div className="relative h-40 w-full overflow-hidden rounded-md border bg-muted/20">
                          <div className="flex h-full items-center justify-center">
                            <img
                              src={URL.createObjectURL(file) || "/placeholder.svg"}
                              alt="Preview"
                              className="h-full w-full object-contain"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileImage className="h-4 w-4" />
                          <span className="truncate">{file.name}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/30 bg-muted/20">
                        <span className="text-sm text-muted-foreground">Image preview will appear here</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Complaint Details */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-base font-medium">
                      Complaint Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={complaint.title}
                      onChange={handleInputChange}
                      placeholder="Brief title for your complaint"
                      className="mt-1.5"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-base font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={complaint.description}
                      onChange={handleInputChange}
                      placeholder="Provide details about your complaint"
                      className="mt-1.5 min-h-32"
                      rows={5}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-base font-medium">
                      Location
                    </Label>
                    <div className="relative mt-1.5">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        name="location"
                        value={complaint.location}
                        onChange={handleInputChange}
                        placeholder="Where did this issue occur?"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Category and Urgency - 2 column layout */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="category" className="text-base font-medium">
                        Category
                      </Label>
                      <Select
                        value={complaint.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="infrastructure">Infrastructure</SelectItem>
                          <SelectItem value="sanitation">Sanitation</SelectItem>
                          <SelectItem value="safety">Safety</SelectItem>
                          <SelectItem value="noise">Noise</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="urgency" className="text-base font-medium">
                        Urgency Level
                      </Label>
                      <Select value={complaint.urgency} onValueChange={(value) => handleSelectChange("urgency", value)}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select urgency level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getUrgencyColor("low")}>
                                Low
                              </Badge>
                              <span>Can be addressed later</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getUrgencyColor("medium")}>
                                Medium
                              </Badge>
                              <span>Needs attention soon</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="high">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getUrgencyColor("high")}>
                                High
                              </Badge>
                              <span>Requires prompt action</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="critical">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getUrgencyColor("critical")}>
                                Critical
                              </Badge>
                              <span>Immediate attention needed</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Alert variant="default" className="text-white border-blue-500">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    All complaints are reviewed within 24-48 hours. Critical issues are prioritized.
                  </AlertDescription>
                </Alert>
              </CardContent>

              <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null)
                    setComplaint({
                      title: "",
                      description: "",
                      location: "",
                      category: "general",
                      urgency: "medium",
                    })
                  }}
                  className="w-full sm:w-auto"
                >
                  Reset Form
                </Button>
                <Button onClick={handleUpload} disabled={isSubmitting || !file} className="w-full sm:w-auto">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Submit Complaint
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Complaint History</CardTitle>
                <CardDescription>View and track the status of your previous complaints</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : files.length > 0 ? (
                  <div className="space-y-4">
                    {files.map((file, index) => (
                      <div key={index} className="rounded-lg border p-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-semibold">{file.title || "Untitled Complaint"}</h3>
                            <p className="text-sm text-muted-foreground">
                              {file.location ? `Location: ${file.location}` : "No location specified"}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="capitalize">
                              {file.category || "general"}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`capitalize ${getUrgencyColor(file.urgency || "medium")}`}
                            >
                              {file.urgency || "medium"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
                    <p className="text-muted-foreground">You haven't submitted any complaints yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const submitTab = document.querySelector('[data-value="submit"]') as HTMLElement
                        if (submitTab) submitTab.click()
                      }}
                    >
                      Submit your first complaint
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default UploadComplaint