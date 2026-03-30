"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toastBus } from "@/lib/toastBus";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function TerminalLink({ href, children, className = "btn-terminal" }: Props) {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (navigating) return;
      setNavigating(true);

      // Map href to a terminal-style path
      const path = href.replace(/^\//, "~/");
      toastBus.emit(`$ cd ${path}`, `Entering ${path}...`);

      // Brief delay so the user sees the toast before navigation
      setTimeout(() => {
        router.push(href);
      }, 600);
    },
    [href, router, navigating]
  );

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
