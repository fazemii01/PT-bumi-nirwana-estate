"use client";
import React, { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAgent } from "@/api/agent";
import { getDeveloper } from "@/api/developer";
import { Agent } from "@/types/agent";
import { Developer } from "@/types/developer";
import { Property } from "@/types/properties";
import BasicInfoForm from "@/components/properties/create/basic-info-form";
import LocationForm from "@/components/properties/create/location-form";
import SpecificationsForm from "@/components/properties/create/specifications-form";
import { Info, MapPin, Settings } from "lucide-react";
import { UpdatePropertyZod } from "@/lib/zod";
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
  const safeParsed = React.useMemo(() => {
    const parsed: Property = { ...initialData };

    if (typeof parsed.address === "string") {
      try {
        parsed.address = JSON.parse(parsed.address as unknown as string);
      } catch {
        parsed.address = {};
      }
    } else {
      parsed.address = parsed.address ?? {};
    }

    if (typeof parsed.specifications === "string") {
      try {
        parsed.specifications = JSON.parse(
          parsed.specifications as unknown as string
        );
      } catch {
        parsed.specifications = {};
      }
    } else {
      parsed.specifications = parsed.specifications ?? {};
    }

    // fallback aman untuk location
    parsed.location = parsed.location ?? { type: "Point", coordinates: [0, 0] };

    return parsed;
  }, [initialData]);

  const [formData, setFormData] = useState<Property>(safeParsed);
  const [originalData, setOriginalData] = useState<Property>(safeParsed);

  const [agents, setAgents] = useState<Agent[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setFormData(safeParsed);
    setOriginalData(safeParsed);
  }, [safeParsed]);

  useEffect(() => {
    (async () => {
      try {
        const [agentsData, developersData] = await Promise.all([
          getAgent(),
          getDeveloper(),
        ]);
        setAgents(agentsData);
        setDevelopers(developersData);
      } catch {
        /* optional toast */
      }
    })();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(
      (prev) =>
        ({
          ...prev,
          [name]: type === "number" ? (value as unknown as number) : value,
        } as Property)
    );
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as Property));
  };

  const handleSelectChange = (name: keyof Property, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value } as Property));
  };

  const handleLocationChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);

    setFormData((prev) => {
      const [prevLng, prevLat] = prev.location?.coordinates ?? [0, 0];
      const next: [number, number] =
        name === "lng"
          ? [isNaN(numValue) ? prevLng : numValue, prevLat]
          : [prevLng, isNaN(numValue) ? prevLat : numValue];

      return {
        ...prev,
        location: { type: "Point", coordinates: next },
      } as Property;
    });
  };

  const handleAddressChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData(
      (prev) =>
        ({
          ...prev,
          address: { ...(prev.address as Record<string, any>), [name]: value },
        } as Property)
    );
  };

  const handleSpecificationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(
      (prev) =>
        ({
          ...prev,
          specifications: {
            ...(prev.specifications as Record<string, any>),
            [name]: type === "number" ? Number(value) : value,
          },
        } as Property)
    );
  };

  const handleTextAreaSpecificationChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(
      (prev) =>
        ({
          ...prev,
          specifications: {
            ...(prev.specifications as Record<string, any>),
            [name]: value,
          },
        } as Property)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = UpdatePropertyZod.safeParse(formData);
    if (!result.success) {
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
      setError({ [path.join(".")]: firstError.message });
      return;
    }
    setError({});

    startTransition(async () => {
      try {
        const ok = await onSubmit({
          id: formData.id,
          data: formData,
          originalData,
        });

        if (ok) {
          showToastSuccess("Property updated successfully!");
          setOriginalData(formData);
        } else {
          showToastError("Failed to update property. Please try again.");
        }
      } catch (err) {
        showToastError("Failed to update property. Please try again.");
        console.error("Error updating property:", err);
      }
    });
  };

  return (
    <div className="mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Property</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
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

            <BasicInfoForm
              formData={formData}
              handleSelectChange={handleSelectChange as any}
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
              {pending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyEditForm;
