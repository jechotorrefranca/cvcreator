"use client";
import Image from "next/image";
import SignOutButton from "@/components/SignOutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import { Dot, Locate, LocateIcon, Mail, MapPin, Phone } from "lucide-react";
import Inputs from "@/components/Inputs";

export default function Home() {
  const people = [
    "Creola Katherine Johnson: mathematician",
    "Mario José Molina-Pasquel Henríquez: chemist",
  ];

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

      <div className="flex justify-around w-full">
        <div className="mt-25">
          <Inputs />
        </div>

        <div className="w-[49.61rem] h-[70.16rem] bg-gray-100 mt-25">
          <div className="w-full h-full flex flex-col outline relative">
            <img
              src="pfpDefault.png"
              className="w-55 h-55 object-cover rounded-full bg-white absolute left-18 top-12"
            />

            <div className="bg-[#26202B] h-[15%] w-full flex justify-end  font-poppins font-black">
              <div className="text-white text-[2.5rem] leading-15 w-[55%] self-center">
                <h1>JECHO PARAIRO TORREFRANCA</h1>
              </div>
            </div>

            <div className="bg-white w-full h-[82%] flex">
              <div className="w-[45%] bg-red-300 pl-15 pt-30 flex flex-col gap-5">
                <div>
                  <Header name={"My Contact"} />

                  <div className="pt-5 flex flex-col gap-3">
                    <div className="flex gap-3">
                      <Mail />
                      {"Email@gmail.com"}
                    </div>

                    <div className="flex gap-3">
                      <Phone />
                      {"+63 910 147 7227"}
                    </div>

                    <div className="flex gap-3">
                      <MapPin />
                      {"Lolomboy, Bocaue, Bulacan"}
                    </div>
                  </div>
                </div>

                <div>
                  <Header name="Educational Background" />
                  <div className="pt-5 flex flex-col gap-3">
                    <ul className="list-disc pl-5 gap-5 flex flex-col leading-5">
                      {people.map(() => (
                        <li className="list-item">
                          <div>
                            <p>Tadsd</p>
                            <p>sadsd</p>
                            <p>sadsd</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <Header name="Skills" />
                  <div className="pt-5 flex flex-col gap-3">
                    <ul className="list-disc pl-5 leading-5">
                      {people.map(() => (
                        <li className="list-item">
                          <div>
                            <p>Tadsd</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <Header name="Languages" />
                  <div className="pt-5 flex flex-col gap-3">
                    <ul className="list-disc pl-5 leading-5">
                      {people.map(() => (
                        <li className="list-item">
                          <div>
                            <p>Tadsd</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="w-[55%] bg-blue-300 pt-5 flex flex-col gap-5">
                <div>
                  <Header name="Objective" />
                  <div className="pt-5">
                    admsakf lfk admsakf lfkadmsakf lfkadmsakf lfkadmsakf lfkadmsakf lfkadmsakf lfk
                    admsakf lfkadmsakf lfkadmsakf lfk
                  </div>
                </div>

                <div>
                  <Header name="Professional Experience" />
                  <div className="pt-5 text-lg">
                    admsakf lfk admsakf lfkadmsakf lfkadmsakf lfkadmsakf lfkadmsakf lfkadmsakf lfk
                    admsakf lfkadmsakf lfkadmsakf lfk
                  </div>
                  <div>Key responsibilities:</div>
                  <ul className="list-disc pl-6 leading-5">
                    {people.map(() => (
                      <li className="list-item">
                        <div>
                          <p>Key</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Header name="Awards and Recognitions" />
                  <div className="pt-5">
                    admsakf lfk admsakf lfkadmsakf lfkadmsakf lfkadmsakf lfkadmsakf lfkadmsakf lfk
                    admsakf lfkadmsakf lfkadmsakf lfk
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#26202B] h-[3%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
