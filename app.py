import pandas as pd

from flask import (
    Flask,
    render_template,
    request,
    jsonify)

from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///names_data.sqlite"

db = SQLAlchemy(app)
# Create our database model
class SQL(db.Model):
    __tablename__ = 'names'

    index = db.Column(db.Integer, primary_key=True)
    Abbr = db.Column(db.String)
    Gender = db.Column(db.String)
    Year = db.Column(db.Integer)
    Name = db.Column(db.String)
    Occurrence = db.Column(db.Integer)
    State = db.Column(db.String)
    Lat = db.Column(db.Float)
    Lon = db.Column(db.Float)

    def __repr__(self):
        return '<SQL %r>' % (self.Name)


@app.route("/data")
def data():
    """Return data."""
    #json_ = request.json
    new = pd.read_csv('final.csv')
    #json_vector = new.transform(json_)
    #query = pd.DataFrame(json_vector)
    return jsonify(new.to_json(orient='records'))

@app.route("/")
def home():
    """Render Home Page."""
    return render_template("index.html")

@app.route("/sqlite")
def sql():
    """Render Home Page."""
    query_statement = db.session.query(SQL.Name, SQL.Gender, SQL.Occurrence).statement
    results = pd.read_sql_query(query_statement, db.session.bind)
    json_results = results.to_json(orient='records')
    return jsonify(json_results)

@app.route("/search")
def Search():
    name = request.args.get('name')
    query_statement = db.session.query(SQL.Name, SQL.Gender, SQL.Occurrence).filter(SQL.Name == name).statement
    results = pd.read_sql_query(query_statement, db.session.bind)
    json_results = results.to_json(orient='records')
    return jsonify(json_results)





if __name__ == '__main__':
    app.run(debug=True)