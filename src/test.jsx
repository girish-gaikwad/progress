import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import second from "./MAPS/india-master/state/india_telengana.json";
import {
  Bike,
  CircleX,
  CrosshairIcon,
  Layers,
  Minus,
  Mountain,
  Plus,
  ScanSearch,
  Search,
  Train,
} from "lucide-react";
import nomap from "./assets/nomap.png";
import cartoBW from "./assets//cartoBW.png";
import geo from "./assets/geo.png";
import street from "./assets/street.png";
import terrian from "./assets/terrian.png";
import globle from "./assets/globe.png";
import night from "./assets/night.png";
import thunderforest from "./assets/thunderforest.png";
import thunderforest2 from "./assets/thunderforest2.png";
import thunderforest3 from "./assets/thunderforest3.png";
import transport from "./assets/transport.png";
const ZoomToCenterButton = ({ center, zoom }) => {
  const map = useMap();

  const zoomToCenter = () => {
    map.setView(center, zoom);
  };

  return (
    <div
      style={{ zIndex: 1000 }}
      className="absolute top-2 left-4 tooltip tooltip-right tooltip-info shadow-lg rounded-full z-50"
      data-tip="Centre map"
    >
      <button
        onClick={zoomToCenter}
        className=" rounded-full  bg-blue-600 text-white  p-2  shadow-md z-[1000] hover:bg-blue-700"
      >
        <ScanSearch />
      </button>
    </div>
  );
};

const CustomZoombuttons = () => {
  const map = useMap();
  const zoomIn = () => {
    map.setZoom(map.getZoom() + 1);
  };
  const zoomOut = () => {
    map.setZoom(map.getZoom() - 1);
  };

  return (
    <div
      style={{
        position: "absolute",
        gap: "10px",
        backgroundColor: "white",
        borderRadius: "10px",
        // bottom: "15%",
        bottom: "105px",
        display: "flex",
        left: "20px",
        zIndex: 1000,
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",
      }}
    >
      <button
        onClick={zoomIn}
        className="bg-white rounded-none px-1 text-blue-600 shadow-2xl p-1 flex rounded-l-lg items-center justify-center"
      >
        <Plus className="h-5 w-5" />
      </button>
      <button
        onClick={zoomOut}
        className="bg-white px-1 text-blue-600 rounded-none shadow-2xl p-1  flex items-center rounded-r-lg justify-center"
      >
        <Minus className="h-5 w-5" />
      </button>
    </div>
  );
};

