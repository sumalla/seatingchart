import csv
import json

SEAT_NUMBER_COL = "seatNumber"
X_AXIS_COL = "x_axis"
Y_AXIS_COL = "y_axis"
WIDTH_COL = "width"
HEIGHT_COL = "height"

integer_columns = [SEAT_NUMBER_COL, X_AXIS_COL, Y_AXIS_COL, WIDTH_COL,
				   HEIGHT_COL]

with open('seats.csv', 'rb') as csvfile:
	seatsreader = csv.reader(csvfile)
	headings = next(seatsreader)
	integer_columns_indices = map(lambda x: headings.index(x), integer_columns)

	seats = []
	for row in seatsreader:
		curr_seat = {}
		for i, value in enumerate(row):
			if i in integer_columns_indices:
				curr_seat[headings[i]] = int(value)
			else:
				curr_seat[headings[i]] = value
		seats.append(curr_seat)

	file_writer =open("seats.json", "w");
	file_writer.write(json.dumps(seats))
	print json.dumps(seats, sort_keys=True,
                     indent=4, separators=(',', ': '))