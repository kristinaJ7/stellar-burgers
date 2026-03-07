export interface TModalProps {
  isOpen?: boolean;
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
}
