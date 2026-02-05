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


#Book title distribution
with col1:
    st.subheader("Top 10 Book titles")
    top_titles = filtered_books_df["Name"].value_counts().head(10)
    st.bar_chart(top_titles)

with col2:
    st.subheader("top 10 authors")
    top_authors = filtered_books_df['Author'].value_counts().head(10)
    st.bar_chart(top_authors)

#Genre Distribution Pie Chart
st.subheader("Genre Distribution")
fig = px.pie(filtered_books_df, names='Genre', title='Most liked Genre (2009-2022)', colors='Genre',
            color_discrete_sequence=px.color.sequintal.Plasma)

#Number of Fiction vS Non-Fiction Books Over the Years
st.subheader("Number of fiction vs non-fiction books over the years")
size = filtered_books_df.groupby(['Year','Genre']).size().reset_index(name='Counts')


st.plotly_chart(fig)

st.subheader("Top 15 authors by counts of books published (2009-2022)")
top_authors = filtered_books_df['Author'].value.counts().head(15).reset_index()
top_authors.columns = ['Author', 'Count']
fig = px.bar(top_authors , x='Count', y='Author' , orientation='h')
            title = 'top 15 authors by counts of books published',
            labels={'Count': 'Counts of books published' , 'Author': 'Author'},
            color = 'Count', color_continous_scale=px.colors.sequemtial.Plasma)
st.plotly_chart(fig)

st.subheader('Filter Data by Genre')
genre_filter = st.selectbox("Select Genre", filtered_books_df['Genre'].unique())
filtered_books_df = filtered-books_df[filtered_books_df['Genre'] == genre_filter]
st.write(filtered_genre_df)
