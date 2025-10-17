const form = document.getElementById('stockForm');
const resultDiv = document.getElementById('stockResult');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const symbol = document.getElementById('stockSymbol').value.toUpperCase();
  const apiKey = "51BgoYPwbc4jvVTOiGtqxNbEKwzlfGeG";
  const apiUrl = `https://financialmodelingprep.com/stable/quote?symbol=${symbol}&apikey=${apiKey}`;
  
  resultDiv.innerHTML = "Fetching data...";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.length > 0) {
      const stock = data[0];
      const changeColor = stock.change >= 0 ? 'green' : 'red';
      resultDiv.innerHTML = `
        <h3>${stock.name || stock.symbol} (${stock.symbol})</h3>
        <p>💲 Price: $${stock.price?.toFixed(2) || 'N/A'}</p>
        <p style="color:${changeColor}">Change: ${stock.change?.toFixed(2) || 'N/A'}</p>
        <p>Last Updated: ${new Date(stock.timestamp * 1000).toLocaleString()}</p>
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
  const apiKey = "51BgoYPwbc4jvVTOiGtqxNbEKwzlfGeG";
  const container = document.getElementById('popularStocksContainer');
  container.innerHTML = '<p>Loading popular stocks...</p>';

  try {
    const stockData = [];

    for (const symbol of popularSymbols) {
      const apiUrl = `https://financialmodelingprep.com/stable/quote?symbol=${symbol}&apikey=${apiKey}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data && data.length > 0) stockData.push(data[0]);
    }

    container.innerHTML = '';

    if (stockData.length === 0) {
      throw new Error("No data received");
    }

    stockData.forEach(stock => {
      const changeColor = stock.change >= 0 ? 'green' : 'red';
      const card = document.createElement('div');
      card.classList.add('stock-card');
      card.innerHTML = `
        <div class="stock-symbol">${stock.symbol}</div>
        <div class="stock-price">$${stock.price?.toFixed(2) || 'N/A'}</div>
        <div class="stock-change" style="color:${changeColor}">
          ${stock.change?.toFixed(2) || 'N/A'}
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
setInterval(loadPopularStocks, 60000);
