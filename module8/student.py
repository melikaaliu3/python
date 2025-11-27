class Student:
    school_name = "Digital school"
    def __init__(self, name, age, course):
        self.name =  name
        self.age = age
        self.course = course

student_1 = Student("Alice", 15, "Python")
student_2 = Student("Bob", 16, "JavaScript")

print(student_1.course)
print(student_2.name)

