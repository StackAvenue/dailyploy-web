// Build data for a classic bar chart
const data = {};

// Labels are displayed in component, quantities are calculated to define height of each bar
data.dataSet = [{ label: "1 day", value: 53 }];

//Set margins for bar graph within svg element
data.margins = { top: 70, right: 20, bottom: 70, left: 100 };

//Define label of y-axis
// data.yAxisLabel = "My Money!";

// Colors are optional for each bar
// If colors are not given, bars will default to 'steelblue'
data.fill = ["#c5e4ff"];

//Define the width of the svg element on the page
data.width = 1200;

//Define the height of the bar chart
data.height = 500;

// Define tick intervals for y-axis
data.ticks = 10;

//Define a class for the svg element for styling
data.barClass = "bar";

/* EXAMPLE CSS
.bar text {
  font: 14px sans-serif;
  text-anchor: middle;
}
*/

export default data;
