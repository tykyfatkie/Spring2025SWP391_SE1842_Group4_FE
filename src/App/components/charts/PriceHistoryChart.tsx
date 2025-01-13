import { ItemPrice } from '@app/models';
import { ResponsiveLine } from '@nivo/line';
import React from 'react';

interface Props {
  priceHistory: ItemPrice[];
}

export const PriceHistoryChart: React.FC<Props> = (props) => {
  const { priceHistory } = props;
  const CustomSymbol = ({ size, color, borderWidth, borderColor }: any) => (
    <g>
      <circle
        fill="#fff"
        r={size}
        strokeWidth={borderWidth}
        stroke={borderColor}
      />
    </g>
  );

  return (
    <ResponsiveLine
      data={[
        {
          id: 'Item',
          data: priceHistory.map((entry) => ({
            x: entry.DateFrom.split('T')[0],
            y: entry.Price,
          })),
          //   [
          //   { x: '2020-02-15', y: 65000 },
          //   { x: '2020-04-13', y: 75000 },
          //   { x: '2020-05-07', y: 86000 },
          //   { x: '2020-06-25', y: 45000 },
          //   { x: '2020-08-10', y: 60000 },
          //   { x: '2020-09-29', y: 120000 },
          //   { x: '2020-10-07', y: 160000 },
          //   { x: '2020-10-30', y: 100000 },
          //   { x: '2020-12-27', y: 70000 },
          //   { x: '2021-02-01', y: 82000 },
          // ],
        },
      ]}
      theme={{
        axis: {
          legend: {
            text: { fontWeight: 'bold', fill: 'rgb(111,111,111)' },
          },
        },
      }}
      pointSymbol={CustomSymbol}
      animate={true}
      margin={{ top: 20, right: 20, bottom: 60, left: 100 }}
      xScale={{
        type: 'time',
        format: '%Y-%m-%d',
        useUTC: false,
        precision: 'day',
      }}
      xFormat="time:%Y-%m-%d"
      yScale={{
        type: 'linear',
        stacked: false,
      }}
      axisLeft={{
        tickSize: 10,
        tickPadding: 10,
        tickRotation: 0,
        legend: `Unit price - VNĐ`,
        legendOffset: -80,
        legendPosition: 'middle',
      }}
      axisBottom={{
        format: '%d/%m/%Y',
        tickValues: 'every day',
        tickSize: 10,
        tickPadding: 20,
      }}
      pointSize={8}
      pointBorderWidth={2}
      pointBorderColor={{
        from: 'color',
        modifiers: [['darker', 0.3]],
      }}
      useMesh={true}
      enableSlices={false}
    />
  );
};
