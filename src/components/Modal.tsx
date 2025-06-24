import React, { useEffect } from 'react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Modal: React.FC<ModalProps> = ({
    open,
    onClose,
    children,
    className = '',
    size = 'md'
}) => {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                onClose();
            }
        };

        if (open) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [open, onClose]);

    if (!open) return null;

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'w-full max-w-sm';
            case 'md':
                return 'w-full max-w-md sm:max-w-lg';
            case 'lg':
                return 'w-full max-w-lg sm:max-w-xl md:max-w-2xl';
            case 'xl':
                return 'w-full max-w-xl sm:max-w-2xl md:max-w-4xl lg:max-w-5xl';
            case 'full':
                return 'w-screen h-screen max-w-none max-h-none';
            default:
                return 'w-full max-w-md sm:max-w-lg';
        }
    };

    return (
        <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 ${size === 'full' ? 'p-0' : 'p-2 sm:p-4 md:p-6'}`}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className={`
                    bg-gray-800 rounded-lg shadow-2xl
                    ${size === 'full' ? 'w-screen h-screen max-w-none max-h-none rounded-none' : 'max-h-[95vh] sm:max-h-[90vh]'}
                    overflow-y-auto overflow-x-hidden
                    animate-in zoom-in-95 slide-in-from-bottom-4 duration-200
                    flex flex-col
                    ${getSizeClasses()}
                    ${className}
                `}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal; 