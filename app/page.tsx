"use client";

import SignOutButton from "@/components/SignOutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import { FileDown, Mail, MapPin, Phone } from "lucide-react";
import Inputs from "@/components/Inputs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const PRINT_PAGE_WIDTH_PX = 816;
const PRINT_PAGE_HEIGHT_PX = 1248;
const PRINT_BAND_HEIGHT_PX = 40;
const PRINT_CONTINUATION_SIDE_PAD_PX = 52;
const PRINT_CONTINUATION_VERTICAL_PAD_PX = 24;
const PRINT_OVERFLOW_TOLERANCE_PX = 2;

function isHtmlElement(node: unknown): node is HTMLElement {
  return (
    !!node &&
    typeof node === "object" &&
    "nodeType" in node &&
    (node as Node).nodeType === Node.ELEMENT_NODE
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function waitForImages(doc: Document) {
  const images = Array.from(doc.images);

  await Promise.all(
    images.map((image) => {
      if (image.complete) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        const finish = () => resolve();
        image.addEventListener("load", finish, { once: true });
        image.addEventListener("error", finish, { once: true });
      });
    }),
  );
}

function cloneNodeIntoDocument<T extends Node>(doc: Document, node: T) {
  return doc.importNode(node, true) as T;
}

function appendNodeIntoDocument(doc: Document, parent: HTMLElement, node: Node) {
  if (node.ownerDocument === doc) {
    parent.appendChild(node);
    return;
  }

  parent.appendChild(cloneNodeIntoDocument(doc, node));
}

function createBlockWrapper(doc: Document, className: string, nodes: Node[]) {
  const wrapper = doc.createElement("div");
  wrapper.className = className;

  nodes.forEach((node) => {
    appendNodeIntoDocument(doc, wrapper, node);
  });

  return wrapper;
}

function createSectionBodyWrapper(doc: Document, nodes: Node[]) {
  return createBlockWrapper(doc, "print-section-body", nodes);
}

function createSingleItemList(
  doc: Document,
  listTemplate: HTMLElement | null,
  item: HTMLElement,
) {
  const list = listTemplate
    ? cloneNodeIntoDocument(doc, listTemplate)
    : doc.createElement("ul");

  list.innerHTML = "";

  if (!listTemplate) {
    list.className = "list-disc pl-6 leading-5";
  }

  list.appendChild(cloneNodeIntoDocument(doc, item));

  return list;
}

function buildExperienceBlocks(
  doc: Document,
  sectionHeader: HTMLElement | null,
  experienceItem: HTMLElement,
  includeSectionHeader: boolean,
) {
  const blocks: HTMLElement[] = [];
  const summary = experienceItem.querySelector("[data-print-exp-summary]");
  const responsibilitiesLabel = experienceItem.querySelector(
    "[data-print-exp-responsibilities-label]",
  );
  const responsibilitiesList = experienceItem.querySelector(
    "[data-print-exp-responsibilities-list]",
  );
  const responsibilities = Array.from(
    experienceItem.querySelectorAll("[data-print-exp-responsibility]"),
  ).filter((node): node is HTMLElement => isHtmlElement(node));

  const firstBlockNodes: Node[] = [];
  const firstBodyNodes: Node[] = [];

  if (isHtmlElement(summary)) {
    firstBodyNodes.push(summary);
  } else {
    firstBodyNodes.push(experienceItem);
  }

  if (responsibilities.length === 0) {
    if (includeSectionHeader && sectionHeader) {
      firstBlockNodes.push(sectionHeader, createSectionBodyWrapper(doc, firstBodyNodes));
    } else {
      firstBlockNodes.push(...firstBodyNodes);
    }

    blocks.push(
      createBlockWrapper(
        doc,
        includeSectionHeader
          ? "print-flow-block print-flow-block--section-start"
          : "print-flow-block",
        firstBlockNodes,
      ),
    );

    return blocks;
  }

  if (isHtmlElement(responsibilitiesLabel)) {
    firstBodyNodes.push(responsibilitiesLabel);
  }

  firstBodyNodes.push(
    createSingleItemList(
      doc,
      isHtmlElement(responsibilitiesList) ? responsibilitiesList : null,
      responsibilities[0],
    ),
  );

  if (includeSectionHeader && sectionHeader) {
    firstBlockNodes.push(sectionHeader, createSectionBodyWrapper(doc, firstBodyNodes));
  } else {
    firstBlockNodes.push(...firstBodyNodes);
  }

  blocks.push(
    createBlockWrapper(
      doc,
      includeSectionHeader
        ? "print-flow-block print-flow-block--section-start"
        : "print-flow-block",
      firstBlockNodes,
    ),
  );

  responsibilities.slice(1).forEach((responsibility) => {
    blocks.push(
      createBlockWrapper(doc, "print-flow-block print-flow-block--experience-follow", [
        createSingleItemList(
          doc,
          isHtmlElement(responsibilitiesList) ? responsibilitiesList : null,
          responsibility,
        ),
      ]),
    );
  });

  return blocks;
}

