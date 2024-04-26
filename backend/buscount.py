import matplotlib
matplotlib.use('Agg')

from flask import Flask, jsonify, send_file, request
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64
import os

def bus_count():
    data = request.form.to_dict()
    file = request.files['file']
    journey = "up"

    # Construct file path
    file_path = os.path.join('week_data', journey, file.filename)

    # Check if file exists
    if not os.path.isfile(file_path):
        return jsonify({'error': f"File '{file_name}' does not exist."}), 404

    # Read data from file
    df = pd.read_csv(file_path)

    # Filter data for specified bus number
    bus_no = data['busNumber']
    df = df[df['Schedule Name'].str.contains(rf'\b{bus_no}\b')]

    # Select relevant columns and drop duplicates
    cols = ['Schedule Name', 'Trip Start Time', 'Source', 'Destination']
    df = df[cols]
    df = df.drop_duplicates()

    # Filter data for specified source and destination
    source_stage = data['source'].upper()
    destination_stage = data['destination'].upper()
    df = df[(df['Source'] == source_stage) & (df['Destination'] == destination_stage)]

    # Convert Trip Start Time to datetime and extract hour
    df['Trip Start Time'] = pd.to_datetime(df['Trip Start Time'], format='%H:%M:%S')
    df['Hour'] = df['Trip Start Time'].dt.hour

    # Group by hour and count buses
    bus_df = df.groupby('Hour')['Schedule Name'].count().reset_index()
    bus_df.columns = ['Hour', 'Bus Count']
    

    # Format hour ranges
    def hour_range(hour):
        if hour == 23:
            return f"{hour}-0"
        else:
            return f"{hour}-{hour+1}"
            
    bus_df['Hour'] = bus_df['Hour'].apply(hour_range)
    return jsonify(bus_df.to_dict(orient='records'))

   

