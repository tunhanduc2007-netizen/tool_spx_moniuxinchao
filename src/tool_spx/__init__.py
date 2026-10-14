"""Tool SPX - Automation & Tracking CLI."""

import sys
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

console = Console()


def show_banner() -> None:
    """Hiển thị banner khởi động."""
    console.print(
        Panel.fit(
            "[bold cyan]TOOL SPX[/bold cyan] - [green]Automation & Order Processor[/green]\n"
            "[dim]Môi trường sẵn sàng: Python 3.12 + uv + Git[/dim]",
            border_style="cyan",
        )
    )


def show_status() -> None:
    """Hiển thị trạng thái các thư viện đã tích hợp."""
    table = Table(title="Trạng thái thư viện & Môi trường", border_style="blue")
    table.add_column("Thành phần", style="bold yellow")
    table.add_column("Trạng thái", style="green")
    table.add_column("Mục đích sử dụng")

    table.add_row("Python", sys.version.split()[0], "Runtime 3.12 qua uv")
    table.add_row("Requests", "Đã cài đặt", "Gọi API tra cứu vận đơn / SPX")
    table.add_row("Pandas & OpenPyXL", "Đã cài đặt", "Đọc & xuất file Excel")
    table.add_row("Rich", "Đã cài đặt", "Giao diện dòng lệnh đẹp mắt")
    table.add_row("Python-Dotenv", "Đã cài đặt", "Quản lý file cấu hình .env bí mật")

    console.print(table)


def main() -> None:
    show_banner()
    show_status()
    console.print("\n[bold green]✓ Dự án đã được thiết lập thành công![/bold green]")
    console.print("[dim]Chỉnh sửa file [bold]src/tool_spx/__init__.py[/bold] để bắt đầu viết logic của bạn.[/dim]\n")


if __name__ == "__main__":
    main()
