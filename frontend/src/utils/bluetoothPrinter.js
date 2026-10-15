/**
 * Web Bluetooth Thermal Printer Integration (TSPL / ESC-POS)
 * Directly connects to thermal printers (Xprinter, Shoptida, HPRT, Rongta, Niimbot...)
 * without going through the browser/system print dialog.
 */

let activeDevice = null;
let activeCharacteristic = null;

// Standard GATT service UUIDs used by thermal label and receipt printers
const PRINTER_SERVICES = [
  "000018f0-0000-1000-8000-00805f9b34fb",
  "0000e781-0000-1000-8000-00805f9b34fb",
  "0000fff0-0000-1000-8000-00805f9b34fb",
  "49535343-fe7d-4ae5-8fa9-9fafd205e455",
  "e7810a71-73ae-499d-8c15-faa9aef0c3f2"
];

/**
 * Check if Web Bluetooth API is supported in current browser.
 */
export function isBluetoothSupported() {
  return typeof navigator !== "undefined" && !!navigator.bluetooth;
}

/**
 * Play synthesizer audio chime (success / error).
 */
export function playChime(type = "success") {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "success") {
      // Pleasant high-pitch double ding
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === "warning") {
      // Double low buzz
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {
    // Audio context may be restricted before user gesture
  }
}

/**
 * Request device & connect to Bluetooth thermal printer.
 */
export async function connectBluetoothPrinter() {
  if (!isBluetoothSupported()) {
    throw new Error("Trình duyệt của bạn chưa hỗ trợ Web Bluetooth. Hãy dùng Google Chrome hoặc Microsoft Edge.");
  }

  try {
    // Request device with printer filter or acceptAllDevices
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: PRINTER_SERVICES
    });

    if (!device || !device.gatt) {
      throw new Error("Không thể kết nối với thiết bị Bluetooth.");
    }

    const server = await device.gatt.connect();

    // Iterate services to find a writable characteristic
    let matchedCharacteristic = null;
    for (const serviceUuid of PRINTER_SERVICES) {
      try {
        const service = await server.getPrimaryService(serviceUuid);
        const characteristics = await service.getCharacteristics();
        for (const char of characteristics) {
          if (char.properties.write || char.properties.writeWithoutResponse) {
            matchedCharacteristic = char;
            break;
          }
        }
        if (matchedCharacteristic) break;
      } catch (err) {
        // Service not found on this device, check next
      }
    }

    if (!matchedCharacteristic) {
      // Fallback: search all available services
      try {
        const services = await server.getPrimaryServices();
        for (const service of services) {
          const chars = await service.getCharacteristics();
          for (const char of chars) {
            if (char.properties.write || char.properties.writeWithoutResponse) {
              matchedCharacteristic = char;
              break;
            }
          }
          if (matchedCharacteristic) break;
        }
      } catch (e) {}
    }

    if (!matchedCharacteristic) {
      throw new Error(`Đã kết nối "${device.name || 'Máy in'}" nhưng không tìm thấy cổng ghi dữ liệu in (Write Characteristic).`);
    }

    activeDevice = device;
    activeCharacteristic = matchedCharacteristic;

    device.addEventListener("gattserverdisconnected", () => {
      activeDevice = null;
      activeCharacteristic = null;
    });

    playChime("success");

    return {
      success: true,
      deviceName: device.name || "Máy In Nhiệt Bluetooth",
      deviceId: device.id
    };
  } catch (err) {
    console.error("Lỗi kết nối Bluetooth:", err);
    throw err;
  }
}

/**
 * Check if a printer is currently connected.
 */
export function isPrinterConnected() {
  return activeDevice && activeDevice.gatt && activeDevice.gatt.connected && !!activeCharacteristic;
}

export function getConnectedDeviceName() {
  return activeDevice ? activeDevice.name || "Máy in Bluetooth" : null;
}

/**
 * Disconnect current printer.
 */
