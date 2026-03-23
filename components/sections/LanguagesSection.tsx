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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";

type Expertise = "Beginner" | "Intermediate" | "Advanced" | "Proficient" | "Native";

const EXPERTISE_OPTIONS: Expertise[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Proficient",
  "Native",
];
const EMPTY = { language: "", expertise: "Beginner" as Expertise };

export default function LanguagesSection() {
  const userId = useQuery(api.query.queries.getUser);
  const languages = useQuery(api.query.queries.getLanguages);
  const upsertLanguage = useMutation(api.mutations.mutations.upsertLanguage);
  const deleteLanguage = useMutation(api.mutations.mutations.deleteLanguage);

  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<Id<"languages"> | null>(null);

  const handleSave = async () => {
    if (!userId || !form.language.trim()) return;
    try {
      await upsertLanguage({ id: editingId ?? undefined, userId: userId._id, ...form });
      toast.success(editingId ? "Updated!" : "Added!");
      setForm(EMPTY);
      setEditingId(null);
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleEdit = (id: Id<"languages">, language: string, expertise: Expertise) => {
    setForm({ language, expertise });
    setEditingId(id);
  };

  return (
    <div className="px-5">
      <Field>
        <Header name="Languages" />
        <div>
          <FieldLabel>Language</FieldLabel>
          <Input
            placeholder="e.g. English, Filipino"
            value={form.language}
            onChange={(e) => setForm((p) => ({ ...p, language: e.target.value }))}
          />
        </div>
        <div>
          <FieldLabel>Expertise</FieldLabel>
          <Select
            value={form.expertise}
            onValueChange={(val) => setForm((p) => ({ ...p, expertise: val as Expertise }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select expertise" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {EXPERTISE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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

      {!!languages?.length && (
        <>
          <Separator className="my-6" />
          <div className="flex flex-col gap-3">
            {languages.map((l) => (
              <Item variant="outline" key={l._id}>
                <ItemContent>
                  <ItemTitle>{l.language}</ItemTitle>
                  <ItemDescription>{l.expertise}</ItemDescription>
                </ItemContent>
                <ItemActions className="flex-col">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => handleEdit(l._id, l.language, l.expertise as Expertise)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={async () => {
                      await deleteLanguage({ id: l._id });
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
