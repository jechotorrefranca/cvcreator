"use client";
import Image from "next/image";
import SignOutButton from "@/components/SignOutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  return (
    <div className="bg-white h-screen text-black flex flex-col items-center">
      <div className="flex justify-between p-2 min-w-screen bg-gray-200 fixed">
        <div className="flex justify-center items-center gap-2">
          <Avatar size="lg">
            <AvatarImage src="https://wwwimage-us.pplusstatic.com/thumbnails/photos/w1800-q80/promotion/01_spc_collection_us_july2025_coh_poster_stan.jpg?format=webp" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>Welcome!</h1>
        </div>
        <SignOutButton />
      </div>

      <div className="w-204 h-264 bg-gray-100 mt-25">
        <div className="w-full h-full flex flex-col outline relative">
          <img
            src="pfpDefault.png"
            className="w-55 h-55 object-cover rounded-full bg-white absolute left-15 top-12"
          />

          <div className="bg-[#26202B] h-[17%] w-full flex justify-end">
            <div className="text-white text-5xl w-[60%] self-center">
              <h1>JECHO PARAIRO TORREFRANCA</h1>
            </div>
          </div>

          <div className="bg-white w-full h-[80%] flex">
            <div className="w-[40%] bg-red-300 pl-15 pt-25">left</div>
            <div className="w-[60%] bg-blue-300 pt-5">right</div>
          </div>

          <div className="bg-[#26202B] h-[3%]"></div>
        </div>
      </div>
    </div>
  );
}
