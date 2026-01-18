/**
 * Landing Builder Layout
 *
 * Minimal layout for full-screen builder experience
 * No dashboard sidebar, no header - just the builder
 */

export default function LandingBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {children}
    </div>
  );
}
