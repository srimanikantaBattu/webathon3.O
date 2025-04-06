"use client"

import { useEffect, useRef, useState } from "react"
import * as faceapi from "face-api.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { Camera, CheckCircle, Loader2, Search, User, UserCheck, UserX } from "lucide-react"

// Sample student data - replace with your actual data source
const sampleStudents: Student[] = [
  {
    id: "1",
    name: "Alex Johnson",
    rollNo: "CS2023001",
    imgUrl: "https://www.gdgcvnrvjiet.org/static/media/Manikanta.610508b5987c63313861.jpg",
    status: "absent",
    lastMarked: "2025-04-06T08:30:00",
  }
]

type Student = {
  id: string
  name: string
  rollNo: string
  imgUrl: string
  status: string
  lastMarked: string
}

export default function AttendanceSystem() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const photoRef = useRef<HTMLCanvasElement>(null)

  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [students, setStudents] = useState<Student[]>(sampleStudents)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [matchResult, setMatchResult] = useState<{ percentage: number; passed: boolean } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsProcessing(true)
        setError(null)
        
        await Promise.all([
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        ])
        
        console.log("Face recognition models loaded successfully")
        setIsModelLoaded(true)
        startWebcam()
      } catch (error) {
        console.error("Error loading models:", error)
        setError(
          "Error loading face recognition models. Please refresh the page and try again."
        )
      } finally {
        setIsProcessing(false)
      }
    }

    loadModels()

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  // Start webcam
  const startWebcam = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing webcam:", error)
      setError("Failed to access webcam. Please ensure you've granted camera permissions.")
    }
  }

  // Capture image from webcam
  const captureImage = () => {
    if (videoRef.current && photoRef.current) {
      const context = photoRef.current.getContext("2d")
      if (context) {
        photoRef.current.width = videoRef.current.videoWidth
        photoRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight)

        const imageData = photoRef.current.toDataURL("image/png")
        setCapturedImage(imageData)
        setMatchResult(null)
      }
    }
  }

  // Helper function to create an image element from data URL
  const createImageElement = (dataUrl: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = dataUrl
      img.onload = () => resolve(img)
      img.onerror = (err) => reject(err)
      img.crossOrigin = "anonymous"
    })
  }

  // Helper function to detect face and get descriptor
  const detectFace = async (imgElement: HTMLImageElement) => {
    try {
      // Detect all faces and compute descriptors
      const detections = await faceapi.detectAllFaces(imgElement).withFaceLandmarks().withFaceDescriptors()

      if (detections.length === 0) return null

      // Return descriptor of the first face
      return detections[0].descriptor
    } catch (error) {
      console.error("Error detecting face:", error)
      return null
    }
  }

  // Compare the captured face with the selected student's face
  const verifyAttendance = async () => {
    if (!capturedImage || !selectedStudent || !isModelLoaded) return

    try {
      setIsProcessing(true)
      setError(null)
      setMatchResult(null)

      // Create image elements for face-api
      const capturedFaceImage = await createImageElement(capturedImage)
      const studentFaceImage = await createImageElement(selectedStudent.imgUrl)

      // Detect faces and compute descriptors
      const capturedFaceDescriptor = await detectFace(capturedFaceImage)
      const studentFaceDescriptor = await detectFace(studentFaceImage)

      if (capturedFaceDescriptor && studentFaceDescriptor) {
        // Calculate face similarity (returns a distance where lower means more similar)
        const distance = faceapi.euclideanDistance(capturedFaceDescriptor, studentFaceDescriptor)

        // Convert distance to similarity percentage (0 distance = 100% match)
        const similarity = Math.max(0, Math.min(100, (1 - distance) * 100))
        const matchPercentage = Math.round(similarity)
        const passed = matchPercentage >= 75 // Threshold for attendance

        setMatchResult({ percentage: matchPercentage, passed })
        
        if (passed) {
          markAttendance(selectedStudent.id, "present")
          toast.success(`Attendance marked for ${selectedStudent.name}`, {
            description: "Present attendance recorded successfully"
          })
        } else {
          toast.error(`Face verification failed`, {
            description: "The captured image doesn't match with the student"
          })
        }
      } else {
        setError("Could not detect faces in one or both images. Try again with clearer images.")
      }
    } catch (error) {
      console.error("Error comparing faces:", error)
      setError("An error occurred during face comparison.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Mark attendance for a student
  const markAttendance = (studentId: string, status: "present" | "absent") => {
    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          status,
          lastMarked: new Date().toISOString()
        }
      }
      return student
    })
    
    setStudents(updatedStudents)
    
    // If this is the selected student, update that too
    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent({
        ...selectedStudent,
        status,
        lastMarked: new Date().toISOString()
      })
    }
  }

  // Manual attendance marking
  const markManualAttendance = (studentId: string, status: "present" | "absent") => {
    markAttendance(studentId, status)
    
    toast.success(`Attendance updated`, {
      description: `Student marked as ${status}`
    })
  }

  // Filter students based on search and tab
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "present") return matchesSearch && student.status === "present"
    if (activeTab === "absent") return matchesSearch && student.status === "absent"
    if (activeTab === "unmarked") return matchesSearch && student.status === null
    
    return matchesSearch
  })

  // Format timestamp to readable time
  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return "Not marked"
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Facial Recognition Attendance System</CardTitle>
          <CardDescription className="text-center">Mark student attendance using facial recognition</CardDescription>
        </CardHeader>
        <CardContent>
          {!isModelLoaded && isProcessing && (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <p>Loading face recognition models...</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Webcam Section */}
            <Card className="shadow-md lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="mr-2 h-5 w-5" />
                  Webcam Capture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-muted rounded-md overflow-hidden mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
                <canvas ref={photoRef} style={{ display: "none" }} />
                
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={captureImage}
                    disabled={!isModelLoaded || isProcessing}
                    className="w-full"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Capture Face
                  </Button>
                  
                  {capturedImage && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Captured Image:</p>
                      <div className="bg-muted rounded-md overflow-hidden">
                        <img
                          src={capturedImage}
                          alt="Captured face"
                          className="w-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Selected Student Section */}
            <Card className="shadow-md lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Selected Student
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedStudent ? (
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={selectedStudent.imgUrl} alt={selectedStudent.name} />
                      <AvatarFallback>{selectedStudent.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                    <p className="text-muted-foreground">{selectedStudent.rollNo}</p>
                    
                    <Separator className="my-4" />
                    
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Attendance Status:</span>
                        {selectedStudent.status ? (
                          <Badge className={selectedStudent.status === "present" ? "bg-green-500" : "bg-red-500"}>
                            {selectedStudent.status.toUpperCase()}
                          </Badge>
                        ) : (
                          <Badge variant="outline">NOT MARKED</Badge>
                        )}
                      </div>
                      
                      {selectedStudent.lastMarked && (
                        <p className="text-xs text-muted-foreground mb-4">
                          Last marked: {formatTime(selectedStudent.lastMarked)}
                        </p>
                      )}
                      
                      <div className="flex gap-2 mt-4">
                        <Button 
                          onClick={verifyAttendance} 
                          disabled={!capturedImage || isProcessing} 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {isProcessing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <UserCheck className="mr-2 h-4 w-4" />
                          )}
                          Verify & Mark
                        </Button>
                      </div>
                      
                      <div className="flex gap-2 mt-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => markManualAttendance(selectedStudent.id, "present")}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark Present
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => markManualAttendance(selectedStudent.id, "absent")}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Mark Absent
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <User className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No student selected</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Select a student from the list to mark attendance
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Verification Results */}
            <Card className="shadow-md lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-5 w-5" />
                  Verification Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {matchResult ? (
                  <div className="flex flex-col items-center">
                    {matchResult.passed ? (
                      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <UserX className="h-12 w-12 text-red-600" />
                      </div>
                    )}
                    
                    <h3 className="text-xl font-semibold mb-2">
                      {matchResult.passed ? "Match Successful" : "No Match"}
                    </h3>
                    
                    <Separator className="my-4 w-full" />
                    
                    <div className="w-full">
                      <p className="text-sm font-medium mb-2">Match Percentage</p>
                      <Progress value={matchResult.percentage} className="h-4 mb-1" />
                      <p className="text-center mt-2 font-bold text-lg">{matchResult.percentage}%</p>
                      
                      <p className="text-sm text-center mt-4 text-muted-foreground">
                        {matchResult.passed 
                          ? "Face verified successfully. Attendance has been marked."
                          : "Face verification failed. You can try again or mark attendance manually."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Search className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No verification performed</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Capture image and select a student to verify attendance
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <div className="flex items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search students..."
                className="pl-8 pr-4 py-2 rounded-md w-full border border-input bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="present">Present</TabsTrigger>
              <TabsTrigger value="absent">Absent</TabsTrigger>
              <TabsTrigger value="unmarked">Unmarked</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <div 
                    key={student.id}
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors hover:bg-accent ${
                      selectedStudent?.id === student.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={student.imgUrl} alt={student.name} />
                        <AvatarFallback>{student.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{student.name}</h4>
                        <p className="text-sm text-muted-foreground">{student.rollNo}</p>
                      </div>
                    </div>
                    {student.status ? (
                      <Badge className={student.status === "present" ? "bg-green-500" : "bg-red-500"}>
                        {student.status.toUpperCase()}
                      </Badge>
                    ) : (
                      <Badge variant="outline">NOT MARKED</Badge>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No students found
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredStudents.filter(s => s.status === "present").length} present • 
            {filteredStudents.filter(s => s.status === "absent").length} absent • 
            {filteredStudents.filter(s => s.status === null).length} unmarked
          </p>
          <p className="text-sm text-muted-foreground">
            Total: {filteredStudents.length} students
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}