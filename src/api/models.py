from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
import datetime

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(80), nullable=True)
    apellido: Mapped[str] = mapped_column(String(80), nullable=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    habitos: Mapped[list["Habito"]] = relationship("Habito", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "email": self.email,
        }

class Categoria(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(80), nullable=False)
    color: Mapped[str] = mapped_column(String(20), nullable=False, default="primary")
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    habitos: Mapped[list["Habito"]] = relationship("Habito", back_populates="categoria")

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "color": self.color,
        }

class Habitos(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    descripcion: Mapped[str] = mapped_column(String(300), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True, nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    categoria_id: Mapped[int] = mapped_column(ForeignKey("categoria.id"), nullable=True)
    user: Mapped["User"] = relationship("User", back_populates="habitos")
    categoria: Mapped["Categoria"] = relationship("Categoria", back_populates="habitos")
    registros: Mapped[list["HabitoRegistro"]] = relationship("HabitoRegistro", back_populates="habito")

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "is_active": self.is_active,
            "categoria_id": self.categoria_id,
            "categoria_nombre": self.categoria.nombre if self.categoria else None,
            "categoria_color": self.categoria.color if self.categoria else None,
        }

class HabitoRegistro(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    habito_id: Mapped[int] = mapped_column(ForeignKey("habito.id"), nullable=False)
    fecha: Mapped[datetime.date] = mapped_column(Date, nullable=False, default=datetime.date.today)
    completado: Mapped[bool] = mapped_column(Boolean(), default=True, nullable=False)
    habito: Mapped["Habito"] = relationship("Habito", back_populates="registros")

    def serialize(self):
        return {
            "id": self.id,
            "habito_id": self.habito_id,
            "fecha": self.fecha.isoformat(),
            "completado": self.completado,
        }
