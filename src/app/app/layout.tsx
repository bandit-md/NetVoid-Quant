import { OrganizationList } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId, orgId } = await auth();
  if (!userId) redirect('/sign-in');

  if (!orgId) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted">Create or select an organization to continue.</p>
        <OrganizationList hidePersonal afterCreateOrganizationUrl="/app" afterSelectOrganizationUrl="/app" />
      </main>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
