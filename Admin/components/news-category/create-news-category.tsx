import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconCategory } from "@tabler/icons-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { showToastError, showToastSuccess } from "../toast";
import { useRouter } from "next/navigation";
import { NewsCategory } from "@/types/news";
import { submitCreateNewsCategory } from "@/actions/news_category";

const CreateNewsCategory = ({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) => {
  const router = useRouter();

  const [form, setForm] = useState<NewsCategory>({
    id: "",
    name: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";

    return newErrors;
  };

  const handleCancel = () => {
    setForm({
      id: "",
      name: "",
    });

    setOpen(false);
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    startTransition(async () => {
      const res = await submitCreateNewsCategory({ data: form });
      if (!res.success) {
        showToastError(res.message || "Failed to create news category. Please try again.");
        return;
      }
      setForm({
        id: "",
        name: "",
      });
      setOpen(false);
      showToastSuccess(res.message || "News category created successfully!");
      router.refresh();
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-2xl font-semibold flex items-center gap-2">
              <div className="p-2 rounded-full">
                <IconCategory className="size-5" />
              </div>
              Create New News Category
            </AlertDialogTitle>
            <AlertDialogDescription>Fill in the information below to create a new news category.</AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="flex items-center gap-2">
                <IconCategory className="size-4" />
                Name
              </Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Enter name category" />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
          </div>

          <AlertDialogFooter className="pt-6 border-t border-gray-200 gap-3">
            <AlertDialogCancel disabled={pending} onClick={handleCancel} className="flex-1 cursor-pointer">
              Cancel
            </AlertDialogCancel>
            {/* <AlertDialogAction onClick={handleSubmit} disabled={pending} className="flex-1 bg-yellow-600 hover:bg-yellow-700 cursor-pointer">
              {pending ? "Submitting..." : "Create Agent"}
            </AlertDialogAction> */}
            <Button type="button" onClick={handleSubmit} disabled={pending} className="flex-1 cursor-pointer">
              {pending ? "Submitting..." : "Create Category"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateNewsCategory;
