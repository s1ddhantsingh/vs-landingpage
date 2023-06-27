import os
import requests
from bs4 import BeautifulSoup

url='https://propaccess.trueautomation.com/clientdb/PropertySearch.aspx?cid=19'
url_='https://propaccess.trueautomation.com/clientdb/SearchResults.aspx?cid=19'

def main():
    str_name=input('enter last name OR last name, first name to the terminal:\n')
    
    cnode='12300 Frisco St., Frisco Texas, 75033' # --> maybe turn addresses into geodatalocations
     
    '''
    todo: 
    1. enter name of the person 
    2. central_address is the address of the starting node, ie. memorial high school
    3. create a geodataframe that stores all of the relative data sources --> plot the dataframe online with jupyter notebook
        a. cnode = central node
    4. plot all the addresses with the people around the central node (central_address) 
    '''
    
    __r__ = requests.get(url_)
    soup = BeautifulSoup(__r__.content)

    print(soup)


main()

    
















