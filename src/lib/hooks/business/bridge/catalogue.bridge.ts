import { useCategoryCatalogueStore } from '@/lib/store/business/catalogue-sharing.store';
import { useGetCategories } from '../catalogue-sharing.hook';
import { useEffect } from 'react';

export const useSyncCategories = () => {
  const { data, isSuccess } = useGetCategories();
  const { setAllCategories, setCategoriesDropDown } = useCategoryCatalogueStore();

  useEffect(() => {
    if (isSuccess && data.categories) {
      setAllCategories(data.categories);

      setCategoriesDropDown(
        data.categories.map((c) => ({
          label: c.name,
          value: c.id,
        }))
      );
    }
  }, [isSuccess, data, setAllCategories, setCategoriesDropDown]);
};
