import { ResponsiveBar } from '@nivo/bar';
import { line } from 'd3-shape';
import React, { Fragment } from 'react';
import './InventoryHistoryChart.less';

export const InventoryHistoryChart = () => {
  const addedColor = '#76AA41';
  const subtractedColor = '#F47560';
  const stockColor = '#ECF5DF';

  const data = [
    {
      period: 'Jan',
      openingStockColor: stockColor,
      added: 100,
      subtracted: 10,
      openingStock: 0,
    },
    {
      period: 'Feb',
      openingStockColor: stockColor,
      added: 50,
      subtracted: 70,
      openingStock: 90,
    },
    {
      period: 'Mar',
      openingStockColor: stockColor,
      added: 0,
      subtracted: 50,
      openingStock: 70,
    },
    {
      period: 'Apr',
      openingStockColor: stockColor,
      added: 40,
      subtracted: 50,
      openingStock: 20,
    },
    {
      period: 'May',
      openingStockColor: stockColor,
      added: 30,
      subtracted: 20,
      openingStock: 10,
    },
    {
      period: 'Jun',
      openingStockColor: stockColor,
      added: 55,
      subtracted: 14,
      openingStock: 20,
    },
    {
      period: 'Jul',
      openingStockColor: stockColor,
      added: 0,
      subtracted: 52,
      openingStock: 61,
    },
    {
      period: 'Aug',
      openingStockColor: stockColor,
      added: 70,
      subtracted: 47,
      openingStock: 9,
    },
    {
      period: 'Sep',
      openingStockColor: stockColor,
      added: 20,
      subtracted: 60,
      openingStock: 32,
    },
  ];

  const AddedLine = ({ bars, xScale, yScale }: any) => {
    const lineGenerator = line<any>()
      .x((bar) => xScale(bar.data.indexValue) + bar.width / 2)
      .y((bar) => yScale(bar.data.data.added ?? 0));

    return (
      <Fragment>
        <path
          d={lineGenerator(bars) ?? undefined}
          fill="none"
          stroke={addedColor}
          strokeWidth={2}
          style={{ pointerEvents: 'none' }}
        />
        {bars.map((bar: any) => (
          <circle
            key={bar.key}
            cx={xScale(bar.data.indexValue) + bar.width / 2}
            cy={yScale(bar.data.data.added ?? 0)}
            r={8}
            fill="white"
            stroke={addedColor}
            strokeWidth={2}
            style={{ pointerEvents: 'none' }}
          />
        ))}
      </Fragment>
    );
  };

  const SubtractedLine = ({ bars, xScale, yScale }: any) => {
    const lineGenerator = line<any>()
      .x((bar) => xScale(bar.data.indexValue) + bar.width / 2)
      .y((bar) => yScale(bar.data.data.subtracted ?? 0));

    return (
      <Fragment>
        <path
          d={lineGenerator(bars) ?? undefined}
          fill="none"
          stroke={subtractedColor}
          strokeWidth={2}
          style={{ pointerEvents: 'none' }}
        />
        {bars.map((bar: any) => (
          <circle
            key={bar.key}
            cx={xScale(bar.data.indexValue) + bar.width / 2}
            cy={yScale(bar.data.data.subtracted ?? 0)}
            r={8}
            fill="white"
            stroke={subtractedColor}
            strokeWidth={2}
            style={{ pointerEvents: 'none' }}
          />
        ))}
      </Fragment>
    );
  };

  const maxValue = () => {
    const addedValue = data.map((e) => e.added);
    const subtractedValue = data.map((e) => e.subtracted);
    const stockValue = data.map((e) => e.openingStock);
    return Math.max(...addedValue, ...subtractedValue, ...stockValue);
  };

  const Tooltip = (data: any) => {
    return (
      <div className="inventory-history-chart-tooltip">
        <div className="line">
          <div className="indicator"></div>
          <p className="name">Opening stock:</p>
          <p className="content">{data.data.openingStock ?? 0}</p>
        </div>
        <div className="line">
          <div className="indicator"></div>
          <p className="name">Added:</p>
          <p className="content">{data.data.added ?? 0}</p>
        </div>
        <div className="line">
          <div className="indicator"></div>
          <p className="name">Subtracted:</p>
          <p className="content">{data.data.subtracted ?? 0}</p>
        </div>
      </div>
    );
  };

  return (
    <ResponsiveBar
      data={data}
      keys={['openingStock']}
      indexBy="period"
      margin={{ top: 40, right: 40, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={({ id, data }) => String(Object(data)[`${id}Color`])}
      theme={{
        labels: { text: { fontWeight: 'bold', fontSize: 13 } },
        axis: {
          legend: {
            text: { fontWeight: 'bold', fill: 'rgb(111,111,111)' },
          },
        },
      }}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Unit',
        legendPosition: 'middle',
        legendOffset: -40,
      }}
      enableLabel={false}
      layers={[
        'grid',
        'axes',
        'bars',
        AddedLine,
        SubtractedLine,
        'markers',
        // 'legends',
      ]}
      tooltip={Tooltip}
      minValue={0}
      maxValue={maxValue()}
    />
  );
};
