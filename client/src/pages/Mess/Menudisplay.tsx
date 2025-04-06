import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  day: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

// Define the correct day order
const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const MenuDisplay: React.FC = () => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/menu-api`
        );
        
        // Sort the menu items according to DAY_ORDER
        const sortedMenus = DAY_ORDER.map(day => 
          response.data.find((item: MenuItem) => item.day === day)
        ).filter(Boolean) as MenuItem[];
        
        setMenus(sortedMenus);
      } catch (err) {
        setError("Failed to load menu data. Please try again later.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-64 mx-auto mb-12" />
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i+3} className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-8">
        <Card className="max-w-md border-red-500/30 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-red-500">Error Loading Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Split menus into top (Mon-Wed) and bottom (Thu-Sun)
  const topMenus = menus.slice(0, 3);
  const bottomMenus = menus.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            Weekly Hostel Menu
          </h1>
          <p className="text-gray-400">
            Delicious meals served every day of the week
          </p>
        </div>

        <ScrollArea className="h-[calc(100vh-180px)] rounded-md">
          {/* Top row - 3 cards (Monday to Wednesday) */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {topMenus.map((menu) => (
              <Card
                key={menu.day}
                className="border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-colors hover:shadow-lg hover:-translate-y-1"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-xl">{menu.day}</span>
                    <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                      Weekday
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-blue-300 mb-1">
                      <span>🍳</span>
                      <span>Breakfast</span>
                      <span className="text-gray-400 ml-2">7:00 AM - 9:00 AM</span>
                    </div>
                    <p className="text-gray-300">{menu.breakfast}</p>
                  </div>
                  
                  <Separator className="bg-gray-700" />

                  <div>
                    <div className="flex items-center gap-2 text-sm text-green-300 mb-1">
                      <span>🍛</span>
                      <span>Lunch</span>
                      <span className="text-gray-400 ml-2">12:00 PM - 2:00 PM</span>
                    </div>
                    <p className="text-gray-300">{menu.lunch}</p>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div>
                    <div className="flex items-center gap-2 text-sm text-yellow-300 mb-1">
                      <span>☕</span>
                      <span>Snacks</span>
                      <span className="text-gray-400 ml-2">4:00 PM - 5:00 PM</span>
                    </div>
                    <p className="text-gray-300">{menu.snacks}</p>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div>
                    <div className="flex items-center gap-2 text-sm text-purple-300 mb-1">
                      <span>🍽️</span>
                      <span>Dinner</span>
                      <span className="text-gray-400 ml-2">7:00 PM - 9:00 PM</span>
                    </div>
                    <p className="text-gray-300">{menu.dinner}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom row - 4 cards (Thursday to Sunday) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pb-6">
            {bottomMenus.map((menu) => (
              <Card
                key={menu.day}
                className="border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-colors hover:shadow-lg hover:-translate-y-1"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-xl">{menu.day}</span>
                    <Badge variant="outline" className={menu.day === "Saturday" || menu.day === "Sunday" 
                      ? "border-purple-500/50 text-purple-400" 
                      : "border-blue-500/50 text-blue-400"}>
                      {menu.day === "Saturday" || menu.day === "Sunday" ? "Weekend" : "Weekday"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-blue-300 mb-1">
                      <span>🍳</span>
                      <span>Breakfast</span>
                      <span className="text-gray-400 ml-2">7:00 AM - 9:00 AM</span>
                    </div>
                    <p className="text-gray-300">{menu.breakfast}</p>
                  </div>
                  
                  <Separator className="bg-gray-700" />

                  <div>
                    <div className="flex items-center gap-2 text-sm text-green-300 mb-1">
                      <span>🍛</span>
                      <span>Lunch</span>
                      <span className="text-gray-400 ml-2">12:00 PM - 2:00 PM</span>
                    </div>
                    <p className="text-gray-300">{menu.lunch}</p>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div>
                    <div className="flex items-center gap-2 text-sm text-yellow-300 mb-1">
                      <span>☕</span>
                      <span>Snacks</span>
                      <span className="text-gray-400 ml-2">4:00 PM - 5:00 PM</span>
                    </div>
                    <p className="text-gray-300">{menu.snacks}</p>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div>
                    <div className="flex items-center gap-2 text-sm text-purple-300 mb-1">
                      <span>🍽️</span>
                      <span>Dinner</span>
                      <span className="text-gray-400 ml-2">7:00 PM - 9:00 PM</span>
                    </div>
                    <p className="text-gray-300">{menu.dinner}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MenuDisplay;