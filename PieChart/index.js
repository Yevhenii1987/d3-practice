let data = [2,4,8,10]

const svg = d3.select('svg')
const margin = { top: 100, right: 50, bottom: 100, left: 50 }
const width = svg.attr('width') - margin.left - margin.right
const height = svg.attr('height') - margin.top - margin.bottom
const radius = Math.min(width, height) / 2
const innerRadius = 50

const render = data => {
    console.log(data)

    const g = svg.append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2 + margin.top})`)
    const color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c'])

    const pie = d3.pie().value((d) => d.price)
    const path = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius - 10)

    const label = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius - 80);

    const arc = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    arc.append("path")
        .attr("d", path)
        .attr("fill", (d) => color(d.data.name))

    console.log(arc)

    arc.append("text")
        .attr("transform", (d) => {
            // console.log(label.endAngle)
            return `translate(${label.centroid(d)})`
        })
        .text((d) => d.data.name);

    svg.append("g")
        .attr("transform", "translate(" + (width / 2 - 120) + "," + 20 + ")")
        .append("text")
        .text("Cryptocurrency statistics")
        .attr("class", "title")


    // const arcs = g.selectAll('arc')
    //     .data(pie(data))
    //     .enter()
    //     .append('g')
    //     .attr('class', 'arc')
    //
    // arcs.append('path')
    //     .attr('fill', (d, i) => color(i))
    //     .attr('d', arc)

}

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