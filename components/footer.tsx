import Image from "next/image";
import Link from "next/link";

export default function FooterSection() {
  return (
    <footer className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <Link
          href="/"
          aria-label="go home"
          className="mx-auto size-fit flex items-center gap-2"
        >
          <Image src="/Logo.png" alt="Brand Logo" width={35} height={35} />
          <span className="text-xl tracking-wide">NoteForge</span>
        </Link>

        <span className="text-muted-foreground block text-center text-sm mt-3">
          © {new Date().getFullYear()} NoteForge, All rights reserved
        </span>
      </div>
    </footer>
  );
}
