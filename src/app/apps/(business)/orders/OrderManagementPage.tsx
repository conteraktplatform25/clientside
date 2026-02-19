'use client';

import React, { useState, useMemo, useEffect } from 'react';
import OrderSummaryCard from './_component/OrderSummaryCard';
import { IOrderProps, OrderStatus } from '@/type/client/business/order.type';
import { OrdersTable } from './_component/table/OrdersTable';
//import StatusFilter from './_component/StatusFilter';
import DateFilter from '@/components/custom/DateFilter';
import PaginationControls from '@/components/custom/PaginationControls';
import { ConstMockOrder as mocks } from '@/lib/constants/orders.constant';
import { showSuccess } from '@/utils/toast';
import { Label } from '@/components/ui/label';
import OrderDetailsDialog from './OrderDetailsDialog';
import { usePageTitleStore } from '@/lib/store/defaults/usePageTitleStore';
//import StatusFilter from './_component/StatusFilter';

const OrderManagementPage: React.FC = () => {
  const { setTitle } = usePageTitleStore();
  const [orders, setOrders] = useState<IOrderProps[]>(mocks);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All orders' | OrderStatus>('All orders');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); // Changed from new Date() to undefined
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for Order Details Dialog
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<IOrderProps | null>(null);

  useEffect(() => {
    setSelectedStatusFilter('All orders');
    setTitle('Orders');
  }, [setTitle, setSelectedStatusFilter]);

  const filteredOrders = useMemo(() => {
    let tempOrders = orders;

    if (selectedStatusFilter !== 'All orders') {
      tempOrders = tempOrders.filter((order) => order.status === selectedStatusFilter);
    }

    if (selectedDate) {
      const formattedSelectedDate = selectedDate.toLocaleDateString();
      tempOrders = tempOrders.filter(
        (order) => new Date(order.dateTime).toLocaleDateString() === formattedSelectedDate
      );
    }

    return tempOrders;
  }, [orders, selectedStatusFilter, selectedDate]);

  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.amount, 0);

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, rowsPerPage]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
    // Also update the status in the dialog if it's open for this order
    if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
      setSelectedOrderDetails((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showSuccess(`Order ${orderId} status updated to ${newStatus}`);
  };

  const handleViewDetails = (order: IOrderProps) => {
    setSelectedOrderDetails(order);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedOrderDetails(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  return (
    <div className='w-full p-4'>
      <div className='flex items-start justify-between gap-2 mb-6 w-full'>
        <h1 className='text-xl leading-[150%] text-neutral-700 font-semibold'>Order management</h1>
        {/* Filters */}
        <div className='flex flex-col md:flex-row justify-end gap-8'>
          <div className='inline-flex space-x-2'>
            <Label className='font-medium text-base leading-[150%] text-neutral-800'>Status:</Label>
            {/* <StatusFilter selectedStatus={selectedStatusFilter} onStatusChange={setSelectedStatusFilter} /> */}
          </div>
          <DateFilter selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </div>
      </div>
      {/* Summary Cards */}
      <div className='flex flex-col md:flex-row items-start md:justify-between gap-8 mb-6 w-full'>
        <OrderSummaryCard title='Total orders' value={totalOrders} icon='orders' />
        <OrderSummaryCard title='Total revenue' value={`₦${totalRevenue.toLocaleString('en-NG')}`} icon='revenue' />
      </div>

      {/* Orders Table */}
      <OrdersTable
        data={paginatedOrders}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        onStatusChange={handleStatusChange}
        onViewDetails={handleViewDetails}
      />

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        order={selectedOrderDetails}
        isOpen={isDetailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default OrderManagementPage;
