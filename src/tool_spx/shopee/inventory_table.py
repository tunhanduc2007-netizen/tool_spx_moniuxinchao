"""Official Shopee Open Platform v2 API Catalog and Inventory Table."""

from typing import List, Dict, Any

SHOPEE_API_INVENTORY: List[Dict[str, Any]] = [
    {
        "id": "AUTH_GET_TOKEN",
        "business_name": "Trao đổi mã ủy quyền (Code) lấy Token",
        "endpoint": "/api/v2/auth/token/get",
        "http_method": "POST",
        "permission_required": "Public Auth API",
        "input_params": "partner_id, timestamp, sign (query) | code, partner_id, shop_id (body)",
        "output_data": "access_token, refresh_token, expire_in, error, message",
        "implemented": True,
        "tested": True,
        "limits_conditions": "Mã code ủy quyền có hạn 10 phút, chỉ dùng 1 lần duy nhất."
    },
    {
        "id": "AUTH_REFRESH_TOKEN",
        "business_name": "Làm mới Access Token khi hết hạn",
        "endpoint": "/api/v2/auth/access_token/get",
        "http_method": "POST",
        "permission_required": "Public Auth API",
        "input_params": "partner_id, timestamp, sign (query) | refresh_token, partner_id, shop_id (body)",
        "output_data": "access_token, refresh_token, expire_in, error, message",
        "implemented": True,
        "tested": True,
        "limits_conditions": "Refresh token có hạn 30 ngày. Cần làm mới định kỳ trước khi hết hạn."
    },
    {
        "id": "SHOP_GET_INFO",
        "business_name": "Lấy thông tin cơ bản của Shop",
        "endpoint": "/api/v2/shop/get_shop_info",
        "http_method": "GET",
        "permission_required": "Shop Management",
        "input_params": "partner_id, timestamp, access_token, shop_id, sign",
        "output_data": "shop_name, region, status, is_sip, is_cb, auth_time",
        "implemented": True,
        "tested": True,
        "limits_conditions": "Giới hạn 100 requests/phút per shop."
    },
    {
        "id": "ORDER_GET_LIST",
        "business_name": "Lấy danh sách đơn hàng theo thời gian / trạng thái",
        "endpoint": "/api/v2/order/get_order_list",
        "http_method": "GET",
        "permission_required": "Order Management",
        "input_params": "time_range_field (create_time/update_time), time_from, time_to, page_size (max 100), cursor, order_status",
        "output_data": "order_list (order_sn, order_status), more, next_cursor",
        "implemented": True,
        "tested": True,
        "limits_conditions": "Khoảng thời gian tối đa mỗi lần truy vấn là 15 ngày."
    },
    {
        "id": "ORDER_GET_DETAIL",
        "business_name": "Lấy thông tin chi tiết đơn hàng (Sản phẩm, Khách hàng, Tiền)",
        "endpoint": "/api/v2/order/get_order_detail",
        "http_method": "GET",
        "permission_required": "Order Management",
        "input_params": "order_sn_list (tối đa 50 đơn), response_optional_fields (item_list, recipient_address, buyer_user)",
        "output_data": "order_list (order_sn, buyer_user_id, recipient_address, item_list, total_amount, shipping_carrier, pay_time)",
        "implemented": True,
        "tested": True,
        "limits_conditions": "Giới hạn tối đa 50 mã đơn hàng trên một request."
    },
    {
        "id": "PRODUCT_GET_ITEM_LIST",
        "business_name": "Lấy danh sách mã sản phẩm của Shop",
        "endpoint": "/api/v2/product/get_item_list",
        "http_method": "GET",
        "permission_required": "Product Management",
        "input_params": "offset, page_size (tối đa 100), item_status (NORMAL/BANNED/DELETED/UNLIST)",
        "output_data": "item (item_id, item_status, update_time), total_count, has_next_page, next_offset",
        "implemented": True,
        "tested": True,
        "limits_conditions": "Tối đa 100 sản phẩm mỗi trang."
    },
    {
        "id": "PRODUCT_GET_BASE_INFO",
        "business_name": "Lấy thông tin chi tiết sản phẩm (Tên, Ảnh, Giá, Danh mục)",
        "endpoint": "/api/v2/product/get_item_base_info",
        "http_method": "GET",
        "permission_required": "Product Management",
        "input_params": "item_id_list (tối đa 50 item_id)",
        "output_data": "item_list (item_id, category_id, item_name, description, image, price_info, stock_info)",
        "implemented": True,
        "tested": True,
        "limits_conditions": "Tối đa 50 item_id mỗi request."
    },
    {
        "id": "PRODUCT_GET_MODEL_LIST",
        "business_name": "Lấy danh sách phân loại (SKU / Variation / Models)",
        "endpoint": "/api/v2/product/get_model_list",
        "http_method": "GET",
        "permission_required": "Product Management",
        "input_params": "item_id",
        "output_data": "tier_variation, model (model_id, model_sku, stock_info, price_info)",
        "implemented": True,
        "tested": True,
        "limits_conditions": "Áp dụng cho sản phẩm có nhiều thuộc tính (màu, size)."
    },
    {
        "id": "PRODUCT_UPDATE_STOCK",
        "business_name": "Cập nhật số lượng tồn kho lên Shopee",
        "endpoint": "/api/v2/product/update_stock",
        "http_method": "POST",
        "permission_required": "Product Management",
        "input_params": "item_id, stock_list: [{model_id, normal_stock}]",
        "output_data": "failure_list, success_list",
        "implemented": True,
        "tested": True,
        "limits_conditions": "Cần kiểm tra quyền ghi tồn kho trước khi gửi request."
    },
    {
        "id": "LOGISTICS_SHIP_ORDER",
        "business_name": "Xác nhận gửi hàng (Ship Order / Giao bưu tá hoặc gửi bưu cục)",
        "endpoint": "/api/v2/logistics/ship_order",
        "http_method": "POST",
        "permission_required": "Logistics Management",
        "input_params": "order_sn, pickup: {address_id, pickup_time_id} hoặc dropoff: {branch_id, sender_real_name, tracking_number}",
        "output_data": "error, message, response",
        "implemented": True,
        "tested": True,
        "limits_conditions": "Đơn hàng phải ở trạng thái READY_TO_SHIP."
    },
    {
        "id": "LOGISTICS_GET_TRACKING",
        "business_name": "Lấy thông tin và mã vận đơn (Tracking Number)",
        "endpoint": "/api/v2/logistics/get_tracking_info",
        "http_method": "GET",
        "permission_required": "Logistics Management",
        "input_params": "order_sn",
        "output_data": "tracking_number, log_list (description, update_time)",
        "implemented": True,
        "tested": True,
        "limits_conditions": "Hỗ trợ các hãng vận chuyển tích hợp như SPX Express."
    },
    {
        "id": "LOGISTICS_CREATE_SHIPPING_DOC",
        "business_name": "Tạo yêu cầu in vận đơn (Label Pro / Thermal / PDF)",
        "endpoint": "/api/v2/logistics/create_shipping_document",
        "http_method": "POST",
        "permission_required": "Logistics Management",
        "input_params": "order_list: [{order_sn, shipping_document_type: 'THERMAL_AIR_WAYBILL'}]",
        "output_data": "result_list (order_sn, status: 'READY' hoặc 'PROCESSING')",
        "implemented": True,
        "tested": True,
        "limits_conditions": "Hỗ trợ khổ in tiêu chuẩn 100x150mm hoặc A4."
    },
    {
        "id": "LOGISTICS_DOWNLOAD_SHIPPING_DOC",
        "business_name": "Tải file in vận đơn chuẩn Shopee",
        "endpoint": "/api/v2/logistics/download_shipping_document",
        "http_method": "POST",
        "permission_required": "Logistics Management",
        "input_params": "shipping_document_type, order_list: [{order_sn}]",
        "output_data": "Binary PDF / HTML Thermal Air Waybill Data",
        "implemented": True,
        "tested": True,
        "limits_conditions": "Chỉ tải được khi status create_shipping_document là READY."
    }
]
