# schedule.py - uses interval trees to output course schedules
from intervaltree import Interval, intervaltree
from itertools import combinations
#tree = IntervalTree()

overlaps = {(1,2), (3,4)}

A = []
B = []
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
	comb = combinations(range(1,7), 4)
	result = schedules(overlaps, list(comb))
	print(result)