function buildSectionBlocks(sourceResumeEl: HTMLElement, doc: Document) {
  const blocks: HTMLElement[] = [];

  const objectiveSection = sourceResumeEl.querySelector('[data-print-section="objective"]');
  if (isHtmlElement(objectiveSection)) {
    blocks.push(
      createBlockWrapper(doc, "print-flow-block print-flow-block--section-start", [
        objectiveSection,
      ]),
    );
  }

  const experienceSection = sourceResumeEl.querySelector('[data-print-section="experience"]');
  if (isHtmlElement(experienceSection)) {
    const sectionHeader = experienceSection.querySelector(
      '[data-print-section-header="experience"]',
    );
    const experienceItems = Array.from(
      experienceSection.querySelectorAll("[data-print-exp-item]"),
    ).filter((node): node is HTMLElement => isHtmlElement(node));

    if (experienceItems.length === 0 && isHtmlElement(sectionHeader)) {
      blocks.push(
        createBlockWrapper(doc, "print-flow-block print-flow-block--section-start", [
          sectionHeader,
        ]),
      );
    }

    experienceItems.forEach((experienceItem, index) => {
      blocks.push(
        ...buildExperienceBlocks(
          doc,
          isHtmlElement(sectionHeader) ? sectionHeader : null,
          experienceItem,
          index === 0,
        ),
      );
    });
  }

  const awardsSection = sourceResumeEl.querySelector('[data-print-section="awards"]');
  if (isHtmlElement(awardsSection)) {
    const sectionHeader = awardsSection.querySelector('[data-print-section-header="awards"]');
    const awardItems = Array.from(awardsSection.querySelectorAll("[data-print-award-item]")).filter(
      (node): node is HTMLElement => isHtmlElement(node),
    );

    if (awardItems.length === 0 && isHtmlElement(sectionHeader)) {
      blocks.push(
        createBlockWrapper(doc, "print-flow-block print-flow-block--section-start", [
          sectionHeader,
        ]),
      );
    }

    awardItems.forEach((awardItem, index) => {
      const nodes: Node[] = [];

      if (index === 0 && isHtmlElement(sectionHeader)) {
        nodes.push(sectionHeader, createSectionBodyWrapper(doc, [awardItem]));
      } else {
        nodes.push(awardItem);
      }

      blocks.push(
        createBlockWrapper(
          doc,
          index === 0
            ? "print-flow-block print-flow-block--section-start"
            : "print-flow-block print-flow-block--award-follow",
          nodes,
        ),
      );
    });
  }

  return blocks;
}

function placeBlocksIntoContainer(container: HTMLElement, blocks: HTMLElement[]) {
  while (blocks.length > 0) {
    const block = blocks[0];
    container.appendChild(block);

    if (container.scrollHeight > container.clientHeight + PRINT_OVERFLOW_TOLERANCE_PX) {
      container.removeChild(block);

      if (container.childElementCount === 0) {
        container.appendChild(block);
        blocks.shift();
      }

      break;
    }

    blocks.shift();
  }
}

function createContinuationPage(doc: Document) {
  const page = doc.createElement("section");
  page.setAttribute("data-print-page", "continuation");

  const topBand = doc.createElement("div");
  topBand.className = "print-page__band";

  const content = doc.createElement("div");
  content.className = "print-page__content print-flow-stack";

  const bottomBand = doc.createElement("div");
  bottomBand.className = "print-page__band";

  page.append(topBand, content, bottomBand);

  return { page, content };
}

async function waitForLayout(win: Window) {
  await new Promise<void>((resolve) => {
    win.requestAnimationFrame(() => {
      win.requestAnimationFrame(() => resolve());
    });
  });
}

