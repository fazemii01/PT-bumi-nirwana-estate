"use client";
import React, { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAgent } from "@/api/agent";
import { getDeveloper } from "@/api/developer";
import { Agent } from "@/types/agent";
import { Developer } from "@/types/developer";
import { PriceUnit, Property, PropertyStatus } from "@/types/properties";
import BasicInfoForm from "@/components/properties/create/basic-info-form";
import LocationForm from "@/components/properties/create/location-form";
import SpecificationsForm from "@/components/properties/create/specifications-form";
import { Camera, Info, MapPin, Settings } from "lucide-react";
import { PropertyZod, UpdatePropertyZod } from "@/lib/zod";
import { showToastError, showToastSuccess } from "../toast";

type UpdateSubmitHandler = (props: {
  id: string;
  data: Property;
  originalData: Property;
}) => Promise<boolean | void>;

const PropertyEditForm = ({
  initialData,
  onSubmit,
}: {
  initialData: Property;
  onSubmit: UpdateSubmitHandler;
}) => {
  // State untuk data form saat ini
  const [formData, setFormData] = useState<Property>(initialData);
  // State untuk menyimpan data original, untuk perbandingan saat update
  const [originalData, setOriginalData] = useState<Property>(initialData);

  const [agents, setAgents] = useState<Agent[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    console.log("Initial Data Received:", initialData);
    const parsedData = { ...initialData };

    if (typeof initialData.address === "string") {
      try {
        parsedData.address = JSON.parse(initialData.address);
      } catch (e) {
        console.error("Gagal mem-parsing JSON address:", e);
        parsedData.address = {};
      }
    }

    if (typeof initialData.specifications === "string") {
      try {
        parsedData.specifications = JSON.parse(initialData.specifications);
      } catch (e) {
        console.error("Gagal mem-parsing JSON specifications:", e);
        parsedData.specifications = {}; // Set ke objek kosong jika gagal
      }
    }

    setFormData(parsedData);
    setOriginalData(parsedData);

    async function fetchData() {
      const [agentsData, developersData] = await Promise.all([
        getAgent(),
        getDeveloper(),
      ]);
      setAgents(agentsData);
      setDevelopers(developersData);
    }

    fetchData();
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        type: "Point",
        coordinates:
          name === "lng"
            ? [numValue, prev.location!.coordinates[1]]
            : [prev.location!.coordinates[0], numValue],
      },
    }));
  };

  const handleAddressChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleSpecificationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: e.target.type === "number" ? Number(value) : value,
      },
    }));
  };

  const handleTextAreaSpecificationChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = UpdatePropertyZod.safeParse(formData);
    if (!result.success) {
      // Logika validasi error tetap sama
      const firstError = result.error.errors[0];
      const path = firstError.path;
      let tab = "basic";
      if (
        path.includes("location") ||
        path.includes("address") ||
        path.includes("coordinates")
      ) {
        tab = "location";
      } else if (path.includes("specifications")) {
        tab = "specs";
      }
      setActiveTab(tab);
      setError({
        [path.join(".")]: firstError.message,
      });
      return;
    }
    setError({});

    startTransition(async () => {
      try {
        // Panggil fungsi onSubmit dengan parameter yang sesuai untuk update
        const res = await onSubmit({
          id: formData.id,
          data: formData,
          originalData: originalData,
        });

        if (res) {
          showToastSuccess("Property updated successfully!");
          // Setelah berhasil, update originalData agar sesuai dengan data baru
          setOriginalData(formData);
        }
      } catch (error) {
        showToastError("Failed to update property. Please try again.");
        console.error("Error updating property:", error);
      }
    });
  };

  return (
    <div className=" mx-auto space-y-6">
      <div className="flex items-center justify-between">
        {/* Ubah Judul */}
        <h1 className="text-3xl font-bold">Edit Property</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            {/* TABS TETAP SAMA */}
            <TabsList className="grid grid-cols-3 w-full h-auto">
              <TabsTrigger
                value="basic"
                className="flex items-center justify-center py-2 cursor-pointer"
              >
                <Info className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Info Dasar</span>
              </TabsTrigger>
              <TabsTrigger
                value="location"
                className="flex items-center justify-center py-2 cursor-pointer"
              >
                <MapPin className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Lokasi</span>
              </TabsTrigger>
              <TabsTrigger
                value="specs"
                className="flex items-center justify-center py-2 cursor-pointer"
              >
                <Settings className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Spesifikasi</span>
              </TabsTrigger>
            </TabsList>
            {/* KOMPONEN FORM (BasicInfoForm, dll) TETAP SAMA */}
            <BasicInfoForm
              formData={formData}
              handleSelectChange={handleSelectChange}
              handleInputChange={handleInputChange}
              handleTextAreaChange={handleTextAreaChange}
              developers={developers}
              agents={agents}
              error={error}
            />
            {activeTab === "location" && (
              <LocationForm
                formData={formData}
                handleAddressChange={handleAddressChange}
                handleLocationChange={handleLocationChange}
                error={error}
              />
            )}
            {activeTab === "specs" && (
              <SpecificationsForm
                formData={formData}
                handleSpecificationChange={handleSpecificationChange}
                handleTextAreaSpecificationChange={
                  handleTextAreaSpecificationChange
                }
                error={error}
              />
            )}
          </Tabs>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              disabled={pending}
            >
              {/* Ubah Teks Tombol */}
              {pending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyEditForm;
