import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


type Point = { t: string; v: number };

const RechartClient = ({data}: {data:Point[]}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
       
      >
        <XAxis dataKey="t" hide />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="v" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default RechartClient