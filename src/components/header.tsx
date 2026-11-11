"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ChevronDown, Menu, MessageCircle, Phone, Star, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TreatmentIcon } from "@/components/icons";
import { clinic } from "@/lib/clinic";
import { aboutLinks, treatmentGroups } from "@/lib/navigation";
import { cn } from "@/lib/cn";

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Diva Tandklinik, startsida">
      <img src="/icon-192.png" alt="" width={compact ? 36 : 44} height={compact ? 36 : 44} className="rounded-full" />
      <span className={cn("font-serif leading-none text-ink", compact ? "text-lg" : "text-xl")}>
        Diva
        <span className="hidden text-[11px] tracking-[0.16em] text-muted uppercase sm:block">Tandklinik</span>
      </span>
    </Link>
  );
}

export function Header() {
  const path = usePathname();
  const [shrunk, setShrunk] = useState(false);
  const bar = useRef<HTMLSpanElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const shrunkRef = useRef(false);
  const [panelTop, setPanelTop] = useState(80);
  const [open, setOpen] = useState(false);
  const onTreatment = path === "/behandlingar" || treatmentGroups.some((group) => group.links.some((link) => link.href === path));
  const itemClass = (active: boolean) =>
    cn(
      "inline-flex h-11 items-center gap-1 px-3 text-[15px] text-ink/75 hover:text-ink data-[state=open]:text-ink",
      active && "text-rose",
    );
  const treatmentLinks = treatmentGroups.flatMap((group) => group.links);
  const menuSplit = Math.ceil(treatmentLinks.length / 2);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 12;
      if (next !== shrunkRef.current) {
        shrunkRef.current = next;
        setShrunk(next);
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    const placePanel = () => {
      if (headerRef.current) setPanelTop(headerRef.current.getBoundingClientRect().bottom);
    };
    onScroll();
    placePanel();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", placePanel, { passive: true });
    window.addEventListener("resize", placePanel);
    headerRef.current?.addEventListener("transitionend", placePanel);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", placePanel);
      window.removeEventListener("resize", placePanel);
      headerRef.current?.removeEventListener("transitionend", placePanel);
    };
  }, [shrunk]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-40 border-b transition-[background,box-shadow,height] duration-300 relative",
        shrunk ? "border-line bg-paper shadow-[0_8px_30px_rgba(29,36,71,0.06)]" : "border-line bg-paper",
      )}
    >
      <span ref={bar} aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-rose" />
      <div className={cn("mx-auto flex w-full max-w-6xl items-center gap-2 px-3 transition-[height] duration-300 sm:gap-3 sm:px-4", shrunk ? "h-16" : "h-16 md:h-20")}>
        <Logo compact={shrunk} />
        <NavigationMenu.Root delayDuration={120} className="ml-6 hidden flex-1 lg:block">
          <NavigationMenu.List className="flex items-center gap-1">
            <NavigationMenu.Item>
              <NavigationMenu.Trigger className={cn("group", itemClass(onTreatment))}>
                Behandlingar
                <ChevronDown className="size-4 transition group-data-[state=open]:rotate-180" aria-hidden />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content style={{ top: panelTop }} className="menu-pop fixed inset-x-0 z-50 border-t border-line bg-paper shadow-[0_24px_40px_rgba(29,36,71,0.06)]">
                <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-16 px-6 py-8">
                  {[treatmentLinks.slice(0, menuSplit), treatmentLinks.slice(menuSplit)].map((column) => (
                    <ul key={column[0]?.href}>
                      {column.map((link) => (
                        <li key={link.href}>
                          <NavigationMenu.Link asChild>
                            <Link href={link.href} className="flex items-start gap-3 rounded-xl px-2 py-2.5 hover:bg-sand">
                              <TreatmentIcon name={link.icon} className="mt-0.5 size-5 shrink-0 text-rose" />
                              <span className="min-w-0">
                                <span className="block text-[15px] font-medium leading-tight">{link.title}</span>
                                <span className="mt-0.5 block text-sm text-muted">{link.text}</span>
                              </span>
                            </Link>
                          </NavigationMenu.Link>
                        </li>
                      ))}
                    </ul>
                  ))}
                  <NavigationMenu.Link asChild>
                    <Link href="/behandlingar" className="col-span-2 mt-2 inline-flex items-center gap-3 px-2 text-[15px] font-medium">
                      <TreatmentIcon name="tooth" className="size-5 text-rose" />
                      Alla behandlingar
                      <span className="text-sm font-normal text-muted">Se hela utbudet</span>
                    </Link>
                  </NavigationMenu.Link>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Trigger className={cn("group", itemClass(path.startsWith("/diva-tandklinik")))}>
                Om oss
                <ChevronDown className="size-4 transition group-data-[state=open]:rotate-180" aria-hidden />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content style={{ top: panelTop }} className="menu-pop fixed inset-x-0 z-50 border-t border-line bg-paper shadow-[0_24px_40px_rgba(29,36,71,0.06)]">
                <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_9rem] items-start gap-5 px-6 py-8">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { ...aboutLinks[0], icon: UserRound },
                      { ...aboutLinks[1], icon: Star },
                      { ...aboutLinks[2], icon: MessageCircle },
                    ].map((link) => (
                      <NavigationMenu.Link asChild key={link.href}>
                        <Link href={link.href} className="flex flex-col items-center rounded-xl px-2 py-3 text-center hover:bg-sand">
                          <link.icon className="size-6 text-rose" aria-hidden />
                          <span className="mt-2 text-sm font-medium">{link.title}</span>
                          <span className="mt-0.5 text-xs text-muted">{link.text}</span>
                        </Link>
                      </NavigationMenu.Link>
                    ))}
                  </div>
                  <div className="w-px self-stretch bg-line" />
                  <div>
                    <p className="text-sm font-medium">Mer</p>
                    <ul className="mt-2 space-y-1 text-sm text-muted">
                      <li><NavigationMenu.Link asChild><Link href="/priser-tandlakare-goteborg" className="block py-1 hover:text-ink">Priser</Link></NavigationMenu.Link></li>
                      <li><NavigationMenu.Link asChild><Link href="/blogg" className="block py-1 hover:text-ink">Guider</Link></NavigationMenu.Link></li>
                      <li><NavigationMenu.Link asChild><Link href="/kontakt" className="block py-1 hover:text-ink">Kontakt</Link></NavigationMenu.Link></li>
                    </ul>
                  </div>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link href="/priser-tandlakare-goteborg" className={itemClass(path === "/priser-tandlakare-goteborg")}>
                  Priser
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link href="/blogg" className={itemClass(path === "/blogg")}>
                  Guider
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link href="/kontakt" className={itemClass(path === "/kontakt")}>
                  Kontakt
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
        <div className="ml-auto flex items-center gap-2">
          <a href={`tel:${clinic.phoneTel}`} className="inline-flex size-11 items-center justify-center rounded-full border border-line md:hidden" aria-label={`Ring ${clinic.phoneDisplay}`}>
            <Phone className="size-4" aria-hidden />
          </a>
          <a href={`tel:${clinic.phoneTel}`} className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm hover:bg-sand md:inline-flex">
            <Phone className="size-4" aria-hidden />
            {clinic.phoneDisplay}
          </a>
          <Link href="/boka" className="inline-flex h-11 shrink-0 items-center rounded-full bg-rose px-3.5 text-sm text-white hover:bg-rose-deep sm:px-4">
            <span className="sm:hidden">Boka</span>
            <span className="hidden sm:inline">Boka tid</span>
          </Link>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className="inline-flex size-11 items-center justify-center rounded-full hover:bg-sand lg:hidden" aria-label="Öppna meny">
              <Menu className="size-5" />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="overlay fixed inset-0 z-50 bg-ink/30" />
              <Dialog.Content className="drawer fixed inset-y-0 left-0 z-50 flex w-full flex-col bg-paper shadow-2xl outline-none sm:w-[min(100%,380px)]" aria-describedby={undefined}>
                <div className="flex items-center justify-between px-4 py-3">
                  <Dialog.Title className="sr-only">Meny</Dialog.Title>
                  <Dialog.Close className="inline-flex size-11 items-center justify-center rounded-full hover:bg-sand" aria-label="Stäng meny">
                    <X className="size-5" />
                  </Dialog.Close>
                </div>
                <div className="flex-1 overflow-y-auto px-5 pb-4">
                  <details className="group border-b border-line">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-lg font-medium group-open:text-rose [&::-webkit-details-marker]:hidden">
                      Behandlingar
                      <ChevronDown className="size-4 transition group-open:rotate-180" aria-hidden />
                    </summary>
                    <div className="pb-3">
                      {treatmentGroups.map((group) => (
                        <div key={group.title} className="mt-2">
                          <p className="px-1 text-xs text-muted">{group.title}</p>
                          <ul>
                            {group.links.map((link) => (
                              <li key={link.href}>
                                <Link href={link.href} onClick={() => setOpen(false)} className="flex min-h-11 items-center gap-3 rounded-xl px-1">
                                  <TreatmentIcon name={link.icon} className="size-5 text-rose" />
                                  <span className="text-[15px]">{link.title}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <Link href="/behandlingar" onClick={() => setOpen(false)} className="mt-2 inline-flex px-1 text-sm font-medium text-rose">
                        Alla behandlingar
                      </Link>
                    </div>
                  </details>
                  <Link href="/priser-tandlakare-goteborg" onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-line text-lg">
                    Priser
                  </Link>
                  <details className="group border-b border-line">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-lg font-medium group-open:text-rose [&::-webkit-details-marker]:hidden">
                      Om oss
                      <ChevronDown className="size-4 transition group-open:rotate-180" aria-hidden />
                    </summary>
                    <ul className="pb-3">
                      {aboutLinks.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} onClick={() => setOpen(false)} className="flex min-h-11 flex-col justify-center">
                            <span>{link.title}</span>
                            <span className="text-sm text-muted">{link.text}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                  <Link href="/blogg" onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-line text-lg">Guider</Link>
                  <Link href="/kontakt" onClick={() => setOpen(false)} className="flex min-h-12 items-center text-lg">Kontakt</Link>
                </div>
                <div className="grid grid-cols-2 gap-2 border-t border-line p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                  <a href={`tel:${clinic.phoneTel}`} className="inline-flex h-12 items-center justify-center rounded-full border border-line">
                    Ring
                  </a>
                  <Link href="/boka" onClick={() => setOpen(false)} className="inline-flex h-12 items-center justify-center rounded-full bg-rose text-white">
                    Boka tid
                  </Link>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
