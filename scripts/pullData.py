import sys
import urllib, urllib2, httplib
import random

class SSLHTTPSHandler(urllib2.HTTPSHandler):
  
  def __init__(self, key_file=None, cert_file=None):
    urllib2.HTTPSHandler.__init__(self)
    self.keyfile = key_file
    self.certfile = cert_file
 
  def https_open(self, req):
    return self.do_open(self.get_connection, req)
 
  def get_connection(self, host, timeout=300):
    return httplib.HTTPSConnection(host, key_file=self.keyfile, cert_file=self.certfile)


url = "https://http-api.openbloomberg.com/request/blp/refdata/HistoricalData"
certfile = 'key/tartanhacks_spring_2015_031.crt'
keyfile ='key/tartanhacks_spring_2015_031.key'

def read(args):
  year = 2011 + random.randint(0, 3)
  startDate = str(year) + '0101'
  endDate = str(year) + '1231'
  formFields = """{ "securities": [""" + "\"" + args[1] + "\"" + """],
               "fields": ["PX_LAST", "OPEN"],
               "startDate": """ + "\"" + startDate + "\"," + """
               "endDate": """ + "\"" + endDate + "\"," + """
               "periodicitySelection": "DAILY" }"""

  opener = urllib2.build_opener(SSLHTTPSHandler(key_file=keyfile, cert_file=certfile))
  response = opener.open(url, formFields)
  sys.stdout.write(response.read())

read(sys.argv)
