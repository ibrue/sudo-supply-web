"use client";

import { UserButton } from "@clerk/nextjs";

interface AccountHeaderProps {
  name: string;
  email: string;
  imageUrl: string;
}

export function AccountHeader({ name, email }: AccountHeaderProps) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-6 flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-mono text-text-muted mb-1">
          $ sudo whoami
        </p>
        <p className="text-lg font-semibold">{name}</p>
        <p className="text-text-muted text-sm">{email}</p>
      </div>
      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-12 h-12 rounded-full",
          },
        }}
      />
    </section>
  );
}
