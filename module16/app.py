import streamlit as st

def main():
    st.title("Hello, World!")

if st.button("Click me"):
    st.write("Button clicked!")
st.checkbox("Check me")
if st.checkbox("Check me to show some text"):
    st.write("You're seeing this text beacuse you checked the checkbox")

user_input = st.text_input("Enter Text", "Sample text")
st.write("you have entered: ", user_input)
age = st.number_input("Enter you are",min_value=0,max_value=100)
st.write(f"Your age is: {age}")

message = st.text_area("Enter a meesage")
st.write(f"Your message: {message}")

choice = st.radio("Pick one",["Choice 1","Choice 2","Choice 3"])
st.write(f"You chose: {choise}")
if st.button("Success"):
    st.success("Operation was successful")

if __name__ == "__main__":
    main()