import { TContactDesktopResponse } from '@/lib/hooks/business/contact.hook';
import { create } from 'zustand';

interface ContactState {
  addedContacts: TContactDesktopResponse[];
  addContact: (contact: TContactDesktopResponse) => void;
  setAllContacts: (contacts: TContactDesktopResponse[]) => void;
}

export const useContactStore = create<ContactState>((set) => ({
  addedContacts: [],
  addContact: (contact) =>
    set((state) => ({
      addedContacts: [contact, ...state.addedContacts],
    })),
  setAllContacts: (contacts) => set({ addedContacts: contacts }),
}));
