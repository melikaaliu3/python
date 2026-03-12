import uvicorn
from app import app
from database import Base, engine

Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)