import { Separator } from "./ui/separator";

export default function Header({ name }: { name: string }) {
  return (
    <div className="font-bold text-[1.3rem]">
      <h1>{name}</h1>
      <div className="w-35 mt-4 bg-black">
        <Separator />
      </div>
    </div>
  );
}
