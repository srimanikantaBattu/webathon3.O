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
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-64 mx-auto mb-12" />
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
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
              <Card key={i+3}>
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
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const topMenus = menus.slice(0, 3);
  const bottomMenus = menus.slice(3);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 mb-2">
            Weekly Hostel Menu
          </h1>
          <p className="text-muted-foreground">
            Delicious meals served every day of the week
          </p>
        </div>

        <ScrollArea className="h-[calc(100vh-180px)] rounded-md">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {topMenus.map((menu) => (
              <Card
                key={menu.day}
                className="hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-xl">{menu.day}</span>
                    <Badge variant="outline" className="text-primary">
                      Weekday
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-primary mb-1">
                      <span>🍳</span>
                      <span>Breakfast</span>
                      <span className="text-muted-foreground ml-2">7:00 AM - 9:00 AM</span>
                    </div>
                    <p className="text-foreground">{menu.breakfast}</p>
                  </div>
                  
                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 text-sm text-green-500 mb-1">
                      <span>🍛</span>
                      <span>Lunch</span>
                      <span className="text-muted-foreground ml-2">12:00 PM - 2:00 PM</span>
                    </div>
                    <p className="text-foreground">{menu.lunch}</p>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 text-sm text-yellow-500 mb-1">
                      <span>☕</span>
                      <span>Snacks</span>
                      <span className="text-muted-foreground ml-2">4:00 PM - 5:00 PM</span>
                    </div>
                    <p className="text-foreground">{menu.snacks}</p>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 text-sm text-purple-500 mb-1">
                      <span>🍽️</span>
                      <span>Dinner</span>
                      <span className="text-muted-foreground ml-2">7:00 PM - 9:00 PM</span>
                    </div>
                    <p className="text-foreground">{menu.dinner}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pb-6">
            {bottomMenus.map((menu) => (
              <Card
                key={menu.day}
                className="hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-xl">{menu.day}</span>
                    <Badge variant="outline" className={
                      menu.day === "Saturday" || menu.day === "Sunday" 
                        ? "text-purple-500" 
                        : "text-primary"
                    }>
                      {menu.day === "Saturday" || menu.day === "Sunday" ? "Weekend" : "Weekday"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-primary mb-1">
                      <span>🍳</span>
                      <span>Breakfast</span>
                      <span className="text-muted-foreground ml-2">7:00 AM - 9:00 AM</span>
                    </div>
                    <p className="text-foreground">{menu.breakfast}</p>
                  </div>
                  
                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 text-sm text-green-500 mb-1">
                      <span>🍛</span>
                      <span>Lunch</span>
                      <span className="text-muted-foreground ml-2">12:00 PM - 2:00 PM</span>
                    </div>
                    <p className="text-foreground">{menu.lunch}</p>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 text-sm text-yellow-500 mb-1">
                      <span>☕</span>
                      <span>Snacks</span>
                      <span className="text-muted-foreground ml-2">4:00 PM - 5:00 PM</span>
                    </div>
                    <p className="text-foreground">{menu.snacks}</p>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 text-sm text-purple-500 mb-1">
                      <span>🍽️</span>
                      <span>Dinner</span>
                      <span className="text-muted-foreground ml-2">7:00 PM - 9:00 PM</span>
                    </div>
                    <p className="text-foreground">{menu.dinner}</p>
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