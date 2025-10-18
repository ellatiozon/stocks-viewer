const form = document.getElementById('stockForm');
const resultDiv = document.getElementById('stockResult');

const apiKey = "d3porm1r01qs89su5qagd3porm1r01qs89su5qb0";

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const symbol = document.getElementById('stockSymbol').value.toUpperCase();
  const apiUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
  
  resultDiv.innerHTML = "Fetching data...";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Check if valid data
    if (data && data.c) {
      const change = data.d;
      const changeColor = change >= 0 ? 'green' : 'red';
      resultDiv.innerHTML = `
        <h3>${symbol}</h3>
        <p>Price: $${data.c.toFixed(2)}</p>
        <p style="color:${changeColor}">Change: ${change?.toFixed(2) || 'N/A'}</p>
        <p>High: $${data.h?.toFixed(2) || 'N/A'}</p>
        <p>Low: $${data.l?.toFixed(2) || 'N/A'}</p>
        <p>Open: $${data.o?.toFixed(2) || 'N/A'}</p>
        <p>Previous Close: $${data.pc?.toFixed(2) || 'N/A'}</p>
      `;
    } else {
      resultDiv.innerHTML = "<p>Stock not found. Please try another symbol.</p>";
    }
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = "<p>Error fetching stock data.</p>";
  }
});

async function loadPopularStocks() {
  const popularSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META'];
  const container = document.getElementById('popularStocksContainer');
  container.innerHTML = '<p>Loading popular stocks...</p>';

  try {
    const stockData = [];

    for (const symbol of popularSymbols) {
      const apiUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data && data.c) {
        stockData.push({ symbol, ...data });
      }
    }

    container.innerHTML = '';

    if (stockData.length === 0) {
      throw new Error("No data received");
    }

    stockData.forEach(stock => {
      const changeColor = stock.d >= 0 ? 'green' : 'red';
      const card = document.createElement('div');
      card.classList.add('stock-card');
      card.innerHTML = `
        <div class="stock-symbol">${stock.symbol}</div>
        <div class="stock-price">$${stock.c?.toFixed(2) || 'N/A'}</div>
        <div class="stock-change" style="color:${changeColor}">
          ${stock.d?.toFixed(2) || 'N/A'}
        </div>
      `;

      card.addEventListener('click', () => {
        document.getElementById('stockSymbol').value = stock.symbol;
        form.dispatchEvent(new Event('submit'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      container.appendChild(card);
    });

  } catch (error) {
    console.error(error);
    container.innerHTML = '<p>Failed to load popular stocks. Please refresh.</p>';
  }
}

loadPopularStocks();
setInterval(loadPopularStocks, 60000); // refresh every 60 seconds
