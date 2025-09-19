import { create } from 'zustand';
import { TInboxCategory } from '@/type/client/business/inbox.type';

interface ICategoryStoreProps {
  category: TInboxCategory;
  setCategory: (cat: TInboxCategory) => void;
}

interface ISearchUserStoreProps {
  user_search: string;
  setUserSearch: (user: string) => void;
}

interface ISelectStoreProps {
  chat_status: string;
  tag_labels: string;
  assignee: string;
  sort_order: string;
  setFilter: (key: keyof ISelectStoreProps, value: string) => void;
}
export const selectDefaultValues = {
  chat_status: 'Open',
  tag_labels: 'All',
  assignee: 'All',
  sort_order: 'Newest',
};

export const useCategoryStore = create<ICategoryStoreProps>((set) => ({
  category: 'All',
  setCategory: (cat) => set({ category: cat }),
}));

export const useSearchUserStore = create<ISearchUserStoreProps>((set) => ({
  user_search: '',
  setUserSearch: (user) => set({ user_search: user }),
}));

export const useSelectFilterStore = create<ISelectStoreProps>((set) => ({
  chat_status: selectDefaultValues.chat_status,
  tag_labels: selectDefaultValues.tag_labels,
  assignee: selectDefaultValues.assignee,
  sort_order: selectDefaultValues.sort_order,
  setFilter: (key, value) => set((state) => ({ ...state, [key]: value })),
}));
