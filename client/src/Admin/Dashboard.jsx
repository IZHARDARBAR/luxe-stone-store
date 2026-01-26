import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import {
  LogOut,
  Plus,
  Package,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Settings,
  DollarSign,
  ShoppingCart,
  Clock,
  MessageSquare,
  Users,
  Printer,
} from "lucide-react";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("isAdmin")) {
      navigate("/admin");
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    let { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setOrders(data);
      calculateStats(data);
    }
  };

  const calculateStats = (data) => {
    const sales = data.reduce(
      (acc, order) => acc + (order.total_amount || 0),
      0,
    );
    const pending = data.filter((o) => o.status === "Pending").length;
    setStats({
      totalSales: sales,
      totalOrders: data.length,
      pendingOrders: pending,
    });
  };

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);
    if (!error) {
      alert("Status Updated!");
      fetchOrders();
    }
  };

  const deleteOrder = async (id) => {
    if (confirm("Delete this order?")) {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (!error) {
        const newOrders = orders.filter((o) => o.id !== id);
        setOrders(newOrders);
        calculateStats(newOrders);
      }
    }
  };

  // --- PRINT INVOICE LOGIC ---
  const printInvoice = (order) => {
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write("<html><head><title>Invoice</title>");
    printWindow.document.write(
      '</head><body style="font-family: sans-serif; padding: 20px;">',
    );
    printWindow.document.write(
      `<h1 style="color: #84a93e;">Luxe Stone - Invoice</h1>`,
    );
    printWindow.document.write(
      `<p><strong>Order ID:</strong> #${order.id}</p>`,
    );
    printWindow.document.write(
      `<p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>`,
    );
    printWindow.document.write(`<hr/>`);
    printWindow.document.write(
      `<p><strong>Customer:</strong> ${order.customer_name}</p>`,
    );
    printWindow.document.write(`<p><strong>Phone:</strong> ${order.phone}</p>`);
    printWindow.document.write(
      `<p><strong>Address:</strong> ${order.address}</p>`,
    );
    printWindow.document.write(`<hr/><h3>Items:</h3><ul>`);
    order.cart_items.forEach((item) => {
      printWindow.document.write(
        `<li>${item.name} (x${item.quantity}) - Rs. ${item.price}</li>`,
      );
    });
    printWindow.document.write(`</ul><hr/>`);
    printWindow.document.write(
      `<h3>Total Amount: Rs. ${order.total_amount}</h3>`,
    );
    printWindow.document.write(
      `<p>Payment Method: ${order.payment_method}</p>`,
    );
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 pt-5 text-white transition-all duration-300 z-50 shadow-2xl ${isSidebarOpen ? "w-64" : "w-0"} overflow-y-auto`}
        style={{ overflowX: "hidden" }}
      >
        <div className="w-64 p-6">
          <h2 className="text-2xl font-serif font-bold mb-10 whitespace-nowrap">
            Luxe Admin
          </h2>
          <nav className="space-y-4">
            <button className="flex items-center gap-3 text-[#84a93e] font-bold w-full p-2 rounded hover:bg-gray-800 transition">
              <Package size={20} /> Orders
            </button>
            <Link
              to="/admin/add-product"
              className="flex items-center gap-3 text-gray-400 hover:text-white w-full p-2 rounded hover:bg-gray-800 transition"
            >
              <Plus size={20} /> Add Product
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center gap-3 text-gray-400 hover:text-white w-full p-2 rounded hover:bg-gray-800 transition"
            >
              <Settings size={20} /> Manage Inventory
            </Link>
            <Link
              to="/admin/reviews"
              className="flex items-center gap-3 text-gray-400 hover:text-white w-full p-2 rounded hover:bg-gray-800 transition"
            >
              <MessageSquare size={20} /> Manage Reviews
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center gap-3 text-gray-400 hover:text-white w-full p-2 rounded hover:bg-gray-800 transition"
            >
              <Users size={20} /> Registered Users
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-gray-400 hover:text-red-500 mt-10 w-full p-2 rounded hover:bg-gray-800 transition"
            >
              <LogOut size={20} /> Logout
            </button>
          </nav>
        </div>
      </div>

      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-1/2 z-50 w-8 h-8 flex items-center justify-center bg-white text-gray-800 rounded-full shadow-lg border border-gray-200 transition-all duration-300 hover:scale-110 ${isSidebarOpen ? "left-60" : "left-4"}`}
        style={{ transform: "translateY(-50%)" }}
      >
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* MAIN CONTENT */}
      <div
        className={`p-10 w-full transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}
        style={{ width: isSidebarOpen ? "calc(100% - 16rem)" : "100%" }}
      >
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#84a93e] flex justify-between">
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase">
                Total Sales
              </p>
              <h3 className="text-2xl font-bold">
                Rs. {stats.totalSales.toLocaleString()}
              </h3>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <DollarSign size={28} className="text-[#84a93e]" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 flex justify-between">
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase">
                Total Orders
              </p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              <ShoppingCart size={28} className="text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500 flex justify-between">
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase">
                Pending
              </p>
              <h3 className="text-2xl font-bold">{stats.pendingOrders}</h3>
            </div>
            <div className="bg-yellow-50 p-3 rounded-full">
              <Clock size={28} className="text-yellow-500" />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6 text-gray-700">Recent Orders</h2>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b text-gray-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-500">#{order.id}</td>
                    <td className="p-4">
                      <p className="font-bold">{order.customer_name}</p>
                      <p className="text-xs text-gray-500">{order.phone}</p>
                    </td>
                    <td className="p-4 text-gray-600">
                      {order.cart_items?.map((item, idx) => (
                        <div key={idx}>
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="p-4 font-bold">Rs. {order.total_amount}</td>
                    <td className="p-4">
                      <div className="font-bold uppercase text-xs text-gray-500">
                        {order.payment_method || "COD"}
                      </div>
                      {order.transaction_id && (
                        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                          Trx: {order.transaction_id}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${order.status === "Pending" ? "bg-yellow-100 text-yellow-700" : order.status === "Shipped" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="p-4 flex items-center gap-2">
                      {/* PRINT BUTTON */}
                      <button
                        onClick={() => printInvoice(order)}
                        className="bg-gray-100 p-1.5 rounded hover:bg-gray-200 text-gray-600"
                        title="Print Invoice"
                      >
                        <Printer size={16} />
                      </button>

                      <select
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="border rounded px-2 py-1 text-xs"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Update
                        </option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="bg-red-50 text-red-600 p-1.5 rounded hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
