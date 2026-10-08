"use client";

import React, { useState, useEffect } from "react";
import { FiEye, FiX, FiPackage, FiUser, FiSearch, FiCalendar, FiTrash2, FiCheckSquare, FiSquare, FiCheck } from "react-icons/fi";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Search, Filter & Bulk Selection States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
  const [filterType, setFilterType] = useState("all"); // "all" | "today" | "custom"
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [bulkStatusTarget, setBulkStatusTarget] = useState("Processing");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Single Delete
  const handleDeleteOrder = async (orderId) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        setSelectedOrderIds((prev) => prev.filter((id) => id !== orderId));
        if (selectedOrder?._id === orderId) setSelectedOrder(null);
      } else {
        alert(data.error || "Failed to delete order.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("An error occurred while deleting the order.");
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedOrderIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedOrderIds.length} selected order(s)?`)) return;

    try {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedOrderIds }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => !selectedOrderIds.includes(o._id)));
        setSelectedOrderIds([]);
        setSelectedOrder(null);
      } else {
        alert(data.message || "Failed to delete selected orders.");
      }
    } catch (error) {
      console.error("Error bulk deleting orders:", error);
      alert("An error occurred during bulk deletion.");
    }
  };

  // Bulk Status Update
  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedOrderIds.length === 0) return;

    try {
      setUpdatingStatus(true);
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedOrderIds, orderStatus: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (selectedOrderIds.includes(o._id) ? { ...o, orderStatus: newStatus } : o))
        );
        setSelectedOrderIds([]);
      } else {
        alert(data.message || "Failed to update orders status.");
      }
    } catch (error) {
      console.error("Error bulk updating status:", error);
      alert("An error occurred during bulk status update.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Single Status Update from Modal
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const data = await res.json();
      
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
        setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
      } else {
        alert(data.error || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Selection Toggle Handlers
  const toggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o._id));
    }
  };

  const toggleSelectOrder = (id) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter and Search Logic
  const filteredOrders = orders.filter((order) => {
    // 1. Search Match
    const orderIdMatch = order._id.toLowerCase().includes(searchQuery.toLowerCase());
    const shortIdMatch = order._id.slice(-6).toLowerCase().includes(searchQuery.toLowerCase());
    const customerNameMatch = order.shippingInfo?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!orderIdMatch && !shortIdMatch && !customerNameMatch) return false;

    // 2. Status Filter Match
    if (statusFilter !== "all" && order.orderStatus !== statusFilter) {
      return false;
    }

    // 3. Date Filter Match
    const orderDate = new Date(order.createdAt).toDateString();
    const todayDate = new Date().toDateString();

    if (filterType === "today") {
      return orderDate === todayDate;
    }

    if (filterType === "custom" && selectedDate) {
      const formattedOrderDate = new Date(order.createdAt).toISOString().split("T")[0];
      return formattedOrderDate === selectedDate;
    }

    return true;
  });

  const statuses = ["all", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  return (
    <main className="min-h-screen bg-[#FAF7F3] text-[#514C48] p-6 sm:p-10 lg:p-12 font-sans pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif text-[#111]">Manage Orders</h1>
            <p className="text-sm text-[#514C48]/70 mt-1">View customer purchases, filter by status, and run bulk operations.</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="px-4 py-2 bg-white border border-[#E6DEC9] rounded-2xl text-xs uppercase tracking-widest font-semibold text-[#111] hover:bg-[#FAF7F3] transition shadow-2xs"
          >
            Refresh Orders
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 bg-white p-2.5 rounded-2xl border border-[#E6DEC9] shadow-2xs">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? "bg-[#111] text-white shadow-xs"
                  : "text-[#514C48]/70 hover:text-[#111] hover:bg-[#FAF7F3]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search and Date Toolbar */}
        <div className="bg-white p-5 rounded-3xl border border-[#E6DEC9] shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#514C48]/50" size={16} />
            <input
              type="text"
              placeholder="Search by Order ID or Customer Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl text-sm focus:outline-none focus:border-[#111]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => { setFilterType("all"); setSelectedDate(""); }}
              className={`px-4 py-2 rounded-2xl text-xs uppercase tracking-wider font-semibold transition ${
                filterType === "all" ? "bg-[#111] text-white" : "bg-[#FAF7F3] border border-[#E6DEC9] text-[#514C48] hover:bg-gray-100"
              }`}
            >
              All Dates
            </button>

            <button
              onClick={() => { setFilterType("today"); setSelectedDate(""); }}
              className={`px-4 py-2 rounded-2xl text-xs uppercase tracking-wider font-semibold transition ${
                filterType === "today" ? "bg-[#111] text-white" : "bg-[#FAF7F3] border border-[#E6DEC9] text-[#514C48] hover:bg-gray-100"
              }`}
            >
              Today
            </button>

            <div className="flex items-center gap-2 bg-[#FAF7F3] border border-[#E6DEC9] px-3 py-1.5 rounded-2xl">
              <FiCalendar size={14} className="text-[#514C48]/60" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setFilterType("custom");
                }}
                className="bg-transparent text-xs text-[#111] focus:outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Orders Table / List */}
        {loading ? (
          <div className="text-center py-20 text-sm">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#E6DEC9] text-center space-y-3 shadow-2xs">
            <FiPackage size={40} className="mx-auto text-[#514C48]/40" />
            <p className="font-serif text-lg text-[#111]">No matching orders found</p>
            <p className="text-xs text-[#514C48]/75">Try adjusting your filters, search query, or status tabs.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E6DEC9] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E6DEC9] bg-[#FAF7F3]/50 text-xs uppercase tracking-widest text-[#514C48]/70">
                    <th className="p-4 sm:px-6 w-10">
                      <button onClick={toggleSelectAll} className="flex items-center text-[#514C48] hover:text-[#111]">
                        {filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length ? (
                          <FiCheckSquare size={16} className="text-[#111]" />
                        ) : (
                          <FiSquare size={16} />
                        )}
                      </button>
                    </th>
                    <th className="p-4 sm:px-6">Order ID</th>
                    <th className="p-4 sm:px-6">Customer</th>
                    <th className="p-4 sm:px-6">Date & Time</th>
                    <th className="p-4 sm:px-6">Total</th>
                    <th className="p-4 sm:px-6">Status</th>
                    <th className="p-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6DEC9]/60 text-sm">
                  {filteredOrders.map((order) => {
                    const isSelected = selectedOrderIds.includes(order._id);
                    const formattedDate = order.createdAt 
                      ? new Date(order.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A";

                    return (
                      <tr key={order._id} className={`hover:bg-[#FAF7F3]/40 transition ${isSelected ? "bg-[#FAF7F3]/60" : ""}`}>
                        <td className="p-4 sm:px-6">
                          <button onClick={() => toggleSelectOrder(order._id)} className="flex items-center text-[#514C48] hover:text-[#111]">
                            {isSelected ? <FiCheckSquare size={16} className="text-[#111]" /> : <FiSquare size={16} />}
                          </button>
                        </td>
                        <td className="p-4 sm:px-6 font-mono text-xs text-[#514C48]/80">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="p-4 sm:px-6 font-medium text-[#111]">
                          {order.shippingInfo?.fullName}
                        </td>
                        <td className="p-4 sm:px-6 text-xs text-[#514C48]/80">
                          {formattedDate}
                        </td>
                        <td className="p-4 sm:px-6 font-serif font-semibold text-[#111]">
                          PKR {order.totalAmount?.toLocaleString()}
                        </td>
                        <td className="p-4 sm:px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.orderStatus === "Pending" ? "bg-amber-100 text-amber-800" :
                            order.orderStatus === "Processing" ? "bg-blue-100 text-blue-800" :
                            order.orderStatus === "Shipped" ? "bg-purple-100 text-purple-800" :
                            order.orderStatus === "Delivered" ? "bg-emerald-100 text-emerald-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="p-4 sm:px-6 text-right space-x-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#111] text-white rounded-xl text-xs font-semibold hover:bg-[#8D4D5D] transition shadow-2xs"
                          >
                            <FiEye size={13} /> Details
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold hover:bg-red-100 transition"
                            title="Delete Order"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bulk Actions Toolbar */}
      {selectedOrderIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#111] text-white px-6 py-3.5 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/10 animate-fade-in">
          <span className="text-xs font-medium tracking-wide">
            {selectedOrderIds.length} order{selectedOrderIds.length > 1 ? "s" : ""} selected
          </span>
          <div className="h-4 w-px bg-white/20" />
          
          <div className="flex items-center gap-2">
            <select
              value={bulkStatusTarget}
              onChange={(e) => setBulkStatusTarget(e.target.value)}
              className="bg-[#2A2A2A] text-white text-xs px-3 py-2 rounded-xl border border-white/20 focus:outline-none"
            >
              {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
            <button
              disabled={updatingStatus}
              onClick={() => handleBulkStatusUpdate(bulkStatusTarget)}
              className="px-3.5 py-2 bg-[#8D4D5D] hover:bg-[#743A4B] text-white rounded-xl text-xs font-semibold transition shadow-xs"
            >
              {updatingStatus ? "Updating..." : "Update Status"}
            </button>
          </div>

          <div className="h-4 w-px bg-white/20" />
          
          <button
            disabled={updatingStatus}
            onClick={handleBulkDelete}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition shadow-xs flex items-center gap-1.5"
          >
            <FiTrash2 size={13} /> Delete Selected
          </button>
        </div>
      )}

      {/* Order Details Popup Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
          <div className="bg-[#FAF7F3] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-[#E6DEC9]">
            
            <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-[#E6DEC9] shrink-0">
              <div>
                <h2 className="font-serif text-lg text-[#111]">Order Details</h2>
                <p className="text-xs text-[#514C48]/70 font-mono">ID: {selectedOrder._id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-[#514C48] hover:text-[#111] rounded-full hover:bg-[#FAF7F3] transition"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Order Status Management Box */}
              <div className="bg-white p-5 rounded-2xl border border-[#E6DEC9] space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-widest text-[#514C48]/70 font-semibold">
                    Update Order Status
                  </h3>
                  {updatingStatus && <span className="text-xs text-[#8D4D5D] font-medium animate-pulse">Updating...</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
                    <button
                      key={status}
                      disabled={updatingStatus}
                      onClick={() => handleStatusChange(selectedOrder._id, status)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        selectedOrder.orderStatus === status
                          ? "bg-[#111] text-white shadow-sm"
                          : "bg-[#FAF7F3] border border-[#E6DEC9] text-[#514C48] hover:bg-gray-100"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Shipping Info */}
              <div className="bg-white p-5 rounded-2xl border border-[#E6DEC9] space-y-3 shadow-2xs">
                <h3 className="text-xs uppercase tracking-widest text-[#514C48]/70 font-semibold flex items-center gap-2">
                  <FiUser size={14} /> Customer Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-[#514C48]/60 text-xs block">Full Name</span>
                    <span className="font-medium text-[#111]">{selectedOrder.shippingInfo?.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[#514C48]/60 text-xs block">Phone Number</span>
                    <span className="font-medium text-[#111]">{selectedOrder.shippingInfo?.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#514C48]/60 text-xs block">Email Address</span>
                    <span className="font-medium text-[#111]">{selectedOrder.shippingInfo?.email || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[#514C48]/60 text-xs block">City</span>
                    <span className="font-medium text-[#111]">{selectedOrder.shippingInfo?.city}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#514C48]/60 text-xs block">Delivery Address</span>
                    <span className="font-medium text-[#111]">{selectedOrder.shippingInfo?.address}</span>
                  </div>
                </div>
              </div>

              {/* Ordered Items List */}
              <div className="bg-white p-5 rounded-2xl border border-[#E6DEC9] space-y-3 shadow-2xs">
                <h3 className="text-xs uppercase tracking-widest text-[#514C48]/70 font-semibold flex items-center gap-2">
                  <FiPackage size={14} /> Ordered Items ({selectedOrder.orderItems?.length || 0})
                </h3>
                <div className="divide-y divide-[#E6DEC9]/60">
                  {selectedOrder.orderItems?.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#FAF7F3] border border-[#E6DEC9] shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-[10px] text-[#514C48]/40">No img</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-medium text-sm text-[#111] truncate">{item.name}</h4>
                        <p className="text-xs text-[#514C48]/70">Variant: {item.selectedOption} | Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-serif font-semibold text-sm text-[#111]">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-[11px] text-[#514C48]/60">PKR {item.price?.toLocaleString()} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="bg-white p-5 rounded-2xl border border-[#E6DEC9] space-y-2 shadow-2xs text-sm">
                <div className="flex justify-between">
                  <span className="text-[#514C48]/70">Payment Method</span>
                  <span className="font-semibold text-[#111]">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#E6DEC9] text-base">
                  <span className="font-serif font-medium text-[#111]">Total Amount</span>
                  <span className="font-serif font-bold text-[#111]">PKR {selectedOrder.totalAmount?.toLocaleString()}</span>
                </div>
              </div>

            </div>

            <div className="px-6 py-4 bg-white border-t border-[#E6DEC9] flex justify-between items-center shrink-0">
              <button
                onClick={() => handleDeleteOrder(selectedOrder._id)}
                className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold hover:bg-red-100 transition"
              >
                Delete Order
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-[#111] text-white rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-[#8D4D5D] transition shadow-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}