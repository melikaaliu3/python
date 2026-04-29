import streamlit as st
import requests
import pandas as pd
from datetime import datetime
import plotly.express as px
from dotenv import load_dotenv
import os

load_dotenv()
# Define the base URL of the FastAPI application
BASE_URL = os.getenv('BASE_URL')

api_key_input = st.text_input("Enter API Key", type="password")


def validate_api_key(api_key):
    headers = {"api-key": api_key}
    response = requests.get(f"{BASE_URL}/validate_key/", headers=headers)
    return response.status_code == 200


# Helper functions for API communication
def get_trips():
    response = requests.get(f"{BASE_URL}/trips/")
    if response.status_code == 200:
        return response.json()
    else:
        st.error("Failed to fetch trips.")
        return []


def add_trip(api_key, name):
    headers = {"api-key": api_key}
    response = requests.post(f"{BASE_URL}/trips/", json={"name": name}, headers=headers)
    if response.status_code == 200:
        st.success(f"Trips '{name}' added successfully!")
    else:
        st.error(f"Failed to add trip: {response.json().get('detail', 'Unknown error')}")


def update_trip(api_key, trip_id, name):
    headers = {"api-key": api_key}
    response = requests.put(f"{BASE_URL}/trips/{trip_id}", json={"name": name}, headers=headers)
    if response.status_code == 200:
        st.success(f"Trips '{name}' updated successfully!")
    else:
        st.error(f"Failed to update trip: {response.json().get('detail', 'Unknown error')}")


def delete_trip(api_key, trip_id):
    headers = {"api-key": api_key}
    response = requests.delete(f"{BASE_URL}/trips/{trip_id}", headers=headers)
    if response.status_code == 200:
        st.success("Trip deleted successfully!")
    else:
        st.error(f"Failed to delete Trip: {response.json().get('detail', 'Unknown error')}")


def get_trips():
    response = requests.get(f"{BASE_URL}/trips/")
    if response.status_code == 200:
        return response.json()
    else:
        st.error("Failed to fetch trips.")
        return []


def add_trip(api_key, trip_data):
    headers = {"api-key": api_key}
    response = requests.post(f"{BASE_URL}/trips/", json=trip_data, headers=headers)
    if response.status_code == 200:
        st.success(f"Trip '{book_data['title']}' added successfully!")
    else:
        st.error(f"Failed to add Trip: {response.json().get('detail', 'Unknown error')}")


def update_trip(api_key, trip_id, trip_data):
    headers = {"api-key": api_key}
    response = requests.put(f"{BASE_URL}/trip/{trip_id}", json=trip_data, headers=headers)
    if response.status_code == 200:
        st.success(f"Trip '{trip_data['title']}' updated successfully!")
    else:
        st.error(f"Failed to update trip: {response.json().get('detail', 'Unknown error')}")


def delete_trip(api_key, trip_id):
    headers = {"api-key": api_key}
    response = requests.delete(f"{BASE_URL}/trip/{trip_id}", headers=headers)
    if response.status_code == 200:
        st.success("Trip deleted successfully!")
    else:
        st.error(f"Failed to delete trip: {response.json().get('detail', 'Unknown error')}")


# Dashboard for managing Authors
def trips_dashboard(api_key):
    st.title("Trips Management")

    # Display existing authors
    st.subheader("Existing Trips")
    trips = get_trips()
    df_trips = pd.DataFrame(trips)
    st.dataframe(df_authors, use_container_width=True)

    # Form to add a new author
    st.subheader("Add New Trip")
    new_trip_name = st.text_input("Trip Name")

    if st.button("Add Trip"):
        if new_trip_name.strip():
            add_trip(api_key, new_trip_name)
        else:
            st.error("Trip name cannot be empty.")

    # Choose an action to perform
    action = st.radio("What would you like to do?", options=["Update Trip", "Delete Trip"])

    if action == "Update Trip":
        selected_trip = st.selectbox("Select Trip to Update", options=[author['name'] for trip in trips])
        new_name = st.text_input("New Trip Name", value=selected_author)

        if st.button("Update Trip"):
            trip_id = next((author['id'] for trip in trips if trip['name'] == selected_trip), None)
            update_trip(api_key, trip_id, new_name)

    elif action == "Delete Trip":
        trip_to_delete = st.selectbox("Select Trip to Delete", options=[trip['name'] for trip in trips])
        if st.button("Delete Trip"):
            trip_id = next((trip['id'] for trip in trips if trip['name'] == trip_to_delete), None)
            delete_trip(api_key, trip_id)


