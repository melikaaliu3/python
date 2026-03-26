import requests

url = "https/www.ebay.com/"

response = requests.get(url)


if response.status_code == 200:
    print(response.text)
else:
    print(f"failed to retrive content from {url}")