import requests
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd

# Set your FMP API key
FMP_API_KEY = "YOUR_FMP_API_KEY"

def get_financial_graphs(symbol):
    """
    Fetch financial data for a given company symbol and generate financial graphs.

    Parameters:
        symbol (str): The stock symbol of the company.

    Returns:
        dict: A dictionary containing financial graphs as JSON.
    """

    # API Endpoints
    urls = {
        "balance_sheet": f"https://financialmodelingprep.com/api/v3/balance-sheet-statement/{symbol}?limit=5&apikey={FMP_API_KEY}",
        "income_statement": f"https://financialmodelingprep.com/api/v3/income-statement/{symbol}?limit=5&apikey={FMP_API_KEY}"
    }
    
    # Fetch data
    data = {key: requests.get(url).json() if requests.get(url).status_code == 200 else None for key, url in urls.items()}
    
    balance_sheet, income_statement = data["balance_sheet"], data["income_statement"]
    
    if not balance_sheet or not income_statement:
        return {"error": "Failed to fetch financial data."}

    df_bs = pd.DataFrame(balance_sheet)
    df_bs["year"] = pd.to_datetime(df_bs["date"]).dt.year

    df_is = pd.DataFrame(income_statement)
    df_is["year"] = pd.to_datetime(df_is["date"]).dt.year

    graphs = {}

    # 📊 1. Total Assets vs. Total Liabilities
    fig1 = go.Figure()
    fig1.add_trace(go.Bar(x=df_bs["year"], y=df_bs["totalAssets"], name="Total Assets", marker_color="blue"))
    fig1.add_trace(go.Bar(x=df_bs["year"], y=df_bs["totalLiabilities"], name="Total Liabilities", marker_color="red"))
    fig1.update_layout(title="Total Assets vs. Total Liabilities", barmode="group", xaxis_title="Year", yaxis_title="Amount (INR)")
    graphs["assets_vs_liabilities"] = fig1.to_json()

    # 📊 2. Debt-to-Equity Ratio Over Time
    df_bs["Debt-to-Equity"] = df_bs["totalDebt"] / df_bs["totalStockholdersEquity"]
    fig2 = px.line(df_bs, x="year", y="Debt-to-Equity", title="Debt-to-Equity Ratio Over Time", markers=True)
    graphs["debt_to_equity"] = fig2.to_json()

    # 📊 3. Revenue vs. Net Income Over Time
    fig3 = go.Figure()
    fig3.add_trace(go.Scatter(x=df_is["year"], y=df_is["revenue"], mode="lines+markers", name="Revenue", marker=dict(color="green")))
    fig3.add_trace(go.Scatter(x=df_is["year"], y=df_is["netIncome"], mode="lines+markers", name="Net Income", marker=dict(color="orange")))
    fig3.update_layout(title="Revenue vs. Net Income", xaxis_title="Year", yaxis_title="Amount (INR)")
    graphs["revenue_vs_net_income"] = fig3.to_json()

    # 📊 4. Operating Cash Flow vs. Net Income
    fig4 = go.Figure()
    fig4.add_trace(go.Bar(x=df_is["year"], y=df_is["operatingCashFlow"], name="Operating Cash Flow", marker_color="blue"))
    fig4.add_trace(go.Bar(x=df_is["year"], y=df_is["netIncome"], name="Net Income", marker_color="red"))
    fig4.update_layout(title="Operating Cash Flow vs. Net Income", barmode="group", xaxis_title="Year", yaxis_title="Amount (INR)")
    graphs["cash_flow_vs_net_income"] = fig4.to_json()

    # 📊 5. Profit Margins (Gross, Operating, Net) Over Time
    df_is["Gross Margin"] = df_is["grossProfit"] / df_is["revenue"]
    df_is["Operating Margin"] = df_is["operatingIncome"] / df_is["revenue"]
    df_is["Net Margin"] = df_is["netIncome"] / df_is["revenue"]
    fig5 = px.line(df_is, x="year", y=["Gross Margin", "Operating Margin", "Net Margin"],
                   title="Profit Margins Over Time", markers=True)
    graphs["profit_margins"] = fig5.to_json()

    # 📊 6. Earnings Per Share (EPS) Over Time
    fig6 = px.line(df_is, x="year", y="eps", title="Earnings Per Share (EPS) Over Time", markers=True)
    graphs["eps_over_time"] = fig6.to_json()

    # 📊 7. Return on Assets (ROA) & Return on Equity (ROE)
    df_is["ROA"] = df_is["netIncome"] / df_bs["totalAssets"]
    df_is["ROE"] = df_is["netIncome"] / df_bs["totalStockholdersEquity"]
    fig7 = px.line(df_is, x="year", y=["ROA", "ROE"], title="Return on Assets (ROA) & Return on Equity (ROE)", markers=True)
    graphs["roa_vs_roe"] = fig7.to_json()

    return graphs
