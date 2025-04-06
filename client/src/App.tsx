import { ThemeProvider } from "@/components/theme-provider"
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import Dashboard from "./pages/Dashboard";
import UploadComplaint from "./pages/Complaints/UploadComplaint";
import AddPaymentDetails from "./pages/Payment/AdminPaymentDetails";
import UserPayment from "./pages/Payment/UserPayment";
import { Toaster } from "sonner";
import CheckUser from "./pages/CheckUser/CheckUser";
import SendEmails from "./pages/Payment/SendEmails";
import RequestOuting from "./pages/Attendance/RequestOuting";
import CheckOutings from "./pages/Attendance/CheckOutings";
import MenuDisplay from "./pages/Mess/Menudisplay";
import StudentFeedbackForm from "./pages/Mess/FeedbackForm";
import AdminFeedbackList from "./pages/Mess/AdminFeedbackView";
import AdminMenuEdit from "./pages/Mess/AdminMenuEdit";
function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element:<RootLayout />,
      children: [
        {
          index: true,
          element: <Dashboard></Dashboard>,
        },
        {
          path: "/upload-data",
          element: <Register />,
        },{
          path: "/upload-complaint",
          element: <UploadComplaint />,
        },{
          path:"/check-user",
          element: <CheckUser />
        },{
          path:"/add-payments",
          element:<AddPaymentDetails />
        },{
          path:"/payment-details",
          element:<UserPayment />
        },{
          path:"/send-emails",
          element:<SendEmails />
        },{
          path:"/request-outings",
          element:<RequestOuting />
        },{
          path:"/check-outings",
          element:<CheckOutings />
        },{
          path:"/menu",
          element:<MenuDisplay />
        },{
          path:"/feedback",
          element:<StudentFeedbackForm />
        },{
          path:"/admin/feedback",
          element:<AdminFeedbackList />
        },{
          path:"/admin/menu",
          element:<AdminMenuEdit />
        }
      ]
    }
  ]);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="">
        <RouterProvider router={router}></RouterProvider>
      </div>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
    
  );
}

export default App;
