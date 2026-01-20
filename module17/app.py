import streamlit as st

col1,col2,col3,col4,col5=st.columns(5,gap="small",vertical_alignment="center")

with col1:
    st.header("Column 1")
    st.write("Content for column 1")

with col2:
    st.header("Column 2")
    st.write("Content for column 2")

with col3:
    st.header("Column 3")
    st.write("Content for column 3")

with col4:
    st.header("Column 4")
    st.write("Content for column 4")

with col5:
    st.header("Column 5")
    st.write("Content for column 5")

with st.container():
    st.header("this is a container")
    st.write("this is inside the container")

st.write("This is outside the container")

st.sidebar.header("Sidebar")

st.sidebar.write("this is the sidebar")

st.sidebar.selectbox("Choose option",["Option 1","Option 2","Option 3"])

st.sidebar.radio("Go to",["Home","Data","Settings"])

with st.form("my_form"):
    name=st.text_input('Name')

    age=st.slider("Age",min_value=0,max_value=100)

    email=st.text_input("Email")

    biography=st.text_area("Short Bio")

    terms=st.checkbox("I agree")

    submit_button=st.form_submit_button(label="Submit")

