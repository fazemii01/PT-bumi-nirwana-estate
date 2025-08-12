"use client";
import { IconFile, IconPlus, IconX } from "@tabler/icons-react";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FileUploadManagerProps = {
  files: File[];
  onFilesChange: React.Dispatch<React.SetStateAction<File[]>>;
  maxFiles: number;
  acceptedFileTypes?: string;
  label: string;
};

type FileWithPreview = {
  file: File;
  preview: string;
};

export const FileUploadManager = ({
  files,
  onFilesChange,
  maxFiles,
  acceptedFileTypes = "image/*",
  label,
}: FileUploadManagerProps) => {
  const [filePreviews, setFilePreviews] = useState<FileWithPreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const newFilePreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFilePreviews(newFilePreviews);

    return () => {
      newFilePreviews.forEach((fp) => URL.revokeObjectURL(fp.preview));
    };
  }, [files]);

  const handleFileAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      if (files.length + newFiles.length > maxFiles) {
        alert(`Maksimal ${maxFiles} file`);
        return;
      }
      onFilesChange((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileRemove = (indexToRemove: number) => {
    onFilesChange((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <label className="font-medium text-sm">
        {label} (Sisa {maxFiles - files.length})
      </label>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-4">
        {filePreviews.map((fp, index) => (
          <div
            key={index}
            className="relative w-32 h-32 rounded-lg border-2 border-muted overflow-hidden group"
          >
            {fp.file.type.startsWith("image/") ? (
              <img
                src={fp.preview}
                alt={fp.file.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-muted p-2">
                <IconFile className="w-10 h-10 text-muted-foreground" />
                <p className="text-xs text-center text-muted-foreground mt-1 truncate">
                  {fp.file.name}
                </p>
              </div>
            )}
            {/* Overlay hapus full area */}
            <div
              className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center transition-all cursor-pointer"
              onClick={() => handleFileRemove(index)}
            >
              <IconX className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}

        {files.length < maxFiles && (
          <div
            onClick={triggerFileSelect}
            className="w-32 h-32 rounded-lg border-2 border-dashed border-primary/50 flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors"
          >
            <IconPlus className="w-10 h-10 text-primary/80" />
            <p className="mt-1 text-sm font-medium text-primary">Tambah File</p>
          </div>
        )}

        <Input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          multiple
          accept={acceptedFileTypes}
          onChange={handleFileAdd}
        />
      </div>
    </div>
  );
};
