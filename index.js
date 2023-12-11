// Import stylesheets
import './style.css';

console.log(d3);

const width = 300,
  height = 350;

const data = [
  { amount: 4, date: '2023-11-20' },
  { amount: 197, date: '2023-11-28' },
  { amount: 16, date: '2023-11-30' },
];

const svg = d3
  .select('svg')
  .attr('transform', 'translate(40,50)')
  .classed('container', true) //can give a class name to the div, can be editable dynamically:true
  .style('border', '1px solid red'); //can give it styling

const g = svg.append('g').attr('transform', `translate(40,40)`);

const xDomain = d3.extent(data, (d) => new Date(d.date));

const yDomain = [0, d3.max(data, (d) => +d.amount)];

const x = d3.scaleTime().domain(xDomain).range([0, width]);

const y = d3.scaleLinear().domain(yDomain).range([height, 0]);

g.append('g')
  .attr('class', 'axis axis--x')
  .attr('transform', `translate(0,${height + 10})`)
  .call(
    d3
      .axisBottom(x)
      .tickFormat((d) => d3.timeFormat('%d %b')(d))
      .tickValues([xDomain[0], xDomain[1]])
  );

g.append('g')
  .attr('class', 'axis axis--y')
  .attr('transform', `translate(${width + 10},0)`)
  .call(
    d3
      .axisRight(y)
      .tickSize(-width)
      .ticks(5)
      // .tickValues([yDomain[0], yDomain[1]])
      .tickFormat((d) => (d > 0 ? d3.format('.2s')(d) : d))
  );

draw(data);

setTimeout(() => {
  draw([
    { amount: 4, date: '2023-11-20' },
    { amount: 197, date: '2023-11-28' },
    { amount: 17, date: '2023-11-30' },
  ]);
});

function draw(data) {
  g.selectAll('.circle')
    .data(data, function (d, i, j) {
      return d.date;
    })
    .join(
      (enter) => {
        console.log(enter);
        return enter
          .append('circle')
          .attr('class', 'circle')
          .attr('r', 0)
          .attr('fill', 'red')
          .attr('stroke', 'black')
          .attr('id', (d) => d.date)
          .transition()
          .duration(1200)
          .ease(d3.easeLinear)
          .attr('r', 4);
      },
      (update) => {
        console.log(update);
        return update
          .attr('r', 0)
          .attr('fill', 'green')
          .attr('stroke', 'black')
          .transition()
          .duration(1200)
          .ease(d3.easeLinear)
          .attr('r', 14);
      },
      (exit) => exit.transition().duration(750).attr('r', 0).remove()
    )
    .attr('cx', (d) => x(new Date(d.date)))
    .attr('cy', (d) => y(d.amount));
}
