class Animal:

    def sound(self):
        print("Some generic animal sound.")

class Dog(Animal):
    def sound(self):
        print("woof woof")

class Cat(Animal):
    def sound(self):
        print("meow")



animal = Animal()
animal.sound()

dog = Dog()
dog.sound()

cat = Cat()
cat.sound()