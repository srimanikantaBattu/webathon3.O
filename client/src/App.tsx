import { ThemeProvider } from "@/components/theme-provider"
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import Dashboard from "./pages/Dashboard";
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
          path: "/register",
          element: <Register />,
        },
      ]
    }
  ]);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="">
        <RouterProvider router={router}></RouterProvider>
      </div>
    </ThemeProvider>
    
  );
}

export default App;
