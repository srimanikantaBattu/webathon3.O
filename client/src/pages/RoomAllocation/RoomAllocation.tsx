"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Building, Building2, Layers, Users, UserPlus, UserMinus, ClipboardList } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Define types for the data
interface Student {
  id: number
  name: string
  year: string
  department: string
}

interface Room {
  id: number
  capacity: number
  occupants: number
  blockId: number
  floorId: number
  assignedStudents: Student[]
}

interface RoomsMap {
  [key: string]: Room[]
}

interface VacantRoomsMap {
  [key: string]: Room[]
}

// Mock data for demonstration
const mockStudents: Student[] = [
  { id: 1, name: "Alex Johnson", year: "2nd Year", department: "Computer Science" },
  { id: 2, name: "Sam Wilson", year: "1st Year", department: "Electrical Engineering" },
  { id: 3, name: "Jamie Smith", year: "3rd Year", department: "Mechanical Engineering" },
  { id: 4, name: "Taylor Brown", year: "2nd Year", department: "Civil Engineering" },
  { id: 5, name: "Jordan Lee", year: "4th Year", department: "Information Technology" },
  { id: 6, name: "Casey Martin", year: "1st Year", department: "Electronics" },
  { id: 7, name: "Riley Garcia", year: "3rd Year", department: "Computer Science" },
  { id: 8, name: "Quinn Miller", year: "2nd Year", department: "Biotechnology" },
  { id: 9, name: "Morgan Davis", year: "1st Year", department: "Physics" },
  { id: 10, name: "Avery Wilson", year: "3rd Year", department: "Chemistry" },
  { id: 11, name: "Drew Thompson", year: "2nd Year", department: "Mathematics" },
  { id: 12, name: "Blake Anderson", year: "4th Year", department: "Biology" },
  { id: 13, name: "Cameron White", year: "1st Year", department: "Architecture" },
  { id: 14, name: "Jordan Black", year: "3rd Year", department: "Psychology" },
  { id: 15, name: "Taylor Green", year: "2nd Year", department: "Economics" },
]

// Generate mock room data with assigned students
const generateRooms = (blockId: number, floorId: number): Room[] => {
  return Array.from({ length: 12 }, (_, i) => {
    const occupants = Math.floor(Math.random() * 4)
    const assignedStudents: Student[] = []

    // Randomly assign students to rooms
    if (occupants > 0) {
      const availableStudents = [...mockStudents]
      for (let j = 0; j < occupants; j++) {
        if (availableStudents.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableStudents.length)
          assignedStudents.push(availableStudents[randomIndex])
          availableStudents.splice(randomIndex, 1)
        }
      }
    }

    return {
      id: i + 1,
      capacity: 4,
      occupants: occupants,
      blockId,
      floorId,
      assignedStudents,
    }
  })
}

