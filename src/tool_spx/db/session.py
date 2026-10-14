"""Database session and connection engine."""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from tool_spx.config import settings

# SQLite connection with thread safety and WAL mode
connect_args = {"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency for obtaining a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
