"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import jsPDF from "jspdf"
import {
  CheckCircle,
  Clock,
  CreditCard,
  AlertTriangle,
  Receipt,
  ArrowRight,
  Wallet,
  Calendar,
  Info,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function FeePayment() {
  const currentYear = new Date().getFullYear()
  const [data, setData] = useState({
    email: typeof localStorage !== "undefined" ? localStorage.getItem("email") : "",
    year: typeof localStorage !== "undefined" ? currentYear - Number(localStorage.getItem("startyear")) : 1,
  })

  const [sem1paid, setSem1Paid] = useState(false)
  const [sem2paid, setSem2Paid] = useState(false)
  const [sem1dueDate, setSem1DueDate] = useState("")
  const [sem2dueDate, setSem2DueDate] = useState("")
  const [loading, setLoading] = useState(true)

  async function getDetails() {
    try {
      setLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/payments-api/get-payments`, data)
      setSem1Paid(response.data.data.sem1paid)
      setSem2Paid(response.data.data.sem2paid)
      setSem1DueDate(response.data.data.semester1DueDate)
      setSem2DueDate(response.data.data.semester2DueDate)
    } catch (error) {
      console.error("Error fetching payment details:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on component mount

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const openRazorpay = async (semester: number) => {
    const res = await loadRazorpayScript()
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?")
      return
    }

    const options = {
      key: "rzp_live_EBNQrXnLeYG8dK", // Replace with your Razorpay key
      amount: 6500000, // Amount in paise (65000 = ₹65,000)
      currency: "INR",
      name: `Semester ${semester} Fee Payment`,
      description: `Academic Year ${currentYear} - Semester ${semester}`,
      image: "/placeholder.svg?height=60&width=60", // Replace with your logo
      handler: (response: any) => {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`)
        // Update payment status after successful payment
        if (semester === 1) {
          setSem1Paid(true)
        } else {
          setSem2Paid(true)
        }
      },
      prefill: {
        name: "Student Name",
        email: data.email || "student@example.com",
        contact: "",
      },
      theme: {
        color: "#18181b", // Zinc-900 color
      },
    }

    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
  }

  // Format date string to a more readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified"

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (e) {
      return dateString
    }
  }

  // Check if date is past due
  const isPastDue = (dateString: string) => {
    if (!dateString) return false

    try {
      const dueDate = new Date(dateString)
      const today = new Date()
      return today > dueDate
    } catch (e) {
      return false
    }
  }

  // Calculate days remaining or overdue
  const getDaysRemaining = (dateString: string) => {
    if (!dateString) return { days: 0, isOverdue: false }

    try {
      const dueDate = new Date(dateString)
      const today = new Date()
      const diffTime = dueDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      return {
        days: Math.abs(diffDays),
        isOverdue: diffDays < 0,
      }
    } catch (e) {
      return { days: 0, isOverdue: false }
    }
  }

  // Calculate overall payment progress
  const getPaymentProgress = () => {
    let completed = 0
    if (sem1paid) completed += 1
    if (sem2paid) completed += 1
    return (completed / 2) * 100
  }

  const sem1DaysInfo = getDaysRemaining(sem1dueDate)
  const sem2DaysInfo = getDaysRemaining(sem2dueDate)

  const downloadReceipt = (semester: number) => {
    // Create a new PDF document
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    // Add university logo/header
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("University Payment Portal", pageWidth / 2, 20, { align: "center" })

    // Add receipt title
    doc.setFontSize(16)
    doc.text(`Semester ${semester} Payment Receipt`, pageWidth / 2, 30, { align: "center" })

    // Add horizontal line
    doc.setLineWidth(0.5)
    doc.line(20, 35, pageWidth - 20, 35)

    // Add receipt details
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")

    // Receipt ID
    const receiptId = `SEM${semester}-${currentYear}-${Math.floor(Math.random() * 10000)}`
    doc.text("Receipt ID:", 20, 50)
    doc.text(receiptId, 80, 50)

    // Student details
    doc.text("Student Email:", 20, 60)
    doc.text(data.email || "Not specified", 80, 60)

    // Academic details
    doc.text("Academic Year:", 20, 70)
    doc.text(`${currentYear}`, 80, 70)

    doc.text("Year:", 20, 80)
    doc.text(`${data.year}`, 80, 80)

    doc.text("Semester:", 20, 90)
    doc.text(`${semester}`, 80, 90)

    // Payment details
    doc.text("Amount Paid:", 20, 100)
    doc.text("₹65,000.00", 80, 100)

    doc.text("Payment Date:", 20, 110)
    doc.text(new Date().toLocaleDateString(), 80, 110)

    doc.text("Payment Method:", 20, 120)
    doc.text("Razorpay", 80, 120)

    // Add payment status
    doc.text("Payment Status:", 20, 130)
    doc.text("PAID", 80, 130)

    // Add footer
    doc.setFontSize(10)
    doc.text("This is an electronically generated receipt and does not require a signature.", pageWidth / 2, 150, {
      align: "center",
    })
    doc.text(`© ${currentYear} University Payment Portal. All rights reserved.`, pageWidth / 2, 160, {
      align: "center",
    })

    // Save the PDF
    doc.save(`semester${semester}_receipt_${receiptId}.pdf`)
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Fee Payment Portal</h1>
        <p className="text-muted-foreground mt-2">
          Academic Year {currentYear} - Year {data.year}
        </p>

        {!loading && (
          <div className="w-full max-w-md mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Payment Progress</span>
              <span>{getPaymentProgress()}% Complete</span>
            </div>
            <Progress value={getPaymentProgress()} className="h-2" />
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-700"></div>
        </div>
      ) : (
        <Tabs defaultValue="semester1" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="semester1" className="relative hover:cursor-pointer">
              Semester 1
              {sem1paid ? (
                <Badge
                  variant="outline"
                  className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Paid
                </Badge>
              ) : sem1DaysInfo.isOverdue ? (
                <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Overdue
                </Badge>
              ) : (
                <Badge variant="outline" className="ml-2">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="semester2" className="relative hover:cursor-pointer">
              Semester 2
              {sem2paid ? (
                <Badge
                  variant="outline"
                  className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Paid
                </Badge>
              ) : sem2DaysInfo.isOverdue ? (
                <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Overdue
                </Badge>
              ) : (
                <Badge variant="outline" className="ml-2">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="semester1">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Semester 1 Fee Details</span>
                    {sem1paid ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Paid</Badge>
                    ) : sem1DaysInfo.isOverdue ? (
                      <Badge variant="destructive">Overdue</Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>First Half Academic Fees</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-md bg-zinc-100 dark:bg-zinc-800">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3 text-zinc-500" />
                      <div>
                        <p className="font-medium">Due Date</p>
                        <p className="text-sm text-muted-foreground">{formatDate(sem1dueDate)}</p>
                      </div>
                    </div>
                    {!sem1paid && (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Info className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="flex justify-between space-x-4">
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold">Payment Status</h4>
                              <p className="text-sm">
                                {sem1DaysInfo.isOverdue
                                  ? `Payment is overdue by ${sem1DaysInfo.days} days`
                                  : `Payment is due in ${sem1DaysInfo.days} days`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {sem1DaysInfo.isOverdue
                                  ? "Late payment may incur additional fees"
                                  : "Please ensure timely payment to avoid penalties"}
                              </p>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-md bg-zinc-100 dark:bg-zinc-800">
                    <div className="flex items-center">
                      <Wallet className="h-5 w-5 mr-3 text-zinc-500" />
                      <div>
                        <p className="font-medium">Amount</p>
                        <p className="text-sm text-muted-foreground">Total fee for semester</p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold">₹65,000.00</p>
                  </div>

                  {!sem1paid && sem1DaysInfo.isOverdue && (
                    <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-3 rounded-md flex items-start">
                      <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Payment Overdue</p>
                        <p className="text-sm">
                          Your payment is overdue by {sem1DaysInfo.days} days. Please make the payment immediately to
                          avoid academic holds.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => openRazorpay(1)}
                    disabled={sem1paid}
                    variant={sem1paid ? "outline" : sem1DaysInfo.isOverdue ? "destructive" : "default"}
                  >
                    {sem1paid ? (
                      <span className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4" /> Payment Complete
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-zinc-50 dark:bg-zinc-900 border-dashed">
                <CardHeader>
                  <CardTitle>Payment Receipt</CardTitle>
                  <CardDescription>
                    {sem1paid ? "View your payment details" : "Will be available after payment"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sem1paid ? (
                    <div className="space-y-4">
                      <div className="flex justify-center mb-4">
                        <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Receipt ID</span>
                          <span className="font-medium">
                            SEM1-{currentYear}-{Math.floor(Math.random() * 10000)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment Date</span>
                          <span className="font-medium">{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount Paid</span>
                          <span className="font-medium">₹65,000.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment Method</span>
                          <span className="font-medium">Razorpay</span>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full" onClick={() => downloadReceipt(1)}>
                        <Receipt className="mr-2 h-4 w-4" /> Download Receipt
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center">
                      <Receipt className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                      <p className="text-muted-foreground">
                        Your payment receipt will be available here once payment is completed
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="semester2">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Semester 2 Fee Details</span>
                    {sem2paid ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Paid</Badge>
                    ) : sem2DaysInfo.isOverdue ? (
                      <Badge variant="destructive">Overdue</Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>Second Half Academic Fees</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-md bg-zinc-100 dark:bg-zinc-800">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3 text-zinc-500" />
                      <div>
                        <p className="font-medium">Due Date</p>
                        <p className="text-sm text-muted-foreground">{formatDate(sem2dueDate)}</p>
                      </div>
                    </div>
                    {!sem2paid && (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Info className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="flex justify-between space-x-4">
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold">Payment Status</h4>
                              <p className="text-sm">
                                {sem2DaysInfo.isOverdue
                                  ? `Payment is overdue by ${sem2DaysInfo.days} days`
                                  : `Payment is due in ${sem2DaysInfo.days} days`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {sem2DaysInfo.isOverdue
                                  ? "Late payment may incur additional fees"
                                  : "Please ensure timely payment to avoid penalties"}
                              </p>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-md bg-zinc-100 dark:bg-zinc-800">
                    <div className="flex items-center">
                      <Wallet className="h-5 w-5 mr-3 text-zinc-500" />
                      <div>
                        <p className="font-medium">Amount</p>
                        <p className="text-sm text-muted-foreground">Total fee for semester</p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold">₹65,000.00</p>
                  </div>

                  {!sem2paid && sem2DaysInfo.isOverdue && (
                    <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-3 rounded-md flex items-start">
                      <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Payment Overdue</p>
                        <p className="text-sm">
                          Your payment is overdue by {sem2DaysInfo.days} days. Please make the payment immediately to
                          avoid academic holds.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => openRazorpay(2)}
                    disabled={sem2paid}
                    variant={sem2paid ? "outline" : sem2DaysInfo.isOverdue ? "destructive" : "default"}
                  >
                    {sem2paid ? (
                      <span className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4" /> Payment Complete
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-zinc-50 dark:bg-zinc-900 border-dashed">
                <CardHeader>
                  <CardTitle>Payment Receipt</CardTitle>
                  <CardDescription>
                    {sem2paid ? "View your payment details" : "Will be available after payment"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sem2paid ? (
                    <div className="space-y-4">
                      <div className="flex justify-center mb-4">
                        <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Receipt ID</span>
                          <span className="font-medium">
                            SEM2-{currentYear}-{Math.floor(Math.random() * 10000)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment Date</span>
                          <span className="font-medium">{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount Paid</span>
                          <span className="font-medium">₹65,000.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment Method</span>
                          <span className="font-medium">Razorpay</span>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full" onClick={() => downloadReceipt(2)}>
                        <Receipt className="mr-2 h-4 w-4" /> Download Receipt
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center">
                      <Receipt className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                      <p className="text-muted-foreground">
                        Your payment receipt will be available here once payment is completed
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      <Accordion type="single" collapsible className="w-full mt-8">
        <AccordionItem value="payment-instructions">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Payment Instructions
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-md">
            <div className="flex items-start">
              <div className="bg-zinc-200 dark:bg-zinc-800 rounded-full p-1 mr-3 mt-0.5">
                <ArrowRight className="h-4 w-4" />
              </div>
              <p>Fees must be paid before the due date to avoid late payment penalties and academic holds</p>
            </div>
            <div className="flex items-start">
              <div className="bg-zinc-200 dark:bg-zinc-800 rounded-full p-1 mr-3 mt-0.5">
                <ArrowRight className="h-4 w-4" />
              </div>
              <p>
                Payment receipts will be sent to your registered email address within 24 hours of successful payment
              </p>
            </div>
            <div className="flex items-start">
              <div className="bg-zinc-200 dark:bg-zinc-800 rounded-full p-1 mr-3 mt-0.5">
                <ArrowRight className="h-4 w-4" />
              </div>
              <p>For any payment-related queries, please contact the finance department</p>
            </div>
            <div className="flex items-start">
              <div className="bg-zinc-200 dark:bg-zinc-800 rounded-full p-1 mr-3 mt-0.5">
                <ArrowRight className="h-4 w-4" />
              </div>
              <p>All payments are secured and processed through Razorpay payment gateway</p>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center">
                <Avatar className="h-9 w-9 mr-3">
                  <AvatarFallback>FD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Finance Department</p>
                  <p className="text-sm text-muted-foreground">finance@university.edu | +91 1234567890</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-8 text-center text-muted-foreground text-sm">
        © {currentYear} University Payment Portal. All rights reserved.
      </div>
    </div>
  )
}

