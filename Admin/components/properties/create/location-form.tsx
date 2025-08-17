import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search } from "lucide-react";

type Property = {
  location?: {
    coordinates: [number, number];
  };
  address?: {
    street?: string;
    village?: string;
    district?: string;
    city?: string;
    province?: string;
    postal_code?: string;
  };
};

declare global {
  interface Window {
    L?: any;
  }
}

type LocationFormProps = {
  formData: Property;
  handleLocationChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => void;
  handleAddressChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => void;
  error?: { [key: string]: string };
};

const mockFormData: Property = {
  location: {
    coordinates: [-8.10742, 113.23189],
  },
  address: {
    street: "",
    village: "",
    district: "",
    city: "",
    province: "",
    postal_code: "",
  },
};

function LocationForm({
  formData = mockFormData,
  handleLocationChange = () => {},
  handleAddressChange = () => {},
  error = {},
}: LocationFormProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [currentLatLng, setCurrentLatLng] = useState<[number, number] | null>(
    null
  );

  // Initialize map when component mounts and when tab becomes visible
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load Leaflet dynamically if not already loaded
      if (!window.L) {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
        script.onload = () => {
          // Small delay to ensure tab is fully rendered
          setTimeout(initializeMap, 100);
        };
        document.head.appendChild(script);

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
        document.head.appendChild(link);
      } else if (!map) {
        // Leaflet is loaded but map not initialized
        setTimeout(initializeMap, 100);
      }
    }
  }, []);

  // Re-initialize map when tab becomes visible
  useEffect(() => {
    const handleTabChange = () => {
      if (map && mapRef.current) {
        // Small delay to ensure tab content is visible
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      }
    };

    // Listen for tab changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-state"
        ) {
          const target = mutation.target as HTMLElement;
          if (
            target.getAttribute("data-state") === "active" &&
            target.textContent?.includes("Lokasi")
          ) {
            handleTabChange();
          }
        }
      });
    });

    // Observe tab triggers for state changes
    const tabTriggers = document.querySelectorAll('[data-value="location"]');
    tabTriggers.forEach((trigger) => {
      observer.observe(trigger, { attributes: true });
    });

    return () => observer.disconnect();
  }, [map]);

  const initializeMap = () => {
    if (mapRef.current && window.L && !map) {
      const initialLat = formData.location?.coordinates[1] || -8.10742;
      const initialLng = formData.location?.coordinates[0] || 113.23189;
      console.log("Initializing map with coordinates:", initialLat, initialLng);

      // Check if the map container is visible
      const container = mapRef.current;
      if (container.offsetWidth === 0 || container.offsetHeight === 0) {
        console.warn("Map container is not visible, delaying initialization.");
        return;
      }

      const mapInstance = window.L.map(container, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: true,
      });

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstance);

      // Add initial marker
      const markerInstance = window.L.marker([initialLat, initialLng], {
        draggable: true,
      }).addTo(mapInstance);

      // Handle marker drag
      markerInstance.on("dragend", async (e) => {
        const { lat, lng } = e.target.getLatLng();
        await updateCoordinates(lat, lng);
        setCurrentLatLng([lat, lng]); // Update currentLatLng
      });

      // Handle map click
      mapInstance.on("click", async (e) => {
        const { lat, lng } = e.latlng;
        markerInstance.setLatLng([lat, lng]);
        await updateCoordinates(lat, lng);
        setCurrentLatLng([lat, lng]); // Update currentLatLng
      });

      setMap(mapInstance);
      setMarker(markerInstance);
      setCurrentLatLng([initialLat, initialLng]); // Set initial value
    }
  };

  const updateCoordinates = async (lat: number, lng: number) => {
    // Update coordinates
    const latEvent = { target: { name: "lat", value: lat.toString() } };
    const lngEvent = { target: { name: "lng", value: lng.toString() } };
    handleLocationChange(latEvent);
    handleLocationChange(lngEvent);

    // Fetch address using reverse geocoding
    await fetchAddress(lat, lng);
  };

  const fetchAddress = async (lat: number, lng: number) => {
    setIsLoadingAddress(true);
    try {
      console.log("Fetching address for coordinates:", lat, lng);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      // console.log("Fetched address data:", data);

      if (data && data.address) {
        const address = data.address;

        // Map OpenStreetMap address components to our form fields
        const addressUpdates = {
          street:
            address.road || address.house_number
              ? `${address.house_number || ""} ${address.road || ""}`.trim()
              : "",
          village:
            address.village || address.neighbourhood || address.suburb || "",
          district: address.county || address.district || "",
          city: address.city || address.town || address.municipality || "",
          province: address.state || address.province || "",
          postal_code: address.postcode || "",
        };

        // Update each address field
        Object.entries(addressUpdates).forEach(([key, value]) => {
          if (value) {
            const event = { target: { name: key, value } };
            handleAddressChange(event);
          }
        });
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleCoordinateInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleLocationChange(e);

    // Update map marker position
    if (map && marker) {
      const lat =
        e.target.name === "lat"
          ? parseFloat(e.target.value)
          : formData.location?.coordinates[0];
      const lng =
        e.target.name === "lng"
          ? parseFloat(e.target.value)
          : formData.location?.coordinates[1];

      if (!isNaN(lat!) && !isNaN(lng!)) {
        marker.setLatLng([lat, lng]);
        map.setView([lat, lng], map.getZoom());
      }
    }
  };

  // Add effect to detect when this tab content becomes visible
  useEffect(() => {
    const resizeMapOnTabActive = () => {
      if (map && currentLatLng) {
        setTimeout(() => {
          map.invalidateSize();
          map.setView(currentLatLng, map.getZoom()); // Set view to currentLatLng
          // Force reload tile layer
          map.eachLayer((layer: any) => {
            if (layer._url && layer.redraw) {
              layer.redraw();
            }
          });
        }, 100);
      }
    };

    const tabContent = mapRef.current?.closest("[data-state]");
    if (tabContent) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "data-state" &&
            (mutation.target as HTMLElement).getAttribute("data-state") ===
              "active"
          ) {
            resizeMapOnTabActive();
          }
        });
      });

      observer.observe(tabContent, { attributes: true });

      if (tabContent.getAttribute("data-state") === "active") {
        resizeMapOnTabActive();
      }

      return () => observer.disconnect();
    }
  }, [map, currentLatLng]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateCoordinates(latitude, longitude);
          if (map) {
            map.setView([latitude, longitude], 15);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Gagal mendapatkan lokasi. Pastikan GPS aktif dan izinkan akses lokasi."
          );
        }
      );
    } else {
      alert("Geolocation tidak didukung oleh browser ini.");
    }
  };

  return (
    <TabsContent value="location">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Informasi Lokasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Map and Form Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Peta Interaktif</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  className="flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Lokasi Saya
                </Button>
              </div>

              <div className="relative">
                <div
                  ref={mapRef}
                  className="w-full h-[400px] rounded-lg border border-gray-200 bg-gray-100"
                  style={{ minHeight: "400px" }}
                />
                {isLoadingAddress && (
                  <div className="absolute top-2 right-2 bg-white px-3 py-2 rounded-lg shadow-lg text-sm">
                    Mengambil alamat...
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600">
                Klik pada peta atau seret marker untuk mengatur lokasi. Alamat
                akan diisi otomatis.
              </p>
            </div>

            {/* Form Section */}
            <div className="space-y-4">
              <h4 className="font-semibold">Koordinat dan Alamat</h4>

              {/* Coordinates */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    name="lat"
                    value={formData.location?.coordinates[0] || ""}
                    onChange={handleCoordinateInputChange}
                    placeholder="-6.200000"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    name="lng"
                    value={formData.location?.coordinates[1] || ""}
                    onChange={handleCoordinateInputChange}
                    placeholder="106.816666"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Address Fields */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Alamat Detail</Label>

                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="street">Jalan</Label>
                    <Input
                      id="street"
                      placeholder="Nama jalan dan nomor"
                      name="street"
                      value={formData.address?.street || ""}
                      onChange={handleAddressChange}
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                    />
                    {error["address.street"] && (
                      <span className="text-red-500 text-xs">
                        {error["address.street"]}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="village">Kelurahan</Label>
                      <Input
                        id="village"
                        placeholder="Kelurahan"
                        name="village"
                        value={formData.address?.village || ""}
                        onChange={handleAddressChange}
                        autoComplete="new-password"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                      />
                      {error["address.village"] && (
                        <span className="text-red-500 text-xs">
                          {error["address.village"]}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">Kecamatan</Label>
                      <Input
                        id="district"
                        placeholder="Kecamatan"
                        name="district"
                        value={formData.address?.district || ""}
                        onChange={handleAddressChange}
                        autoComplete="new-password"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                      />
                      {error["address.district"] && (
                        <span className="text-red-500 text-xs">
                          {error["address.district"]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">Kota</Label>
                      <Input
                        id="city"
                        placeholder="Kota"
                        name="city"
                        value={formData.address?.city || ""}
                        onChange={handleAddressChange}
                        autoComplete="new-password"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                      />
                      {error["address.city"] && (
                        <span className="text-red-500 text-xs">
                          {error["address.city"]}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province">Provinsi</Label>
                      <Input
                        id="province"
                        placeholder="Provinsi"
                        name="province"
                        value={formData.address?.province || ""}
                        onChange={handleAddressChange}
                        autoComplete="new-password"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                      />
                      {error["address.province"] && (
                        <span className="text-red-500 text-xs">
                          {error["address.province"]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Kode Pos</Label>
                    <Input
                      id="postal_code"
                      placeholder="12345"
                      name="postal_code"
                      value={formData.address?.postal_code || ""}
                      onChange={handleAddressChange}
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                    />
                    {error["address.postal_code"] && (
                      <span className="text-red-500 text-xs">
                        {error["address.postal_code"]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default LocationForm;
