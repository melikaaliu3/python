from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.recipe import Recipe

router = APIRouter(prefix="/recipes", tags=["Recipes"])


@router.post("/")
def create_recipe(
    title: str,
    ingredients: str,
    instructions: str,
    category_id: int,
    db: Session = Depends(get_db),
):

    recipe = Recipe(
        title=title,
        ingredients=ingredients,
        instructions=instructions,
        category_id=category_id,
    )

    db.add(recipe)
    db.commit()
    db.refresh(recipe)

    return recipe


@router.get("/")
def get_recipes(db: Session = Depends(get_db)):
    return db.query(Recipe).all()