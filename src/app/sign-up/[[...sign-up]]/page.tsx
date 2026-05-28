import { SignUp } from "@clerk/nextjs";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const isClerkConfigured = clerkKey.startsWith("pk_") && !clerkKey.includes("placeholder");

export default function SignUpPage() {
  return (
    <div className="pt-32 pb-16 px-4 sm:px-8 max-w-md mx-auto">
      <div className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] mb-3 text-accent font-mono">Create account</p>
        <h1 className="text-4xl font-extrabold tracking-[-0.04em]">Join us.</h1>
      </div>
      <div className="flex justify-center">
        {isClerkConfigured ? (
          <SignUp />
        ) : (
          <div className="rounded-3xl border border-border bg-surface p-8 w-full text-center">
            <p className="text-text-muted text-sm">
              Authentication isn&apos;t configured in this environment.
              <br />
              Set <code className="text-accent">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> to enable.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
