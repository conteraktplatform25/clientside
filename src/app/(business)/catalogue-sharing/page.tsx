'use client';

import React, { useEffect } from 'react';
import ProductCatalogueGalleryTest from './_component/ProductCatalogueGalleryTest';
import { usePageTitleStore } from '@/lib/store/defaults/usePageTitleStore';

const ProductCataloguPage = () => {
  const { setTitle } = usePageTitleStore();

  useEffect(() => {
    setTitle('Catalogue Sharing');
  }, [setTitle]);
  return <ProductCatalogueGalleryTest />;
};

export default ProductCataloguPage;
