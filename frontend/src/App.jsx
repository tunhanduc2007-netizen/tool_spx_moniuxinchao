import React, { useState, useEffect } from "react";
import { 
  WelcomeScreen, LoginScreen, DashboardScreen, OrdersScreen,
  OrderDetailScreen, BatchPrintScreen, PrintingProgressScreen,
  WarehouseScreen, ProductsScreen, CustomersScreen, RankingsScreen,
  ReportsScreen, StaffScreen, ShopeeApiScreen, SettingsScreen 
} from "./components/screens";
import { ThermalLabelModal } from "./components/ThermalLabelModal";
import { authAPI } from "./api";
import { 
  Smartphone, ExternalLink, CheckCircle2, AlertCircle, 
  Menu, X, Layers, ChevronDown 
} from "lucide-react";

const SCREENS = [
  { id: "dashboard", title: "3. Tổng Quan (Dashboard)", component: DashboardScreen },
  { id: "orders", title: "4. Quản Lý Đơn Hàng", component: OrdersScreen },
  { id: "order-detail", title: "5. Chi Tiết Đơn Hàng", component: OrderDetailScreen },
  { id: "batch-print", title: "6. In Hàng Loạt", component: BatchPrintScreen },
  { id: "printing-progress", title: "7. Tiến Trình In Hàng Loạt", component: PrintingProgressScreen },
  { id: "warehouse", title: "8. Quản Lý Kho Hàng", component: WarehouseScreen },
  { id: "products", title: "9. Sản Phẩm & SKU", component: ProductsScreen },
  { id: "customers", title: "10. Khách Hàng (CRM)", component: CustomersScreen },
  { id: "rankings", title: "11. Xếp Hạng Khách Hàng", component: RankingsScreen },
  { id: "reports", title: "12. Báo Cáo & Thống Kê", component: ReportsScreen },
  { id: "staff", title: "13. Nhân Viên & Phân Quyền", component: StaffScreen },
  { id: "shopee-api", title: "14. Kết Nối Shopee API", component: ShopeeApiScreen },
  { id: "settings", title: "15. Cài Đặt Hệ Thống", component: SettingsScreen },
  { id: "login", title: "2. Đăng Nhập", component: LoginScreen },
  { id: "welcome", title: "1. Màn Hình Chào Mừng", component: WelcomeScreen },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("dashboard");
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
  const [showScreenDrawer, setShowScreenDrawer] = useState(false);

  // Auto ensure auth on initial load
  useEffect(() => {
    authAPI.ensureAuth().then((u) => {
      if (u) setActiveUser(u);
    }).catch(() => {});
  }, []);

  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleNavigate = (screenId, payload = null) => {
    if (payload) {
      if (payload.order) setSelectedOrder(payload.order);
      if (payload.orderSns) setSelectedOrderSns(payload.orderSns);
      if (payload.labelData) setThermalModalData(payload.labelData);
    }
    setCurrentScreen(screenId);
    setShowScreenDrawer(false);
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
    <>
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
          boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
          animation: "fadeIn 0.2s ease",
          maxWidth: "90%",
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

      {/* Desktop Quick Switcher Bar (Hidden automatically when in mobile / inspect mode) */}
      <div className="desktop-only-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "30px",
            height: "30px",
            background: "linear-gradient(135deg, #FF5722 0%, #EE4D2D 100%)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "800",
            fontSize: "12px",
            color: "#fff"
          }}>
            SP
          </div>
          <div>
            <span style={{ fontSize: "13px", fontWeight: "800", color: "#FFFFFF" }}>
              Shopee Seller Pro Mobile
            </span>
            <span style={{ fontSize: "11px", color: "#9CA3AF", marginLeft: "10px" }}>
              (F12 Inspect sẽ tự động full màn hình 100% giao diện điện thoại)
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <select 
            value={currentScreen} 
            onChange={(e) => handleNavigate(e.target.value)}
            style={{
              backgroundColor: "#1F2937",
              color: "#F8FAFC",
              border: "1px solid #374151",
              borderRadius: "6px",
              padding: "5px 10px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              outline: "none"
            }}
          >
            {SCREENS.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>

          <a
            href="/admin"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "5px 12px",
              borderRadius: "6px",
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              fontSize: "12px",
              fontWeight: "700",
              color: "#CBD5E1",
              textDecoration: "none"
            }}
          >
            <ExternalLink size={13} color="#60A5FA" />
            <span>🖥 Quản Trị Desktop</span>
          </a>
        </div>
      </div>

      {/* Floating Screen Switcher Drawer Toggle for Fast Mobile Testing */}
      <button
        onClick={() => setShowScreenDrawer(!showScreenDrawer)}
        style={{
          position: "fixed",
          right: "14px",
          bottom: "70px",
          zIndex: 100,
          backgroundColor: "#0F172A",
          color: "#FFFFFF",
          border: "1px solid #334155",
          borderRadius: "99px",
          padding: "6px 12px",
          fontSize: "11px",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.4)",
          cursor: "pointer",
          opacity: 0.85
        }}
        title="Bấm để chuyển nhanh giữa 15 màn hình"
      >
        <Layers size={13} color="#EE4D2D" />
        <span>15 Màn hình</span>
      </button>

      {/* Modal Drawer listing all 15 screens for 1-click jump */}
      {showScreenDrawer && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 2500,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center"
        }} onClick={() => setShowScreenDrawer(false)}>
          <div style={{
            width: "100%",
            maxWidth: "440px",
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            padding: "18px 16px 28px",
            maxHeight: "75vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 -10px 30px rgba(0,0,0,0.3)"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", borderBottom: "1px solid #F1F5F9", paddingBottom: "10px" }}>
              <span style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A" }}>
                Chọn nhanh màn hình (15 Màn Hình Chuẩn)
              </span>
              <button onClick={() => setShowScreenDrawer(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                <X size={18} color="#64748B" />
              </button>
            </div>

            <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }} className="no-scrollbar">
              {SCREENS.map(s => {
                const isActive = currentScreen === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleNavigate(s.id)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: isActive ? "1.5px solid #EE4D2D" : "1px solid #E2E8F0",
                      backgroundColor: isActive ? "#FFF1EC" : "#FFFFFF",
                      color: isActive ? "#EE4D2D" : "#1E293B",
                      fontSize: "12px",
                      fontWeight: isActive ? "800" : "600",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <span>{s.title}</span>
                    {isActive && <CheckCircle2 size={14} color="#EE4D2D" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Real Fullscreen Mobile Viewport Container */}
      <div className="mobile-viewport-container">
        <CurrentComponent {...screenProps} />
      </div>
    </>
  );
}
