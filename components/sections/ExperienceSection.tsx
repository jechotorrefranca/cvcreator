import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { ChevronsUpDown } from "lucide-react";
import Header from "../Header";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "../ui/item";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const EMPTY_EXP = { company: "", position: "", starting_date: "", end_date: "" };

export default function ExperienceSection() {
  const userId = useQuery(api.query.queries.getUser);
  const experiences = useQuery(api.query.queries.getExperienceWithResponsibilities);
  const upsertExp = useMutation(api.mutations.mutations.upsertExperience);
  const deleteExp = useMutation(api.mutations.mutations.deleteExperience);
  const upsertResp = useMutation(api.mutations.mutations.upsertKeyResponsibility);
  const deleteResp = useMutation(api.mutations.mutations.deleteKeyResponsibility);

  const [expForm, setExpForm] = useState(EMPTY_EXP);
  const [editingExpId, setEditingExpId] = useState<Id<"experience"> | null>(null);
  const [isCurrentJob, setIsCurrentJob] = useState(false);

  const [respDescription, setRespDescription] = useState("");
  const [editingRespId, setEditingRespId] = useState<Id<"keyResponsibilities"> | null>(null);
  const [activeExpId, setActiveExpId] = useState<Id<"experience"> | null>(null);

  // Track which experience panels are open; default all open
  const [openExpIds, setOpenExpIds] = useState<Set<string>>(new Set());

  const toggleOpen = (id: string) => {
    setOpenExpIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExpForm((p) => ({ ...p, [name]: value }));
  };

  const handleSaveExp = async () => {
    if (!userId || !expForm.company) return;
    try {
      await upsertExp({
        id: editingExpId ?? undefined,
        userId: userId._id,
        company: expForm.company,
        position: expForm.position,
        starting_date: expForm.starting_date || undefined,
        end_date: isCurrentJob ? "Present" : expForm.end_date || undefined,
      });
      toast.success(editingExpId ? "Updated!" : "Added!");
      setExpForm(EMPTY_EXP);
      setEditingExpId(null);
      setIsCurrentJob(false);
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleEditExp = (exp: NonNullable<typeof experiences>[number]) => {
    const isPresent = exp.end_date === "Present";
    setExpForm({
      company: exp.company,
      position: exp.position,
      starting_date: exp.starting_date ?? "",
      end_date: isPresent ? "" : (exp.end_date ?? ""),
    });
    setIsCurrentJob(isPresent);
    setEditingExpId(exp._id);
  };

  const handleSaveResp = async () => {
    if (!userId || !activeExpId || !respDescription.trim()) return;
    try {
      await upsertResp({
        id: editingRespId ?? undefined,
        userId: userId._id,
        experienceId: activeExpId,
        description: respDescription,
      });
      toast.success("Responsibility saved!");
      setRespDescription("");
      setEditingRespId(null);
    } catch {
      toast.error("Failed to save");
    }
  };

  return (
    <div className="px-5">
      <Field>
        <Header name="Professional Experience" />
        <div>
          <FieldLabel>Company</FieldLabel>
          <Input
            name="company"
            placeholder="Company Name"
            value={expForm.company}
            onChange={handleExpChange}
          />
        </div>
        <div>
          <FieldLabel>Position</FieldLabel>
          <Input
            name="position"
            placeholder="Job Title"
            value={expForm.position}
            onChange={handleExpChange}
          />
        </div>
        <div>
          <FieldLabel>Start Date</FieldLabel>
          <Input
            name="starting_date"
            placeholder="e.g. January 2023"
            value={expForm.starting_date}
            onChange={handleExpChange}
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FieldLabel className="mb-0">End Date</FieldLabel>
            <label className="flex items-center gap-1 text-sm ml-auto cursor-pointer">
              <input
                type="checkbox"
                checked={isCurrentJob}
                onChange={(e) => setIsCurrentJob(e.target.checked)}
              />
              Present
            </label>
          </div>
          {!isCurrentJob && (
            <Input
              name="end_date"
              placeholder="e.g. May 2025"
              value={expForm.end_date}
              onChange={handleExpChange}
            />
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <Button onClick={handleSaveExp}>{editingExpId ? "Update" : "Add"}</Button>
          {editingExpId && (
            <Button
              variant="outline"
              onClick={() => {
                setExpForm(EMPTY_EXP);
                setEditingExpId(null);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </Field>

      {!!experiences?.length && (
        <>
          <Separator className="my-6" />
          <div className="flex flex-col gap-4">
            {experiences.map((exp) => {
              const isOpen = openExpIds.has(exp._id);
              return (
                <Collapsible
                  key={exp._id}
                  open={isOpen}
                  onOpenChange={() => toggleOpen(exp._id)}
                  className="flex flex-col gap-2 rounded"
                >
                  <Item variant="outline" className="bg-gray-100">
                    <ItemContent className="">
                      <ItemTitle>{exp.company}</ItemTitle>
                      <ItemDescription>{exp.position}</ItemDescription>
                      <ItemDescription>
                        {exp.starting_date} –{" "}
                        {exp.end_date === "Present" ? "Present" : exp.end_date}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions className="flex-col">
                      {/* Collapse toggle — clicking the chevron opens/closes responsibilities */}
                      <CollapsibleTrigger asChild>
                        <Button variant="default" size="icon" className="size-8 self-end">
                          <ChevronsUpDown className="size-4" />
                          <span className="sr-only">Toggle responsibilities</span>
                        </Button>
                      </CollapsibleTrigger>
                      <Button size="lg" className="w-full" onClick={() => handleEditExp(exp)}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onClick={async () => {
                          await deleteExp({ id: exp._id });
                          toast.success("Deleted!");
                        }}
                      >
                        Delete
                      </Button>
                    </ItemActions>
                  </Item>

                  <CollapsibleContent>
                    <div className="pl-3 border-l-2 flex flex-col gap-2 bg-white">
                      <p className="text-sm font-semibold">Key Responsibilities</p>
                      {exp.responsibilities.map((r) => (
                        <Item variant="outline" key={r._id}>
                          <ItemContent>
                            <ItemDescription>{r.description}</ItemDescription>
                          </ItemContent>
                          <ItemActions className="flex-col">
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                setRespDescription(r.description);
                                setEditingRespId(r._id);
                                setActiveExpId(exp._id);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={async () => {
                                await deleteResp({ id: r._id });
                                toast.success("Deleted!");
                              }}
                            >
                              Delete
                            </Button>
                          </ItemActions>
                        </Item>
                      ))}

                      {activeExpId === exp._id ? (
                        <div className="flex flex-col gap-2">
                          <Input
                            placeholder="e.g. Led team of 5 engineers"
                            value={respDescription}
                            onChange={(e) => setRespDescription(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveResp}>
                              {editingRespId ? "Update" : "Add"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setActiveExpId(null);
                                setRespDescription("");
                                setEditingRespId(null);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setActiveExpId(exp._id)}>
                          + Add Responsibility
                        </Button>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
