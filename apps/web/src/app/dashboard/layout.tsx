import { Metadata } from 'next';
import { DashboardSidebar } from './dashboard-sidebar';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s | Dashboard | AYN YouTube',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container py-8 pt-28">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
