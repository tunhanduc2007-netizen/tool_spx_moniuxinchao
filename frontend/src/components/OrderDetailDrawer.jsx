import React, { useEffect, useState } from "react";
import { 
  X, Printer, CheckCircle2, MapPin, Phone, User, Package, 
  Copy, ExternalLink, AlertTriangle, ShieldCheck, Truck, Sparkles 
} from "lucide-react";
import { playChime } from "../utils/bluetoothPrinter";

export const OrderDetailDrawer = ({ order, isOpen, onClose, onPrintOrder, onToast }) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedSn, setCopiedSn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "phone") {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
      if (onToast) onToast("Đã sao chép số điện thoại khách hàng!");
    } else {
      setCopiedSn(true);
      setTimeout(() => setCopiedSn(false), 2000);
      if (onToast) onToast("Đã sao chép mã đơn hàng!");
    }
    playChime("success");
  };

  const isInstant = order.shipping_carrier?.toLowerCase().includes("hỏa tốc") || 
                    order.shipping_carrier?.toLowerCase().includes("instant") || 
                    order.order_sn?.endsWith("01VN") || order.order_sn?.endsWith("03VN");

  const items = order.items || [
    { item_name: "NOUS Baby chính hãng", model_name: "Tiêu chuẩn", quantity: 1, item_price: order.total_amount || 168000 }
  ];

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(15, 23, 42, 0.6)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      zIndex: 9999,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      transition: "opacity 0.2s ease"
    }}>
      {/* Click outside backdrop */}
      <div 
        onClick={onClose} 
        style={{ position: "absolute", inset: 0 }} 
      />

      {/* iOS 18 Slide-up Drawer Container */}
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: "520px",
        maxHeight: "88vh",
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: "22px",
        borderTopRightRadius: "22px",
        boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.25)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        animation: "drawerSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)"
      }}>
        {/* Top iOS Grabber Bar */}
        <div style={{ padding: "8px 0 4px", display: "flex", justifyContent: "center", cursor: "pointer" }} onClick={onClose}>
          <div style={{ width: "42px", height: "4.5px", backgroundColor: "#CBD5E1", borderRadius: "99px" }} />
        </div>

        {/* Header Bar */}
        <div style={{
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #F1F5F9"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "14px", fontWeight: "900", color: "#0F172A" }}>#{order.order_sn || order.sn}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(order.order_sn || order.sn, "sn")}
                style={{ background: "none", border: "none", cursor: "pointer", color: copiedSn ? "#10B981" : "#94A3B8", padding: "2px" }}
                title="Sao chép mã đơn"
              >
                <Copy size={13} />
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
              {isInstant ? (
                <span style={{
                  fontSize: "9.5px",
                  fontWeight: "800",
                  backgroundColor: "#FEF2F2",
                  color: "#DC2626",
                  border: "1px solid #F87171",
                  padding: "2px 7px",
                  borderRadius: "4px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px"
                }}>
                  <span style={{ width: "6px", height: "6px", backgroundColor: "#DC2626", borderRadius: "50%" }} />
                  🔴 SPX Hỏa Tốc (Giao 2H - Gói gấp)
                </span>
              ) : (
                <span style={{
                  fontSize: "9.5px",
                  fontWeight: "800",
                  backgroundColor: "#FFF1EC",
                  color: "#EE4D2D",
                  padding: "2px 7px",
                  borderRadius: "4px"
                }}>
                  🟠 {order.shipping_carrier || "SPX Express Nhanh"}
                </span>
              )}

              <span style={{
                fontSize: "9px",
                fontWeight: "700",
                color: order.is_printed || order.printed ? "#059669" : "#F59E0B",
                backgroundColor: order.is_printed || order.printed ? "#ECFDF5" : "#FFFBEB",
                padding: "2px 6px",
                borderRadius: "4px"
              }}>
                {order.is_printed || order.printed ? "🟢 Đã in tem" : "🟡 Chờ in"}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#F1F5F9",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748B",
              cursor: "pointer"
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Recipient Information Card */}
          <div style={{ backgroundColor: "#F8FAFC", borderRadius: "12px", padding: "12px", border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: "11px", fontWeight: "800", color: "#334155", marginBottom: "8px", display: "flex", alignItems: "center", gap: "5px" }}>
              <User size={14} color="#EE4D2D" />
              <span>Thông Tin Người Nhận</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "800", color: "#0F172A" }}>
                  {order.customer_name || "Khách hàng Shopee"}
                </div>
                <div style={{ fontSize: "11.5px", color: "#475569", marginTop: "2px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>📱 {order.customer_phone || "09********"}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(order.customer_phone || "09********", "phone")}
                    style={{ background: "none", border: "none", color: copiedPhone ? "#10B981" : "#2563EB", cursor: "pointer", fontSize: "10px", fontWeight: "700" }}
                  >
                    {copiedPhone ? "✓ Đã chép" : "Sao chép"}
                  </button>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "10px", color: "#64748B" }}>Mã vận đơn SPX:</span>
                <div style={{ fontSize: "11.5px", fontWeight: "800", color: "#EE4D2D" }}>
                  {order.tracking_number || order.tracking || `SPXVN${(order.order_sn || '').slice(-8)}`}
                </div>
              </div>
            </div>

            <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px dashed #CBD5E1", fontSize: "11.5px", color: "#334155", lineHeight: "1.4", display: "flex", alignItems: "flex-start", gap: "5px" }}>
              <MapPin size={14} color="#64748B" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>{order.customer_address || "Kho hàng Shopee SPX Express, Việt Nam"}</span>
            </div>
          </div>

          {/* Items & Packing Breakdown */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", padding: "12px", border: "1px solid #E2E8F0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#334155", display: "flex", alignItems: "center", gap: "5px" }}>
                <Package size={14} color="#EE4D2D" />
                <span>Sản Phẩm Cần Đóng Gói ({items.reduce((s, it) => s + (it.quantity || 1), 0)} món)</span>
              </div>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#EE4D2D" }}>
                {Number(order.total_amount || 0).toLocaleString("vi-VN")}đ
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {items.map((item, index) => (
                <div key={index} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 10px",
                  backgroundColor: "#F8FAFC",
                  borderRadius: "8px",
                  border: "1px solid #F1F5F9"
                }}>
                  {/* Thumbnail */}
                  <div style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "6px",
                    backgroundColor: "#FFF1EC",
                    border: "1px solid #FFE4DB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    overflow: "hidden"
                  }}>
                    {item.image_url ? (
                      <img src={item.image_url} alt="NOUS" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        <span style={{ fontSize: "16px" }}>👶</span>
                        <div style={{ fontSize: "7px", fontWeight: "800", color: "#EE4D2D" }}>NOUS</div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: "#0F172A", lineHeight: "1.3" }}>
                      {item.item_name}
                    </div>
                    <div style={{ fontSize: "10px", color: "#64748B", marginTop: "2px" }}>
                      Phân loại: <strong style={{ color: "#EE4D2D" }}>{item.model_name || "Tiêu chuẩn"}</strong>
                      {item.sku && ` • SKU: ${item.sku}`}
                    </div>
                  </div>

                  {/* Quantity badge */}
                  <div style={{
                    backgroundColor: "#EE4D2D",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontWeight: "800",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    flexShrink: 0
                  }}>
                    x{item.quantity || 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Drawer Actions */}
        <div style={{
          padding: "12px 16px calc(14px + env(safe-area-inset-bottom, 0px))",
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #E2E8F0",
          display: "flex",
          gap: "8px"
        }}>
          <button
            type="button"
            onClick={() => {
              if (onPrintOrder) onPrintOrder(order);
            }}
            style={{
              flex: 1,
              height: "44px",
              backgroundColor: "#EE4D2D",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: "800",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              boxShadow: "0 4px 14px rgba(238, 77, 45, 0.35)"
            }}
          >
            <Printer size={16} />
            <span>In Tem Vận Đơn SPX (A6)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              height: "44px",
              padding: "0 18px",
              backgroundColor: "#F1F5F9",
              color: "#334155",
              border: "none",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            Đóng
          </button>
        </div>
      </div>

      <style>{`
        @keyframes drawerSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
