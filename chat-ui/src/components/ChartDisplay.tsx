import React from 'react';
import ReactECharts from 'echarts-for-react';
import { ChartData } from '../store/chatStore';

interface ChartDisplayProps {
  chartData: ChartData;
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({ chartData }) => {
  const { labels, datasets, type } = chartData;

  const getOption = () => {
    return {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: datasets.map(d => d.label),
        textStyle: {
          color: '#ccc'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: type === 'bar',
        data: labels,
        axisLabel: {
            color: '#ccc'
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
            color: '#ccc'
        }
      },
      series: datasets.map(dataset => ({
        name: dataset.label,
        type: type,
        data: dataset.data,
        itemStyle: {
          color: dataset.color
        },
        smooth: type === 'line',
      })),
      backgroundColor: 'transparent',
    };
  };

  return (
    <div className="w-full h-80 rounded-lg">
      <ReactECharts option={getOption()} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default ChartDisplay;

