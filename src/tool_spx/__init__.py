"""Shopee Seller Pro - Application Entrypoint."""

import sys
import uvicorn
from rich.console import Console
from rich.panel import Panel
from tool_spx.config import settings
from tool_spx.db.seed import seed_database

console = Console()

def main() -> None:
    """Initialize database and launch Shopee Seller Pro server."""
    console.print(
        Panel.fit(
            "[bold red]SHOPEE SELLER PRO[/bold red] - [bold yellow]SPX Express Management System[/bold yellow]\n"
            f"[dim]Phiên bản: {settings.VERSION} | Môi trường: {settings.ENVIRONMENT}[/dim]\n"
            f"[bold green]➜ Hệ thống đang chạy tại:[/bold green] [bold cyan]http://{settings.HOST}:{settings.PORT}[/bold cyan]\n"
            "[dim]Tài khoản Admin mặc định: [bold]admin[/bold] / [bold]Admin@123456[/bold][/dim]",
            border_style="red",
        )
    )

    # Ensure database is seeded
    seed_database()

    # Launch server
    uvicorn.run("tool_spx.main:app", host=settings.HOST, port=settings.PORT, reload=False)

if __name__ == "__main__":
    main()
