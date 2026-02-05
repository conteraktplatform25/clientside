import { PureAbility } from '@casl/ability';

//type Subjects = InferSubjects<typeof Prisma.ModelName> | 'all';
export type AppSubjects =
  | 'Team'
  | 'Contact'
  | 'Inbox'
  | 'Settings'
  | 'Inbox'
  | 'Catalogue'
  | 'Orders'
  | 'Replies'
  | 'All';

export type AppAbility = PureAbility<[string, AppSubjects]>;

// import { AbilityBuilder, createMongoAbility, PureAbility } from '@casl/ability';
// import { ACTION_MAP } from './action-mapper.casl';
// import { SUBJECT_MAP } from './subject-mapper.casl';

// interface IPermissionAccess {
//   group_name: string;
//   name: string;
// }

// type AbilityRule = {
//   action: string;
//   subject: string;
//   conditions?: Record<string, any>;
// };

// function permissionToAbility(permission: IPermissionAccess, userId?: string): AbilityRule[] {
//   const { group_name, name } = permission;

//   // Special inbox logic
//   if (name === 'assigned_me') {
//     return [
//       {
//         action: 'read',
//         subject: 'Inbox',
//         conditions: { assignedTo: userId },
//       },
//     ];
//   }
//   if (name === 'assigned_all') {
//     return [
//       {
//         action: 'read',
//         subject: 'Inbox',
//       },
//     ];
//   }

//   const [verb] = name.split('_');
//   const action = ACTION_MAP[verb];
//   const subject = SUBJECT_MAP[group_name];

//   if (!action || !subject) return [];

//   return [{ action, subject }];
// }

// export type AppAbility = PureAbility<[string, AppSubjects | string]>; // string for custom actions like "manage_roles"

// export function defineAbilityFor(permissions: IPermissionAccess[], isAdmin = false, userId?: string) {
//   const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

//   for (const permission of permissions) {
//     const rules = permissionToAbility(permission, userId)
//     rules.forEach(rule =>
//       can(rule.action, rule.subject, rule.conditions)
//     )
//   }
//   cannot('update', 'Role', { name: 'business' });

//   return build();
// }
