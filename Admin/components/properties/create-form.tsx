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
import * as z from "zod";
import { createProperty } from "@/api/property";

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Nama */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Rumah Subsidi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Tersedia / Dijual" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Harga */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Contoh: 500000000"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Satuan Harga */}
        <FormField
          control={form.control}
          name="price_unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Satuan Harga</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: /m²" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mata Uang */}
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mata Uang</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: IDR" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Deskripsi */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Tuliskan deskripsi properti..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Simpan Properti</Button>
      </form>
    </Form>
  );
}

export default CreatePropertyForm;
