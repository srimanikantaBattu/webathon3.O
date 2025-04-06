import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface UserLocation {
  username: string;
  latitude?: number;
  longitude?: number;
  timestamp?: string;
  mobile: string;
  father_mobile: string;
}

export const NearbyUsers: React.FC = () => {
  const [users, setUsers] = useState<UserLocation[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserLocation | null>(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [loading, setLoading] = useState({
    users: true,
    location: false,
  });
  const [error, setError] = useState({
    users: "",
    location: "",
  });

  useEffect(() => {
    const fetchNearbyUsers = async () => {
      try {
        setLoading(prev => ({ ...prev, users: true }));
        setError(prev => ({ ...prev, users: "" }));

        const res = await fetch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/locations-api/nearby-users`
        );
        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();

        // Add static mobile and father_mobile values
        const users: UserLocation[] =
          data?.nearbyUsers?.map((user: any, index: number) => ({
            username: user.username,
            mobile: `98765432${10 + index}`,
            father_mobile: `91234567${10 + index}`,
          })) ?? [];

        setUsers(users);
      } catch (err: any) {
        console.error("Error fetching nearby users:", err);
        setError(prev => ({ ...prev, users: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, users: false }));
      }
    };

    fetchNearbyUsers();
  }, []);

  const trackUserLocation = async (username: string) => {
    try {
      setLoading(prev => ({ ...prev, location: true }));
      setError(prev => ({ ...prev, location: "" }));
      setMapVisible(false);

      const res = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/locations-api/location/${username}`
      );

      if (!res.ok) throw new Error("Failed to fetch location");

      const data = await res.json();

      const userData = users.find(user => user.username === username);

      if (data.latitude && data.longitude && userData) {
        setSelectedUser({
          ...userData,
          latitude: data.latitude,
          longitude: data.longitude,
          timestamp: data.timestamp,
        });
        setMapVisible(true);
      } else {
        throw new Error("No location data available");
      }
    } catch (err: any) {
      console.error("Error fetching user location:", err);
      setError(prev => ({ ...prev, location: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, location: false }));
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Far Users Tracker</span>
            <Badge variant="outline">500m+ from Hostel</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading.users ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : error.users ? (
            <div className="text-destructive p-4 rounded-lg bg-destructive/10">
              Error loading users: {error.users}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Father Mobile</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.mobile}</TableCell>
                      <TableCell>{user.father_mobile}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => trackUserLocation(user.username)}
                          disabled={loading.location}
                        >
                          {loading.location && selectedUser?.username === user.username ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Track Location
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No users found beyond 500 meters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {mapVisible && selectedUser && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>
              Tracking:{" "}
              <span className="text-primary">{selectedUser.username}</span>
            </CardTitle>
            {selectedUser.timestamp && (
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(selectedUser.timestamp).toLocaleString()}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {loading.location ? (
              <Skeleton className="w-full h-[400px]" />
            ) : error.location ? (
              <div className="text-destructive p-4 rounded-lg bg-destructive/10">
                Error loading map: {error.location}
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <iframe
                  width="100%"
                  height="400px"
                  frameBorder="0"
                  scrolling="no"
                  src={`https://maps.google.com/maps?q=${selectedUser.latitude},${selectedUser.longitude}&z=15&output=embed`}
                  className="border-0"
                  allowFullScreen
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Coordinates: {selectedUser.latitude?.toFixed(6)},{" "}
            {selectedUser.longitude?.toFixed(6)}
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default NearbyUsers;