export async function disconnectBluetoothPrinter() {
  if (activeDevice && activeDevice.gatt && activeDevice.gatt.connected) {
    activeDevice.gatt.disconnect();
  }
  activeDevice = null;
  activeCharacteristic = null;
}

/**
 * Convert TSPL command string into raw bytes and transmit in chunks.
 */
async function sendRawCommand(commandString) {
  if (!isPrinterConnected()) {
    throw new Error("Chưa kết nối máy in Bluetooth.");
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(commandString);
  const CHUNK_SIZE = 128; // safe BLE write chunk size

  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE);
    if (activeCharacteristic.properties.writeWithoutResponse) {
      await activeCharacteristic.writeValueWithoutResponse(chunk);
    } else {
      await activeCharacteristic.writeValue(chunk);
    }
    // tiny delay for BLE buffer flush
    await new Promise(r => setTimeout(r, 15));
  }
}

/**
 * Build TSPL 100x150mm SPX Express Thermal Shipping Label Command.
 */
export function generateSpxTsplLabel(order) {
  const sn = order.order_sn || "261015SPX0001";
  const tracking = order.tracking_number || `SPXVN${sn.slice(-8)}`;
  const customerName = order.customer_name || "Khách hàng Shopee";
  const customerPhone = order.customer_phone || "09********";
  const address = order.customer_address || "Việt Nam";
  const items = order.items || [];
  const itemsText = items.map(it => `${it.quantity}x ${it.item_name} (${it.model_name || 'Tiêu chuẩn'})`).join(" | ");

  // TSPL commands for A6 Thermal (100mm width x 150mm height, 203 DPI)
  // 100mm ~ 800 dots, 150mm ~ 1200 dots
  return `
SIZE 100 mm, 150 mm
GAP 3 mm, 0 mm
DIRECTION 1
CLS
BOX 20,20,780,1180,3
TEXT 40,40,"4",0,2,2,"SPX EXPRESS"
TEXT 500,50,"3",0,1,1,"CHUAN (STANDARD)"
BAR 20,110,760,3
BARCODE 60,140,"128",90,2,0,2,2,"${tracking}"
TEXT 220,245,"3",0,1,1,"Ma Van Don: ${tracking}"
BAR 20,280,760,2
TEXT 40,300,"3",0,1,1,"Nguoi Nhan: ${customerName}"
TEXT 40,335,"3",0,1,1,"SDT: ${customerPhone}"
TEXT 40,370,"2",0,1,1,"Dia Chi: ${address.slice(0, 75)}"
${address.length > 75 ? `TEXT 40,395,"2",0,1,1,"${address.slice(75, 150)}"` : ""}
BAR 20,440,760,2
TEXT 40,460,"3",0,1,1,"Noi Dung Don Hang (Shop Mon Baby NOUS):"
TEXT 40,495,"2",0,1,1,"${itemsText.slice(0, 80)}"
${itemsText.length > 80 ? `TEXT 40,520,"2",0,1,1,"${itemsText.slice(80, 160)}"` : ""}
BAR 20,580,760,2
TEXT 40,600,"3",0,1,1,"Ma Don Shopee: #${sn}"
TEXT 450,600,"3",0,1,1,"Tien Thu COD: 0 VND"
PRINT 1
`;
}

/**
 * Print a single order directly via Bluetooth.
 */
export async function printOrderViaBluetooth(order) {
  const tspl = generateSpxTsplLabel(order);
  await sendRawCommand(tspl);
  playChime("success");
}

/**
 * Print multiple orders in batch directly via Bluetooth.
 */
export async function printBatchViaBluetooth(orders, onProgress) {
  if (!orders || orders.length === 0) return;
  for (let idx = 0; idx < orders.length; idx++) {
    const o = orders[idx];
    if (onProgress) onProgress(idx + 1, orders.length, o);
    await printOrderViaBluetooth(o);
    // 500ms pause between labels to allow thermal head cooling & tear-off
    await new Promise(r => setTimeout(r, 600));
  }
}
