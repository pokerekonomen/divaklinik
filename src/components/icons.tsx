import type { IconName } from "@/lib/navigation";

const common = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function TreatmentIcon({ name, className = "size-6" }: { name: IconName; className?: string }) {
  const props = { ...common, className };
  switch (name) {
    case "pulse":
      return (
        <svg {...props}>
          <path d="M3 12h4l2-5 4 10 2-5h6" />
        </svg>
      );
    case "search":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="6" />
          <path d="m16 16 4 4" />
        </svg>
      );
    case "root":
      return (
        <svg {...props}>
          <path d="M12 3.5c2.2 0 4 1.7 4 4.1 0 1.6-.6 2.7-1.2 3.8-.5.9-.8 1.6-.8 2.6 0 .8.4 1.4 1 2 .4.5.2 1.5-.5 1.5h-1.3c-.5 0-.8-.4-.9-.9-.2-.8-.6-1.3-1.8-1.3s-1.6.5-1.8 1.3c-.1.5-.4.9-.9.9H7.5c-.7 0-.9-1-.5-1.5.6-.6 1-1.2 1-2 0-1-.3-1.7-.8-2.6C6.6 10.3 6 9.2 6 7.6 6 5.2 7.8 3.5 10 3.5c.7 0 1.4.2 2 .7.6-.5 1.3-.7 2-.7Z" />
        </svg>
      );
    case "implant":
      return (
        <svg {...props}>
          <path d="M12 3.5c1.6 0 2.8 1.2 2.8 3S13.6 9.2 12 9.2 9.2 8 9.2 6.5 10.4 3.5 12 3.5Z" />
          <path d="M10.2 9.2 9 20.5M13.8 9.2l1.2 11.3M9.6 12.2h4.8M9.3 15.4h5.4M9.2 18.4h5.6" />
        </svg>
      );
    case "align":
      return (
        <svg {...props}>
          <path d="M4 9c1.2-2 2.8-3 4.4-3 2.2 0 2.6 2 3.6 2s1.4-2 3.6-2c1.6 0 3.2 1 4.4 3" />
          <path d="M5 9.5c.4 4 2.2 7.5 7 7.5s6.6-3.5 7-7.5" />
        </svg>
      );
    case "wisdom":
      return (
        <svg {...props}>
          <path d="M8 8.5c0-2 1.4-3.5 3.2-3.5 1 0 1.6.4 2.1.9.5-.5 1.1-.9 2.1-.9 1.8 0 3.1 1.5 3.1 3.5 0 1.4-.5 2.3-1 3.3-.4.7-.6 1.3-.6 2.1 0 1.6.7 2.8 1.4 3.8" />
          <path d="M7.2 14.2c.6 2.4 2.4 4.3 4.8 4.3 2.2 0 3.6-1.4 4.4-3.2" />
        </svg>
      );
    case "crack":
      return (
        <svg {...props}>
          <path d="M12 4c2 0 3.6 1.5 3.6 3.6 0 1.3-.5 2.2-1 3.1L16.8 14l-2.2 1.2L16 19.5c-.2.8-.9 1-1.5.6L12 18.2l-2.5 1.9c-.6.4-1.3.2-1.5-.6l1.4-4.3-2.2-1.2 2.2-3.3c-.5-.9-1-1.8-1-3.1C8.4 5.5 10 4 12 4Z" />
          <path d="m11 8 1.2 2.2L11 12.2" />
        </svg>
      );
    case "spark":
      return (
        <svg {...props}>
          <path d="M12 3.5 13.2 8 17.8 9.2 13.2 10.4 12 15l-1.2-4.6L5.2 9.2 10.8 8 12 3.5Z" />
          <path d="m17.5 14 .6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6.6-1.6Z" />
        </svg>
      );
    case "smile":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <path d="M8.5 13.2c.8 1.6 2 2.4 3.5 2.4s2.7-.8 3.5-2.4" />
          <path d="M9 10h.1M15 10h.1" />
        </svg>
      );
    case "calm":
      return (
        <svg {...props}>
          <path d="M12 20s-6-3.4-6-8.2A3.6 3.6 0 0 1 12 9a3.6 3.6 0 0 1 6 2.8C18 16.6 12 20 12 20Z" />
        </svg>
      );
    case "syringe":
      return (
        <svg {...props}>
          <path d="m14 6 4 4M15.5 4.5l4 4M5 19l8.5-8.5M9.5 14.5 12 17M4 20l1.5-1.5" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="M12 4c2.3 0 4.2 1.7 4.2 4.2 0 1.7-.7 2.8-1.3 4-.5 1-.8 1.7-.8 2.8 0 .8.4 1.5 1.1 2.1.4.5.2 1.4-.6 1.4h-1.4c-.5 0-.8-.4-1-.9-.3-.9-.7-1.4-2.2-1.4s-1.9.5-2.2 1.4c-.2.5-.5.9-1 .9H6.4c-.8 0-1-1-.6-1.4.7-.6 1.1-1.3 1.1-2.1 0-1.1-.3-1.8-.8-2.8-.6-1.2-1.3-2.3-1.3-4C4.8 5.7 6.7 4 9 4c1 0 1.8.3 2.5.8C12.2 4.3 13 4 14 4c-.6 0-1.2 0-2 0Z" />
        </svg>
      );
  }
}
