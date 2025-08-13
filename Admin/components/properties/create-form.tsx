"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getAgent } from "@/api/agent";
import { getDeveloper } from "@/api/developer";
import { Agent } from "@/types/agent";
import { Developer } from "@/types/developer";
import { PriceUnit, Property, PropertyStatus } from "@/types/properties";
import BasicInfoForm from "./basic-info-form";
import LocationForm from "./location-form";
import SpecificationsForm from "./specifications-form";
import MediaForm from "./media-form";
import { Camera, Info, MapPin, Settings } from "lucide-react";

const PropertyCreateForm = () => {
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
        [name]: value,
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

  // const handleSubmit = async () => {
  //   // Prepare FormData for submission
  //   const submitData = new FormData();

  //   // Add basic fields
  //   Object.keys(formData).forEach((key) => {
  //     if (
  //       key !== "images" &&
  //       key !== "floor_plans" &&
  //       key !== "location" &&
  //       key !== "address" &&
  //       key !== "specifications"
  //     ) {
  //       submitData.append(key, formData[key]);
  //     }
  //   });

  //   // Add JSON fields
  //   submitData.append("location", JSON.stringify(formData.location));
  //   submitData.append("address", JSON.stringify(formData.address));
  //   submitData.append(
  //     "specifications",
  //     JSON.stringify(formData.specifications)
  //   );

  //   // Add image files
  //   formData.images.forEach((image, index) => {
  //     submitData.append(`images[${index}][file]`, image.file);
  //     submitData.append(`images[${index}][caption]`, image.caption);
  //     submitData.append(
  //       `images[${index}][sort_order]`,
  //       image.sort_order.toString()
  //     );
  //   });

  //   // Add floor plan files
  //   formData.floor_plans.forEach((floorPlan, index) => {
  //     submitData.append(`floor_plans[${index}][file]`, floorPlan.file);
  //     submitData.append(`floor_plans[${index}][name]`, floorPlan.name);
  //     submitData.append(
  //       `floor_plans[${index}][sort_order]`,
  //       floorPlan.sort_order.toString()
  //     );
  //   });

  //   // Submit to API
  //   console.log("Submitting property data:", formData);
  //   // Replace with actual API call
  //   // await createProperty(submitData);
  // };

  return (
    <div className=" mx-auto  space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Property</h1>
      </div>

      <div>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-4 w-full h-auto">
            <TabsTrigger
              value="basic"
              className="flex flex-col items-center gap-1 py-2"
            >
              <Info className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">Info Dasar</span>
            </TabsTrigger>
            <TabsTrigger
              value="location"
              className="flex flex-col items-center gap-1 py-2"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">Lokasi</span>
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="flex flex-col items-center gap-1 py-2"
            >
              <Camera className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">Media</span>
            </TabsTrigger>
            <TabsTrigger
              value="specs"
              className="flex flex-col items-center gap-1 py-2"
            >
              <Settings className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">Spesifikasi</span>
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
          />

          {/* Location Tab */}
          {activeTab === "location" && (
            <LocationForm
              formData={formData}
              handleAddressChange={handleAddressChange}
              handleLocationChange={handleLocationChange}
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
            />
          )}
        </Tabs>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline">
            Simpan Draft
          </Button>
          <Button type="button" className="bg-blue-600 hover:bg-blue-700">
            Publish Property
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCreateForm;
