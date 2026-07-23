from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import inspect
from sqlalchemy.exc import SQLAlchemyError

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.routers import admin, auth, public
from app.seed import seed_database


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Safe for existing kos_db: SQLAlchemy only creates missing tables and does not drop data.
    # Alembic migrations are also included and remain the recommended production path.
    Base.metadata.create_all(bind=engine)

    inspector = inspect(engine)
    if "kamar" in inspector.get_table_names():
        room_columns = {column["name"] for column in inspector.get_columns("kamar")}
        required_columns = {"slug", "periode_harga"}
        if not required_columns.issubset(room_columns):
            raise RuntimeError(
                "Schema database belum dimigrasikan. Jalankan `alembic upgrade head` "
                "dari folder backend sebelum menyalakan FastAPI."
            )

    with SessionLocal() as db:
        seed_database(db)
    yield


app = FastAPI(
    title=settings.app_name,
    version="3.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/media", StaticFiles(directory=settings.upload_path), name="media")

app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(public.router, prefix=settings.api_prefix)
app.include_router(admin.router, prefix=settings.api_prefix)


@app.exception_handler(RequestValidationError)
async def validation_handler(_: Request, exc: RequestValidationError):
    errors = [
        {"loc": list(item.get("loc", [])), "msg": item.get("msg", "Tidak valid"), "type": item.get("type", "validation_error")}
        for item in exc.errors()
    ]
    return JSONResponse(
        status_code=422,
        content={"detail": "Data yang dikirim belum valid.", "errors": errors},
    )


@app.exception_handler(SQLAlchemyError)
async def database_handler(_: Request, __: SQLAlchemyError):
    return JSONResponse(status_code=500, content={"detail": "Terjadi masalah saat mengakses database."})


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok", "service": settings.app_name, "environment": settings.app_env}
