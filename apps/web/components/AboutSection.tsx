"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import type { AboutInfo } from "../types/sanity";
import { urlFor } from "../lib/sanity";

interface AboutSectionProps {
  about: AboutInfo | null;
}

export default function AboutSection({ about }: AboutSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.fromTo(
        ".about-reveal",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.2,
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="py-24 md:py-40 bg-[#0A192F] text-white min-h-screen flex items-center"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 w-full">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          {/* Left: Text Content */}
          <div className="flex-1 w-full relative z-10 pt-10">
            <h2 className="about-reveal text-sm uppercase tracking-widest opacity-60 font-medium mb-8">
              01 // About Me
            </h2>

            <h1 className="about-reveal text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              {about?.title || "Hi, I’m Sahar."}
            </h1>

            <h3 className="about-reveal text-2xl md:text-3xl font-light tracking-tight opacity-90 mb-10 text-emerald-400">
              {about?.subtitle || "Creative Developer & Designer"}
            </h3>

            <div className="about-reveal text-lg md:text-xl font-light opacity-80 max-w-2xl leading-relaxed space-y-6">
              {about?.description ? (
                about.description
                  .split("\n")
                  .map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
              ) : (
                <>
                  <p>
                    I am a creative developer focusing on building modern,
                    aesthetic, and fluid user experiences.
                  </p>
                  <p>
                    I believe in the power of motion and typography to elevate
                    digital interfaces into memorable experiences.
                  </p>
                </>
              )}
            </div>

            {about?.resume?.asset?.url && (
              <div className="about-reveal mt-12 mb-10">
                <a
                  href={about.resume.asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white !text-[#0A192F] hover:bg-white/90 transition-colors rounded-full font-medium"
                >
                  Download Resume
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>

          {/* Right: Image */}
          {about?.image && (
            <div className="about-reveal flex-1 w-full max-w-md lg:max-w-xl self-center lg:self-start relative group mt-10 md:mt-0">
              <div className="absolute inset-0 bg-emerald-500/20 translate-x-4 translate-y-4 rounded-2xl transition-transform group-hover:translate-x-6 group-hover:translate-y-6" />
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                <Image
                  src={urlFor(about.image).width(800).height(1000).url()}
                  alt={about.title || "Profile"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
