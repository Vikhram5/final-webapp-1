from flask import request, jsonify
import os
import pandas as pd
import numpy as np

def visualize_bus_loading():
    data = request.form.to_dict()
    file = request.files['file']
    file_name = file.filename
    
    source_stage = data['source'].upper()
    destination_stage = data['destination'].upper()
    start = data['startTime']
    end = data['endTime']

    file_path = os.path.join('week_data', 'up', file_name)

    if not os.path.isfile(file_path):
        return jsonify({"error": f"File '{file_name}' does not exist."})
    else:
         df = pd.read_csv(file)

    if 'busNumber' in data:
        bus_no = data['busNumber']
        df = df[df['Schedule Name'].str.contains(rf'\b{bus_no}\b')]
    elif 'schedule' in data:
        schedule = data['scheduleName']
        df = df[df['Schedule Name']==schedule]
    else:
        return "error"

    cols = ['Schedule Name','Adult','From Stage','To Stage','Trip Start Time','Trip End Time','Source','Destination']
    df = df[cols]
    df = df[(df['Source']==source_stage) & (df['Destination']==destination_stage)]

    df['Trip Start Time'] = pd.to_datetime(df['Trip Start Time'], format='%H:%M:%S')
    df['Trip End Time'] = pd.to_datetime(df['Trip End Time'], format='%H:%M:%S')

    start_time = pd.to_datetime(start).time()
    end_time = pd.to_datetime(end).time()

    df = df[(df['Trip Start Time'].dt.time >= start_time) & (df['Trip Start Time'].dt.time < end_time)]

    bus_stages = [
        'T.NAGAR', 'SAIDAPET', 'ANNA UNIV', 'WPTC', 'SRP TOOLS',
        'KANDANCHAV', 'THORAIPAKKAM', 'M K CHAVADI', 'KARAPAKKAM',
        'SHOLINGANALLUR', 'KUMARAN NG', 'CHEMMANCHE', 'NAVALUR',
        'SIPCOT', 'CHURCH', 'PAL. CHEMI', 'HINDUSTAN', 'KELAMBAKKAM',
        'KOMAN NAGAR', 'ENGG', 'CHENGAMMAL', 'KALAVAKKAM','THIRUPORUR'
    ]
    stage_mapping = {stage: i for i, stage in enumerate(bus_stages)}

    df['From Stage'] = df['From Stage'].map(stage_mapping)
    df['To Stage'] = df['To Stage'].map(stage_mapping)
    df.dropna(subset=['From Stage', 'To Stage'], inplace=True)

    od_matrix = pd.DataFrame(index=bus_stages, columns=bus_stages).fillna(0)

    for index, row in df.iterrows():
        source = bus_stages[int(row['From Stage'])]
        destination = bus_stages[int(row['To Stage'])]
        adult_count = row['Adult']
        if not pd.isna(adult_count):
            od_matrix.loc[source, destination] += adult_count

    od_matrix['Boarding'] = od_matrix.sum(axis=1)
    od_matrix['Alighting'] = od_matrix.sum(axis=0)
    od_matrix['Sum'] = od_matrix['Boarding'] - od_matrix['Alighting']

    arr = od_matrix['Sum'].values
    passengers = np.cumsum(arr).tolist()
    stage_passengers_dict = {stage: passengers[i] for i, stage in enumerate(bus_stages)}
    
    return jsonify(stage_passengers_dict)
