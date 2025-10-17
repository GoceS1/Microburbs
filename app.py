#!/usr/bin/env python3
"""
Property Investment Dashboard - Flask Backend
Microburbs API Integration
"""

from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import requests
from datetime import datetime, timedelta
from functools import lru_cache
import os

app = Flask(__name__)
CORS(app)

# Configuration
API_BASE_URL = "https://www.microburbs.com.au/report_generator/api"
API_KEY = os.getenv("MICROBURBS_API_KEY", "test")  # Default to sandbox

# Demo suburbs with their GNAF IDs
# Note: Sandbox API only supports specific demo properties
DEMO_SUBURBS = [
    {
        "name": "Belmont North, NSW",
        "gnaf_id": "GANSW704074813",
        "display_name": "Belmont North",
        "address": "27 Arlington Street, Belmont North"
    }
]


@lru_cache(maxsize=32)
def fetch_market_data(gnaf_id, metric="sell_price"):
    """
    Fetch market data from Microburbs API with caching
    """
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(
            f"{API_BASE_URL}/property/market",
            params={"id": gnaf_id, "metric": metric},
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"API Error: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"Exception fetching data: {str(e)}")
        return None


def filter_time_period(series, period):
    """
    Filter time series data based on period (1y, 5y, 10y, all)
    """
    if not series or period == "all":
        return series
    
    # Calculate cutoff date
    now = datetime.now()
    if period == "1y":
        cutoff = now - timedelta(days=365)
    elif period == "5y":
        cutoff = now - timedelta(days=365 * 5)
    elif period == "10y":
        cutoff = now - timedelta(days=365 * 10)
    else:
        return series
    
    # Filter series
    filtered = []
    for item in series:
        try:
            item_date = datetime.strptime(item["date"], "%Y-%m-%d")
            if item_date >= cutoff:
                filtered.append(item)
        except:
            continue
    
    return filtered


def calculate_kpis(price_data, yield_data):
    """
    Calculate Key Performance Indicators
    """
    kpis = {
        "median_price": 0,
        "growth_5y": 0,
        "avg_yield": 0
    }
    
    # Calculate median price (latest value)
    if price_data and price_data.get("series"):
        series = price_data["series"]
        if series:
            latest = series[-1]
            kpis["median_price"] = latest["suburb"]["value"]
            
            # Calculate 5-year growth
            five_years_ago = datetime.now() - timedelta(days=365 * 5)
            for item in series:
                try:
                    item_date = datetime.strptime(item["date"], "%Y-%m-%d")
                    if item_date <= five_years_ago:
                        old_price = item["suburb"]["value"]
                        if old_price > 0:
                            growth = ((kpis["median_price"] - old_price) / old_price) * 100
                            kpis["growth_5y"] = round(growth, 1)
                        break
                except:
                    continue
    
    # Calculate average yield
    if yield_data and yield_data.get("series"):
        series = yield_data["series"]
        if series:
            # Get last 12 months of yield data
            recent_yields = [s["suburb"]["value"] for s in series[-12:]]
            if recent_yields:
                avg_yield = sum(recent_yields) / len(recent_yields)
                kpis["avg_yield"] = round(avg_yield * 100, 2)  # Convert to percentage
    
    return kpis


@app.route('/')
def index():
    """Render the main dashboard page"""
    return render_template('index.html', suburbs=DEMO_SUBURBS)


@app.route('/api/suburbs')
def get_suburbs():
    """Get list of available demo suburbs"""
    return jsonify(DEMO_SUBURBS)


@app.route('/api/market-data')
def get_market_data():
    """
    Get market data for a specific suburb
    Query params:
    - gnaf_id: Property GNAF ID
    - period: 1y, 5y, 10y, or all (default: all)
    """
    gnaf_id = request.args.get('gnaf_id')
    period = request.args.get('period', 'all')
    
    if not gnaf_id:
        return jsonify({"error": "gnaf_id is required"}), 400
    
    # Fetch both price and yield data
    price_data = fetch_market_data(gnaf_id, "sell_price")
    yield_data = fetch_market_data(gnaf_id, "yield")
    
    if not price_data:
        return jsonify({"error": "Failed to fetch data from API"}), 500
    
    # Filter by time period
    price_series = filter_time_period(price_data.get("series", []), period)
    yield_series = filter_time_period(yield_data.get("series", []) if yield_data else [], period)
    
    # Calculate KPIs
    kpis = calculate_kpis(price_data, yield_data)
    
    # Prepare response
    response = {
        "address": price_data.get("address", ""),
        "suburb": price_series[0]["suburb"]["area_name"] if price_series else "",
        "property_type": price_data.get("property_type", ""),
        "period": period,
        "kpis": kpis,
        "price_series": {
            "dates": [item["date"] for item in price_series],
            "suburb_values": [item["suburb"]["value"] for item in price_series],
            "sa3_values": [item["sa3"]["value"] for item in price_series],
            "cr_values": [item["cr"]["value"] for item in price_series],
            "labels": {
                "suburb": price_series[0]["suburb"]["area_name"] if price_series else "",
                "sa3": price_series[0]["sa3"]["area_name"] if price_series else "",
                "cr": price_series[0]["cr"]["area_name"] if price_series else ""
            }
        },
        "yield_series": {
            "dates": [item["date"] for item in yield_series],
            "suburb_values": [item["suburb"]["value"] * 100 for item in yield_series],  # Convert to %
            "sa3_values": [item["sa3"]["value"] * 100 for item in yield_series],
            "cr_values": [item["cr"]["value"] * 100 for item in yield_series],
            "labels": {
                "suburb": yield_series[0]["suburb"]["area_name"] if yield_series else "",
                "sa3": yield_series[0]["sa3"]["area_name"] if yield_series else "",
                "cr": yield_series[0]["cr"]["area_name"] if yield_series else ""
            }
        } if yield_series else None,
        "transactions": price_data.get("property_transactions", [])
    }
    
    return jsonify(response)


@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "api_key_set": bool(API_KEY),
        "demo_suburbs": len(DEMO_SUBURBS)
    })


if __name__ == '__main__':
    print("""
    ╔═══════════════════════════════════════════════════════════╗
    ║     Property Investment Dashboard - Flask Backend         ║
    ║            Powered by Microburbs API                      ║
    ╚═══════════════════════════════════════════════════════════╝
    
    🚀 Server starting...
    📍 URL: http://localhost:5000
    🔑 API Key: {key}
    🏘️  Demo Suburbs: {count}
    
    """.format(
        key=API_KEY if API_KEY != "test" else "test (sandbox)",
        count=len(DEMO_SUBURBS)
    ))
    
    app.run(debug=True, host='0.0.0.0', port=5000)

