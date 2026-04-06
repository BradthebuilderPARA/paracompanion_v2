import { BottomNavigation } from '@/components/layout/BottomNavigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col relative pb-24 md:pb-0">
      {/* pb-24 adds space for bottom navigation on mobile, md:pb-0 removes it on desktop where sidebar might exist */}
      {children}
      <BottomNavigation />
    </div>
  );
}
