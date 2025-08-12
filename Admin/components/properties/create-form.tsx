"use client";
import React, { useState, useRef } from "react";
import { useTheme } from "next-themes";
import { useThemeConfig } from "@/components/active-theme";
import { X, Upload, ImageIcon, FileText, Eye, Save } from "lucide-react";

const PropertyCreateForm = () => {
  const { theme } = useTheme();
  const { activeTheme } = useThemeConfig();

  const [formData, setFormData] = useState({
    name: "",
    status: "AVAILABLE",
    price: "",
    priceUnit: "PER_MONTH",
    luas: "",
    description: "",
    images: [],
    floorPlans: [],
  });

  const [errors, setErrors] = useState({});
  const imageInputRef = useRef(null);
  const floorPlanInputRef = useRef(null);

  const statusOptions = [
    { value: "AVAILABLE", label: "Available" },
    { value: "SOLD", label: "Sold" },
    { value: "RENTED", label: "Rented" },
  ];

  const priceUnitOptions = [
    { value: "PER_MONTH", label: "Per Month" },
    { value: "PER_YEAR", label: "Per Year" },
    { value: "TOTAL", label: "Total Price" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileUpload = (files, type) => {
    const fileArray = Array.from(files);
    const maxFiles = type === "images" ? 5 : 3;
    const currentFiles = formData[type];

    if (currentFiles.length + fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} ${type} allowed`);
      return;
    }

    const newFiles = fileArray.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], ...newFiles],
    }));
  };

  const removeFile = (id, type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((file) => {
        if (file.id === id) {
          URL.revokeObjectURL(file.preview);
        }
        return file.id !== id;
      }),
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files, type);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    if (!formData.luas.trim()) newErrors.luas = "Luas is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.images.length === 0)
      newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Create FormData for file upload
      const submitData = new FormData();

      // Append text fields
      Object.keys(formData).forEach((key) => {
        if (key !== "images" && key !== "floorPlans") {
          submitData.append(key, formData[key]);
        }
      });

      // Append files
      formData.images.forEach((img) => {
        submitData.append("images", img.file);
      });

      formData.floorPlans.forEach((plan) => {
        submitData.append("floorPlans", plan.file);
      });

      // Make API call with axios
      // const response = await axios.post('/api/properties', submitData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      console.log("Form submitted successfully", submitData);
      alert("Property created successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error creating property. Please try again.");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-600 text-green-50";
      case "SOLD":
        return "bg-red-600 text-red-50";
      case "RENTED":
        return "bg-yellow-600 text-yellow-50";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Create New Property
          </h1>
          <p className="text-muted-foreground mt-2">
            Add a new property to your listings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-xl font-semibold mb-4 flex items-center text-card-foreground">
                  <FileText className="mr-2" size={20} />
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Property Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-input border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground ${
                        errors.name ? "border-destructive" : "border-border"
                      }`}
                      placeholder="Enter property name"
                    />
                    {errors.name && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-input border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground ${
                        errors.price ? "border-destructive" : "border-border"
                      }`}
                      placeholder="Enter price"
                    />
                    {errors.price && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Price Unit
                    </label>
                    <select
                      name="priceUnit"
                      value={formData.priceUnit}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    >
                      {priceUnitOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Luas (m²)
                    </label>
                    <input
                      type="number"
                      name="luas"
                      value={formData.luas}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-input border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground ${
                        errors.luas ? "border-destructive" : "border-border"
                      }`}
                      placeholder="Enter area in square meters"
                    />
                    {errors.luas && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.luas}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className={`w-full px-3 py-2 bg-input border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-none ${
                        errors.description
                          ? "border-destructive"
                          : "border-border"
                      }`}
                      placeholder="Enter property description"
                    />
                    {errors.description && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Property Images */}
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-xl font-semibold mb-4 flex items-center text-card-foreground">
                  <ImageIcon className="mr-2" size={20} />
                  Property Images ({formData.images.length}/5)
                </h3>

                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    errors.images
                      ? "border-destructive"
                      : "border-border hover:border-primary"
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "images")}
                  onClick={() => imageInputRef.current?.click()}
                >
                  <Upload
                    className="mx-auto mb-2 text-muted-foreground"
                    size={32}
                  />
                  <p className="text-muted-foreground">
                    Drag & drop images here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Maximum 5 images, JPG, PNG (Max 5MB each)
                  </p>
                </div>

                <input
                  ref={imageInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files, "images")}
                  className="hidden"
                />

                {errors.images && (
                  <p className="text-destructive text-sm mt-2">
                    {errors.images}
                  </p>
                )}

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {formData.images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.preview}
                          alt={image.name}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(image.id, "images")}
                          className="absolute -top-2 -right-2 bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Floor Plans */}
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-xl font-semibold mb-4 flex items-center text-card-foreground">
                  <FileText className="mr-2" size={20} />
                  Floor Plans ({formData.floorPlans.length}/3)
                </h3>

                <div
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "floorPlans")}
                  onClick={() => floorPlanInputRef.current?.click()}
                >
                  <Upload
                    className="mx-auto mb-2 text-muted-foreground"
                    size={32}
                  />
                  <p className="text-muted-foreground">
                    Drag & drop floor plans here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Maximum 3 files, JPG, PNG, PDF (Max 10MB each)
                  </p>
                </div>

                <input
                  ref={floorPlanInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) =>
                    handleFileUpload(e.target.files, "floorPlans")
                  }
                  className="hidden"
                />

                {formData.floorPlans.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {formData.floorPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="relative group bg-muted rounded-lg p-4 border"
                      >
                        {plan.file.type.startsWith("image/") ? (
                          <img
                            src={plan.preview}
                            alt={plan.name}
                            className="w-full h-32 object-cover rounded border"
                          />
                        ) : (
                          <div className="h-32 flex items-center justify-center">
                            <FileText
                              size={48}
                              className="text-muted-foreground"
                            />
                          </div>
                        )}
                        <p className="text-sm text-foreground mt-2 truncate">
                          {plan.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeFile(plan.id, "floorPlans")}
                          className="absolute -top-2 -right-2 bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors flex items-center"
                >
                  <Save className="mr-2" size={20} />
                  Save Property
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-xl font-semibold mb-4 flex items-center text-card-foreground">
                  <Eye className="mr-2" size={20} />
                  Live Preview
                </h3>

                <div className="bg-muted rounded-lg overflow-hidden border">
                  {/* Property Image */}
                  <div className="h-48 bg-muted-foreground/10 flex items-center justify-center border-b">
                    {formData.images.length > 0 ? (
                      <img
                        src={formData.images[0].preview}
                        alt="Property preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon size={48} className="text-muted-foreground" />
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="p-4">
                    <h4 className="text-lg font-semibold mb-2 text-foreground">
                      {formData.name || "Property Name"}
                    </h4>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(formData.price)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          formData.status
                        )}`}
                      >
                        {formData.status}
                      </span>
                    </div>

                    <div className="text-sm text-muted-foreground mb-2">
                      {formData.priceUnit.replace("_", " ").toLowerCase()}
                      {formData.luas && ` • ${formData.luas} m²`}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {formData.description ||
                        "Property description will appear here..."}
                    </p>

                    {formData.images.length > 1 && (
                      <div className="flex mt-3 space-x-2">
                        {formData.images.slice(1, 4).map((img) => (
                          <div
                            key={img.id}
                            className="w-12 h-12 rounded overflow-hidden border"
                          >
                            <img
                              src={img.preview}
                              alt="Thumbnail"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {formData.images.length > 4 && (
                          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs border">
                            +{formData.images.length - 4}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCreateForm;
