from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.category import Category

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.post("/")
def create_category(name: str, db: Session = Depends(get_db)):
    category = Category(name=name)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.get("/")
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()