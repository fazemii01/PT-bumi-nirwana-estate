import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconCategory } from "@tabler/icons-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { showToastError, showToastSuccess } from "../toast";
import { AgentZod } from "@/lib/zod";
import { useRouter } from "next/navigation";
import { NewsCategory } from "@/types/news";
import { submitUpdateNewsCategory } from "@/actions/news_category";

const EditNewsCategory = ({ edit, setEdit, category }: { edit: boolean; setEdit: (value: boolean) => void; category: NewsCategory }) => {
  const router = useRouter();

  const [form, setForm] = useState<NewsCategory>({
    id: category.id ?? "",
    name: category.name ?? "",
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
    setEdit(false);
  };

  const handleSubmit = () => {
    const result = AgentZod.safeParse(form);
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    startTransition(async () => {
      const res = await submitUpdateNewsCategory(form);
      if (!res.success) {
        showToastError(res.message || "Failed to update news category. Please try again.");
        return;
      }

      setEdit(false);
      showToastSuccess(res.message || "News category update successfully!");
      router.refresh();
    });
  };

  return (
    <AlertDialog open={edit} onOpenChange={setEdit} key={category.id}>
      <AlertDialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <div className="p-2 bg-yellow-100 rounded-full">
                <IconCategory className="size-5 text-yellow-600" />
              </div>
              Update News Category
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">Fill in the information below to update news category.</AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="flex items-center gap-2">
                <IconCategory className="size-4 text-gray-500" />
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
            <Button type="button" onClick={handleSubmit} disabled={pending} className="flex-1 bg-yellow-600 hover:bg-yellow-700 cursor-pointer">
              {pending ? "Submitting..." : "Update Category"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditNewsCategory;
