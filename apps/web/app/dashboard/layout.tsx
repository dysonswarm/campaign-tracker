import { ThemeSwitcher } from "@campaign-tracker/ui/components/theme-switcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex max-h-screen overflow-hidden">
      <aside className="bg-gray-100 dark:bg-gray-800 p-4">
        <nav>
          <ThemeSwitcher />
        </nav>
      </aside>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
