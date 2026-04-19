import React from 'react';
import { X } from 'lucide-react';
import NeomorphicCard from './NeomorphicCard';

interface NeomorphicModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const NeomorphicModal: React.FC<NeomorphicModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose}></div>
      <NeomorphicCard className="relative w-full max-w-lg flex flex-col gap-6 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <h2 className="font-sora text-xl font-black uppercase tracking-tight text-[#1A1A1A]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 neo-inset rounded-lg text-[#777] hover:text-[#C1272D] neo-transition border-none outline-none cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <div>
          {children}
        </div>
      </NeomorphicCard>
    </div>
  );
};

export default NeomorphicModal;
