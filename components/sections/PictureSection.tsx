import { useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Header from "../Header";
import { Button } from "../ui/button";

export default function PictureSection() {
  const userId = useQuery(api.query.queries.getUser);
  const pfp = useQuery(api.query.queries.getPfp, userId ? { userId: userId._id } : "skip");

  const generateUploadUrl = useMutation(api.mutations.mutations.generateUploadUrl);
  const uploadImage = useMutation(api.mutations.mutations.upsertImage);

  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSave = async () => {
    if (!userId || !selectedImage) return;
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": selectedImage.type },
      body: selectedImage,
    });
    const { storageId } = await result.json();
    await uploadImage({ userId: userId._id, storageId });
    setSelectedImage(null);
    if (imageInput.current) imageInput.current.value = "";
  };

  return (
    <div>
      <div className="pl-5">
        <Header name="Upload Picture" />
      </div>
      <div className="pt-5 flex flex-col gap-5 items-center">
        <img
          src={selectedImage ? URL.createObjectURL(selectedImage) : pfp?.imageUrl}
          className="w-55 h-55 object-cover rounded-full bg-white border border-black"
        />
        <input
          type="file"
          accept="image/*"
          ref={imageInput}
          onChange={(e) => setSelectedImage(e.target.files![0])}
        />
        <Button onClick={handleSave} disabled={!selectedImage}>
          Upload
        </Button>
      </div>
    </div>
  );
}
