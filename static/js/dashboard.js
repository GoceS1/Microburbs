/**
 * Property Investment Dashboard - Frontend JavaScript
 * Handles chart rendering, data fetching, and user interactions
 */

// Global state
let currentGnafId = null;
let currentPeriod = '10y';
let priceChart = null;
let yieldChart = null;

// DOM Elements
const suburbSelect = document.getElementById('suburb-select');
const periodButtons = document.querySelectorAll('.btn-period');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const dashboardContent = document.getElementById('dashboard-content');
const errorMessage = document.getElementById('error-message');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    // Auto-select first suburb for demo
    if (suburbSelect.options.length > 1) {
        suburbSelect.selectedIndex = 1;
        handleSuburbChange();
    }
});

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Suburb selection
    suburbSelect.addEventListener('change', handleSuburbChange);
    
    // Period buttons
    periodButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            periodButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPeriod = btn.dataset.period;
            if (currentGnafId) {
                fetchAndRenderData();
            }
        });
    });
}

/**
 * Handle suburb selection change
 */
function handleSuburbChange() {
    const selectedOption = suburbSelect.options[suburbSelect.selectedIndex];
    currentGnafId = selectedOption.value;
    
    if (currentGnafId) {
        fetchAndRenderData();
    }
}

/**
 * Fetch and render market data
 */
async function fetchAndRenderData() {
    showLoading();
    hideError();
    
    try {
        const response = await fetch(`/api/market-data?gnaf_id=${currentGnafId}&period=${currentPeriod}`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        renderDashboard(data);
        hideLoading();
        showDashboard();
        
    } catch (err) {
        console.error('Error fetching data:', err);
        showError(`Failed to load market data: ${err.message}`);
        hideLoading();
    }
}

/**
 * Render the complete dashboard
 */
function renderDashboard(data) {
    // Update property info
    document.getElementById('property-address').textContent = data.suburb || 'Property Market Insights';
    document.getElementById('property-details').textContent = 
        `${data.address} • ${data.property_type} • ${getPeriodLabel(currentPeriod)}`;
    
    // Update KPIs
    updateKPIs(data.kpis);
    
    // Render charts
    renderPriceChart(data.price_series);
    if (data.yield_series) {
        renderYieldChart(data.yield_series);
    }
    
    // Render transactions
    if (data.transactions && data.transactions.length > 0) {
        renderTransactions(data.transactions);
        document.getElementById('transactions-section').classList.remove('hidden');
    } else {
        document.getElementById('transactions-section').classList.add('hidden');
    }
}

/**
 * Update KPI cards
 */
function updateKPIs(kpis) {
    // Median Price
    document.getElementById('kpi-median-price').textContent = 
        formatCurrency(kpis.median_price);
    
    // 5-Year Growth
    const growthElement = document.getElementById('kpi-growth');
    const growth = kpis.growth_5y;
    growthElement.textContent = `${growth > 0 ? '+' : ''}${growth}%`;
    growthElement.style.color = growth >= 0 ? '#10b981' : '#ef4444';
    
    // Rental Yield
    document.getElementById('kpi-yield').textContent = `${kpis.avg_yield}%`;
}

/**
 * Render price chart
 */
function renderPriceChart(priceData) {
    const ctx = document.getElementById('price-chart').getContext('2d');
    
    // Destroy existing chart
    if (priceChart) {
        priceChart.destroy();
    }
    
    const labels = priceData.dates.map(date => formatDate(date));
    
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: priceData.labels.suburb,
                    data: priceData.suburb_values,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 6
                },
                {
                    label: priceData.labels.sa3,
                    data: priceData.sa3_values,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.05)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    borderDash: [5, 5]
                },
                {
                    label: priceData.labels.cr,
                    data: priceData.cr_values,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        padding: 15,
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        family: 'Inter',
                        size: 13
                    },
                    bodyFont: {
                        family: 'Inter',
                        size: 12
                    },
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return formatCurrencyShort(value);
                        },
                        font: {
                            family: 'Inter',
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        font: {
                            family: 'Inter',
                            size: 10
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * Render yield chart
 */
function renderYieldChart(yieldData) {
    const ctx = document.getElementById('yield-chart').getContext('2d');
    
    // Destroy existing chart
    if (yieldChart) {
        yieldChart.destroy();
    }
    
    const labels = yieldData.dates.map(date => formatDate(date));
    
    yieldChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: yieldData.labels.suburb,
                    data: yieldData.suburb_values,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 6
                },
                {
                    label: yieldData.labels.sa3,
                    data: yieldData.sa3_values,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.05)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    borderDash: [5, 5]
                },
                {
                    label: yieldData.labels.cr,
                    data: yieldData.cr_values,
                    borderColor: '#ec4899',
                    backgroundColor: 'rgba(236, 72, 153, 0.05)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        padding: 15,
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        family: 'Inter',
                        size: 13
                    },
                    bodyFont: {
                        family: 'Inter',
                        size: 12
                    },
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(1) + '%';
                        },
                        font: {
                            family: 'Inter',
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        font: {
                            family: 'Inter',
                            size: 10
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * Render transactions table
 */
function renderTransactions(transactions) {
    const tbody = document.getElementById('transactions-body');
    tbody.innerHTML = '';
    
    transactions.forEach(txn => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(txn.date)}</td>
            <td>${txn.address}</td>
            <td class="price">${formatCurrency(txn.price)}</td>
            <td><span class="badge-small">${txn.transaction_type}</span></td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Utility functions
 */

function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    error.classList.remove('hidden');
    dashboardContent.classList.add('hidden');
}

function hideError() {
    error.classList.add('hidden');
}

function showDashboard() {
    dashboardContent.classList.remove('hidden');
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function formatCurrencyShort(value) {
    if (value >= 1000000) {
        return '$' + (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
        return '$' + (value / 1000).toFixed(0) + 'K';
    }
    return '$' + value.toFixed(0);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { year: 'numeric', month: 'short' });
}

function getPeriodLabel(period) {
    const labels = {
        '1y': '1 Year View',
        '5y': '5 Year View',
        '10y': '10 Year View',
        'all': 'All Time'
    };
    return labels[period] || period;
}

