"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { CloseIcon, MenuIcon, WhatsAppIcon, PhoneIcon } from "./icons";
import { business, nav } from "@/data/site";
import { generalEnquiry } from "@/lib/whatsapp";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const menuRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the nav link of the section crossing the upper third of the viewport.
  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(2));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-30% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const openMenu = () => menuRef.current?.showModal();
  const closeMenu = () => menuRef.current?.close();

  return (
    <header
      className={`sticky top-0 z-40 h-[var(--header-h)] transition-[background-color,box-shadow] duration-[280ms] ease-[var(--ease-out)] ${
        scrolled ? "bg-white shadow-[0_1px_0_var(--color-line)]" /* taste-skill-ignore: separator of the sticky bar */ : "bg-white/0"
      }`}
    >
      <a href="#main" className="sr-only-focusable">
        Skip to content
      </a>
      <div className="frame flex h-full items-center justify-between gap-6">
        <Link href="/#top" aria-label="Formula Drive Rent a Car, home" className="inline-flex min-h-12 shrink-0 items-center">
          <Logo className="w-[min(187px,calc(100vw-204px))] lg:w-[264px]" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {nav.map((item) => {
              const isActive = active === item.href.slice(2);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative inline-flex min-h-12 items-center transition-colors duration-[160ms] ${
                      isActive ? "font-semibold text-charcoal" : "text-muted hover:text-charcoal"
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 bottom-2 h-[2px] origin-left bg-red transition-transform duration-[280ms] ease-[var(--ease-out)] ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={generalEnquiry} target="_blank" rel="noopener" className="btn btn-red max-lg:min-h-12 max-lg:px-4">
            <WhatsAppIcon />
            <span>
              Book<span className="max-sm:hidden"> now</span>
            </span>
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={openMenu}
            aria-label="Open menu"
            aria-haspopup="dialog"
            className="grid size-12 place-items-center lg:hidden"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      <dialog
        ref={menuRef}
        aria-label="Menu"
        onClose={() => menuButtonRef.current?.focus()}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) closeMenu();
        }}
        className="on-dark m-0 h-dvh max-h-none w-full max-w-none bg-charcoal p-0 text-white open:animate-[menu-in_var(--dur-2)_var(--ease-out)] backdrop:bg-transparent"
      >
        <div className="frame flex h-full flex-col">
          <div className="flex h-[var(--header-h)] items-center justify-between">
            <Logo tone="light" />
            <button type="button" onClick={closeMenu} aria-label="Close menu" className="grid size-12 place-items-center" autoFocus>
              <CloseIcon />
            </button>
          </div>
          <nav aria-label="Menu" className="mt-10">
            <ul className="flex flex-col gap-4">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="t-h2 block py-1">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto flex flex-col gap-3 pb-10">
            <a href={generalEnquiry} target="_blank" rel="noopener" className="btn btn-red w-full">
              <WhatsAppIcon /> WhatsApp {business.whatsapp.display}
            </a>
            <a href={`tel:${business.phone.tel}`} className="btn btn-light w-full">
              <PhoneIcon /> Call {business.phone.display}
            </a>
          </div>
        </div>
      </dialog>
    </header>
  );
}
