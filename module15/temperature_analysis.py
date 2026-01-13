import pandas as pd
import matplotlib.pyplot as plt

# Load dataset
df = pd.read_csv("temperature_data.csv")

# Convert date column to datetime
df['date'] = pd.to_datetime(df['date'])

# Add month column
df['month'] = df['date'].dt.month

# --------------------------------------------------
# 1. Temperature Overview
# --------------------------------------------------
average_temp = df['temperature'].mean()
print(f"Average temperature for entire dataset: {average_temp:.2f}°C")

# --------------------------------------------------
# 2. Monthly Temperature
# a. Average temperature per month
# --------------------------------------------------
monthly_avg = df.groupby('month')['temperature'].mean()
print("\nMonthly Average Temperature:")
print(monthly_avg)

# b. Bar plot
plt.figure(figsize=(8, 5))
monthly_avg.plot(kind='bar', color='skyblue')
plt.title("Average Monthly Temperature")
plt.xlabel("Month")
plt.ylabel("Temperature (°C)")
plt.tight_layout()
plt.show()

# --------------------------------------------------
# 3. Highs and Lows
# --------------------------------------------------
hottest_day = df.loc[df['temperature'].idxmax()]
coldest_day = df.loc[df['temperature'].idxmin()]

print("\nHottest Day:")
print(hottest_day)

print("\nColdest Day:")
print(coldest_day)

# --------------------------------------------------
# 4. Temperature Trends
# a. Line graph
# --------------------------------------------------
plt.figure(figsize=(8, 5))
plt.plot(df['date'], df['temperature'], marker='o')
plt.title("Temperature Trend Over Time")
plt.xlabel("Date")
plt.ylabel("Temperature (°C)")
plt.grid(True)
plt.tight_layout()
plt.show()

# --------------------------------------------------
# 4.b Seasonal Average Temperature
# --------------------------------------------------
def get_season(month):
    if month in [12, 1, 2]:
        return "Winter"
    elif month in [3, 4, 5]:
        return "Spring"
    elif month in [6, 7, 8]:
        return "Summer"
    else:
        return "Autumn"

df['season'] = df['month'].apply(get_season)

seasonal_avg = df.groupby('season')['temperature'].mean()
print("\nSeasonal Average Temperature:")
print(seasonal_avg)