const MapComponent = () => {
  const initialCenter = [22.470416, 84.219947];
  const initialZoom = 4.5;

  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedDistrictPosition, setSelectedDistrictPosition] =
    useState(null);
  const mapRef = useRef();

  // Cache colors
  const districtColorsRef = useRef({});

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const style = (feature) => {
    const districtName = feature.properties.NAME_1;

    // If the color for this district hasn't been generated, create it
    if (!districtColorsRef.current[districtName]) {
      districtColorsRef.current[districtName] = getRandomColor();
    }

    return {
      fillColor: districtColorsRef.current[districtName],
      weight: 2,
      opacity: 1,
      color: selectedDistrict === districtName ? "gray" : "white",
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature, layer) => {
    const districtName = feature.properties.ST_NM;
    layer.bindTooltip(`${districtName}`, { sticky: true });

    layer.on("click", (e) => {
      const latlng = e.latlng;
      setSelectedDistrict(districtName);
      setSelectedDistrictPosition(latlng);

      const bounds = layer.getBounds();
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    });
  };

  const [activeMapTile, setActiveMapTile] = useState("");
  const [activeIndex, setActiveIndex] = useState(null); // State to track active item

  const [verticalbar, setVerticalbar] = useState(false);
  const [activeIndexVertical, setActiveIndexVertical] = useState(null);

  const [isOpen, setIsOpen] = useState(false); // State to track sidebar visibility
  const [morediv, setMorediv] = useState(false);
  const sidebarRef = useRef(null); // Reference for the sidebar element

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar state
  };
  const verticalSidebar = () => {
    setVerticalbar(!verticalbar);
  };
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false); // Close the sidebar if clicked outside
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

 const navItems = [
  {
    img: nomap, // Image for no map
    label: "No map",
    tileUrl: "",
  },
  {
    img: cartoBW, // Image for Carto black and white map
    label: "Carto",
    tileUrl: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
  },
  {
    img: geo, // Image for Esri
    label: "Esri",
    tileUrl:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  },
  {
    icon: <Layers className="w-5 h-5" />, // JSX icon for "More"
    label: "More",
  },
];


  const verticalTiles = [
    
    {
      img: street, // Image for streets
      label: "Streets",
      tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    },
    {
      img: terrian, // Image for terrain
      label: "Terrain",
      tileUrl: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    },
    {
      img: globle, // Image for Thunderforest
      label: "forest1",
      tileUrl: "https://{s}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png",
    },
    {
      img: thunderforest, // Image for Thunderforest Outdoors
      label: "forest2",
      tileUrl: "https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png",
    },
    
    {
      img: night, // Replace with your night map icon
      label: "Night ",
      tileUrl: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    },
    {
      img: thunderforest3, // Replace with your cycling map icon
      label: "Cycling",
      tileUrl: "https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png",
    },
    {
      img: transport, // Replace with your transport map icon
      label: "Transport",
      tileUrl: "https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png",
    },
    
  ]

  return (
    <>
      <div
        style={{ zIndex: 1000 }}
        className="absolute z-50 left-1/2 transform  -translate-x-1/2 top-2 flex-1 max-w-md"
      >
        <input
          type="text"
          placeholder="Search Google Maps"
          className="pl-10 pr-10 w-[500px]  py-2  bg-white text-black shadow-2xl rounded-full border-2 border-blue-300"
        />
        <Search className="absolute left-3 top-1/2 text-blue-600 -translate-y-1/2 h-5 w-5" />
      </div>

      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        style={{ height: "100vh", width: "100vw", backgroundColor: "white" }}
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          url={activeMapTile}
          attribution='&copy; <a href="https://carto.com">CartoDB</a> contributors'
        />
        <GeoJSON data={second} style={style} onEachFeature={onEachFeature} />

        <CustomZoombuttons />
        <ZoomToCenterButton center={initialCenter} zoom={initialZoom} />
      </MapContainer>

      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md z-[1000]">
        <div
          className="border-2 relative shadow-2xl  bg-blue-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-60  border-gray-100

        w-[75px] h-[75px]  cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #0000 0%, #7087c1 100%)",
          }}
          onClick={toggleSidebar} // Handle click to toggle sidebar
        >
          <img src={globle} alt="" className="rounded-lg w-full h-full" />

          <p className=" absolute top-2/3 left-1/2 flex flex-col justify-center items-center  transform -translate-x-1/2 -translate-y-1/2">
            <Layers />
            <span className="text-md font-semibold">layers</span>
          </p>
        </div>
        {/* Side div that appears on click */}
        <div
          ref={sidebarRef} // Attach ref to the sidebar
          className={`absolute top-0 left-[90px] p-3  h-[75px]  bg-white shadow-lg rounded-lg  flex  items-center justify-center transition-all duration-300 ${
            isOpen
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-10 pointer-events-none"
          }`}
        >
          <ul className="flex  items-center justify-center  md:gap-3 ">
            {navItems.map((item, index) => (
              <li
                key={index}
                className="flex flex-col justify-center items-center"
              >
                <div
                  className={`w-12 h-12 flex justify-center items-center 
        bg-blue-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-60 border 
        ${
          activeIndex === index ? "border-2 border-blue-500" : "border-gray-100"
        }`} // Conditional border color
                  onClick={() => {
                    if (item.label === "More") {
                      verticalSidebar();
                    }

                    setActiveIndex(index); // Set active item
                    setActiveMapTile(item.tileUrl); // Call map tile function
                  }}
                >
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.label}
                      className="w-full h-full rounded-md"
                    />
                  ) : (
                    item.icon
                  )}
                </div>
                <span className="text-xs mt-0.5 text-gray-600 font-medium">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>


{/* add animation if possible */}

      {verticalbar && (
  <div
    className={`absolute bottom-24 left-28  rounded-md w-1/6 h-2/4 bg-white text-gray-500 shadow-2xl z-[1000] transition-all duration-500 ease-in-out transform ${
      verticalbar ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
    }`}
  >
    <div className="w-full px-3 py-2  flex gap-14 items-center justify-between">
      <div className="flex gap-2  items-center text-center justify-center">
        <span>
          <Layers className="h-5 w-5" />
        </span>
        More Tile Layers
      </div>
      <span className="flex gap-2 items-center  text-red-500 justify-center">
        <CircleX className="h-7 w-7 cursor-pointer" onClick={verticalSidebar} />
      </span>
    </div>
    <div className="divider m-0 px-3"></div>

    {/* 3xN Grid for Content */}
    <div className="overflow-y-auto h-full">
      <div className="grid grid-cols-3 gap-4 p-4">
      {verticalTiles.map((item, index) => (
              <li
                key={index}
                className="flex flex-col justify-center items-center"
              >
                <div
                  className={`w-12 h-12 flex justify-center items-center 
        bg-blue-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-60 border 
        ${
          activeIndex === index ? "border-2 border-blue-500" : "border-gray-100"
        }`} // Conditional border color
                  onClick={() => {
                    if (item.label === "More") {
                      verticalSidebar();
                    }

                    setActiveIndex(index); // Set active item
                    setActiveMapTile(item.tileUrl); // Call map tile function
                  }}
                >
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.label}
                      className="w-full h-full rounded-md"
                    />
                  ) : (
                    item.icon
                  )}
                </div>
                <span className="text-xs mt-0.5 text-gray-600 font-medium">
                  {item.label}
                </span>
              </li>
            ))}
      </div>
    </div>
  </div>
)}


      <div className="absolute p-2 gap-2 flex flex-col right-0 bottom-0 h-full w-1/4 bg-transparent  z-[1000]">
        <div className="w-full h-1/2 rounded-lg bg-black shadow-2xl"></div>
        <div className="w-full h-1/2 rounded-lg bg-black shadow-2xl"></div>
      </div>
    </>
  );
};

export default MapComponent;
