import { ISelectOption } from '@/type/client/default.type';

export function isSelectOption(opt: string | ISelectOption): opt is ISelectOption {
  return typeof opt === 'object' && 'value' in opt && 'label' in opt;
}
