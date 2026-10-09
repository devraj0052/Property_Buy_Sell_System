import SecuritySessions from '@/components/dashboard/SecuritySessions';

export const metadata = {
  title: 'Security & Sessions (Agent) | PropEx',
  description: 'Manage your active devices and view your login history.',
};

export default function AgentSecurityPage() {
  return <SecuritySessions />;
}
