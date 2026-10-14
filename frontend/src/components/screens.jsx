import React, { useState } from "react";
import { 
  ShopeeLogo, StatusBar, MobileBottomNav 
} from "./common";
import { 
  ArrowLeft, Bell, Filter, Search, ChevronDown, Check, 
  MapPin, Phone, User, Share2, MoreHorizontal, CheckCircle2, 
  Circle, Plus, Eye, EyeOff, Lock, Mail, ChevronRight, Store, 
  Printer, Shield, Key, LogOut, RefreshCw, AlertCircle, Link,
  Warehouse
} from "lucide-react";

/**
 * =========================================================================
 * SCREEN 1: Welcome / Onboarding
 * =========================================================================
 */
export const WelcomeScreen = ({ onNavigate }) => (
  <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#FFF7F4", position: "relative" }}>
    <StatusBar dark={true} />
    
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px 24px", textAlign: "center" }}>
      {/* Shopee Logo */}
      <div style={{ marginBottom: "14px" }}>
        <ShopeeLogo size={52} />
      </div>

      <h1 style={{ fontSize: "21px", fontWeight: "800", color: "#1E293B", letterSpacing: "-0.02em" }}>
        Shopee Seller Pro
      </h1>
      <p style={{ fontSize: "12px", fontWeight: "600", color: "#64748B", marginTop: "3px" }}>
        Quản lý bán hàng Shopee toàn diện
      </p>
      <p style={{ fontSize: "11px", color: "#94A3B8", marginTop: "1px" }}>
        Nhanh chóng - Chính xác - Hiệu quả
      </p>

      {/* 3D Illustration Mockup */}
      <div style={{ 
        width: "100%", 
        maxWidth: "260px", 
        height: "210px", 
        margin: "18px 0", 
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          position: "absolute",
          width: "160px",
          height: "160px",
          background: "radial-gradient(circle, rgba(238, 77, 45, 0.12) 0%, rgba(255, 255, 255, 0) 70%)",
          borderRadius: "50%"
        }}></div>

        {/* 3D Visual elements */}
        <div style={{
          width: "130px",
          height: "175px",
          backgroundColor: "#FFFFFF",
          borderRadius: "18px",
          boxShadow: "0 14px 30px rgba(238, 77, 45, 0.18)",
          border: "3px solid #F1F5F9",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 2
        }}>
          <div style={{ width: "34px", height: "4px", backgroundColor: "#E2E8F0", borderRadius: "99px", marginBottom: "8px" }}></div>
          <div style={{ width: "100%", height: "28px", backgroundColor: "#EE4D2D", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "9px", color: "#fff", fontWeight: "800" }}>SPX STORE</span>
          </div>
          <div style={{ marginTop: "10px", width: "100%", display: "flex", gap: "6px" }}>
            <div style={{ flex: 1, height: "40px", backgroundColor: "#FFF1EC", borderRadius: "6px" }}></div>
            <div style={{ flex: 1, height: "40px", backgroundColor: "#EFF6FF", borderRadius: "6px" }}></div>
          </div>
          <div style={{ marginTop: "8px", width: "100%", height: "40px", backgroundColor: "#F8FAFC", borderRadius: "6px", border: "1px dashed #CBD5E1" }}></div>
        </div>

        {/* Parcels */}
        <div style={{
          position: "absolute",
          left: "22px",
          bottom: "20px",
          width: "44px",
          height: "44px",
          backgroundColor: "#FBBF24",
          borderRadius: "8px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
          border: "2px solid #F59E0B",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "rotate(-10deg)"
        }}>
          <div style={{ width: "100%", height: "8px", backgroundColor: "#D97706" }}></div>
        </div>

        <div style={{
          position: "absolute",
          right: "22px",
          bottom: "30px",
          width: "40px",
          height: "40px",
          backgroundColor: "#F87171",
          borderRadius: "8px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
          border: "2px solid #EF4444",
          transform: "rotate(12deg)"
        }}>
          <div style={{ width: "100%", height: "7px", backgroundColor: "#DC2626", marginTop: "15px" }}></div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
        <button 
          onClick={() => onNavigate("login")}
          style={{
            width: "100%",
            height: "44px",
            backgroundColor: "#EE4D2D",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "12px",
            fontWeight: "700",
            fontSize: "13px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(238, 77, 45, 0.35)",
            transition: "all 0.2s"
          }}
        >
          Đăng nhập
        </button>

        <button 
          onClick={() => onNavigate("login")}
          style={{
            width: "100%",
            height: "44px",
            backgroundColor: "#FFFFFF",
            color: "#1E293B",
            border: "1.5px solid #E2E8F0",
            borderRadius: "12px",
            fontWeight: "700",
            fontSize: "13px",
            cursor: "pointer"
          }}
        >
          Đăng ký
        </button>

        <a 
          onClick={() => onNavigate("login")} 
          style={{ fontSize: "11px", color: "#64748B", marginTop: "6px", cursor: "pointer" }}
        >
          Quên mật khẩu?
        </a>
      </div>
    </div>
  </div>
);

/**
 * =========================================================================
 * SCREEN 2: Login
 * =========================================================================
 */
