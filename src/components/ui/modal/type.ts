import { ReactNode } from 'react';

export type TModalUIProps = {
  title: string;
  children?: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  'data-testid'?: string;
};
