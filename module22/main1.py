from pydantic import BaseModel, FieldValidation , field_validator, constr, conint

class User(BaseModel):
    id: int
    name: str
    age: int

   @field_validator('age')
   def age_must_be_positive(cls, v , info:FieldValidation):
        if v <= 0 :
            raise ValueError("Age must be positive")
        return v

try:
    user = User(id = 1 , name="Test name" , age= )