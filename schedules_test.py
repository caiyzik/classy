# schedule tests
import unittest
import schedules

class TestSchedules(unittest.TestCase):
	def test_basic(self):
		'''
		Test that the module can create multiple schedules
		'''

		schedule = Schedule()
		cmparch = Course("Computer Archectiture", 13888)
		cmparch.add_meeting_time(day="M", begin="11:00", end="12:30")

		tv = Course("Reading Image in Film", 13476)
		tv.add_meeting_time(day="M", begin="11:00", end="12:30")

		art = Course("Art History", 13283)
		art.add_meeting_time(day="M", begin="14:00", end="15:00")

		course_4 = Course("Conflict", 55555)
		course_4.add_meeting_time(day="M", begin="14:45", end="15:45")

		self.assertEqual(correct, schedule.get_possible_schedules())

	
