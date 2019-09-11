from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import argparse
from bs4 import BeautifulSoup

#globals
sigma = "https://sigma-web.uc3m.es/InicioAlumno.html"
sigma_login = "https://login.uc3m.es/index.php/CAS/login?service=https%3A%2F%2Fsigma.uc3m.es%2Fcosmos%2FentradaCAS%2F%3F%2540ebf2f349580da806%3D%25401bedd0984ff1624c%26%254057b88e10f1a90c1a%3D%2540f85cb32c02ba5707%26%2540d2e9d205e120747b%3D%2540a8d11ec374aa53249517ff409557c90948db35c1513aea9a%26%2540878832b545a60c10f8783e04f430b6cbcf0ca59017bf872c%3D%25404c3980ce660dc557%26iframe%3Dtrue%26css%3DcasSigma%26lang%3Des"
username = "100422000"
password = "TaLk@2mEaga1nplz"

def go_to_course_search(browser, campus):

	global username
	global password
	#login to sigma platform
	passw = browser.find_element_by_id("edit-pass")
	user = browser.find_element_by_id("edit-name")

	user.send_keys(username)
	passw.send_keys(password)

	user.submit()

	#navigate to course selection
	next_page = browser.find_element_by_link_text("Gestión de prematrícula")
	next_page.click()

	ingles = browser.find_element_by_css_selector("""#aplZonaEdicion > fieldset > table > tbody > tr:nth-child(2) > td > span > a""")
	ingles.click()
     
    #select a campus
	getafe = "914-Non European Universities - Humanities 1st semester 19-20(Search)"
	leganes = "#_codProceso > option:nth-child(3)"

	select = browser.find_element_by_css_selector("#_codProceso")
	accept_button = "#aplZonaEdicion > fieldset > div > a > span"
	accept = browser.find_element_by_css_selector(accept_button)

	select.send_keys(getafe)
	accept.click()

def search_for_course(browser, course_num):
	#course search (do this by number)
	search = browser.find_element_by_css_selector("#_asignatura")
	search.send_keys(course_num)

	search_button = "#aplZonaEdicion > form > fieldset:nth-child(2) > div > a:nth-child(1) > span"
	search.send_keys(Keys.RETURN)
	#button = browser.find_element_by_css_selector(search_button)
	#button.click()

	expand_class = "#taulaAsigsOferta > tbody > tr:nth-child(1) > td.tituloPadreClosed"
	expand = browser.find_element_by_class("tituloPadreClosed")
	#expand.click()
	return expand.text 
	#use class btnEng to find all courses in English

def get_all_campus_courses(browser):
	expand_button = "#expTodo"
	expand = browser.find_element_by_css_selector(expand_button)
	expand.click()
	print(browser.page_source)
	with open("text_page.html", 'w') as f:
		f.write(browser.page_source)

if __name__ == "__main__":
	parser = argparse.ArgumentParser(description='Get course schedule information')
	parser.add_argument('course_num', type=str, help='UC3M Course Number')
	args = parser.parse_args()

	browser = webdriver.Chrome()
	browser.get(sigma_login)

	try:
		go_to_course_search(browser, "getafe")
		get_all_campus_courses(browser)
		#result = search_for_course(browser, args.course_num)
		print(result)
	except:
		pass

	input("Close Browser?")
	browser.quit()
