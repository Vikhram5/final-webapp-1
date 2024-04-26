from flask import Flask, request, jsonify
import pandas as pd
import os


def generate_od_matrix():
    # Extract data from the request form
    data = request.form.to_dict()
    file = request.files['file']

    journey = data['journey']
    name = data['name']
    source_stage = data['sourceStage']
    destination_stage = data['destinationStage']
    start_time = data['startTime']
    end_time = data['endTime']
    store_file = data['storeFile']

    # Construct the file path
    file_path = os.path.join('week_data', journey,  file.filename)

    # Check if the file exists
    if not os.path.isfile(file_path):
        return {"error": f"File '{file}' does not exist."}, 404

    # Read the CSV file into a DataFrame
    df = pd.read_csv(file_path)

    # Filter the DataFrame based on inputs
    cols = ['Schedule Name', 'Adult', 'From Stage', 'To Stage', 'Trip Start Time', 'Trip End Time', 'Source', 'Destination']
    df = df[cols]
    df = df[df['Schedule Name'] == name]
    df = df[(df['Source'] == source_stage) & (df['Destination'] == destination_stage)]
    df = df[(df['Trip Start Time'] >= start_time) & (df['Trip End Time'] <= end_time)]

    cols = ['From Stage', 'To Stage', 'Adult']
    df = df[cols]

    # Define bus stages and create a stage mapping
    bus_stages = ['T.NAGAR', 'SAIDAPET', 'ANNA UNIV', 'WPTC', 'SRP TOOLS', 'KANDANCHAV', 'THORAIPAKKAM', 'M K CHAVADI', 'KARAPAKKAM',
                  'SHOLINGANALLUR', 'KUMARAN NG', 'CHEMMANCHE', 'NAVALUR', 'SIPCOT', 'CHURCH', 'PAL. CHEMI', 'HINDUSTAN', 'KELAMBAKKAM',
                  'KOMAN NAGAR', 'ENGG', 'CHENGAMMAL', 'KALAVAKKAM', 'THIRUPORUR']
    stage_mapping = {stage: i for i, stage in enumerate(bus_stages)}

    # Map bus stages to numerical values
    df['From Stage'] = df['From Stage'].map(stage_mapping)
    df['To Stage'] = df['To Stage'].map(stage_mapping)

    # Drop NaN values
    df.dropna(subset=['From Stage', 'To Stage'], inplace=True)

    od_matrix = pd.DataFrame(index=bus_stages, columns=bus_stages).fillna(0)

    for index, row in df.iterrows():
        source = bus_stages[int(row['From Stage'])]
        destination = bus_stages[int(row['To Stage'])]
        adult_count = row['Adult']
        od_matrix.loc[source, destination] += adult_count if not pd.isna(adult_count) else 0

    od_matrix['Boarding'] = od_matrix.sum(axis=1)
    od_matrix.loc['ALIGHTING', :] = od_matrix.sum(axis=0)

    od_matrix.to_excel(f"{store_file}.xlsx")

    return jsonify(od_matrix.to_dict(orient='records'))



