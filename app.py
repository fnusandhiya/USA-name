import pandas as pd

from flask import (
    Flask,
    render_template,
    request,
    jsonify)

from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)


@app.route("/")
def data():
    """Return data."""
    json_ = request.json
    new = pd.read_csv('data.csv')
    json_vector = new.transform(json_)
    query = pd.DataFrame(json_vector)
    return jsonify(query)

@app.route("/home")
def home():
    """Render Home Page."""
    return render_template("index.html")



if __name__ == '__main__':
    app.run(debug=True)