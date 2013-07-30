import json
from pprint import pprint
with open('upcs.txt') as data_file:
    data = json.load(data_file)

for i in [0,1,2]:
    row = {}
    invalidJSON = data["feed"]["entry"][i]["content"]["$t"]
    keyvals = invalidJSON.split(",")
    for keyval in keyvals:
       key = keyval.split(":")[0].strip()
       value = keyval.split(":")[1].strip()
       row[key] = value
    pprint(row)


