import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import Header from "../Header";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "../ui/item";

const EMPTY = { award: "", starting_date: "", end_date: "" };

export default function AwardsSection() {
  const userId = useQuery(api.query.queries.getUser);
  const awards = useQuery(api.query.queries.getAwards);
  const upsertAward = useMutation(api.mutations.mutations.upsertAward);
  const deleteAward = useMutation(api.mutations.mutations.deleteAward);

  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<Id<"awards"> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    if (!userId || !form.award.trim()) return;
    try {
      await upsertAward({
        id: editingId ?? undefined,
        userId: userId._id,
        award: form.award,
        starting_date: form.starting_date || undefined,
        end_date: form.end_date || undefined,
      });
      toast.success(editingId ? "Updated!" : "Added!");
      setForm(EMPTY);
      setEditingId(null);
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleEdit = (a: NonNullable<typeof awards>[number]) => {
    setForm({
      award: a.award,
      starting_date: a.starting_date ?? "",
      end_date: a.end_date ?? "",
    });
    setEditingId(a._id);
  };

  return (
    <div className="px-5">
      <Field>
        <Header name="Awards and Recognitions" />
        <div>
          <FieldLabel>Award / Recognition</FieldLabel>
          <Input
            name="award"
            placeholder="e.g. Best Employee of the Year"
            value={form.award}
            onChange={handleChange}
          />
        </div>
        <div>
          <FieldLabel>
            Start Date <span className="text-muted-foreground text-xs">(optional)</span>
          </FieldLabel>
          <Input
            name="starting_date"
            placeholder="e.g. January 2023"
            value={form.starting_date}
            onChange={handleChange}
          />
        </div>
        <div>
          <FieldLabel>
            End Date <span className="text-muted-foreground text-xs">(optional)</span>
          </FieldLabel>
          <Input
            name="end_date"
            placeholder="e.g. December 2023"
            value={form.end_date}
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-2 mt-2">
          <Button onClick={handleSave}>{editingId ? "Update" : "Add"}</Button>
          {editingId && (
            <Button
              variant="outline"
              onClick={() => {
                setForm(EMPTY);
                setEditingId(null);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </Field>

      {!!awards?.length && (
        <>
          <Separator className="my-6" />
          <div className="flex flex-col gap-3">
            {awards.map((a) => (
              <Item variant="outline" key={a._id}>
                <ItemContent>
                  <ItemTitle>{a.award}</ItemTitle>
                  {(a.starting_date || a.end_date) && (
                    <ItemDescription>
                      {a.starting_date} {a.starting_date && a.end_date && "–"} {a.end_date}
                    </ItemDescription>
                  )}
                </ItemContent>
                <ItemActions className="flex-col">
                  <Button size="lg" className="w-full" onClick={() => handleEdit(a)}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={async () => {
                      await deleteAward({ id: a._id });
                      toast.success("Deleted!");
                    }}
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
