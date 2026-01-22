import pandas as pd
import streamlit as st
import plotly.express as px

st.header("dataframing ")

df = pd.DataFrame({
    'Name': ['Vlera','Melika','Ensari'],
    'Age': [24, 17, 13],
    'City': ['Gjilan','Prishtine','Fushe Kosove']

})

st.write(df)

st.title("Bestselling Book Analysis")
st.write("This app analyzes the Amazon top selling books from 2009 to 2022.")

books_df = pd.read_csv('Module18/bestsellers_with_categories_2022_03_27.csv')
total_books = books_df.shape[0]
unique_titles = books_df['Name'].nunique()
average_rating = books_df['User Rating'].mean()
average_price = books_df['Price'].mean()

col1, col2, col3, col4 = st.columns(4)
col1.metric("Total Books", total_books)
col2.metric("Unique titles", unique_titles)
col3.metric("Average Rating",f"{average_rating:.2f}")
col4.metric("Average Price", f"{average_price:.2f}")

st.subheader("Dataset Preview")
st.write(books_df.head())

col1, col2 = st.columns(2)

with col1:
    st.subheader("Top 10 Book Titles")
    top_titles = books_df['Name'].value_counts().head(10)
    st.bar_chart(top_titles)

with col2:
    st.subheader("Top 10 Book Authors")
    top_titles = books_df['Author'].value_counts().head(10)
    st.bar_chart(top_authors)


st.subheader("Number of Fiction vs Non-Fiction Books over the years")
size = books_df.groupby(['Year','Genre']).size().reset_index(name='Counts')
fig = px.bar(size, x='Year', y='Counts', color='Genre', title="Number of Fiction vs Non-Fiction Books from 2009-2022",
             color_discrete_sequence=px.sequental.Plasma, barmode='group')

st.plotly_chart(fig)



