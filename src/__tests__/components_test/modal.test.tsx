import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalUI } from '../../components/ui/modal/modal';

describe('ModalUI Component', () => {
  const mockOnClose = jest.fn();
  const testContent = <div>Test Content</div>;

  beforeEach(() => {
    mockOnClose.mockClear();

    // Гарантированно удаляем старый и создаём новый modal-root
    const existingRoot = document.getElementById('modal-root');
    if (existingRoot) {
      document.body.removeChild(existingRoot);
    }

    const modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) document.body.removeChild(modalRoot);
  });

  const renderModal = (title = 'Test Modal') =>
    render(
      <ModalUI title={title} onClose={mockOnClose}>
        {testContent}
      </ModalUI>
    );

  it('renders modal with title and content', async () => {
    renderModal();

    await waitFor(() => {
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  it('calls onClose when clicking close button', async () => {
    renderModal();

    // Ждём появления кнопки закрытия
    const closeButton = await screen.findByTestId('modal-close');
    await userEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking overlay', async () => {
    renderModal();

    // Ждём появления overlay
    const overlay = await screen.findByTestId('modal-overlay');
    await userEvent.click(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
