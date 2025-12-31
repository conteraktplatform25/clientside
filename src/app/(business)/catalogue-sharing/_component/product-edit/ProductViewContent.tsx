import { TProductResponse } from '@/lib/hooks/business/catalogue-sharing.hook';
import { getCurrencySymbol } from '@/lib/helpers/string-manipulator.helper';
import { CurrencyType } from '@prisma/client';
import { StatusBadgeField } from '@/components/custom/StatusBadgeField';
import { StockBadgeField } from '@/components/custom/StockBadgeField';

type InfoValue = string | number;
interface InfoProps {
  label: string;
  value: InfoValue;
}

export default function ProductViewContent({ product }: { product: TProductResponse }) {
  return (
    <div className='grid grid-cols-2 gap-4 text-sm'>
      <Info label='Name' value={product.name} />
      <div>
        <label className='text-xs text-muted-foreground'>Status</label>
        <div className='mt-1'>
          <StatusBadgeField status={product.status} />
        </div>
      </div>
      <Info label='Status' value={product.status} />
      <Info label='Price' value={`${getCurrencySymbol(product.currency as CurrencyType)} ${product.price}`} />
      <div>
        <label className='text-xs text-muted-foreground'>Items in Stock</label>
        <div className='mt-1'>
          <StockBadgeField stock={product.stock} />
        </div>
      </div>
      {/* <Info label='Stock' value={product.stock ?? 0} /> */}
      <Info label='SKU' value={product.sku ?? '-'} />
      <Info label='Category' value={product.category?.name ?? '-'} />

      <div className='col-span-2'>
        <label className='text-xs text-muted-foreground'>Description</label>
        <p className='mt-1'>{product.description || '—'}</p>
      </div>
    </div>
  );
}

const Info = ({ label, value }: InfoProps) => (
  <div>
    <label className='text-xs text-muted-foreground'>{label}</label>
    <p className='font-medium text-sm leading-[155%]'>{value}</p>
  </div>
);
