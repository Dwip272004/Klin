"use client";
import { useEffect } from "react";

const SELECTOR = ".sec-head,.step,.feat,.plan,.cmp-wrap,.free-note,details,.band .container,.joblist,.page-head,.footnote,.job";

export default function RevealOnScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    document.documentElement.classList.add("reveal-ready");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach((el) => {
      const i = Array.from(el.parentElement?.children ?? []).indexOf(el);
      el.style.setProperty("--d", `${Math.min(i, 5) * 80}ms`);
      el.setAttribute("data-reveal", "");
      io.observe(el);
    });
    return () => { io.disconnect(); document.documentElement.classList.remove("reveal-ready"); };
  }, []);
  return null;
}
