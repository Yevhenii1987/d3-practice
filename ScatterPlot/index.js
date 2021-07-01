const svg = d3.select('svg')

const width = +svg.attr('width')
const height = +svg.attr('height')

const render = data => {
    console.log(data)
    const xValue = d => d.price
    const yValue = d => d.name
    const margin = { top: 60, right: 20, bottom: 100, left: 200 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.bottom - margin.top

    const xScale = d3.scaleLinear()
        .domain([0, d3.max( data, xValue )])
        .range([0, innerWidth])
        .nice()
    const yScale = d3.scalePoint()
        .domain(data.map( yValue ))
        .range([0, innerHeight])
        .padding(0.5)

    const barLength = (d) => xScale(xValue(d))

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('.4n'))
        .tickSize(-innerHeight)

    const yAxis = d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickPadding(13)

    g.append('g')
        .call(yAxis)
        .selectAll('.domain')
        .remove()

    const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0,${innerHeight})`)

    xAxisG.select('.domain').remove()

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 50)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text('Currency price')

    g.selectAll('circle').data(data)
        .enter().append('circle')
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => barLength(d))
        .attr('r', 10)

    g.append('text')
        .attr('class', 'title')
        .attr('y', -10)
        .attr('x', innerWidth / 4)
        .text('Cryptocurrency Statistic')
}

//API KEY: 5b280bcc41027e39c1c39ec27ad9360061c86164

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