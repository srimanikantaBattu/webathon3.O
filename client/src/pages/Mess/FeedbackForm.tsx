// import { useState } from "react"
// import axios from "axios"
// import { FaUtensils, FaHandsWash, FaConciergeBell } from "react-icons/fa"
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Button } from "@/components/ui/button"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// interface Feedback {
//   name: string
//   email: string
//   mealRating: string
//   serviceRating: string
//   hygieneRating: string
//   comments?: string
// }

// export default function StudentFeedbackForm() {
//   const [formData, setFormData] = useState<Feedback>({
//     name: "",
//     email: "",
//     mealRating: "",
//     serviceRating: "",
//     hygieneRating: "",
//     comments: "",
//   })
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [submitStatus, setSubmitStatus] = useState<{
//     type: "success" | "error" | null
//     message: string
//   }>({ type: null, message: "" })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleRatingChange = (name: string, value: string) => {
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)
//     setSubmitStatus({ type: null, message: "" })

//     try {
//       const result = await axios.post(
//         `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/feedback-api/upload`,
//         formData
//       );      
//       setSubmitStatus({
//         type: "success",
//         message: "Thank you for your valuable feedback! We've received it successfully."
//       })
//       setFormData({
//         name: "",
//         email: "",
//         mealRating: "",
//         serviceRating: "",
//         hygieneRating: "",
//         comments: "",
//       })
//     } catch (error) {
//       console.error("Error submitting feedback", error)
//       setSubmitStatus({
//         type: "error",
//         message: "Something went wrong. Please try again later."
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const renderStars = (rating: string) => {
//     const stars = []
//     const numRating = Number(rating)
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <span key={i} className={i <= numRating ? "text-yellow-400" : "text-gray-500"}>
//           ★
//         </span>
//       )
//     }
//     return <div className="flex">{stars}</div>
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
//       <div className="max-w-2xl mx-auto">
//         <Card className="border-0 shadow-xl bg-gray-800 overflow-hidden">
//           <CardHeader className="bg-gradient-to-r from-blue-700 to-purple-700 text-white pb-16 relative">
//             <div className="absolute -bottom-6 left-6">
//               <Avatar className="h-12 w-12 border-4 border-gray-800 bg-blue-600">
//                 <AvatarFallback className="bg-blue-600 text-white">DF</AvatarFallback>
//               </Avatar>
//             </div>
//             <CardTitle className="text-3xl font-bold tracking-tight">
//               Dining Feedback
//             </CardTitle>
//             <CardDescription className="text-blue-200">
//               Help us improve your campus dining experience
//             </CardDescription>
//           </CardHeader>
          
//           <CardContent className="pt-20 px-6 pb-6">
//           {submitStatus.type && (
//   <Alert 
//     variant={submitStatus.type === "success" ? "default" : "destructive"} 
//     className={`mb-6 ${
//       submitStatus.type === "success" 
//         ? "bg-green-900/30 border-green-800 text-green-200" 
//         : "bg-gray-700 border-gray-600"
//     }`}
//   >
//     <AlertTitle className="capitalize">{submitStatus.type}</AlertTitle>
//     <AlertDescription>{submitStatus.message}</AlertDescription>
//   </Alert>
// )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="name" className="text-gray-300">Your Name</Label>
//                   <Input
//                     id="name"
//                     name="name"
//                     type="text"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     placeholder="Full name"
//                     className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="text-gray-300">Email Address</Label>
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     placeholder="your.email@example.com"
//                     className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
//                   />
//                 </div>
//               </div>

//               <Separator className="my-6 bg-gray-600" />

//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold text-gray-300">Rate Your Experience</h3>
                
//                 <div className="grid md:grid-cols-3 gap-4">
//                   {/* Meal Quality */}
//                   <div className="space-y-2">
//                     <Label className="flex items-center gap-2 text-gray-300">
//                       <FaUtensils className="text-orange-400" />
//                       <span>Meal Quality</span>
//                     </Label>
//                     <Select
//                       value={formData.mealRating}
//                       onValueChange={(value) => handleRatingChange("mealRating", value)}
//                       required
//                     >
//                       <SelectTrigger className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
//                         <SelectValue placeholder="Select rating" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-gray-800 border-gray-600">
//                         {[1, 2, 3, 4, 5].map(r => (
//                           <SelectItem 
//                             key={`meal-${r}`} 
//                             value={r.toString()}
//                             className="hover:bg-gray-700 focus:bg-gray-700"
//                           >
//                             <div className="flex items-center gap-2">
//                               {renderStars(r.toString())}
//                               <span className="text-gray-400 text-sm">({r})</span>
//                             </div>
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {/* Service */}
//                   <div className="space-y-2">
//                     <Label className="flex items-center gap-2 text-gray-300">
//                       <FaConciergeBell className="text-green-400" />
//                       <span>Service</span>
//                     </Label>
//                     <Select
//                       value={formData.serviceRating}
//                       onValueChange={(value) => handleRatingChange("serviceRating", value)}
//                       required
//                     >
//                       <SelectTrigger className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
//                         <SelectValue placeholder="Select rating" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-gray-800 border-gray-600">
//                         {[1, 2, 3, 4, 5].map(r => (
//                           <SelectItem 
//                             key={`service-${r}`} 
//                             value={r.toString()}
//                             className="hover:bg-gray-700 focus:bg-gray-700"
//                           >
//                             <div className="flex items-center gap-2">
//                               {renderStars(r.toString())}
//                               <span className="text-gray-400 text-sm">({r})</span>
//                             </div>
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {/* Hygiene */}
//                   <div className="space-y-2">
//                     <Label className="flex items-center gap-2 text-gray-300">
//                       <FaHandsWash className="text-blue-400" />
//                       <span>Hygiene</span>
//                     </Label>
//                     <Select
//                       value={formData.hygieneRating}
//                       onValueChange={(value) => handleRatingChange("hygieneRating", value)}
//                       required
//                     >
//                       <SelectTrigger className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
//                         <SelectValue placeholder="Select rating" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-gray-800 border-gray-600">
//                         {[1, 2, 3, 4, 5].map(r => (
//                           <SelectItem 
//                             key={`hygiene-${r}`} 
//                             value={r.toString()}
//                             className="hover:bg-gray-700 focus:bg-gray-700"
//                           >
//                             <div className="flex items-center gap-2">
//                               {renderStars(r.toString())}
//                               <span className="text-gray-400 text-sm">({r})</span>
//                             </div>
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </div>

//               <Separator className="my-6 bg-gray-600" />

//               <div className="space-y-2">
//                 <Label htmlFor="comments" className="text-gray-300">Additional Comments</Label>
//                 <Textarea
//                   id="comments"
//                   name="comments"
//                   value={formData.comments}
//                   onChange={handleChange}
//                   rows={4}
//                   placeholder="What did you enjoy? How can we improve?"
//                   className="resize-none bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
//                 />
//               </div>

//               <div className="pt-4">
//                 <Button 
//                   type="submit" 
//                   className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
//                   size="lg"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Submitting...
//                     </>
//                   ) : (
//                     "Submit Feedback"
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>

//         <div className="mt-6 text-center text-sm text-gray-400">
//           Your feedback helps us serve you better. We appreciate your time!
//         </div>
//       </div>
//     </div>
//   )
// }






import { useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Sandwich,
  Soup,
  Coffee,
  ShieldCheck,
  CircleUser,
  Mail,
  Loader2
} from "lucide-react";

interface Feedback {
  name: string;
  email: string;
  mealRating: string;
  serviceRating: string;
  hygieneRating: string;
  comments?: string;
}

export default function StudentFeedbackForm() {
  const [formData, setFormData] = useState<Feedback>({
    name: "",
    email: "",
    mealRating: "",
    serviceRating: "",
    hygieneRating: "",
    comments: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/feedback-api/upload`,
        formData
      );
      setSubmitStatus({
        type: "success",
        message: "Thank you for your valuable feedback!",
      });
      setFormData({
        name: "",
        email: "",
        mealRating: "",
        serviceRating: "",
        hygieneRating: "",
        comments: "",
      });
    } catch (error) {
      console.error("Error submitting feedback", error);
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: string) => {
    const stars = [];
    const numRating = Number(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= numRating ? "text-yellow-400" : "text-gray-500"}
        >
          ★
        </span>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-md mx-auto">
        <Card className="border bg-card text-card-foreground shadow-sm">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Dining Feedback
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Help us improve your campus dining experience
                </CardDescription>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <CircleUser className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </div>
          </CardHeader>

          <CardContent>
            {submitStatus.type && (
              <Alert
                variant={submitStatus.type === "success" ? "default" : "destructive"}
                className="mb-6"
              >
                <AlertTitle className="capitalize">
                  {submitStatus.type}
                </AlertTitle>
                <AlertDescription>{submitStatus.message}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <CircleUser className="h-4 w-4" />
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Rate Your Experience</h3>

                <div className="grid gap-4">
                  {/* Meal Quality */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Sandwich className="h-4 w-4 text-orange-400" />
                      <span>Meal Quality</span>
                    </Label>
                    <Select
                      value={formData.mealRating}
                      onValueChange={(value) =>
                        handleRatingChange("mealRating", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((r) => (
                          <SelectItem key={`meal-${r}`} value={r.toString()}>
                            <div className="flex items-center gap-2">
                              {renderStars(r.toString())}
                              <span className="text-muted-foreground text-sm">
                                ({r})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Service */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Soup className="h-4 w-4 text-green-400" />
                      <span>Service</span>
                    </Label>
                    <Select
                      value={formData.serviceRating}
                      onValueChange={(value) =>
                        handleRatingChange("serviceRating", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((r) => (
                          <SelectItem key={`service-${r}`} value={r.toString()}>
                            <div className="flex items-center gap-2">
                              {renderStars(r.toString())}
                              <span className="text-muted-foreground text-sm">
                                ({r})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Hygiene */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-blue-400" />
                      <span>Hygiene</span>
                    </Label>
                    <Select
                      value={formData.hygieneRating}
                      onValueChange={(value) =>
                        handleRatingChange("hygieneRating", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((r) => (
                          <SelectItem key={`hygiene-${r}`} value={r.toString()}>
                            <div className="flex items-center gap-2">
                              {renderStars(r.toString())}
                              <span className="text-muted-foreground text-sm">
                                ({r})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="comments" className="flex items-center gap-2">
                  <Coffee className="h-4 w-4" />
                  Additional Comments
                </Label>
                <Textarea
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  rows={4}
                  placeholder="What did you enjoy? How can we improve?"
                />
              </div>

              <CardFooter className="px-0 pb-0 pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Feedback
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Your feedback helps us serve you better. We appreciate your time!
        </div>
      </div>
    </div>
  );
}