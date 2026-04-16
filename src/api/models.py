from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(
        String(80), unique=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), unique=False, nullable=False)

    def serialize(self):
        return {"id": self.id, "email": self.email}


class Habit(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(250), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description
        }
