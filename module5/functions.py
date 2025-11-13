# def greet():
#     print("Hello world")
#
# greet()
#
# def greet_person(name):
#     print("hello",name)
#
# greet_person("Melika")
# greet_person("Redola")

# def greet(name):
#     message=f"Hello,{name}"
#     print(message)
#
# greet("Alice")
# print(message)

# greeting="hello"
#
# def greet(name):
#     message=f"{greeting},{name}"
#     print(message)
#
# greet("bob")
# print(greeting)

# def greet():
#     global greeting
#     greeting="Goodbye"
#     name="Alice"
#
#     messafe=f"{greeting},{name}"
#
#     print(message)
#
# greet()
# print(greeting)


def greet_person(name,greeting="Hello"):
    message=f"{greeting},{name}"
    return message

print(greet_person("Alice"))
print(greet_person("Bob","Hi"))