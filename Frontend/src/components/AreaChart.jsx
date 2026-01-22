import { Area, AreaChart } from 'recharts';
import { useId } from 'react'
import { RechartsDevtools } from '@recharts/devtools';


const TinyAreaChart = ({ data, stroke, fill }) => {

  const gradientId = useId()

  return (
    <AreaChart
      style={{ width: '100%', height: '100%', aspectRatio: 1.618 }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity={0.6} />
          <stop offset="100%" stopColor={fill} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="total" stroke={stroke} fill={`url(#${gradientId})`} />
      <RechartsDevtools />
    </AreaChart>
  );
};

export default TinyAreaChart