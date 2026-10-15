import * as XLSX from "xlsx";

/**
 * Parses Shopee Seller Centre order export files (.xlsx, .xls, .csv).
 * Groups items belonging to the same order_sn and generates complete SPX orders.
 *
 * @param {File | ArrayBuffer} fileOrBuffer
 * @returns {Promise<{ success: boolean, orders: Array, summary: Object }>}
 */
export async function parseShopeeExcelFile(fileOrBuffer) {
  try {
    let data;
    if (fileOrBuffer instanceof ArrayBuffer) {
      data = fileOrBuffer;
    } else {
      data = await fileOrBuffer.arrayBuffer();
    }

    const workbook = XLSX.read(data, { type: "array", cellDates: true });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert to array of objects with header row
    const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    if (!rawRows || rawRows.length === 0) {
      throw new Error("File Excel không có dữ liệu đơn hàng nào.");
    }

    const orderMap = new Map();

    // Helper to find value from row with possible Vietnamese / English column aliases
    const findVal = (row, aliases) => {
      for (const alias of aliases) {
        if (row[alias] !== undefined && String(row[alias]).trim() !== "") {
          return String(row[alias]).trim();
        }
      }
      return "";
    };

    rawRows.forEach((row, index) => {
      // 1. Order SN / Mã đơn hàng
      const orderSn = findVal(row, [
        "Mã đơn hàng", "Mã Đơn Hàng", "Order ID", "Order SN", "order_sn", "Order id", "Mã đơn"
      ]);

      if (!orderSn) return; // Skip empty rows

      // 2. Tracking Number / Mã vận đơn
      const trackingNumber = findVal(row, [
        "Mã vận đơn", "Mã Vận Đơn", "Tracking Number", "Tracking ID", "tracking_number", "Mã tracking"
      ]) || `SPXVN${orderSn.slice(-8)}`;

      // 3. Customer Info
      const customerName = findVal(row, [
        "Tên Người Nhận", "Tên người nhận", "Recipient Name", "Người Mua", "Customer Name", "Họ và tên"
      ]) || "Khách hàng Shopee";

      const customerPhone = findVal(row, [
        "Số Điện Thoại", "Số điện thoại", "Phone Number", "Contact Phone", "SĐT"
      ]) || "09********";

      const customerAddress = findVal(row, [
        "Địa Chỉ Nhận Hàng", "Địa chỉ nhận hàng", "Delivery Address", "Address", "Địa chỉ"
      ]) || "Việt Nam";

      // 4. Order Status & Shipping
      const orderStatus = findVal(row, [
        "Trạng thái đơn hàng", "Trạng Thái Đơn Hàng", "Order Status", "Status"
      ]) || "READY_TO_SHIP";

      const carrier = findVal(row, [
        "Đơn Vị Vận Chuyển", "Đơn vị vận chuyển", "Shipping Carrier", "Logistic Channel"
      ]) || "SPX Express";

      // 5. Product & Variation Info
      const itemName = findVal(row, [
        "Tên sản phẩm", "Tên Sản Phẩm", "Product Name", "Item Name", "Tên món hàng"
      ]) || "Sản phẩm NOUS Baby";

      const modelName = findVal(row, [
        "Tên phân loại hàng", "Phân loại hàng", "Variation Name", "Model Name", "Phân loại"
      ]) || "Tiêu chuẩn";

      const sku = findVal(row, [
        "Mã SKU của phân loại hàng", "SKU phân loại", "Variation SKU", "SKU sản phẩm", "SKU"
      ]) || "";

      const quantity = parseInt(findVal(row, ["Số lượng", "Quantity", "SL"]) || "1", 10) || 1;

      const rawPrice = findVal(row, [
        "Tổng giá bán (sản phẩm)", "Giá sản phẩm", "Deal Price", "Item Price", "Đơn giá", "Giá"
      ]);
      const itemPrice = parseInt(rawPrice.replace(/[^0-9]/g, ""), 10) || 150000;

      const rawTotal = findVal(row, [
        "Tổng số tiền người mua thanh toán", "Tổng giá trị đơn hàng", "Total Order Amount", "Total Amount", "Tổng tiền"
      ]);
      const totalAmount = parseInt(rawTotal.replace(/[^0-9]/g, ""), 10) || (itemPrice * quantity);

      const createdAt = findVal(row, [
        "Thời gian tạo đơn", "Ngày tạo", "Order Creation Date", "Created At"
      ]) || "Hôm nay";

      // Group into orderMap
      if (!orderMap.has(orderSn)) {
        orderMap.set(orderSn, {
          id: orderMap.size + 1,
          order_sn: orderSn,
          order_status: "READY_TO_SHIP",
          raw_status: orderStatus,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          total_amount: totalAmount,
          shipping_carrier: carrier.includes("SPX") ? "SPX Express" : carrier,
          tracking_number: trackingNumber,
          is_printed: false,
          created_at: createdAt,
          items: [],
          status_text: "Cần in gấp",
          statusColor: "#DC2626",
          statusBg: "#FEF2F2",
        });
      }

      const orderObj = orderMap.get(orderSn);
      orderObj.items.push({
        item_name: itemName,
        model_name: modelName,
        sku: sku,
        quantity: quantity,
        item_price: itemPrice
      });
      orderObj.items_count = orderObj.items.reduce((sum, it) => sum + it.quantity, 0);
      orderObj.is_single_item = orderObj.items.length === 1 && orderObj.items[0].quantity === 1;
    });

    const parsedOrders = Array.from(orderMap.values());

    if (parsedOrders.length === 0) {
      throw new Error("Không tìm thấy dòng đơn hàng hợp lệ nào trong file Excel.");
    }

    const singleItemCount = parsedOrders.filter(o => o.is_single_item).length;
    const multiItemCount = parsedOrders.length - singleItemCount;

    return {
      success: true,
      orders: parsedOrders,
      summary: {
        totalOrders: parsedOrders.length,
        singleItemOrders: singleItemCount,
        multiItemOrders: multiItemCount,
        totalRevenue: parsedOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
      }
    };
  } catch (err) {
    console.error("Lỗi đọc file Excel Shopee:", err);
    return {
      success: false,
      error: err.message || "Không thể phân tích dữ liệu file Excel."
    };
  }
}
