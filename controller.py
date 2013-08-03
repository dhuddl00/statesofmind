import webapp2
import os
from google.appengine.ext.webapp import template


class MainHandler(webapp2.RequestHandler):
  def get(self):
    template_values = {
      'name': "World",
    }

    path = os.path.join(os.path.dirname(__file__), 'index.html')
    self.response.out.write(template.render(path, template_values))

class PrintTagHandler(webapp2.RequestHandler):
  def get(self):
    template_values = {
    }
    
    path = os.path.join(os.path.dirname(__file__), 'printTags.html')
    self.response.out.write(template.render(path, template_values))

class DillardsTagXMLHandler(webapp2.RequestHandler):
  def get(self):
    path = os.path.join(os.path.dirname(__file__), 'dillardsLabel.xml')
    self.response.headers['Content-Type'] = "application/xml"    
    self.response.out.write(file(path).read())

class BoutiqueTagXMLHandler(webapp2.RequestHandler):
  def get(self):
    path = os.path.join(os.path.dirname(__file__), 'boutiqueLabel.xml')
    self.response.headers['Content-Type'] = "application/xml"    
    self.response.out.write(file(path).read())

class UpcListHandler(webapp2.RequestHandler):
  def get(self):
    import json
    upcs = getUpcListFromGoogleSpreadsheet()

    #send the upc array as the http response
    self.response.headers['Content-Type'] = "application/json"    
    self.response.out.write(json.dumps(upcs))

class OrderListFromCsvHandler(webapp2.RequestHandler):
  def post(self):

    import json
    orderList = getOrderListFromCsv(self.request.body_file.read())

    self.response.headers['Content-Type'] = "application/json"    
    self.response.out.write(json.dumps(orderList))

app = webapp2.WSGIApplication([
  ('/', MainHandler),
  (r'/printTags', PrintTagHandler),
  (r'/upcList', UpcListHandler),
  (r'/orderListFromCsv', OrderListFromCsvHandler),
  (r'/dillardsTagXML', DillardsTagXMLHandler),
  (r'/boutiqueTagXML', BoutiqueTagXMLHandler)
], debug=True)

def toUpc(inUpc):
    #create new, empty dictionary
    upc = {}

    #pad dept and mic with leading zeros
    upc['dept'] = inUpc.get('dept',"0000").zfill(4)
    upc['mic'] = inUpc.get('mic',"030").zfill(3)   
    upc['style'] = inUpc.get('style',"n/a")
    upc['styledesc'] = inUpc.get('styledesc',"n/a")
    upc['color'] = inUpc.get('color',"n/a")
    upc['size'] = inUpc.get('size',"n/a")
    upc['upc'] = inUpc.get('upc',"n/a")
    upc['sku'] = inUpc.get('sku',"n/a")

    #ensure unit retail is formatted with a dollar sign and two decimals
    upc['unitretail'] = "$" + '{0:.2f}'.format(float(inUpc.get('unitretail',0).replace("$","")))

    #default on order to zero if it is not set
    upc['oounits'] = int(inUpc.get('oounits',0))

    return upc
    
def getOrderListFromCsv(csvData):
    lines = csvData.splitlines()
    headings = lines[0].split(",")
    upcIndex = headings.index("UPCCode")
    qtyIndex = headings.index("QuantityOrdered")
    ordLines = []
    for r in range(1, len(lines)):
        cols = lines[r].split(",")
        ordLine = {}
        ordLine['upc'] = int(cols[upcIndex].replace("'","").replace('"',"").strip())
        ordLine['qty'] = int(cols[qtyIndex].replace("'","").replace('"',"").strip())
        ordLines.append(ordLine)
    
    return ordLines 

def getUpcListFromGoogleSpreadsheet():
    import json
    import urllib2
    from pprint import pprint
    upcs = []

    #with open('upcs.txt') as data_file:
    gsheeturl = 'http://spreadsheets.google.com/feeds/list/0ApQT17osW5EmdDdaVjBQb2dOZlBWZ1VSSzhKaXZFUnc/od6/public/basic?alt=json'
    #with urllib.urlopen(gsheeturl) as data_file:
    #    data = json.load(data_file)
    data = json.load(urllib2.urlopen(gsheeturl, timeout = 60))

    for i in range(len(data["feed"]["entry"])):
        upc = {}
        almostJSON = data["feed"]["entry"][i]["content"]["$t"]
        keyvals = almostJSON.split(",")
        for keyval in keyvals:
            key = keyval.split(":")[0].strip().encode('ascii','ignore')
            value = keyval.split(":")[1].strip().encode('ascii','ignore')
            upc[key] = value
       
        #clean up and add to the array
        upcs.append(toUpc(upc))

    return upcs

