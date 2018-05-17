import * as d3 from 'd3';
import moment from 'moment';

class Chart {
  formatTime = d3.timeFormat('%e %B');

  constructor(options) {
    this.data = this.formatData(options.data);
    this.id = options.id;
    this.element = document.getElementById(options.id);
    this.draw();
    this.createScales();
    this.addAxes();
    this.addLine();
    this.addPoints();
  }

  formatData(data) {
    return data
      .sort((a, b) => moment(a.x).format() >= moment(b.x).format())
      .map(d => ({
        x: new Date(moment.utc(d.x)),
        y: d.y
      }));
  }

  draw() {
    this.margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    };
    this.width = this.element.clientWidth - this.margin.left - this.margin.right;
    this.height = this.element.clientHeight - this.margin.top - this.margin.bottom;
    this.svg = d3.select(`#${this.id}`)
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  createScales() {
    const range = this.data.reduce((prev, current) => {
      if (!prev.min || prev.min >= current.y) {
        prev.min = current.y;
      }
      if (!prev.max || prev.max <= current.y) {
        prev.max = current.y;
      }
      return prev;
    }, {});

    this.xScale = d3.scaleTime()
      .domain([new Date(this.data[0].x), new Date(this.data[this.data.length - 1].x)])
      .range([0, this.width]);

    this.yScale = d3.scaleLinear()
      .domain([range.min - 5, range.max + 5])
      .range([this.height, 0]);
  }

  addAxes() {
    this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${this.height})`)
      .call(
        d3.axisBottom(this.xScale)
        .ticks(d3.timeDays(moment(this.data[0].x).format('x'), moment(this.data[this.data.length - 1].x).format('x')).length + 2)
        .tickFormat(d3.timeFormat('%d.%m.%Y %H:%M:%S'))
      )
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .attr('class', 'x-label')
      .style("text-anchor", "end");

    this.svg.append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(this.yScale).ticks(20));
  }

  addLine() {
    this.line = d3.line()
      .x((d, i) => this.xScale(d.x))
      .y((d) => this.yScale(d.y));

    this.svg.append('path')
      .datum(this.data)
      .attr('class', 'line')
      .attr('d', this.line);
  }

  addPoints() {
    this.div = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    this.svg.selectAll('.dot')
      .data(this.data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', (d, i) => {
        return this.xScale(d.x)
      })
      .attr('cy', (d) => {
        return this.yScale(d.y)
      })
      .attr('r', 5)
      .on('mouseover', (d) => {
        this.div.transition()
          .duration(200)
          .style('opacity', .9);
        this.div.html(`Date: ${this.formatTime(d.x)}<br>Time: ${d3.timeFormat('%H:%M:%S')(d.x)}<br>Value: ${d.y}`)
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', (d) => {
        this.div.transition()
          .duration(500)
          .style('opacity', 0);
      });
  }
}

export const createChart = (id, data) => {
  const chart = new Chart({
    data,
    id
  });
  return chart;
};
