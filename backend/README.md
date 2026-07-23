# Backend Kos Bu Henny

Dokumentasi lengkap ada di `../README.md`.

Urutan manual:

```powershell
Copy-Item .env.example .env
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Database default project: `kos_db`. Jangan drop database existing untuk upgrade; gunakan Alembic migration.

### Isi data dummy

Pastikan `.env` memiliki `SEED_DUMMY_DATA=true`, lalu jalankan:

```powershell
python -m app.scripts.seed_dummy_data
```

Perintah ini tidak melakukan `DROP` dan tidak menimpa tabel yang sudah berisi data.
