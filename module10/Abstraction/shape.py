from abc import ABC,abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Circle(Shape):
    def __init__(self,radius):
        self.radius=radius

    def area(self):
        return 3.14*self.radius*self.radius

class Square(Shape):
    def __init__(self,length):
        self.length=length

    def area(self):
        return self.length*self.length

circle_1=Circle(7)
print(circle_1.area())

square_1=Square(10)
print(square_1.area())
