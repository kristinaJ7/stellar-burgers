import { FC, memo, useLayoutEffect, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { TModalProps } from './type';
import { ModalUI } from '@ui';

const modalRoot = document.getElementById('modals');

export const Modal: FC<TModalProps> = memo(
  ({ isOpen, title, onClose, children }) => {
    if (!modalRoot) {
      console.error('Modal root element not found — cannot render modal');
      return null;
    }

    if (!isOpen) {
      return null;
    }

    // Управление overflow body с учётом isOpen
    useLayoutEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]); // Зависимость добавлена

    useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        const modalContainer = document.querySelector('[data-modal-container]');
        if (modalContainer && !modalContainer.contains(target)) {
          onClose();
        }
      };

      // Регистрируем обработчики только если окно открыто
      if (isOpen) {
        document.addEventListener('keydown', handleEsc);
        document.addEventListener('click', handleClickOutside);
      }

      return () => {
        // Убираем обработчики при размонтировании
        document.removeEventListener('keydown', handleEsc);
        document.removeEventListener('click', handleClickOutside);
      };
    }, [isOpen, onClose]); // Зависимости: isOpen и onClose

    return ReactDOM.createPortal(
      <ModalUI title={title} onClose={onClose} data-modal-container>
        {children}
      </ModalUI>,
      modalRoot
    );
  }
);
