"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Clock } from "lucide-react"

type SlotBookingProps = {
  location: {
    id: string
    name: string
  }
}

// Mock data for available slots
const AVAILABLE_SLOTS = [
  { id: 1, time: "06:00 AM - 08:00 AM", available: true },
  { id: 2, time: "08:00 AM - 10:00 AM", available: false },
  { id: 3, time: "10:00 AM - 12:00 PM", available: true },
  { id: 4, time: "12:00 PM - 02:00 PM", available: true },
  { id: 5, time: "02:00 PM - 04:00 PM", available: false },
  { id: 6, time: "04:00 PM - 06:00 PM", available: true },
  { id: 7, time: "06:00 PM - 08:00 PM", available: true },
]

export default function SlotBooking({ location }: SlotBookingProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSlotSelect = (slotId: number) => {
    setSelectedSlot(slotId)
  }

  const handleBooking = () => {
    // In a real app, this would send the booking data to a server
    setBookingComplete(true)
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <h2 className="text-2xl font-bold text-white">Book a Slot - {location.name}</h2>
      </div>

      {bookingComplete ? (
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6 text-center">
          <CheckCircle2 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Booking Confirmed!</h3>
          <p className="text-blue-300 mb-4">
            Your slot has been booked successfully for {date?.toLocaleDateString()} at{" "}
            {AVAILABLE_SLOTS.find((slot) => slot.id === selectedSlot)?.time}.
          </p>
          <Button
            onClick={() => setBookingComplete(false)}
            variant="outline"
            className="border-blue-500 text-blue-300 hover:bg-blue-900/50"
          >
            Book Another Slot
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-[#0a2e52] border-blue-800 text-white">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4 text-blue-300">1. Select Date</h3>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border border-blue-800 bg-[#0a2e52] text-white"
                styles={{
                  // day_today: { backgroundColor: "#1e40af" },
                  // day_selected: { backgroundColor: "#3b82f6", color: "white" },
                }}
                disabled={(date) => {
                  // Disable past dates
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  return date < today
                }}
              />
            </CardContent>
          </Card>

          <Card className="bg-[#0a2e52] border-blue-800 text-white">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4 text-blue-300">2. Select Time Slot</h3>
              <div className="space-y-3">
                {AVAILABLE_SLOTS.map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-3 rounded-md border ${
                      !slot.available
                        ? "bg-blue-900/20 border-blue-900 cursor-not-allowed opacity-60"
                        : selectedSlot === slot.id
                          ? "bg-blue-900/30 border-blue-500"
                          : "border-blue-800 hover:bg-blue-900/20 cursor-pointer"
                    }`}
                    onClick={() => slot.available && handleSlotSelect(slot.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-400" />
                        <span className="text-blue-100">{slot.time}</span>
                      </div>
                      {!slot.available ? (
                        <span className="text-sm text-blue-400">Booked</span>
                      ) : selectedSlot === slot.id ? (
                        <CheckCircle2 className="h-5 w-5 text-blue-400" />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2 flex justify-center">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={!selectedSlot} className="bg-blue-600 hover:bg-blue-700">
                  Confirm Booking
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-[#0a2e52] text-white border-blue-800">
                <DialogHeader>
                  <DialogTitle className="text-white">Confirm Booking Details</DialogTitle>
                  <DialogDescription className="text-blue-300">
                    Please review your booking information before confirming.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right text-blue-300">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={location.name}
                      className="col-span-3 bg-blue-900/20 border-blue-700 text-white"
                      readOnly
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right text-blue-300">
                      Date
                    </Label>
                    <Input
                      id="date"
                      value={date?.toLocaleDateString()}
                      className="col-span-3 bg-blue-900/20 border-blue-700 text-white"
                      readOnly
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right text-blue-300">
                      Time
                    </Label>
                    <Input
                      id="time"
                      value={AVAILABLE_SLOTS.find((slot) => slot.id === selectedSlot)?.time || ""}
                      className="col-span-3 bg-blue-900/20 border-blue-700 text-white"
                      readOnly
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right text-blue-300">
                      Your Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      className="col-span-3 bg-blue-900/20 border-blue-700 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right text-blue-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="col-span-3 bg-blue-900/20 border-blue-700 text-white"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleBooking} className="bg-blue-600 hover:bg-blue-700">
                    Confirm Booking
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  )
}

