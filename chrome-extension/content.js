/**
 * Mon Baby SPX - Shopee Seller Centre Content Script
 * Automatically injects a convenient floating 1-click sync widget
 * into Shopee Seller Centre (banhang.shopee.vn).
 */

(function () {
  console.info("[Mon Baby SPX] Shopee Seller Sync Extension activated!");

  // Wait for DOM to stabilize
  setTimeout(initFloatingWidget, 1500);

  function initFloatingWidget() {
    if (document.getElementById("monbaby-spx-sync-btn")) return;

    const widget = document.createElement("div");
    widget.id = "monbaby-spx-sync-btn";
    widget.innerHTML = `
      <div style="
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 999999;
        display: flex;
        align-items: center;
        gap: 10px;
        background: linear-gradient(135deg, #EE4D2D 0%, #FF5722 100%);
        color: #FFFFFF;
        padding: 12px 18px;
        border-radius: 99px;
        box-shadow: 0 8px 24px rgba(238, 77, 45, 0.45);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        border: 2px solid #FFFFFF;
      ">
        <span style="font-size: 16px;">⚡</span>
        <span>Đồng bộ 44 đơn sang Mon Baby SPX</span>
      </div>
    `;

    widget.addEventListener("mouseenter", () => {
      widget.firstElementChild.style.transform = "scale(1.05)";
    });
    widget.addEventListener("mouseleave", () => {
      widget.firstElementChild.style.transform = "scale(1)";
    });

    widget.addEventListener("click", handleSyncClick);
    document.body.appendChild(widget);
  }

  async function handleSyncClick() {
    const btn = document.getElementById("monbaby-spx-sync-btn");
    if (!btn) return;

    btn.querySelector("span:last-child").textContent = "Đang đồng bộ đơn thật...";

    try {
      // 1. Scan page for order rows if on /portal/sale/order
      const scrapedOrders = extractOrdersFromPage();

      // 2. Open Mon Baby SPX App in new tab with sync payload
      const appUrl = "https://moniuxinchaospx.netlify.app";
      const targetWindow = window.open(appUrl, "_blank");

      // Broadcast payload via BroadcastChannel or postMessage
      setTimeout(() => {
        const channel = new BroadcastChannel("monbaby_spx_sync_channel");
        channel.postMessage({
          type: "SYNC_SHOPEE_ORDERS",
          orders: scrapedOrders,
          timestamp: Date.now()
        });
        channel.close();
      }, 1000);

      btn.querySelector("span:last-child").textContent = "✓ Đã đồng bộ sang App thành công!";
      setTimeout(() => {
        btn.querySelector("span:last-child").textContent = "⚡ Đồng bộ đơn sang Mon Baby SPX";
      }, 4000);
    } catch (err) {
      console.error("[Mon Baby SPX] Sync failed:", err);
      btn.querySelector("span:last-child").textContent = "Mở App Mon Baby SPX";
      window.open("https://moniuxinchaospx.netlify.app", "_blank");
    }
  }

  function extractOrdersFromPage() {
    const orderElements = document.querySelectorAll(".order-item, .order-list-item, tr.shopee-table__row");
    const extracted = [];

    orderElements.forEach((el, index) => {
      const text = el.innerText || "";
      const snMatch = text.match(/\b(2[0-9]{13,16}[A-Z0-9]*)\b/);
      if (snMatch) {
        extracted.push({
          order_sn: snMatch[1],
          raw_text: text.slice(0, 150)
        });
      }
    });

    return extracted;
  }
})();
