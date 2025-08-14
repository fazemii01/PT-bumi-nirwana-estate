import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IconUpload,
  IconUser,
  IconMail,
  IconPhone,
  IconImageInPicture,
} from "@tabler/icons-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { addAgent, updateAgent } from "@/api/agent"; // asumsi endpoint kamu pakai ini
import { Agent } from "@/types/agent";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { showToastError, showToastSuccess } from "../toast";
import { AgentZod } from "@/lib/zod";
import { ZodError } from "zod";

const EditAgent = ({
  edit,
  setEdit,
  agent,
}: {
  edit: boolean;
  setEdit: (value: boolean) => void;
  agent: Agent;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState<Agent>({
    id: agent.id ?? "",
    full_name: agent.full_name ?? "",
    email: agent.email ?? "",
    phone_number: agent.phone_number ?? "",
    avatar_url: agent.avatar_url ?? "",
    file_avatar: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (agent?.avatar_url) {
      setPreviewUrl(
        `${process.env.NEXT_PUBLIC_API_URL}/uploads/agent/${agent.avatar_url}`
      );
    } else {
      setPreviewUrl(null);
    }
  }, [agent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setForm((prev) => ({
        ...prev,
        file_avatar: file,
        avatar_url: file.name,
      }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleCancel = () => {
    setEdit(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setForm((prev) => ({
      ...prev,
      file_avatar: undefined,
      avatar_url: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    const result = AgentZod.safeParse(form);

    if (!result.success) {
      const zodErrors: Record<string, string> = {};
      (result.error as ZodError).errors.forEach((err) => {
        if (err.path.length > 0) {
          zodErrors[err.path[0]] = err.message;
        }
      });
      setErrors(zodErrors);
      return;
    }
    setErrors({});

    startTransition(async () => {
      try {
        await updateAgent({ data: form, originalData: agent });
        // setSelectedFile(null);
        // setPreviewUrl(null);
        setEdit(false);
        showToastSuccess("Update agent successful");
      } catch (err) {
        showToastError(`${err}`);
      }
    });
  };

  return (
    <AlertDialog open={edit} onOpenChange={setEdit}>
      <AlertDialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <div className="p-2 bg-yellow-100 rounded-full">
                <IconUser className="size-5 text-yellow-600" />
              </div>
              Update Agent
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Fill in the information below to update agent profile.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="full_name" className="flex items-center gap-2">
                <IconUser className="size-4 text-gray-500" />
                Full Name
              </Label>
              <Input
                id="full_name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Enter full name"
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">{errors.full_name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="flex items-center gap-2">
                <IconMail className="size-4 text-gray-500" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="agent@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone_number" className="flex items-center gap-2">
                <IconPhone className="size-4 text-gray-500" />
                Phone Number
              </Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="+62 812 3456 7890"
              />
              {errors.phone_number && (
                <p className="text-sm text-red-500">{errors.phone_number}</p>
              )}
            </div>

            {/* Avatar */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <IconImageInPicture className="size-4 text-gray-500" />
                Profile Image
              </Label>

              <div
                className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : selectedFile
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <label
                  htmlFor="input-file"
                  className="flex flex-col items-center justify-center py-8 cursor-pointer"
                >
                  {selectedFile && previewUrl ? (
                    <>
                      <div className="relative w-32 h-32 verflow-hidden mb-3">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeFile();
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors"
                        >
                          ×
                        </button>
                      </div>

                      <div className="text-center space-y-3">
                        <p className="text-sm font-medium text-green-700 truncate max-w-48">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-green-600">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      <p className="text-xs text-gray-500">
                        Click to change image
                      </p>
                    </>
                  ) : previewUrl ? (
                    <>
                      <div className="relative w-32 h-32 overflow-hidden mb-3">
                        <Image
                          fill
                          src={previewUrl}
                          alt="Preview"
                          className=" object-cover "
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeFile();
                          }}
                          className="absolute -right-0 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors"
                        >
                          ×
                        </button>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-green-700 truncate max-w-48">
                          {agent.avatar_url}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        Click to change image
                      </p>
                    </>
                  ) : (
                    <div className="text-center space-y-2">
                      <div
                        className={`p-3 rounded-full w-fit mx-auto transition-colors ${
                          dragActive ? "bg-blue-100" : "bg-gray-200"
                        }`}
                      >
                        <IconUpload
                          className={`size-6 ${
                            dragActive ? "text-blue-600" : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {dragActive
                            ? "Drop your image here"
                            : "Upload profile image"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Drag & drop or click to browse
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, GIF up to 4MB
                      </p>
                    </div>
                  )}
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="input-file"
                  name="file_avatar"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
              {errors.avatar && (
                <p className="text-sm text-red-500">{errors.avatar}</p>
              )}
            </div>
          </div>

          <AlertDialogFooter className="pt-6 border-t border-gray-200 gap-3">
            <AlertDialogCancel
              disabled={pending}
              onClick={handleCancel}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            {/* <AlertDialogAction onClick={handleSubmit} disabled={pending} className="flex-1 bg-yellow-600 hover:bg-yellow-700 cursor-pointer">
              {pending ? "Submitting..." : "Create Agent"}
            </AlertDialogAction> */}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={pending}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 cursor-pointer"
            >
              {pending ? "Submitting..." : "Update Agent"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditAgent;
