import { useRef, useState } from "react";
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
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { toast, Toaster } from "sonner";
import { BasicInfo } from "./types";

interface InputProps {
  infos?: BasicInfo | null;
}

export default function Inputs({ infos }: InputProps) {
  const generateUploadUrl = useMutation(api.mutations.mutations.generateUploadUrl);
  const uploadImage = useMutation(api.mutations.mutations.upsertImage);
  const uploadInfo = useMutation(api.mutations.mutations.upsertBasicInfo);

  const userId = useQuery(api.query.queries.getUser);
  const pfp = useQuery(api.query.queries.getPfp, userId ? { userId: userId._id } : "skip");

  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [currentSelected, setCurrentSelected] = useState("");

  console.log("WAWWW", infos);

  //   Basic info
  const [basicInfo, setBasicInfo] = useState({
    name: infos?.name || "",
    email: infos?.email || "",
    phone: infos?.contactNumber || "",
    address: infos?.location || "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setBasicInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("AAAAAAAAAAAAAAa", selectedImage);

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

  async function handleSavePic() {
    if (!userId) {
      console.log("User not logged in");
      return;
    }

    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": selectedImage!.type },
      body: selectedImage,
    });
    const { storageId } = await result.json();

    await uploadImage({ userId: userId._id, storageId });

    setSelectedImage(null);
    imageInput.current!.value = "";
  }

  async function handleSaveInformation() {
    if (!userId) {
      console.log("User not logged in");
      return;
    }

    try {
      await uploadInfo({
        userId: userId._id,
        name: basicInfo.name,
        email: basicInfo.email,
        contactNumber: basicInfo.phone,
        location: basicInfo.address,
      });
    } catch (e) {
      toast.error("Failed to Save");
      console.error(e);
    }

    console.log("sucecss");

    toast.success("Successfully Saved!");
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
            <SheetTitle>
              <p className="text-2xl font-bold">Edit Resume</p>
            </SheetTitle>
            <SheetDescription>
              Make changes to your resume here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          {(() => {
            switch (currentSelected) {
              case "pic":
                return (
                  <>
                    <div>
                      <div className="pl-5">
                        <Header name="Upload Picture" />
                      </div>

                      <div className="pt-5 flex flex-col gap-5 items-center">
                        <img
                          src={selectedImage ? URL.createObjectURL(selectedImage) : pfp?.imageUrl}
                          className="w-55 h-55 object-cover rounded-full bg-white  border border-black"
                        />
                        <div className="w-fit">
                          <Button>
                            <input
                              type="file"
                              accept="image/*"
                              ref={imageInput}
                              onChange={(event) => setSelectedImage(event.target.files![0])}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                );

              case "basic_info":
                return (
                  <>
                    <div className="px-5">
                      <Field>
                        <Header name="Basic Information" />
                        <div className="flex flex-col gap-5">
                          <div>
                            <FieldLabel>Name</FieldLabel>
                            <Input
                              name="name"
                              placeholder="John Doe"
                              value={basicInfo.name}
                              onChange={handleChange}
                            />
                          </div>

                          <div>
                            <FieldLabel>Email</FieldLabel>
                            <Input
                              name="email"
                              type="email"
                              placeholder="johndoe@gmail.com"
                              value={basicInfo.email}
                              onChange={handleChange}
                            />
                          </div>

                          <div>
                            <FieldLabel>Contact Number</FieldLabel>
                            <Input
                              name="phone"
                              placeholder="+63 912 345 6789"
                              value={basicInfo.phone}
                              onChange={handleChange}
                            />
                          </div>

                          <div>
                            <FieldLabel>Address</FieldLabel>
                            <Input
                              name="address"
                              placeholder="123 Street"
                              value={basicInfo.address}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </Field>
                    </div>
                  </>
                );

              default:
                return (
                  <>
                    <div className="pl-5">
                      <Header name="No Suitable Object" />
                    </div>
                  </>
                );
            }
          })()}

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
      <Toaster position="top-center" />
    </div>
  );
}
