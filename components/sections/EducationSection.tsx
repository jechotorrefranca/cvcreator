import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Educ } from "../types";
import { Id } from "@/convex/_generated/dataModel";
import Header from "../Header";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "../ui/item";

interface Props {
  educ?: Educ[] | null;
}

const EMPTY = { school: "", background: "", completed: "" };

export default function EducationSection({ educ }: Props) {
  const userId = useQuery(api.query.queries.getUser);
  const upsertEduc = useMutation(api.mutations.mutations.upsertEducBackground);
  const deleteEduc = useMutation(api.mutations.mutations.deleteEducBackground);

  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<Id<"educBackground"> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!userId) return;
    try {
      await upsertEduc({ id: editingId ?? undefined, userId: userId._id, ...form });
      toast.success(editingId ? "Updated!" : "Added!");
      setForm(EMPTY);
      setEditingId(null);
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleEdit = (ed: Educ) => {
    setForm({ school: ed.school, background: ed.background, completed: ed.completed });
    setEditingId(ed._id);
  };

  const handleDelete = async (id: Id<"educBackground">) => {
    await deleteEduc({ id });
    toast.success("Deleted!");
  };

  const handleCancel = () => {
    setForm(EMPTY);
    setEditingId(null);
  };

  return (
    <div className="px-5">
      <Field>
        <Header name="Educational Background" />
        <div>
          <FieldLabel>School</FieldLabel>
          <Input
            name="school"
            placeholder="Name University"
            value={form.school}
            onChange={handleChange}
          />
        </div>
        <div>
          <FieldLabel>Degree</FieldLabel>
          <Input
            name="background"
            placeholder="BS in Name"
            value={form.background}
            onChange={handleChange}
          />
        </div>
        <div>
          <FieldLabel>Year Completed</FieldLabel>
          <Input
            name="completed"
            placeholder="20XX"
            value={form.completed}
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-2 mt-2">
          <Button onClick={handleSave}>{editingId ? "Update" : "Add"}</Button>
          {editingId && (
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
      </Field>

      {!!educ?.length && (
        <>
          <Separator className="my-6" />
          <div className="flex flex-col gap-3">
            {educ.map((ed) => (
              <Item variant="outline" key={ed._id}>
                <ItemContent>
                  <ItemTitle>{ed.school}</ItemTitle>
                  <ItemDescription>{ed.background}</ItemDescription>
                  <ItemDescription>{ed.completed}</ItemDescription>
                </ItemContent>
                <ItemActions className="flex-col">
                  <Button size="lg" className="w-full" onClick={() => handleEdit(ed)}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => handleDelete(ed._id)}
                  >
                    Delete
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
