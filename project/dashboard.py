import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px

st.title("🍲 Recipe Analytics Dashboard")

conn = sqlite3.connect("recipes.db")

recipes = pd.read_sql("SELECT * FROM recipes", conn)

st.write("Recipes Table")
st.dataframe(recipes)

if not recipes.empty:

    fig = px.histogram(
        recipes,
        x="category_id",
        title="Recipes per Category",
        color="category_id"
    )

    st.plotly_chart(fig)

st.write("Total Recipes:", len(recipes))