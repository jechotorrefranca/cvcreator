import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { BasicInfo } from "../types";
import Header from "../Header";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface Props {
  infos?: BasicInfo | null;
}

export default function BasicInfoSection({ infos }: Props) {
  const userId = useQuery(api.query.queries.getUser);
  const uploadInfo = useMutation(api.mutations.mutations.upsertBasicInfo);

  const [form, setForm] = useState({
    name: infos?.name ?? "",
    email: infos?.email ?? "",
    phone: infos?.contactNumber ?? "",
    address: infos?.location ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!userId) return;
    try {
      await uploadInfo({
        userId: userId._id,
        name: form.name,
        email: form.email,
        contactNumber: form.phone,
        location: form.address,
      });
      toast.success("Saved!");
    } catch {
      toast.error("Failed to save");
    }
  };

  return (
    <div className="px-5">
      <Field>
        <Header name="Basic Information" />
        <div className="flex flex-col gap-5">
          <div>
            <FieldLabel>Name</FieldLabel>
            <Input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <FieldLabel>Email</FieldLabel>
            <Input
              name="email"
              type="email"
              placeholder="johndoe@gmail.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <FieldLabel>Contact Number</FieldLabel>
            <Input
              name="phone"
              placeholder="+63 912 345 6789"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <FieldLabel>Address</FieldLabel>
            <Input
              name="address"
              placeholder="123 Street"
              value={form.address}
              onChange={handleChange}
            />
          </div>
        </div>
        <Button className="mt-2" onClick={handleSave}>
          Save
        </Button>
      </Field>
    </div>
  );
}
