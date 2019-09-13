#get all overlaps in courses
from intervaltree import Interval, IntervalTree
from enum import Enum
from itertools import product

#Test set:
#1: M,9-11 W,9-11
#2: T,10-12 F,10-12
#3: T,11-14
#4: M,13-14 W,13-14 F,13-14
#5: M,13-16 W,13-16
#6: M,15-17
#7: Th,15-18
#8: M,15-17, Th, 15-17

class Day(Enum):
	M = 24
	T = 48
	W = 72
	Th = 96
	F = 120

class Course():
	'''represents a course being offered at the school'''
	def __init__(self, name, number):
		self.name = name
		self.number = number
		self.times = {}
	def add_meeting_time(self, day, begin, end):
		self.times[day] = []
		self.times[day].append([begin, end])
	def __str__(self):
		header = "{0} ({1}) ".format(self.name, self.number)
		final = [header]
		for key, value in self.times.items():
			for time in value:
				final.append("{0} :: {1}-{2}, ".format(key, time[0], time[1]))
		return "".join(final).rstrip(' ,')
	def __repr__(self):
		return self.__str__()
	

class Schedule(): #subclass of interval tree instead?
	'''represents things that can be added to a students schedule'''
	def __init__(self):
		self.week = IntervalTree()
		self.overlaps = []

	@staticmethod
	def get_abs_time(day, begin, end):
		#TODO: account for non-military time
		start = begin.split(":")
		stop = end.split(":")
		time_b = float(start[0]) + float(start[1])/60.0
		time_e = float(stop[0]) + float(stop[1])/60.0
		time_b += Day[day].value
		time_e += Day[day].value
		return {"begin":time_b, "end":time_e}

	def add_course(self, course):
		for day, meeting_times in course.times.items():
			for time in meeting_times: #time is a list
				abs_time = Schedule.get_abs_time(day, time[0], time[1])
				if self.week.overlaps(abs_time["begin"], abs_time["end"]):
					new_overlap = [value.data for value in self.week[abs_time["begin"]:abs_time["end"]]]
					new_overlap.append(course)
					self.overlaps.append(new_overlap)
				self.week[abs_time["begin"]:abs_time["end"]] = course

	def add_courses(self, *args):
		for arg in args:
			self.add_course(arg)
	def get_possible_schedules(self):

		#got this from a stack overflow solution. Need to adapt and figure out why it works
		rest = tuple(el for el in self.week[:] if not any(el.data in ol for ol in self.overlaps))
		[unique + rest for unique in product(*self.overlaps) if all(u in self.week[:] for u in unique)]
		return rest

	def get_overlaps(self):
		#print overlaps better? Might have to work with having course inhe
		pass
	

def main():
	schedule = Schedule()
	cmparch = Course("Computer Archectiture", 13888)
	cmparch.add_meeting_time(day="M", begin="11:00", end="12:30")

	tv = Course("Reading Image in Film", 13476)
	tv.add_meeting_time(day="M", begin="11:00", end="12:30")


	art = Course("Art History", 13283)
	art.add_meeting_time(day="M", begin="14:00", end="15:00")

	schedule.add_courses(cmparch, tv, art)
	print(schedule.get_possible_schedules())



if __name__ == '__main__':
	main()




