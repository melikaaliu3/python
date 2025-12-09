from abc import ABC,abstractmethod

class Printable(ABC):

    @abstractmethod
    def print_info(self):
        pass

class Book(Printable):
    def __init__(self,title,author):
        self.title=title
        self.author=author

    def print_info(self):
        print(f"Book:{self.title} by {self.author}")

book=Book("The Great Gatsby", "F. Scott Fitzgerald")
book.print_info()
