from flask import Flask, render_template, request, redirect, session, url_for
import json
import recommend
import genomelink
import os
import numpy as np
import multiprocessing.dummy

p = multiprocessing.dummy.Pool(30)

app = Flask(__name__)

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

@app.route('/')
def index():
    token = session.get('oauth_token')
    if not token:
        return redirect('/connect')

    def get_attribute(attribute_name):
        return genomelink.Report.fetch(name=attribute_name, population='european', token=token)

    try:
        attributes = np.array([x.summary['score'] for x in p.map(get_attribute, recommend.genomelink_attributes)])
    except:
        attributes = np.array([x.summary['score'] for x in p.map(get_attribute, recommend.genomelink_attributes)])
    pref = recommend.get_user_preference(attributes)
    fav = recommend.get_user_favorites(attributes)
    tracks = map(get_track_text, recommend.recommend(attributes)['tracks'])

    return render_template('index.html', data=json.dumps({
        'preferences': {k.capitalize(): v for k, v in pref.items()},
        'favorites': fav
    }), tracks=tracks)

def get_track_text(track):
    return '%s - %s - %s' % (', '.join(map(lambda a: a['name'], track['artists'])),
                             track['album']['name'],
                             track['name'])

@app.route('/callback')
def callback():
    try:
        token = genomelink.OAuth.token(request_url=request.url)
    except genomelink.errors.GenomeLinkError as e:
        print(e.error)
        print(e.description)

    session['oauth_token'] = token
    return redirect(url_for('index'))


app.secret_key = os.urandom(24)

app.run(host='localhost', port=5000)
