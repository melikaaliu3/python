class MyClass:
    def __init__(self):
        self.__protected_variable = "This is a protected variable"

    def __protected_method(self):
        print("This is a protected method")


my_class = MyClass()

print(my_class.__protected_variable)
print(my_class.__protected_method())