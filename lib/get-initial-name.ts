export function getInitialName(name?: string | null): string {
  if (!name) return "?";

  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
}
