from fastapi import FastAPI
from app.routes import movies
from app import auth

app = FastAPI(title="Movie Management System")

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(movies.router, prefix="/movies", tags=["Movies"])