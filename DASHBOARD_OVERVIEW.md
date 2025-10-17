# Property Investment Dashboard

## Overview

A full-stack property investment analysis dashboard built with **Flask** and **Vanilla JavaScript**, integrated with the **Microburbs API** to provide real-time Australian property market insights.

## Key Features

### 📊 KPI Cards

Three key performance indicators provide instant market insights:

- **Median Price**: Current market value for the selected suburb
- **5-Year Growth**: Capital appreciation percentage over 5 years
- **Rental Yield**: Average annual return from rental income

### 📈 Interactive Charts

**Capital Growth Over Time**

- Tracks median property prices from 2003 to present (22+ years of data)
- Compares three geographic levels: Suburb, SA3 Region, and City Region
- Interactive time period filters (1Y, 5Y, 10Y, All Time)
- Identifies outperforming/underperforming suburbs vs broader markets

**Rental Yield Trends**

- Historical rental yield percentages over time
- Multi-level geographic comparison
- Helps investors identify high-return investment opportunities
- Synchronized with price data for comprehensive analysis

### 📋 Transaction History

- Displays actual property sales with dates and prices
- Validates market trends with real transaction data
- Shows property value appreciation over time

## Tech Stack

- **Backend**: Python (Flask), RESTful API design
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Data Visualization**: Chart.js
- **API Integration**: Microburbs Real Estate API
- **Features**: Real-time data fetching, LRU caching, responsive design

## Data Source

All data is sourced from the **Microburbs API**, Australia's leading property data provider, ensuring accurate and up-to-date market insights for informed investment decisions.

---

_Built for property investors to make data-driven decisions_