const RoomAllocation = () => {
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null)
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [allRooms, setAllRooms] = useState<RoomsMap>({})
  const [showAllocationDialog, setShowAllocationDialog] = useState<boolean>(false)
  const [showOccupantsDialog, setShowOccupantsDialog] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<"normal" | "vacancies">("normal") // 'normal' or 'vacancies'
  const [vacantRooms, setVacantRooms] = useState<VacantRoomsMap>({})

  // Initialize or update rooms when block/floor changes
  useEffect(() => { 
    if (selectedBlock && selectedFloor) {
      const key = `block${selectedBlock}-floor${selectedFloor}`
      if (!allRooms[key]) {
        const newRooms = generateRooms(selectedBlock, selectedFloor)
        setRooms(newRooms)
        setAllRooms((prev) => ({
          ...prev,
          [key]: newRooms,
        }))
      } else {
        setRooms(allRooms[key])
      }
    }
  }, [selectedBlock, selectedFloor, allRooms])

  // Update vacant rooms when block changes or rooms are updated
  useEffect(() => {
    if (selectedBlock) {
      const vacant: VacantRoomsMap = {}

      // Generate all floors if they don't exist yet
      for (let floor = 1; floor <= 10; floor++) {
        const key = `block${selectedBlock}-floor${floor}`

        if (!allRooms[key]) {
          const newRooms = generateRooms(selectedBlock, floor)
          setAllRooms((prev) => ({
            ...prev,
            [key]: newRooms,
          }))

          // Filter vacant rooms
          vacant[floor] = newRooms.filter((room) => room.occupants < room.capacity)
        } else {
          // Filter vacant rooms from existing data
          vacant[floor] = allRooms[key].filter((room) => room.occupants < room.capacity)
        }
      }

      setVacantRooms(vacant)
    }
  }, [selectedBlock, allRooms])

  // Function to handle block selection
  const handleBlockSelect = (blockId: number) => {
    setSelectedBlock(blockId)
    setSelectedFloor(null)
    setSelectedRoom(null)
    setViewMode("normal")
  }

  // Function to handle floor selection
  const handleFloorSelect = (floorId: number) => {
    setSelectedFloor(floorId)
    setSelectedRoom(null)
    setViewMode("normal")
  }

  // Function to handle room selection
  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room)
  }

  // Function to toggle to vacancies view
  const toggleVacanciesView = () => {
    setViewMode(viewMode === "normal" ? "vacancies" : "normal")
    setSelectedFloor(null)
  }

  // Function to add a student to a room
  const addStudentToRoom = (studentId: number) => {
    const student = mockStudents.find((s) => s.id === studentId)
    if (!student || !selectedRoom) return

    const updatedRooms = rooms.map((room) => {
      if (room.id === selectedRoom.id) {
        return {
          ...room,
          occupants: room.occupants + 1,
          assignedStudents: [...room.assignedStudents, student],
        }
      }
      return room
    })

    setRooms(updatedRooms)
    updateAllRooms(updatedRooms)
    setShowAllocationDialog(false)
  }

  // Function to remove a student from a room
  const removeStudentFromRoom = (studentId: number) => {
    if (!selectedRoom) return

    const updatedRooms = rooms.map((room) => {
      if (room.id === selectedRoom.id) {
        const updatedAssignedStudents = room.assignedStudents.filter((student) => student.id !== studentId)

        return {
          ...room,
          occupants: room.occupants - 1,
          assignedStudents: updatedAssignedStudents,
        }
      }
      return room
    })

    setRooms(updatedRooms)
    updateAllRooms(updatedRooms)
  }

  // Helper function to update the allRooms state
  const updateAllRooms = (updatedRooms: Room[]) => {
    if (!selectedBlock || !selectedFloor) return

    setAllRooms((prev) => ({
      ...prev,
      [`block${selectedBlock}-floor${selectedFloor}`]: updatedRooms,
    }))
  }

  // Function to get available students (not already assigned to the selected room)
  const getAvailableStudents = (): Student[] => {
    if (!selectedRoom) return mockStudents

    const assignedStudentIds = selectedRoom.assignedStudents.map((student) => student.id)
    return mockStudents.filter((student) => !assignedStudentIds.includes(student.id))
  }

  return (
    <div className="min-h-screen bg-[#18181B] text-white p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Building className="mr-2" /> Hostel Room Allocation
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left sidebar for navigation */}
        <div className="lg:col-span-3 space-y-6">
          {!selectedBlock && (
            <div className="border border-black rounded-lg p-4 bg-neutral-800">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Building2 className="mr-2" /> Select Block
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {[1, 2, 3, 4].map((blockId) => (
                  <Button
                    key={blockId}
                    variant="outline"
                    className="h-16 border-black hover:bg-blue-900 hover:text-white"
                    onClick={() => handleBlockSelect(blockId)}
                  >
                    Block {blockId}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectedBlock && viewMode === "normal" && !selectedFloor && (
            <div className="border border-black rounded-lg p-4 bg-neutral-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Layers className="mr-2" /> Select Floor
                </h2>
                <Button variant="outline" size="sm" onClick={() => setSelectedBlock(null)} className="border-black hover:cursor-pointer">
                  Back to Blocks
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((floorId) => (
                  <Button
                    key={floorId}
                    variant="outline"
                    className="h-12 border-black hover:bg-blue-900 hover:text-white hover:cursor-pointer"
                    onClick={() => handleFloorSelect(floorId)}
                  >
                    Floor {floorId}
                  </Button>
                ))}
              </div>

              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full border-green-400 text-green-400 hover:bg-green-900 hover:text-white"
                  onClick={toggleVacanciesView}
                >
                  <ClipboardList className="mr-2 h-4 w-4" /> View All Vacancies
                </Button>
              </div>
            </div>
          )}

          {selectedBlock && viewMode === "vacancies" && (
            <div className="border border-black rounded-lg p-4 bg-neutral-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <ClipboardList className="mr-2" /> Vacancies View
                </h2>
                <Button variant="outline" size="sm" onClick={() => toggleVacanciesView()} className="border-black hover:cursor-pointer">
                  Normal View
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBlock(null)}
                className="border-black mb-4 w-full hover:cursor-pointer"
              >
                Back to Blocks
              </Button>
            </div>
          )}

          {selectedFloor && viewMode === "normal" && (
            <div className="border border-black rounded-lg p-4 bg-neutral-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Navigation</h2>
              </div>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-black hover:bg-blue-900 hover:text-white hover:cursor-pointer" 
                  onClick={() => setSelectedBlock(null)}
                >
                  ← All Blocks
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-black hover:bg-blue-900 hover:text-white hover:cursor-pointer"
                  onClick={() => setSelectedFloor(null)}
                >
                  ← Block {selectedBlock} Floors
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-green-400 text-green-400 hover:bg-green-900 hover:text-white"
                  onClick={toggleVacanciesView}
                >
                  <ClipboardList className="mr-2 h-4 w-4" /> View All Vacancies
                </Button>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Current Location:</h3>
                <div className="text-sm space-y-1 text-blue-200">
                  <p>Block: {selectedBlock}</p>
                  <p>Floor: {selectedFloor}</p>
                  {selectedRoom && <p>Room: {selectedRoom.id}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main content area */}
        <div className="lg:col-span-9">
          <div className="border border-black rounded-lg p-4 bg-neutral-800 min-h-[600px]">
            {!selectedBlock && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-blue-300">
                  <Building2 className="mx-auto h-16 w-16 mb-4" />
                  <h2 className="text-xl font-medium">Select a block to begin</h2>
                  <p className="mt-2 text-blue-400">Choose one of the four hostel blocks from the left panel</p>
                </div>
              </div>
            )}

            {selectedBlock && viewMode === "normal" && !selectedFloor && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-blue-300">
                  <Layers className="mx-auto h-16 w-16 mb-4" />
                  <h2 className="text-xl font-medium">Block {selectedBlock} Selected</h2>
                  <p className="mt-2 text-blue-400">Now select a floor from the left panel</p>
                </div>
              </div>
            )}

            {selectedBlock && viewMode === "vacancies" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Block {selectedBlock} - All Vacant Rooms</h2>

                <Tabs defaultValue="1" className="w-full">
                  <TabsList className="grid grid-cols-5 mb-4">
                    {[1, 2, 3, 4, 5].map((floor) => (
                      <TabsTrigger key={floor} value={floor.toString()}>
                        Floor {floor}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <TabsList className="grid grid-cols-5 mb-6">
                    {[6, 7, 8, 9, 10].map((floor) => (
                      <TabsTrigger key={floor} value={floor.toString()}>
                        Floor {floor}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {Object.keys(vacantRooms).map((floor) => (
                    <TabsContent key={floor} value={floor.toString()}>
                      {vacantRooms[floor].length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {vacantRooms[floor].map((room) => (
                            <div
                              key={room.id}
                              className="border border-green-400 rounded-lg p-4 hover:bg-[#0d3b6b] transition-colors"
                            >
                              <div className="flex justify-between items-start">
                                <h3 className="text-lg font-medium">Room {room.id}</h3>
                                <Badge variant="outline" className="border-green-400 text-green-400">
                                  {room.capacity - room.occupants} Vacancies
                                </Badge>
                              </div>
                              <div className="mt-4 flex items-center text-sm">
                                <Users className="mr-2 h-4 w-4" />
                                <span>
                                  {room.occupants}/{room.capacity} Occupied
                                </span>
                              </div>
                              <div className="mt-4 flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 border-black hover:bg-blue-900"
                                  onClick={() => {
                                    setSelectedFloor(Number.parseInt(floor))
                                    setSelectedRoom(room)
                                    setShowAllocationDialog(true)
                                  }}
                                >
                                  <UserPlus className="mr-2 h-4 w-4" /> Allocate
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 border-black hover:bg-blue-900"
                                  onClick={() => {
                                    setSelectedFloor(Number.parseInt(floor))
                                    handleFloorSelect(Number.parseInt(floor))
                                  }}
                                >
                                  View Floor
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Alert>
                          <AlertDescription>No vacant rooms on Floor {floor}</AlertDescription>
                        </Alert>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}

            {selectedBlock && selectedFloor && viewMode === "normal" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">
                  Block {selectedBlock}, Floor {selectedFloor} - Room Layout
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rooms.map((room) => {
                    const isVacant = room.occupants < room.capacity
                    return (
                      <div
                        key={room.id}
                        className={`border ${isVacant ? "border-green-400" : "border-red-400"} rounded-lg p-4 hover:bg-[#0d3b6b] transition-colors`}
                        onClick={() => handleRoomSelect(room)}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium">Room {room.id}</h3>
                          <Badge
                            variant={isVacant ? "outline" : "secondary"}
                            className={isVacant ? "border-green-400 text-green-400" : "bg-red-900 text-white"}
                          >
                            {isVacant ? `${room.capacity - room.occupants} Vacancy` : "Full"}
                          </Badge>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                          <Users className="mr-2 h-4 w-4" />
                          <span>
                            {room.occupants}/{room.capacity} Occupied
                          </span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          {isVacant && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 border-green-400 text-green-400 hover:bg-green-900 hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRoomSelect(room)
                                setShowAllocationDialog(true)
                              }}
                            >
                              <UserPlus className="mr-2 h-4 w-4" /> Allocate
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-black hover:bg-blue-900 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRoomSelect(room)
                              setShowOccupantsDialog(true)
                            }}
                          >
                            <Users className="mr-2 h-4 w-4" /> View Occupants
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Allocation Dialog */}
      <Dialog open={showAllocationDialog} onOpenChange={setShowAllocationDialog}>
        <DialogContent className="bg-neutral-800 text-white border border-black max-w-2xl">
          <DialogHeader>
            <DialogTitle>Allocate Student to Room {selectedRoom?.id}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <h3 className="text-lg font-medium mb-4">Pending Room Requests</h3>
            <ScrollArea className="h-[300px] rounded-md border border-black p-4">
              <div className="space-y-4">
                {getAvailableStudents().map((student) => (
                  <div
                    key={student.id}
                    className="p-3 border border-black rounded-lg hover:bg-blue-900 cursor-pointer"
                    onClick={() => addStudentToRoom(student.id)}
                  >
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-blue-300 flex justify-between mt-1">
                      <span>{student.department}</span>
                      <span>{student.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Room Occupants Dialog */}
      <Dialog open={showOccupantsDialog} onOpenChange={setShowOccupantsDialog}>
        <DialogContent className="bg-neutral-800 text-white border border-black max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Room {selectedRoom?.id} Occupants ({selectedRoom?.assignedStudents?.length || 0}/{selectedRoom?.capacity})
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedRoom?.assignedStudents?.length ? (
              <ScrollArea className="h-[300px] rounded-md border border-black p-4">
                <div className="space-y-4">
                  {selectedRoom.assignedStudents.map((student) => (
                    <div
                      key={student.id}
                      className="p-3 border border-black rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-blue-300 flex justify-between mt-1">
                          <span>{student.department}</span>
                          <span className="ml-4">{student.year}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-400 text-red-400 hover:bg-red-900 hover:text-white"
                        onClick={() => removeStudentFromRoom(student.id)}
                      >
                        <UserMinus className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-blue-300">
                <p>This room is currently empty</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RoomAllocation