function createPrintDocumentShell(printWindow: Window, filename: string) {
  const sharedStyles = Array.from(
    document.querySelectorAll('style, link[rel="stylesheet"]'),
  )
    .map((node) => node.outerHTML)
    .join("\n");

  const safeBaseHref = escapeHtml(window.location.href);
  const safeTitle = escapeHtml(filename);
  const htmlClass = escapeHtml(document.documentElement.className);
  const bodyClass = escapeHtml(document.body.className);

  printWindow.document.open();
  printWindow.document.write(`
    <!doctype html>
    <html class="${htmlClass}">
      <head>
        <meta charset="utf-8" />
        <base href="${safeBaseHref}" />
        <title>${safeTitle}</title>
        ${sharedStyles}
        <style>
          @page {
            size: 8.5in 13in;
            margin: 0;
          }

          :root {
            color-scheme: light;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: #e5e7eb;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          body {
            padding: 24px;
            box-sizing: border-box;
          }

          #print-root {
            width: max-content;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          [data-print-page] {
            width: ${PRINT_PAGE_WIDTH_PX}px;
            min-height: ${PRINT_PAGE_HEIGHT_PX}px;
            background: #ffffff;
            box-sizing: border-box;
            overflow: hidden;
            box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
            page-break-after: always;
          }

          [data-print-page]:last-child {
            page-break-after: auto;
          }

          [data-print-page="first"] {
            display: flex;
            flex-direction: column;
            height: ${PRINT_PAGE_HEIGHT_PX}px;
            margin: 0;
          }

          [data-print-page="first"][id="resume-content"] {
            box-shadow: none;
          }

          [data-print-page="first"] [data-print-body] {
            display: flex !important;
            flex: 1 1 auto;
            min-height: 0;
          }

          [data-print-page="first"] [data-print-left],
          [data-print-page="first"] [data-print-right] {
            min-height: 0;
          }

          [data-print-page="first"] [data-print-right] {
            display: block !important;
            overflow: hidden;
          }

          [data-print-page="continuation"] {
            display: flex;
            flex-direction: column;
            height: ${PRINT_PAGE_HEIGHT_PX}px;
          }

          .print-page__band {
            height: ${PRINT_BAND_HEIGHT_PX}px;
            flex: 0 0 ${PRINT_BAND_HEIGHT_PX}px;
            background: #26202b;
          }

          .print-page__content {
            flex: 1 1 auto;
            min-height: 0;
            overflow: hidden;
            padding: ${PRINT_CONTINUATION_VERTICAL_PAD_PX}px ${PRINT_CONTINUATION_SIDE_PAD_PX}px;
            box-sizing: border-box;
          }

          .print-flow-stack {
            overflow: hidden;
          }

          .print-flow-stack > * {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .print-flow-stack > * + * {
            margin-top: 20px;
          }

          .print-flow-block ul {
            margin: 0;
          }

          .print-section-body {
            padding-top: 12px;
          }

          .print-flow-block--experience-follow {
            margin-top: 0 !important;
          }

          .print-flow-block--award-follow {
            margin-top: 8px !important;
          }

          .print-flow-stack > .print-flow-block--section-start:first-child,
          [data-print-page="first"] [data-print-right] > .print-flow-block--section-start:first-child {
            margin-top: 0 !important;
          }

          @media print {
            html,
            body {
              background: #ffffff;
            }

            body {
              padding: 0;
            }

            #print-root {
              gap: 0;
            }

            [data-print-page] {
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body class="${bodyClass}">
        <main id="print-root"></main>
      </body>
    </html>
  `);
  printWindow.document.close();
}

async function buildPrintLayout(
  printWindow: Window,
  sourceResumeEl: HTMLElement,
  printRoot: HTMLElement,
) {
  const printDoc = printWindow.document;
  const firstPage = cloneNodeIntoDocument(printDoc, sourceResumeEl);
  firstPage.setAttribute("data-print-page", "first");

  const firstPageRightColumn = firstPage.querySelector("[data-print-right]");
  if (!isHtmlElement(firstPageRightColumn)) {
    throw new Error("Unable to locate the resume right column for printing.");
  }

  firstPageRightColumn.classList.add("print-flow-stack");
  firstPageRightColumn.replaceChildren();
  printRoot.replaceChildren(firstPage);

  await waitForLayout(printWindow);

  const flowBlocks = buildSectionBlocks(sourceResumeEl, printDoc);
  placeBlocksIntoContainer(firstPageRightColumn, flowBlocks);

  while (flowBlocks.length > 0) {
    const { page, content } = createContinuationPage(printDoc);
    printRoot.appendChild(page);

    await waitForLayout(printWindow);
    placeBlocksIntoContainer(content, flowBlocks);
  }
}

