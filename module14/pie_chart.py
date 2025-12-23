import pandas as pd
import matplotlib.pyplot as plt

df=pd.read_csv("avgIQpercountry.csv")

novel_prizes_by_continent=df.groupby('Continent')['Nobel Prices'].sum()

no_of_continents=novel_prizes_by_continent.count()
print(no_of_continents)

color=['gold','lightcoral','yellow','thristle','orange','skyblue','aquamarine','burlywood']
plt.figure(figsize=(10,10))

novel_prizes_by_continent.plot(kind="pie",colors=colors,autopct="%1.1f%%")

plt.title('Distribution of Nobel Prices by Continent')
plt.axis('equal')
plt.ylabel('')

plt.tight_layout()
plt.show()