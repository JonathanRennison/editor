"""Copyright 2018 Centrum Wiskunde & Informatica

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""
from __future__ import absolute_import
from __future__ import unicode_literals
from flask import render_template, abort, jsonify
from hashlib import sha256
import os

from app import app
from .util import hash_file, get_head_revision
from .api import routes # Note that this import has side effects (it adds routes)

class ReverseProxied(object):
    '''Wrap the application in this middleware and configure the
    front-end server to add these headers, to let you quietly bind
    this to a URL other than / and to an HTTP scheme that is
    different than what is used locally.

    In nginx:
    location /myprefix {
        proxy_pass http://192.168.0.1:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Scheme $scheme;
        proxy_set_header X-Script-Name /myprefix;
        }

    :param app: the WSGI application
    '''
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        script_name = environ.get('HTTP_X_SCRIPT_NAME', '')
        if script_name:
            environ['SCRIPT_NAME'] = script_name
            path_info = environ['PATH_INFO']
            if path_info.startswith(script_name):
                environ['PATH_INFO'] = path_info[len(script_name):]

        scheme = environ.get('HTTP_X_SCHEME', '')
        if scheme:
            environ['wsgi.url_scheme'] = scheme
        return self.app(environ, start_response)

app.wsgi_app = ReverseProxied(app.wsgi_app)

appdir = os.path.dirname(os.path.realpath(__file__))
EDITOR_HASH = hash_file(os.path.join(appdir, "static", "dist", "editor.js"))
TRIGGER_HASH = hash_file(os.path.join(appdir, "static", "dist", "trigger.js"))
LANDINGPAGE_HASH = hash_file(os.path.join(appdir, "static", "dist", "landing_page.js"))


@app.route("/")
def landing_page():
    return render_template(
        "main.html",
        filename="landing_page.js", key=LANDINGPAGE_HASH
    )


@app.route("/editor")
def editor():
    return render_template(
        "main.html",
        filename="editor.js", key=EDITOR_HASH
    )


@app.route("/trigger")
def trigger():
    return render_template(
        "main.html",
        filename="trigger.js", key=TRIGGER_HASH
    )


@app.route("/version")
def version():
    try:
        return jsonify(get_head_revision())
    except:
        return "Could not determine HEAD revision"


@app.route("/healthcheck")
def healthcheck():
    return ("", 200)
