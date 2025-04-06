import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { z } from "zod"

export const hostelSchema = z.object({
  id: z.number(),
  block: z.string(),
  totalRooms: z.number(),
  occupied: z.number(),
  available: z.number(),
  maintenance: z.number(),
  status: z.string(),
})

type Hostel = z.infer<typeof hostelSchema>

// Define a type for our column configuration
type ColumnDef = {
  accessorKey: keyof Hostel | 'occupancyRate';
  header: string;
  id?: string;
  cell?: ({ row }: { row: { original: Hostel } }) => React.ReactNode;
}

const columns: ColumnDef[] = [
  {
    accessorKey: "block",
    header: "Block",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.block}</span>
    ),
  },
  {
    accessorKey: "totalRooms",
    header: "Total Rooms",
  },
  {
    accessorKey: "occupied",
    header: "Occupied",
  },
  {
    accessorKey: "available",
    header: "Available",
  },
  {
    accessorKey: "occupancyRate",
    header: "Occupancy Rate",
    cell: ({ row }) => (
      <span>
        {Math.round((row.original.occupied / row.original.totalRooms) * 100)}%
      </span>
    ),
  },
  {
    accessorKey: "maintenance",
    header: "Maintenance",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      let variant: "default" | "secondary" | "destructive" | "outline" = "default"
      
      if (status === "Fully Operational") variant = "default"
      else if (status === "Under Maintenance") variant = "outline"
      else variant = "destructive"

      return <Badge variant={variant}>{status}</Badge>
    },
  },
]

export function HostelTable({ data }: { data: Hostel[] }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessorKey.toString()}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((hostel) => (
            <TableRow key={hostel.id}>
              {columns.map((column) => (
                <TableCell key={column.accessorKey.toString()}>
                  {column.cell
                    ? column.cell({ row: { original: hostel } })
                    : column.accessorKey !== 'occupancyRate' 
                      ? hostel[column.accessorKey as keyof Hostel]
                      : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function DataTable({ data }: { data: Hostel[] }) {
  return <HostelTable data={data} />
}