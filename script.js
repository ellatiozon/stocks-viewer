const form = document.getElementById('stockForm');
const resultDiv = document.getElementById('stockResult');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const symbol = document.getElementById('stockSymbol').value.toUpperCase();
  const apiKey = "51BgoYPwbc4jvVTOiGtqxNbEKwzlfGeG";
  const apiUrl = `https://financialmodelingprep.com/stable/quote?symbol=${symbol}&apikey=${apiKey}`;

  resultDiv.innerHTML = "Fetching data... ⏳";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const stock = data[0];
      resultDiv.innerHTML = `
        <h3>${stock.name || "Unknown Company"} (${stock.symbol})</h3>
        <p>💲 <strong>Price:</strong> $${stock.price?.toFixed(2) || "N/A"}</p>
        <p>📈 <strong>Change %:</strong> ${stock.changePercentage ? stock.changePercentage.toFixed(2) + "%" : "N/A"}</p>
        <p>📅 <strong>Last Updated:</strong> ${stock.timestamp ? new Date(stock.timestamp * 1000).toLocaleString() : "N/A"}</p>
      `;
    } else {
      resultDiv.innerHTML = "<p>⚠️ Stock not found. Please try another symbol.</p>";
    }
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = "<p>🚨 Error fetching stock data. Please try again later.</p>";
  }
});
