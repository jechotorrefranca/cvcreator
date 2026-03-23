"use client";

import SignOutButton from "@/components/SignOutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import { Mail, MapPin, Phone } from "lucide-react";
import Inputs from "@/components/Inputs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export default function Home() {
  const userId = useQuery(api.query.queries.getUser);
  const pfp = useQuery(api.query.queries.getPfp, userId ? { userId: userId._id } : "skip");
  const info = useQuery(api.query.queries.getBasicInfo);
  const educ = useQuery(api.query.queries.getEducBg);
  const skills = useQuery(api.query.queries.getSkills);
  const langs = useQuery(api.query.queries.getLanguages);
  const obj = useQuery(api.query.queries.getObjective);
  const exps = useQuery(api.query.queries.getExperienceWithResponsibilities);
  const awards = useQuery(api.query.queries.getAwards);

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="bg-white h-screen text-black flex flex-col items-center">
      {/* Navbar */}
      <div className="flex justify-between p-2 min-w-screen bg-[#161616] fixed z-10 px-10 print:hidden">
        <div className="flex justify-center items-center gap-2">
          <Avatar size="lg">
            <AvatarImage src={pfp?.imageUrl} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="text-white">Welcome! {info?.name}</h1>
        </div>
        <SignOutButton />
      </div>

      <div className="flex justify-around p-5 w-full overflow-auto print:p-0 print:justify-center">
        {/* Input panel */}
        <div className="mt-25 print:hidden">
          <Inputs infos={info} educ={educ} />
        </div>

        {/* Resume */}
        <div className="flex flex-col items-center gap-3 mt-25 print:mt-0">
          {/* Export button */}
          <div className="self-end print:hidden">
            <Button onClick={handleExportPDF} className="flex items-center gap-2">
              <FileDown className="w-4 h-4" />
              Export as PDF
            </Button>
          </div>

          <div id="resume">
            <div className="relative w-[51rem] bg-white shadow-md print:shadow-none print:w-[8.5in]">
              {/* Profile picture */}
              <img
                src={pfp?.imageUrl}
                className="w-55 h-55 object-cover rounded-full bg-white absolute left-18 top-12 z-10"
              />

              {/* Header bar */}
              <div className="bg-[#26202B] h-[10rem] w-full flex justify-end font-poppins font-black">
                <div className="text-white text-[2.5rem] leading-15 w-[55%] self-center break-words">
                  <h1>{info?.name}</h1>
                </div>
              </div>

              {/* Body */}
              <div className="bg-white w-full flex">
                {/* Left column */}
                <div className="w-[45%] pl-13 pr-2 pt-30 flex flex-col gap-5 pb-10">
                  <div>
                    <Header name="My Contact" />
                    <div className="pt-3 flex flex-col gap-3">
                      <div className="flex gap-3 break-all">
                        <Mail className="shrink-0" />
                        {info?.email}
                      </div>
                      <div className="flex gap-3">
                        <Phone className="shrink-0" />
                        {info?.contactNumber}
                      </div>
                      <div className="flex gap-3">
                        <MapPin className="shrink-0" />
                        {info?.location}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Header name="Educational Background" />
                    <div className="pt-3">
                      <ul className="list-disc pl-5 flex flex-col gap-5 leading-5">
                        {educ?.map((ed) => (
                          <li key={ed._id} className="break-inside-avoid">
                            <p>{ed.school}</p>
                            <p className="italic">{ed.background}</p>
                            <p>Completed in {ed.completed}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <Header name="Skills" />
                    <div className="pt-3">
                      <ul className="list-disc pl-5 leading-5">
                        {skills?.map((s) => (
                          <li key={s._id}>{s.skill}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <Header name="Languages" />
                    <div className="pt-3">
                      <ul className="list-disc pl-5 leading-5">
                        {langs?.map((l) => (
                          <li key={l._id}>
                            {l.language}
                            <span> — {l.expertise}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div className="w-[56%] pt-3 flex flex-col gap-5 pr-10 text-justify pb-10">
                  <div>
                    <Header name="Objective" />
                    <p className="pt-3 leading-4.5">{obj?.description}</p>
                  </div>

                  <div>
                    <Header name="Professional Experience" />
                    <div className="pt-3 flex flex-col gap-5">
                      {exps?.map((exp) => (
                        <div key={exp._id} className="break-inside-avoid">
                          <p className="text-lg leading-none font-semibold">
                            {exp.company} | {exp.position}
                          </p>
                          {(exp.starting_date || exp.end_date) && (
                            <p className="text-lg italic">
                              {exp.starting_date}
                              {exp.starting_date && exp.end_date ? " – " : ""}
                              {exp.end_date === "Present" ? "Present" : exp.end_date}
                            </p>
                          )}
                          {exp.responsibilities.length > 0 && (
                            <>
                              <p className="mt-1 font-medium">Key responsibilities:</p>
                              <ul className="list-disc pl-6 leading-5">
                                {exp.responsibilities.map((r) => (
                                  <li key={r._id}>{r.description}</li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Header name="Awards and Recognitions" />
                    <div className="pt-3 flex flex-col gap-2">
                      {awards?.map((a) => (
                        <div key={a._id} className="grid grid-cols-[30%_70%] break-inside-avoid">
                          <div className="min-w-0">
                            {(a.starting_date || a.end_date) && (
                              <p className="break-words text-sm">
                                {a.starting_date}
                                {a.starting_date && a.end_date && " – "}
                                {a.end_date}
                              </p>
                            )}
                          </div>
                          <p className="min-w-0 break-words">{a.award}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer bar */}
              <div className="bg-[#26202B] h-10 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Print / PDF styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: 8.5in 13in;
            margin: 0;
          }
          body {
            background: white;
          }
          #resume {
            width: 8.5in;
          }
          .break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
