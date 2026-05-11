import { FC, memo } from 'react';
import styles from './modal.module.css';
import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import { TModalUIProps } from './type';
import { ModalOverlayUI } from '@ui';

export const ModalUI: FC<TModalUIProps> = memo(
  ({ title, onClose, children, 'data-testid': testId }) => (
    <div className={styles.modalContainer}  data-testid={testId} data-modal-container >
      <ModalOverlayUI onClick={onClose} />
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3
            className={`${styles.title} text text_type_main-large`}
            data-testid='modal-title'
          >
            {title}
          </h3>
          <button
            className={styles.button}
            type='button'
            onClick={onClose}
            data-testid='modal-close'
          >
            <CloseIcon type='primary' />
          </button>
        </div>
        <div className={styles.content} data-testid='modal-content'>
          {children}
        </div>
      </div>
    </div>
  )
);