async function exportResumePDF(resumeEl: HTMLElement, filename = "resume") {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    throw new Error("Unable to open the print preview window.");
  }

  createPrintDocumentShell(printWindow, filename);

  await new Promise<void>((resolve) => {
    if (printWindow.document.readyState === "complete") {
      resolve();
      return;
    }

    printWindow.addEventListener("load", () => resolve(), { once: true });
  });

  try {
    await printWindow.document.fonts.ready;
  } catch {
    // Continue printing even if the browser does not expose font readiness.
  }

  const printRoot = printWindow.document.getElementById("print-root");
  if (!isHtmlElement(printRoot)) {
    throw new Error("Unable to build the print layout.");
  }

  await buildPrintLayout(printWindow, resumeEl, printRoot);
  await waitForImages(printWindow.document);
  await waitForLayout(printWindow);

  printWindow.addEventListener(
    "afterprint",
    () => {
      printWindow.close();
    },
    { once: true },
  );

  printWindow.focus();
  printWindow.print();
}

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

  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    const el = document.getElementById("resume-content");
    if (!el) return;
    setExporting(true);
    try {
      await exportResumePDF(el, `${info?.name ?? "resume"}`);
    } catch (error) {
      console.error(error);
      window.alert("Allow pop-ups, then try again to open the printable PDF view.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="bg-white h-screen text-black flex flex-col items-center">
      {/* Navbar */}
      <div className="flex justify-between p-2 min-w-screen bg-[#161616] fixed z-10 px-10">
        <div className="flex justify-center items-center gap-2">
          <Avatar size="lg">
            <AvatarImage src={pfp?.imageUrl} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="text-white">Welcome! {info?.name}</h1>
        </div>
        <SignOutButton />
      </div>

      <div className="flex justify-around p-5 w-full overflow-auto">
        {/* Input panel */}
        <div className="mt-25">
          <Inputs infos={info} educ={educ} />
        </div>

        {/* Resume column */}
        <div className="flex flex-col items-end gap-3 mt-25">
          <Button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            {exporting ? "Opening print view..." : "Print / Save as PDF"}
          </Button>

          <p className="max-w-xs text-right text-xs text-zinc-500">
            Uses the browser print dialog so the saved PDF keeps selectable text.
          </p>

          <div className="overflow-y-auto max-h-[85vh] shadow-md">
            <div
              id="resume-content"
              data-print-root
              className="relative bg-white"
              style={{ width: "816px" }}
            >
              {/* Profile picture */}
              <img
                src={pfp?.imageUrl}
                data-print-avatar
                className="w-55 h-55 object-cover rounded-full bg-white absolute left-18 top-12 z-10"
                crossOrigin="anonymous"
              />

              {/* Header bar */}
              <div
                data-print-header
                className="bg-[#26202B] h-[10rem] w-full flex justify-end font-poppins font-black"
              >
                <div className="text-white text-[2.5rem] leading-15 w-[55%] self-center break-words">
                  <h1>{info?.name}</h1>
                </div>
              </div>

              {/* Body */}
              <div data-print-body className="bg-white w-full flex">
                {/* Left column */}
                <div data-print-left className="w-[45%] pl-13 pr-2 pt-30 flex flex-col gap-5 pb-10">
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
                          <li key={ed._id}>
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
                <div
                  data-print-right
                  className="w-[56%] pt-3 flex flex-col gap-5 pr-10 text-justify pb-10"
                >
                  <div data-print-section="objective">
                    <Header name="Objective" />
                    <p className="pt-3 leading-4.5">{obj?.description}</p>
                  </div>

                  <div data-print-section="experience">
                    <div data-print-section-header="experience">
                      <Header name="Professional Experience" />
                    </div>
                    <div className="pt-3 flex flex-col gap-5">
                      {exps?.map((exp) => (
                        <div key={exp._id} data-print-exp-item>
                          <div data-print-exp-summary>
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
                          </div>
                          {exp.responsibilities.length > 0 && (
                            <>
                              <p className="mt-1 font-medium" data-print-exp-responsibilities-label>
                                Key responsibilities:
                              </p>
                              <ul
                                className="list-disc pl-6 leading-5"
                                data-print-exp-responsibilities-list
                              >
                                {exp.responsibilities.map((r) => (
                                  <li key={r._id} data-print-exp-responsibility>
                                    {r.description}
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div data-print-section="awards">
                    <div data-print-section-header="awards">
                      <Header name="Awards and Recognitions" />
                    </div>
                    <div className="pt-3 flex flex-col gap-2">
                      {awards?.map((a) => (
                        <div key={a._id} className="grid grid-cols-[30%_70%]" data-print-award-item>
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
              <div data-print-footer className="bg-[#26202B] h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
