// Modal and notification types
export interface ModalState {
  isOpen: boolean;
  message: string;
  onConfirm: (() => void) | null;
}

export interface NotificationState {
  message: string;
  show: boolean;
} 