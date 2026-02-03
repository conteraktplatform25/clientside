export type ApplicationRole = 'Business' | 'Agent' | 'Manager';

export interface ISettingsTab {
  label: string;
  href: string;
  roles: ApplicationRole[];
  title: string;
}
