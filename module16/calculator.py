import streamlit as st

def calculator(num1,num2,operation):
    if operation=="Add":
        result=num1+num2
    elif operation=="Sub":
        result=num1-num2
    elif operation=="Multi":
        result=num1*num2
    elif operation=="Div":
        try:
            result=num1/num2
        except ZeroDivisionError:
            result="Cannot divide by zero"
    return result


def main():
    st.title("Simple Calculator")

    num1=st.number_input("Enter the first number",step=1)

    num2=st.number_input("Enter the second number",step=2)

    operation=st.radio("Select operation",["Add","Sub","Multi","Div"])

    result=calculator(num1,num2,operation)

    st.write(f"Result of the {operation} of {num1} and {num2} is {result}")

if __name__=="__main__":
    main()