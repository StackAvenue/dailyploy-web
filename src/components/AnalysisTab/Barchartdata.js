import React, { useEffect } from "react";
import Highcharts from "highcharts/highstock";
import { CHART_COLOR } from "../../utils/Constants";
import PropTypes from 'prop-types';
window.Highcharts = Highcharts;


const Barchartdata = (props) => {
  useEffect(() => {
    if (props.barChartData) {
      const data = handleData(props.barChartData)
      loadBarChartdata(data)
    }
  })

  const handleData = (barChartData) => {
    const week1 = barChartData.weekly_completed_tasks[0] ? barChartData.weekly_completed_tasks[0][1] : 0
    const week2 = barChartData.weekly_completed_tasks[1] ? barChartData.weekly_completed_tasks[1][1] : 0
    const week3 = barChartData.weekly_completed_tasks[2] ? barChartData.weekly_completed_tasks[2][1] : 0
    const week4 = barChartData.weekly_completed_tasks[3] ? barChartData.weekly_completed_tasks[3][1] : 0
    const week5 = barChartData.weekly_completed_tasks[4] ? barChartData.weekly_completed_tasks[4][1] : 0
    const total_week1 = barChartData.total_weekly_tasks[0] ? barChartData.total_weekly_tasks[0][1] : 0
    const total_week2 = barChartData.total_weekly_tasks[1] ? barChartData.total_weekly_tasks[1][1] : 0
    const total_week3 = barChartData.total_weekly_tasks[2] ? barChartData.total_weekly_tasks[2][1] : 0
    const total_week4 = barChartData.total_weekly_tasks[3] ? barChartData.total_weekly_tasks[3][1] : 0
    const total_week5 = barChartData.total_weekly_tasks[4] ? barChartData.total_weekly_tasks[4][1] : 0
    const weeklyTasks = [week1, week2, week3, week4, week5]
    const totalWeeklyTasks = [total_week1, total_week2, total_week3, total_week4, total_week5]
    return [
      {
        name: "Total tasks",
        data: totalWeeklyTasks,
        color: CHART_COLOR.scheduled
      },
      {
        name: "Completed tasks",
        data: weeklyTasks,
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, CHART_COLOR.worked_0],
            [1, CHART_COLOR.worked_1]
          ]
        }
      }
    ];
  }

  const loadBarChartdata = (seriesData) => {
    Highcharts.chart('analysisbarchart', {
      chart: {
        type: 'column',
        height: 400,
        zoomType: 'xy',
      },
      credits: {
        enabled: false
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: ['Week-1', 'Week-2', 'Week-3', 'Week-4', 'Week-5']
      },
      yAxis: {
        max: props.barChartData.total_tasks + 2,
        title: {
          text: 'Total Tasks'
        },
        labels: {
          enabled: false
        }
      },
      legend: {
        reversed: true
      },
      plotOptions: {
        column: {
          stacking: "normal",
          dataLabels: {
            enabled: false,
            distance: -10
          },
          showInLegend: false
        },
        series: {
          pointWidth: 60,
          pointHeight: "201",
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, CHART_COLOR.worked_0],
              [1, CHART_COLOR.worked_1]
            ]
          },
          states: {
            hover: {
              brightness: 0.5,
              color: '#f1f1f1'
            }
          },
          dataLabels: {
            enabled: true,
            borderRadius: 5,
            backgroundColor: "#ffffff",
            borderWidth: 1,
            height: "10",
            borderColor: "#AAA",
            y: -6
          }
        }
      },
      series: seriesData
    });



  }

  return (
    <>
      <div id="analysisbarchart"></div>
    </>
  )
}
Barchartdata.propTypes = {
  barChartData: PropTypes.number
}

export default Barchartdata;




































// // Build data for a classic bar chart
// const data = {};

// // Labels are displayed in component, quantities are calculated to define height of each bar
// data.dataSet = [{ label: "1", value: 53 }, { label: "2", value: 40 }, { label: "3", value: 10 }, { label: "4", value: 36 }, { label: "5", value: 24 }, { label: "6", value: 18 }, { label: "7", value: 44 }];



// //Set margins for bar graph within svg element
// data.margins = { top: 70, right: 20, bottom: 70, left: 100 };

// //Define label of y-axis
// data.yAxisLabel = "Sales";
// data.xAxislabel = "days";

// // Colors are optional for each bar
// // If colors are not given, bars will default to 'steelblue'
// data.fill = ["#c5e4ff"];

// //Define the width of the svg element on the page
// data.width = 750;

// //Define the height of the bar chart
// data.height = 400;

// // Define tick intervals for y-axis
// data.ticks = 6;

// //Define a class for the svg element for styling
// data.barClass = "bar";

// /* EXAMPLE CSS
// .bar text {
//   font: 14px sans-serif;
//   text-anchor: middle;
// }
// */

// export default data;
