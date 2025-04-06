import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface MenuItem {
  day: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AdminMenuEdit: React.FC = () => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/menu-api`);
        const sortedMenus = DAY_ORDER.map(day => 
          response.data.find((item: MenuItem) => item.day === day)
        ).filter(Boolean) as MenuItem[];
        setMenus(sortedMenus);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editing) {
      setEditing({ 
        ...editing, 
        [e.target.name]: e.target.value 
      });
    }
  };

  const saveChanges = async () => {
    if (!editing) return;
  
    try {
      setLoading(true);
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/menu-api/${editing.day}`,
        editing
      );      
      window.location.reload();
    } catch (err) {
      console.error("Save error:", err);
      window.location.reload();
    }
  };

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
                <CardFooter>
                  <Skeleton className="h-10 w-20" />
                </CardFooter>
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
                <CardFooter>
                  <Skeleton className="h-10 w-20" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
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
            Admin Menu Editor
          </h1>
          <p className="text-muted-foreground">
            Edit the weekly hostel menu
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
                  <CardTitle className="text-xl">{menu.day}</CardTitle>
                </CardHeader>
                
                {editing?.day === menu.day ? (
                  <>
                    <CardContent className="space-y-4">
                      {["breakfast", "lunch", "snacks", "dinner"].map((meal) => (
                        <div key={meal} className="space-y-2">
                          <Label htmlFor={meal} className="capitalize">
                            {meal}
                          </Label>
                          <Input
                            id={meal}
                            name={meal}
                            value={(editing as any)[meal]}
                            onChange={handleChange}
                          />
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setEditing(null)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={saveChanges}>
                        Save Changes
                      </Button>
                    </CardFooter>
                  </>
                ) : (
                  <>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-primary mb-1">
                          <span>🍳</span>
                          <span>Breakfast</span>
                        </div>
                        <p className="text-foreground">{menu.breakfast}</p>
                      </div>
                      
                      <Separator />

                      <div>
                        <div className="flex items-center gap-2 text-sm text-green-500 mb-1">
                          <span>🍛</span>
                          <span>Lunch</span>
                        </div>
                        <p className="text-foreground">{menu.lunch}</p>
                      </div>

                      <Separator />

                      <div>
                        <div className="flex items-center gap-2 text-sm text-yellow-500 mb-1">
                          <span>☕</span>
                          <span>Snacks</span>
                        </div>
                        <p className="text-foreground">{menu.snacks}</p>
                      </div>

                      <Separator />

                      <div>
                        <div className="flex items-center gap-2 text-sm text-purple-500 mb-1">
                          <span>🍽️</span>
                          <span>Dinner</span>
                        </div>
                        <p className="text-foreground">{menu.dinner}</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        onClick={() => setEditing(menu)}
                        className="w-full"
                      >
                        Edit Menu
                      </Button>
                    </CardFooter>
                  </>
                )}
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
                  <CardTitle className="text-xl">{menu.day}</CardTitle>
                </CardHeader>
                
                {editing?.day === menu.day ? (
                  <>
                    <CardContent className="space-y-4">
                      {["breakfast", "lunch", "snacks", "dinner"].map((meal) => (
                        <div key={meal} className="space-y-2">
                          <Label htmlFor={meal} className="capitalize">
                            {meal}
                          </Label>
                          <Input
                            id={meal}
                            name={meal}
                            value={(editing as any)[meal]}
                            onChange={handleChange}
                          />
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setEditing(null)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={saveChanges}>
                        Save Changes
                      </Button>
                    </CardFooter>
                  </>
                ) : (
                  <>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-primary mb-1">
                          <span>🍳</span>
                          <span>Breakfast</span>
                        </div>
                        <p className="text-foreground">{menu.breakfast}</p>
                      </div>
                      
                      <Separator />

                      <div>
                        <div className="flex items-center gap-2 text-sm text-green-500 mb-1">
                          <span>🍛</span>
                          <span>Lunch</span>
                        </div>
                        <p className="text-foreground">{menu.lunch}</p>
                      </div>

                      <Separator />

                      <div>
                        <div className="flex items-center gap-2 text-sm text-yellow-500 mb-1">
                          <span>☕</span>
                          <span>Snacks</span>
                        </div>
                        <p className="text-foreground">{menu.snacks}</p>
                      </div>

                      <Separator />

                      <div>
                        <div className="flex items-center gap-2 text-sm text-purple-500 mb-1">
                          <span>🍽️</span>
                          <span>Dinner</span>
                        </div>
                        <p className="text-foreground">{menu.dinner}</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        onClick={() => setEditing(menu)}
                        className="w-full"
                      >
                        Edit Menu
                      </Button>
                    </CardFooter>
                  </>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AdminMenuEdit;