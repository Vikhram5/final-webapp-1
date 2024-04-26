from flask import request, jsonify
import os
import pandas as pd
import numpy as np

def revenue_analysis():
    # Read the dataset into a pandas DataFrame
    data = request.form.to_dict()
    file = request.files['file']
    file_name = file.filename

    df = pd.read_csv(file)

    numeric_cols = ['Total Amount', 'Adult', 'Child', 'Denomination', 'Luggage', 'Trip No', 'Concession']
    df[numeric_cols] = df[numeric_cols].astype(int)
    df['Revenue'] = df['Total Amount']
    revenue_by_depot = df.groupby('Depot')['Revenue'].sum()

    # Convert revenue by depot to JSON format
    revenue_by_depot_json = revenue_by_depot.reset_index().to_dict(orient='records')

    # Return revenue by depot in JSON format
    return jsonify(revenue_by_depot_json)
