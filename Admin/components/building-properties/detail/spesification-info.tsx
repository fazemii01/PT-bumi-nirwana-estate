import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BuildingProperty, Specifications } from "@/types/building-properties"; // Pastikan Specifications di-export dari types
import {
  BedDouble,
  Bath,
  Sofa,
  CookingPot,
  Car,
  Layers,
  Building,
  Scan,
  Construction,
  DoorOpen,
  PanelTop,
  Bolt,
  Droplets,
  Wifi,
  ShieldCheck,
  Star,
  LucideProps,
} from "lucide-react";
import React from "react";

// Helper SpecItem dan SpecCategory tetap sama (tidak perlu diubah)
const SpecItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType<LucideProps>;
  label: string;
  value?: string | number;
}) => {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="w-5 h-5 text-gray-500 flex-shrink-0" />
      <div>
        <span className="font-medium text-gray-800">{String(value)}</span>
        <span className="text-gray-600"> {label}</span>
      </div>
    </div>
  );
};

const SpecCategory = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const validChildren = React.Children.toArray(children).filter(Boolean);
  if (validChildren.length === 0) return null;
  return (
    <div>
      <h3 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5">
        {children}
      </div>
    </div>
  );
};

export default function SpecificationsInfo({
  building,
}: {
  building: BuildingProperty;
}) {
  // ======================= PERUBAHAN UTAMA DI SINI =======================
  let specs: Specifications | null = null;

  // Cek dulu apakah specifications ada
  if (building.specifications) {
    try {
      // Jika `building.specifications` adalah string, parse menjadi objek
      if (typeof building.specifications === "string") {
        specs = JSON.parse(building.specifications);
      } else {
        // Jika sudah berupa objek, langsung gunakan
        specs = building.specifications;
      }
    } catch (error) {
      console.error("Gagal mem-parsing data spesifikasi:", error);
      specs = null; // Gagal parsing, anggap tidak ada data
    }
  }
  // ======================================================================

  if (!specs) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spesifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Informasi spesifikasi tidak tersedia atau format data salah.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spesifikasi Detail</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Sekarang semua value mengambil dari variabel `specs` yang sudah di-parsing */}
        <SpecCategory title="Dimensi & Ruangan">
          <SpecItem
            icon={BedDouble}
            label="Kamar Tidur"
            value={specs.bedrooms}
          />
          <SpecItem icon={Bath} label="Kamar Mandi" value={specs.bathrooms} />
          <SpecItem
            icon={Sofa}
            label="Ruang Keluarga"
            value={specs.family_room}
          />
          <SpecItem icon={CookingPot} label="Dapur" value={specs.kitchen} />
          <SpecItem icon={Car} label="Garasi Mobil" value={specs.garage} />
          <SpecItem icon={Layers} label="Lantai" value={specs.floors} />
        </SpecCategory>

        <SpecCategory title="Material Bangunan">
          <SpecItem icon={Building} label="Struktur" value={specs.structure} />
          <SpecItem icon={Scan} label="Lantai" value={specs.floor} />
          <SpecItem icon={Construction} label="Dinding" value={specs.walls} />
          <SpecItem icon={PanelTop} label="Atap" value={specs.roof} />
          <SpecItem
            icon={DoorOpen}
            label="Pintu & Jendela"
            value={specs.doors}
          />
        </SpecCategory>

        <SpecCategory title="Utilitas">
          <SpecItem icon={Bolt} label="Listrik" value={specs.electricity} />
          <SpecItem
            icon={Droplets}
            label="Sumber Air"
            value={specs.water_source}
          />
          <SpecItem icon={Wifi} label="Internet" value={specs.internet} />
          <SpecItem
            icon={ShieldCheck}
            label="Keamanan"
            value={specs.security}
          />
        </SpecCategory>

        {specs.facilities && (
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-3 border-b pb-2">
              Fasilitas Lainnya
            </h3>
            <div className="flex items-start gap-3 text-sm">
              <Star className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700 whitespace-pre-line">
                {specs.facilities}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