# Dashboard for managing Books
def city_dashboard(api_key):
    st.title("City Management")

    # Display existing books
    st.subheader("Existing Cities")
    cities = get_cities()
    trips = get_trips()

    trip_id_to_name = {trip['id']: trip['name'] for trip in trips}
    for trip in trips:
        city['trips'] = trip_id_to_name.get(city['trip_id'], 'Unknown')
        city['genres'] = ', '.join(city['genres'])  # Display genres as a comma-separated list of names
        del trip['author_id']

    df_trips = pd.DataFrame(trips)
    st.dataframe(df_trips, use_container_width=True)

    # Form to add a new book
    st.subheader("Add New City")
    new_book_title = st.text_input("Title")
    selected_trip_name = st.selectbox("Select Trip", options=[trip['name'] for trip in trips],
                                        key="select_trip_add")
    new_city_average_rating = st.number_input("Average Rating", min_value=0.0, max_value=5.0, step=0.01)
    new_city_genres = st.text_input("Genres (comma-separated names)")
    new_city_year = st.number_input("Year", min_value=1440, max_value=datetime.now().year, step=1)

    if st.button("Add City"):
        if new_city_title.strip() and new_city_genres_genres.strip():
            genres_list = [g.strip() for g in new_city_genres.split(',') if g.strip()]
            selected_author_id = next((city['id'] for city in citiess if author['name'] == selected_author_name),
                                      None)
            city_data = {
                "title": new_city_title,
                "trip_id": selected_city_id,
                "city_link": "",  # Assuming book_link is optional for creation
                "genres": genres_list,  # List of genre names
                "average_rating": new_trip_average_rating,
                "published_year": new_trip_year
            }
            add_city(api_key, city_data)
        else:
            st.error("Title and Genres cannot be empty.")

    # Choose an action to perform
    action = st.radio("What would you like to do?", options=["Update City", "Delete City"], key="radio_action")

    if action == "Update City":
        selected_city = st.selectbox("Select City to Update", options=[city['title'] for city in cities],
                                     key="select_city_update")

        if selected_city:
            city = next((city for city in cities if city['title'] == selected_city), None)
            new_city_year_title = st.text_input("Title", value=city['title'])
            selected_trip_name = st.selectbox("Select Trip", options=[author['name'] for trip in trips],
                                                index=[author['name'] for author in authors].index(book['author']),
                                                key="select_author_update")
            new_book_average_rating = st.number_input("Average Rating", min_value=0.0, max_value=5.0, step=0.01,
                                                      value=book['average_rating'])
            new_book_genres = st.text_input("Genres (comma-separated names)",
                                            value=book['genres'])  # Show existing genres as a comma-separated string
            new_book_year = st.number_input("Year", min_value=1440, max_value=datetime.now().year, step=1,
                                            value=book['published_year'])
            book_id = book['id']

            if st.button("Update Book"):
                genres_list = [g.strip() for g in new_book_genres.split(',') if g.strip()]
                book_data = {
                    "title": new_book_title,
                    "author_id": next((author['id'] for author in authors if author['name'] == selected_author_name),
                                      None),
                    "book_link": book.get('book_link', ""),
                    "genres": genres_list,  # Update with the list of genre names
                    "average_rating": new_book_average_rating,
                    "published_year": new_book_year
                }
                update_book(api_key, book_id, book_data)

    elif action == "Delete Book":
        book_to_delete = st.selectbox("Select Book to Delete", options=[book['title'] for book in books],
                                      key="select_book_delete")
        if st.button("Delete Book"):
            book_id = next((book['id'] for book in books if book['title'] == book_to_delete), None)
            delete_book(api_key, book_id)


# Visualizations Dashboard

