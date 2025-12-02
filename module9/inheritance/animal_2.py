class Animal:
    def __init__(self, name):
        self.name = name

    def sound(self):
        print("this generic animal sound.")

    def description(self):
        print(f"this animal is named {self.name}.")

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)
        self.breed = breed

    def sound(self):
        print("wooof wooof")

    def description(self):
        super().description()

        print(f"Breed: {self.breed}")


class Cat(Animal):
    def __init__(self, name, color):
        super().__init__(name)
        self.color = color

    def sound(self):
        print("meow")

    def description(self):
        super().description()

        print(f"Color: {self.color}")

animal = Animal("Generic Animal")
animal.sound()
animal.description()

dog = Dog("Rex ", "Golden retriver")
dog.sound()
dog.description()

cat=Cat("Whiskers", "Black")
cat.sound()
cat.description()