export const LoginScreen = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#FFFFFF" }}>
      <StatusBar dark={true} />
      
      {/* Header */}
      <div style={{ padding: "8px 16px", display: "flex", alignItems: "center" }}>
        <button 
          onClick={() => onNavigate("welcome")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
        >
          <ArrowLeft size={18} color="#1E293B" />
        </button>
      </div>

      <div style={{ flex: 1, padding: "8px 24px 20px", display: "flex", flexDirection: "column" }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <ShopeeLogo size={24} />
          <span style={{ fontSize: "14px", fontWeight: "800", color: "#1E293B" }}>Shopee Seller Pro</span>
        </div>

        <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A" }}>Đăng nhập</h2>
        <p style={{ fontSize: "12px", color: "#64748B", marginTop: "3px", marginBottom: "20px" }}>
          Vui lòng đăng nhập để tiếp tục
        </p>

        {/* Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #E2E8F0",
            borderRadius: "10px",
            padding: "0 12px",
            height: "44px",
            backgroundColor: "#FFFFFF"
          }}>
            <Mail size={16} color="#94A3B8" />
            <input 
              type="text" 
              defaultValue="admin@shopee.vn"
              placeholder="Email hoặc số điện thoại" 
              style={{ border: "none", outline: "none", width: "100%", marginLeft: "8px", fontSize: "12px", color: "#1E293B" }}
            />
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #E2E8F0",
            borderRadius: "10px",
            padding: "0 12px",
            height: "44px",
            backgroundColor: "#FFFFFF"
          }}>
            <Lock size={16} color="#94A3B8" />
            <input 
              type={showPassword ? "text" : "password"} 
              defaultValue="••••••••"
              placeholder="Mật khẩu" 
              style={{ border: "none", outline: "none", width: "100%", marginLeft: "8px", fontSize: "12px", color: "#1E293B" }}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
            >
              {showPassword ? <EyeOff size={16} color="#94A3B8" /> : <Eye size={16} color="#94A3B8" />}
            </button>
          </div>
        </div>

        {/* Checkbox */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px", cursor: "pointer" }} onClick={() => setRemember(!remember)}>
          <div style={{
            width: "15px",
            height: "15px",
            borderRadius: "4px",
            border: `1.5px solid ${remember ? "#EE4D2D" : "#CBD5E1"}`,
            backgroundColor: remember ? "#EE4D2D" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {remember && <Check size={11} color="#fff" strokeWidth={3} />}
          </div>
          <span style={{ fontSize: "11px", color: "#64748B" }}>Ghi nhớ đăng nhập</span>
        </div>

        {/* Submit */}
        <button 
          onClick={() => onNavigate("dashboard")}
          style={{
            marginTop: "18px",
            height: "44px",
            backgroundColor: "#EE4D2D",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "10px",
            fontWeight: "700",
            fontSize: "13px",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(238, 77, 45, 0.3)"
          }}
        >
          Đăng nhập
        </button>

        <a style={{ textAlign: "center", fontSize: "11px", color: "#3B82F6", marginTop: "12px", cursor: "pointer" }}>
          Quên mật khẩu?
        </a>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", margin: "20px 0 16px" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#E2E8F0" }}></div>
          <span style={{ fontSize: "10px", color: "#94A3B8", padding: "0 8px" }}>Hoặc đăng nhập với</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#E2E8F0" }}></div>
        </div>

        {/* Google Button */}
        <button style={{
          height: "42px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontSize: "12px",
          fontWeight: "600",
          color: "#334155",
          cursor: "pointer"
        }}>
          <span style={{ fontWeight: "bold", color: "#EA4335" }}>G</span>
          <span>Đăng nhập bằng Google</span>
        </button>

        <div style={{ textAlign: "center", marginTop: "auto", fontSize: "11px", color: "#64748B", paddingTop: "12px" }}>
          Chưa có tài khoản? <span style={{ color: "#EE4D2D", fontWeight: "700", cursor: "pointer" }}>Đăng ký ngay</span>
        </div>
      </div>
    </div>
  );
};

/**
 * =========================================================================
 * SCREEN 3: Dashboard
 * =========================================================================
 */
export const DashboardScreen = ({ onNavigate }) => (
  <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
    <StatusBar dark={true} />

    {/* Top Header */}
    <div style={{ padding: "6px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <ShopeeLogo size={22} />
        <span style={{ fontSize: "13px", fontWeight: "800", color: "#0F172A" }}>Shopee Seller Pro</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ position: "relative" }}>
          <Bell size={18} color="#475569" />
          <div style={{ position: "absolute", top: "-2px", right: "-2px", width: "7px", height: "7px", backgroundColor: "#EE4D2D", borderRadius: "50%" }}></div>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60" 
          alt="Avatar" 
          style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover" }} 
        />
      </div>
    </div>

    {/* Scrollable Content */}
    <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}>
      {/* Greeting */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A" }}>Xin chào, Nguyễn Văn A</span>
            <span style={{ fontSize: "9px", backgroundColor: "#EFF6FF", color: "#2563EB", fontWeight: "700", padding: "1px 5px", borderRadius: "4px" }}>Admin</span>
          </div>
        </div>
      </div>

      {/* Date Filter Pill */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "99px",
        padding: "4px 10px",
        fontSize: "11px",
        color: "#475569",
        fontWeight: "600",
        marginBottom: "12px"
      }}>
        <span>Hôm nay (10/06/2025)</span>
        <Filter size={11} color="#64748B" />
      </div>

      {/* 2x2 Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
        {/* Card 1 */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "10px 12px", border: "1px solid #F1F5F9", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3.5px", backgroundColor: "#EE4D2D" }}></div>
          <div style={{ fontSize: "10px", color: "#64748B", fontWeight: "600" }}>Tổng đơn hàng</div>
          <div style={{ fontSize: "17px", fontWeight: "800", color: "#0F172A", marginTop: "2px" }}>1.248</div>
          <div style={{ fontSize: "9px", color: "#10B981", fontWeight: "600", marginTop: "2px" }}>↑ 12% so với hôm qua</div>
        </div>

        {/* Card 2 */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "10px 12px", border: "1px solid #F1F5F9", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3.5px", backgroundColor: "#10B981" }}></div>
          <div style={{ fontSize: "10px", color: "#64748B", fontWeight: "600" }}>Đã giao</div>
          <div style={{ fontSize: "17px", fontWeight: "800", color: "#0F172A", marginTop: "2px" }}>1.023</div>
          <div style={{ fontSize: "9px", color: "#10B981", fontWeight: "600", marginTop: "2px" }}>↑ 10%</div>
        </div>

        {/* Card 3 */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "10px 12px", border: "1px solid #F1F5F9", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3.5px", backgroundColor: "#3B82F6" }}></div>
          <div style={{ fontSize: "10px", color: "#64748B", fontWeight: "600" }}>Đang xử lý</div>
          <div style={{ fontSize: "17px", fontWeight: "800", color: "#0F172A", marginTop: "2px" }}>184</div>
          <div style={{ fontSize: "9px", color: "#3B82F6", fontWeight: "600", marginTop: "2px" }}>↑ 6%</div>
        </div>

        {/* Card 4 */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "10px 12px", border: "1px solid #F1F5F9", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3.5px", backgroundColor: "#8B5CF6" }}></div>
          <div style={{ fontSize: "10px", color: "#64748B", fontWeight: "600" }}>Doanh thu</div>
          <div style={{ fontSize: "15px", fontWeight: "800", color: "#0F172A", marginTop: "2px" }}>236.450.000đ</div>
          <div style={{ fontSize: "9px", color: "#10B981", fontWeight: "600", marginTop: "2px" }}>↑ 20%</div>
        </div>
      </div>

      {/* Chart Section */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "12px", border: "1px solid #F1F5F9" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#1E293B" }}>Doanh thu 7 ngày gần đây</span>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#2563EB", backgroundColor: "#EFF6FF", padding: "1px 6px", borderRadius: "4px" }}>236.450.000đ</span>
        </div>

        {/* Vector SVG Line Chart */}
        <div style={{ height: "100px", width: "100%", marginTop: "6px" }}>
          <svg width="100%" height="75" viewBox="0 0 280 75" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d="M 0 50 Q 40 40 80 55 T 160 35 T 220 40 L 280 15 L 280 75 L 0 75 Z" fill="url(#chartGrad)" />
            <path d="M 0 50 Q 40 40 80 55 T 160 35 T 220 40 L 280 15" fill="none" stroke="#3B82F6" strokeWidth="2.5" />
            <circle cx="280" cy="15" r="4" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#94A3B8", marginTop: "4px" }}>
            <span>04/06</span>
            <span>05/06</span>
            <span>06/06</span>
            <span>07/06</span>
            <span>08/06</span>
            <span>09/06</span>
            <span>10/06</span>
          </div>
        </div>
      </div>
    </div>

    <MobileBottomNav activeTab="dashboard" onTabChange={(t) => onNavigate(t)} />
  </div>
);

/**
 * =========================================================================
 * SCREEN 4: Order List
 * =========================================================================
 */
export const OrdersScreen = ({ onNavigate }) => {
  const [filterTab, setFilterTab] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState([1, 2, 3]);

  const orders = [
    { id: 1, sn: "SPX123456789", status: "Chờ xử lý", statusColor: "#F97316", statusBg: "#FFF1EC", items: "2 SP", date: "10/06/2025 14:32", total: "320.000đ" },
    { id: 2, sn: "SPX123456788", status: "Đang đóng gói", statusColor: "#3B82F6", statusBg: "#EFF6FF", items: "1 SP", date: "10/06/2025 14:20", total: "120.000đ" },
    { id: 3, sn: "SPX123456787", status: "Đang giao", statusColor: "#06B6D4", statusBg: "#ECFEFF", items: "3 SP", date: "10/06/2025 13:50", total: "450.000đ" },
    { id: 4, sn: "SPX123456786", status: "Giao thành công", statusColor: "#10B981", statusBg: "#ECFDF5", items: "1 SP", date: "10/06/2025 12:30", total: "120.000đ" },
  ];

  const toggleSelect = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(x => x !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      <StatusBar dark={true} />

      {/* Header */}
      <div style={{ padding: "6px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF" }}>
        <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0F172A" }}>Đơn hàng</h2>
        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60" 
          alt="Avatar" 
          style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover" }} 
        />
      </div>

      {/* Search Input */}
      <div style={{ padding: "8px 14px", backgroundColor: "#FFFFFF" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#F1F5F9",
          borderRadius: "8px",
          padding: "0 10px",
          height: "36px"
        }}>
          <Search size={14} color="#94A3B8" />
          <input 
            type="text" 
            placeholder="Tìm mã đơn, tên sản phẩm, SKU..." 
            style={{ border: "none", outline: "none", background: "none", width: "100%", marginLeft: "6px", fontSize: "11px", color: "#1E293B" }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", gap: "6px", marginTop: "8px", overflowX: "auto", paddingBottom: "2px" }} className="no-scrollbar">
          {[
            { id: "all", label: "Tất cả" },
            { id: "ready", label: "Chờ xử lý" },
            { id: "packing", label: "Đang đóng gói" },
            { id: "shipping", label: "Đang giao" },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterTab(f.id)}
              style={{
                border: "none",
                borderRadius: "99px",
                padding: "4px 10px",
                fontSize: "11px",
                fontWeight: "600",
                cursor: "pointer",
                whiteSpace: "nowrap",
                backgroundColor: filterTab === f.id ? "#EE4D2D" : "#F1F5F9",
                color: filterTab === f.id ? "#FFFFFF" : "#64748B"
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <div style={{ flex: 1, height: "28px", border: "1px solid #E2E8F0", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", fontSize: "10px", color: "#475569" }}>
            <span>Tất cả shop</span>
            <ChevronDown size={12} color="#94A3B8" />
          </div>
          <div style={{ flex: 1, height: "28px", border: "1px solid #E2E8F0", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", fontSize: "10px", color: "#475569" }}>
            <span>Tất cả kho</span>
            <ChevronDown size={12} color="#94A3B8" />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {orders.map(o => (
          <div 
            key={o.id}
            onClick={() => onNavigate("order-detail")}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              padding: "10px 12px",
              border: "1px solid #F1F5F9",
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              cursor: "pointer"
            }}
          >
            {/* Checkbox */}
            <div 
              onClick={(e) => { e.stopPropagation(); toggleSelect(o.id); }}
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "4px",
                border: `1.5px solid ${selectedOrders.includes(o.id) ? "#EE4D2D" : "#CBD5E1"}`,
                backgroundColor: selectedOrders.includes(o.id) ? "#EE4D2D" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "2px",
                flexShrink: 0
              }}
            >
              {selectedOrders.includes(o.id) && <Check size={11} color="#fff" strokeWidth={3} />}
            </div>

            {/* Shopee icon */}
            <ShopeeLogo size={20} />

            {/* Details */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>#{o.sn}</span>
                <span style={{ 
                  fontSize: "9px", 
                  fontWeight: "700", 
                  color: o.statusColor, 
                  backgroundColor: o.statusBg, 
                  padding: "1px 6px", 
                  borderRadius: "4px" 
                }}>
                  {o.status}
                </span>
              </div>
              <div style={{ fontSize: "10px", color: "#64748B", marginTop: "2px" }}>
                {o.items} - {o.date}
              </div>
              <div style={{ fontSize: "10px", color: "#334155", fontWeight: "600", marginTop: "2px" }}>
                {o.total}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Bottom Action Bar */}
      <div style={{
        padding: "8px 14px",
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E2E8F0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#475569" }}>
          <div style={{ width: "15px", height: "15px", borderRadius: "4px", border: "1.5px solid #CBD5E1" }}></div>
          <span>Chọn tất cả</span>
        </div>
        <button 
          onClick={() => onNavigate("batch-print")}
          style={{
            height: "36px",
            backgroundColor: "#EE4D2D",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            padding: "0 16px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          In hàng loạt ({selectedOrders.length})
        </button>
      </div>

      <MobileBottomNav activeTab="orders" onTabChange={(t) => onNavigate(t)} />
    </div>
  );
};

/**
 * =========================================================================
 * SCREEN 5: Order Detail
 * =========================================================================
 */
export const OrderDetailScreen = ({ onNavigate }) => (
  <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
    <StatusBar dark={true} />

    {/* Header */}
    <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <button onClick={() => onNavigate("orders")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
          <ArrowLeft size={18} color="#0F172A" />
        </button>
        <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A" }}>Chi tiết đơn hàng</h2>
      </div>
      <Share2 size={16} color="#64748B" />
    </div>

    {/* Scrollable details */}
    <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* Order Title Card */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "12px", border: "1px solid #F1F5F9" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "12px", fontWeight: "800", color: "#0F172A" }}>#SPX123456789</span>
          <span style={{ fontSize: "9px", fontWeight: "700", color: "#F97316", backgroundColor: "#FFF1EC", padding: "2px 6px", borderRadius: "4px" }}>Chờ xử lý</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
          <ShopeeLogo size={14} />
          <span style={{ fontSize: "10px", color: "#64748B" }}>Shopee</span>
        </div>
        <div style={{ fontSize: "10px", color: "#94A3B8", marginTop: "2px" }}>
          10/06/2025 14:32
        </div>
      </div>

      {/* Customer Info */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "12px", border: "1px solid #F1F5F9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "700", color: "#0F172A", marginBottom: "8px" }}>
          <User size={13} color="#EE4D2D" />
          <span>Thông tin khách hàng</span>
        </div>
        <div style={{ fontSize: "11px", fontWeight: "700", color: "#1E293B" }}>Nguyễn Thị Lan</div>
        <div style={{ fontSize: "10px", color: "#64748B", marginTop: "1px" }}>0987 654 321</div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "4px", fontSize: "10px", color: "#64748B", marginTop: "4px" }}>
          <MapPin size={11} color="#94A3B8" style={{ marginTop: "1px", flexShrink: 0 }} />
          <span>123 Nguyễn Văn Cừ, Quận 1, TP. HCM</span>
        </div>
      </div>

      {/* Items */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "12px", border: "1px solid #F1F5F9" }}>
        <div style={{ fontSize: "11px", fontWeight: "700", color: "#0F172A", marginBottom: "8px" }}>Sản phẩm</div>
        
        {/* Item 1 */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "8px", borderBottom: "1px solid #F1F5F9" }}>
          <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=80" alt="Item" style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#0F172A" }}>Áo thun nam basic</div>
            <div style={{ fontSize: "9px", color: "#64748B" }}>Đen / L - SL: 1</div>
          </div>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#0F172A" }}>120.000đ</span>
        </div>

        {/* Item 2 */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
          <img src="https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=80" alt="Item" style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#0F172A" }}>Quần short nam</div>
            <div style={{ fontSize: "9px", color: "#64748B" }}>Xám / L - SL: 1</div>
          </div>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#0F172A" }}>200.000đ</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #F1F5F9", fontSize: "11px", fontWeight: "800" }}>
          <span>Tổng tiền</span>
          <span style={{ color: "#EE4D2D" }}>320.000đ</span>
        </div>
      </div>

      {/* Shipping */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "12px", border: "1px solid #F1F5F9" }}>
        <div style={{ fontSize: "11px", fontWeight: "700", color: "#0F172A", marginBottom: "6px" }}>Vận chuyển</div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ShopeeLogo size={14} />
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#EE4D2D" }}>Shopee Express</span>
        </div>
        <div style={{ fontSize: "10px", color: "#64748B", marginTop: "2px" }}>
          Mã vận đơn: <code style={{ color: "#0F172A", fontWeight: "700" }}>SPXVN123456789</code>
        </div>
      </div>
    </div>

    {/* Bottom Actions */}
    <div style={{ padding: "10px 14px", backgroundColor: "#FFFFFF", borderTop: "1px solid #E2E8F0", display: "flex", gap: "10px" }}>
      <button style={{ flex: 1, height: "40px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "12px", fontWeight: "700", color: "#1E293B", cursor: "pointer" }}>
        Xử lý đơn
      </button>
      <button 
        onClick={() => onNavigate("batch-print")}
        style={{ flex: 1, height: "40px", backgroundColor: "#EE4D2D", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "700", color: "#FFFFFF", cursor: "pointer" }}
      >
        In vận đơn
      </button>
    </div>
  </div>
);

/**
 * =========================================================================
 * SCREEN 6: Batch Print (In hàng loạt)
 * =========================================================================
 */
export const BatchPrintScreen = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("unprinted");

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      <StatusBar dark={true} />

      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <button onClick={() => onNavigate("orders")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
          <ArrowLeft size={18} color="#0F172A" />
        </button>
        <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A", marginLeft: "6px" }}>In hàng loạt</h2>
      </div>

      <div style={{ padding: "8px 14px", backgroundColor: "#FFFFFF" }}>
        {/* Pills */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button 
            onClick={() => setActiveTab("unprinted")}
            style={{
              padding: "5px 12px",
              borderRadius: "99px",
              fontSize: "11px",
              fontWeight: "700",
              border: "none",
              backgroundColor: activeTab === "unprinted" ? "#FFF1EC" : "#F1F5F9",
              color: activeTab === "unprinted" ? "#EE4D2D" : "#64748B",
              cursor: "pointer"
            }}
          >
            Đơn chưa in (15)
          </button>
          <button 
            onClick={() => setActiveTab("printed")}
            style={{
              padding: "5px 12px",
              borderRadius: "99px",
              fontSize: "11px",
              fontWeight: "700",
              border: "none",
              backgroundColor: activeTab === "printed" ? "#FFF1EC" : "#F1F5F9",
              color: activeTab === "printed" ? "#EE4D2D" : "#64748B",
              cursor: "pointer"
            }}
          >
            Đã in (120)
          </button>
        </div>

        {/* Search */}
        <div style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#F1F5F9",
          borderRadius: "8px",
          padding: "0 10px",
          height: "34px",
          marginTop: "8px"
        }}>
          <Search size={14} color="#94A3B8" />
          <input 
            type="text" 
            placeholder="Tìm mã đơn, SKU..." 
            style={{ border: "none", outline: "none", background: "none", width: "100%", marginLeft: "6px", fontSize: "11px" }}
          />
        </div>

        {/* Dropdowns */}
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <div style={{ flex: 1, height: "26px", border: "1px solid #E2E8F0", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", fontSize: "10px", color: "#475569" }}>
            <span>Tất cả shop</span>
            <ChevronDown size={11} color="#94A3B8" />
          </div>
          <div style={{ flex: 1, height: "26px", border: "1px solid #E2E8F0", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", fontSize: "10px", color: "#475569" }}>
            <span>Tất cả kho</span>
            <ChevronDown size={11} color="#94A3B8" />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {[
          { id: 1, sn: "SPX123456789", info: "2 SP | 320.000đ" },
          { id: 2, sn: "SPX123456788", info: "1 SP | 150.000đ" },
          { id: 3, sn: "SPX123456787", info: "3 SP | 450.000đ" },
          { id: 4, sn: "SPX123456786", info: "1 SP | 120.000đ" },
        ].map((o, idx) => (
          <div key={o.id} style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            padding: "10px 12px",
            border: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "16px",
                height: "16px",
                borderRadius: "4px",
                backgroundColor: idx < 3 ? "#EE4D2D" : "transparent",
                border: "1.5px solid #EE4D2D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {idx < 3 && <Check size={11} color="#fff" strokeWidth={3} />}
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>#{o.sn}</div>
                <div style={{ fontSize: "9px", color: "#64748B", marginTop: "1px" }}>{o.info}</div>
              </div>
            </div>

            <span style={{ fontSize: "9px", fontWeight: "700", color: "#F97316", backgroundColor: "#FFF1EC", padding: "2px 6px", borderRadius: "4px" }}>
              Chờ in
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div style={{
        padding: "8px 14px",
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E2E8F0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#0F172A" }}>Đã chọn 3 đơn</div>
          <div style={{ fontSize: "9px", color: "#94A3B8" }}>Chỉ in các đơn chưa được in</div>
        </div>

        <button 
          onClick={() => onNavigate("printing-progress")}
          style={{
            height: "36px",
            backgroundColor: "#EE4D2D",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            padding: "0 16px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          In qua Label Pro
        </button>
      </div>

      <MobileBottomNav activeTab="orders" onTabChange={(t) => onNavigate(t)} />
    </div>
  );
};

/**
 * =========================================================================
 * SCREEN 7: Printing Progress (Đang in hàng loạt)
 * =========================================================================
 */
export const PrintingProgressScreen = ({ onNavigate }) => (
  <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#FFFFFF" }}>
    <StatusBar dark={true} />

    {/* Header */}
    <div style={{ padding: "8px 14px", display: "flex", alignItems: "center" }}>
      <button onClick={() => onNavigate("batch-print")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
        <ArrowLeft size={18} color="#0F172A" />
      </button>
      <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A", marginLeft: "6px" }}>Đang in hàng loạt</h2>
    </div>

    {/* Content */}
    <div style={{ flex: 1, padding: "16px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Circular Progress Meter */}
      <div style={{
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        border: "7px solid #E2E8F0",
        borderTopColor: "#3B82F6",
        borderRightColor: "#3B82F6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "14px 0 24px",
        position: "relative"
      }}>
        <span style={{ fontSize: "20px", fontWeight: "900", color: "#0F172A" }}>3/15</span>
        <span style={{ fontSize: "10px", color: "#64748B" }}>Đang xử lý...</span>
      </div>

      {/* Stepper Checklist */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", fontWeight: "600", color: "#10B981" }}>
          <CheckCircle2 size={16} color="#10B981" />
          <span>Đang tạo vận đơn... (3/3)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", fontWeight: "600", color: "#10B981" }}>
          <CheckCircle2 size={16} color="#10B981" />
          <span>Gửi lệnh in Label Pro... (2/3)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", fontWeight: "600", color: "#64748B" }}>
          <Circle size={16} color="#CBD5E1" />
          <span>Đang in... (0/3)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", fontWeight: "600", color: "#64748B" }}>
          <Circle size={16} color="#CBD5E1" />
          <span>Hoàn tất... (0/3)</span>
        </div>
      </div>

      {/* Summary Box */}
      <div style={{
        width: "100%",
        backgroundColor: "#F8FAFC",
        borderRadius: "10px",
        padding: "12px 16px",
        border: "1px solid #F1F5F9",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        fontSize: "11px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#64748B" }}>Tổng đơn:</span>
          <strong>15</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#64748B" }}>Đã in thành công:</span>
          <strong style={{ color: "#10B981" }}>3</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#64748B" }}>Thất bại:</span>
          <strong>0</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#64748B" }}>Còn lại:</span>
          <strong>12</strong>
        </div>
      </div>

      <button 
        onClick={() => onNavigate("batch-print")}
        style={{
          marginTop: "auto",
          width: "100%",
          height: "40px",
          backgroundColor: "#FFFFFF",
          border: "1.5px solid #CBD5E1",
          borderRadius: "8px",
          fontWeight: "700",
          fontSize: "12px",
          color: "#475569",
          cursor: "pointer"
        }}
      >
        Hủy
      </button>
    </div>
  </div>
);

/**
 * =========================================================================
 * SCREEN 8: Warehouses (Kho hàng)
 * =========================================================================
 */
export const WarehouseScreen = ({ onNavigate }) => (
  <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
    <StatusBar dark={true} />

    {/* Header */}
    <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <button onClick={() => onNavigate("dashboard")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
          <ArrowLeft size={18} color="#0F172A" />
        </button>
        <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A" }}>Kho hàng</h2>
      </div>
      <button style={{
        height: "28px",
        backgroundColor: "#EE4D2D",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        padding: "0 10px",
        fontSize: "10px",
        fontWeight: "700",
        display: "flex",
        alignItems: "center",
        gap: "3px"
      }}>
        <Plus size={12} />
        <span>Thêm kho</span>
      </button>
    </div>

    {/* Search */}
    <div style={{ padding: "8px 14px", backgroundColor: "#FFFFFF" }}>
      <div style={{ display: "flex", alignItems: "center", backgroundColor: "#F1F5F9", borderRadius: "8px", padding: "0 10px", height: "34px" }}>
        <Search size={14} color="#94A3B8" />
        <input 
          type="text" 
          placeholder="Tìm SKU, tên sản phẩm..." 
          style={{ border: "none", outline: "none", background: "none", width: "100%", marginLeft: "6px", fontSize: "11px" }}
        />
      </div>
    </div>

    {/* List */}
    <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "10px" }}>
      {[
        { name: "Kho Hà Nội", desc: "Hà Nội - Chính", stock: "12.450" },
        { name: "Kho HCM", desc: "TP. Hồ Chí Minh", stock: "8.760" },
        { name: "Kho Đà Nẵng", desc: "Đà Nẵng", stock: "6.450" }
      ].map((w, idx) => (
        <div key={idx} style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "10px",
          padding: "10px 12px",
          border: "1px solid #F1F5F9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShopeeLogo size={20} />
            <div>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>{w.name}</div>
              <div style={{ fontSize: "9px", color: "#64748B", display: "flex", alignItems: "center", gap: "2px", marginTop: "1px" }}>
                <MapPin size={9} color="#94A3B8" />
                <span>{w.desc}</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "9px", color: "#94A3B8" }}>Tồn khả dụng</div>
            <div style={{ fontSize: "13px", fontWeight: "800", color: "#10B981" }}>{w.stock}</div>
          </div>
        </div>
      ))}

      {/* Low stock section */}
      <div style={{ marginTop: "4px" }}>
        <div style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A", marginBottom: "8px" }}>Sản phẩm sắp hết hàng</div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "10px 12px", border: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: "8px" }}>
            <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=80" alt="Item" style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#0F172A" }}>Áo thun nam basic</div>
              <div style={{ fontSize: "9px", color: "#64748B" }}>SKU: ATN001 | Tồn: 5</div>
            </div>
            <span style={{ fontSize: "9px", fontWeight: "700", color: "#EF4444", backgroundColor: "#FEF2F2", padding: "2px 6px", borderRadius: "4px" }}>Sắp hết</span>
          </div>

          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "10px 12px", border: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: "8px" }}>
            <img src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=80" alt="Item" style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#0F172A" }}>Quần jean nữ</div>
              <div style={{ fontSize: "9px", color: "#64748B" }}>SKU: QJN002 | Tồn: 8</div>
            </div>
            <span style={{ fontSize: "9px", fontWeight: "700", color: "#EF4444", backgroundColor: "#FEF2F2", padding: "2px 6px", borderRadius: "4px" }}>Sắp hết</span>
          </div>
        </div>
      </div>
    </div>

    <MobileBottomNav activeTab="warehouse" onTabChange={(t) => onNavigate(t)} />
  </div>
);

/**
 * =========================================================================
 * SCREEN 9: Products & SKU
 * =========================================================================
 */
export const ProductsScreen = ({ onNavigate }) => {
  const products = [
    { name: "Áo thun nam basic", sku: "ATN001", sp: "SP001", stock: 120, img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=80" },
    { name: "Quần jean nữ", sku: "QJN002", sp: "SP002", stock: 65, img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=80" },
    { name: "Giày thể thao", sku: "GT003", sp: "SP003", stock: 60, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80" },
    { name: "Balo thời trang", sku: "BL004", sp: "SP004", stock: 40, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=80" },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      <StatusBar dark={true} />

      {/* Header */}
      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <button onClick={() => onNavigate("dashboard")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
          <ArrowLeft size={18} color="#0F172A" />
        </button>
        <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A", marginLeft: "6px" }}>Sản phẩm & SKU</h2>
      </div>

      {/* Search & Dropdowns */}
      <div style={{ padding: "8px 14px", backgroundColor: "#FFFFFF" }}>
        <div style={{ display: "flex", alignItems: "center", backgroundColor: "#F1F5F9", borderRadius: "8px", padding: "0 10px", height: "34px" }}>
          <Search size={14} color="#94A3B8" />
          <input 
            type="text" 
            placeholder="Tìm sản phẩm, SKU..." 
            style={{ border: "none", outline: "none", background: "none", width: "100%", marginLeft: "6px", fontSize: "11px" }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <div style={{ flex: 1, height: "26px", border: "1px solid #E2E8F0", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", fontSize: "10px", color: "#475569" }}>
            <span>Tất cả kho</span>
            <ChevronDown size={11} color="#94A3B8" />
          </div>
          <div style={{ flex: 1, height: "26px", border: "1px solid #E2E8F0", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", fontSize: "10px", color: "#475569" }}>
            <span>Tất cả trạng thái</span>
            <ChevronDown size={11} color="#94A3B8" />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {products.map((p, idx) => (
          <div key={idx} style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            padding: "10px 12px",
            border: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <img src={p.img} alt={p.name} style={{ width: "42px", height: "42px", borderRadius: "6px", objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>{p.name}</span>
                <span style={{ fontSize: "9px", fontWeight: "700", color: "#10B981", backgroundColor: "#ECFDF5", padding: "1px 5px", borderRadius: "4px" }}>Đang bán</span>
              </div>
              <div style={{ fontSize: "9px", color: "#64748B", marginTop: "2px" }}>
                SKU: {p.sku} | SP: {p.sp}
              </div>
              <div style={{ fontSize: "10px", color: "#0F172A", fontWeight: "700", marginTop: "2px" }}>
                Tồn: {p.stock}
              </div>
            </div>
          </div>
        ))}
      </div>

      <MobileBottomNav activeTab="products" onTabChange={(t) => onNavigate(t)} />
    </div>
  );
};

/**
 * =========================================================================
 * SCREEN 10: Customers (Khách hàng)
 * =========================================================================
 */
export const CustomersScreen = ({ onNavigate }) => {
  const [tab, setTab] = useState("all");

  const customers = [
    { name: "Nguyễn Thị Lan", phone: "0987 654 321", orders: "12 đơn | 8.450.000đ", tier: "VIP", tierColor: "#F97316", tierBg: "#FFF1EC", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80" },
    { name: "Trần Văn Nam", phone: "0912 345 678", orders: "8 đơn | 5.200.000đ", tier: "Thân thiết", tierColor: "#EE4D2D", tierBg: "#FFF1EC", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80" },
    { name: "Lê Thị Mai", phone: "0933 111 222", orders: "3 đơn | 2.100.000đ", tier: "Tiềm năng", tierColor: "#0284C7", tierBg: "#E0F2FE", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80" },
    { name: "Phạm Văn Hùng", phone: "0966 777 888", orders: "1 đơn | 350.000đ", tier: "Mới", tierColor: "#F97316", tierBg: "#FFEDD5", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80" },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      <StatusBar dark={true} />

      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <button onClick={() => onNavigate("dashboard")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
          <ArrowLeft size={18} color="#0F172A" />
        </button>
        <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A", marginLeft: "6px" }}>Khách hàng</h2>
      </div>

      <div style={{ padding: "8px 14px", backgroundColor: "#FFFFFF" }}>
        <div style={{ display: "flex", alignItems: "center", backgroundColor: "#F1F5F9", borderRadius: "8px", padding: "0 10px", height: "34px" }}>
          <Search size={14} color="#94A3B8" />
          <input 
            type="text" 
            placeholder="Tìm tên, SĐT, mã KH..." 
            style={{ border: "none", outline: "none", background: "none", width: "100%", marginLeft: "6px", fontSize: "11px" }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <button 
            onClick={() => setTab("all")}
            style={{
              padding: "4px 12px",
              borderRadius: "99px",
              fontSize: "11px",
              fontWeight: "700",
              border: "none",
              backgroundColor: tab === "all" ? "#FFF1EC" : "#F1F5F9",
              color: tab === "all" ? "#EE4D2D" : "#64748B",
              cursor: "pointer"
            }}
          >
            Tất cả
          </button>
          <button 
            onClick={() => setTab("vip")}
            style={{
              padding: "4px 12px",
              borderRadius: "99px",
              fontSize: "11px",
              fontWeight: "700",
              border: "none",
              backgroundColor: tab === "vip" ? "#FFF1EC" : "#F1F5F9",
              color: tab === "vip" ? "#EE4D2D" : "#64748B",
              cursor: "pointer"
            }}
          >
            VIP
          </button>
        </div>
      </div>

      {/* Customer List */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {customers.map((c, idx) => (
          <div key={idx} style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            padding: "10px 12px",
            border: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <img src={c.img} alt={c.name} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>{c.name}</span>
                <span style={{ fontSize: "9px", fontWeight: "700", color: c.tierColor, backgroundColor: c.tierBg, padding: "1px 6px", borderRadius: "4px" }}>
                  {c.tier}
                </span>
              </div>
              <div style={{ fontSize: "9px", color: "#64748B", marginTop: "1px" }}>{c.phone}</div>
              <div style={{ fontSize: "10px", color: "#334155", fontWeight: "600", marginTop: "2px" }}>{c.orders}</div>
            </div>
          </div>
        ))}
      </div>

      <MobileBottomNav activeTab="more" onTabChange={(t) => onNavigate(t)} />
    </div>
  );
};

/**
 * =========================================================================
 * SCREEN 11: Customer Rankings (Xếp hạng khách hàng)
 * =========================================================================
 */
export const RankingsScreen = ({ onNavigate }) => {
  const [tab, setTab] = useState("top10");

  const ranks = [
    { rank: "👑", name: "Nguyễn Thị Lan", spend: "12 đơn | 8.450.000đ", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80" },
    { rank: "🥈", name: "Trần Văn Nam", spend: "8 đơn | 5.200.000đ", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80" },
    { rank: "🥉", name: "Lê Thị Mai", spend: "6 đơn | 3.800.000đ", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80" },
    { rank: "4", name: "Phạm Văn Hùng", spend: "5 đơn | 3.200.000đ", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80" },
    { rank: "5", name: "Hoàng Thị Anh", spend: "4 đơn | 2.900.000đ", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80" },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      <StatusBar dark={true} />

      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <button onClick={() => onNavigate("dashboard")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
          <ArrowLeft size={18} color="#0F172A" />
        </button>
        <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A", marginLeft: "6px" }}>Xếp hạng khách hàng</h2>
      </div>

      <div style={{ padding: "8px 14px", backgroundColor: "#FFFFFF" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          {["Top 10", "Top 50", "Top 100"].map((t, idx) => (
            <button 
              key={idx}
              onClick={() => setTab(`top${idx}`)}
              style={{
                flex: 1,
                padding: "5px 0",
                borderRadius: "99px",
                fontSize: "11px",
                fontWeight: "700",
                border: "none",
                backgroundColor: idx === 0 ? "#EE4D2D" : "#F1F5F9",
                color: idx === 0 ? "#FFFFFF" : "#64748B",
                cursor: "pointer"
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {ranks.map((r, idx) => (
          <div key={idx} style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            padding: "10px 12px",
            border: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <div style={{ width: "20px", textAlign: "center", fontSize: "14px", fontWeight: "800", color: "#64748B" }}>
              {r.rank}
            </div>
            <img src={r.img} alt={r.name} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>{r.name}</div>
              <div style={{ fontSize: "10px", color: "#64748B", marginTop: "1px" }}>{r.spend}</div>
            </div>
          </div>
        ))}
      </div>

      <MobileBottomNav activeTab="more" onTabChange={(t) => onNavigate(t)} />
    </div>
  );
};

/**
 * =========================================================================
 * SCREEN 12: Reports (Báo cáo & Thống kê)
 * =========================================================================
 */
export const ReportsScreen = ({ onNavigate }) => {
  const [tab, setTab] = useState("7days");

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      <StatusBar dark={true} />

      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <button onClick={() => onNavigate("dashboard")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
          <ArrowLeft size={18} color="#0F172A" />
        </button>
        <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A", marginLeft: "6px" }}>Báo cáo & Thống kê</h2>
      </div>

      <div style={{ padding: "8px 14px", backgroundColor: "#FFFFFF" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {["7 ngày", "30 ngày", "Tháng", "Tùy chỉnh"].map((t, idx) => (
            <button 
              key={idx}
              onClick={() => setTab(`tab${idx}`)}
              style={{
                flex: 1,
                padding: "4px 0",
                borderRadius: "99px",
                fontSize: "11px",
                fontWeight: "700",
                border: "none",
                backgroundColor: idx === 0 ? "#EE4D2D" : "#F1F5F9",
                color: idx === 0 ? "#FFFFFF" : "#64748B",
                cursor: "pointer"
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Big Revenue Card */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "12px", border: "1px solid #F1F5F9" }}>
          <div style={{ fontSize: "10px", color: "#64748B" }}>Doanh thu</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
            <span style={{ fontSize: "17px", fontWeight: "900", color: "#0F172A" }}>2.450.000.000đ</span>
            <span style={{ fontSize: "10px", fontWeight: "700", color: "#10B981", backgroundColor: "#ECFDF5", padding: "2px 6px", borderRadius: "4px" }}>↑ 18%</span>
          </div>

          {/* Bar Chart */}
          <div style={{ marginTop: "14px" }}>
            <div style={{ fontSize: "10px", fontWeight: "700", color: "#1E293B", marginBottom: "8px" }}>Doanh thu theo ngày</div>
            
            <div style={{ height: "90px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 4px", borderBottom: "1px solid #F1F5F9" }}>
              {[40, 55, 60, 48, 70, 75, 88].map((val, idx) => (
                <div key={idx} style={{ width: "18px", height: `${val}%`, backgroundColor: "#EE4D2D", borderRadius: "3px 3px 0 0" }}></div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "8px", color: "#94A3B8", marginTop: "4px" }}>
              <span>04/06</span>
              <span>05/06</span>
              <span>06/06</span>
              <span>07/06</span>
              <span>08/06</span>
              <span>09/06</span>
              <span>10/06</span>
            </div>
          </div>
        </div>

        {/* 2 Stats Bottom */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "10px 12px", border: "1px solid #F1F5F9" }}>
            <div style={{ fontSize: "10px", color: "#64748B" }}>Tổng đơn</div>
            <div style={{ fontSize: "15px", fontWeight: "800", color: "#0F172A", marginTop: "2px" }}>8.450</div>
            <div style={{ fontSize: "9px", color: "#10B981", fontWeight: "700", marginTop: "2px" }}>↑ 12%</div>
          </div>

          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "10px 12px", border: "1px solid #F1F5F9" }}>
            <div style={{ fontSize: "10px", color: "#64748B" }}>Tỷ lệ giao thành</div>
            <div style={{ fontSize: "15px", fontWeight: "800", color: "#0F172A", marginTop: "2px" }}>96.5%</div>
            <div style={{ fontSize: "9px", color: "#10B981", fontWeight: "700", marginTop: "2px" }}>↑ 2%</div>
          </div>
        </div>
      </div>

      <MobileBottomNav activeTab="more" onTabChange={(t) => onNavigate(t)} />
    </div>
  );
};

/**
 * =========================================================================
 * SCREEN 13: Staff & Permissions (Nhân viên & phân quyền)
 * =========================================================================
 */
export const StaffScreen = ({ onNavigate }) => {
  const staff = [
    { name: "Nguyễn Văn A", role: "Admin", badge: "Toàn quyền", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80" },
    { name: "Trần Thị B", role: "Quản lý kho", badge: "Kho Hà Nội", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80" },
    { name: "Lê Văn C", role: "Nhân viên kho", badge: "Kho HCM", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80" },
    { name: "Phạm Thị D", role: "CSKH", badge: "Tất cả shop", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80" },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      <StatusBar dark={true} />

      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <button onClick={() => onNavigate("dashboard")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
          <ArrowLeft size={18} color="#0F172A" />
        </button>
        <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A", marginLeft: "6px" }}>Nhân viên & phân quyền</h2>
      </div>

      <div style={{ padding: "8px 14px", backgroundColor: "#FFFFFF" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", backgroundColor: "#F1F5F9", borderRadius: "8px", padding: "0 10px", height: "34px" }}>
            <Search size={14} color="#94A3B8" />
            <input 
              type="text" 
              placeholder="Tìm nhân viên..." 
              style={{ border: "none", outline: "none", background: "none", width: "100%", marginLeft: "6px", fontSize: "11px" }}
            />
          </div>
          <button style={{
            height: "34px",
            backgroundColor: "#EE4D2D",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "0 10px",
            fontSize: "11px",
            fontWeight: "700",
            whiteSpace: "nowrap"
          }}>
            + Thêm nhân viên
          </button>
        </div>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {staff.map((s, idx) => (
          <div key={idx} style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            padding: "10px 12px",
            border: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <img src={s.img} alt={s.name} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>{s.name}</div>
              <div style={{ fontSize: "9px", color: "#64748B", marginTop: "1px" }}>{s.role}</div>
            </div>
            <span style={{ fontSize: "9px", fontWeight: "700", color: "#0284C7", backgroundColor: "#E0F2FE", padding: "2px 8px", borderRadius: "99px" }}>
              {s.badge}
            </span>
          </div>
        ))}
      </div>

      <MobileBottomNav activeTab="more" onTabChange={(t) => onNavigate(t)} />
    </div>
  );
};

/**
 * =========================================================================
 * SCREEN 14: Shopee API Connection (Kết nối Shopee API)
 * =========================================================================
 */
export const ShopeeApiScreen = ({ onNavigate }) => (
  <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
    <StatusBar dark={true} />

    <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", backgroundColor: "#FFFFFF" }}>
      <button onClick={() => onNavigate("dashboard")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
        <ArrowLeft size={18} color="#0F172A" />
      </button>
      <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A", marginLeft: "6px" }}>Kết nối Shopee API</h2>
    </div>

    <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* App Card */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "12px", border: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ShopeeLogo size={28} />
          <div>
            <div style={{ fontSize: "12px", fontWeight: "800", color: "#0F172A" }}>Shopee</div>
            <div style={{ fontSize: "9px", color: "#64748B" }}>Đã kết nối 2 shop</div>
          </div>
        </div>
        <span style={{ fontSize: "9px", fontWeight: "700", color: "#10B981", backgroundColor: "#ECFDF5", padding: "2px 8px", borderRadius: "99px" }}>
          Hoạt động
        </span>
      </div>

      {/* Shop List Section */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "12px", border: "1px solid #F1F5F9" }}>
        <div style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A", marginBottom: "8px" }}>Danh sách shop</div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ padding: "8px 0", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>Shop Thời Trang 123</div>
              <div style={{ fontSize: "9px", color: "#64748B" }}>ID: 123456789</div>
              <div style={{ fontSize: "8px", color: "#94A3B8" }}>Đồng bộ lần cuối: 10/06/2025 14:20</div>
            </div>
            <button style={{
              height: "26px",
              padding: "0 10px",
              border: "1px solid #EE4D2D",
              backgroundColor: "transparent",
              color: "#EE4D2D",
              borderRadius: "6px",
              fontSize: "10px",
              fontWeight: "700",
              cursor: "pointer"
            }}>
              Đồng bộ
            </button>
          </div>

          <div style={{ padding: "8px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>Shop Gia Dụng</div>
              <div style={{ fontSize: "9px", color: "#64748B" }}>ID: 987654321</div>
              <div style={{ fontSize: "8px", color: "#94A3B8" }}>Đồng bộ lần cuối: 10/06/2025 12:15</div>
            </div>
            <button style={{
              height: "26px",
              padding: "0 10px",
              border: "1px solid #EE4D2D",
              backgroundColor: "transparent",
              color: "#EE4D2D",
              borderRadius: "6px",
              fontSize: "10px",
              fontWeight: "700",
              cursor: "pointer"
            }}>
              Đồng bộ
            </button>
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "12px", border: "1px solid #F1F5F9" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>Quyền API đã cấp</span>
          <span style={{ fontSize: "9px", color: "#3B82F6", fontWeight: "600" }}>Xem chi tiết</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "10px", color: "#334155" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Check size={12} color="#10B981" strokeWidth={3} />
            <span>Quản lý sản phẩm</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Check size={12} color="#10B981" strokeWidth={3} />
            <span>Quản lý đơn hàng</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Check size={12} color="#10B981" strokeWidth={3} />
            <span>Quản lý tồn kho</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Check size={12} color="#10B981" strokeWidth={3} />
            <span>Quản lý vận chuyển</span>
          </div>
        </div>
      </div>
    </div>

    <MobileBottomNav activeTab="more" onTabChange={(t) => onNavigate(t)} />
  </div>
);

/**
 * =========================================================================
 * SCREEN 15: Settings (Cài đặt hệ thống)
 * =========================================================================
 */
export const SettingsScreen = ({ onNavigate }) => {
  const menuItems = [
    { icon: Store, label: "Thông tin cửa hàng" },
    { icon: Link, label: "Kết nối Shopee API", route: "shopee-api" },
    { icon: Warehouse, label: "Quản lý kho", route: "warehouse" },
    { icon: Printer, label: "Quản lý in ấn (Label Pro)", route: "batch-print" },
    { icon: Bell, label: "Thông báo" },
    { icon: Eye, label: "Giao diện & hiển thị" },
    { icon: Shield, label: "Bảo mật" },
    { icon: Key, label: "Đổi mật khẩu" },
    { icon: LogOut, label: "Đăng xuất", isDanger: true, route: "login" },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      <StatusBar dark={true} />

      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <button onClick={() => onNavigate("dashboard")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
          <ArrowLeft size={18} color="#0F172A" />
        </button>
        <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A", marginLeft: "6px" }}>Cài đặt hệ thống</h2>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "10px 14px" }}>
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", border: "1px solid #F1F5F9", overflow: "hidden" }}>
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                onClick={() => item.route && onNavigate(item.route)}
                style={{
                  padding: "11px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: idx < menuItems.length - 1 ? "1px solid #F1F5F9" : "none",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Icon size={16} color={item.isDanger ? "#EF4444" : "#475569"} />
                  <span style={{ fontSize: "11px", fontWeight: "600", color: item.isDanger ? "#EF4444" : "#1E293B" }}>
                    {item.label}
                  </span>
                </div>
                {!item.isDanger && <ChevronRight size={13} color="#CBD5E1" />}
              </div>
            );
          })}
        </div>
      </div>

      <MobileBottomNav activeTab="more" onTabChange={(t) => onNavigate(t)} />
    </div>
  );
};
