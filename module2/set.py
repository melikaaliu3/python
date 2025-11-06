# my_set = {1, 2, 3}
# my_set = set()
# my_set = set([4, 5, 6])
#
# print(my_set)


# set1 = {1, 2, 3}
# set2 = {3, 4, 5}
#
#
# union_result_method = set1.union(set2)
# print("Union:", union_result_method)
#
#
# union = set1 | set2
# print("Union method:", union)
#
#
# intersection = set1 | set2
# print("intersection method:", intersection)
#
#
# difference = set1 | set2
# print("difference method:", difference)
#
#
# symmetrical_difference = set1 | set2
# print("symmetrical_difference method:", symmetrical_difference  )
#
# set methods

# my_set = {1, 2, 3}

# my_set.add(4)
# my_set.remove(3)
# my_set.discard(1)
# my_set.clear()
#
# print (my_set)

# set_length = len(my_set)
# print("Length of set:",set_length)

# using sets - removing duplicates

# my_list = [1, 2, 2, 2, 3, 3, 4, 5]
#
# unique_set = set(my_list)
#
# unique_list = list(unique_set)
#
# print(unique_list)

# IN and NOT IN

# loyalty_members = {" Melika","Ensar","Redola"}
# costumer = "Ensar"
#
# is_member = costumer in loyalty_members
#
# print(is_member)

# age = 18

# if age >= 18:
#     print("you can vote")
#         else:
#     print("You cannot vote")

# temp = 18
#
# if temp > 30:
#     print("its a hot day")
# elif 20 <= temp <=30:
#     print("its a good day")
# else:
#     print("its a cold day")


student_gpa = 4.5
student_score = 75

if student_gpa >= 3.5:
    if 50 <= student_score <= 65:
    print(f"students with GPA {student_gpa} and test score of {student_score} may be eligible for a partial schoolarship")
   elif student_score > 65:
    print(f"students with GPA {student_gpa} and test score of {student_score} may be eligible for a full schoolarship")
    else:
    print(f"students with GPA {student_gpa} and test score of {student_score} may be eligible for a  schoolarship")
else:
    print(
        f"students with GPA {student_gpa} and test score of {student_score} may be eligible for aa schoolarship")










