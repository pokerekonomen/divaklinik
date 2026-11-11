"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clinic } from "@/lib/clinic";

export function BookBar({ service }: { service?: string }) {
  const href = service ? `/boka?behandling=${service}` : "/boka";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 z-40 border-t border-line bg-paper/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(29,36,71,0.08)] backdrop-blur lg:hidden" style={{ bottom: "var(--cookie-space, 0px)" }}>
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
        <a href={`tel:${clinic.phoneTel}`} className="inline-flex h-12 items-center justify-center rounded-full border border-line text-sm font-medium">
          Ring
        </a>
        <Link href={href} className="inline-flex h-12 items-center justify-center rounded-full bg-rose text-sm text-white">
          Boka tid
        </Link>
      </div>
    </div>
  );
}
