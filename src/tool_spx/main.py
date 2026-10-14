"""FastAPI Application Entrypoint for Shopee Seller Pro."""

from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from tool_spx.config import settings
from tool_spx.db.seed import seed_database
from tool_spx.api.auth_router import router as auth_router
from tool_spx.api.users_router import router as users_router
from tool_spx.api.shopee_router import router as shopee_router
from tool_spx.api.orders_router import router as orders_router
from tool_spx.api.print_router import router as print_router
from tool_spx.api.products_router import router as products_router
from tool_spx.api.warehouse_router import router as warehouse_router
from tool_spx.api.customers_router import router as customers_router
from tool_spx.api.reports_router import router as reports_router
from tool_spx.api.settings_router import router as settings_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Hệ thống quản lý bán hàng Shopee Seller Pro - Shopee Open Platform & Kho Vận SPX Express"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include All API Routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(shopee_router)
app.include_router(orders_router)
app.include_router(print_router)
app.include_router(products_router)
app.include_router(warehouse_router)
app.include_router(customers_router)
app.include_router(reports_router)
app.include_router(settings_router)

# Mount Static Files
STATIC_DIR = Path(__file__).resolve().parent / "static"
STATIC_DIR.mkdir(exist_ok=True)
(STATIC_DIR / "css").mkdir(exist_ok=True)
(STATIC_DIR / "js").mkdir(exist_ok=True)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Mount React Mobile App (frontend/dist)
FRONTEND_DIST = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if FRONTEND_DIST.exists() and (FRONTEND_DIST / "assets").exists():
    app.mount("/mobile/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="mobile_assets")
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="root_assets")

@app.on_event("startup")
def on_startup():
    """Ensure database schema is created and initial data is seeded."""
    seed_database()

@app.get("/")
def serve_index():
    """Serve the React Mobile App (15 screens) as default view at /."""
    mobile_index = FRONTEND_DIST / "index.html"
    if mobile_index.exists():
        return FileResponse(mobile_index)
    index_file = STATIC_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return JSONResponse({"status": "running", "message": "Shopee Seller Pro API is ready."})

@app.get("/mobile")
def serve_mobile():
    """Serve the React Mobile App."""
    mobile_index = FRONTEND_DIST / "index.html"
    if mobile_index.exists():
        return FileResponse(mobile_index)
    return JSONResponse({"error": "React mobile app not built yet. Run npm run build in frontend."})

SCREEN_ROUTES = {
    "welcome", "login", "dashboard", "orders", "order-detail",
    "batch-print", "printing-progress", "warehouse", "products",
    "customers", "rankings", "reports", "staff", "shopee-api", "settings"
}

@app.get("/{screen_name}")
def serve_screen(screen_name: str):
    """Support bookmarking and direct links to any of the 15 screens."""
    if screen_name in SCREEN_ROUTES:
        mobile_index = FRONTEND_DIST / "index.html"
        if mobile_index.exists():
            return FileResponse(mobile_index)
    index_file = STATIC_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return JSONResponse({"error": "Not found"}, status_code=404)

@app.get("/admin")
def serve_admin():
    """Serve the Desktop Management Portal at /admin."""
    index_file = STATIC_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return JSONResponse({"status": "running", "message": "Shopee Seller Pro Desktop Portal is ready."})

@app.get("/favicon.svg")
def serve_favicon():
    """Serve favicon.svg."""
    fav = FRONTEND_DIST / "favicon.svg"
    if fav.exists():
        return FileResponse(fav)
    fav_pub = Path(__file__).resolve().parent.parent.parent / "frontend" / "public" / "favicon.svg"
    if fav_pub.exists():
        return FileResponse(fav_pub)
    return JSONResponse({}, status_code=204)

@app.get("/health")
def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

def start():
    """Start uvicorn server directly."""
    import uvicorn
    uvicorn.run("tool_spx.main:app", host=settings.HOST, port=settings.PORT, reload=True)

if __name__ == "__main__":
    start()
