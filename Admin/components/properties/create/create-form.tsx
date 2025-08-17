"use client";
import React, { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAgent } from "@/api/agent";
import { getDeveloper } from "@/api/developer";
import { Agent } from "@/types/agent";
import { Developer } from "@/types/developer";
import { PriceUnit, Property, PropertyStatus } from "@/types/properties";

import { Camera, Info, MapPin, Settings } from "lucide-react";
import { PropertyZod } from "@/lib/zod";
import { showToastError, showToastSuccess } from "@/components/toast";
import BasicInfoForm from "@/components/properties/create/basic-info-form";
import LocationForm from "@/components/properties/create/location-form";
import MediaForm from "@/components/properties/create/media-form";
import SpecificationsForm from "@/components/properties/create/specifications-form";

const PropertyCreateForm = ({
  onSubmit,
}: {
  onSubmit: (data: Property) => Promise<boolean | void>;
}) => {
  const [formData, setFormData] = useState<Property>({
    id: "",
    developerId: "",
    agentId: "",
    name: "",
    status: PropertyStatus.AVAILABLE,
    price: "",
    price_unit: PriceUnit.TOTAL,
    luas: "",
    jenis: "",
    description: "",
    detail_description: "",
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
    address: {},
    specifications: {},
    property_images: [],
    property_floor_plans: [],
    images: [],
    floor_plans: [],
  });

  const [agents, setAgents] = useState<Agent[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [pending, startTransition] = useTransition();
  useEffect(() => {
    async function fetchData() {
      const [agentsData, developersData] = await Promise.all([
        getAgent(),
        getDeveloper(),
      ]);
      setAgents(agentsData);
      setDevelopers(developersData);
    }

    fetchData();
  }, []);

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
    console.log(numValue);

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

  // Tambah gambar property
  const handleSingleImageUpload = (file: File) => {
    const preview = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { file, preview, caption: "" }],
      property_images: [...(prev.property_images || []), file],
    }));
  };

  // Update caption gambar
  const updateImageCaption = (index: number, caption: string) => {
    setFormData((prev) => {
      const updated = [...prev.images];
      updated[index].caption = caption;
      return { ...prev, images: updated };
    });
  };

  // Hapus gambar
  const removeImage = (index: number) => {
    setFormData((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== index);
      const updatedFiles = (prev.property_images || []).filter(
        (_, i) => i !== index
      );
      return { ...prev, images: updatedImages, property_images: updatedFiles };
    });
  };

  // Tambah floor plan
  const handleSingleFloorPlanUpload = (file: File) => {
    const preview = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : undefined;
    setFormData((prev) => ({
      ...prev,
      floor_plans: [...prev.floor_plans, { file, preview, name: "" }],
      property_floor_plans: [...(prev.property_floor_plans || []), file],
    }));
  };

  // Update nama floor plan
  const updateFloorPlanName = (index: number, name: string) => {
    setFormData((prev) => {
      const updated = [...prev.floor_plans];
      updated[index].name = name;
      return { ...prev, floor_plans: updated };
    });
  };

  // Hapus floor plan
  const removeFloorPlan = (index: number) => {
    setFormData((prev) => {
      const updatedPlans = prev.floor_plans.filter((_, i) => i !== index);
      const updatedFiles = (prev.property_floor_plans || []).filter(
        (_, i) => i !== index
      );
      return {
        ...prev,
        floor_plans: updatedPlans,
        property_floor_plans: updatedFiles,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = PropertyZod.safeParse(formData);
    if (!result.success) {
      const firstError = result.error.errors[0];
      const path = firstError.path;
      let tab = "basic";
      if (path.includes("location")) {
        tab = "location";
      } else if (path.includes("images") || path.includes("floor_plans")) {
        tab = "media";
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
        const res = await onSubmit(formData);

        if (res) {
          showToastSuccess("Property created successfully!");
          setFormData({
            id: "",
            developerId: "",
            agentId: "",
            name: "",
            status: PropertyStatus.AVAILABLE,
            price: "",
            price_unit: PriceUnit.TOTAL,
            luas: "",
            jenis: "",
            description: "",
            detail_description: "",
            location: {
              type: "Point",
              coordinates: [0, 0],
            },
            address: {},
            specifications: {},
            property_images: [],
            property_floor_plans: [],
            images: [],
            floor_plans: [],
          });
        }
      } catch (error) {
        showToastError("Failed to create property. Please try again.");
        console.error("Error creating property:", error);
      }
    });
  };

  return (
    <div className=" mx-auto  space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Property</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-4 w-full h-auto">
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
                value="media"
                className="flex items-center justify-center py-2 cursor-pointer"
              >
                <Camera className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Media</span>
              </TabsTrigger>
              <TabsTrigger
                value="specs"
                className="flex items-center justify-center py-2 cursor-pointer"
              >
                <Settings className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Spesifikasi</span>
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <BasicInfoForm
              formData={formData}
              handleSelectChange={handleSelectChange}
              handleInputChange={handleInputChange}
              handleTextAreaChange={handleTextAreaChange}
              developers={developers}
              agents={agents}
              error={error}
            />

            {/* Location Tab */}
            {activeTab === "location" && (
              <LocationForm
                formData={formData}
                handleAddressChange={handleAddressChange}
                handleLocationChange={handleLocationChange}
                error={error}
              />
            )}

            {/* Media Tab */}
            {activeTab === "media" && (
              <MediaForm
                formData={formData}
                handleSingleImageUpload={handleSingleImageUpload}
                handleSingleFloorPlanUpload={handleSingleFloorPlanUpload}
                updateImageCaption={updateImageCaption}
                updateFloorPlanName={updateFloorPlanName}
                removeFloorPlan={removeFloorPlan}
                removeImage={removeImage}
                error={error}
              />
            )}

            {/* Specifications Tab */}
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
            >
              {pending ? "Loading..." : "Publish Property"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyCreateForm;
