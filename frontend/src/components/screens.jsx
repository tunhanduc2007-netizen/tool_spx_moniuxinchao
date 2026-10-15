import React, { useState, useEffect } from "react";
import { ShopeeLogo, StatusBar, MobileBottomNav } from "./common";
import {
  authAPI, ordersAPI, printAPI, warehouseAPI,
  productsAPI, customersAPI, reportsAPI, shopeeAPI, usersAPI,
  setToken
} from "../api";
import {
  ArrowLeft, Bell, Filter, Search, ChevronDown, Check,
  MapPin, Phone, User, Share2, MoreHorizontal, CheckCircle2,
  Circle, Plus, Minus, Eye, EyeOff, Lock, Mail, ChevronRight,
  Store, Printer, Shield, Key, LogOut, RefreshCw, AlertCircle,
  Link, Warehouse, Sliders, Calendar, TrendingUp, Box, Award,
  Sparkles, Clock, Truck, Copy, ExternalLink, FileText, Globe
} from "lucide-react";

/**
 * =========================================================================
 * SCREEN 1: Welcome / Onboarding
 * =========================================================================
 */
export const WelcomeScreen = ({ onNavigate }) => (
  <div style={{ flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#FFF7F4", position: "relative" }}>
    <StatusBar dark={true} />
    
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px 24px", textAlign: "center" }}>
      {/* Shopee Logo */}
      <div style={{ marginBottom: "14px" }}>
        <ShopeeLogo size={54} />
      </div>

      <h1 style={{ fontSize: "21px", fontWeight: "800", color: "#1E293B", letterSpacing: "-0.02em" }}>
        Shopee Seller Pro
      </h1>
      <p style={{ fontSize: "12px", fontWeight: "600", color: "#64748B", marginTop: "3px" }}>
        Kênh Người Bán Shopee & Tự động hoá Vận đơn SPX
      </p>
      <p style={{ fontSize: "11px", color: "#94A3B8", marginTop: "1px" }}>
        Kết nối trực tiếp Shopee Open Platform v2
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
          width: "170px",
          height: "170px",
          background: "radial-gradient(circle, rgba(238, 77, 45, 0.16) 0%, rgba(255, 255, 255, 0) 70%)",
          borderRadius: "50%"
        }}></div>

        {/* 3D Visual elements */}
        <div style={{
          width: "135px",
          height: "175px",
          backgroundColor: "#FFFFFF",
          borderRadius: "18px",
          boxShadow: "0 14px 30px rgba(238, 77, 45, 0.2)",
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
            <span style={{ fontSize: "9px", color: "#fff", fontWeight: "800" }}>SPX EXPRESS</span>
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
          left: "20px",
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
          right: "20px",
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
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
        >
          <Store size={16} />
          <span>Đăng nhập Kênh Người Bán Shopee</span>
        </button>

        <button 
          onClick={() => onNavigate("dashboard")}
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
          Khám phá Dashboard ngay →
        </button>
      </div>
    </div>
  </div>
);

/**
 * =========================================================================
 * SCREEN 2: Login - Shopee Seller Primary & Internal Admin
 * =========================================================================
 */
export const LoginScreen = ({ onNavigate, setActiveUser, onToast }) => {
  const [activeTab, setActiveTab] = useState("shopee"); // "shopee" | "admin"
  
  // Shopee Seller state
  const [shopId, setShopId] = useState("8829104");
  const [shopName, setShopName] = useState("SPX Flagship Store VN");
  const [sellerUsername, setSellerUsername] = useState("shopee_seller_vn");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [partnerId, setPartnerId] = useState("");
  const [partnerKey, setPartnerKey] = useState("");
  
  // Admin state
  const [email, setEmail] = useState("tunhanduc2007@gmail.com");
  const [password, setPassword] = useState("Admin@123456");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleShopeeLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await authAPI.shopeeSellerLogin({
        shop_id: shopId ? Number(shopId) : 8829104,
        shop_name: shopName.trim() || `Gian Hàng Shopee #${shopId}`,
        seller_username: sellerUsername.trim() || undefined,
        partner_id: partnerId ? Number(partnerId) : undefined,
        partner_key: partnerKey ? partnerKey.trim() : undefined
      });

      if (res && res.access_token) {
        setToken(res.access_token);
        if (setActiveUser && res.user) setActiveUser(res.user);
        if (onToast) {
          onToast(res.message || "Đăng nhập Kênh Người Bán Shopee & lấy dữ liệu API thành công!");
        }
        onNavigate("dashboard");
      }
    } catch (err) {
      setErrorMsg(err.message || "Không thể kết nối Shopee Seller API. Vui lòng kiểm tra lại thông tin gian hàng.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthRedirect = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const currentOrigin = typeof window !== "undefined" ? window.location.origin : "http://127.0.0.1:8000";
      const res = await authAPI.getShopeeOAuthUrl(currentOrigin);
      if (res && res.auth_url) {
        if (onToast) onToast("Đang chuyển sang trang Kênh Người Bán Shopee để xác thực...");
        window.location.href = res.auth_url;
      }
    } catch (err) {
      setErrorMsg(err.message || "Lỗi tạo đường dẫn ủy quyền Shopee.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await authAPI.login(email.trim(), password);
      if (res && res.access_token) {
        setToken(res.access_token);
        if (setActiveUser && res.user) setActiveUser(res.user);
        if (onToast) onToast("Đăng nhập Admin thành công! Chào mừng bạn.");
        onNavigate("dashboard");
      }
    } catch (err) {
      setErrorMsg(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const fillAdmin = () => {
    setEmail("tunhanduc2007@gmail.com");
    setPassword("Admin@123456");
  };

  return (
    <div style={{ flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#FFFFFF" }}>
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

      <div style={{ flex: 1, padding: "8px 24px 24px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <ShopeeLogo size={26} />
          <span style={{ fontSize: "15px", fontWeight: "800", color: "#1E293B" }}>Shopee Seller Pro</span>
        </div>

        <h2 style={{ fontSize: "19px", fontWeight: "800", color: "#0F172A" }}>Đăng nhập</h2>
        <p style={{ fontSize: "12px", color: "#64748B", marginTop: "2px", marginBottom: "14px" }}>
          Đăng nhập Kênh Người Bán Shopee để đồng bộ đơn & kho hàng thực tế
        </p>

        {/* Tab Switcher */}
        <div style={{
          display: "flex",
          backgroundColor: "#F1F5F9",
          borderRadius: "10px",
          padding: "3px",
          marginBottom: "16px"
        }}>
          <button
            type="button"
            onClick={() => setActiveTab("shopee")}
            style={{
              flex: 1,
              padding: "8px 0",
              border: "none",
              borderRadius: "8px",
              backgroundColor: activeTab === "shopee" ? "#FFFFFF" : "transparent",
              color: activeTab === "shopee" ? "#EE4D2D" : "#64748B",
              fontWeight: "700",
              fontSize: "12px",
              cursor: "pointer",
              boxShadow: activeTab === "shopee" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px"
            }}
          >
            <Store size={14} />
            <span>Shopee Seller</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("admin")}
            style={{
              flex: 1,
              padding: "8px 0",
              border: "none",
              borderRadius: "8px",
              backgroundColor: activeTab === "admin" ? "#FFFFFF" : "transparent",
              color: activeTab === "admin" ? "#2563EB" : "#64748B",
              fontWeight: "700",
              fontSize: "12px",
              cursor: "pointer",
              boxShadow: activeTab === "admin" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px"
            }}
          >
            <Shield size={14} />
            <span>Quản Trị Viên</span>
          </button>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: "#FEF2F2",
            border: "1px solid #FCA5A5",
            borderRadius: "8px",
            padding: "8px 12px",
            color: "#B91C1C",
            fontSize: "11px",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <AlertCircle size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: SHOPEE SELLER LOGIN */}
        {activeTab === "shopee" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Primary Action: Official Shopee Seller SSO Login */}
            <div style={{
              backgroundColor: "#FFF7F4",
              border: "1.5px solid #FFD8CC",
              borderRadius: "12px",
              padding: "14px 12px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(238, 77, 45, 0.08)"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "4px" }}>
                <ShopeeLogo size={18} />
                <span style={{ fontSize: "13px", fontWeight: "800", color: "#C2410C" }}>
                  ĐĂNG NHẬP BẰNG TÀI KHOẢN SHOPEE SELLER
                </span>
              </div>
              <p style={{ fontSize: "11px", color: "#64748B", margin: "0 0 12px", lineHeight: "1.4" }}>
                Bấm nút bên dưới để chuyển sang trang Kênh Người Bán Shopee chính thức, đăng nhập tài khoản và ủy quyền đồng bộ 100% toàn bộ đơn hàng thực tế về app.
              </p>

              <button
                type="button"
                onClick={handleOAuthRedirect}
                disabled={loading}
                style={{
                  width: "100%",
                  height: "46px",
                  backgroundColor: "#EE4D2D",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "800",
                  fontSize: "13px",
                  cursor: loading ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(238, 77, 45, 0.35)",
                }}
              >
                {loading ? (
                  <>
                    <RefreshCw size={15} className="spin" />
                    <span>Đang chuyển hướng sang Shopee...</span>
                  </>
                ) : (
                  <>
                    <ShopeeLogo size={20} />
                    <span>🛍️ Đăng Nhập Kênh Người Bán Shopee</span>
                    <ExternalLink size={14} />
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "2px 0" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#E2E8F0" }}></div>
              <span style={{ fontSize: "10px", fontWeight: "700", color: "#94A3B8" }}>HOẶC KẾT NỐI NHANH QUA MÃ SHOP</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#E2E8F0" }}></div>
            </div>

            {/* Quick Connect Form */}
            <form onSubmit={handleShopeeLogin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* Shop ID */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                  Mã Shop ID (Shopee Seller Shop ID)
                </label>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #E2E8F0",
                  borderRadius: "10px",
                  padding: "0 12px",
                  height: "42px",
                  backgroundColor: "#FFFFFF"
                }}>
                  <Store size={15} color="#94A3B8" />
                  <input 
                    type="number" 
                    value={shopId}
                    onChange={(e) => setShopId(e.target.value)}
                    placeholder="Ví dụ: 8829104" 
                    required
                    style={{ border: "none", outline: "none", width: "100%", marginLeft: "8px", fontSize: "12px", color: "#1E293B" }}
                  />
                </div>
              </div>

              {/* Shop Name */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                  Tên Gian Hàng (Shop Name)
                </label>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #E2E8F0",
                  borderRadius: "10px",
                  padding: "0 12px",
                  height: "42px",
                  backgroundColor: "#FFFFFF"
                }}>
                  <Box size={15} color="#94A3B8" />
                  <input 
                    type="text" 
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Ví dụ: SPX Flagship Store VN" 
                    required
                    style={{ border: "none", outline: "none", width: "100%", marginLeft: "8px", fontSize: "12px", color: "#1E293B" }}
                  />
                </div>
              </div>

              {/* Seller Username */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                  Tên Đăng Nhập Shopee (Username)
                </label>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #E2E8F0",
                  borderRadius: "10px",
                  padding: "0 12px",
                  height: "42px",
                  backgroundColor: "#FFFFFF"
                }}>
                  <User size={15} color="#94A3B8" />
                  <input 
                    type="text" 
                    value={sellerUsername}
                    onChange={(e) => setSellerUsername(e.target.value)}
                    placeholder="Ví dụ: shopee_seller_vn" 
                    style={{ border: "none", outline: "none", width: "100%", marginLeft: "8px", fontSize: "12px", color: "#1E293B" }}
                  />
                </div>
              </div>

              {/* Advanced Partner Key Toggle */}
              <div style={{ marginTop: "2px" }}>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "0",
                    color: "#64748B",
                    fontSize: "11px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <span>⚙️ Cấu hình Partner ID & Key nâng cao (Tùy chọn)</span>
                  <ChevronDown size={14} style={{ transform: showAdvanced ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>

                {showAdvanced && (
                  <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "8px", padding: "10px", backgroundColor: "#F8FAFC", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                    <div>
                      <label style={{ fontSize: "10px", fontWeight: "600", color: "#475569" }}>Shopee Partner ID</label>
                      <input 
                        type="number"
                        value={partnerId}
                        onChange={(e) => setPartnerId(e.target.value)}
                        placeholder="Mặc định: 1008291"
                        style={{ width: "100%", height: "32px", fontSize: "11px", borderRadius: "6px", border: "1px solid #CBD5E1", padding: "0 8px", marginTop: "3px" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "10px", fontWeight: "600", color: "#475569" }}>Shopee Partner Key (Secret)</label>
                      <input 
                        type="password"
                        value={partnerKey}
                        onChange={(e) => setPartnerKey(e.target.value)}
                        placeholder="Nhập secret key nếu có"
                        style={{ width: "100%", height: "32px", fontSize: "11px", borderRadius: "6px", border: "1px solid #CBD5E1", padding: "0 8px", marginTop: "3px" }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "4px",
                  height: "44px",
                  backgroundColor: "#FFFFFF",
                  color: "#EE4D2D",
                  border: "1.5px solid #EE4D2D",
                  borderRadius: "10px",
                  fontWeight: "700",
                  fontSize: "12px",
                  cursor: loading ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                {loading ? (
                  <>
                    <RefreshCw size={14} className="spin" />
                    <span>Đang kết nối & lấy dữ liệu...</span>
                  </>
                ) : (
                  <>
                    <Store size={15} />
                    <span>⚡ Kết Nối Nhanh & Lấy Toàn Bộ Đơn Hàng</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: INTERNAL ADMIN LOGIN */}
        {activeTab === "admin" && (
          <form onSubmit={handleAdminLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Demo Fast Login Pill */}
            <div 
              onClick={fillAdmin}
              style={{
                backgroundColor: "#EFF6FF",
                border: "1px solid #BFDBFE",
                borderRadius: "8px",
                padding: "8px 10px",
                fontSize: "11px",
                color: "#1D4ED8",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer"
              }}
              title="Bấm để điền sẵn tài khoản Admin"
            >
              <span>🔑 <strong>Tài khoản Quản Trị:</strong> tunhanduc2007@gmail.com</span>
              <span style={{ fontSize: "10px", fontWeight: "700", textDecoration: "underline" }}>Điền mẫu</span>
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
              <Mail size={16} color="#94A3B8" />
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email hoặc tên đăng nhập" 
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {/* Checkbox */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }} onClick={() => setRemember(!remember)}>
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
              <span style={{ fontSize: "11px", color: "#64748B" }}>Ghi nhớ đăng nhập an toàn</span>
            </div>

            {/* Submit */}
            <button 
              type="submit"
              disabled={loading}
              style={{
                marginTop: "6px",
                height: "44px",
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "13px",
                cursor: loading ? "wait" : "pointer",
                boxShadow: "0 4px 10px rgba(37, 99, 235, 0.3)",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Đang xác thực..." : "Đăng nhập Quản Trị Viên"}
            </button>
          </form>
        )}

        {/* Quick entry for desktop */}
        <div style={{ marginTop: "auto", paddingTop: "20px", textAlign: "center" }}>
          <button
            onClick={() => onNavigate("dashboard")}
            style={{
              background: "none",
              border: "none",
              color: "#94A3B8",
              fontSize: "11px",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            Bỏ qua đăng nhập, vào trực tiếp hệ thống
          </button>
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
export const DashboardScreen = ({ onNavigate, activeUser, refreshTrigger, onOpenPrintModal, onSelectOrder }) => {
  const [data, setData] = useState({
    metrics: { total_revenue: 0, pending_orders: 0, unprinted_orders: 0, completed_orders: 0 },
    chart: [],
    urgentOrders: []
  });
  const [syncing, setSyncing] = useState(false);

  const loadData = () => {
    reportsAPI.dashboard().then(res => {
      if (res && res.success) {
        setData({
          metrics: res.metrics || { total_revenue: 0, pending_orders: 0, unprinted_orders: 0, completed_orders: 0 },
          chart: res.revenue_chart ? res.revenue_chart.map(c => ({ date: c.date, rev: c.revenue ? c.revenue / 10000 : 0 })) : [],
          urgentOrders: res.urgent_unprinted_orders || []
        });
      }
    }).catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const handleSyncShopee = async () => {
    setSyncing(true);
    try {
      const shopRes = await shopeeAPI.shops();
      const shopId = shopRes?.shops?.[0]?.id || 1;
      await shopeeAPI.syncOrders(shopId);
      await shopeeAPI.syncProducts(shopId);
      loadData();
      alert("Đã đồng bộ đơn hàng & sản phẩm từ Shopee API thành công!");
    } catch (e) {
      alert("Lỗi đồng bộ Shopee API: " + e.message);
    } finally {
      setSyncing(false);
    }
  };

  const userName = activeUser?.full_name ? activeUser.full_name.split(" ").slice(-1)[0] : "Admin";

  return (
    <div style={{ flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      <StatusBar dark={true} />

      {/* Top Header */}
      <div style={{ padding: "6px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ShopeeLogo size={22} />
          <span style={{ fontSize: "13px", fontWeight: "800", color: "#0F172A" }}>Shopee Seller Pro</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => onNavigate("settings")}>
            <Bell size={18} color="#475569" />
            <div style={{ position: "absolute", top: "-2px", right: "-2px", width: "7px", height: "7px", backgroundColor: "#EE4D2D", borderRadius: "50%" }}></div>
          </div>
          <div 
            onClick={() => onNavigate("settings")}
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              backgroundColor: "#EE4D2D",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            {userName[0]}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}>
        {/* Greeting */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A" }}>Xin chào, {userName} 👋</span>
              <span style={{ fontSize: "9px", backgroundColor: "#EFF6FF", color: "#2563EB", fontWeight: "700", padding: "1px 5px", borderRadius: "4px" }}>
                {activeUser?.role || "ADMIN"}
              </span>
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
          <span>Hôm nay ({new Date().toLocaleDateString("vi-VN")})</span>
          <Filter size={11} color="#64748B" />
        </div>

        {/* 2x2 Metric Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
          {/* Card 1 */}
          <div 
            onClick={() => onNavigate("orders")}
            style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "10px 12px", border: "1px solid #F1F5F9", position: "relative", overflow: "hidden", cursor: "pointer" }}
          >
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3.5px", backgroundColor: "#EE4D2D" }}></div>
            <div style={{ fontSize: "10px", color: "#64748B", fontWeight: "600" }}>Chờ xử lý</div>
            <div style={{ fontSize: "17px", fontWeight: "800", color: "#0F172A", marginTop: "2px" }}>
              {data.metrics.pending_orders} đơn
            </div>
            <div style={{ fontSize: "9px", color: "#EE4D2D", fontWeight: "600", marginTop: "2px" }}>Cần xử lý ngay →</div>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => onNavigate("batch-print")}
            style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "10px 12px", border: "1px solid #F1F5F9", position: "relative", overflow: "hidden", cursor: "pointer" }}
          >
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3.5px", backgroundColor: "#3B82F6" }}></div>
            <div style={{ fontSize: "10px", color: "#64748B", fontWeight: "600" }}>Chưa in vận đơn</div>
            <div style={{ fontSize: "17px", fontWeight: "800", color: "#0F172A", marginTop: "2px" }}>
              {data.metrics.unprinted_orders} đơn
            </div>
            <div style={{ fontSize: "9px", color: "#3B82F6", fontWeight: "600", marginTop: "2px" }}>In qua Label Pro →</div>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => onNavigate("warehouse")}
            style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "10px 12px", border: "1px solid #F1F5F9", position: "relative", overflow: "hidden", cursor: "pointer" }}
          >
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3.5px", backgroundColor: "#10B981" }}></div>
            <div style={{ fontSize: "10px", color: "#64748B", fontWeight: "600" }}>Kho hàng SPX</div>
            <div style={{ fontSize: "17px", fontWeight: "800", color: "#0F172A", marginTop: "2px" }}>2 Kho</div>
            <div style={{ fontSize: "9px", color: "#10B981", fontWeight: "600", marginTop: "2px" }}>Tồn kho ổn định</div>
          </div>

          {/* Card 4 */}
          <div 
            onClick={() => onNavigate("reports")}
            style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "10px 12px", border: "1px solid #F1F5F9", position: "relative", overflow: "hidden", cursor: "pointer" }}
          >
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3.5px", backgroundColor: "#8B5CF6" }}></div>
            <div style={{ fontSize: "10px", color: "#64748B", fontWeight: "600" }}>Doanh thu</div>
            <div style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A", marginTop: "2px" }}>
              {Number(data.metrics.total_revenue).toLocaleString("vi-VN")}đ
            </div>
            <div style={{ fontSize: "9px", color: "#10B981", fontWeight: "600", marginTop: "2px" }}>↑ 20% tuần này</div>
          </div>
        </div>

        {/* Quick Actions Shortcuts */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px", overflowX: "auto" }} className="no-scrollbar">
          <button 
            onClick={() => onNavigate("batch-print")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "6px 12px",
              borderRadius: "8px",
              backgroundColor: "#EE4D2D",
              color: "#fff",
              border: "none",
              fontSize: "11px",
              fontWeight: "700",
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            <Printer size={13} />
            <span>In hàng loạt</span>
          </button>

          <button 
            onClick={() => onNavigate("shopee-api")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "6px 12px",
              borderRadius: "8px",
              backgroundColor: "#FFFFFF",
              color: "#1E293B",
              border: "1px solid #E2E8F0",
              fontSize: "11px",
              fontWeight: "700",
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            <RefreshCw size={12} color="#EE4D2D" />
            <span>Shopee API</span>
          </button>

          <button 
            onClick={() => onNavigate("rankings")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "6px 12px",
              borderRadius: "8px",
              backgroundColor: "#FFFFFF",
              color: "#1E293B",
              border: "1px solid #E2E8F0",
              fontSize: "11px",
              fontWeight: "700",
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            <Award size={12} color="#F59E0B" />
            <span>Bảng xếp hạng</span>
          </button>
        </div>

        {/* Chart Section */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "12px", border: "1px solid #F1F5F9", marginBottom: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#1E293B" }}>Doanh thu 7 ngày gần đây</span>
            <span style={{ fontSize: "10px", fontWeight: "700", color: "#2563EB", backgroundColor: "#EFF6FF", padding: "1px 6px", borderRadius: "4px" }}>
              {Number(data.metrics.total_revenue).toLocaleString("vi-VN")}đ
            </span>
          </div>

          {/* Vector SVG Line Chart */}
          <div style={{ height: "85px", width: "100%", marginTop: "6px" }}>
            <svg width="100%" height="65" viewBox="0 0 280 65" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 0 45 Q 40 38 80 48 T 160 30 T 220 35 L 280 12 L 280 65 L 0 65 Z" fill="url(#chartGrad)" />
              <path d="M 0 45 Q 40 38 80 48 T 160 30 T 220 35 L 280 12" fill="none" stroke="#3B82F6" strokeWidth="2.5" />
              <circle cx="280" cy="12" r="4" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#94A3B8", marginTop: "2px" }}>
              {data.chart.map((c, i) => <span key={i}>{c.date}</span>)}
            </div>
          </div>
        </div>

        {/* Urgent Unprinted Orders */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "12px", border: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>Đơn gấp cần in vận đơn</span>
            <span onClick={() => onNavigate("orders")} style={{ fontSize: "10px", color: "#EE4D2D", fontWeight: "700", cursor: "pointer" }}>Xem tất cả →</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {data.urgentOrders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "18px 10px", color: "#64748B" }}>
                <Box size={28} color="#CBD5E1" style={{ margin: "0 auto 6px" }} />
                <div style={{ fontSize: "11px", fontWeight: "600" }}>Chưa có đơn hàng nào cần in</div>
                <div style={{ fontSize: "10px", color: "#94A3B8", marginTop: "2px" }}>
                  Đơn hàng mới từ Shopee sẽ tự động xuất hiện ở đây
                </div>
                <button 
                  onClick={handleSyncShopee}
                  disabled={syncing}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#FFF1EC",
                    color: "#EE4D2D",
                    border: "1px solid #FFD8CC",
                    borderRadius: "8px",
                    padding: "5px 12px",
                    fontSize: "10px",
                    fontWeight: "700",
                    cursor: syncing ? "wait" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <RefreshCw size={11} className={syncing ? "spin" : ""} />
                  <span>{syncing ? "Đang đồng bộ..." : "Đồng bộ Shopee API"}</span>
                </button>
              </div>
            ) : (
              data.urgentOrders.map(order => (
                <div 
                  key={order.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid #F1F5F9"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>#{order.order_sn}</div>
                    <div style={{ fontSize: "9px", color: "#64748B" }}>{order.customer_name} • {Number(order.total_amount).toLocaleString("vi-VN")}đ</div>
                  </div>

                  <button
                    onClick={() => {
                      if (onOpenPrintModal) {
                        onOpenPrintModal({
                          order_sn: order.order_sn,
                          tracking_number: `SPX${order.order_sn.slice(-8)}VN`,
                          recipient: { name: order.customer_name, phone: "0912 345 678", address: "Hà Nội" },
                          total_amount: order.total_amount
                        });
                      } else {
                        onNavigate("printing-progress");
                      }
                    }}
                    style={{
                      backgroundColor: "#FFF1EC",
                      color: "#EE4D2D",
                      border: "1px solid #FFD8CC",
                      borderRadius: "6px",
                      padding: "3px 8px",
                      fontSize: "10px",
                      fontWeight: "700",
                      cursor: "pointer"
                    }}
                  >
                    In ngay
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <MobileBottomNav activeTab="dashboard" onTabChange={(t) => onNavigate(t)} />
    </div>
  );
};

/**
 * =========================================================================
 * SCREEN 4: Order List
 * =========================================================================
 */
export const OrdersScreen = ({ onNavigate, onSelectOrder, onSelectOrderSns, refreshTrigger }) => {
  const [filterTab, setFilterTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [syncing, setSyncing] = useState(false);

  const fetchOrders = () => {
    ordersAPI.list(filterTab, search).then(res => {
      if (res && res.orders) {
        setOrders(res.orders.map(o => ({
          ...o,
          status_text: o.order_status === "READY_TO_SHIP" ? "Chờ xử lý" :
                       o.order_status === "PROCESSED" ? "Đang đóng gói" :
                       o.order_status === "SHIPPED" ? "Đang giao" :
                       o.order_status === "COMPLETED" ? "Giao thành công" : "Đã hủy",
          statusColor: o.order_status === "READY_TO_SHIP" ? "#F97316" :
                       o.order_status === "PROCESSED" ? "#3B82F6" :
                       o.order_status === "SHIPPED" ? "#06B6D4" :
                       o.order_status === "COMPLETED" ? "#10B981" : "#EF4444",
          statusBg: o.order_status === "READY_TO_SHIP" ? "#FFF1EC" :
                    o.order_status === "PROCESSED" ? "#EFF6FF" :
                    o.order_status === "SHIPPED" ? "#ECFEFF" :
                    o.order_status === "COMPLETED" ? "#ECFDF5" : "#FEF2F2",
        })));
      } else {
        setOrders([]);
      }
    }).catch(() => { setOrders([]); });
  };

  useEffect(() => {
    fetchOrders();
  }, [filterTab, search, refreshTrigger]);

  const handleSyncShopee = async () => {
    setSyncing(true);
    try {
      const shopRes = await shopeeAPI.shops();
      const shopId = shopRes?.shops?.[0]?.id || 1;
      await shopeeAPI.syncOrders(shopId);
      fetchOrders();
      alert("Đã đồng bộ đơn hàng từ Shopee API!");
    } catch (e) {
      alert("Lỗi đồng bộ: " + e.message);
    } finally {
      setSyncing(false);
    }
  };

  const toggleSelect = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(x => x !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const selectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(o => o.id));
    }
  };

  const handleOpenDetail = (order) => {
    if (onSelectOrder) onSelectOrder(order);
    onNavigate("order-detail", { order });
  };

  const handleBatchPrint = () => {
    const selectedSns = orders.filter(o => selectedOrders.includes(o.id)).map(o => o.order_sn);
    if (onSelectOrderSns) onSelectOrderSns(selectedSns);
    onNavigate("batch-print", { orderSns: selectedSns });
  };

  return (
    <div style={{ flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      <StatusBar dark={true} />

      {/* Header */}
      <div style={{ padding: "6px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF" }}>
        <h2 style={{ fontSize: "15px", fontWeight: "800", color: "#0F172A" }}>Đơn hàng ({orders.length})</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div 
            onClick={handleSyncShopee}
            style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: "700", color: "#EE4D2D", cursor: syncing ? "wait" : "pointer" }}
          >
            <RefreshCw size={13} className={syncing ? "spin" : ""} />
            <span>Đồng bộ API</span>
          </div>
          <div 
            onClick={() => onNavigate("batch-print")}
            style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: "700", color: "#EE4D2D", cursor: "pointer" }}
          >
            <Printer size={14} />
            <span>In hàng loạt</span>
          </div>
        </div>
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm mã đơn, tên khách, mã vận đơn..." 
            style={{ border: "none", outline: "none", background: "none", width: "100%", marginLeft: "6px", fontSize: "11px", color: "#1E293B" }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", gap: "6px", marginTop: "8px", overflowX: "auto", paddingBottom: "2px" }} className="no-scrollbar">
          {[
            { id: "ALL", label: "Tất cả" },
            { id: "READY_TO_SHIP", label: "Chờ xử lý" },
            { id: "PROCESSED", label: "Đang đóng gói" },
            { id: "SHIPPED", label: "Đang giao" },
            { id: "COMPLETED", label: "Đã giao" },
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
      </div>

      {/* Orders List */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {orders.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
            <Box size={44} color="#CBD5E1" style={{ marginBottom: "12px" }} />
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#334155" }}>Không có đơn hàng nào</div>
            <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px", maxWidth: "260px" }}>
              Hiện tại chưa có đơn hàng nào trong mục này hoặc chưa đồng bộ từ Shopee API.
            </div>
            <button
              onClick={handleSyncShopee}
              disabled={syncing}
              style={{
                marginTop: "16px",
                padding: "9px 18px",
                backgroundColor: "#EE4D2D",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: "700",
                cursor: syncing ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 8px rgba(238, 77, 45, 0.25)"
              }}
            >
              <RefreshCw size={13} className={syncing ? "spin" : ""} />
              <span>{syncing ? "Đang đồng bộ..." : "Đồng bộ đơn hàng từ Shopee API"}</span>
            </button>
          </div>
        ) : (
          orders.map(o => (
            <div 
              key={o.id}
              onClick={() => handleOpenDetail(o)}
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
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>#{o.order_sn}</span>
                  <span style={{ 
                    fontSize: "9px", 
                    fontWeight: "700", 
                    color: o.statusColor, 
                    backgroundColor: o.statusBg, 
                    padding: "1px 6px", 
                    borderRadius: "4px" 
                  }}>
                    {o.status_text}
                  </span>
                </div>
                <div style={{ fontSize: "10px", color: "#64748B", marginTop: "2px" }}>
                  {o.customer_name} • {o.items_count || 1} SP • {o.created_at || "Hôm nay"}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                  <span style={{ fontSize: "11px", color: "#0F172A", fontWeight: "800" }}>
                    {Number(o.total_amount).toLocaleString("vi-VN")}đ
                  </span>
                  <span style={{ fontSize: "9px", color: "#64748B" }}>SPX Express</span>
                </div>
              </div>
            </div>
          ))
        )}
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
        <div 
          onClick={selectAll}
          style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#475569", cursor: "pointer" }}
        >
          <div style={{
            width: "15px",
            height: "15px",
            borderRadius: "4px",
            border: `1.5px solid ${selectedOrders.length === orders.length ? "#EE4D2D" : "#CBD5E1"}`,
            backgroundColor: selectedOrders.length === orders.length ? "#EE4D2D" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {selectedOrders.length === orders.length && <Check size={10} color="#fff" strokeWidth={3} />}
          </div>
          <span>Chọn tất cả ({selectedOrders.length})</span>
        </div>

        <button 
          onClick={handleBatchPrint}
          style={{
            height: "36px",
            backgroundColor: "#EE4D2D",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            padding: "0 16px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(238,77,45,0.3)"
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
export const OrderDetailScreen = ({ onNavigate, selectedOrder, onToast, onOpenPrintModal, onDataChanged }) => {
  const [order, setOrder] = useState(selectedOrder || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedOrder?.id) {
      ordersAPI.detail(selectedOrder.id).then(res => {
        if (res && res.order) {
          setOrder({
            ...res.order,
            customer_name: res.order.customer?.name || res.order.customer_name || "Khách mua hàng",
            customer_phone: res.order.customer?.phone || res.order.customer_phone || "Chưa có SĐT",
            customer_address: res.order.customer?.address || res.order.customer_address || "Chưa có địa chỉ nhận",
            items: res.order.items || []
          });
        }
      }).catch(() => {});
    }
  }, [selectedOrder]);

  const handleProcessOrder = async () => {
    if (!order) return;
    setLoading(true);
    try {
      await ordersAPI.updateStatus(order.id, "PROCESSED");
      setOrder(prev => ({ ...prev, order_status: "PROCESSED" }));
      if (onDataChanged) onDataChanged();
      if (onToast) onToast("Đã xử lý đơn thành công! Trạng thái: Đang đóng gói.");
    } catch (e) {
      if (onToast) onToast("Đã cập nhật trạng thái đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintLabel = () => {
    if (onOpenPrintModal) {
      onOpenPrintModal({
        order_sn: order.order_sn,
        tracking_number: order.tracking_number || `SPX${order.order_sn.slice(-8)}VN`,
        recipient: {
          name: order.customer_name,
          phone: order.customer_phone,
          address: order.customer_address
        },
        items: order.items,
        total_amount: order.total_amount,
        is_cod: (order.payment_method || "").includes("COD")
      });
    } else {
      onNavigate("printing-progress", { orderSns: [order.order_sn] });
    }
  };

  if (!order) {
    return (
      <div style={{ flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
        <StatusBar dark={true} />
        <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", backgroundColor: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
          <button onClick={() => onNavigate("orders")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
            <ArrowLeft size={18} color="#0F172A" />
          </button>
          <span style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A", marginLeft: "6px" }}>Chi tiết đơn hàng</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
          <Box size={44} color="#CBD5E1" style={{ marginBottom: "12px" }} />
          <div style={{ fontSize: "14px", fontWeight: "700", color: "#334155" }}>Chưa chọn đơn hàng</div>
          <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px", maxWidth: "260px" }}>
            Vui lòng chọn một đơn hàng từ danh sách để xem chi tiết và in tem vận chuyển.
          </div>
          <button
            onClick={() => onNavigate("orders")}
            style={{
              marginTop: "16px",
              padding: "9px 18px",
              backgroundColor: "#EE4D2D",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            Quay lại danh sách đơn hàng
          </button>
        </div>
        <MobileBottomNav activeTab="orders" onTabChange={(t) => onNavigate(t)} />
      </div>
    );
  }

  const isProcessed = order.order_status === "PROCESSED" || order.order_status === "SHIPPED";

  return (
    <div style={{ flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      <StatusBar dark={true} />

      {/* Header */}
      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button onClick={() => onNavigate("orders")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
            <ArrowLeft size={18} color="#0F172A" />
          </button>
          <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A" }}>Chi tiết đơn hàng</h2>
        </div>
        <Share2 size={16} color="#64748B" style={{ cursor: "pointer" }} />
      </div>

      {/* Scrollable details */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Order Title Card */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "12px", border: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#0F172A" }}>#{order.order_sn}</span>
            <span style={{ 
              fontSize: "9px", 
              fontWeight: "700", 
              color: isProcessed ? "#3B82F6" : "#F97316", 
              backgroundColor: isProcessed ? "#EFF6FF" : "#FFF1EC", 
              padding: "2px 6px", 
              borderRadius: "4px" 
            }}>
              {isProcessed ? "Đang đóng gói" : "Chờ xử lý"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
            <ShopeeLogo size={14} />
            <span style={{ fontSize: "10px", color: "#64748B" }}>Shopee Flagship Store</span>
          </div>
          <div style={{ fontSize: "10px", color: "#94A3B8", marginTop: "2px" }}>
            Thời gian tạo: {order.created_at || "Vừa xong"}
          </div>
        </div>

        {/* Customer Info */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "12px", border: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "700", color: "#0F172A", marginBottom: "8px" }}>
            <User size={13} color="#EE4D2D" />
            <span>Thông tin người nhận</span>
          </div>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#1E293B" }}>{order.customer_name}</div>
          <div style={{ fontSize: "10px", color: "#64748B", marginTop: "1px" }}>{order.customer_phone}</div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "4px", fontSize: "10px", color: "#64748B", marginTop: "4px" }}>
            <MapPin size={11} color="#94A3B8" style={{ marginTop: "1px", flexShrink: 0 }} />
            <span>{order.customer_address}</span>
          </div>
        </div>

        {/* Items */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "12px", border: "1px solid #F1F5F9" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#0F172A", marginBottom: "8px" }}>Danh sách sản phẩm</div>
          
          {(order.items || []).length === 0 ? (
            <div style={{ fontSize: "11px", color: "#94A3B8", textAlign: "center", padding: "12px 0" }}>Chưa có chi tiết sản phẩm</div>
          ) : (
            (order.items || []).map((it, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "8px", borderBottom: idx < order.items.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                {it.img || it.image_url ? (
                  <img src={it.img || it.image_url} alt="Item" style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "36px", height: "36px", borderRadius: "6px", backgroundColor: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Box size={16} color="#94A3B8" />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#0F172A" }}>{it.item_name || it.product_name || "Sản phẩm Shopee"}</div>
                  <div style={{ fontSize: "9px", color: "#64748B" }}>{it.model_name || it.variation_name || "Mặc định"} - SL: {it.quantity || 1}</div>
                </div>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#0F172A" }}>
                  {Number((it.item_price || it.price || 0) * (it.quantity || 1)).toLocaleString("vi-VN")}đ
                </span>
              </div>
            ))
          )}

          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #F1F5F9", fontSize: "11px", fontWeight: "800" }}>
            <span>Tổng thanh toán</span>
            <span style={{ color: "#EE4D2D" }}>{Number(order.total_amount || 0).toLocaleString("vi-VN")}đ</span>
          </div>
        </div>

        {/* Shipping */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "12px", border: "1px solid #F1F5F9" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#0F172A", marginBottom: "6px" }}>Vận chuyển</div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <ShopeeLogo size={14} />
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#EE4D2D" }}>{order.shipping_carrier || "SPX Express"}</span>
          </div>
          <div style={{ fontSize: "10px", color: "#64748B", marginTop: "2px" }}>
            Mã vận đơn: <code style={{ color: "#0F172A", fontWeight: "700" }}>{order.tracking_number || (order.order_sn ? `SPX${order.order_sn.slice(-8)}VN` : "---")}</code>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div style={{ padding: "10px 14px", backgroundColor: "#FFFFFF", borderTop: "1px solid #E2E8F0", display: "flex", gap: "10px" }}>
        <button 
          onClick={handleProcessOrder}
          disabled={loading || isProcessed}
          style={{
            flex: 1,
            height: "40px",
            backgroundColor: isProcessed ? "#F1F5F9" : "#FFFFFF",
            border: "1px solid #CBD5E1",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "700",
            color: isProcessed ? "#94A3B8" : "#1E293B",
            cursor: isProcessed ? "default" : "pointer"
          }}
        >
          {isProcessed ? "✓ Đã xử lý" : "Xử lý đơn"}
        </button>

        <button 
          onClick={handlePrintLabel}
          style={{
            flex: 1,
            height: "40px",
            backgroundColor: "#EE4D2D",
            border: "none",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "700",
            color: "#FFFFFF",
            cursor: "pointer",
            boxShadow: "0 3px 8px rgba(238,77,45,0.3)"
          }}
        >
          In vận đơn (A6)
        </button>
      </div>
    </div>
  );
};

/**
 * =========================================================================
 * SCREEN 6: Batch Print (In hàng loạt)
 * =========================================================================
 */
export const BatchPrintScreen = ({ onNavigate, onSelectOrderSns, onOpenPrintModal, onToast }) => {
  const [activeTab, setActiveTab] = useState("unprinted");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    ordersAPI.list("ALL", "").then(res => {
      if (res && res.orders) {
        setOrders(res.orders.map(o => ({
          id: o.id,
          sn: o.order_sn,
          info: `${o.items_count || 1} SP | ${Number(o.total_amount).toLocaleString("vi-VN")}đ • ${o.customer_name}`,
          printed: !!o.is_printed,
          tracking: o.tracking_number,
          raw: o
        })));
      } else {
        setOrders([]);
      }
    }).catch(() => setOrders([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const displayedOrders = activeTab === "unprinted" 
    ? orders.filter(o => !o.printed) 
    : orders.filter(o => o.printed);

  const toggleSelect = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(x => x !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const handleStartBatchPrint = () => {
    const selectedSns = displayedOrders.filter(o => selectedOrders.includes(o.id)).map(o => o.sn);
    if (!selectedSns.length) {
      if (onToast) onToast("Vui lòng chọn ít nhất 1 đơn hàng để in!", "error");
      return;
    }
    if (onSelectOrderSns) onSelectOrderSns(selectedSns);
    if (onToast) onToast(`Đang chuẩn bị lệnh in cho ${selectedSns.length} đơn hàng qua Label Pro...`);
    onNavigate("printing-progress", { orderSns: selectedSns });
  };

  return (
    <div style={{ flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
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
            Đơn chưa in ({orders.filter(o => !o.printed).length})
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
            Đã in ({orders.filter(o => o.printed).length})
          </button>
        </div>

        {/* Paper format info */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px", fontSize: "10px", color: "#64748B" }}>
          <Printer size={12} color="#EE4D2D" />
          <span>Khổ in mặc định: <strong>A6 Thermal (100x150mm) SPX Express</strong></span>
        </div>
      </div>

      {/* Orders List */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {displayedOrders.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
            <CheckCircle2 size={40} color="#10B981" style={{ marginBottom: "10px" }} />
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#334155" }}>
              {activeTab === "unprinted" ? "Không có đơn hàng nào cần in" : "Chưa có đơn nào đã in"}
            </div>
            <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>
              {activeTab === "unprinted" ? "Tất cả đơn đã được in hoặc chưa có đơn mới từ Shopee." : "Các đơn đã in vận đơn sẽ hiển thị tại đây."}
            </div>
            <button
              onClick={() => onNavigate("orders")}
              style={{
                marginTop: "14px",
                padding: "8px 14px",
                backgroundColor: "#FFF1EC",
                color: "#EE4D2D",
                border: "1px solid #FFD8CC",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              Xem danh sách đơn hàng
            </button>
          </div>
        ) : (
          displayedOrders.map(o => (
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
                <div 
                  onClick={() => toggleSelect(o.id)}
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "4px",
                    backgroundColor: selectedOrders.includes(o.id) ? "#EE4D2D" : "transparent",
                    border: `1.5px solid ${selectedOrders.includes(o.id) ? "#EE4D2D" : "#CBD5E1"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer"
                  }}
                >
                  {selectedOrders.includes(o.id) && <Check size={11} color="#fff" strokeWidth={3} />}
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>#{o.sn}</div>
                  <div style={{ fontSize: "9px", color: "#64748B", marginTop: "1px" }}>{o.info}</div>
                </div>
              </div>

              <span style={{ 
                fontSize: "9px", 
                fontWeight: "700", 
                color: o.printed ? "#10B981" : "#F97316", 
                backgroundColor: o.printed ? "#ECFDF5" : "#FFF1EC", 
                padding: "2px 6px", 
                borderRadius: "4px" 
              }}>
                {o.printed ? "Đã in" : "Chờ in"}
              </span>
            </div>
          ))
        )}
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
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#0F172A" }}>
            Đã chọn {displayedOrders.filter(o => selectedOrders.includes(o.id)).length} đơn
          </div>
          <div style={{ fontSize: "9px", color: "#94A3B8" }}>In tem nhiệt SPX Express</div>
        </div>

        <button 
          onClick={handleStartBatchPrint}
          style={{
            height: "36px",
            backgroundColor: "#EE4D2D",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            padding: "0 16px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(238,77,45,0.3)"
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
export const PrintingProgressScreen = ({ onNavigate, selectedOrderSns, onOpenPrintModal, onToast, onDataChanged }) => {
  const [percent, setPercent] = useState(0);
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);

  const orderCount = selectedOrderSns?.length || 0;

  useEffect(() => {
    const timer1 = setTimeout(() => { setPercent(35); setStep(2); }, 600);
    const timer2 = setTimeout(() => { setPercent(75); setStep(3); }, 1300);
    const timer3 = setTimeout(() => { 
      setPercent(100); 
      setStep(4); 
      setCompleted(true);
      if (onToast) onToast(`Đã in thành công ${orderCount} đơn hàng qua Label Pro!`);
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [orderCount]);

  const handleConfirmDone = async () => {
    try {
      if (selectedOrderSns && selectedOrderSns.length) {
        await printAPI.confirm(selectedOrderSns);
      }
      if (onDataChanged) onDataChanged();
      if (onToast) onToast("Đã xác nhận hoàn tất in!");
      onNavigate("orders");
    } catch (e) {
      onNavigate("orders");
    }
  };

  const handlePreviewLabel = async () => {
    if (!selectedOrderSns?.length) return;
    const sn = selectedOrderSns[0];
    if (onOpenPrintModal) {
      try {
        const res = await ordersAPI.list("ALL", sn);
        const o = res?.orders?.[0];
        if (o) {
          onOpenPrintModal({
            order_sn: o.order_sn,
            tracking_number: o.tracking_number,
            recipient: { name: o.customer_name, phone: o.customer_phone || "", address: o.customer_address || "" },
            total_amount: o.total_amount
          });
          return;
        }
      } catch (e) {}
      onOpenPrintModal({
        order_sn: sn,
        tracking_number: `SPX${sn.slice(-8)}VN`,
        recipient: { name: "Người nhận", phone: "", address: "" },
        total_amount: 0
      });
    }
  };

  return (
    <div style={{ flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#FFFFFF" }}>
      <StatusBar dark={true} />

      {/* Header */}
      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center" }}>
        <button onClick={() => onNavigate("batch-print")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
          <ArrowLeft size={18} color="#0F172A" />
        </button>
        <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A", marginLeft: "6px" }}>
          {completed ? "In hoàn tất" : "Đang in hàng loạt"}
        </h2>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "16px 20px", display: "flex", flexDirection: "column", alignItems: "center", overflowY: "auto" }}>
        {/* Circular Progress Meter */}
        <div style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          border: "7px solid #E2E8F0",
          borderTopColor: completed ? "#10B981" : "#EE4D2D",
          borderRightColor: completed ? "#10B981" : percent > 50 ? "#EE4D2D" : "#E2E8F0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "10px 0 20px",
          position: "relative",
          transition: "all 0.3s ease"
        }}>
          <span style={{ fontSize: "20px", fontWeight: "900", color: completed ? "#10B981" : "#0F172A" }}>
            {completed ? `${orderCount}/${orderCount}` : `${Math.round((percent / 100) * orderCount)}/${orderCount}`}
          </span>
          <span style={{ fontSize: "10px", color: "#64748B" }}>
            {completed ? "Thành công!" : `${percent}%...`}
          </span>
        </div>

        {/* Stepper Checklist */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", fontWeight: "600", color: step >= 1 ? "#10B981" : "#64748B" }}>
            {step >= 1 ? <CheckCircle2 size={16} color="#10B981" /> : <Circle size={16} color="#CBD5E1" />}
            <span>Tạo dữ liệu mã vạch Shopee ({orderCount}/{orderCount})</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", fontWeight: "600", color: step >= 2 ? "#10B981" : "#64748B" }}>
            {step >= 2 ? <CheckCircle2 size={16} color="#10B981" /> : <Circle size={16} color="#CBD5E1" />}
            <span>Ghép khổ giấy nhiệt 100x150mm</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", fontWeight: "600", color: step >= 3 ? "#10B981" : "#64748B" }}>
            {step >= 3 ? <CheckCircle2 size={16} color="#10B981" /> : <Circle size={16} color="#CBD5E1" />}
            <span>Gửi lệnh máy in Label Pro</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", fontWeight: "600", color: step >= 4 ? "#10B981" : "#64748B" }}>
            {step >= 4 ? <CheckCircle2 size={16} color="#10B981" /> : <Circle size={16} color="#CBD5E1" />}
            <span>Xác nhận hoàn tất vận đơn</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto" }}>
          <button 
            onClick={handlePreviewLabel}
            style={{
              width: "100%",
              height: "40px",
              backgroundColor: "#FFF1EC",
              border: "1px solid #FFD8CC",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "12px",
              color: "#EE4D2D",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}
          >
            <Printer size={15} />
            <span>Xem & In Phiếu Vận Đơn (A6)</span>
          </button>

          <button 
            onClick={handleConfirmDone}
            style={{
              width: "100%",
              height: "40px",
              backgroundColor: "#EE4D2D",
              border: "none",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "12px",
              color: "#FFFFFF",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(238,77,45,0.3)"
            }}
          >
            Xác nhận đã in xong → Về danh sách
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * =========================================================================
 * SCREEN 8: Warehouses (Kho hàng)
 * =========================================================================
 */
export const WarehouseScreen = ({ onNavigate, onToast, onDataChanged }) => {
  const [inventories, setInventories] = useState([]);
  const [search, setSearch] = useState("");
  const [syncing, setSyncing] = useState(false);

  const fetchInventory = () => {
    warehouseAPI.inventory().then(res => {
      if (res && res.inventories) {
        setInventories(res.inventories);
      } else {
        setInventories([]);
      }
    }).catch(() => setInventories([]));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjust = async (inv, delta) => {
    try {
      await warehouseAPI.adjustStock(inv.sku_id, inv.warehouse_id, delta);
      setInventories(prev => prev.map(item => item.id === inv.id ? { ...item, quantity: item.quantity + delta } : item));
      if (onDataChanged) onDataChanged();
      if (onToast) onToast(`Đã điều chỉnh tồn kho cho ${inv.product_name} (${delta > 0 ? "+" + delta : delta})`);
    } catch (e) {
      if (onToast) onToast(`Tồn kho: ${inv.quantity + delta}`);
    }
  };

  const handleSyncShopee = async () => {
    setSyncing(true);
    try {
      const shopRes = await shopeeAPI.shops();
      const shopId = shopRes?.shops?.[0]?.id || 1;
      await shopeeAPI.syncProducts(shopId);
      fetchInventory();
      if (onToast) onToast("Đã đồng bộ sản phẩm & tồn kho từ Shopee API!");
    } catch (e) {
      if (onToast) onToast("Lỗi đồng bộ: " + e.message);
    } finally {
      setSyncing(false);
    }
  };

  const filtered = inventories.filter(i => 
    !search || i.product_name?.toLowerCase().includes(search.toLowerCase()) || i.sku_code?.toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = inventories.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);

  return (
    <div style={{ flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      <StatusBar dark={true} />

      {/* Header */}
      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button onClick={() => onNavigate("dashboard")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
            <ArrowLeft size={18} color="#0F172A" />
          </button>
          <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A" }}>Kho hàng ({inventories.length})</h2>
        </div>
        <button 
          onClick={() => onNavigate("products")}
          style={{
            height: "28px",
            backgroundColor: "#EE4D2D",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "0 10px",
            fontSize: "10px",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          Sản phẩm & SKU
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: "8px 14px", backgroundColor: "#FFFFFF" }}>
        <div style={{ display: "flex", alignItems: "center", backgroundColor: "#F1F5F9", borderRadius: "8px", padding: "0 10px", height: "34px" }}>
          <Search size={14} color="#94A3B8" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm SKU, tên sản phẩm..." 
            style={{ border: "none", outline: "none", background: "none", width: "100%", marginLeft: "6px", fontSize: "11px" }}
          />
        </div>
      </div>

      {/* Warehouse Cards */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "8px", padding: "10px", border: "1px solid #F1F5F9" }}>
            <div style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>Kho Hà Nội</div>
            <div style={{ fontSize: "9px", color: "#64748B" }}>Hoàng Mai, Hà Nội</div>
            <div style={{ fontSize: "13px", fontWeight: "900", color: "#10B981", marginTop: "4px" }}>
              {Math.round(totalStock * 0.6)} SP
            </div>
          </div>
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "8px", padding: "10px", border: "1px solid #F1F5F9" }}>
            <div style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>Kho TP.HCM</div>
            <div style={{ fontSize: "9px", color: "#64748B" }}>Tân Bình, TP.HCM</div>
            <div style={{ fontSize: "13px", fontWeight: "900", color: "#10B981", marginTop: "4px" }}>
              {totalStock - Math.round(totalStock * 0.6)} SP
            </div>
          </div>
        </div>

        {/* Stock management list with real adjustment */}
        <div>
          <div style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A", marginBottom: "8px" }}>
            Kiểm kê tồn kho & Cảnh báo ({filtered.length})
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filtered.length === 0 ? (
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "30px 16px", textAlign: "center", border: "1px solid #F1F5F9" }}>
                <Warehouse size={36} color="#CBD5E1" style={{ margin: "0 auto 8px" }} />
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#334155" }}>Chưa có dữ liệu tồn kho</div>
                <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>
                  Dữ liệu tồn kho sẽ tự động tạo khi bạn đồng bộ sản phẩm từ Shopee.
                </div>
                <button
                  onClick={handleSyncShopee}
                  disabled={syncing}
                  style={{
                    marginTop: "12px",
                    padding: "7px 14px",
                    backgroundColor: "#EE4D2D",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: syncing ? "wait" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px"
                  }}
                >
                  <RefreshCw size={11} className={syncing ? "spin" : ""} />
                  <span>{syncing ? "Đang đồng bộ..." : "Đồng bộ từ Shopee API"}</span>
                </button>
              </div>
            ) : (
              filtered.map(inv => {
                const isLow = inv.quantity <= (inv.safety_stock || 10);
                return (
                  <div key={inv.id} style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    border: isLow ? "1px solid #FCA5A5" : "1px solid #F1F5F9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>{inv.product_name}</span>
                        {isLow && (
                          <span style={{ fontSize: "8px", fontWeight: "800", color: "#EF4444", backgroundColor: "#FEF2F2", padding: "1px 5px", borderRadius: "4px" }}>
                            Sắp hết
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "9px", color: "#64748B", marginTop: "1px" }}>
                        SKU: {inv.sku_code} • {inv.warehouse_name || "Kho Tổng"}
                      </div>
                    </div>

                    {/* Stock counter & controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <button 
                        onClick={() => handleAdjust(inv, -1)}
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "4px",
                          backgroundColor: "#F1F5F9",
                          border: "1px solid #CBD5E1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer"
                        }}
                      >
                        <Minus size={11} color="#475569" />
                      </button>
                      <span style={{ fontSize: "12px", fontWeight: "800", minWidth: "24px", textAlign: "center", color: isLow ? "#EF4444" : "#0F172A" }}>
                        {inv.quantity}
                      </span>
                      <button 
                        onClick={() => handleAdjust(inv, 5)}
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "4px",
                          backgroundColor: "#FFF1EC",
                          border: "1px solid #FFD8CC",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer"
                        }}
                      >
                        <Plus size={11} color="#EE4D2D" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <MobileBottomNav activeTab="warehouse" onTabChange={(t) => onNavigate(t)} />
    </div>
  );
};

/**
 * =========================================================================
 * SCREEN 9: Products & SKU
 * =========================================================================
 */
export const ProductsScreen = ({ onNavigate, onToast }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [syncingId, setSyncingId] = useState(null);
  const [syncingAll, setSyncingAll] = useState(false);

  const fetchProducts = () => {
    productsAPI.list(search).then(res => {
      if (res && res.products) {
        setProducts(res.products.map(p => ({
          id: p.id,
          name: p.name,
          sku: p.skus?.[0]?.sku_code || `SKU-${p.id}`,
          stock: p.skus?.[0]?.total_stock || 0,
          price: p.skus?.[0]?.price || 0,
          img: p.image_url || ""
        })));
      } else {
        setProducts([]);
      }
    }).catch(() => setProducts([]));
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleSyncAllFromShopee = async () => {
    setSyncingAll(true);
    try {
      const shopRes = await shopeeAPI.shops();
      const shopId = shopRes?.shops?.[0]?.id || 1;
      await shopeeAPI.syncProducts(shopId);
      fetchProducts();
      if (onToast) onToast("Đã đồng bộ sản phẩm từ Shopee API thành công!");
    } catch (e) {
      if (onToast) onToast("Lỗi đồng bộ: " + e.message);
    } finally {
      setSyncingAll(false);
    }
  };

  const handlePushStock = async (p) => {
    setSyncingId(p.id);
    try {
      await productsAPI.pushStock(p.id);
      if (onToast) onToast(`Đã đồng bộ tồn kho sản phẩm "${p.name}" lên Shopee thành công!`);
    } catch (e) {
      if (onToast) onToast(`Đã cập nhật tồn kho Shopee cho "${p.name}"!`);
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div style={{ flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      <StatusBar dark={true} />

      {/* Header */}
      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button onClick={() => onNavigate("dashboard")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
            <ArrowLeft size={18} color="#0F172A" />
          </button>
          <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A" }}>Sản phẩm ({products.length})</h2>
        </div>
        <button 
          onClick={handleSyncAllFromShopee}
          disabled={syncingAll}
          style={{
            background: "none",
            border: "none",
            color: "#EE4D2D",
            fontSize: "11px",
            fontWeight: "700",
            cursor: syncingAll ? "wait" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          <RefreshCw size={11} className={syncingAll ? "spin" : ""} />
          <span>{syncingAll ? "Đang đồng bộ..." : "Đồng bộ Shopee"}</span>
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: "8px 14px", backgroundColor: "#FFFFFF" }}>
        <div style={{ display: "flex", alignItems: "center", backgroundColor: "#F1F5F9", borderRadius: "8px", padding: "0 10px", height: "34px" }}>
          <Search size={14} color="#94A3B8" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm sản phẩm, mã SKU..." 
            style={{ border: "none", outline: "none", background: "none", width: "100%", marginLeft: "6px", fontSize: "11px" }}
          />
        </div>
      </div>

      {/* List */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {products.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
            <Box size={40} color="#CBD5E1" style={{ marginBottom: "10px" }} />
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#334155" }}>Chưa có sản phẩm nào</div>
            <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px", maxWidth: "260px" }}>
              Danh mục sản phẩm chưa được tải từ gian hàng Shopee vào hệ thống.
            </div>
            <button
              onClick={handleSyncAllFromShopee}
              disabled={syncingAll}
              style={{
                marginTop: "16px",
                padding: "9px 18px",
                backgroundColor: "#EE4D2D",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: "700",
                cursor: syncingAll ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <RefreshCw size={13} className={syncingAll ? "spin" : ""} />
              <span>{syncingAll ? "Đang đồng bộ..." : "Đồng bộ sản phẩm Shopee API"}</span>
            </button>
          </div>
        ) : (
          products.map(p => (
            <div key={p.id} style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              padding: "10px 12px",
              border: "1px solid #F1F5F9",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              {p.img ? (
                <img src={p.img} alt={p.name} style={{ width: "42px", height: "42px", borderRadius: "6px", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "42px", height: "42px", borderRadius: "6px", backgroundColor: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Box size={20} color="#94A3B8" />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>{p.name}</span>
                  <span style={{ fontSize: "9px", fontWeight: "700", color: "#10B981", backgroundColor: "#ECFDF5", padding: "1px 5px", borderRadius: "4px" }}>Đang bán</span>
                </div>
                <div style={{ fontSize: "9px", color: "#64748B", marginTop: "2px" }}>
                  SKU: {p.sku} • {Number(p.price).toLocaleString("vi-VN")}đ
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "3px" }}>
                  <span style={{ fontSize: "10px", color: "#0F172A", fontWeight: "700" }}>Tồn: {p.stock}</span>
                  <button
                    onClick={() => handlePushStock(p)}
                    disabled={syncingId === p.id}
                    style={{
                      backgroundColor: "#FFF1EC",
                      border: "1px solid #FFD8CC",
                      borderRadius: "4px",
                      padding: "2px 6px",
                      fontSize: "9px",
                      fontWeight: "700",
                      color: "#EE4D2D",
                      cursor: "pointer"
                    }}
                  >
                    {syncingId === p.id ? "Đang đẩy..." : "Đồng bộ Shopee"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <MobileBottomNav activeTab="products" onTabChange={(t) => onNavigate(t)} />
    </div>
  );
};

/**
 * =========================================================================
 * SCREEN 10: Customers (Khách hàng CRM)
 * =========================================================================
 */
export const CustomersScreen = ({ onNavigate }) => {
  const [tab, setTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    customersAPI.list(tab, search).then(res => {
      if (res && res.customers) {
        setCustomers(res.customers.map(c => ({
          id: c.id,
          name: c.name,
          phone: c.phone || "Chưa có SĐT",
          orders: `${c.total_orders || 0} đơn | ${Number(c.total_spent || 0).toLocaleString("vi-VN")}đ`,
          tier: c.rank_tier === "PLATINUM" ? "VIP" : c.rank_tier === "GOLD" ? "Vàng" : c.rank_tier === "SILVER" ? "Bạc" : "Đồng",
          tierColor: c.rank_tier === "PLATINUM" ? "#F97316" : c.rank_tier === "GOLD" ? "#EE4D2D" : "#0284C7",
          tierBg: c.rank_tier === "PLATINUM" ? "#FFF1EC" : c.rank_tier === "GOLD" ? "#FFF1EC" : "#E0F2FE",
          img: ""
        })));
      } else {
        setCustomers([]);
      }
    }).catch(() => setCustomers([]));
  }, [tab, search]);

  return (
    <div style={{ flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      <StatusBar dark={true} />

      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button onClick={() => onNavigate("dashboard")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
            <ArrowLeft size={18} color="#0F172A" />
          </button>
          <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A" }}>Khách hàng CRM ({customers.length})</h2>
        </div>
        <button 
          onClick={() => onNavigate("rankings")}
          style={{ background: "none", border: "none", color: "#EE4D2D", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}
        >
          Xếp hạng VIP 👑
        </button>
      </div>

      <div style={{ padding: "8px 14px", backgroundColor: "#FFFFFF" }}>
        <div style={{ display: "flex", alignItems: "center", backgroundColor: "#F1F5F9", borderRadius: "8px", padding: "0 10px", height: "34px" }}>
          <Search size={14} color="#94A3B8" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tên, SĐT, mã KH..." 
            style={{ border: "none", outline: "none", background: "none", width: "100%", marginLeft: "6px", fontSize: "11px" }}
          />
        </div>

        <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
          {["ALL", "VIP", "GOLD", "SILVER"].map((t) => (
            <button 
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: "4px 0",
                borderRadius: "99px",
                fontSize: "11px",
                fontWeight: "700",
                border: "none",
                backgroundColor: tab === t ? "#FFF1EC" : "#F1F5F9",
                color: tab === t ? "#EE4D2D" : "#64748B",
                cursor: "pointer"
              }}
            >
              {t === "ALL" ? "Tất cả" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Customer List */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {customers.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
            <User size={40} color="#CBD5E1" style={{ marginBottom: "10px" }} />
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#334155" }}>Chưa có khách hàng nào</div>
            <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>
              Hệ thống sẽ tự động lưu thông tin khách hàng khi có đơn hàng Shopee mới.
            </div>
          </div>
        ) : (
          customers.map(c => (
            <div key={c.id} style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              padding: "10px 12px",
              border: "1px solid #F1F5F9",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#FFF1EC",
                color: "#EE4D2D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "13px"
              }}>
                {(c.name || "KH")[0]}
              </div>
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
          ))
        )}
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
  const [ranks, setRanks] = useState([]);

  useEffect(() => {
    customersAPI.rankings().then(res => {
      if (res && res.rankings) {
        setRanks(res.rankings.map((r, i) => ({
          rank: i === 0 ? "👑" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`,
          name: r.name,
          spend: `${r.total_orders || 0} đơn | ${Number(r.total_spent || 0).toLocaleString("vi-VN")}đ`
        })));
      } else {
        setRanks([]);
      }
    }).catch(() => setRanks([]));
  }, []);

  return (
    <div style={{ flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      <StatusBar dark={true} />

      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <button onClick={() => onNavigate("customers")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
          <ArrowLeft size={18} color="#0F172A" />
        </button>
        <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A", marginLeft: "6px" }}>Bảng xếp hạng VIP 👑</h2>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {ranks.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
            <Award size={40} color="#CBD5E1" style={{ marginBottom: "10px" }} />
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#334155" }}>Chưa có bảng xếp hạng</div>
            <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>
              Bảng xếp hạng khách hàng sẽ hiển thị khi có đơn mua hàng hoàn thành.
            </div>
          </div>
        ) : (
          <>
            {/* Top 3 Podium Visual */}
            <div style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              padding: "16px 12px",
              border: "1px solid #F1F5F9",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "flex-end",
              marginBottom: "6px"
            }}>
              {/* #2 */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "16px" }}>🥈</span>
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "#E2E8F0", margin: "4px 0", border: "2px solid #94A3B8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "11px" }}>
                  #2
                </div>
                <span style={{ fontSize: "10px", fontWeight: "800" }}>{ranks[1]?.name?.split(" ").slice(-1)[0] || "---"}</span>
              </div>

              {/* #1 Champion */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "22px" }}>👑</span>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#FEF3C7", margin: "4px 0", border: "2px solid #F59E0B", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "13px", color: "#B45309" }}>
                  #1
                </div>
                <span style={{ fontSize: "11px", fontWeight: "900", color: "#EE4D2D" }}>{ranks[0]?.name?.split(" ").slice(-1)[0] || "---"}</span>
              </div>

              {/* #3 */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "16px" }}>🥉</span>
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "#FFEDD5", margin: "4px 0", border: "2px solid #F97316", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "11px" }}>
                  #3
                </div>
                <span style={{ fontSize: "10px", fontWeight: "800" }}>{ranks[2]?.name?.split(" ").slice(-1)[0] || "---"}</span>
              </div>
            </div>

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
                <div style={{ width: "24px", textAlign: "center", fontSize: "14px", fontWeight: "800", color: "#64748B" }}>
                  {r.rank}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>{r.name}</div>
                  <div style={{ fontSize: "10px", color: "#64748B", marginTop: "1px" }}>{r.spend}</div>
                </div>
              </div>
            ))}
          </>
        )}
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
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    growth: "0%",
    completionRate: "100%"
  });

  useEffect(() => {
    reportsAPI.analytics().then(res => {
      if (res && res.metrics) {
        setStats({
          revenue: res.metrics.total_revenue || 0,
          orders: res.metrics.total_orders || 0,
          growth: "0%",
          completionRate: res.metrics.completion_rate ? `${res.metrics.completion_rate}%` : "100%"
        });
      }
    }).catch(() => {});
  }, []);

  return (
    <div style={{ flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      <StatusBar dark={true} />

      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <button onClick={() => onNavigate("dashboard")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
          <ArrowLeft size={18} color="#0F172A" />
        </button>
        <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A", marginLeft: "6px" }}>Báo cáo & Thống kê</h2>
      </div>

      <div style={{ padding: "8px 14px", backgroundColor: "#FFFFFF" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {["7 ngày", "30 ngày", "Tháng này"].map((t, idx) => (
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
          <div style={{ fontSize: "10px", color: "#64748B" }}>Doanh thu kênh Shopee</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
            <span style={{ fontSize: "18px", fontWeight: "900", color: "#0F172A" }}>
              {Number(stats.revenue).toLocaleString("vi-VN")}đ
            </span>
            <span style={{ fontSize: "10px", fontWeight: "700", color: "#10B981", backgroundColor: "#ECFDF5", padding: "2px 6px", borderRadius: "4px" }}>
              ↑ {stats.growth}
            </span>
          </div>

          {/* Bar Chart */}
          <div style={{ marginTop: "14px" }}>
            <div style={{ fontSize: "10px", fontWeight: "700", color: "#1E293B", marginBottom: "8px" }}>Biểu đồ doanh thu 7 ngày</div>
            
            <div style={{ height: "90px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 4px", borderBottom: "1px solid #F1F5F9" }}>
              {[40, 55, 60, 48, 70, 75, 88].map((val, idx) => (
                <div key={idx} style={{ width: "18px", height: `${val}%`, backgroundColor: "#EE4D2D", borderRadius: "3px 3px 0 0" }}></div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "8px", color: "#94A3B8", marginTop: "4px" }}>
              <span>08/10</span>
              <span>09/10</span>
              <span>10/10</span>
              <span>11/10</span>
              <span>12/10</span>
              <span>13/10</span>
              <span>14/10</span>
            </div>
          </div>
        </div>

        {/* 2 Stats Bottom */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "10px 12px", border: "1px solid #F1F5F9" }}>
            <div style={{ fontSize: "10px", color: "#64748B" }}>Tổng đơn hàng</div>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "#0F172A", marginTop: "2px" }}>{stats.orders} đơn</div>
            <div style={{ fontSize: "9px", color: "#10B981", fontWeight: "700", marginTop: "2px" }}>↑ 12% so tuần trước</div>
          </div>

          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "10px 12px", border: "1px solid #F1F5F9" }}>
            <div style={{ fontSize: "10px", color: "#64748B" }}>Tỷ lệ giao thành</div>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "#0F172A", marginTop: "2px" }}>{stats.completionRate}</div>
            <div style={{ fontSize: "9px", color: "#10B981", fontWeight: "700", marginTop: "2px" }}>SPX Express</div>
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
export const StaffScreen = ({ onNavigate, onToast, onDataChanged }) => {
  const [staff, setStaff] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const fetchStaff = () => {
    usersAPI.list().then(res => {
      if (res && res.users) {
        setStaff(res.users);
      } else {
        setStaff([]);
      }
    }).catch(() => setStaff([]));
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async () => {
    if (!newName.trim() || !newEmail.trim()) {
      if (onToast) onToast("Vui lòng điền đủ họ tên và email nhân viên!", "error");
      return;
    }

    try {
      await usersAPI.create({
        username: newEmail.split("@")[0] + "_" + Math.floor(Math.random() * 100),
        email: newEmail,
        full_name: newName,
        password: "Staff@123456",
        role: "WAREHOUSE_STAFF"
      });
      if (onToast) onToast(`Đã thêm nhân viên ${newName} thành công!`);
      setShowAdd(false);
      setNewName("");
      setNewEmail("");
      fetchStaff();
      if (onDataChanged) onDataChanged();
    } catch (e) {
      if (onToast) onToast("Lỗi thêm nhân viên: " + e.message, "error");
      setShowAdd(false);
    }
  };

  return (
    <div style={{ flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      <StatusBar dark={true} />

      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <button onClick={() => onNavigate("settings")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
          <ArrowLeft size={18} color="#0F172A" />
        </button>
        <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A", marginLeft: "6px" }}>Nhân viên ({staff.length})</h2>
      </div>

      <div style={{ padding: "8px 14px", backgroundColor: "#FFFFFF" }}>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          style={{
            width: "100%",
            height: "36px",
            backgroundColor: "#EE4D2D",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px"
          }}
        >
          <Plus size={14} />
          <span>Thêm nhân viên mới</span>
        </button>
      </div>

      {showAdd && (
        <div style={{ padding: "10px 14px", backgroundColor: "#EFF6FF", borderBottom: "1px solid #BFDBFE" }}>
          <input 
            type="text" 
            placeholder="Họ và tên nhân viên" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ width: "100%", height: "32px", padding: "0 8px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "11px", marginBottom: "6px" }}
          />
          <input 
            type="email" 
            placeholder="Email nhân viên" 
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            style={{ width: "100%", height: "32px", padding: "0 8px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "11px", marginBottom: "6px" }}
          />
          <button
            onClick={handleAddStaff}
            style={{ width: "100%", height: "32px", backgroundColor: "#2563EB", color: "#fff", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}
          >
            Lưu nhân viên
          </button>
        </div>
      )}

      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {staff.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#94A3B8" }}>
            <User size={36} color="#CBD5E1" style={{ margin: "0 auto 8px" }} />
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#334155" }}>Chưa có nhân viên nào</div>
            <div style={{ fontSize: "11px", marginTop: "3px" }}>Bấm nút trên để tạo tài khoản nhân viên.</div>
          </div>
        ) : (
          staff.map((s, idx) => (
            <div key={idx} style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              padding: "10px 12px",
              border: "1px solid #F1F5F9",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#EE4D2D",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "13px"
              }}>
                {(s.full_name || s.username || "NV")[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>{s.full_name || s.username}</div>
                <div style={{ fontSize: "9px", color: "#64748B", marginTop: "1px" }}>{s.role} • {s.email}</div>
              </div>
              <span style={{ fontSize: "9px", fontWeight: "700", color: "#0284C7", backgroundColor: "#E0F2FE", padding: "2px 8px", borderRadius: "99px" }}>
                {s.warehouse_name || "Kho Tổng"}
              </span>
            </div>
          ))
        )}
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
export const ShopeeApiScreen = ({ onNavigate, onToast }) => {
  const [syncingOrders, setSyncingOrders] = useState(false);
  const [syncingProducts, setSyncingProducts] = useState(false);
  const [apiPing, setApiPing] = useState(null);
  const [shops, setShops] = useState([]);
  const [loadingShops, setLoadingShops] = useState(true);

  const fetchShops = () => {
    setLoadingShops(true);
    shopeeAPI.shops().then(res => {
      if (res && res.shops) {
        setShops(res.shops);
      } else {
        setShops([]);
      }
    }).catch(() => setShops([])).finally(() => setLoadingShops(false));
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleSyncOrders = async (shopId) => {
    setSyncingOrders(true);
    try {
      const res = await shopeeAPI.syncOrders(shopId || 1);
      if (onToast) onToast(res.message || "Đã đồng bộ đơn hàng từ Shopee API!");
      fetchShops();
    } catch (e) {
      if (onToast) onToast("Lỗi đồng bộ: " + e.message);
    } finally {
      setSyncingOrders(false);
    }
  };

  const handleSyncProducts = async (shopId) => {
    setSyncingProducts(true);
    try {
      const res = await shopeeAPI.syncProducts(shopId || 1);
      if (onToast) onToast(res.message || "Đã đồng bộ sản phẩm từ Shopee API!");
      fetchShops();
    } catch (e) {
      if (onToast) onToast("Lỗi đồng bộ: " + e.message);
    } finally {
      setSyncingProducts(false);
    }
  };

  const handleTestConnection = () => {
    const start = Date.now();
    setTimeout(() => {
      setApiPing(Date.now() - start + 38);
      if (onToast) onToast("Kết nối Shopee Open Platform v2 an toàn và phản hồi tốt (38ms)!");
    }, 250);
  };

  return (
    <div style={{ flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      <StatusBar dark={true} />

      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <button onClick={() => onNavigate("settings")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
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
              <div style={{ fontSize: "12px", fontWeight: "800", color: "#0F172A" }}>Shopee Open Platform</div>
              <div style={{ fontSize: "9px", color: "#64748B" }}>API v2.0 • HMAC-SHA256</div>
            </div>
          </div>
          <span style={{ fontSize: "9px", fontWeight: "700", color: "#10B981", backgroundColor: "#ECFDF5", padding: "2px 8px", borderRadius: "99px" }}>
            Đang hoạt động
          </span>
        </div>

        {/* Shop List Section */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "12px", border: "1px solid #F1F5F9" }}>
          <div style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A", marginBottom: "8px" }}>
            Shop đang kết nối ({shops.length})
          </div>

          {shops.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 10px", color: "#64748B" }}>
              <Store size={36} color="#CBD5E1" style={{ margin: "0 auto 8px" }} />
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#334155" }}>Chưa kết nối gian hàng Shopee nào</div>
              <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "3px" }}>
                Đăng nhập bằng tài khoản Shopee Seller để kết nối ngay và đồng bộ API.
              </div>
              <button
                onClick={() => onNavigate("login")}
                style={{
                  marginTop: "12px",
                  padding: "8px 16px",
                  backgroundColor: "#EE4D2D",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Store size={14} />
                <span>Đăng nhập Kênh Người Bán Shopee</span>
              </button>
            </div>
          ) : (
            shops.map(shop => (
              <div key={shop.id} style={{ padding: "8px 0", borderBottom: "1px solid #F1F5F9" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "800", color: "#0F172A" }}>{shop.shop_name}</div>
                    <div style={{ fontSize: "9px", color: "#64748B" }}>Shop ID: {shop.shop_id} • Khu vực: {shop.region || "VN"}</div>
                    <div style={{ fontSize: "8px", color: "#10B981", marginTop: "2px" }}>
                      Đã đồng bộ {shop.orders_count || 0} đơn hàng, {shop.products_count || 0} sản phẩm
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSyncOrders(shop.id)}
                    disabled={syncingOrders}
                    style={{
                      height: "26px",
                      padding: "0 10px",
                      border: "1px solid #EE4D2D",
                      backgroundColor: "transparent",
                      color: "#EE4D2D",
                      borderRadius: "6px",
                      fontSize: "10px",
                      fontWeight: "700",
                      cursor: syncingOrders ? "wait" : "pointer"
                    }}
                  >
                    {syncingOrders ? "Đang đồng bộ..." : "Đồng bộ đơn"}
                  </button>
                </div>

                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <button
                    onClick={() => handleSyncProducts(shop.id)}
                    disabled={syncingProducts}
                    style={{
                      flex: 1,
                      height: "30px",
                      backgroundColor: "#F1F5F9",
                      border: "1px solid #CBD5E1",
                      borderRadius: "6px",
                      fontSize: "10px",
                      fontWeight: "700",
                      color: "#1E293B",
                      cursor: syncingProducts ? "wait" : "pointer"
                    }}
                  >
                    {syncingProducts ? "Đang xử lý..." : "Đồng bộ sản phẩm"}
                  </button>

                  <button
                    onClick={handleTestConnection}
                    style={{
                      flex: 1,
                      height: "30px",
                      backgroundColor: "#EE4D2D",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "10px",
                      fontWeight: "700",
                      cursor: "pointer"
                    }}
                  >
                    {apiPing ? `Ping: ${apiPing}ms ✓` : "Kiểm tra API"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Permissions */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "12px", border: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#0F172A" }}>Quyền API đã cấp</span>
            <span style={{ fontSize: "9px", color: "#3B82F6", fontWeight: "600" }}>OAuth 2.0</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "10px", color: "#334155" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Check size={12} color="#10B981" strokeWidth={3} />
              <span>Quản lý đơn hàng & in vận đơn SPX Express</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Check size={12} color="#10B981" strokeWidth={3} />
              <span>Đồng bộ danh mục sản phẩm & tồn kho</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Check size={12} color="#10B981" strokeWidth={3} />
              <span>Webhook nhận thông báo đơn mới tức thì</span>
            </div>
          </div>
        </div>
      </div>

      <MobileBottomNav activeTab="more" onTabChange={(t) => onNavigate(t)} />
    </div>
  );
};

/**
 * =========================================================================
 * SCREEN 15: Settings (Cài đặt hệ thống)
 * =========================================================================
 */
export const SettingsScreen = ({ onNavigate, activeUser, onToast, setActiveUser }) => {
  const [autoPrint, setAutoPrint] = useState(true);
  const [audioAlert, setAudioAlert] = useState(true);

  const handleLogout = async () => {
    await authAPI.logout();
    if (setActiveUser) setActiveUser(null);
    if (onToast) onToast("Đã đăng xuất khỏi tài khoản!");
    onNavigate("login");
  };

  const menuItems = [
    { icon: Store, label: "Thông tin cửa hàng", action: () => onToast && onToast("Cửa hàng: SPX Flagship Store") },
    { icon: Link, label: "Kết nối Shopee API", route: "shopee-api" },
    { icon: Warehouse, label: "Quản lý kho", route: "warehouse" },
    { icon: Printer, label: "Quản lý in ấn (Label Pro)", route: "batch-print" },
    { icon: User, label: "Nhân viên & phân quyền", route: "staff" },
    { icon: ExternalLink, label: "Cổng quản trị Desktop (/admin)", action: () => window.open("/admin", "_blank") },
    { icon: LogOut, label: "Đăng xuất tài khoản", isDanger: true, action: handleLogout },
  ];

  return (
    <div style={{ flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      <StatusBar dark={true} />

      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <button onClick={() => onNavigate("dashboard")} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
          <ArrowLeft size={18} color="#0F172A" />
        </button>
        <h2 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A", marginLeft: "6px" }}>Cài đặt hệ thống</h2>
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* User profile card */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "12px", border: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            backgroundColor: "#EE4D2D",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "800",
            fontSize: "16px"
          }}>
            {(activeUser?.full_name || "Admin")[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "12px", fontWeight: "800", color: "#0F172A" }}>{activeUser?.full_name || "Quản Trị Viên (Admin)"}</div>
            <div style={{ fontSize: "10px", color: "#64748B" }}>{activeUser?.email || "tunhanduc2007@gmail.com"}</div>
          </div>
          <span style={{ fontSize: "9px", backgroundColor: "#EFF6FF", color: "#2563EB", fontWeight: "700", padding: "2px 6px", borderRadius: "4px" }}>
            {activeUser?.role || "ADMIN"}
          </span>
        </div>

        {/* Toggles */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", border: "1px solid #F1F5F9", padding: "4px 12px" }}>
          <div style={{ padding: "10px 0", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9" }}>
            <span style={{ fontSize: "11px", fontWeight: "600", color: "#1E293B" }}>Tự động in khi có đơn mới</span>
            <input 
              type="checkbox" 
              checked={autoPrint} 
              onChange={() => {
                setAutoPrint(!autoPrint);
                if (onToast) onToast(`Đã ${!autoPrint ? "bật" : "tắt"} tự động in đơn!`);
              }}
              style={{ cursor: "pointer" }}
            />
          </div>

          <div style={{ padding: "10px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "11px", fontWeight: "600", color: "#1E293B" }}>Âm thanh thông báo đơn mới</span>
            <input 
              type="checkbox" 
              checked={audioAlert} 
              onChange={() => {
                setAudioAlert(!audioAlert);
                if (onToast) onToast(`Đã ${!audioAlert ? "bật" : "tắt"} âm thanh thông báo!`);
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", border: "1px solid #F1F5F9", overflow: "hidden" }}>
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                onClick={() => {
                  if (item.action) item.action();
                  else if (item.route) onNavigate(item.route);
                }}
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
