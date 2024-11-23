'use client'

import { useState } from 'react'
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import { Search, Hotel, Utensils, Camera, Building2, Bus, Pill, Landmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import 'leaflet/dist/leaflet.css'

const mapTiles = {
  streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/tiles/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
}

export default function Component() {
  const [activeMapTile, setActiveMapTile] = useState('streets')

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Search and Categories Bar */}
      <div className="p-4 bg-white shadow-md z-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search Google Maps"
                className="pl-10 pr-4 py-2 w-full rounded-full border-2 border-gray-200"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
              <Utensils className="h-4 w-4" />
              Restaurants
            </Button>
            <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
              <Hotel className="h-4 w-4" />
              Hotels
            </Button>
            <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
              <Camera className="h-4 w-4" />
              Things to do
            </Button>
            <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
              <Building2 className="h-4 w-4" />
              Museums
            </Button>
            <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
              <Bus className="h-4 w-4" />
              Transit
            </Button>
            <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
              <Pill className="h-4 w-4" />
              Pharmacies
            </Button>
            <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
              <Landmark className="h-4 w-4" />
              ATMs
            </Button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer
          center={[11.0168, 76.9558]} // Coordinates for Coimbatore
          zoom={13}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={mapTiles[activeMapTile]}
          />
          <ZoomControl position="bottomright" />
        </MapContainer>

        {/* Map Type Controls */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md z-[1000]">
          <div className="p-2 grid grid-cols-3 gap-2">
            <Button
              variant={activeMapTile === 'satellite' ? 'secondary' : 'ghost'}
              className="text-xs"
              onClick={() => setActiveMapTile('satellite')}
            >
              Satellite
            </Button>
            <Button
              variant={activeMapTile === 'terrain' ? 'secondary' : 'ghost'}
              className="text-xs"
              onClick={() => setActiveMapTile('terrain')}
            >
              Terrain
            </Button>
            <Button
              variant={activeMapTile === 'streets' ? 'secondary' : 'ghost'}
              className="text-xs"
              onClick={() => setActiveMapTile('streets')}
            >
              Streets
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}