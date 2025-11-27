class MyClass:
    def __init__(self):
        self.__public_variable = "This is a public variable"

    def __private_method(self):
        print("This is a private method")

my_class = MyClass()

print(my_class.public_variable)

