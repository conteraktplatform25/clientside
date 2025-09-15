export function renderTemplate(template: string, variables: Record<string, string>) {
  return Object.entries(variables).reduce((content, [key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g'); // global replace
    return content.replace(regex, value || '');
  }, template);
}
