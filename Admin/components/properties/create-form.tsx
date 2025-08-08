"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import * as z from "zod";
import { createProperty } from "@/api/property";
import { IoCloudUploadOutline, IoTrashOutline } from "react-icons/io5";
import { BarLoader } from "react-spinners";
import { useRef, useState, useTransition } from "react";

const propertySchema = z.object({
  name: z.string().min(2, "Nama harus diisi"),
  status: z.string().min(1, "Status harus dipilih"),
  price: z.coerce.number().min(1000, "Harga minimal 1000"),
  price_unit: z.string().min(1, "Satuan harga harus diisi"),
  currency: z.string().min(1, "Mata uang harus diisi"),
  description: z.string().min(5, "Deskripsi harus diisi"),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

function CreatePropertyForm() {
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      status: "",
      price: 1000,
      price_unit: "",
      currency: "IDR",
      description: "",
    },
  });

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      await createProperty(data);
      alert("Properti berhasil disimpan!");
      form.reset();
    } catch (error) {
      console.error("Error create:", error);
      alert("Gagal menyimpan properti.");
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-transparent rounded-3xl shadow-sm overflow-hidden">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[600px]">
                {/* Left Panel - Image Upload */}
                <div className="lg:col-span-2 dark:bg-gradient-to-br from-gray-200 to-gray-100 p-8 flex flex-col items-center justify-center">
                  <div className="w-full max-w-xs">
                    {/* Profile-like circle for property image */}
                    <div className="relative mb-6">
                      <label
                        htmlFor="input-file"
                        className="block relative cursor-pointer group"
                      >
                        <div className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center relative">
                          {pending ? (
                            <BarLoader color="#3b82f6" />
                          ) : image ? (
                            <>
                              <Image
                                src={image}
                                alt="Property preview"
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors z-10"
                              >
                                <IoTrashOutline className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <div className="text-center">
                              <IoCloudUploadOutline className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                              <p className="text-xs text-gray-500">Upload</p>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          ref={inputFileRef}
                          id="input-file"
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Additional image upload area */}
                    <div className="w-full">
                      <label
                        htmlFor="input-file-2"
                        className="flex flex-col items-center justify-center h-40 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-white hover:bg-gray-50 transition-colors"
                      >
                        <div className="text-center p-4">
                          <div className="bg-blue-50 rounded-full p-3 mb-3 mx-auto w-fit">
                            <IoCloudUploadOutline className="w-6 h-6 text-blue-500" />
                          </div>
                          <p className="text-sm font-medium mb-1">
                            Upload More Photos
                          </p>
                          {message ? (
                            <p className="text-xs text-red-500">{message}</p>
                          ) : (
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF (max: 4MB)
                            </p>
                          )}
                        </div>
                        <input
                          type="file"
                          ref={inputFileRef}
                          id="input-file"
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Form Fields */}
                <div className="lg:col-span-3 p-8">
                  {/* Header */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">
                      Property Information
                    </h2>
                    <p className="text-gray-500">
                      Fill in the property details below
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Name and Status Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Property Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter property name"
                                className="h-12 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Status
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Available / For Sale / For Rent"
                                className="h-12 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Price Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel className="text-sm font-medium">
                              Price
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="500000000"
                                className="h-12 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Currency
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="IDR"
                                className="h-12 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="price_unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Price Unit
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="/m² or /unit"
                                className="h-12 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="Describe the property details, available facilities, strategic location, and other advantages..."
                              className="bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 h-12 rounded-xl border-gray-200 hover:bg-gray-50"
                      >
                        Discard Changes
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 h-12 rounded-xl transition-colors"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default CreatePropertyForm;
