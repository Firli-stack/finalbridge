"""
change_password.py — Ganti password user via terminal
Usage: python change_password.py <username> <password_baru>
Contoh: python change_password.py admin password_baru_123
"""
import sys
import os

# Pastikan folder script ini ada di path Python
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine, Base, SessionLocal
import models
from auth import get_password_hash

def change_password(username: str, new_password: str):
    # Pastikan tabel ada
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(models.User.username == username).first()
        if not user:
            print(f"❌ User '{username}' tidak ditemukan di database!")
            return
        
        # Hash password baru dan simpan
        user.hashed_password = get_password_hash(new_password)
        db.commit()
        
        print(f"✅ Password untuk '{username}' berhasil diubah!")
        
    except Exception as e:
        print(f"❌ Error saat mengubah password: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("⚠️  Format salah!")
        print("Usage: python change_password.py <username> <password_baru>")
        print("Contoh: python change_password.py admin password_baru_123")
    else:
        change_password(sys.argv[1], sys.argv[2])