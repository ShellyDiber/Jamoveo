#!/usr/bin/env python3


import argparse
import psycopg2

parser = argparse.ArgumentParser()

parser.add_argument('--name')
parser.add_argument('--artist')
parser.add_argument('--json')
parser.add_argument('--image_url')
parser.add_argument('--rtl', action='store_true', help='Enable right-to-left text support')

args = parser.parse_args()

file = open(args.json)
text = file.read()
file.close()

print(text)



print(f"Name: {args.name}")
print(f"Artist: {args.artist}")
print(f"JSON: {args.json}")
print(f"Image URL: {args.image_url}")
print(f"RTL: {args.rtl}")


# read the JSON string and convert it to a Python object

conn = psycopg2.connect("dbname=jamoveo user=jamoveo password=jamoveo host=localhost")
conn.cursor().execute("insert into song (title, artist, content, rtl) values (%s, %s, %s,%s )",
             (args.name, args.artist, text, args.rtl))
conn.commit()
conn.close()