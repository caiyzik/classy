#get all overlaps in courses
import intervaltree

#Test set:
#1: M,9-11 W,9-11
#2: T,10-12 F,10-12
#3: T,11-14
#4: M,13-14 W,13-14 F,13-14
#5: M,13-16 W,13-16
#6: M,15-17
#7: Th,15-18
#8: M,15-17, Th, 15-17



mon = intervaltree.IntervalTree()
tues = intervaltree.IntervalTree()
wed = intervaltree.IntervalTree()
thurs = intervaltree.IntervalTree()
fri = intervaltree.IntervalTree()

#1: M,9-11 W,9-11
mon[9:11] = 1
wed[9:11] = 1

#2: T,10-12 F,10-12
tues[10:12] = 2
fri[10:12] = 2

#3: T,11-14
tues[11:14] = 3

#4: M,13-14 W,13-14 F,13-14
mon[13:14] = 4
wed[13:14] = 4
fri[13:14] = 4

#5: M,13-16 W,13-16
mon[13:16] = 5
wed[13:16] = 5

#6: M,15-17
mon[15:17] = 6

#7: Th,15-18
thurs[15:18] = 7

#8: M,15-17, Th, 15-17
mon[15:17] = 8
thurs[15:17] = 8

print(mon[:])