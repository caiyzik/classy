# parse.py - takes the html source of a class listing and imports the appropriate classes to a database

import bs4

with open("text_page.html", 'r') as f:
	soup = bs4.BeautifulSoup(f)
	elems = soup.select('.grupos')
	print(str(elems[0]))