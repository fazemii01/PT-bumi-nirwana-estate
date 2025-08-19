import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/properties";
import { Mail, Phone, User } from "lucide-react";
import React from "react";

export default function AgentContent({ property }: { property: Property }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Agent Property
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">{property.agent?.full_name}</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <a href={`tel:${property.agent?.phone_number}`} className="text-blue-600 hover:underline">
                {property.agent?.phone_number}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <a href={`mailto:${property.agent?.email}`} className="text-blue-600 hover:underline">
                {property.agent?.email}
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Button className="w-full bg-green-600 hover:bg-green-700">
            <Phone className="w-4 h-4 mr-2" />
            Hubungi Agent
          </Button>
          <Button variant="outline" className="w-full">
            <Mail className="w-4 h-4 mr-2" />
            Kirim Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
