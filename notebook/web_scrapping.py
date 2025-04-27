import requests
from bs4 import BeautifulSoup
import json
import os

def scrape_universities():
    # Make a request to the webpage
    url = 'https://www.4icu.org/us/'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        print("Fetching university data...")
        response = requests.get(url, headers=headers)
        
        # Check if the request was successful
        if response.status_code != 200:
            print(f"Failed to fetch data: HTTP {response.status_code}")
            return []
            
        content = response.text
        
        # Parse the HTML content
        soup = BeautifulSoup(content, 'html.parser')
        
        # Get the table - make sure we're targeting the right table
        table = soup.find('table', {'class': 'table table-hover'})
        
        university_data = []
        
        if table:
            rows = table.find_all('tr')[1:]  # Skip header row
            
            for index, row in enumerate(rows):
                cells = row.find_all('td')
                
                if len(cells) >= 2:  # Make sure we have enough cells
                    # Get university name
                    university_cell = cells[1]
                    
                    # Try to get the university name from a link if present
                    uni_link = university_cell.find('a')
                    university = uni_link.text.strip() if uni_link else university_cell.text.strip()
                    
                    # Get city if available (usually in the 3rd column)
                    city = cells[2].text.strip() if len(cells) > 2 else ""
                    
                    # Add university to the data
                    university_data.append({
                        "name": university,
                        "city": city,
                        "ranking": index + 1
                    })
            
            print(f"Successfully scraped {len(university_data)} universities")
            return university_data
        else:
            print("Table not found on the page")
            # Try to find any error message or alternative structure
            print(f"Page title: {soup.title.text if soup.title else 'No title'}")
            return []
        
    except Exception as e:
        print(f"Error scraping universities: {e}")
        return []

def generate_university_options_file():
    university_data = scrape_universities()
    
    if not university_data:
        print("No university data to process. Using fallback data.")
        # Provide fallback data in case scraping fails
        university_data = [
            {"name": "Harvard University", "city": "Cambridge, MA", "ranking": 1},
            {"name": "Stanford University", "city": "Stanford, CA", "ranking": 2},
            {"name": "Massachusetts Institute of Technology", "city": "Cambridge, MA", "ranking": 3},
            {"name": "University of California, Berkeley", "city": "Berkeley, CA", "ranking": 4},
            {"name": "Yale University", "city": "New Haven, CT", "ranking": 5},
            # Add more fallback universities if needed
        ]
    
    # Convert the data to the format needed for the React Select component
    university_options = []
    
    for uni in university_data:
        university_options.append({
            "value": uni['name'],
            "label": uni['name'],
            "data": {
                "name": uni['name'],
                "city": uni.get('city', ''),
                "ranking": uni.get('ranking', 0)
            }
        })
    
    # Create the JavaScript file with the data
    js_content = f"""// Generated university options for dropdown
export const universityOptions = {json.dumps(university_options, indent=2)};

// Create a map for easy lookup by name
export const universityMap = {{
  {', '.join([f'"{uni["value"]}": {json.dumps(uni["data"])}' for uni in university_options])}
}};
"""
    
    # Write to file
    output_dir = os.path.join('src', 'data')
    os.makedirs(output_dir, exist_ok=True)
    
    output_file = os.path.join(output_dir, 'universityOptions.js')
    with open(output_file, 'w') as file:
        file.write(js_content)
    
    print(f"Successfully created university options file with {len(university_options)} universities at {output_file}")

if __name__ == "__main__":
    generate_university_options_file()