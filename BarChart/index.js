const svg = d3.select('svg')
let fetchedData;

fetch("https://api.nomics.com/v1/currencies/ticker?key=5b280bcc41027e39c1c39ec27ad9360061c86164&ids=BTC,ETH,XRP&interval=1d,30d&convert=EUR&per-page=100&page=1")
    .then(response => response.json())
    .then(data => console.log(data))

const width = +svg.attr('width')
const height = +svg.attr('height')