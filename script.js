
let width = 900, height = 600, barWidth = width / 275;

let x = d3.scaleLinear().range([0, width-80]);
let y = d3.scaleTime().range([0, height-100]);


let timeFormat = d3.timeFormat('%M:%S');

let xAxis = d3.axisBottom(x).tickFormat(d3.format('d'));
let yAxis = d3.axisLeft(y).tickFormat(timeFormat);

const tooltip = d3.select('body')
                        .append('div')
                        .attr('id', 'tooltip')
                        .style('opacity', 0);

const svg=d3.select("body")
                        .append("svg")
                        .attr("width",width)
                        .attr("height",height)
                        .attr("class","svgContainer")
                        .append("g")

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
        .then((data) => {
                data.forEach((item)=>{                                                  //to mutate the array
                        item.Place = +item.Place;
                        let parsedTime = item.Time.split(':');
                        item.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);       
                })

                x.domain([d3.min(data,  (d)=> {   return d.Year - 1;})
                                  ,d3.max(data,  (d)=> {   return d.Year + 1;})
                ]);

                y.domain(d3.extent(data,  (d)=> {  return d.Time  }) );

                svg.append('text')
                        .attr('id', 'title')
                        .attr('x', width / 2)
                        .style('text-anchor', 'middle')
                        .attr('y', 30)
                        .style('font-size', '30px')

                        .text('Doping in Professional Bicycle Racing');

                svg.append('text')
                        .attr('x', width / 2)
                        .style('text-anchor', 'middle')
                        .attr('y', 55)
                        .style('font-size', '20px')
                        .text("35 Fastest times up Alpe d'Huez");        

                svg.append("g")
                        .attr("id","x-axis")
                        .attr("transform",`translate(60,${height-30})`)
                        .call(xAxis)

                svg.append("g")
                        .attr("id","y-axis")
                        .attr("transform",`translate(${60},${70})`)
                        .call(yAxis)

                svg.append("text")
                        .attr("x",-260)
                        .attr("y",18)
                        .style("font-size",18)
                        .attr("transform","rotate(-90)")
                        .text("Time in Minutes")

                svg.selectAll(".dot")
                        .data(data)
                        .enter()
                        .append("circle")
                        .attr("transform",`translate(60,${70})`)
                        .attr("class","dot")
                        .attr("r",6)
                        .attr("cx",(d)=>{return x(d.Year)})
                        .attr("cy",(d)=>{return y(d.Time)})
                        .attr("data-xvalue",(d)=>{return (d.Year)})
                        .attr("data-yvalue",(d)=>{return (d.Time.toISOString())})
                        .style("fill",(d)=>{return  d.Doping !== ''? "blue":"orange"})
                        .on("mouseover",(e,d)=>{
                                tooltip.transition().duration(200).style('opacity', 0.8);
                                tooltip.attr("data-year",d.Year)
                                tooltip.html(
                                                `${d.Name}: ${d.Nationality}  <br/>Year: ${d.Year}, Time: ${timeFormat(d.Time)}
                                                ${d.Doping ? '<br/><br/>' + d.Doping :"" }
                                                ` 
                                        ) 
                                .style('left', e.pageX +10+ 'px')
                                .style('top', e.pageY - 28 + 'px');
                        }) .
                        on("mouseout", ()=>{
                                tooltip.transition()
                                        .duration(400)
                                        .style("opacity", 0);
                        })
                        
                let legendBox = svg.append('g').attr('id', 'legend');
                let legend=legendBox.selectAll("#legend")
                                                        .data(["blue","orange"])
                                                        .enter()
                                                        .append("g")
                                                        .attr("class","legend-items")
                                                        .attr('transform', function (d, i) {
                                                                console.log(i)
                                                                return `translate(${width-50},${height / 2 - i * 20})`
                                                              });
                
                legend.append('rect')
                                .attr('width', 18)
                                .attr('height', 18)
                                .style('fill', (d)=>{return d});

                legend.append('text')
                                .attr('x', -5)
                                .attr('y', 12.55)
                                .style('text-anchor', 'end')
                                .style('font-size', 12)
                                .text((d,i)=>{
                                        if ( i===0) return  "Riders with doping allegations"
                                        return  "No doping allegations"
                                })
                                                                
        }
).catch((err) => alert(err));