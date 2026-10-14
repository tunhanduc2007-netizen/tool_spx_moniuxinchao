import React, { useState } from "react";
import { 
  WelcomeScreen, LoginScreen, DashboardScreen, OrdersScreen,
  OrderDetailScreen, BatchPrintScreen, PrintingProgressScreen,
  WarehouseScreen, ProductsScreen, CustomersScreen, RankingsScreen,
  ReportsScreen, StaffScreen, ShopeeApiScreen, SettingsScreen 
} from "./components/screens";
import { 
  Smartphone, Grid, Sparkles, ZoomIn, ZoomOut, RotateCcw, 
  ExternalLink, Layers 
} from "lucide-react";

const SCREENS = [
  { id: "welcome", title: "1. Màn Hình Chào Mừng", component: WelcomeScreen },
  { id: "login", title: "2. Đăng Nhập", component: LoginScreen },
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
];

/**
 * Mobile Phone Mockup Frame
 */
const PhoneDevice = ({ children, scale = 1, active = false, label = "" }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {label && (
        <div style={{
          fontSize: "12px",
          fontWeight: "700",
          color: active ? "#EE4D2D" : "#94A3B8",
          marginBottom: "8px",
          textAlign: "center"
        }}>
          {label}
        </div>
      )}
      <div 
        style={{
          width: "310px",
          height: "640px",
          borderRadius: "44px",
          backgroundColor: "#000000",
          padding: "10px",
          boxShadow: active 
            ? "0 20px 40px rgba(238, 77, 45, 0.3), 0 0 0 3px #EE4D2D" 
            : "0 18px 36px rgba(0, 0, 0, 0.6), 0 0 0 1px #334155",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          position: "relative",
          userSelect: "none",
          flexShrink: 0,
          transition: "box-shadow 0.2s ease, transform 0.2s ease"
        }}
      >
        {/* Device Outer Titanium Edge */}
        <div style={{
          width: "100%",
          height: "100%",
          borderRadius: "36px",
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
          position: "relative",
          display: "flex",
          flexDirection: "column"
        }}>
          {children}

          {/* Home indicator bar at bottom */}
          <div style={{
            position: "absolute",
            bottom: "6px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "110px",
            height: "4px",
            backgroundColor: "#0F172A",
            opacity: 0.25,
            borderRadius: "99px",
            zIndex: 40,
            pointerEvents: "none"
          }}></div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [viewMode, setViewMode] = useState("grid"); // "interactive" or "grid"
  const [currentScreen, setCurrentScreen] = useState("dashboard");
  const [zoomLevel, setZoomLevel] = useState(1);

  const CurrentComponent = SCREENS.find(s => s.id === currentScreen)?.component || DashboardScreen;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#090D16", color: "#F8FAFC", display: "flex", flexDirection: "column" }}>
      {/* Top App Control Bar */}
      <header style={{
        padding: "14px 24px",
        backgroundColor: "#111827",
        borderBottom: "1px solid #1F2937",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        {/* Logo & Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            background: "linear-gradient(135deg, #FF5722 0%, #EE4D2D 100%)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "800",
            fontSize: "14px",
            color: "#fff",
            boxShadow: "0 2px 10px rgba(238, 77, 45, 0.4)"
          }}>
            SP
          </div>
          <div>
            <h1 style={{ fontSize: "15px", fontWeight: "800", color: "#fff", letterSpacing: "-0.01em" }}>
              Shopee Seller Pro Mobile UI (React)
            </h1>
            <p style={{ fontSize: "11px", color: "#9CA3AF" }}>
              Thiết kế giao diện 15 màn hình chuẩn điện thoại theo đúng ảnh mẫu
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            display: "flex",
            backgroundColor: "#1F2937",
            borderRadius: "10px",
            padding: "3px",
            border: "1px solid #374151"
          }}>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "8px",
                border: "none",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                backgroundColor: viewMode === "grid" ? "#EE4D2D" : "transparent",
                color: viewMode === "grid" ? "#FFFFFF" : "#9CA3AF"
              }}
            >
              <Grid size={14} />
              <span>Toàn Bộ 15 Màn Hình (Lưới 3x5)</span>
            </button>

            <button
              onClick={() => setViewMode("interactive")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "8px",
                border: "none",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                backgroundColor: viewMode === "interactive" ? "#EE4D2D" : "transparent",
                color: viewMode === "interactive" ? "#FFFFFF" : "#9CA3AF"
              }}
            >
              <Smartphone size={14} />
              <span>Thiết Bị Tương Tác</span>
            </button>
          </div>
        </div>
      </header>

      {/* Quick Select Bar for Screens */}
      <div style={{
        padding: "10px 24px",
        backgroundColor: "#0F172A",
        borderBottom: "1px solid #1E293B",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        overflowX: "auto"
      }} className="no-scrollbar">
        <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748B", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          Chọn nhanh:
        </span>
        {SCREENS.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => {
              setCurrentScreen(s.id);
              if (viewMode === "grid") setViewMode("interactive");
            }}
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              border: currentScreen === s.id && viewMode === "interactive" ? "1px solid #EE4D2D" : "1px solid #334155",
              backgroundColor: currentScreen === s.id && viewMode === "interactive" ? "rgba(238, 77, 45, 0.15)" : "#1E293B",
              color: currentScreen === s.id && viewMode === "interactive" ? "#EE4D2D" : "#CBD5E1",
              fontSize: "11px",
              fontWeight: "600",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s"
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Main Container */}
      <main style={{ flex: 1, padding: "30px 20px", display: "flex", justifyContent: "center", overflowX: "auto" }}>
        {viewMode === "interactive" ? (
          /* =========================================================================
             MODE A: INTERACTIVE SINGLE PHONE SIMULATOR
             ========================================================================= */
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#CBD5E1" }}>
                Đang xem: <strong style={{ color: "#EE4D2D" }}>{SCREENS.find(s => s.id === currentScreen)?.title}</strong>
              </span>
              <button
                onClick={() => setViewMode("grid")}
                style={{
                  background: "none",
                  border: "1px solid #334155",
                  borderRadius: "6px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  color: "#94A3B8",
                  cursor: "pointer"
                }}
              >
                ← Quay lại lưới 15 màn hình
              </button>
            </div>

            <PhoneDevice active={true}>
              <CurrentComponent onNavigate={(screenId) => setCurrentScreen(screenId)} />
            </PhoneDevice>

            <div style={{ marginTop: "24px", color: "#64748B", fontSize: "12px", textAlign: "center" }}>
              💡 Mẹo: Bạn có thể bấm trực tiếp vào các nút, tab hoặc link bên trong màn hình điện thoại để trải nghiệm chuyển trang!
            </div>
          </div>
        ) : (
          /* =========================================================================
             MODE B: 3x5 GRID OVERVIEW (EXACTLY LIKE THE REFERENCE IMAGE)
             ========================================================================= */
          <div style={{ width: "100%", maxWidth: "1680px" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 310px)",
              gap: "24px",
              justifyContent: "center",
              paddingBottom: "40px"
            }}>
              {SCREENS.map((s) => {
                const ScreenComp = s.component;
                return (
                  <div 
                    key={s.id} 
                    onClick={() => {
                      setCurrentScreen(s.id);
                      setViewMode("interactive");
                    }}
                    style={{ cursor: "pointer", transition: "transform 0.2s ease" }}
                    title="Bấm để mở màn hình này ở chế độ tương tác"
                  >
                    <PhoneDevice label={s.title}>
                      <ScreenComp onNavigate={(screenId) => {
                        setCurrentScreen(screenId);
                        setViewMode("interactive");
                      }} />
                    </PhoneDevice>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
