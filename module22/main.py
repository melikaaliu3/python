from pydantic import BaseModel ,conint ,constr
from typing import Optional

class User(BaseModel):
    id: int
    name: str
    age: int
    email: str

user = User(id= 1, name="Test" , age=39 , email="test@gmail.com")

print(user)

user1 =  User(id=2 , name="Test" , email="test@gmail.com")
print(user1)
user2 = User(id=3 , name="Test1" ,age=23)
print(user2)
user3 = User(id=4 , name="Test3" )
print(user3)

class another_user(BaseModel):
    id: conint(gt = 0)
    name: constr(min_length=0 , max_length=50)

#valid_user = another_user(id=1 , name="test")
#print(valid_user)

user5 = another_user(id=0 , name="test")
print(user5)
