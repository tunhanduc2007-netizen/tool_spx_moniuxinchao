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
 * iPhone Status Bar (Dynamic time, Cellular, WiFi, Battery)
 */
export const StatusBar = ({ dark = true }) => {
  const [time, setTime] = React.useState(() => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTime(`${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      height: "36px",
      padding: "0 18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: "12px",
      fontWeight: "700",
      color: dark ? "#0F172A" : "#FFFFFF",
      zIndex: 30,
      backgroundColor: "transparent",
      flexShrink: 0,
      userSelect: "none"
    }}>
      <span>{time}</span>
      <div style={{
        width: "80px",
        height: "18px",
        backgroundColor: dark ? "#0F172A" : "#000000",
        borderRadius: "999px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingRight: "6px"
      }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10B981", opacity: 0.8 }}></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <Signal size={12} strokeWidth={2.5} />
        <Wifi size={12} strokeWidth={2.5} />
        <Battery size={15} strokeWidth={2.5} />
      </div>
    </div>
  );
};

/**
 * Reusable Mobile Bottom Navigation Bar (5 tabs)
 */
export const MobileBottomNav = ({ activeTab = "dashboard", onTabChange }) => {
  const tabs = [
    { id: "dashboard", label: "Tổng quan", icon: Home },
    { id: "orders", label: "Đơn hàng", icon: Package },
    { id: "warehouse", label: "Kho hàng", icon: Warehouse },
    { id: "products", label: "Sản phẩm", icon: Tag },
    { id: "more", label: "Thêm", icon: MoreHorizontal },
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
      position: "relative",
      zIndex: 20,
      flexShrink: 0
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
              padding: "4px 8px",
              color: isActive ? "#EE4D2D" : "#94A3B8",
              transition: "all 0.15s ease",
              flex: 1
            }}
          >
            <Icon size={19} strokeWidth={isActive ? 2.4 : 1.8} />
            <span style={{ fontSize: "10px", fontWeight: isActive ? "700" : "500", lineHeight: 1 }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
