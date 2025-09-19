import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, MouseEventHandler, ReactNode, RefAttributes } from 'react';

export type TSVGIconProps = {
  fileName: string; // file name without path, e.g., "my-icon.svg"
  alt: string;
  className?: string;
  width?: number;
  height?: number;
};

export interface ILayoutProps {
  children: ReactNode;
}

export interface ISideMenuProps {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
}

export interface ISelectOption {
  label: string;
  value: string;
}

export interface IDialogOpen {
  isOpen: boolean;
  onOpenChange: (status: boolean) => void;
  onConfirm: MouseEventHandler<HTMLButtonElement>;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
}
