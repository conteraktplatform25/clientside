import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import prisma from '@/lib/prisma';
import type { AppAbility, AppSubjects } from './ability';
import { formatRoleProfile } from '../helpers/string-manipulator.helper';

export async function defineAbilityFor(userId: string, currentBusinessId: string | null): Promise<AppAbility> {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  if (!currentBusinessId) {
    // rare: platform admin or onboarding — usually return empty / minimal
    return build();
  }
  // 1. Get user's role in this business
  const teamProfile = await prisma.businessTeamProfile.findUnique({
    where: {
      businessProfileId_userId: {
        businessProfileId: currentBusinessId,
        userId,
      },
    },
    include: {
      role: {
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      },
    },
  });
  if (!teamProfile || teamProfile.status !== 'ACTIVE') {
    // no access to this business
    return build();
  }

  const role = teamProfile.role;
  // 2. Map DB permissions → CASL rules
  role.permissions.forEach((rp) => {
    const perm = rp.permission;
    //const [action, ...subjectParts] = perm.name.split('_');
    const action = perm.name;
    const subject = formatRoleProfile(perm.group_name!) as AppSubjects;

    // Simple RBAC
    can(action, subject);
  });

  // Special: Owner flag (if you kept is_admin on Role)
  if (role.is_default) {
    can('manage', 'All'); // full access inside this business
  }
  // Explicit denies (good practice)
  cannot('delete', 'All'); // nobody deletes their own business accidentally

  return build();
}
