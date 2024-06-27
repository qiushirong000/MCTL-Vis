import os
import json
import pandas as pd
from flask_cors import CORS
from flask import Flask, render_template,jsonify,request

app=Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/api/data', methods=['GET'])
def get_data():
    # 从conditionSimilarity.json文件加载数据
    with open('./static/data/conditionSimilarity.json', 'r') as file:
        data = json.load(file)
    
    # 将数据作为JSON响应返回给前端
    return jsonify(data)


if __name__ == "__main__":
    port=5000
    app.run(host='127.0.0.2',port=port, debug=True, threaded=True)
