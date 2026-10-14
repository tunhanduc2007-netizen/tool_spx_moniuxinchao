import React, { useState, useEffect } from "react";
import { 
  WelcomeScreen, LoginScreen, DashboardScreen, OrdersScreen,
  OrderDetailScreen, BatchPrintScreen, PrintingProgressScreen,
  WarehouseScreen, ProductsScreen, CustomersScreen, RankingsScreen,
  ReportsScreen, StaffScreen, ShopeeApiScreen, SettingsScreen 
} from "./components/screens";
import { ThermalLabelModal } from "./components/ThermalLabelModal";
import { authAPI } from "./api";
import { CheckCircle2, AlertCircle } from "lucide-react";

const SCREENS = [
  { id: "dashboard", title: "Tổng Quan (Dashboard)", component: DashboardScreen },
  { id: "orders", title: "Quản Lý Đơn Hàng", component: OrdersScreen },
  { id: "order-detail", title: "Chi Tiết Đơn Hàng", component: OrderDetailScreen },
  { id: "batch-print", title: "In Hàng Loạt", component: BatchPrintScreen },
  { id: "printing-progress", title: "Tiến Trình In Hàng Loạt", component: PrintingProgressScreen },
  { id: "warehouse", title: "Quản Lý Kho Hàng", component: WarehouseScreen },
  { id: "products", title: "Sản Phẩm & SKU", component: ProductsScreen },
  { id: "customers", title: "Khách Hàng (CRM)", component: CustomersScreen },
  { id: "rankings", title: "Xếp Hạng Khách Hàng", component: RankingsScreen },
  { id: "reports", title: "Báo Cáo & Thống Kê", component: ReportsScreen },
  { id: "staff", title: "Nhân Viên & Phân Quyền", component: StaffScreen },
  { id: "shopee-api", title: "Kết Nối Shopee API", component: ShopeeApiScreen },
  { id: "settings", title: "Cài Đặt Hệ Thống", component: SettingsScreen },
  { id: "login", title: "Đăng Nhập", component: LoginScreen },
  { id: "welcome", title: "Màn Hình Chào Mừng", component: WelcomeScreen },
];

/**
 * Determine screen from bookmark hash or URL path
 */
function getInitialScreen() {
  const hash = window.location.hash.replace("#/", "").replace("#", "").trim();
  if (hash && SCREENS.some(s => s.id === hash)) {
    return hash;
  }
  const path = window.location.pathname.replace(/^\//, "").trim();
  if (path && SCREENS.some(s => s.id === path)) {
    return path;
  }
  return "dashboard";
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(getInitialScreen);
  const [activeUser, setActiveUser] = useState({
    username: "admin",
    full_name: "Quản Trị Viên (Admin)",
    email: "tunhanduc2007@gmail.com",
    role: "ADMIN"
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderSns, setSelectedOrderSns] = useState(["261014SPX001VN", "261014SPX002VN", "261014SPX003VN"]);
  const [thermalModalData, setThermalModalData] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(1);
  const [toast, setToast] = useState(null);

  // Auto authenticate and ensure user session
  useEffect(() => {
    authAPI.ensureAuth().then((u) => {
      if (u) setActiveUser(u);
    }).catch(() => {});
  }, []);

  // Listen to browser bookmarks, back/forward buttons, hash changes
  useEffect(() => {
    const handleUrlChange = () => {
      const s = getInitialScreen();
      setCurrentScreen(s);
    };

    window.addEventListener("hashchange", handleUrlChange);
    window.addEventListener("popstate", handleUrlChange);
    return () => {
      window.removeEventListener("hashchange", handleUrlChange);
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);

  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const handleNavigate = (screenId, payload = null) => {
    if (payload) {
      if (payload.order) setSelectedOrder(payload.order);
      if (payload.orderSns) setSelectedOrderSns(payload.orderSns);
      if (payload.labelData) setThermalModalData(payload.labelData);
    }
    setCurrentScreen(screenId);
    window.location.hash = `#/${screenId}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const CurrentComponent = SCREENS.find(s => s.id === currentScreen)?.component || DashboardScreen;

  const screenProps = {
    activeUser,
    setActiveUser,
    selectedOrder,
    onSelectOrder: (order) => setSelectedOrder(order),
    selectedOrderSns,
    onSelectOrderSns: (sns) => setSelectedOrderSns(sns),
    onOpenPrintModal: (labelData) => setThermalModalData(labelData),
    refreshTrigger,
    onDataChanged: () => setRefreshTrigger(prev => prev + 1),
    onToast: triggerToast,
    onNavigate: handleNavigate,
  };

  return (
    <div className="mobile-full-app">
      {/* Toast Notification Alert */}
      {toast && (
        <div style={{
          position: "fixed",
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2000,
          backgroundColor: toast.type === "error" ? "#EF4444" : "#10B981",
          color: "#FFFFFF",
          padding: "10px 18px",
          borderRadius: "12px",
          fontSize: "13px",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.25)",
          animation: "fadeIn 0.2s ease",
          maxWidth: "92%",
          width: "max-content"
        }}>
          {toast.type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Printable Thermal Label Modal */}
      {thermalModalData && (
        <ThermalLabelModal 
          labelData={thermalModalData} 
          onClose={() => setThermalModalData(null)} 
        />
      )}

      {/* The Pure Full Mobile Screen Component */}
      <CurrentComponent {...screenProps} />
    </div>
  );
}
