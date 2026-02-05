import { RPPermission, TRPGroupedPermissions } from '../_types/rp-default.types';

// ── Helper ───────────────────────────────────────────────
export function groupPermissionsHelper(perms: RPPermission[]): TRPGroupedPermissions {
  return perms.reduce<TRPGroupedPermissions>((acc, p) => {
    const group = p.group_name || 'All';
    acc[group] = acc[group] || [];
    acc[group].push(p);
    return acc;
  }, {});
}
