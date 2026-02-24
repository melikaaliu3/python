from typing import Optional
from typing import Union
from typing import Any
from typing import List

def get_name(name: Optional[str] = None) -> str:
    if name:
        return name
    return "Anonymus"

print(get_name())

def process_value(value: Union[int, str]) -> str:
    if isinstance(value, int):
        return f"Number: {value}"
    return f"String: {value}"

print(process_value("Digital school"))

def process_anything(value: Any) -> str:
    return f"Processed {value}"

print(process_value(1))

def sum_list(numbers: List[int]) -> int:
    return sum(numbers)

numbers:List[int] = [1,2,3]
result: int = sum_list(numbers)
print(result)

