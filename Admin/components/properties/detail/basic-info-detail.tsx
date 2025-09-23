import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAddress } from "@/lib/utils";
import { Property } from "@/types/properties";
import { Mail, MapPin, Phone, User } from "lucide-react";
import React from "react";

export default function BasicInfoDetail({ property }: { property: Property }) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Property Name</label>
            <p className="text-sm ">{property.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Property Type</label>
            <p className="text-sm ">
              <Badge variant="secondary">{property.type}</Badge>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Slug</label>
            <p className="text-sm  font-mono">{property.slug}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Location Coordinates</label>
            <p className="text-sm  font-mono">{property.location?.coordinates.join(", ")}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Address</label>
          <p className="text-sm  flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
            {formatAddress(property.address)}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Short Description</label>
          <p className="text-sm ">{property.description}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Detailed Description</label>
          <p className="text-sm  leading-relaxed">{property.detail_description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
