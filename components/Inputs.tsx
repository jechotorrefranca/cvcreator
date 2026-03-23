import { useState } from "react";
import Header from "./Header";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Toaster } from "sonner";
import { BasicInfo, Educ } from "./types";
import PictureSection from "./sections/PictureSection";
import BasicInfoSection from "./sections/BasicInfoSection";
import EducationSection from "./sections/EducationSection";
import SkillsSection from "./sections/SkillsSection";
import LanguagesSection from "./sections/LanguagesSection";
import ObjectiveSection from "./sections/ObjectiveSection";
import AwardsSection from "./sections/AwardsSection";
import ExperienceSection from "./sections/ExperienceSection";

type Section =
  | "pic"
  | "basic_info"
  | "educ_bg"
  | "skills"
  | "language"
  | "objective"
  | "exp"
  | "awards";

const SECTIONS: { key: Section; label: string }[] = [
  { key: "pic", label: "Picture" },
  { key: "basic_info", label: "Basic Information" },
  { key: "educ_bg", label: "Education Background" },
  { key: "skills", label: "Skills" },
  { key: "language", label: "Languages" },
  { key: "objective", label: "Objective" },
  { key: "exp", label: "Professional Experience" },
  { key: "awards", label: "Awards and Recognitions" },
];

interface InputProps {
  infos?: BasicInfo | null;
  educ?: Educ[] | null;
}

function SectionContent({ section, infos, educ }: { section: Section } & InputProps) {
  switch (section) {
    case "pic":
      return <PictureSection />;
    case "basic_info":
      return <BasicInfoSection infos={infos} />;
    case "educ_bg":
      return <EducationSection educ={educ} />;
    case "skills":
      return <SkillsSection />;
    case "language":
      return <LanguagesSection />;
    case "objective":
      return <ObjectiveSection />;
    case "exp":
      return <ExperienceSection />;
    case "awards":
      return <AwardsSection />;
  }
}

export default function Inputs({ infos, educ }: InputProps) {
  const [current, setCurrent] = useState<Section>("basic_info");

  return (
    <div className="flex flex-col gap-3">
      <Header name="Information Sheet" />

      <Sheet>
        {SECTIONS.map(({ key, label }) => (
          <SheetTrigger asChild key={key}>
            <Button size="lg" onClick={() => setCurrent(key)}>
              {label}
            </Button>
          </SheetTrigger>
        ))}

        <SheetContent showCloseButton={false} side="left">
          <SheetHeader>
            <SheetTitle>
              <p className="text-2xl font-bold">Edit Resume</p>
            </SheetTitle>
            <SheetDescription>
              Make changes to your resume here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>

          <div className="overflow-y-auto flex-1 py-2">
            <SectionContent section={current} infos={infos} educ={educ} />
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Toaster position="top-center" />
    </div>
  );
}
