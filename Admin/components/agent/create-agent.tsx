import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "recharts";

const CreateAgent = ({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Agent</AlertDialogTitle>
          <AlertDialogDescription>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label>Name</Label>
                  <Input id="name" type="name" placeholder="full name" required />
                </div>
                <div className="grid gap-3">
                  <Label>Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label>Phone Number</Label>
                  </div>
                  <Input id="phone_number" type="phone_number" placeholder="+6265434566554" required />
                </div>
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    Save
                  </Button>
                </div>
              </div>
            </form>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => setOpen(false)}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateAgent;
