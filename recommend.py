import json
import os
from random import sample

import numpy as np
import pandas as pd
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

GENOMELINK_CLIENT = 'sH68GrpKVJonU1CDAoFY4d5FNhFgiJCogbGd5U0v'
GENOMELINK_SECRET = 'smvQFbyKIH02Z8M5Ua2Cr3tU3eS6ey4YdBZeWKYaloDteFT4UULWAHiXByzK1zxmL2eJtNGADhS6hG9vpkB8awvx7UUPDA1GP5A2eAiDnxVTeSHS5BWR2XSpHZ7mMooH'

SPOTIFY_CLIENT = '3781f6ee982548e594cb8dae9aa0a332'
SPOTIFY_SECRET = '7bff820e9a1742b79d03fa0bfb2b313a'

os.environ['GENOMELINK_CLIENT_ID'] = GENOMELINK_CLIENT
os.environ['GENOMELINK_CLIENT_SECRET'] = GENOMELINK_SECRET
os.environ['GENOMELINK_CALLBACK_URL'] = os.environ.get('GENOMELINK_CALLBACK_URL') or 'http://127.0.0.1:5000/callback'
os.environ['DEBUG'] = '1'
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

genomelink_attributes = ['agreeableness', 'alcohol-drinking-behavior', 'anger', 'beard-thickness', 'bitter-taste',
                         'black-hair', 'blood-glucose', 'caffeine-consumption', 'calcium', 'carbohydrate-intake',
                         'childhood-intelligence', 'conscientiousness', 'depression', 'egg-allergy',
                         'endurance-performance', 'excessive-daytime-sleepiness', 'extraversion', 'freckles',
                         'gambling', 'eye-color', 'harm-avoidance', 'hearing-function', 'height', 'intelligence',
                         'iron', 'job-related-exhaustion', 'lobe-size', 'longevity', 'mathematical-ability',
                         'milk-allergy', 'morning-person', 'motion-sickness', 'neuroticism', 'novelty-seeking',
                         'openness', 'reading-and-spelling-ability', 'red-hair', 'red-wine-liking', 'reward-dependence',
                         'smoking-behavior', 'white-wine-liking']

pref = pd.read_csv('pref.csv')
pref = pref.sort_values('gene')
del pref['gene']
spotify_attributes = list(pref.columns)

with open('fav.json', 'r') as f:
    fav = json.load(f)


def gen_user():
    return np.random.randint(0, 5, size=len(genomelink_attributes))


def get_user_preference(user_gene_attributes):
    user_gene_attributes = user_gene_attributes - 2
    res = np.matmul(user_gene_attributes, pref.values)
    res = (res - res.min()) / (res.max() - res.min())
    return dict(zip(spotify_attributes, res))


def get_user_favorites(user_gene_attributes):
    genre_weights = {}
    user_gene_attributes = dict(zip(genomelink_attributes, user_gene_attributes))
    for attr in user_gene_attributes.keys():
        attr_weight = user_gene_attributes[attr]
        for genre in fav[attr]:
            if genre not in genre_weights:
                genre_weights[genre] = 0
            genre_weights[genre] += attr_weight
    return map(lambda p: p[0], sorted(genre_weights.items(), key=lambda p: p[1], reverse=True)[:5])


def recommend(user):
    genres = get_user_favorites(user)
    targets = {'target_' + k: v for k, v in get_user_preference(user).items()}
    while True:
        try:
            return spotify.recommendations(seed_genres=genres, **{k: v for k, v in sample(targets.items(), 3)})
        except:
            pass


client_credentials_manager = SpotifyClientCredentials(client_id=SPOTIFY_CLIENT, client_secret=SPOTIFY_SECRET)
spotify = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

if __name__ == '__main__':
    user_gene_attributes = gen_user()

    recommendations = recommend(user_gene_attributes)['tracks']
    print('\n'.join([track['id'] for track in recommendations]))
    print(recommendations[0]['preview_url'])
