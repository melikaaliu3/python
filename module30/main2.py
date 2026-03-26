from bs4 import BeautifulSoup
from streamlit import text_input

html_content = """
<!DOCTYPE HTML>
<html lang="en">
<head>
        
        <title>Document</title>
</head>
<body>
    <h1>Welcome to Beautiful Soup</h1>
    <p class="intro"Web Scraping</p>
    
    <div id="content">
        <a href="http://example.com/page1">Link 1</a>
        <a href="http://example.com/page2">Link 2</a> 
        <a href="http://example.com/page3">Link 3</a> 
        <a href="http://example.com/page4">Link 4</a>
    </div>
    
</body>
</html>                      
"""

soup = BeautifulSoup(html_content, 'html.parser')
print("Title per page: ", soup.little.text)

intro_text = soup.find('p' , class_'intro').text

print("Intro text: " , intro_text)

div_content = soup.find('div', id='content')
links = div_content.find_all('a')
for link in links:
    print("Link:", link['href'])

first_link = soup.find('a')
print("First linkl text: ", first_link.text)
print("Next after the first link " , first_link.next_sibling)

paragraps = soup.select('div#content p ')
for paragraph in paragraphs:
    print("Paragraphs inside content" , paragraph.text)

new_tag = soup.new_tag('b')
new_tag.string = "important"
soup.h1.append(new_tag)

print("Modified h1 tag ", soup.h1)