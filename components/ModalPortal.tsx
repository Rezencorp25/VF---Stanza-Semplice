import { createPortal } from 'react-dom';
import { ReactNode, useEffect } from 'react';

interface ModalPortalProps {
  children: ReactNode;
  onClose?: () => void;
}

export const ModalPortal = ({ children, onClose }: ModalPortalProps) => {
  useEffect(() => {
    // 2. Al mount: aggiungere overflow-hidden al body (blocca scroll background)
    document.body.style.overflow = 'hidden';
    
    // 5. Supportare chiusura con tasto ESC
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);

    // 3. Al unmount: rimuovere overflow-hidden
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // 1. Usare createPortal per renderizzare i children nel document.body
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* 4. Il backdrop deve avere z-[9999] */}
      {/* 5. Supportare chiusura con click sul backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* 4. Il contenuto modale z-[10000] */}
      {/* Use pointer-events-none on wrapper to allow clicks on backdrop if content doesn't cover it */}
      <div className="relative z-[10000] w-full h-full pointer-events-none flex items-center justify-center">
        <div className="pointer-events-auto w-full h-full flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
