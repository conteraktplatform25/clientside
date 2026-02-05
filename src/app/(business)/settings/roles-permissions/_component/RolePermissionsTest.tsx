'use client';
// src/app/(business)/settings/components/RolesPermissions.tsx
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { RPPermission } from '../_types/rp-default.types';
import { fetchJSON } from '@/utils/response';
import { ROLE_LABEL_MAP } from '@/lib/constants/default.constant';
import { useGetSelectAppRoles } from '@/lib/hooks/default.hook';
import { groupPermissionsHelper } from '../_helper/group-permission.helper';
import { getErrorMessage } from '@/utils/errors';
import { Loader2 } from 'lucide-react';

const fetcher = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

export default function RolePermissionsTest() {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [permissions, setPermissions] = useState<RPPermission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(new Set());
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(false);

  const grouped = useMemo(() => groupPermissionsHelper(permissions), [permissions]);

  const { data: roleResponse, isLoading } = useGetSelectAppRoles();

  // Fetch roles on mount
  const roleOptions =
    roleResponse?.map((role) => ({
      value: role.id.toString(),
      label: ROLE_LABEL_MAP[role.name] ?? role.name,
    })) ?? [];

  // Fetch permissions on role change
  useEffect(() => {
    if (!selectedRoleId) return;
    setLoading(true);

    fetcher(`/api/settings/role-permission/${selectedRoleId}/permissions`)
      .then((data: { permissions: RPPermission[]; isEditable: boolean; selected: number[] }) => {
        console.log(data);
        setPermissions(data.permissions);
        setSelectedPermissions(new Set(data.permissions.filter((p) => data.selected.includes(p.id)).map((p) => p.id)));
        setIsEditable(data.isEditable);
      })
      .catch(() => toast.error('Could not load permissions for this role'))
      .finally(() => setLoading(false));
  }, [selectedRoleId]);

  const handleSelectAll = (group: string, checked: boolean) => {
    const groupPerms = grouped[group] || [];
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      groupPerms.forEach((p) => (checked ? next.add(p.id) : next.delete(p.id)));
      return next;
    });
  };

  const handlePermissionChange = (permId: number, checked: boolean) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (checked) next.add(permId);
      else next.delete(permId);
      //checked ? next.add(permId) : next.delete(permId);
      return next;
    });
  };

  const hasChanges = useMemo(() => {
    // Compare with original selected (you can store original on load if needed)
    return true; // for simplicity — or implement diff
  }, []);

  const validateBeforeSave = (): boolean => {
    if (selectedPermissions.size === 0) {
      toast.warning('No permissions selected. Role will have zero access.');
      return confirm('Are you sure you want to remove all permissions from this role?');
    }
    if (!hasChanges) {
      toast.info('No changes to save');
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (!isEditable || !selectedPermissions) return;
    if (!validateBeforeSave()) return;

    setLoading(true);
    try {
      await fetchJSON(`/api/settings/role-permission/${selectedRoleId}/permissions`, {
        method: 'PUT',
        body: JSON.stringify({ permissionIds: Array.from(selectedPermissions) }),
      });
      toast.success('Permissions updated successfully');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage || 'Failed to update');
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container p-4 max-w-2xl'>
      <div className='flex justify-between items-center mb-1'>
        <h1 className='text-2xl font-bold mb-4'>Roles & Permissions</h1>
        {isLoading ? (
          <div className='text-right p-3 bg-success-200'>
            <span className='text-base text-gray-700 leading-[150%]'>No role set from the server</span>
          </div>
        ) : roleOptions && roleOptions.length > 0 ? (
          <Select
            value={selectedRoleId?.toString()}
            onValueChange={(val) => setSelectedRoleId(Number(val))}
            disabled={loading || isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select Role' />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((role) => (
                <SelectItem key={role.value} value={role.value.toString()}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className='text-right p-3 bg-red-100'>
            <span className='text-base text-red-600 leading-[150%]'>No role set from the server</span>
          </div>
        )}
      </div>

      {loading && <p>Loading...</p>}
      {selectedPermissions.size > 0 && !loading && !isEditable && (
        <p className='text-center text-base text-neutral-600 py-3'>This role (Business Owner) cannot be edited.</p>
      )}
      {!loading && selectedRoleId && (
        <>
          <div className='w-full flex items-end justify-end mb-4'>
            {isEditable && (
              <Button
                onClick={saveChanges}
                disabled={loading}
                className='min-w-32 mt-2 bg-primary-base hover:bg-primary-700'
              >
                {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Save Changes
              </Button>
            )}
          </div>
          <div className='space-y-4'>
            {Object.entries(grouped).map(([group, perms]) => (
              <section key={group} className='border rounded-lg p-5'>
                <div className='flex items-center justify-between mb-2'>
                  <h2 className='text-lg font-semibold capitalize'>{group.replace('_', ' ')}</h2>
                  <div className='flex items-center gap-2'>
                    <Checkbox
                      id={`${group}-all`}
                      disabled={!isEditable}
                      onCheckedChange={(checked) => handleSelectAll(group, !!checked)}
                      checked={perms.every((p) => selectedPermissions.has(p.id))}
                    />
                    <Label htmlFor={`${group}-select-all`} className='ml-2'>
                      Select all
                    </Label>
                  </div>
                </div>
                <div className='mt-2 space-y-2'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4'>
                    {perms.map((perm) => (
                      <div key={perm.id} className='flex items-center gap-2'>
                        <Checkbox
                          id={`perm-${perm.id}`}
                          disabled={!isEditable}
                          checked={selectedPermissions.has(perm.id)}
                          onCheckedChange={(checked) => handlePermissionChange(perm.id, !!checked)}
                        />
                        <Label htmlFor={perm.name} className='ml-2 leading-relaxed cursor-pointer'>
                          {perm.name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
