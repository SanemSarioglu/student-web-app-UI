
import { render, screen, fireEvent } from '@testing-library/react';
import Toast from '../Toast';
import { Toast as ToastType } from '../../types';

const mockToast: ToastType = {
  id: '1',
  message: 'Test message',
  type: 'success',
};

const mockOnRemove = jest.fn();

describe('Toast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders toast message', () => {
    render(<Toast toast={mockToast} onRemove={mockOnRemove} />);
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('calls onRemove when close button is clicked', () => {
    render(<Toast toast={mockToast} onRemove={mockOnRemove} />);
    
    const closeButton = screen.getByLabelText('Close notification');
    fireEvent.click(closeButton);
    
    expect(mockOnRemove).toHaveBeenCalledWith('1');
  });

  it('applies correct styles for success type', () => {
    render(<Toast toast={mockToast} onRemove={mockOnRemove} />);
    
    const toastElement = screen.getByRole('alert');
    expect(toastElement).toHaveClass('bg-green-50', 'border-green-200', 'text-green-800');
  });

  it('applies correct styles for error type', () => {
    const errorToast: ToastType = { ...mockToast, type: 'error' };
    render(<Toast toast={errorToast} onRemove={mockOnRemove} />);
    
    const toastElement = screen.getByRole('alert');
    expect(toastElement).toHaveClass('bg-red-50', 'border-red-200', 'text-red-800');
  });
}); 