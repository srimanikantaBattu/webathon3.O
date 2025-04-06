import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"

const hostelData : any = [
  {
    id: 1,
    block: "A",
    totalRooms: 50,
    occupied: 48,
    available: 2,
    maintenance: 3,
    status: "Fully Operational"
  },
  {
    id: 2,
    block: "B",
    totalRooms: 60,
    occupied: 55,
    available: 5,
    maintenance: 2,
    status: "Under Maintenance"
  },
  {
    id: 3,
    block: "C",
    totalRooms: 40,
    occupied: 38,
    available: 2,
    maintenance: 5,
    status: "Fully Operational"
  },
  {
    id: 4,
    block: "D",
    totalRooms: 55,
    occupied: 50,
    available: 5,
    maintenance: 1,
    status: "Fully Operational"
  },
  {
    id: 5,
    block: "E",
    totalRooms: 45,
    occupied: 30,
    available: 15,
    maintenance: 4,
    status: "Partially Closed"
  },
]

function Dashboard() {
  return (
    <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <div className="px-4 lg:px-6">
                <h2 className="mb-4 text-xl font-semibold">Hostel Block Status</h2>
                <DataTable data={hostelData} />
              </div>
            </div>
          </div>
        </div>
  )
}

export default Dashboard