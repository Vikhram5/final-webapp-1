import pandas as pd
from flask import Flask, jsonify, request 
from flask_cors import CORS
import os


def process_data():
    data = request.form.to_dict()
    file = request.files['file']
    source_stage = data['source'].upper()
    destination_stage = data['destination'].upper()

    try:
        journey="up"
        file_path=os.path.join('week_data',journey, file.filename)

        if not os.path.isfile(file_path):
            print(f"Error: File '{file}' does not exist.")
        else:
            df=pd.read_csv(file_path)

    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404

    if 'busNumber' in data:
        bus_no = data['busNumber']
        df = df[df['Schedule Name'].str.contains(rf'\b{bus_no}\b')]
    elif 'schedule' in data:
        schedule = data['schedule']
        df = df[df['Schedule Name']==schedule]
    else:
        return "error"

    
    df = df[(df['Source'] == source_stage) & (df['Destination'] == destination_stage)]

    # Convert time columns to datetime
    df['Trip Start Time'] = pd.to_datetime(df['Trip Start Time'], format='%H:%M:%S')
    df['Trip End Time'] = pd.to_datetime(df['Trip End Time'], format='%H:%M:%S')

    # Reorder and format columns
    cols = ['Schedule Name', 'Adult', 'Trip Start Time', 'Trip End Time', 'Source', 'Destination']
    df = df.sort_values(by='Trip Start Time')
    df = df[cols]

    # Calculate duration and passenger count
    df['Duration'] = df['Trip End Time'] - df['Trip Start Time']
    df['Trip Start Time'] = df['Trip Start Time'].apply(lambda x: x.strftime('%H:%M:%S'))  # Convert time to string
    df['Trip End Time'] = df['Trip End Time'].apply(lambda x: x.strftime('%H:%M:%S'))  # Convert time to string
    df['Duration'] = df['Duration'].apply(lambda x: str(x).split()[-1])
    df['Passenger Count'] = df.groupby(['Schedule Name', 'Trip Start Time', 'Trip End Time'])['Adult'].transform('sum')

    df = df.drop(columns=['Adult'])
    df = df.drop_duplicates()

    return jsonify(df.to_dict(orient='records'))