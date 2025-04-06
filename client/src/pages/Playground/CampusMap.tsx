 
import { useState } from "react"
import { ArrowLeft, Compass } from "lucide-react"
import LocationDetail from "./location-detail"
import SlotBooking from "./slot-booking"

type Location = {
  id: string
  name: string
  description: string
  hasBooking?: boolean
}

export default function CampusMap() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [showBooking, setShowBooking] = useState(false)

  const locations: Record<string, Location> = {
    place: {
      id: "place",
      name: "Main Plaza",
      description: "The central gathering area for campus events and activities.",
    },
    busParking: {
      id: "busParking",
      name: "Bus Parking",
      description: "Designated area for campus buses and transportation services.",
    },
    cricketCourt1: {
      id: "cricketCourt1",
      name: "Cricket Court 1",
      description: "Professional cricket court with full-size pitch and boundary.",
      hasBooking: true,
    },
    boxCricket: {
      id: "boxCricket",
      name: "Box Cricket (Cricket Court 2)",
      description: "Enclosed cricket court for box cricket format games.",
      hasBooking: true,
    },
    normalPlace: {
      id: "normalPlace",
      name: "Common Area",
      description: "Open space for students to relax and socialize between classes.",
    },
    boysHostel: {
      id: "boysHostel",
      name: "Boys Hostel",
      description: "Residential facility for male students with modern amenities.",
    },
    girlsHostel: {
      id: "girlsHostel",
      name: "Girls Hostel",
      description: "Residential facility for female students with modern amenities.",
    },
    road: {
      id: "road",
      name: "Main Road",
      description: "Primary access road connecting all campus facilities.",
    },
    volleyballCourt: {
      id: "volleyballCourt",
      name: "Volleyball Court",
      description: "Professional volleyball court with sand surface.",
      hasBooking: true,
    },
    canteen: {
      id: "canteen",
      name: "Canteen",
      description: "Campus food court offering a variety of meals and snacks.",
    },
  }

  const handleLocationClick = (locationId: string) => {
    setSelectedLocation(locations[locationId])
    setShowBooking(false)
  }

  const handleBackClick = () => {
    setSelectedLocation(null)
    setShowBooking(false)
  }

  const handleBookingClick = () => {
    setShowBooking(true)
  }

  return (
    <div className=" shadow-lg overflow-hidden px-8 pt-10" style={{backgroundColor: "#051A33"}}>
      {selectedLocation ? (
        <div>
          <div>
            <h2 className="text-center font-bold text-4xl text-white pb-4">Campus Blueprint Map</h2>
            <p className="text-center text-blue-300 pb-8">Select any location to view details or book slots for sports facilities</p>
          </div>
          <div className="p-4 bg-[#0a2e52] text-white mb-10 rounded-lg w-11/12 m-auto">
            <button
              onClick={handleBackClick}
              className="flex items-center text-blue-300 mb-4 hover:text-blue-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to map
            </button>

            {showBooking && selectedLocation.hasBooking ? (
              <SlotBooking location={selectedLocation} />
            ) : (
              <LocationDetail location={selectedLocation} onBookClick={handleBookingClick} />
            )}
          </div>
        </div>
      ) : (
        <div>
          <div>
            <h2 className="text-center font-bold text-4xl text-white pb-4">Campus Blueprint Map</h2>
            <p className="text-center text-blue-300 pb-8">Select any location to view details or book slots for sports facilities</p>
          </div>

        <div className="w-11/12 mb-10 m-auto border-2 border-blue-800 rounded-lg p-4 bg-[#0a2e52] relative">
          {/* Blueprint grid background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(#1e90ff 1px, transparent 1px), linear-gradient(90deg, #1e90ff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          {/* Title and compass */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center">
              <Compass className="h-8 w-8 text-white mr-2" />
              <h2 className="text-2xl font-bold text-white">Campus Blueprint Plan</h2>
            </div>
            <div className="text-sm text-blue-300">Scale: 1:500</div>
          </div>

          <div className="flex flex-col md:flex-row relative z-10">
            <div className="w-full md:w-7/12 border border-blue-400 rounded-lg overflow-hidden">
              <div className="flex">
                {/* Main Plaza */}
                <div
                  className="w-3/5 border-r border-b border-blue-400 h-36 hover:bg-blue-800/30 cursor-pointer transition-all relative"
                  onClick={() => handleLocationClick("place")}
                >
                  {/* Blueprint style drawing */}
                  <div className="absolute inset-4 border border-white border-dashed"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white"></div>

                  {/* Benches */}
                  <div className="absolute top-8 left-8 w-6 h-1 bg-white"></div>
                  <div className="absolute bottom-8 right-8 w-6 h-1 bg-white"></div>

                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs">
                    Main Plaza
                  </div>
                </div>

                {/* Bus Parking */}
                <div
                  className="w-2/5 border-b border-blue-400 h-36 hover:bg-blue-800/30 cursor-pointer transition-all relative"
                  onClick={() => handleLocationClick("busParking")}
                >
                  {/* Parking lines */}
                  <div className="absolute top-6 left-4 right-4 flex flex-col space-y-4">
                    <div className="w-full h-0.5 bg-white"></div>
                    <div className="w-full h-0.5 bg-white"></div>
                    <div className="w-full h-0.5 bg-white"></div>
                  </div>

                  {/* Bus outlines */}
                  <div className="absolute top-8 left-8 w-10 h-5 border border-white rounded-sm"></div>
                  <div className="absolute bottom-8 right-8 w-10 h-5 border border-white rounded-sm"></div>

                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs">
                    Bus Parking
                  </div>
                </div>
              </div>

              {/* Cricket Court 1 */}
              <div
                className="border-b border-blue-400 h-36 hover:bg-blue-800/30 cursor-pointer transition-all relative"
                onClick={() => handleLocationClick("cricketCourt1")}
              >
                {/* Cricket field outline */}
                <div className="absolute inset-4 border border-white rounded-full"></div>

                {/* Cricket pitch */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-2 bg-white"></div>

                {/* Wickets */}
                <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 flex space-x-0.5">
                  <div className="w-0.5 h-3 bg-white"></div>
                  <div className="w-0.5 h-3 bg-white"></div>
                  <div className="w-0.5 h-3 bg-white"></div>
                </div>

                <div className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2 flex space-x-0.5">
                  <div className="w-0.5 h-3 bg-white"></div>
                  <div className="w-0.5 h-3 bg-white"></div>
                  <div className="w-0.5 h-3 bg-white"></div>
                </div>

                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs">
                  Cricket Court 1
                </div>
              </div>

              {/* Box Cricket */}
              <div
                className="border-b border-blue-400 h-36 hover:bg-blue-800/30 cursor-pointer transition-all relative"
                onClick={() => handleLocationClick("boxCricket")}
              >
                {/* Box outline */}
                <div className="absolute inset-4 border border-white"></div>

                {/* Cricket pitch */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-2 bg-white"></div>

                {/* Wickets */}
                <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 flex space-x-0.5">
                  <div className="w-0.5 h-3 bg-white"></div>
                  <div className="w-0.5 h-3 bg-white"></div>
                  <div className="w-0.5 h-3 bg-white"></div>
                </div>

                <div className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2 flex space-x-0.5">
                  <div className="w-0.5 h-3 bg-white"></div>
                  <div className="w-0.5 h-3 bg-white"></div>
                  <div className="w-0.5 h-3 bg-white"></div>
                </div>

                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs">
                  Box Cricket
                </div>
              </div>

              {/* Common Area */}
              <div
                className="border-b border-blue-400 h-36 hover:bg-blue-800/30 cursor-pointer transition-all relative"
                onClick={() => handleLocationClick("normalPlace")}
              >
                {/* Benches */}
                <div className="absolute top-8 left-8 w-6 h-1 bg-white"></div>
                <div className="absolute top-8 right-8 w-6 h-1 bg-white"></div>
                <div className="absolute bottom-8 left-8 w-6 h-1 bg-white"></div>
                <div className="absolute bottom-8 right-8 w-6 h-1 bg-white"></div>

                {/* Trees */}
                <div className="absolute top-1/3 left-1/3 w-4 h-4 rounded-full border border-white"></div>
                <div className="absolute bottom-1/3 right-1/3 w-4 h-4 rounded-full border border-white"></div>

                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs">
                  Common Area
                </div>
              </div>

              {/* Boys Hostel */}
              <div
                className="border-b border-blue-400 h-36 hover:bg-blue-800/30 cursor-pointer transition-all relative"
                onClick={() => handleLocationClick("boysHostel")}
              >
                {/* Building outline */}
                <div className="absolute inset-4 border-2 border-white"></div>

                {/* Windows */}
                <div className="absolute top-8 left-8 grid grid-cols-3 gap-2">
                  <div className="w-2 h-2 border border-white"></div>
                  <div className="w-2 h-2 border border-white"></div>
                  <div className="w-2 h-2 border border-white"></div>
                </div>

                <div className="absolute top-14 left-8 grid grid-cols-3 gap-2">
                  <div className="w-2 h-2 border border-white"></div>
                  <div className="w-2 h-2 border border-white"></div>
                  <div className="w-2 h-2 border border-white"></div>
                </div>

                {/* Door */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-3 border border-white"></div>

                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs">
                  Boys Hostel
                </div>
              </div>

              {/* Girls Hostel */}
              <div
                className="h-36 hover:bg-blue-800/30 cursor-pointer transition-all relative"
                onClick={() => handleLocationClick("girlsHostel")}
              >
                {/* Building outline */}
                <div className="absolute inset-4 border-2 border-white"></div>

                {/* Windows */}
                <div className="absolute top-8 left-8 grid grid-cols-3 gap-2">
                  <div className="w-2 h-2 border border-white"></div>
                  <div className="w-2 h-2 border border-white"></div>
                  <div className="w-2 h-2 border border-white"></div>
                </div>

                <div className="absolute top-14 left-8 grid grid-cols-3 gap-2">
                  <div className="w-2 h-2 border border-white"></div>
                  <div className="w-2 h-2 border border-white"></div>
                  <div className="w-2 h-2 border border-white"></div>
                </div>

                {/* Door */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-3 border border-white"></div>

                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs">
                  Girls Hostel
                </div>
              </div>
            </div>

            {/* Main Road */}
            <div
              className="w-full md:w-1/12 border-t md:border-t-0 md:border-l md:border-r border-blue-400 h-auto md:h-auto hover:bg-blue-800/30 cursor-pointer transition-all relative"
              onClick={() => handleLocationClick("road")}
            >
              {/* Road markings */}
              <div className="absolute top-1/6 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-white"></div>
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-white"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-white"></div>
              <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-white"></div>
              <div className="absolute top-5/6 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-white"></div>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90 text-white text-xs whitespace-nowrap">
                Main Road
              </div>
            </div>

            <div className="w-full md:w-4/12 border border-blue-400 rounded-lg mt-4 md:mt-0 md:rounded-none md:border-t md:border-b md:border-r">
              {/* Volleyball Court */}
              <div
                className="border-b border-blue-400 h-48 hover:bg-blue-800/30 cursor-pointer transition-all relative"
                onClick={() => handleLocationClick("volleyballCourt")}
              >
                {/* Court outline */}
                <div className="absolute inset-4 border border-white"></div>

                {/* Net */}
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white"></div>

                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs">
                  Volleyball Court
                </div>
              </div>

              {/* Trees area */}
              <div className="h-48 relative">
                {/* Trees */}
                <div className="absolute top-1/4 left-1/4 w-6 h-6 rounded-full border border-white"></div>
                <div className="absolute top-1/4 right-1/4 w-6 h-6 rounded-full border border-white"></div>
                <div className="absolute bottom-1/4 left-1/3 w-6 h-6 rounded-full border border-white"></div>
                <div className="absolute bottom-1/4 right-1/3 w-6 h-6 rounded-full border border-white"></div>

                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs">
                  Green Area
                </div>
              </div>

              {/* Canteen */}
              <div
                className="border-t border-blue-400 h-48 hover:bg-blue-800/30 cursor-pointer transition-all relative mt-52"
                onClick={() => handleLocationClick("canteen")}
              >
                {/* Building outline */}
                <div className="absolute inset-4 border-2 border-white"></div>

                {/* Tables */}
                <div className="absolute top-10 left-10 w-4 h-4 rounded-full border border-white"></div>
                <div className="absolute top-10 right-10 w-4 h-4 rounded-full border border-white"></div>
                <div className="absolute bottom-10 left-10 w-4 h-4 rounded-full border border-white"></div>
                <div className="absolute bottom-10 right-10 w-4 h-4 rounded-full border border-white"></div>

                {/* Counter */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-3 border border-white"></div>

                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs">Canteen</div>
              </div>
            </div>
          </div>

          {/* Blueprint annotations */}
          <div className="mt-4 text-blue-300 text-xs flex justify-between relative z-10">
            <div>Drawing No: CAMPUS-001</div>
            <div>Rev: A</div>
            <div>Date: 04/05/2025</div>
          </div>
        </div>
        </div>
      )}
    </div>
  )
}

