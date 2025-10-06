import { ColumnDef } from '@tanstack/react-table';
import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, MouseEventHandler, ReactNode, RefAttributes } from 'react';
import { IconType } from 'react-icons/lib';

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

interface IMenuProps {
  title: string;
  url: string;
}

export interface ISideMenuProps {
  title: string;
  url?: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  submenu?: IMenuProps[];
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
export interface ITabItem {
  value: string;
  label: string;
  icon?: IconType;
  content?: React.ReactNode;
}

export interface ICustomTabPanelProps {
  tabs: ITabItem[];
}

export interface IDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  children?: ReactNode;
}
