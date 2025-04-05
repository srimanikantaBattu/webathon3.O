import { ThemeProvider } from "@/components/theme-provider"
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element:<RootLayout />,
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
