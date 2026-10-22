/* eslint-disable @next/next/no-img-element -- SVG brand artwork is served as-is, never re-encoded */

// Official Formula Drive lockups (see DESIGN.md §2). Artwork aspect ratio 679:148.
const files = {
  dark: "/brand/formula-drive-logo-red-black.svg", // for white / grey grounds
  light: "/brand/formula-drive-logo-red-white.svg", // for charcoal / dark photography
};

export function Logo({ tone = "dark", className = "w-[148px] lg:w-[184px]" }: { tone?: keyof typeof files; className?: string }) {
  // The light lockup only appears in the footer and the mobile menu, so it never needs to load early.
  return (
    <img
      src={files[tone]}
      alt="Formula Drive Rent a Car"
      width={679}
      height={148}
      loading={tone === "light" ? "lazy" : undefined}
      className={`h-auto ${className}`}
    />
  );
}
