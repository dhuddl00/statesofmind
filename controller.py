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
    #dxmlpath = os.path.join(os.path.dirname(__file__), 'dillardsTag.xml')
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

app = webapp2.WSGIApplication([
  ('/', MainHandler),
  (r'/printTags', PrintTagHandler),
  (r'/dillardsTagXML', DillardsTagXMLHandler),
  (r'/boutiqueTagXML', BoutiqueTagXMLHandler)
], debug=True)
