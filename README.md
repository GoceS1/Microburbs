# Property Investment Dashboard 🏘️

A property investment dashboard built with **Flask** and **vanilla JavaScript** to visualize Australian real estate market data from the Microburbs API.

## 🎯 Features

- **Interactive Suburb Selection**: Dropdown to explore different suburbs
- **Capital Growth Visualization**: Line chart showing property price trends
- **Rental Yield Analysis**: Line chart displaying rental yield over time
- **Time Period Toggles**: View data for 1 year, 5 years, or 10 years
- **Key Performance Indicators**:
  - 5-Year Growth %
  - Average Rental Yield %
  - Current Median Price

## 🛠️ Tech Stack

- **Backend**: Python (Flask)
- **Frontend**: Vanilla JavaScript (no frameworks)
- **Charts**: Chart.js or Plotly.js
- **API**: Microburbs Property Data API

## 📋 Prerequisites

- Python 3.8+
- Microburbs API key (get one at [microburbs.com.au](https://www.microburbs.com.au/api))
- pip (Python package manager)

## 🚀 Setup & Installation

### 1. Clone or Download

```bash
cd microburbs
```

### 2. Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure API Key

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your Microburbs API key:

```
MICROBURBS_API_KEY=your_actual_api_key_here
```

### 5. Test API Data (Optional)

Before building the dashboard, verify the API works:

```bash
python test_api.py
```

This will check:
- ✅ API endpoints are accessible
- ✅ Data structure is correct
- ✅ Historical data is available (1y, 5y, 10y)

### 6. Run the Dashboard

```bash
python app.py
```

Visit: **http://localhost:5000**

## 📁 Project Structure

```
microburbs/
├── app.py                  # Flask backend
├── static/
│   ├── css/
│   │   └── style.css       # Dashboard styles
│   └── js/
│       └── dashboard.js    # Frontend logic & charts
├── templates/
│   └── index.html          # Main dashboard page
├── mock_data.json          # Sample data for testing
├── test_api.py             # API validation script
├── requirements.txt        # Python dependencies
├── .env                    # API configuration (not in git)
└── README.md               # This file
```

## 🧪 Using Mock Data

If you don't have an API key or want to test without hitting the API:

1. Set `USE_MOCK_DATA=true` in `.env`
2. The app will use `mock_data.json` instead

## 📊 API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `/property/market` | Get property-level market insights |
| `/suburb/market` | Get suburb-level aggregated data |
| `/suburb/list` | List available suburbs (if available) |

## 🎨 Features Breakdown

### Backend (Flask)
- REST API endpoints for frontend
- Microburbs API integration
- Response caching (reduces API calls)
- Error handling & fallbacks

### Frontend (Vanilla JS)
- Dynamic suburb dropdown
- Interactive line charts
- Time period filtering
- Real-time KPI calculations

## 🐛 Troubleshooting

### API Returns 401 Unauthorized
- Check your API key in `.env`
- Ensure key is valid and not expired

### No Historical Data
- Some suburbs may have limited data
- Try a different suburb (e.g., Sydney - Bondi)

### Charts Not Rendering
- Check browser console for errors
- Ensure Chart.js/Plotly is loaded
- Clear browser cache

## 📝 Development Notes

### Data Validation Checklist
- [ ] API endpoints confirmed working
- [ ] Time series data available (1y, 5y, 10y)
- [ ] Both sell_price and yield metrics available
- [ ] Suburb list endpoint exists (or hardcoded)

### Next Steps
1. ✅ Validate API data structure
2. ⏳ Build Flask backend
3. ⏳ Create frontend UI
4. ⏳ Implement charts
5. ⏳ Add caching
6. ⏳ Polish UI/UX

## 📄 License

This project is for educational/interview purposes.

---

**Built for a coding interview** | Demonstrates API integration, data visualization, and full-stack development

