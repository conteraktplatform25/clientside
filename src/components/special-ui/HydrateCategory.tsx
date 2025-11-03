'use client';

import { useEffect } from 'react';
import { useGetDetailCategories } from '@/lib/hooks/business/catalogue-sharing.hook';
import { useCategoryCatalogueStore } from '@/lib/store/business/catalogue-sharing.store';

/**
 * Hydrates Zustand categories store once after categories are fetched.
 * Works only in a Client Component.
 */
export const useHydrateCategories = () => {
  const { data, isSuccess } = useGetDetailCategories();

  const allCategories = useCategoryCatalogueStore((state) => state.allCategories);
  const setAllCategories = useCategoryCatalogueStore((state) => state.setAllCategories);

  useEffect(() => {
    if (isSuccess && data?.categories && allCategories.length === 0) {
      setAllCategories(data.categories);
    }
    // ✅ intentionally NOT depending on allCategories to avoid re-triggers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, data, setAllCategories]);
};
