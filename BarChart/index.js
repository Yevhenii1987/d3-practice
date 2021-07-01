const svg = d3.select('svg')

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
    const barLength = (d) => xScale(xValue(d)) > 5 ? xScale(xValue(d)) : 5

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
        .attr('width', d => barLength(d))
        .attr('height', yScale.bandwidth())

    update();

    function update() {
        g.selectAll('rect')
            .attr('width', 0)
            .transition()
            .duration(1000)
            .delay((d, i) => {
                console.log(d)
                return i * 100
            })
            .attr('width', d => barLength(d))
    }
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