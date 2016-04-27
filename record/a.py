import urllib
from bs4 import BeautifulSoup
import re

# -*- coding: utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

url =  'http://www.cyberoro.com/bcast/gibo.oro?param=2&div=2&Tdiv=B&Sdiv=4&pageNo=3&blockNo=1'
data = urllib.urlopen(url);

soup = BeautifulSoup(data);

save = 0;
agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36";

fs = open("log.txt", "a");
A = soup.findAll('a');
for tagA in A:
	S = tagA['href'] + '\n';
	if "gibo" in S:
		li = S.split('\'');
		for elem in li:
			if "http" in elem:
				save += 1;
				if save % 2 == 0:
					break;
				url = urllib.unquote(elem).decode('utf8');
				print url;
				data = urllib.urlopen(url);
				data = data.read();
				data = str(unicode(data, 'cp949'));
				
				date = data.split('RD[')[1].split(']')[0];
				Title = data.split('TE[')[1].split(']')[0];
				W = data.split('PW[')[1].split(']')[0];
				B = data.split('PB[')[1].split(']')[0];	
				log = date + ' 00:00:00\t' + agent + '\t' + Title + '\t' + W +'\t' + B + '\t'
				record = ""
				cnt = 0;
				for stone in data.split(';'):
					if re.match('^B\[|^W\[', stone):
						cnt += 1
						x = ord(stone[2]) - 97;
						y = ord(stone[3]) - 97;
						record += 'n' + str(cnt) + 'x' + str(x) + 'y' + str(y) + stone.lower()[0];
				
				fs.write(log + '\t' + record + '\n');
				print log + '\t' + record

			#str = str.split('\'')[1];
fs.close()
		#str, = .split('\'');
