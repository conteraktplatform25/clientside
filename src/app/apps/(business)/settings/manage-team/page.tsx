import RequirePermission from '@/components/guards/RequirePermission';
import BusinessTeamManager from './_component/BusinessTeamManager';

export default function ManageTeamPage() {
  return (
    <RequirePermission allowedRoles={['Business']} fallback={<p className='text-sm text-gray-500'>Access denied.</p>}>
      <BusinessTeamManager />
    </RequirePermission>
  );
}
