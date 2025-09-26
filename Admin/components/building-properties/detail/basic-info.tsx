import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BuildingProperty } from "@/types/building-properties";
import React from "react";

export default function BasicInfo({
  building,
}: {
  building: BuildingProperty;
}) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Nama Bangunan/Blok
            </label>
            <p className="text-sm ">{building.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <p className="text-sm ">
              <Badge variant="secondary">{building.status}</Badge>
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">
            Description
          </label>
          <p className="text-sm ">{building.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
