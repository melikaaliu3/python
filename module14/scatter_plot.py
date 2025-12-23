import matplotlib.pyplot as plt
import pandas as pd

from module14.pie_chart import color

df=pd.read_csv("avgIQpercountry.csv")

plt.figure(figsize=(10,6))

plt.scatter(df['Mean years of schooling-2021'],df['Average IQ'],color="purple",alpha=0.7)

plt.title('Scatter Plot of Mean Years of schooling as Average IQ')

plt.xlabel('Mean years of schooling-2021')

plt.ylabel('Averge IQ')

plt.grid(TRUE,linestyle="--",alpha=0.7)

plt.show()