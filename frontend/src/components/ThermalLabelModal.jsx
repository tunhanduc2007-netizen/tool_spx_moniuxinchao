import React from "react";
import { Printer, X, Download, CheckCircle2 } from "lucide-react";

export const ThermalLabelModal = ({ labelData, onClose }) => {
  if (!labelData) return null;

  const orderSn = labelData.order_sn || "261014SPX001VN";
  const trackingNumber = labelData.tracking_number || `SPX${orderSn.slice(-8)}VN`;
  const carrier = labelData.shipping_carrier || "SPX Express";
  const sender = labelData.sender || {
    name: "Bubu Baby (minhhy:bubu.237)",
    phone: "0908 237 888",
    address: "Kho Bubu Baby - Phân Phối NOUS Chính Hãng, TP. Hà Nội"
  };
  const recipient = labelData.recipient || {
    name: "Nguyễn Hải Yến",
    phone: "0912 345 678",
    address: "Tòa S2.05 VinHomes Smart City, P. Tây Mỗ, Q. Nam Từ Liêm, Hà Nội"
  };
  const items = labelData.items || [
    { item_name: "NOUS Set 5 Khăn Sữa Bamboo/ Muslin Mềm Mịn Cho Bé Sơ Sinh", model_name: "Set 5 Khăn / Trắng Họa Tiết", quantity: 1, price: 168070 }
  ];
  const isCod = labelData.is_cod !== false;
  const totalAmount = labelData.total_amount || 298000;
  const sortingCode = labelData.sorting_code || `VN-${orderSn.slice(-4)}-SPX`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(15, 23, 42, 0.75)",
      backdropFilter: "blur(6px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px"
    }}>
      <div style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "20px",
        width: "100%",
        maxWidth: "460px",
        maxHeight: "92vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        overflow: "hidden"
      }}>
        {/* Modal Top Bar */}
        <div style={{
          padding: "14px 20px",
          backgroundColor: "#0F172A",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Printer size={18} color="#EE4D2D" />
            <span style={{ fontSize: "14px", fontWeight: "800", letterSpacing: "-0.01em" }}>
              Phiếu Vận Đơn Shopee SPX Express
            </span>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#94A3B8",
              cursor: "pointer",
              padding: "4px"
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Label Preview Area */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          backgroundColor: "#F1F5F9",
          display: "flex",
          justifyContent: "center"
        }}>
          {/* Authentic SPX Thermal Label A6 (100x150mm) */}
          <div 
            id="thermal-label-print-area"
            style={{
              width: "340px",
              backgroundColor: "#FFFFFF",
              border: "2px solid #000000",
              padding: "12px",
              fontFamily: "monospace, -apple-system, BlinkMacSystemFont, sans-serif",
              color: "#000000",
              fontSize: "11px",
              lineHeight: 1.25,
              boxShadow: "0 4px 14px rgba(0,0,0,0.12)"
            }}
          >
            {/* Carrier & Sorting Code Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #000", paddingBottom: "8px" }}>
              <div>
                <div style={{ fontSize: "18px", fontWeight: "900", letterSpacing: "-0.03em" }}>SPX Express</div>
                <div style={{ fontSize: "10px", fontWeight: "700" }}>DỊCH VỤ TIÊU CHUẨN</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "16px", fontWeight: "900", border: "2px solid #000", padding: "2px 8px" }}>
                  {sortingCode}
                </div>
                <div style={{ fontSize: "9px", marginTop: "2px" }}>KHO: HN-01</div>
              </div>
            </div>

            {/* Tracking Barcode */}
            <div style={{ textAlign: "center", padding: "10px 0 6px", borderBottom: "2px solid #000" }}>
              {/* Simulated crisp barcode bars */}
              <div style={{
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "2px",
                margin: "0 auto",
                width: "92%"
              }}>
                {[3,1,2,4,1,3,2,1,4,2,3,1,2,1,4,3,1,2,3,4,1,2,1,3,2,4,1,2,3,1,4,2,1,3,2,4,1,2].map((w, i) => (
                  <div key={i} style={{ width: `${w}px`, height: "100%", backgroundColor: "#000000" }} />
                ))}
              </div>
              <div style={{ fontSize: "13px", fontWeight: "900", letterSpacing: "2px", marginTop: "4px" }}>
                {trackingNumber}
              </div>
              <div style={{ fontSize: "9px" }}>Mã đơn: {orderSn}</div>
            </div>

            {/* Sender & Recipient Boxes */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "2px solid #000", minHeight: "85px" }}>
              {/* From */}
              <div style={{ padding: "6px", borderRight: "1px solid #000" }}>
                <div style={{ fontSize: "9px", fontWeight: "800", textDecoration: "underline" }}>TỪ (SENDER):</div>
                <div style={{ fontWeight: "700", marginTop: "2px" }}>{sender.name}</div>
                <div style={{ fontSize: "9px" }}>{sender.phone}</div>
                <div style={{ fontSize: "9px", marginTop: "2px" }}>{sender.address}</div>
              </div>

              {/* To */}
              <div style={{ padding: "6px" }}>
                <div style={{ fontSize: "9px", fontWeight: "800", textDecoration: "underline" }}>ĐẾN (RECIPIENT):</div>
                <div style={{ fontWeight: "900", fontSize: "12px", marginTop: "2px" }}>{recipient.name}</div>
                <div style={{ fontWeight: "700" }}>{recipient.phone}</div>
                <div style={{ fontSize: "10px", marginTop: "2px", fontWeight: "600" }}>{recipient.address}</div>
              </div>
            </div>

            {/* Items Table */}
            <div style={{ borderBottom: "2px solid #000", padding: "6px 4px" }}>
              <div style={{ fontSize: "9px", fontWeight: "800", marginBottom: "4px" }}>NỘI DUNG ĐƠN HÀNG (TỔNG SL: {items.reduce((s, x) => s + (x.quantity || 1), 0)}):</div>
              {items.map((it, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", marginBottom: "2px" }}>
                  <span style={{ fontWeight: "600", maxWidth: "230px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    • {it.item_name} ({it.model_name || "Chuẩn"})
                  </span>
                  <span style={{ fontWeight: "800" }}>x{it.quantity}</span>
                </div>
              ))}
            </div>

            {/* COD & Payment Amount */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 4px", borderBottom: "2px solid #000" }}>
              <div>
                <div style={{ fontSize: "9px", fontWeight: "700" }}>TIỀN THU NGƯỜI NHẬN (COD):</div>
                <div style={{ fontSize: "18px", fontWeight: "900" }}>
                  {isCod ? `${Number(totalAmount).toLocaleString("vi-VN")} đ` : "0 đ (ĐÃ TT)"}
                </div>
              </div>
              <div style={{ textAlign: "right", fontSize: "9px" }}>
                <div>Chữ ký người nhận:</div>
                <div style={{ height: "24px" }}></div>
                <div style={{ fontStyle: "italic", fontSize: "8px" }}>(Ký và ghi rõ họ tên)</div>
              </div>
            </div>

            {/* Footer Notice */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "6px", fontSize: "8px" }}>
              <span>Shopee Pro Label Print v1.0 • Đồng kiểm theo quy định</span>
              <span style={{ fontWeight: "700" }}>{new Date().toLocaleDateString("vi-VN")}</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div style={{
          padding: "14px 20px",
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #E2E8F0",
          display: "flex",
          gap: "10px"
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: "42px",
              backgroundColor: "#F1F5F9",
              border: "1px solid #CBD5E1",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "13px",
              color: "#475569",
              cursor: "pointer"
            }}
          >
            Đóng
          </button>

          <button
            onClick={handlePrint}
            style={{
              flex: 2,
              height: "42px",
              backgroundColor: "#EE4D2D",
              border: "none",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "13px",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(238, 77, 45, 0.35)"
            }}
          >
            <Printer size={16} />
            <span>In Phiếu Vận Đơn (A6 Thermal)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
