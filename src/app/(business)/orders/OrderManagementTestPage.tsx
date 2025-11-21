'use client';

import React, { useState, useEffect } from 'react';
import OrderSummaryCard from './_component/OrderSummaryCard';
//import { OrderStatus } from '@/type/client/business/order.type';
import { OrderStatus } from '@prisma/client';
//import { OrdersTable } from './_component/table/OrdersTable';
import StatusFilter from './_component/StatusFilter';
//import DateFilter from '@/components/custom/DateFilter';
import PaginationControls from '@/components/custom/PaginationControls';
import { usePageTitleStore } from '@/lib/store/defaults/usePageTitleStore';
import { TOrderQueryRequest, TOrderResponse, useGetProductOrders } from '@/lib/hooks/business/order-product.hook';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderTestTable } from './_component/table/OrderTestTable';
import { DateRangePickerPremium } from '@/components/custom/DateRangePickerPremium';
import UILoaderIndicator from '@/components/custom/UILoaderIndicator';

const OrderManagementTestPage = () => {
  const { setTitle } = usePageTitleStore();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All orders' | OrderStatus>('All orders');
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<TOrderResponse | null>(null);

  console.log(isDetailsDialogOpen, selectedOrderDetails);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setTitle('Orders');
  }, [setTitle]);

  const requestBody: TOrderQueryRequest = {
    page: currentPage,
    limit: rowsPerPage,
    search: debouncedSearch || undefined,
    status: selectedStatusFilter !== 'All orders' ? selectedStatusFilter : undefined,
    startDate: dateRange?.from,
    endDate: dateRange?.to,
    sortBy: 'created_at',
    sortOrder: 'desc',
  };

  //const { data, isLoading, isError } = useGetProductOrders(requestBody);
  const { data, isLoading } = useGetProductOrders(requestBody);

  const orders = data?.orders ?? [];
  const totalOrders = data?.summary.totalOrders ?? 0;
  const totalRevenue = data?.summary.totalRevenue ?? 0;
  const totalPages = data?.pagination.totalPages ?? 1;

  // const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
  //   console.log(orderId);
  //   // setOrders((prevOrders) =>
  //   //   prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
  //   // );
  //   // // Also update the status in the dialog if it's open for this order
  //   // if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
  //   //   setSelectedOrderDetails((prev) => (prev ? { ...prev, status: newStatus } : null));
  //   // }
  //   // showSuccess(`Order ${orderId} status updated to ${newStatus}`);
  // };

  const handleViewDetails = (order: TOrderResponse) => {
    setSelectedOrderDetails(order);
    setIsDetailsDialogOpen(true);
  };

  // const handleCloseDetailsDialog = () => {
  //   setIsDetailsDialogOpen(false);
  //   setSelectedOrderDetails(null);
  // };

  return (
    <div className='w-full p-4'>
      <div className='flex items-start justify-between gap-2 mb-6 w-full'>
        <h1 className='text-xl leading-[150%] text-neutral-700 font-semibold'>Order management</h1>

        <div className='flex flex-col md:flex-row justify-end gap-8'>
          <div className='inline-flex space-x-2'>
            <StatusFilter selectedStatus={selectedStatusFilter} onStatusChange={setSelectedStatusFilter} />
          </div>

          {/* Date Range Filter */}
          <div>
            <DateRangePickerPremium value={dateRange} onChange={setDateRange} />
          </div>
          <input
            placeholder='Search by name or OrderID'
            className='border px-3 py-2 rounded-md w-[200px] text-sm'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className='flex flex-col md:flex-row items-start md:justify-between gap-8 mb-6 w-full'>
        {isLoading ? (
          <>
            <Skeleton className='h-[90px] w-full rounded-xl' />
            <Skeleton className='h-[90px] w-full rounded-xl' />
          </>
        ) : (
          <>
            <OrderSummaryCard title='Total orders' value={totalOrders} icon='orders' />
            <OrderSummaryCard title='Total revenue' value={`₦${totalRevenue.toLocaleString('en-NG')}`} icon='revenue' />
          </>
        )}
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className='space-y-3 mb-6'>
          <UILoaderIndicator label='Fetching your Order list content...' />
          {/* {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-[50px] w-full rounded-md' />
          ))} */}
        </div>
      ) : (
        <OrderTestTable
          data={orders}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          onViewDetails={handleViewDetails}
          loading={isLoading}
        />
      )}

      {/* Pagination */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={setRowsPerPage}
      />

      {/* <OrderDetailsDialog
        order={selectedOrderDetails}
        isOpen={isDetailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        onStatusChange={handleStatusChange}
      /> */}
    </div>
  );
};

export default OrderManagementTestPage;