def visualizations_dashboard():
    st.title("Visualizations Dashboard")

    # Fetch the books and authors data
    books = get_books()
    authors = get_authors()

    if books:
        # Convert books to a DataFrame
        df_books = pd.DataFrame(books)

        if 'author_id' in df_books.columns:
            # Map author_id to author names
            author_id_to_name = {author['id']: author['name'] for author in authors}
            df_books['author'] = df_books['author_id'].map(author_id_to_name)
            df_books.drop('author_id', axis=1, inplace=True)

        # Sidebar filters
        st.sidebar.title("Filters")

        # Filter by Author
        selected_author = st.sidebar.selectbox("Select Author", options=["All"] + list(author_id_to_name.values()))

        # Filter by Published Year
        min_year = int(df_books['published_year'].min())
        max_year = int(df_books['published_year'].max())
        selected_year = st.sidebar.slider("Select Published Year", min_value=min_year, max_value=max_year,
                                          value=(min_year, max_year))

        # Filter by Average Rating (fixed range from 0.0 to 5)
        selected_rating = st.sidebar.slider("Select Average Rating", min_value=0.0, max_value=5.0, value=(0.0, 5.0),
                                            step=0.1)

        # Check if any filters are applied
        filters_applied = selected_author != "All" or selected_year != (min_year, max_year) or selected_rating != (
            0.0, 5.0)

        # Apply Filters Button
        if st.sidebar.button("Apply Filters") or not filters_applied:
            # Apply filters if any are set
            filtered_books = df_books.copy()  # Default to showing all data if no filters applied

            if filters_applied:
                if selected_author != "All":
                    filtered_books = filtered_books[filtered_books['author'] == selected_author]

                filtered_books = filtered_books[(filtered_books['published_year'] >= selected_year[0]) & (
                        filtered_books['published_year'] <= selected_year[1])]
                filtered_books = filtered_books[(filtered_books['average_rating'] >= selected_rating[0]) & (
                        filtered_books['average_rating'] <= selected_rating[1])]

            # Visualization 1: Books by Year
            if not filtered_books.empty:
                st.subheader(f"Books by Year")
                books_by_year = filtered_books.groupby('published_year').size().reset_index(name='Count')
                fig_years = px.bar(
                    books_by_year,
                    x='published_year',
                    y='Count',
                    title=f'Number of Books by Year',
                    labels={"published_year": "Published Year", "Count": "Number of Books"},
                    text='Count'
                )
                fig_years.update_traces(texttemplate='%{text:.2s}', textposition='outside')
                fig_years.update_layout(
                    uniformtext_minsize=8,
                    uniformtext_mode='hide',
                    xaxis=dict(
                        tickmode='linear',
                        tick0=min_year,
                        dtick=5,  # Show a label every 5 years (adjust as needed)
                        tickangle=-45,
                        tickfont=dict(size=10)
                    ),
                    yaxis=dict(title='Number of Books', range=[0, books_by_year['Count'].max() + 1]),
                    title_x=0.5
                )
                st.plotly_chart(fig_years, use_container_width=True)

                # Visualization 2: Books by Average Rating
                st.subheader(f"Books by Average Rating")
                books_by_rating = filtered_books.groupby('average_rating').size().reset_index(name='Count')
                fig_ratings = px.bar(
                    books_by_rating,
                    x='average_rating',
                    y='Count',
                    title='Number of Books by Average Rating',
                    labels={"average_rating": "Average Rating", "Count": "Number of Books"},
                    text='Count'
                )
                fig_ratings.update_traces(texttemplate='%{text:.2s}', textposition='outside')
                fig_ratings.update_layout(
                    uniformtext_minsize=8,
                    uniformtext_mode='hide',
                    yaxis=dict(title='Number of Books', range=[0, books_by_rating['Count'].max() + 1]),
                    title_x=0.5
                )
                st.plotly_chart(fig_ratings, use_container_width=True)
            else:
                st.warning("No book data available for the selected filters.")
    else:
        st.warning("No book data available for visualizations.")


# Main app logic
st.sidebar.title("Navigation")
option = st.sidebar.selectbox("Choose a dashboard", ["Authors Dashboard", "Books Dashboard", "Visualizations"])
if option == "Visualizations":
    visualizations_dashboard()
if api_key_input and validate_api_key(api_key_input):
    if option == "Authors Dashboard":
        authors_dashboard(api_key_input)
    elif option == "Books Dashboard":
        books_dashboard(api_key_input)
else:
    st.error("Invalid API Key or API Key is missing.")
