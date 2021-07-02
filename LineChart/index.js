const svg = d3.select('svg')

const width = +svg.attr('width')
const height = +svg.attr('height')

const render = data => {
    console.log(data)
    const xValue = d => d.timestamp
    const xAxisLabel = 'Timeline'
    const yValue = d => d.price
    const yAxesLabel = 'Currency Price'
    const margin = { top: 60, right: 20, bottom: 100, left: 280 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.bottom - margin.top
    const circleRadius = 7

    const xScale = d3.scaleTime()
        .domain([d3.min(data, xValue), d3.max(data, xValue)])
        .range([0, innerWidth])
        .nice()

    const yScale = d3.scaleLinear()
        .domain([d3.min(data, yValue), d3.max(data, yValue)])
        .range([0, innerHeight])
        .nice()

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

    const xAxis = d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickPadding(15)

    const yAxis = d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickPadding(13)

    g.append('g')
        .call(yAxis)
        .selectAll('.domain')
        .remove()

    const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0,${innerHeight})`)

    // xAxisG.select('.domain').remove()

    const yAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0,${innerHeight})`)

    xAxisG.append('text')
        .attr('class', 'axis-label-x')
        .attr('y', 60)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text(xAxisLabel)

    yAxisG.append('text')
        .attr('class', 'axis-label-y')
        .attr('transform', `rotate(-90)`)
        .attr('x', 110)
        .attr('y', -80)
        .attr('fill', 'black')
        .text(yAxesLabel)

    const lineGenerator = d3.line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)))

    g.append('path')
        .attr('stroke', 'black')
        .attr('class', 'line-path')
        .attr('d', lineGenerator(data))

    g.selectAll('circle').data(data)
        .enter().append('circle')
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', circleRadius)

    g.append('text')
        .attr('class', 'title')
        .attr('y', -30)
        .attr('x', innerWidth / 4)
        .text('Cryptocurrency Statistic')
}

//API KEY: 5b280bcc41027e39c1c39ec27ad9360061c86164

fetch("https://api.nomics.com/v1/currencies/sparkline?key=5b280bcc41027e39c1c39ec27ad9360061c86164&ids=BTC&start=2021-06-01T00%3A00%3A00Z&end=2021-06-30T00%3A00%3A00Z")
    .then(response => response.json())
    .then(data => {
        render(data[0].timestamps.map((item, index) => {
            return {
                timestamp: new Date(item),
                price: data[0].prices[index]
            }
        }))
    })