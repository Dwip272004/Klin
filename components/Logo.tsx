import Link from "next/link";
export default function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="logo" aria-label="Kiln home">
      <span className="logo-mark" aria-hidden />kiln
    </Link>
  );
}
