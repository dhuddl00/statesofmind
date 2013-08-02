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
    upcs = []

    with open('upcs.txt') as data_file:
        data = json.load(data_file)

    for i in [0,1,2,3,4,5,6]:
        row = {}
        almostJSON = data["feed"]["entry"][i]["content"]["$t"]
        keyvals = almostJSON.split(",")
        for keyval in keyvals:
            key = keyval.split(":")[0].strip()
            value = keyval.split(":")[1].strip()
            row[key] = value
        upcs.append(row)

    self.response.headers['Content-Type'] = "application/json"    
    self.response.out.write(json.dumps(upcs))

app = webapp2.WSGIApplication([
  ('/', MainHandler),
  (r'/printTags', PrintTagHandler),
  (r'/upcList', UpcListHandler),
  (r'/dillardsTagXML', DillardsTagXMLHandler),
  (r'/boutiqueTagXML', BoutiqueTagXMLHandler)
], debug=True)

