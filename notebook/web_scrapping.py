import requests
from bs4 import BeautifulSoup

# Make a request to the webpage
url = 'https://www.4icu.org/us/'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}
response = requests.get(url, headers=headers)
content = response.text

# Parse the HTML content
soup = BeautifulSoup(content, 'html.parser')

# Get the table
table = soup.find('table', {'class': 'table table-hover'})

# Creating arrays to store universities and cities
universities = []
cities = []

if table:
    rows = table.find_all('tr')[1:]  # Skip header row
    for row in rows:
        cells = row.find_all('td')
        if cells:
            # Based on the structure we printed above, adjust these indices as needed
            # For example, the university name might be in a link within a cell
            university_cell = cells[1] if len(cells) > 1 else None
            city_cell = cells[2] if len(cells) > 2 else None
            
            if university_cell:
                # Try to get the university name from a link if present
                uni_link = university_cell.find('a')
                university = uni_link.text.strip() if uni_link else university_cell.text.strip()
                universities.append(university)
            
            if city_cell:
                cities.append(city_cell.text.strip('...').strip())
            