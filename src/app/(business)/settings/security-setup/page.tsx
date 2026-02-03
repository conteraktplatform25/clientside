import RequirePermission from '@/components/guards/RequirePermission';
import SecuritySetupManager from './_component/SecuritySetupManager';

export default function SecuritySetupPage() {
  return (
    <RequirePermission
      allowedRoles={['Business', 'Agent', 'Managers']}
      fallback={<p className='text-sm text-gray-500'>Access denied.</p>}
    >
      <SecuritySetupManager />
    </RequirePermission>
  );
}
