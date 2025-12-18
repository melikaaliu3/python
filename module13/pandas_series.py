import pandas as pd

from Module13.array_manipulation import total_sum

products=['apples','Bananas','oranges','grapes','pineapples']

sales=[150,200,180,90,60]

sales_series=pd.Series(sales,index=products)
print(sales_series)

print(sales_series['grapes'])

total_sales=sales_series.sum()
print(total_sales)

betst_sell=sales_series.idxmax()
print(best_sell)

