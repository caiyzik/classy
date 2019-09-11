# schedule.py - uses interval trees to output course schedules
#test cases should include different lengths of input courses and overlap courses 
#edge cases REALLY big input (how long will this take) 1 input and multiple overlaps
#no overlaps one input, multiple input


from intervaltree import Interval, intervaltree
from itertools import combinations
#tree = IntervalTree()


class Course():

	def __init__(self, name, number, **kwargs):
		self.name = name
		self.number = number
		self.times = {}
		for k, v in kwargs:
			self.times[k] = Interval(v)
	def draw():
		pass


def schedules(overlaps, complete):
	final = complete.copy()
	for sch in complete:
		for over in overlaps:
			if (over[0] in sch) and (over[1] in sch):
				try:
				    final.remove(sch)
				except:
					continue
	return final

if __name__ == '__main__':
	overlaps = {(1,2), (3,4)}
	comb = combinations(range(1,8), 5)
	result = schedules(overlaps, list(comb))
	print(result)
	from itertools import product

	init_list =  [1, 2, 3, 4, 5, 6, 7]
	#overlaps = [{1,2}, {3,4}]

	# the 2 lines:
	rest = tuple(el for el in init_list if not any(el in ol for ol in overlaps))
	[unique + rest for unique in product(*overlaps) if all(u in init_list for u in unique)]
	print(rest)