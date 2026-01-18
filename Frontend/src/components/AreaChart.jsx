import { Area, AreaChart } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';


const TinyAreaChart = ({data}) => {
  return (
    <AreaChart
      style={{ width: '100%', height: '90%', aspectRatio: 1.618 }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" />
      <RechartsDevtools />
    </AreaChart>
  );
};

export default TinyAreaChart