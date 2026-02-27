"use client";

import { useRef, useState } from "react";
import TransitionLink from "./TransitionLink";
import { ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { urlFor } from "../lib/sanity";
import type { Work } from "../types/sanity";

const fallbackWorks: Work[] = [
  {
    _id: "1",
    title: "E-Commerce Platform",
    category: "Web Development",
    year: "2025",
    slug: { current: "e-commerce-platform" },
    tags: ["React", "Next.js", "Stripe"],
  },
  {
    _id: "2",
    title: "Fintech Dashboard",
    category: "UI/UX Design",
    year: "2024",
    slug: { current: "fintech-dashboard" },
    tags: ["Figma", "TypeScript", "D3.js"],
  },
  {
    _id: "3",
    title: "AI Content Generator",
    category: "Full Stack",
    year: "2024",
    slug: { current: "ai-content-generator" },
    tags: ["Node.js", "OpenAI", "React"],
  },
];

function WorkRow({ work, index }: { work: Work; index: number }) {
  const rowRef = useRef<HTMLAnchorElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const thumb = thumbRef.current;
    const row = rowRef.current;
    if (!thumb || !row) return;
    const rect = row.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.to(thumb, {
      x: x - 160,
      y: y - 110,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto",
    });
  }

  function handleMouseEnter() {
    setIsHovered(true);
    gsap.to(thumbRef.current, {
      opacity: 1,
      scale: 1,
      rotation: Math.random() * 4 - 2,
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto",
    });
  }

  function handleMouseLeave() {
    setIsHovered(false);
    gsap.to(thumbRef.current, {
      opacity: 0,
      scale: 0.85,
      rotation: 0,
      duration: 0.4,
      ease: "power2.inOut",
      overwrite: "auto",
    });
  }

  return (
    <TransitionLink
      ref={rowRef}
      href={`/works/${work.slug.current}`}
      className="group relative py-10 md:py-16 flex flex-col md:flex-row md:items-center justify-between md:cursor-none px-4 md:px-8 -mx-4 md:-mx-8 overflow-hidden bg-white text-black no-underline"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top border line */}
      <div
        className={`work-line absolute top-0 left-0 h-[1px] w-full transition-colors duration-500 ${isHovered ? "bg-black/20" : "bg-black/10"}`}
      />

      {/* Floating thumbnail */}
      <div
        ref={thumbRef}
        className="pointer-events-none absolute z-20 w-64 h-48 md:w-80 md:h-56 overflow-hidden opacity-0 scale-[0.85] hidden md:block rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]"
        style={{ top: 0, left: 0 }}
      >
        {work.image ? (
          <img
            src={urlFor(work.image).width(640).height(448).fit("crop").url()}
            alt={work.title}
            className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"
          />
        ) : (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
            <span className="text-xs uppercase tracking-widest opacity-30 text-black">
              {work.category}
            </span>
          </div>
        )}
      </div>

      {/* Left — title + meta */}
      <div className="work-item-content flex flex-col md:flex-row md:items-center gap-4 md:gap-12 relative z-10 w-full group-hover:translate-x-2 md:group-hover:translate-x-6 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]">
        <div className="flex items-center gap-6 md:gap-10 flex-1">
          <span className="text-sm font-mono opacity-20 group-hover:opacity-100 transition-opacity duration-500 w-8">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-neutral-900 group-hover:text-black transition-colors duration-500">
            {work.title}
          </h3>
        </div>

        <div className="flex items-center gap-3 md:gap-4 pl-14 md:pl-0 flex-wrap flex-1 justify-start md:justify-end md:pr-12">
          <span className="text-xs uppercase tracking-widest text-neutral-400 group-hover:text-black transition-colors duration-500">
            {work.category}
          </span>
          {work.tags && work.tags.length > 0 && (
            <>
              <span className="opacity-20 hidden md:inline">·</span>
              <div className="hidden md:flex gap-2 flex-wrap">
                {work.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-wider px-2 py-1 font-medium text-neutral-400 group-hover:text-neutral-600 transition-colors duration-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right — year + arrow */}
      <div className="work-item-content flex items-center gap-6 md:gap-10 shrink-0 relative z-10 mt-6 md:mt-0 pl-14 md:pl-0 group-hover:-translate-x-2 md:group-hover:-translate-x-6 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]">
        <span className="text-sm font-mono text-neutral-400 group-hover:text-black transition-colors duration-500">
          {work.year}
        </span>
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-neutral-200 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all duration-500 overflow-hidden relative">
          <ArrowRight
            size={22}
            className="transform -translate-x-[200%] md:-translate-x-[250%] text-white group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] absolute"
            strokeWidth={1.5}
          />
          <ArrowRight
            size={22}
            className="transform translate-x-0 text-neutral-400 group-hover:translate-x-[200%] md:group-hover:translate-x-[250%] transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] absolute"
            strokeWidth={1.5}
          />
        </div>
      </div>
    </TransitionLink>
  );
}

interface WorksSectionProps {
  works: Work[];
}

export default function WorksSection({ works }: WorksSectionProps) {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (works.length === 0 && fallbackWorks.length === 0) return;
      gsap.fromTo(
        ".work-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          duration: 1.5,
          ease: "power3.inOut",
          stagger: 0.1,
          scrollTrigger: { trigger: pageRef.current, start: "top 75%" },
        },
      );
      gsap.fromTo(
        ".work-item-content",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: pageRef.current, start: "top 75%" },
        },
      );
      return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    },
    { scope: pageRef, dependencies: [works] },
  );

  const displayWorks = works.length > 0 ? works : fallbackWorks;

  return (
    <div ref={pageRef}>
      <section className="py-24 md:py-40 px-6 md:px-16 lg:px-24 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm uppercase tracking-widest mb-12 md:mb-24 opacity-60 font-medium">
            02 // Selected Works
          </h2>
          <div className="flex flex-col">
            {displayWorks.map((work, index) => (
              <WorkRow key={work._id || index} work={work} index={index} />
            ))}
            <div className="work-line h-[1px] bg-[#0A192F]/20 w-full" />
          </div>
        </div>
      </section>
    </div>
  );
}
