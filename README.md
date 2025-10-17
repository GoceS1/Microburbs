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

### 1. Clone the Repository

```bash
git clone https://github.com/GoceS1/Microburbs.git
cd Microburbs
```

### 2. Create Virtual Environment (Optional but Recommended)

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Dashboard

```bash
python3 app.py
```

Visit: **http://localhost:5000**

The app uses the **Microburbs sandbox API** by default (API key: `"test"`), which provides access to demo data for one property with 22+ years of historical market data.

### 5. Optional: Use Your Own API Key

If you have a production Microburbs API key, set it as an environment variable:

```bash
export MICROBURBS_API_KEY=your_actual_api_key_here
python3 app.py
```

## 📁 Project Structure

```
Microburbs/
├── app.py                  # Flask backend with API integration
├── static/
│   ├── css/
│   │   └── style.css       # Dashboard styles
│   └── js/
│       └── dashboard.js    # Frontend logic & Chart.js visualizations
├── templates/
│   └── index.html          # Main dashboard page
├── requirements.txt        # Python dependencies
├── README.md               # This file
├── DEMO_INSTRUCTIONS.md    # Detailed demo guide
└── .gitignore             # Git ignore rules
```

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

## 📝 Data Source

The dashboard uses the **Microburbs API sandbox** which provides:
- ✅ Real property market data (not mock/fake data)
- ✅ 22+ years of historical price trends
- ✅ 380+ rental yield data points
- ✅ Multi-level geographic comparisons (Suburb, SA3 Region, City Region)
- ✅ Actual property transaction history

**Demo Property**: 27 Arlington Street, Belmont North, NSW

## 📄 License

This project is for educational/interview purposes.

---

**Built for a coding interview** | Demonstrates API integration, data visualization, and full-stack development

