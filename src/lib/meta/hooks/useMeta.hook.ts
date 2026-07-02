import { useContext } from 'react';
import { MetaContext } from '../context/meta.context';

export const useMeta = () => {
  const context = useContext(MetaContext);
  if (!context) throw new Error('MetaProvider missing.');

  return context;
};
