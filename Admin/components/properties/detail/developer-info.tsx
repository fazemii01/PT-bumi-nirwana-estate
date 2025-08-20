import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/properties";
import { Building, Globe } from "lucide-react";
import React from "react";

export default function DeveloperInfo({ property }: { property: Property }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          Developer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <h4 className="font-semibold">{property.developer?.name}</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <a href={`https://${property.developer?.website_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {property.developer?.website_url}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
