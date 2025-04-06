import { IconCalendarEvent, IconUsers, IconBed, IconSoup } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className=":data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark::data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Current Residents Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Current Residents</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1250
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="flex items-center gap-1">
              <IconUsers className="size-4" />
              95% Occupancy
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <span className="text-green-500">12 new arrivals this week</span>
          </div>
          <div className="text-muted-foreground">
            Capacity: 360 beds across 4 blocks
          </div>
        </CardFooter>
      </Card>

      {/* Upcoming Events Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Upcoming Events</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            3 Events
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="flex items-center gap-1">
              <IconCalendarEvent className="size-4" />
              This Week
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Cultural Night (Fri), Sports Day (Sat)
          </div>
          <div className="text-muted-foreground">
            Check notice board for details
          </div>
        </CardFooter>
      </Card>

      {/* Meal Satisfaction Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Meal Satisfaction</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            82%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="flex items-center gap-1">
              <IconSoup className="size-4" />
              +5% this month
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Today's special: Butter Chicken
          </div>
          <div className="text-muted-foreground">
            Based on recent feedback surveys
          </div>
        </CardFooter>
      </Card>

      {/* Maintenance Requests Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Maintenance Status</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            8 Open
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="flex items-center gap-1">
              <IconBed className="size-4" />
              90% Resolved
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Avg. resolution time: 2.1 days
          </div>
          <div className="text-muted-foreground">
            Submit requests via hostel portal
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}