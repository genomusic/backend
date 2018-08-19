import requests
import pandas as pd
from io import BytesIO

URL = 'https://spotifycharts.com/regional/global/daily/%s-%s-%s/download'

def extract_track_id(url):
	return url.split('/')[-1]
	
def load_top_tables():
	res = pd.DataFrame()
	
	for year in [2017, 2018]:
		for month in range(1, 8):
			for day in range(1, 29):
				res = res.append(load_table(URL % (year, str(day).rjust(2, '0'), str(month).rjust(2, '0'))))
				print('loaded %s/%s/%s' % (day, month, year))
	
	return res
	
def load_table(url):
	try:
		res = '\n'.join(requests.get(url).content.split('\n')[1:])	
		stream = BytesIO(res)
		stream.seek(0)
		return pd.read_csv(stream)
	except:
		return pd.DataFrame()


df = load_top_tables()
tracks = list(set(df['URL'].apply(extract_track_id)))
print('%d tracks' % len(tracks))

with open('tracks.txt', 'w') as f:
	f.write('\n'.join(tracks))
