import SecuritySessions from '@/components/dashboard/SecuritySessions';

export const metadata = {
  title: 'Security & Sessions | PropEx',
  description: 'Manage your active devices and view your login history.',
};

export default function CustomerSecurityPage() {
  return <SecuritySessions />;
}
