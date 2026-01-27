import pandas as pd
import streamlit as st
import plotly.express as px

from module17.app import submit_button
from module18.app import books_df

books_df= pd.read_csv('bestsellers_with_categories_2022_03_27.csv')

st.title("Bestselling book analysis")
st.write("this is a streamlit app")

st.sidebar.header("Add a new book data")
with st.sidebar.form("book_form"):
    new_name = st.text_input("Book name")
    new_author = st.text_input("Author")
    new_user_rating = st.slider("User Rating", 0.0, 5.0, 0.1)
    new_reviews = st.number_input("Reviews",min_value=0, step=1)
    new_price = st.number_input("Price", min_value=0, step=1)
    new_year = st.number_input("Year", min_value=2009, max_value=2026)
    new_genre = st.selectbox("Genre", books_df['Genre'].unique())
    submit_button = st.form_submit_button(label="Add Book")

    if submit_button:
        new_data = {
            'Name': new_name,
            'Author': new_author,
            'User Rating': new_user_rating
            'Reviews': new_reviews,
            'Price': new_price,
            'Year': new_year,
            'Genre': new_genre
        }

        books_df = pdconcat([pd.DataFrame(new_data, index=[0]),books_df], ignore_index=True)
        books_df.to_csv('bestsellers_with_categories_2022_03_27.csv', index=False)
        st.sidebar.success("New Book added")

st.sidebar.header("Filter Options")
selected_author = st.sidebar.selectbox("Select author", ["All"] + list(books_df['Author'].unique()))
selected_author = st.sidebar.selectbox("Select year", ["All"] + list(books_df['Year'].unique()))
selected_author = st.sidebar.selectbox("Select Genre", ["All"] + list(books_df['Genre'].unique()))
min_rating = st.sidebar.slider("Maximumn user rating", 0.0, 5.0, 0.1)
max_price = st.sidebar.slider("Max Price", 0 , books_df['Price'].max(), books_df['Price'].max())