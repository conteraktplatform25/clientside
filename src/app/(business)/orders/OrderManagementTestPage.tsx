'use client';

//import React, { useState, useMemo, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import OrderSummaryCard from './_component/OrderSummaryCard';
//import { OrderStatus } from '@/type/client/business/order.type';
import { OrderStatus } from '@prisma/client';
//import { OrdersTable } from './_component/table/OrdersTable';
import StatusFilter from './_component/StatusFilter';
import DateFilter from '@/components/custom/DateFilter';
import PaginationControls from '@/components/custom/PaginationControls';
import { Label } from '@/components/ui/label';
//import OrderDetailsDialog from './OrderDetailsDialog';
import { usePageTitleStore } from '@/lib/store/defaults/usePageTitleStore';
import { TOrderQueryRequest, useGetProductOrders } from '@/lib/hooks/business/order-product.hook';

const OrderManagementTestPage = () => {
  const { setTitle } = usePageTitleStore();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All orders' | OrderStatus>('All orders');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  console.log(isDetailsDialogOpen, selectedOrderDetails);

  const requestBody: TOrderQueryRequest = {
    page: currentPage,
    limit: rowsPerPage,
    status: selectedStatusFilter !== 'All orders' ? selectedStatusFilter : undefined,
    startDate: selectedDate?.toISOString().split('T')[0],
    endDate: selectedDate?.toISOString().split('T')[0],
    sortBy: 'created_at',
    sortOrder: 'desc',
  };

  const { data, isLoading, isError } = useGetProductOrders(requestBody);

  useEffect(() => {
    setTitle('Orders');
  }, [setTitle]);

  const orders = data?.orders ?? [];
  const totalOrders = data?.summary.totalOrders ?? 0;
  const totalRevenue = data?.summary.totalRevenue ?? 0;
  const totalPages = data?.pagination.totalPages ?? 1;

  console.log(orders, isLoading, isError);

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

  // const handleViewDetails = (order: any) => {
  //   setSelectedOrderDetails(order);
  //   setIsDetailsDialogOpen(true);
  // };

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
            <Label className='font-medium text-base leading-[150%] text-neutral-800'>Status:</Label>
            <StatusFilter selectedStatus={selectedStatusFilter} onStatusChange={setSelectedStatusFilter} />
          </div>

          <DateFilter selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </div>
      </div>

      <div className='flex flex-col md:flex-row items-start md:justify-between gap-8 mb-6 w-full'>
        <OrderSummaryCard title='Total orders' value={totalOrders} icon='orders' />
        <OrderSummaryCard title='Total revenue' value={`₦${totalRevenue.toLocaleString('en-NG')}`} icon='revenue' />
      </div>

      {/* Orders Table */}
      {/* <OrdersTable
        data={orders}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        onViewDetails={handleViewDetails}
        loading={isLoading}
      /> */}

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
