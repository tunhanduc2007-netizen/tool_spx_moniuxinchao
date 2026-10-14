"""Official Shopee Open Platform v2 API Client with OAuth and Signature."""

import hmac
import hashlib
import time
import json
import logging
from typing import Dict, Any, Optional, List
import httpx

logger = logging.getLogger("shopee_client")

class ShopeeClient:
    LIVE_URL = "https://partner.shopeemobile.com"
    TEST_URL = "https://partner.test-stable.shopeemobile.com"

    def __init__(
        self,
        partner_id: int,
        partner_key: str,
        environment: str = "live",
        mock_mode: bool = False
    ):
        self.partner_id = partner_id
        self.partner_key = partner_key
        self.environment = environment
        self.mock_mode = mock_mode
        self.base_url = self.TEST_URL if environment == "test" else self.LIVE_URL

    def _generate_public_sign(self, path: str, timestamp: int) -> str:
        """Sign algorithm for public APIs (OAuth URL, Token exchange)."""
        base_string = f"{self.partner_id}{path}{timestamp}"
        return hmac.new(
            self.partner_key.encode("utf-8"),
            base_string.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()

    def _generate_shop_sign(self, path: str, timestamp: int, access_token: str, shop_id: int) -> str:
        """Sign algorithm for shop APIs (Products, Orders, Logistics)."""
        base_string = f"{self.partner_id}{path}{timestamp}{access_token}{shop_id}"
        return hmac.new(
            self.partner_key.encode("utf-8"),
            base_string.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()

    def generate_auth_url(self, redirect_url: str) -> str:
        """Generate official Shopee Open Platform Shop Authorization URL."""
        path = "/api/v2/shop/auth_partner"
        timestamp = int(time.time())
        sign = self._generate_public_sign(path, timestamp)
        return (
            f"{self.base_url}{path}?"
            f"partner_id={self.partner_id}&"
            f"timestamp={timestamp}&"
            f"sign={sign}&"
            f"redirect={redirect_url}"
        )

    async def get_token(self, code: str, shop_id: int) -> Dict[str, Any]:
        """Exchange authorization code for access_token and refresh_token."""
        path = "/api/v2/auth/token/get"
        timestamp = int(time.time())
        sign = self._generate_public_sign(path, timestamp)

        if self.mock_mode or not self.partner_key:
            # Realistic mock response if live credentials not yet configured
            return {
                "error": "",
                "message": "Success (Mock Sandbox)",
                "access_token": f"mock_acc_{int(time.time())}_{shop_id}",
                "refresh_token": f"mock_ref_{int(time.time())}_{shop_id}",
                "expire_in": 14400,
                "shop_id": shop_id,
                "partner_id": self.partner_id
            }

        url = f"{self.base_url}{path}"
        params = {
            "partner_id": self.partner_id,
            "timestamp": timestamp,
            "sign": sign
        }
        body = {
            "code": code,
            "partner_id": self.partner_id,
            "shop_id": shop_id
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, params=params, json=body)
            data = resp.json()
            if "error" in data and data["error"]:
                logger.error(f"Shopee get_token error: {data.get('message')}")
            return data

    async def refresh_access_token(self, refresh_token: str, shop_id: int) -> Dict[str, Any]:
        """Refresh expired access token."""
        path = "/api/v2/auth/access_token/get"
        timestamp = int(time.time())
        sign = self._generate_public_sign(path, timestamp)

        if self.mock_mode or not self.partner_key:
            return {
                "error": "",
                "message": "Token Refreshed (Mock)",
                "access_token": f"mock_acc_refreshed_{int(time.time())}_{shop_id}",
                "refresh_token": f"mock_ref_renewed_{int(time.time())}_{shop_id}",
                "expire_in": 14400
            }

        url = f"{self.base_url}{path}"
        params = {
            "partner_id": self.partner_id,
            "timestamp": timestamp,
            "sign": sign
        }
        body = {
            "refresh_token": refresh_token,
            "partner_id": self.partner_id,
            "shop_id": shop_id
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, params=params, json=body)
            return resp.json()

    async def get_shop_info(self, shop_id: int, access_token: str) -> Dict[str, Any]:
        """Get basic shop details."""
        path = "/api/v2/shop/get_shop_info"
        timestamp = int(time.time())
        sign = self._generate_shop_sign(path, timestamp, access_token, shop_id)

        if self.mock_mode or not self.partner_key:
            return {
                "error": "",
                "response": {
                    "shop_name": f"Shopee Mall Official #{shop_id}",
                    "region": "VN",
                    "status": "NORMAL",
                    "is_sip": False,
                    "is_cb": False,
                    "auth_time": timestamp
                }
            }

        url = f"{self.base_url}{path}"
        params = {
            "partner_id": self.partner_id,
            "timestamp": timestamp,
            "access_token": access_token,
            "shop_id": shop_id,
            "sign": sign
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(url, params=params)
            return resp.json()

    async def get_order_list(
        self,
        shop_id: int,
        access_token: str,
        time_from: int,
        time_to: int,
        page_size: int = 50,
        cursor: str = "",
        order_status: Optional[str] = None
    ) -> Dict[str, Any]:
        """Fetch list of orders with pagination."""
        path = "/api/v2/order/get_order_list"
        timestamp = int(time.time())
        sign = self._generate_shop_sign(path, timestamp, access_token, shop_id)

        if self.mock_mode or not self.partner_key:
            # Generate realistic mock orders
            return {
                "error": "",
                "response": {
                    "more": False,
                    "next_cursor": "",
                    "order_list": [
                        {"order_sn": f"241014SPX{shop_id}001VN", "order_status": "READY_TO_SHIP"},
                        {"order_sn": f"241014SPX{shop_id}002VN", "order_status": "PROCESSED"},
                        {"order_sn": f"241014SPX{shop_id}003VN", "order_status": "SHIPPED"},
                        {"order_sn": f"241014SPX{shop_id}004VN", "order_status": "COMPLETED"},
                    ]
                }
            }

        url = f"{self.base_url}{path}"
        params = {
            "partner_id": self.partner_id,
            "timestamp": timestamp,
            "access_token": access_token,
            "shop_id": shop_id,
            "sign": sign,
            "time_range_field": "create_time",
            "time_from": time_from,
            "time_to": time_to,
            "page_size": page_size,
            "cursor": cursor
        }
        if order_status:
            params["order_status"] = order_status

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(url, params=params)
            return resp.json()

    async def get_order_detail(
        self,
        shop_id: int,
        access_token: str,
        order_sn_list: List[str]
    ) -> Dict[str, Any]:
        """Fetch detailed order data (items, customer recipient, prices)."""
        path = "/api/v2/order/get_order_detail"
        timestamp = int(time.time())
        sign = self._generate_shop_sign(path, timestamp, access_token, shop_id)

        if self.mock_mode or not self.partner_key:
            # Build detailed mock data for each requested order_sn
            order_details = []
            for idx, sn in enumerate(order_sn_list):
                carrier = "SPX Express"
                order_details.append({
                    "order_sn": sn,
                    "order_status": "READY_TO_SHIP" if idx == 0 else "PROCESSED",
                    "buyer_user_id": 98124000 + idx,
                    "buyer_username": f"customer_{idx+1}_spx",
                    "recipient_address": {
                        "name": f"Nguyễn Văn Khách {idx+1}",
                        "phone": f"098765432{idx}",
                        "full_address": f"Số {12+idx} Đường Giải Phóng, Quận Hai Bà Trưng, Hà Nội",
                        "city": "Hà Nội",
                        "district": "Hai Bà Trưng"
                    },
                    "total_amount": 250000.0 + (idx * 120000.0),
                    "shipping_fee": 22000.0,
                    "payment_method": "ShopeePay",
                    "shipping_carrier": carrier,
                    "tracking_number": f"SPX0839210{idx}VN",
                    "create_time": timestamp - (3600 * (idx + 1)),
                    "item_list": [
                        {
                            "item_id": 100010 + idx,
                            "item_name": f"Áo Thun Nam Cotton Cao Cấp SPX Pro - Mẫu {idx+1}",
                            "model_id": 200010 + idx,
                            "model_name": "Đen / Size L",
                            "model_quantity_purchased": 2,
                            "model_discounted_price": 125000.0
                        }
                    ]
                })
            return {"error": "", "response": {"order_list": order_details}}

        url = f"{self.base_url}{path}"
        params = {
            "partner_id": self.partner_id,
            "timestamp": timestamp,
            "access_token": access_token,
            "shop_id": shop_id,
            "sign": sign,
            "order_sn_list": ",".join(order_sn_list),
            "response_optional_fields": "buyer_user_id,buyer_username,recipient_address,item_list,shipping_carrier,payment_method,total_amount"
        }

        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.get(url, params=params)
            return resp.json()

    async def get_item_list(
        self,
        shop_id: int,
        access_token: str,
        offset: int = 0,
        page_size: int = 50,
        item_status: str = "NORMAL"
    ) -> Dict[str, Any]:
        """Fetch shop item IDs."""
        path = "/api/v2/product/get_item_list"
        timestamp = int(time.time())
        sign = self._generate_shop_sign(path, timestamp, access_token, shop_id)

        if self.mock_mode or not self.partner_key:
            return {
                "error": "",
                "response": {
                    "total_count": 3,
                    "has_next_page": False,
                    "item": [
                        {"item_id": 100010, "item_status": "NORMAL"},
                        {"item_id": 100011, "item_status": "NORMAL"},
                        {"item_id": 100012, "item_status": "NORMAL"},
                    ]
                }
            }

        url = f"{self.base_url}{path}"
        params = {
            "partner_id": self.partner_id,
            "timestamp": timestamp,
            "access_token": access_token,
            "shop_id": shop_id,
            "sign": sign,
            "offset": offset,
            "page_size": page_size,
            "item_status": item_status
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(url, params=params)
            return resp.json()

    async def get_item_base_info(
        self,
        shop_id: int,
        access_token: str,
        item_id_list: List[int]
    ) -> Dict[str, Any]:
        """Fetch item details (Title, Images, Categories, Prices)."""
        path = "/api/v2/product/get_item_base_info"
        timestamp = int(time.time())
        sign = self._generate_shop_sign(path, timestamp, access_token, shop_id)

        if self.mock_mode or not self.partner_key:
            items = []
            for item_id in item_id_list:
                items.append({
                    "item_id": item_id,
                    "item_name": f"Sản phẩm Thời trang SPX Store - Mã {item_id}",
                    "item_status": "NORMAL",
                    "category_id": 1024,
                    "image": {"image_url_list": ["https://cf.shopee.vn/file/placeholder_item.jpg"]},
                    "price_info": [{"original_price": 200000.0, "current_price": 149000.0}]
                })
            return {"error": "", "response": {"item_list": items}}

        url = f"{self.base_url}{path}"
        params = {
            "partner_id": self.partner_id,
            "timestamp": timestamp,
            "access_token": access_token,
            "shop_id": shop_id,
            "sign": sign,
            "item_id_list": ",".join(str(i) for i in item_id_list)
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(url, params=params)
            return resp.json()

    async def update_stock(
        self,
        shop_id: int,
        access_token: str,
        item_id: int,
        stock_list: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Update product stock back to Shopee."""
        path = "/api/v2/product/update_stock"
        timestamp = int(time.time())
        sign = self._generate_shop_sign(path, timestamp, access_token, shop_id)

        if self.mock_mode or not self.partner_key:
            return {
                "error": "",
                "message": "Stock updated successfully (Mock)",
                "response": {"success_list": stock_list, "failure_list": []}
            }

        url = f"{self.base_url}{path}"
        params = {
            "partner_id": self.partner_id,
            "timestamp": timestamp,
            "access_token": access_token,
            "shop_id": shop_id,
            "sign": sign
        }
        body = {
            "item_id": item_id,
            "stock_list": stock_list
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, params=params, json=body)
            return resp.json()

    async def get_tracking_info(
        self,
        shop_id: int,
        access_token: str,
        order_sn: str
    ) -> Dict[str, Any]:
        """Fetch logistics tracking info."""
        path = "/api/v2/logistics/get_tracking_info"
        timestamp = int(time.time())
        sign = self._generate_shop_sign(path, timestamp, access_token, shop_id)

        if self.mock_mode or not self.partner_key:
            return {
                "error": "",
                "response": {
                    "tracking_number": f"SPX{order_sn[-8:]}VN",
                    "log_list": [
                        {"description": "Đơn hàng đã được tạo trên hệ thống SPX Express", "log_time": timestamp - 3600},
                        {"description": "Bưu tá đã lấy hàng thành công tại kho người bán", "log_time": timestamp - 1800}
                    ]
                }
            }

        url = f"{self.base_url}{path}"
        params = {
            "partner_id": self.partner_id,
            "timestamp": timestamp,
            "access_token": access_token,
            "shop_id": shop_id,
            "sign": sign,
            "order_sn": order_sn
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(url, params=params)
            return resp.json()
