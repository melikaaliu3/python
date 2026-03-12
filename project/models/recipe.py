from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    ingredients = Column(String)
    instructions = Column(String)
    category_id = Column(Integer, ForeignKey("categories.id"))