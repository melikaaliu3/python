import pandas as pd

data={
    'Name':['alice','bob','charlie'],
    'Age':[25,30,22],
    'City':['new york','san francisko','los angelos']

}
df=pd.DataFrame(data)
print(df)