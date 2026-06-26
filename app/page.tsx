"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import LoadingScreen from "@/components/LoadingScreen";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import GitHubStats from "@/components/sections/GitHubStats";
import Education from "@/components/sections/Education";
import Certificates from "@/components/sections/Certificates";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});

const NeuralBackground = dynamic(() => import("@/components/NeuralBackground"), {
  ssr: false,
});

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <LoadingScreen />
      {mounted && <CustomCursor />}
      {mounted && <NeuralBackground />}
      <ScrollProgress />
      <Navbar />

      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <GitHubStats />
        <Education />
        <Certificates />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
