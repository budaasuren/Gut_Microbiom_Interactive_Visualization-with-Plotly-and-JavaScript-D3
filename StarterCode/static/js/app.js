const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

d3.json(url).then(function(data) {
  let values = Object.values(data);
  samples=values[2]
  for (let i = 0; i < samples.length; i++) {
    sample = samples[i];
    let dropdownMenu = d3.select("#selDataset")
    let new_option = dropdownMenu.append("option").text(sample.id)
  };
});


function optionChanged(value) {
  plotter(value)
};

function init() {
  plotter("940")
}; 

function plotter(sample_id) {
  d3.json(url).then(function(data) {

    let values = Object.values(data);
    samples=values[2];
    metadata=values[1];


    for (let i = 0; i < samples.length; i++) {
      
      sample=samples[i]
      
      if (sample.id == sample_id) {
        
        var otu_ids = sample.otu_ids;
        var sample_values = sample.sample_values;
        var otu_labels = sample.otu_labels;

        var yticks = otu_ids.slice(0, 10).map(item => `OTU ${item}`).reverse();
        var xticks = sample_values.slice(0, 10).reverse();
        var labels = otu_labels.slice(0, 10).reverse();

        console.log(yticks);
        console.log(xticks);
        console.log(labels);

        var trace1 = {
            x: xticks,
            y: yticks,
            mode: 'markers', 
            text: labels,
            orientation: 'h',
            type: 'bar'
        };

        var data = [trace1] 

        var layout = {
            title: 'top 10 OTUs Found for the Selected Individual'
        };
        
        Plotly.newPlot('bar', data, layout);

        // bubble chart generation
        var xticksbub = otu_ids;
        var yticksbub = sample_values;
        var labelsbub = otu_labels;

        console.log(xticksbub);
        console.log(labelsbub);
        console.log(yticksbub);

        // plots data
        var trace1 = {
            x: xticksbub,
            y: yticksbub,
            mode: 'markers',
            marker: {
              color: xticksbub,  
              size: yticksbub,
              colorscale: "Earth"
            },
            text: labelsbub
          };
          
        var data = [trace1];
        
        var layout = {
          title: 'All OTUs Found for the Selected Individual',
          xaxis: {
              title: "OTU ID"
          },
          showlegend: false,
          height: 600,
          width: 1200
        };
        
        Plotly.newPlot('bubble', data, layout);
        
        // demographic chart
        var demographic_info = metadata.filter(item => item.id == sample_id);

        console.log(demographic_info);

        var result_info = demographic_info[0];

        // parses out all demografic variables

        var age = result_info.age;
        var bbtype = result_info.bbtype;
        var ethnicity = result_info.ethnicity;
        var gender = result_info.gender;
        var id = result_info.id;
        var location = result_info.location;
        var wfreq = result_info.wfreq;

        // creates the readable formating
        var demoinfo = ` id: ${id} <br> ethnicity: ${ethnicity} <br> gender: ${gender} <br> age: ${age} <br> location: ${location} <br> bbtype: ${bbtype} <br> wfreq: ${wfreq}`
        d3.select("#sample-metadata").html(demoinfo); 
        
        // Wash frequency 
        var data = [
          {
          //   domain: { x: [0, 1], y: [0, 1] },
          
            title: { text: "Belly Button Washing Frequency <br> Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number",
            value: wfreq,
            colorscale: 'Earth', 
          //   delta: { reference: 380 },
            gauge: {
              axis: { range: [null, 9], ticks: 9},
              steps: [
                { range: [0, 1], color: "white" },
                { range: [1, 2], color: "lightgray" },
                { range: [2, 3], color: "rgb(178, 190, 181)" },
                { range: [3, 4], color: "lightyellow" },
                { range: [4, 5], color: "yellow" },
                { range: [5, 6], color: "lightgreen" },
                { range: [6, 7], color: "chartreuse" },
                { range: [7, 8], color: "lightblue" },
                { range: [8, 9], color: "blue" }
              ],
              threshold: {
                line: { color: "red", width: 3 },
                thickness: 1.0,
                value: wfreq
              }
            }
          }
        ];
        
        var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', data, layout);
  }
  }
  })
}; 

init();