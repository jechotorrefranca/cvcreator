import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import Header from "../Header";
import { Field, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function ObjectiveSection() {
  const userId = useQuery(api.query.queries.getUser);
  const objective = useQuery(api.query.queries.getObjective);
  const upsertObjective = useMutation(api.mutations.mutations.upsertObjective);

  const [description, setDescription] = useState(objective?.description ?? "");

  // Sync when data loads
  if (objective?.description && !description) {
    setDescription(objective.description);
  }

  const handleSave = async () => {
    if (!userId) return;
    try {
      await upsertObjective({ userId: userId._id, description });
      toast.success("Saved!");
    } catch {
      toast.error("Failed to save");
    }
  };

  return (
    <div className="px-5">
      <Field>
        <Header name="Objective" />
        <div>
          <FieldLabel>Description</FieldLabel>
          <Textarea
            placeholder="Write a brief career objective..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button className="mt-2" onClick={handleSave}>
          Save
        </Button>
      </Field>
    </div>
  );
}
