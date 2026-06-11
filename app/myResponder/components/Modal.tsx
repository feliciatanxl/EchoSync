'use client';

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  onClose?: () => void;
}

export default function Modal({
  open,
  title,
  children,
  primaryLabel = 'Allow',
  secondaryLabel = 'Not now',
  onPrimary,
  onSecondary,
  onClose,
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="mr-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <section className="mr-modal" role="dialog" aria-modal="true" aria-labelledby="mr-modal-title">
        {onClose ? (
          <button
            aria-label="Close modal"
            onClick={onClose}
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap',
              border: 0,
            }}
          >
            <X size={16} />
          </button>
        ) : null}
        <h2 id="mr-modal-title" className="mr-modal-title">
          {title}
        </h2>
        <div className="mr-modal-body">{children}</div>
        <div className="mr-modal-actions">
          <button type="button" className="mr-modal-btn-secondary" onClick={onSecondary ?? onClose}>
            {secondaryLabel}
          </button>
          <button type="button" className="mr-modal-btn-primary" onClick={onPrimary}>
            {primaryLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
