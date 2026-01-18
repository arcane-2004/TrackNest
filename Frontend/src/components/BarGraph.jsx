// import { BarChart, Bar } from 'recharts';
// import { RechartsDevtools } from '@recharts/devtools';

// const TinyBarChart = ({data}) => {
//   return (
//     <BarChart
//       style={{ width: '100%', height: "90%", aspectRatio: 1.618 }}
//       responsive
//       data={data}
//     >
//       <Bar dataKey="total" fill="#8884d8" />
//       <RechartsDevtools />
//     </BarChart>
//   );
// };

// export default TinyBarChart;






import { ComposedChart, Line, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';


const SameDataComposedChart = ({ data }) => {

    const dataMap = data.map((item) => ({
        ...item,
        date: new Date(item.date).getDate()
    }));

    return (
        <ComposedChart
            style={{ width: '100%', maxWidth: '700px', height:'100%', aspectRatio: 1.618 }}
            responsive
            data={dataMap}
            margin={{
                top: 20,
                right: 0,
                bottom: 0,
                left: 0,
            }}
        >
            {/* <CartesianGrid stroke="#f5f5f5" /> */}
            {/* <XAxis dataKey="date" scale="band" /> */}
            {/* <YAxis width="auto" /> */}
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="total" fill="#8884d8" stroke="#8884d8" />
            <Bar dataKey="total" barSize={4} fill="#f13ea1" />
            {/* <Line type="monotone" dataKey="total" stroke="#ff7300" /> */}
            <RechartsDevtools />
        </ComposedChart>
    );
};

export default SameDataComposedChart