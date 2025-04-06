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

const columns = [
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
      let variant: "default" | "secondary" | "destructive" | "outline"
      
      if (status === "Fully Operational") variant = "default"
      else if (status === "Under Maintenance") variant = "outline"
      else variant = "destructive"

      return <Badge variant={variant}>{status}</Badge>
    },
  },
]

export function HostelTable({ data }: { data: z.infer<typeof hostelSchema>[] }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessorKey || column.id}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((hostel) => (
            <TableRow key={hostel.id}>
              {columns.map((column) => (
                <TableCell key={column.accessorKey || column.id}>
                  {column.cell
                    ? column.cell({ row: { original: hostel } })
                    : hostel[column.accessorKey]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function DataTable({ data }: { data: z.infer<typeof hostelSchema>[] }) {
  return <HostelTable data={data} />
}