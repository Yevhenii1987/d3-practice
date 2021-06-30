const svg = d3.select('svg')
let fetchedData;

const width = +svg.attr('width')
const height = +svg.attr('height')

const render = data => {
    console.log(data)
    const xValue = d => d.price
    const yValue = d => d.name
    const margin = { top: 20, right: 20, bottom: 20, left: 150 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.bottom - margin.top

    const xScale = d3.scaleLinear()
        .domain([0, d3.max( data, xValue )])
        .range([0, innerWidth])
    const yScale = d3.scaleBand()
        .domain(data.map( yValue ))
        .range([0, innerHeight])
        .padding(0.2)

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

    g.append('g')
        .call(d3.axisLeft(yScale))
            .selectAll('.tick line')
            .remove()
    g.append('g')
        .call(d3.axisBottom(xScale)
            .tickFormat(d3.format('.4n')))
            .attr('transform', `translate(0,${innerHeight})`)

    g.selectAll('rect').data(data)
        .enter().append('rect')
        .attr('y', d => yScale( yValue(d) ))
        .attr('width', d => xScale(xValue(d)) > 5 ? xScale(xValue(d)) : 5)
        .attr('height', yScale.bandwidth())
}
//API KEY: 5b280bcc41027e39c1c39ec27ad9360061c86164
// fetch("https://api.nomics.com/v1/currencies/sparkline?key=5b280bcc41027e39c1c39ec27ad9360061c86164&ids=BTC,ETH,XRP&start=2018-04-14T00%3A00%3A00Z&end=2018-05-14T00%3A00%3A00Z")
//     .then(response => response.json())
//     .then(data => {
//         render(data)
//     })
fetch("https://api.nomics.com/v1/currencies/ticker?key=5b280bcc41027e39c1c39ec27ad9360061c86164&ids=ETH,BCH,XRP,LTC,XMR,ETC,USDT&interval=1d,7d,30d&convert=EUR&per-page=100&page=1")
    .then(response => response.json())
    .then(data => {
        render(data.map((item) => {
            return {
                // id: item.currency,
                name: item.name,
                price: +item.price
            }
        }).sort((a, b) => b.price - a.price))
    })