"use client"

import { Button } from "@/components/ui/button"

type LocationProps = {
  location: {
    id: string
    name: string
    description: string
    hasBooking?: boolean
  }
  onBookClick: () => void
}

export default function LocationDetail({ location, onBookClick }: LocationProps) {
  // Function to render the appropriate visualization based on location
  const renderVisualization = () => {
    switch (location.id) {
      case "cricketCourt1":
        return (
          <div className="bg-[#0a2e52] rounded-lg p-6 flex flex-col items-center">
            <div className="w-full max-w-md h-64 bg-[#0a2e52] rounded-lg relative border border-blue-400">
              {/* Blueprint grid background */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(#1e90ff 1px, transparent 1px), linear-gradient(90deg, #1e90ff 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                }}
              ></div>

              {/* Cricket field */}
              <div className="absolute inset-4 rounded-full border-2 border-white"></div>

              {/* Cricket pitch */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-4 bg-white/20 border border-white"></div>

              {/* Wickets */}
              <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 flex space-x-1">
                <div className="w-0.5 h-6 bg-white"></div>
                <div className="w-0.5 h-6 bg-white"></div>
                <div className="w-0.5 h-6 bg-white"></div>
              </div>

              <div className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2 flex space-x-1">
                <div className="w-0.5 h-6 bg-white"></div>
                <div className="w-0.5 h-6 bg-white"></div>
                <div className="w-0.5 h-6 bg-white"></div>
              </div>

              {/* Dimensions */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-300">68m</div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-300">68m</div>
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 rotate-90 text-xs text-blue-300">
                68m
              </div>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-blue-300">
                68m
              </div>

              {/* Annotations */}
              <div className="absolute top-8 left-8 text-xs text-blue-300">Boundary</div>
              <div className="absolute bottom-16 right-8 text-xs text-blue-300">Pitch</div>
            </div>
            <p className="mt-4 text-center text-sm text-blue-300">
              Full-size cricket pitch with proper boundary markings and professional equipment.
            </p>
          </div>
        )

      case "boxCricket":
        return (
          <div className="bg-[#0a2e52] rounded-lg p-6 flex flex-col items-center">
            <div className="w-full max-w-md h-64 bg-[#0a2e52] rounded-lg relative border border-blue-400">
              {/* Blueprint grid background */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(#1e90ff 1px, transparent 1px), linear-gradient(90deg, #1e90ff 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                }}
              ></div>

              {/* Box outline */}
              <div className="absolute inset-4 border-2 border-white"></div>

              {/* Cricket pitch */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-3 bg-white/20 border border-white"></div>

              {/* Wickets */}
              <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 flex space-x-1">
                <div className="w-0.5 h-5 bg-white"></div>
                <div className="w-0.5 h-5 bg-white"></div>
                <div className="w-0.5 h-5 bg-white"></div>
              </div>

              <div className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2 flex space-x-1">
                <div className="w-0.5 h-5 bg-white"></div>
                <div className="w-0.5 h-5 bg-white"></div>
                <div className="w-0.5 h-5 bg-white"></div>
              </div>

              {/* Net on top - dashed lines */}
              <div className="absolute inset-4 border-t-2 border-l-2 border-r-2 border-dashed border-white opacity-50"></div>

              {/* Dimensions */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-300">22m</div>
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 rotate-90 text-xs text-blue-300">
                18m
              </div>

              {/* Annotations */}
              <div className="absolute top-8 left-8 text-xs text-blue-300">Enclosure</div>
              <div className="absolute bottom-16 right-8 text-xs text-blue-300">Pitch</div>
            </div>
            <p className="mt-4 text-center text-sm text-blue-300">
              Enclosed cricket court for box cricket format with nets on all sides.
            </p>
          </div>
        )

      case "volleyballCourt":
        return (
          <div className="bg-[#0a2e52] rounded-lg p-6 flex flex-col items-center">
            <div className="w-full max-w-md h-64 bg-[#0a2e52] rounded-lg relative border border-blue-400">
              {/* Blueprint grid background */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(#1e90ff 1px, transparent 1px), linear-gradient(90deg, #1e90ff 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                }}
              ></div>

              {/* Court outline */}
              <div className="absolute inset-4 border-2 border-white"></div>

              {/* Net */}
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white"></div>
              <div className="absolute top-1/2 left-4 right-4 h-8 border-l border-r border-white"></div>

              {/* Attack line */}
              <div className="absolute top-1/3 left-4 right-4 border border-dashed border-white"></div>
              <div className="absolute bottom-1/3 left-4 right-4 border border-dashed border-white"></div>

              {/* Dimensions */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-300">18m</div>
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 rotate-90 text-xs text-blue-300">
                9m
              </div>

              {/* Annotations */}
              <div className="absolute top-10 left-8 text-xs text-blue-300">Service Area</div>
              <div className="absolute bottom-10 right-8 text-xs text-blue-300">Service Area</div>
              <div className="absolute top-1/2 right-8 transform -translate-y-1/2 text-xs text-blue-300">Net</div>
            </div>
            <p className="mt-4 text-center text-sm text-blue-300">
              Professional volleyball court with sand surface and regulation net height.
            </p>
          </div>
        )

      case "canteen":
        return (
          <div className="bg-[#0a2e52] rounded-lg p-6 flex flex-col items-center">
            <div className="w-full max-w-md h-64 bg-[#0a2e52] rounded-lg relative border border-blue-400">
              {/* Blueprint grid background */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(#1e90ff 1px, transparent 1px), linear-gradient(90deg, #1e90ff 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                }}
              ></div>

              {/* Building outline */}
              <div className="absolute inset-4 border-2 border-white"></div>

              {/* Tables */}
              <div className="absolute top-12 left-12 w-8 h-8 rounded-full border border-white"></div>
              <div className="absolute top-12 right-12 w-8 h-8 rounded-full border border-white"></div>
              <div className="absolute bottom-12 left-12 w-8 h-8 rounded-full border border-white"></div>
              <div className="absolute bottom-12 right-12 w-8 h-8 rounded-full border border-white"></div>

              {/* Counter */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-6 border-2 border-white"></div>

              {/* Annotations */}
              <div className="absolute top-8 left-8 text-xs text-blue-300">Dining Area</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-8 text-xs text-blue-300">
                Service Counter
              </div>
              <div className="absolute bottom-8 right-8 text-xs text-blue-300">Dining Area</div>

              {/* Dimensions */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-300">15m</div>
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 rotate-90 text-xs text-blue-300">
                12m
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-blue-300">
              Campus canteen with multiple food stalls offering a variety of cuisines.
            </p>
          </div>
        )

      case "boysHostel":
      case "girlsHostel":
        const hostelType = location.id === "boysHostel" ? "Boys" : "Girls"

        return (
          <div className="bg-[#0a2e52] rounded-lg p-6 flex flex-col items-center">
            <div className="w-full max-w-md h-64 bg-[#0a2e52] rounded-lg relative border border-blue-400">
              {/* Blueprint grid background */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(#1e90ff 1px, transparent 1px), linear-gradient(90deg, #1e90ff 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                }}
              ></div>

              {/* Building outline */}
              <div className="absolute inset-4 border-2 border-white"></div>

              {/* Windows - first floor */}
              <div className="absolute top-8 left-12 grid grid-cols-4 gap-3">
                <div className="w-4 h-4 border border-white"></div>
                <div className="w-4 h-4 border border-white"></div>
                <div className="w-4 h-4 border border-white"></div>
                <div className="w-4 h-4 border border-white"></div>
              </div>

              {/* Windows - second floor */}
              <div className="absolute top-20 left-12 grid grid-cols-4 gap-3">
                <div className="w-4 h-4 border border-white"></div>
                <div className="w-4 h-4 border border-white"></div>
                <div className="w-4 h-4 border border-white"></div>
                <div className="w-4 h-4 border border-white"></div>
              </div>

              {/* Windows - third floor */}
              <div className="absolute top-32 left-12 grid grid-cols-4 gap-3">
                <div className="w-4 h-4 border border-white"></div>
                <div className="w-4 h-4 border border-white"></div>
                <div className="w-4 h-4 border border-white"></div>
                <div className="w-4 h-4 border border-white"></div>
              </div>

              {/* Door */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-6 border-2 border-white"></div>

              {/* Annotations */}
              <div className="absolute top-4 left-8 text-xs text-blue-300">Rooms</div>
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-xs text-blue-300">
                Entrance
              </div>

              {/* Dimensions */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-300">30m</div>
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 rotate-90 text-xs text-blue-300">
                20m
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-blue-300">
              {hostelType} hostel with modern amenities and comfortable rooms.
            </p>
          </div>
        )

      case "place":
        return (
          <div className="bg-[#0a2e52] rounded-lg p-6 flex flex-col items-center">
            <div className="w-full max-w-md h-64 bg-[#0a2e52] rounded-lg relative border border-blue-400">
              {/* Blueprint grid background */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(#1e90ff 1px, transparent 1px), linear-gradient(90deg, #1e90ff 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                }}
              ></div>

              {/* Central fountain */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-white"></div>
              </div>

              {/* Benches */}
              <div className="absolute top-8 left-12 w-10 h-2 border border-white"></div>
              <div className="absolute top-8 right-12 w-10 h-2 border border-white"></div>
              <div className="absolute bottom-8 left-12 w-10 h-2 border border-white"></div>
              <div className="absolute bottom-8 right-12 w-10 h-2 border border-white"></div>

              {/* Pathways */}
              <div className="absolute top-1/2 left-4 w-1/3 h-0.5 bg-white"></div>
              <div className="absolute top-1/2 right-4 w-1/3 h-0.5 bg-white"></div>
              <div className="absolute left-1/2 top-4 h-1/3 w-0.5 bg-white"></div>
              <div className="absolute left-1/2 bottom-4 h-1/3 w-0.5 bg-white"></div>

              {/* Annotations */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-blue-300">
                Fountain
              </div>
              <div className="absolute top-6 left-12 text-xs text-blue-300">Bench</div>
              <div className="absolute bottom-6 right-12 text-xs text-blue-300">Bench</div>

              {/* Dimensions */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-300">25m</div>
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 rotate-90 text-xs text-blue-300">
                25m
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-blue-300">
              The central gathering area for campus events and activities.
            </p>
          </div>
        )

      case "busParking":
        return (
          <div className="bg-[#0a2e52] rounded-lg p-6 flex flex-col items-center">
            <div className="w-full max-w-md h-64 bg-[#0a2e52] rounded-lg relative border border-blue-400">
              {/* Blueprint grid background */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(#1e90ff 1px, transparent 1px), linear-gradient(90deg, #1e90ff 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                }}
              ></div>

              {/* Parking lines */}
              <div className="absolute top-8 left-8 grid grid-cols-3 gap-8">
                <div className="w-10 h-0.5 bg-white"></div>
                <div className="w-10 h-0.5 bg-white"></div>
                <div className="w-10 h-0.5 bg-white"></div>
              </div>

              <div className="absolute top-24 left-8 grid grid-cols-3 gap-8">
                <div className="w-10 h-0.5 bg-white"></div>
                <div className="w-10 h-0.5 bg-white"></div>
                <div className="w-10 h-0.5 bg-white"></div>
              </div>

              <div className="absolute top-40 left-8 grid grid-cols-3 gap-8">
                <div className="w-10 h-0.5 bg-white"></div>
                <div className="w-10 h-0.5 bg-white"></div>
                <div className="w-10 h-0.5 bg-white"></div>
              </div>

              {/* Bus outlines */}
              <div className="absolute top-12 left-12 w-16 h-6 border border-white rounded-sm"></div>
              <div className="absolute top-28 right-12 w-16 h-6 border border-white rounded-sm"></div>

              {/* Annotations */}
              <div className="absolute top-4 left-8 text-xs text-blue-300">Parking Spaces</div>
              <div className="absolute top-10 left-12 text-xs text-blue-300">Bus</div>

              {/* Dimensions */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-300">20m</div>
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 rotate-90 text-xs text-blue-300">
                15m
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-blue-300">
              Designated area for campus buses and transportation services.
            </p>
          </div>
        )

      case "normalPlace":
        return (
          <div className="bg-[#0a2e52] rounded-lg p-6 flex flex-col items-center">
            <div className="w-full max-w-md h-64 bg-[#0a2e52] rounded-lg relative border border-blue-400">
              {/* Blueprint grid background */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(#1e90ff 1px, transparent 1px), linear-gradient(90deg, #1e90ff 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                }}
              ></div>

              {/* Benches */}
              <div className="absolute top-8 left-12 w-10 h-2 border border-white"></div>
              <div className="absolute top-8 right-12 w-10 h-2 border border-white"></div>
              <div className="absolute bottom-8 left-12 w-10 h-2 border border-white"></div>
              <div className="absolute bottom-8 right-12 w-10 h-2 border border-white"></div>

              {/* Trees */}
              <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full border border-white"></div>
              <div className="absolute top-1/4 right-1/4 w-8 h-8 rounded-full border border-white"></div>

              {/* Pathways */}
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white"></div>
              <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-white"></div>

              {/* Annotations */}
              <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-xs text-blue-300">
                Tree
              </div>
              <div className="absolute top-6 left-12 text-xs text-blue-300">Bench</div>

              {/* Dimensions */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-300">18m</div>
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 rotate-90 text-xs text-blue-300">
                18m
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-blue-300">
              Open space for students to relax and socialize between classes.
            </p>
          </div>
        )

      case "road":
        return (
          <div className="bg-[#0a2e52] rounded-lg p-6 flex flex-col items-center">
            <div className="w-full max-w-md h-64 bg-[#0a2e52] rounded-lg relative border border-blue-400">
              {/* Blueprint grid background */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(#1e90ff 1px, transparent 1px), linear-gradient(90deg, #1e90ff 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                }}
              ></div>

              {/* Road outline */}
              <div className="absolute inset-4 border border-white"></div>

              {/* Road markings */}
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white border-dashed"></div>

              {/* Annotations */}
              <div className="absolute top-8 left-8 text-xs text-blue-300">Road</div>
              <div className="absolute bottom-8 right-8 text-xs text-blue-300">Road</div>

              {/* Dimensions */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-300">100m</div>
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 rotate-90 text-xs text-blue-300">
                8m
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-blue-300">
              Primary access road connecting all campus facilities.
            </p>
          </div>
        )

      default:
        return (
          <div className="bg-[#0a2e52] rounded-lg p-6 flex flex-col items-center">
            <div className="w-full max-w-md h-64 bg-[#0a2e52] rounded-lg border border-blue-400 flex items-center justify-center">
              <p className="text-blue-300">No blueprint available</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <h2 className="text-2xl font-bold text-white">{location.name}</h2>
      </div>

      <div className="border-t border-b border-blue-800 py-4">
        <p className="text-blue-300">{location.description}</p>
      </div>

      <div className="bg-[#0a2e52] rounded-lg shadow-sm">{renderVisualization()}</div>

      {location.hasBooking && (
        <div className="flex justify-center">
          <Button onClick={onBookClick} className="bg-blue-600 hover:bg-blue-700">
            Book a Slot
          </Button>
        </div>
      )}
    </div>
  )
}

