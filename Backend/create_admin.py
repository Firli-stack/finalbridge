"""
create_admin.py — Buat admin pertama
"""
import sys
import os

# Pastikan folder script ini ada di path Python
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# IMPORT INI YANG KEMUNGKINAN HILANG DI FILE LU
from database import engine, Base, SessionLocal
import models
from auth import get_password_hash

def create_first_admin():
    # 1. Buat tabel database jika belum ada
    Base.metadata.create_all(bind=engine)
    
    # 2. Inisialisasi session database
    db = SessionLocal()
    
    try:
        # Cek apakah admin sudah ada
        admin = db.query(models.User).filter(models.User.username == "admin").first()
        if admin:
            print("⚠️  Admin sudah ada! Gak perlu dibuat lagi.")
            return
        
        # Buat admin baru
        admin = models.User(
            username="admin",
            hashed_password=get_password_hash("admin123"),
            is_admin=True
        )
        
        db.add(admin)
        db.commit()
        db.refresh(admin)
        
        print("✅ Admin berhasil dibuat!")
        print("Username: admin")
        print("Password: admin123")
        print("⚠️  Ganti password ini nanti lewat database atau fitur edit.")
        
    except Exception as e:
        print(f"❌ Error saat membuat admin: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_first_admin()