

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"

// Form validation schema
const formSchema = z.object({
  purpose: z.string().min(5, { message: "Purpose must be at least 5 characters" }),
  fatherNumber: z.string().min(10, { message: "Please enter a valid phone number" }),
  outingDate: z.date({ required_error: "Please select a date" }),
  outingTime: z.string().min(1, { message: "Please enter outing time" }),
  returnTime: z.string().min(1, { message: "Please enter return time" }),
})

export default function RequestOuting() {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [userData, setUserData] = useState({
    name: "",
    rollno: "",
    mobile: "",
    email: "",
    fathername: "",
    father_mobile: "",
    room_no: "",
    branch: "",
    startyear: "",
  })

  const [approvedOutings, setApprovedOutings] = useState([])
  const [pendingOutings, setPendingOutings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose: "",
      fatherNumber: "",
      outingTime: "",
      returnTime: "",
    },
  })

  // Fetch outings data
  const fetchOutings = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/outings-api/get-outings/${localStorage.getItem("rollno")}`,
      )
      const outings = response.data.data
      setApprovedOutings(outings.filter((outing: any) => outing.status === "approved"))
      setPendingOutings(outings.filter((outing: any) => outing.status === "pending"))
    } catch (error) {
      console.error("Error fetching outings data:", error)
      toast.error("Failed to fetch outings data")
    } finally {
      setIsLoading(false)
    }
  }

  // Load user data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = {
        name: localStorage.getItem("name") || "",
        rollno: localStorage.getItem("rollno") || "",
        mobile: localStorage.getItem("mobile") || "",
        email: localStorage.getItem("email") || "",
        fathername: localStorage.getItem("fathername") || "",
        father_mobile: localStorage.getItem("father_mobile") || "",
        room_no: localStorage.getItem("room_no") || "",
        branch: localStorage.getItem("branch") || "",
        startyear: localStorage.getItem("startyear") || "",
      }
      setUserData(data)

      // Pre-fill father's number if available
      if (data.father_mobile) {
        form.setValue("fatherNumber", data.father_mobile)
      }

      fetchOutings()
    }
  }, [form])

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Create the complete request data
    const requestData = {
      ...values,
      ...userData,
      status: "pending",
      requestDate: new Date(),
    }

    try {
      const result = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/outings-api/add-outing`,
        requestData,
      )
      if (!result.data.success) {
        toast.error(result.data.message)
        return
      }

      // Show success toast with Sonner
      toast.success("Request Submitted", {
        description: "Your outing request has been submitted successfully.",
        icon: <CheckCircle2 className="h-4 w-4" />,
        duration: 5000,
      })

      // Close the dialog and show the status
      setSubmitted(true)
      setOpen(false)

      // Refresh outings data
      fetchOutings()
    } catch (error) {
      console.error("Error submitting outing request:", error)
      toast.error("Failed to submit outing request")
    }
  }

  // Format date string
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP")
    } catch (error) {
      return "Invalid date"
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-5000 hover:bg-green-600">Approved</Badge>
      case "pending":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center justify-center space-y-6 mb-8">
        <h1 className="text-2xl font-bold text-center">Student Outing Request</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Request permission for an outing from the hostel and view your outing history.
        </p>
        <Button size="lg" onClick={() => setOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          Request New Outing
        </Button>
      </div>

      {submitted && (
        <Card className="max-w-md mx-auto shadow-md border border-muted/50 mb-8">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center justify-between">
              Outing Request
              <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="font-medium">{userData.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Roll No</p>
                <p className="font-medium">{userData.rollno}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Room No</p>
                <p className="font-medium">{userData.room_no}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Branch</p>
                <p className="font-medium">{userData.branch}</p>
              </div>
            </div>
            <div className="border-t border-muted/50 pt-4">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Outing Date
              </p>
              <p className="font-medium">
                {form.getValues("outingDate") ? format(form.getValues("outingDate"), "PPP") : ""}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Outing Time
                </p>
                <p className="font-medium">{form.getValues("outingTime")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Return Time
                </p>
                <p className="font-medium">{form.getValues("returnTime")}</p>
              </div>
            </div>
            <div className="border-t border-muted/50 pt-4">
              <p className="text-sm font-medium text-muted-foreground">Purpose</p>
              <p className="font-medium">{form.getValues("purpose")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Outings History Tabs */}
      <div className="max-w-4xl mx-auto mt-8">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
            >
              Pending Outings ({pendingOutings.length})
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
            >
              Approved Outings ({approvedOutings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
              </div>
            ) : pendingOutings.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {pendingOutings.map((outing: any, index: number) => (
                  <Card key={index} className="shadow-sm border border-amber-200">
                    <CardHeader className="bg-amber-50 pb-2">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span className="flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                          Outing Request
                        </span>
                        {getStatusBadge(outing.status)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-muted-foreground">Outing Date</p>
                            <p className="font-medium">{formatDate(outing.outingDate)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Request Date</p>
                            <p className="text-sm">{formatDate(outing.requestDate)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Outing Time</p>
                            <p className="font-medium">{outing.outingTime}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Return Time</p>
                            <p className="font-medium">{outing.returnTime}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Purpose</p>
                          <p className="text-sm">{outing.purpose}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/20 rounded-lg">
                <XCircle className="h-8 w-8 mx-auto text-muted-foreground/70" />
                <p className="mt-2 text-muted-foreground">No pending outings found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="mt-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
              </div>
            ) : approvedOutings.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {approvedOutings.map((outing: any, index: number) => (
                  <Card key={index} className="shadow-sm border border-green-200">
                    <CardHeader className="bg-green-500 pb-2">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                          Approved Outing
                        </span>
                        {getStatusBadge(outing.status)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-muted-foreground">Outing Date</p>
                            <p className="font-medium">{formatDate(outing.outingDate)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Approved On</p>
                            <p className="text-sm">{outing.approvedDate ? formatDate(outing.approvedDate) : "N/A"}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Outing Time</p>
                            <p className="font-medium">{outing.outingTime}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Return Time</p>
                            <p className="font-medium">{outing.returnTime}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Purpose</p>
                          <p className="text-sm">{outing.purpose}</p>
                        </div>
                        {outing.approvedBy && (
                          <div>
                            <p className="text-xs text-muted-foreground">Approved By</p>
                            <p className="text-sm font-medium">{outing.approvedBy}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/20 rounded-lg">
                <XCircle className="h-8 w-8 mx-auto text-muted-foreground/70" />
                <p className="mt-2 text-muted-foreground">No approved outings found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Outing</DialogTitle>
            <DialogDescription>Fill in the details below to request an outing from the hostel.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-md">
                <div>
                  <p className="text-sm font-medium mb-1">Name</p>
                  <p className="text-sm font-medium">{userData.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Roll No</p>
                  <p className="text-sm font-medium">{userData.rollno}</p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose of Outing</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the purpose of your outing"
                        className="resize-none border-muted-foreground/20 focus-visible:ring-emerald-500/30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fatherNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Father's Contact Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter father's contact number"
                        className="border-muted-foreground/20 focus-visible:ring-emerald-500/30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="outingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Outing Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal border-muted-foreground/20",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="outingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Outing Time</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Input
                            type="time"
                            className="border-muted-foreground/20 focus-visible:ring-emerald-500/30"
                            {...field}
                          />
                          <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="returnTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Return Time</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Input
                            type="time"
                            className="border-muted-foreground/20 focus-visible:ring-emerald-500/30"
                            {...field}
                          />
                          <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Submit Request
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

