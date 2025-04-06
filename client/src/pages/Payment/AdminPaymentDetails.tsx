"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Save, CheckCircle, School, CreditCard, Calendar as CalendarIcon2 } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Define the schema for a single year's fee details
const yearFeeSchema = z.object({
  feeAmount: z.coerce
    .number({
      required_error: "Fee amount is required",
      invalid_type_error: "Fee amount must be a number",
    })
    .positive("Fee amount must be positive"),
  semester1DueDate: z.date({
    required_error: "Semester 1 due date is required",
  }),
  semester2DueDate: z.date({
    required_error: "Semester 2 due date is required",
  }),
})

// Define the form schema with validation for all years
const formSchema = z.object({
  year1: yearFeeSchema,
  year2: yearFeeSchema,
  year3: yearFeeSchema,
  year4: yearFeeSchema,
})

// Define the type for our fee records
type YearFeeDetails = {
  feeAmount: number
  semester1DueDate: Date
  semester2DueDate: Date
}

export default function FeeManagementPage() {
  const [submittedData, setSubmittedData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("year1")

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year1: {
        feeAmount: 45000,
        semester1DueDate: new Date(2025, 6, 15),
        semester2DueDate: new Date(2025, 11, 15),
      },
      year2: {
        feeAmount: 48000,
        semester1DueDate: new Date(2025, 6, 20),
        semester2DueDate: new Date(2025, 11, 20),
      },
      year3: {
        feeAmount: 50000,
        semester1DueDate: new Date(2025, 6, 25),
        semester2DueDate: new Date(2025, 11, 25),
      },
      year4: {
        feeAmount: 52000,
        semester1DueDate: new Date(2025, 6, 30),
        semester2DueDate: new Date(2025, 11, 30),
      },
    },
  })

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Transform the data into the required format (array of documents)
    const formattedData = [
      { year: 1, ...values.year1 },
      { year: 2, ...values.year2 },
      { year: 3, ...values.year3 },
      { year: 4, ...values.year4 },
    ]

    // Set the submitted data for display
    setSubmittedData(formattedData)

    // Show success toast with Sonner
    toast.success("Fee details saved", {
      description: "All BTech years' fee details have been saved successfully",
      icon: <CheckCircle className="h-4 w-4" />,
      duration: 5000,
    })
  }

  // Render a date field
  const renderDateField = (year: string, semester: string, label: string) => {
    return (
      <FormField
        control={form.control}
        name={`${year}.${semester}DueDate` as any}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="flex items-center gap-2">
              <CalendarIcon2 className="h-4 w-4 text-muted-foreground" />
              {label}
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal border-muted-foreground/20 hover:bg-muted/50 transition-colors", 
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  // Render a fee amount field
  const renderFeeField = (year: string, label: string) => {
    return (
      <FormField
        control={form.control}
        name={`${year}.feeAmount` as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              {label}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                <Input 
                  type="number" 
                  placeholder="Enter fee amount" 
                  className="pl-8 border-muted-foreground/20 focus-visible:ring-primary/50" 
                  {...field} 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  // Render a year tab content
  const renderYearTab = (year: string, yearNum: number) => {
    return (
      <TabsContent value={year} className="space-y-6 pt-4">
        <div className="grid gap-8">
          <div className="bg-muted/40 p-6 rounded-lg border border-muted">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20 transition-colors">
                Year {yearNum}
              </Badge>
              Fee Configuration
            </h3>
            {renderFeeField(year, `Annual Fee Amount`)}
          </div>

          <div className="bg-muted/40 p-6 rounded-lg border border-muted">
            <h3 className="text-lg font-medium mb-4">Payment Schedule</h3>
            <div className="grid gap-8 md:grid-cols-2">
              {renderDateField(year, "semester1", `Semester 1 Due Date`)}
              {renderDateField(year, "semester2", `Semester 2 Due Date`)}
            </div>
          </div>
        </div>
      </TabsContent>
    )
  }

  // Get color for each year tab
  const getYearColorClass = (year: number) => {
    const colors = ["bg-blue-500/10", "bg-emerald-500/10", "bg-amber-500/10", "bg-rose-500/10"];
    const textColors = ["text-blue-600", "text-emerald-600", "text-amber-600", "text-rose-600"];
    return { bg: colors[year-1], text: textColors[year-1] };
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center ms-8 gap-4 mb-8">
        <Avatar className="h-12 w-12 bg-primary/20 border-2 border-primary/50">
          <AvatarFallback>
            <School className="h-6 w-6 text-primary" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl text-center font-bold">BTech Fee Management</h1>
          <p className="text-muted-foreground">Configure annual fees and payment schedules</p>
        </div>
      </div>

      <Card className="mb-8 mx-auto shadow-sm border-muted w-[50%]">
        <CardHeader className="bg-muted/30 border-b border-muted">
          <CardTitle className="text-2xl">Fee Configuration</CardTitle>
          <CardDescription>Set fee amounts and due dates for all BTech years at once</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs 
                defaultValue="year1" 
                className="w-full"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid grid-cols-4 mb-6 p-1 bg-muted/50">
                  {[1, 2, 3, 4].map(year => {
                    const yearKey = `year${year}`;
                    const colors = getYearColorClass(year);
                    return (
                      <TabsTrigger 
                        key={yearKey}
                        value={yearKey}
                        className={cn(
                          "data-[state=active]:shadow-sm transition-all duration-200",
                          activeTab === yearKey ? colors.bg : ""
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className={cn("font-medium", activeTab === yearKey ? colors.text : "")}>
                            Year {year}
                          </span>
                        </div>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {renderYearTab("year1", 1)}
                {renderYearTab("year2", 2)}
                {renderYearTab("year3", 3)}
                {renderYearTab("year4", 4)}
              </Tabs>

              <div className="pt-4 border-t border-muted">
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 transition-colors" size="lg">
                  <Save className="mr-2 h-5 w-5" />
                  Save All Fee Details
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {submittedData.length > 0 && (
        <Card className="shadow-sm border-muted">
          <CardHeader className="bg-muted/30 border-b border-muted">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <CardTitle>Saved Fee Details</CardTitle>
            </div>
            <CardDescription>The following fee details have been successfully saved</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {submittedData.map((yearData, index) => {
                const colors = getYearColorClass(yearData.year);
                return (
                  <Card key={index} className={cn("shadow-sm overflow-hidden", colors.bg)}>
                    <CardHeader className="p-4 pb-2">
                      <Badge variant="outline" className="w-fit mb-1">
                        Year {yearData.year}
                      </Badge>
                      <CardTitle className="text-xl">₹{yearData.feeAmount.toLocaleString()}</CardTitle>
                      <CardDescription>Annual Fee</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="grid gap-2">
                        <div className="text-sm">
                          <p className="text-muted-foreground">Semester 1 Due:</p>
                          <p className="font-medium flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {format(yearData.semester1DueDate, "PPP")}
                          </p>
                        </div>
                        <div className="text-sm">
                          <p className="text-muted-foreground">Semester 2 Due:</p>
                          <p className="font-medium flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {format(yearData.semester2DueDate, "PPP")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="bg-muted/20 border-t border-muted flex flex-col items-start p-6">
            <div className="text-sm text-muted-foreground w-full">
              <p className="font-medium mb-2">Data structure in console:</p>
              <pre className="mt-2 bg-muted p-4 rounded-md overflow-auto text-xs">{JSON.stringify(submittedData, null, 2)}</pre>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}