import { useEffect, useState } from "react"
import axios from "axios"
import { FiMail, FiStar, FiMessageSquare, FiFilter } from "react-icons/fi"
import { FaUtensils, FaHandSparkles, FaConciergeBell } from "react-icons/fa"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Feedback {
  _id: string
  name: string
  email: string
  mealRating: string
  serviceRating: string
  hygieneRating: string
  comments?: string
  createdAt: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AdminFeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{title: string, description: string, variant: "default" | "destructive"} | null>(null)

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/feedback-api/retrieve`);
        setFeedbacks(res.data)
      } catch (error) {
        console.error("Error fetching feedbacks:", error)
        setMessage({
          title: "Error",
          description: "Failed to load feedback data",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeedbacks()
  }, [])

  // Calculate average ratings
  const avgMealRating = feedbacks.length > 0 
    ? feedbacks.reduce((acc, f) => acc + Number(f.mealRating), 0) / feedbacks.length
    : 0;

  const avgServiceRating = feedbacks.length > 0 
    ? feedbacks.reduce((acc, f) => acc + Number(f.serviceRating), 0) / feedbacks.length
    : 0;

  const avgHygieneRating = feedbacks.length > 0 
    ? feedbacks.reduce((acc, f) => acc + Number(f.hygieneRating), 0) / feedbacks.length
    : 0;

  // Prepare data for charts
  const barChartData = [
    {
      name: 'Meal Quality',
      average: avgMealRating.toFixed(1),
      fullMark: 5,
    },
    {
      name: 'Service',
      average: avgServiceRating.toFixed(1),
      fullMark: 5,
    },
    {
      name: 'Hygiene',
      average: avgHygieneRating.toFixed(1),
      fullMark: 5,
    },
  ]

  // Prepare data for rating distribution pie chart
  const ratingDistributionData = [
    { name: '5 Stars', value: feedbacks.filter(f => Number(f.mealRating) === 5).length },
    { name: '4 Stars', value: feedbacks.filter(f => Number(f.mealRating) === 4).length },
    { name: '3 Stars', value: feedbacks.filter(f => Number(f.mealRating) === 3).length },
    { name: '2 Stars', value: feedbacks.filter(f => Number(f.mealRating) === 2).length },
    { name: '1 Star', value: feedbacks.filter(f => Number(f.mealRating) === 1).length },
  ]

  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (filter === "all") return true
    if (filter === "low") {
      return Number(feedback.mealRating) <= 2 || 
             Number(feedback.serviceRating) <= 2 || 
             Number(feedback.hygieneRating) <= 2
    }
    return true
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderStars = (rating: string) => {
    const stars = []
    const numRating = Number(rating)
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FiStar 
          key={i} 
          className={`${i <= numRating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} 
        />
      )
    }
    return <div className="flex gap-0.5">{stars}</div>
  }

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Customer Feedback Analytics</h1>
          <p className="text-muted-foreground">Comprehensive overview of customer satisfaction metrics</p>
        </div>

        {message && (
          <Alert variant={message.variant}>
            <AlertTitle>{message.title}</AlertTitle>
            <AlertDescription>{message.description}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium">Total Feedback</CardDescription>
              <CardTitle className="text-2xl">{feedbacks.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-sm font-medium">
                <FaUtensils className="text-blue-500" /> Meal Rating
              </CardDescription>
              <CardTitle className="text-2xl">{avgMealRating.toFixed(1)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-sm font-medium">
                <FaConciergeBell className="text-purple-500" /> Service Rating
              </CardDescription>
              <CardTitle className="text-2xl">{avgServiceRating.toFixed(1)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 text-sm font-medium">
                <FaHandSparkles className="text-green-500" /> Hygiene Rating
              </CardDescription>
              <CardTitle className="text-2xl">{avgHygieneRating.toFixed(1)}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart - Average Ratings */}
          <Card>
            <CardHeader>
              <CardTitle>Average Ratings by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" stroke="#888888" />
                  <YAxis domain={[0, 5]} stroke="#888888" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar 
                    dataKey="average" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  >
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart - Rating Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Meal Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ratingDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    animationDuration={1500}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {ratingDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <FiFilter className="text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter feedback" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Feedback</SelectItem>
                <SelectItem value="low">Low Ratings (≤ 2 stars)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Badge variant="outline" className="text-muted-foreground">
            Showing {filteredFeedbacks.length} of {feedbacks.length} feedbacks
          </Badge>
        </div>

        {/* Feedback List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                  </div>
                  <Skeleton className="h-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No feedback found</CardTitle>
              <CardDescription>No feedback available matching your criteria</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback) => (
              <Card key={feedback._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {feedback.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold leading-none tracking-tight">
                          {feedback.name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <FiMail className="mr-1.5 h-3.5 w-3.5" />
                          {feedback.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    Submitted on {formatDate(feedback.createdAt)}
                  </div>

                  {/* Ratings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaUtensils className="text-blue-500" />
                        <span className="font-medium">Meal Quality</span>
                      </div>
                      {renderStars(feedback.mealRating)}
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaConciergeBell className="text-purple-500" />
                        <span className="font-medium">Service</span>
                      </div>
                      {renderStars(feedback.serviceRating)}
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaHandSparkles className="text-green-500" />
                        <span className="font-medium">Hygiene</span>
                      </div>
                      {renderStars(feedback.hygieneRating)}
                    </div>
                  </div>

                  {/* Comments */}
                  {feedback.comments && (
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <FiMessageSquare />
                        <span className="font-medium">Comments</span>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm">{feedback.comments}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}