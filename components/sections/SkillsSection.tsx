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
import { Item, ItemActions, ItemContent, ItemTitle } from "../ui/item";

export default function SkillsSection() {
  const userId = useQuery(api.query.queries.getUser);
  const skills = useQuery(api.query.queries.getSkills);
  const upsertSkill = useMutation(api.mutations.mutations.upsertSkill);
  const deleteSkill = useMutation(api.mutations.mutations.deleteSkill);

  const [skill, setSkill] = useState("");
  const [editingId, setEditingId] = useState<Id<"skills"> | null>(null);

  const handleSave = async () => {
    if (!userId || !skill.trim()) return;
    try {
      await upsertSkill({ id: editingId ?? undefined, userId: userId._id, skill });
      toast.success(editingId ? "Updated!" : "Added!");
      setSkill("");
      setEditingId(null);
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleEdit = (id: Id<"skills">, value: string) => {
    setSkill(value);
    setEditingId(id);
  };

  return (
    <div className="px-5">
      <Field>
        <Header name="Skills" />
        <div>
          <FieldLabel>Skill</FieldLabel>
          <Input
            placeholder="e.g. React, TypeScript"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
        </div>
        <div className="flex gap-2 mt-2">
          <Button onClick={handleSave}>{editingId ? "Update" : "Add"}</Button>
          {editingId && (
            <Button
              variant="outline"
              onClick={() => {
                setSkill("");
                setEditingId(null);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </Field>

      {!!skills?.length && (
        <>
          <Separator className="my-6" />
          <div className="flex flex-col gap-3">
            {skills.map((s) => (
              <Item variant="outline" key={s._id}>
                <ItemContent>
                  <ItemTitle>{s.skill}</ItemTitle>
                </ItemContent>
                <ItemActions className="flex-col">
                  <Button size="lg" className="w-full" onClick={() => handleEdit(s._id, s.skill)}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={async () => {
                      await deleteSkill({ id: s._id });
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
