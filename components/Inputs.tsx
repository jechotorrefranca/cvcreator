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

export default function Inputs() {
  const [currentSelected, setCurrentSelected] = useState("");

  const handleSave = () => {
    console.log("AAAAAAAAAAAAAAa", currentSelected);

    switch (currentSelected) {
      case "pic":
        handleSavePic();
        return;

      case "basic_info":
        handleSaveInformation();
        return;

      case "educ_bg":
        handleSaveBackground();
        return;

      case "skills":
        handleSaveSkills();
        return;

      case "language":
        handleSaveLanguages();
        return;

      case "objective":
        handleSaveObjective();
        return;

      case "exp":
        handleSaveExperience();
        return;

      case "awards":
        handleSaveAwards();
        return;

      default:
        return null;
    }
  };

  function handleSavePic() {
    console.log("pik");
  }

  function handleSaveInformation() {
    console.log("inpo");
  }

  function handleSaveBackground() {
    console.log("bg");
  }

  function handleSaveSkills() {
    console.log("skells");
  }

  function handleSaveLanguages() {
    console.log("lang");
  }

  function handleSaveObjective() {
    console.log("obj");
  }

  function handleSaveExperience() {
    console.log("expei");
  }

  function handleSaveAwards() {
    console.log("awards");
  }

  return (
    <div className="flex flex-col gap-3">
      <Header name="Information Sheet" />

      <Sheet>
        <SheetTrigger asChild>
          <Button size="lg" onClick={() => setCurrentSelected("pic")}>
            Picture
          </Button>
        </SheetTrigger>

        <SheetTrigger asChild>
          <Button size="lg" onClick={() => setCurrentSelected("basic_info")}>
            Basic Information
          </Button>
        </SheetTrigger>

        <SheetTrigger asChild>
          <Button size="lg" onClick={() => setCurrentSelected("educ_bg")}>
            Education Background
          </Button>
        </SheetTrigger>

        <SheetTrigger asChild>
          <Button size="lg" onClick={() => setCurrentSelected("skills")}>
            Skills
          </Button>
        </SheetTrigger>

        <SheetTrigger asChild>
          <Button size="lg" onClick={() => setCurrentSelected("language")}>
            Languages
          </Button>
        </SheetTrigger>

        <SheetTrigger asChild>
          <Button size="lg" onClick={() => setCurrentSelected("objective")}>
            Objective
          </Button>
        </SheetTrigger>

        <SheetTrigger asChild>
          <Button size="lg" onClick={() => setCurrentSelected("exp")}>
            Professional Experience
          </Button>
        </SheetTrigger>

        <SheetTrigger asChild>
          <Button size="lg" onClick={() => setCurrentSelected("awards")}>
            Awards and Recognitions
          </Button>
        </SheetTrigger>

        <SheetContent showCloseButton={false} side="left">
          <SheetHeader>
            <SheetTitle>No Close Button</SheetTitle>
            <SheetDescription>
              This sheet doesn&apos;t have a close button in the top-right corner. Click outside to
              close.
            </SheetDescription>
          </SheetHeader>

          <SheetFooter>
            <Button type="submit" onClick={handleSave}>
              Save changes
            </Button>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
