
import pandas as pd
from flask import Flask, jsonify, request 
from flask_cors import CORS
import os
import numpy as np
from visualize import visualize_bus_loading
from passcount import process_data
from od_matrix import generate_od_matrix
from buscount import bus_count
from revenue import revenue_analysis
from visualize_ticket import visualize_bus_ticket

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
CORS(app)

@app.route('/visualize_loading',methods=['POST'])
def visualize_loading():
    res=visualize_bus_loading()
    return res


@app.route('/visualize_ticket',methods=['POST'])
def visualize_ticket():
    res=visualize_bus_ticket()
    return res

@app.route('/get_schedule_names', methods=['POST'])
def get_schedule_names():
    filename = request.json['filename']

    df=pd.read_csv(filename)
    unique_sources = np.sort(df['Schedule Name'].unique())
    
    return jsonify({'scheduleNames': unique_sources.tolist()})

@app.route('/get_bus_numbers', methods=['POST'])
def get_bus_numbers():
    filename = "04-02-19.csv"
    df=pd.read_csv(filename)
    temp_df = df['Schedule Name'].str.split('-').str[0]
    unique_sources = temp_df.unique()
    return jsonify({'busNumbers': unique_sources.tolist()})


@app.route('/get_source', methods=['POST'])
def get_source():
    filename = request.json['filename']

    # Check if either busNumber or schedule is provided
    if 'busNumber' in request.json:
        bus_number = request.json['busNumber']
        df = pd.read_csv(filename)
        df = df[df['Schedule Name'].str.contains(rf'\b{bus_number}\b')]
    elif 'schedule' in request.json:
        schedule = request.json['schedule']
        df = pd.read_csv(filename)
        df = df[df['Schedule Name'] == schedule]
    else:
        return jsonify({'error': 'Neither busNumber nor schedule provided'})

    unique_sources = df['Source'].unique()
    return jsonify({'sources': unique_sources.tolist()})


@app.route('/get_destination', methods=['POST'])
def get_destination():
    filename = request.json['filename']
    df = pd.read_csv(filename)
    
    # Check if either busNumber or schedule is provided
    if 'busNumber' in request.json:
        bus_number = request.json['busNumber']
        df = df[df['Schedule Name'].str.contains(rf'\b{bus_number}\b')]
    elif 'schedule' in request.json:
        schedule = request.json['schedule']
        df = df[df['Schedule Name'] == schedule]
    else:
        return jsonify({'error': 'Neither busNumber nor schedule provided'})

    if 'source' in request.json:
        source = request.json['source']
        df = df[df['Source'] == source]
    else:
        return jsonify({'error': 'Source not provided'})

    unique_destinations = df['Destination'].unique()
    return jsonify({'destinations': unique_destinations.tolist()})


@app.route('/generate_od_matrix', methods=['POST'])
def od_matrix():
    res=generate_od_matrix()
    return res

@app.route('/process_bus', methods=['POST'])
def processbus():
    res=bus_count()
    return res

@app.route('/process_revenue', methods=['POST'])
def process_revenue():
    res=revenue_analysis()
    return res


@app.route('/process_data', methods=['POST'])
def process():
    res=process_data()
    return res

if __name__ == '__main__':
    app.run(debug=True)
