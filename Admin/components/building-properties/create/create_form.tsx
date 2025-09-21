"use client";
import React, { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Property } from "@/types/properties";
import {
  PriceUnit,
  Building_Property,
  PropertyStatus,
  PropertyType,
} from "@/types/building-properties";
import { Camera, Info, MapPin, Settings } from "lucide-react";
import { showToastError, showToastSuccess } from "@/components/toast";
