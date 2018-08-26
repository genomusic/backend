import json
import os
from multiprocessing import Pool
from uuid import uuid4

import genomelink
import numpy as np
from flask import Flask, render_template, request, redirect, session, jsonify
from flask_cors import CORS


import recommend

app = Flask(__name__)

attribute_dict = {}

CORS(app)

base_path = os.environ.get('BASE_PATH') or 'http://localhost:5000/'


@app.route('/connect')
def connect():
    authorize_url = genomelink.OAuth.authorize_url(scope=['''report:agreeableness
        report:alcohol-drinking-behavior
        report:anger
        report:beard-thickness
        report:bitter-taste
        report:black-hair
        report:blood-glucose
        report:caffeine-consumption
        report:calcium
        report:carbohydrate-intake
        report:childhood-intelligence
        report:conscientiousness
        report:depression
        report:egg-allergy
        report:endurance-performance
        report:excessive-daytime-sleepiness
        report:extraversion
        report:freckles
        report:gambling
        report:eye-color
        report:harm-avoidance
        report:hearing-function
        report:height
        report:intelligence
        report:iron
        report:job-related-exhaustion
        report:lobe-size
        report:longevity
        report:mathematical-ability
        report:milk-allergy
        report:morning-person
        report:motion-sickness
        report:neuroticism
        report:novelty-seeking
        report:openness
        report:reading-and-spelling-ability
        report:red-hair
        report:red-wine-liking
        report:reward-dependence
        report:smoking-behavior
        report:white-wine-liking'''.replace(' ', '').replace('\n', ' ')])

    return render_template('connect.html', auth_url=authorize_url)


@app.route('/get_url')
def get_url():
    authorize_url = genomelink.OAuth.authorize_url(scope=['''report:agreeableness
        report:alcohol-drinking-behavior
        report:anger
        report:beard-thickness
        report:bitter-taste
        report:black-hair
        report:blood-glucose
        report:caffeine-consumption
        report:calcium
        report:carbohydrate-intake
        report:childhood-intelligence
        report:conscientiousness
        report:depression
        report:egg-allergy
        report:endurance-performance
        report:excessive-daytime-sleepiness
        report:extraversion
        report:freckles
        report:gambling
        report:eye-color
        report:harm-avoidance
        report:hearing-function
        report:height
        report:intelligence
        report:iron
        report:job-related-exhaustion
        report:lobe-size
        report:longevity
        report:mathematical-ability
        report:milk-allergy
        report:morning-person
        report:motion-sickness
        report:neuroticism
        report:novelty-seeking
        report:openness
        report:reading-and-spelling-ability
        report:red-hair
        report:red-wine-liking
        report:reward-dependence
        report:smoking-behavior
        report:white-wine-liking'''.replace(' ', '').replace('\n', ' ')])

    # return jsonify(url=authorize_url)
    return redirect(authorize_url)


def get_attribute(p):
    attribute_name, token = p
    return genomelink.Report.fetch(name=attribute_name, population='european', token=token)


@app.route('/')
def index():
    token = session.get('oauth_token')

    if not token:
        return render_template('index.html')

    attributes = np.array(
        [x.summary['score'] for x in p.map(get_attribute, map(lambda a: (a, token), recommend.genomelink_attributes))])
    pref = recommend.get_user_preference(attributes)
    fav = recommend.get_user_favorites(attributes)
    tracks = map(get_track_text, recommend.recommend(attributes)['tracks'])

    print(f'rendering index.html, favs = {fav}, pref = {pref}')
    return render_template('index.html', data=json.dumps({
        'preferences': {k.capitalize(): v for k, v in pref.items()},
        'favorites': list(fav)
    }), tracks=tracks)


@app.route('/playlist/<string:token_uuid>')
def get_playlist(token_uuid):
    print('TOKENNNN')
    print(attribute_dict)
    attributes = attribute_dict[token_uuid]
    tracks = recommend.recommend(attributes)['tracks']
    print(tracks)
    return json.dumps(tracks)


@app.route('/preferences/<string:token_uuid>')
def get_preferences(token_uuid):
    print(attribute_dict[token_uuid])
    attributes = attribute_dict[token_uuid]

    preferences = recommend.get_user_preference(attributes)
    return json.dumps({
        k.capitalize(): v for k, v in preferences.items()
    })


def get_track_text(track):
    return '%s - %s - %s' % (', '.join(map(lambda a: a['name'], track['artists'])),
                             track['album']['name'],
                             track['name'])


@app.route('/callback')
def callback():
    try:
        token = genomelink.OAuth.token(request_url=request.url)
        print(f'Recieved token {token}')
    except genomelink.errors.GenomeLinkError as e:
        print(e.error)
        print(e.description)

    session['oauth_token'] = token

    attributes = np.array(
        [x.summary['score'] for x in p.map(get_attribute, map(lambda a: (a, token), recommend.genomelink_attributes))])

    token_uuid = uuid4()
    attribute_dict[str(token_uuid)] = attributes
    print(f'redirecting to base path {base_path}')
    return redirect(f'{base_path}?genomelink_token=%s' % str(token_uuid))


p = Pool(30)

app.secret_key = os.urandom(24)

on_heroku = os.environ.get("ON_HEROKU", False)
port = int(os.environ.get("PORT", 5000))
app.run(host='0.0.0.0' if on_heroku else 'localhost', port=port)
