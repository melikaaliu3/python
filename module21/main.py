from fastapi import FastAPI

app = FastAPI()

#lidhja
@app.get("/")
def root():
    return{"message":"Hello world"}

#metoda get e cila sherben per marrjen e te dhenave
@app.get("/items")
def read_items():
    return{"items":["item1","item2","item3"]}

#marrja e userave
@app.get("/users/{user_id}")
def get_users(user_id:int):
    return{"user_id":user_id,"name":"John Dee"}

@app.post("/items/")
def create_item(name:str,price:float):
    return{"item_name":name,"item_price":price}

@app.put("/items/{item_id}")
def update_item(item_id:int,name:str,price:float):
    return{"item_id":item_id,"item_name":name,"item_price":price}

@app.delete("/items/{item_id}")
def delete_item(item_id:int):
    return{"message":f"Item{item_id}deleted"}



