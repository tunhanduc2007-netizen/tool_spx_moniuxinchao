import React, { useState, useEffect } from "react";
import { 
  WelcomeScreen, LoginScreen, DashboardScreen, OrdersScreen,
  OrderDetailScreen, BatchPrintScreen, PrintingProgressScreen,
  WarehouseScreen, ProductsScreen, CustomersScreen, RankingsScreen,
  ReportsScreen, StaffScreen, ShopeeApiScreen, SettingsScreen 
} from "./components/screens";
import { ThermalLabelModal } from "./components/ThermalLabelModal";
import { authAPI, getToken } from "./api";
import { CheckCircle2, AlertCircle, Sun, Moon, Sparkles } from "lucide-react";
import { playChime } from "./utils/bluetoothPrinter";

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
  { id: "more", title: "Cài Đặt Hệ Thống", component: SettingsScreen },
  { id: "login", title: "Đăng Nhập", component: LoginScreen },
  { id: "welcome", title: "Màn Hình Chào Mừng", component: WelcomeScreen },
];

/**
 * Determine screen from bookmark hash or URL path
 */
function getInitialScreen() {
  const hash = window.location.hash.replace("#/", "").replace("#", "").trim();
  if (hash === "more" || hash === "settings") return "settings";
  if (hash && SCREENS.some(s => s.id === hash)) {
    return hash;
  }
  const path = window.location.pathname.replace(/^\//, "").trim();
  if (path === "more" || path === "settings") return "settings";
  if (path && SCREENS.some(s => s.id === path)) {
    return path;
  }
  return getToken() ? "dashboard" : "login";
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(getInitialScreen);
  const [activeUser, setActiveUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderSns, setSelectedOrderSns] = useState([]);
  const [thermalModalData, setThermalModalData] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(1);
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("spx_theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("spx_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    playChime("success");
    triggerToast(next === "dark" ? "🌙 Đã kích hoạt VIP Obsidian Dark Mode!" : "☀️ Đã chuyển sang Giao diện Sáng Sang Chảnh!");
  };

  // Auto authenticate and ensure user session
  useEffect(() => {
    // 1. Check if returning from Shopee OAuth redirect with code & shop_id
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.includes("?") ? window.location.hash.split("?")[1] : "");
    const code = urlParams.get("code") || hashParams.get("code");
    const shopId = urlParams.get("shop_id") || hashParams.get("shop_id");

    if (code && shopId) {
      triggerToast("Đang xác thực tài khoản Shopee Seller & đồng bộ đơn hàng...", "info");
      authAPI.handleOAuthCallback(code, shopId).then((res) => {
        if (res && res.user) {
          setActiveUser(res.user);
          // Remove query params from address bar cleanly
          window.history.replaceState({}, document.title, window.location.pathname + "#/dashboard");
          handleNavigate("dashboard");
          triggerToast(`🎉 Đăng nhập Kênh Người Bán Shopee #${shopId} thành công! Đã đồng bộ 100% đơn hàng.`);
        }
      }).catch((err) => {
        triggerToast("Lỗi xác thực Shopee: " + err.message, "error");
      });
      return;
    }

    // 2. Normal session check (auto-enter Dashboard if session exists)
    authAPI.ensureAuth().then((u) => {
      if (u) {
        setActiveUser(u);
        const hash = window.location.hash.replace("#/", "").replace("#", "").trim();
        if (!hash || hash === "login" || hash === "welcome") {
          setCurrentScreen("dashboard");
        }
      } else {
        setActiveUser(null);
      }
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
    const targetScreen = screenId === "more" ? "settings" : screenId;
    setCurrentScreen(targetScreen);
    window.location.hash = `#/${targetScreen}`;
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
    theme,
    toggleTheme,
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

      {/* Floating VIP Theme Switcher Pill */}
      <button
        onClick={toggleTheme}
        style={{
          position: "fixed",
          bottom: "64px",
          right: "12px",
          zIndex: 9999,
          backgroundColor: theme === "dark" ? "rgba(17, 24, 39, 0.9)" : "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.16)" : "1px solid rgba(0, 0, 0, 0.12)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.22)",
          borderRadius: "99px",
          padding: "7px 12px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: theme === "dark" ? "#F8FAFC" : "#0F172A",
          fontSize: "11px",
          fontWeight: "800",
          cursor: "pointer",
          letterSpacing: "0.01em"
        }}
        title="Bật/Tắt chế độ VIP Obsidian Dark Mode"
      >
        {theme === "dark" ? (
          <>
            <Moon size={14} color="#FBBF24" />
            <span>VIP Obsidian</span>
          </>
        ) : (
          <>
            <Sun size={14} color="#F59E0B" />
            <span>VIP Light</span>
          </>
        )}
        <span style={{
          fontSize: "9px",
          color: "#FFFFFF",
          background: "linear-gradient(135deg, #EE4D2D 0%, #FF5722 100%)",
          padding: "1px 5px",
          borderRadius: "4px",
          fontWeight: "800"
        }}>
          PRO
        </span>
      </button>

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
