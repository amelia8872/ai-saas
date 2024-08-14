import { create } from 'zustand';

interface useProModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useProModal = create<useProModalStore>((set) => ({
  isOpen: false,
  onOpen: () => {
    console.log('onOpen called');
    set({ isOpen: true });
  },
  onClose: () => {
    console.log('onClose called');
    set({ isOpen: false });
  },
}));
