import Header from "./Header";
import { Button } from "./ui/button";

export default function Inputs() {
  return (
    <div className="flex flex-col gap-3">
      <Header name="Information Sheet" />
      <Button>Picture</Button>

      <Button size="lg">Basic Information</Button>
      <Button size="lg">Education Background</Button>
      <Button size="lg">Skills</Button>
      <Button size="lg">Languages</Button>
      <Button size="lg">Objective</Button>
      <Button size="lg">Professional Experience</Button>
      <Button size="lg">Awards and Recognitions</Button>
      <div></div>
    </div>
  );
}
