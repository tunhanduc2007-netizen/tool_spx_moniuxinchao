import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { X, Camera, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, Volume2, ShieldCheck } from "lucide-react";
import { playChime } from "../utils/bluetoothPrinter";

export const BarcodeScannerModal = ({ isOpen, onClose, orders = [], onOrderMatched, onToast }) => {
  const [activeTab, setActiveTab] = useState("order"); // "order" | "item"
  const [lastScannedCode, setLastScannedCode] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");
  const html5QrCodeRef = useRef(null);
  const scannerContainerId = "reader-camera-viewport";

  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      setScanResult(null);
      setLastScannedCode("");
      return;
    }

    // List cameras & start scanner
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length > 0) {
        setCameras(devices);
        // Default to back camera if available
        const backCam = devices.find(d => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("rear") || d.label.toLowerCase().includes("sau"));
        const targetId = backCam ? backCam.id : devices[0].id;
        setSelectedCameraId(targetId);
        startScannerWithCamera(targetId);
      } else {
        if (onToast) onToast("Không tìm thấy camera trên thiết bị này.");
      }
    }).catch(err => {
      console.warn("Camera permission error:", err);
      if (onToast) onToast("Vui lòng cấp quyền truy cập Camera để quét mã vạch.");
    });

    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const startScannerWithCamera = async (cameraId) => {
    try {
      await stopScanner();

      const html5QrCode = new Html5Qrcode(scannerContainerId, {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.UPC_A
        ],
        verbose: false
      });
      html5QrCodeRef.current = html5QrCode;

      const config = {
        fps: 15,
        qrbox: { width: 280, height: 180 },
        aspectRatio: 1.333
      };

      await html5QrCode.start(
        cameraId,
        config,
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => {} // ignore frame decode misses
      );
      setScannerActive(true);
    } catch (err) {
      console.error("Lỗi khởi động camera scanner:", err);
      setScannerActive(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
      } catch (e) {}
      html5QrCodeRef.current = null;
      setScannerActive(false);
    }
  };

  const handleScanSuccess = (rawCode) => {
    const code = rawCode.trim();
    if (!code || code === lastScannedCode) return;

    setLastScannedCode(code);

    // Look for matching order
    const matched = orders.find(o => 
      (o.order_sn && o.order_sn.toLowerCase() === code.toLowerCase()) ||
      (o.tracking_number && o.tracking_number.toLowerCase() === code.toLowerCase()) ||
      (o.order_sn && o.order_sn.toLowerCase().includes(code.toLowerCase())) ||
      (o.tracking_number && o.tracking_number.toLowerCase().includes(code.toLowerCase()))
    );

    if (matched) {
      playChime("success");
      setScanResult({
        type: "success",
        title: `Đã tìm thấy đơn #${matched.order_sn}`,
        message: `${matched.customer_name} • ${matched.items?.length || 1} sản phẩm • SPX Express`,
        order: matched
      });
      if (onToast) onToast(`🎯 Đã quét đơn #${matched.order_sn}!`);
      if (onOrderMatched) onOrderMatched(matched);
    } else {
      // Check if it matches any product SKU in orders
      let matchedItem = null;
      let parentOrder = null;
      for (const ord of orders) {
        const item = ord.items?.find(it => 
          (it.sku && it.sku.toLowerCase() === code.toLowerCase()) ||
          (it.model_name && it.model_name.toLowerCase().includes(code.toLowerCase()))
        );
        if (item) {
          matchedItem = item;
          parentOrder = ord;
          break;
        }
      }

      if (matchedItem) {
        playChime("success");
        setScanResult({
          type: "success",
          title: `Xác nhận đúng sản phẩm NOUS`,
          message: `${matchedItem.item_name} (${matchedItem.model_name || 'Chuẩn'}) thuộc đơn #${parentOrder.order_sn}`,
          order: parentOrder
        });
      } else {
        playChime("warning");
        setScanResult({
          type: "warning",
          title: `Mã không khớp đơn nào: ${code}`,
          message: `Mã vạch vừa quét chưa có trong danh sách 44 đơn chờ in hôm nay. Vui lòng kiểm tra lại.`
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(15, 23, 42, 0.85)",
      backdropFilter: "blur(6px)",
      zIndex: 99999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "420px",
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Header */}
        <div style={{
          padding: "12px 16px",
          backgroundColor: "#0F172A",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              backgroundColor: "#EE4D2D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Camera size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "800", letterSpacing: "-0.01em" }}>
                Máy Quét Mã Vạch Đóng Gói
              </div>
              <div style={{ fontSize: "10px", color: "#94A3B8" }}>
                AI Barcode Scanner • Chống nhầm hàng
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              borderRadius: "8px",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              cursor: "pointer"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Camera Viewport Area */}
        <div style={{
          position: "relative",
          width: "100%",
          backgroundColor: "#000000",
          minHeight: "260px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden"
        }}>
          {/* HTML5 QR Code Mount Element */}
          <div id={scannerContainerId} style={{ width: "100%", height: "100%" }}></div>

          {/* Laser scanning line overlay */}
          {scannerActive && (
            <div style={{
              position: "absolute",
              top: "50%",
              left: "15%",
              right: "15%",
              height: "2px",
              backgroundColor: "#EE4D2D",
              boxShadow: "0 0 12px 3px #EE4D2D",
              animation: "scannerLaser 2s infinite ease-in-out",
              pointerEvents: "none"
            }}></div>
          )}

          {!scannerActive && (
            <div style={{ position: "absolute", color: "#94A3B8", textAlign: "center", padding: "20px" }}>
              <RefreshCw size={24} className="spin" style={{ margin: "0 auto 8px" }} />
              <div style={{ fontSize: "12px", fontWeight: "600" }}>Đang mở camera máy quét...</div>
            </div>
          )}
        </div>

        {/* Scan Result Notification Card */}
        {scanResult && (
          <div style={{
            margin: "12px 14px 4px",
            padding: "10px 12px",
            borderRadius: "10px",
            backgroundColor: scanResult.type === "success" ? "#ECFDF5" : "#FEF2F2",
            border: `1.5px solid ${scanResult.type === "success" ? "#A7F3D0" : "#FCA5A5"}`,
            display: "flex",
            alignItems: "flex-start",
            gap: "10px"
          }}>
            {scanResult.type === "success" ? (
              <CheckCircle2 size={20} color="#059669" style={{ flexShrink: 0, marginTop: "2px" }} />
            ) : (
              <AlertTriangle size={20} color="#DC2626" style={{ flexShrink: 0, marginTop: "2px" }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: "12px",
                fontWeight: "800",
                color: scanResult.type === "success" ? "#065F46" : "#991B1B"
              }}>
                {scanResult.title}
              </div>
              <div style={{
                fontSize: "11px",
                color: scanResult.type === "success" ? "#047857" : "#B91C1C",
                marginTop: "2px",
                lineHeight: "1.4"
              }}>
                {scanResult.message}
              </div>
            </div>
          </div>
        )}

        {/* Controls & Quick Tips */}
        <div style={{ padding: "12px 14px 16px", backgroundColor: "#F8FAFC" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "11px", color: "#64748B", display: "flex", alignItems: "center", gap: "4px" }}>
              <ShieldCheck size={14} color="#10B981" />
              <span>Hỗ trợ: SPX Code128, QR, Mác áo NOUS EAN-13</span>
            </span>

            {cameras.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  const currentIdx = cameras.findIndex(c => c.id === selectedCameraId);
                  const nextIdx = (currentIdx + 1) % cameras.length;
                  setSelectedCameraId(cameras[nextIdx].id);
                  startScannerWithCamera(cameras[nextIdx].id);
                }}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #CBD5E1",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "#334155",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <RefreshCw size={11} />
                <span>Đổi Camera</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: "100%",
              height: "40px",
              backgroundColor: "#EE4D2D",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              fontSize: "12.5px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            Đóng Máy Quét
          </button>
        </div>
      </div>
    </div>
  );
};
