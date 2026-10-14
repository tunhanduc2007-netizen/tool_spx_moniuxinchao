import React from "react";
import { 
  Home, Package, Warehouse, Tag, MoreHorizontal, 
  Wifi, Battery, Signal, Award, Link, Settings 
} from "lucide-react";

/**
 * Official Shopee Bag Logo
 */
export const ShopeeLogo = ({ size = 28, className = "" }) => (
  <div 
    style={{
      width: size,
      height: size,
      background: "linear-gradient(135deg, #FF5722 0%, #EE4D2D 100%)",
      borderRadius: size * 0.28,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 6px rgba(238, 77, 45, 0.35)",
      flexShrink: 0
    }}
    className={className}
  >
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
      <path 
        d="M6 8V6.5C6 4.567 7.567 3 9.5 3h5C16.433 3 18 4.567 18 6.5V8" 
        stroke="#FFFFFF" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
      />
      <path 
        d="M4 8.5C4 7.672 4.672 7 5.5 7h13c.828 0 1.5.672 1.5 1.5L21 20c0 .828-.672 1.5-1.5 1.5H4.5C3.672 21.5 3 20.828 3 20L4 8.5z" 
        fill="#FFFFFF" 
      />
      <path 
        d="M13.5 12.2c-.2-.7-.8-1.2-1.7-1.2-.9 0-1.6.5-1.6 1.2 0 .8.6 1.1 1.7 1.4 1.3.4 2.1.9 2.1 2 0 1.2-1 2-2.3 2-1.2 0-2.1-.6-2.3-1.6m.3-4.2c.2-.5.8-.8 1.6-.8" 
        stroke="#EE4D2D" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
      />
    </svg>
  </div>
);

/**
 * Mobile Top Spacer (Seamless native safe-area)
 */
export const StatusBar = () => (
  <div style={{ height: "6px", width: "100%", backgroundColor: "transparent", flexShrink: 0 }} />
);

/**
 * Reusable Mobile Bottom Navigation Bar (5 tabs, sticky bottom)
 */
export const MobileBottomNav = ({ activeTab = "dashboard", onTabChange }) => {
  const tabs = [
    { id: "dashboard", label: "Tổng quan", icon: Home },
    { id: "orders", label: "Đơn hàng", icon: Package },
    { id: "warehouse", label: "Kho hàng", icon: Warehouse },
    { id: "products", label: "Sản phẩm", icon: Tag },
    { id: "more", label: "Cài đặt", icon: Settings },
  ];

  return (
    <div style={{
      height: "58px",
      backgroundColor: "#FFFFFF",
      borderTop: "1px solid #F1F5F9",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      padding: "0 4px",
      position: "sticky",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 40,
      flexShrink: 0,
      boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.04)"
    }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange && onTabChange(tab.id)}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              cursor: "pointer",
              padding: "6px 8px",
              color: isActive ? "#EE4D2D" : "#94A3B8",
              transition: "all 0.15s ease",
              flex: 1
            }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            <span style={{ fontSize: "10px", fontWeight: isActive ? "700" : "500", lineHeight: 1 }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

