import React, { useState, useEffect } from "react";
import { Line, Pie, Column } from '@ant-design/charts';
import { Tab, TabPane } from "semantic-ui-react";
import { BasicModal } from "../../../components/Shared";
import { UserForm, ListUsers } from "../../../components/Admin/Users";
import { useAuth } from "../../../hooks";
import { isAdmin, hasPermission } from "../../../utils/checkPermission";
import { ErrorAccessDenied } from "../Error";

export function Dashboard() {

  const panes = [
    {
      menuItem: 'Tab 1',
      render: () => <TabPane attached={false}> <Line {...config} /> </TabPane>,
    },
    {
      menuItem: 'Tab 2',
      render: () => <TabPane attached={false}><Pie {...config2} /></TabPane>,
    },
    {
      menuItem: 'Tab 3',
      render: () => <TabPane attached={false}><Column {...config3} /></TabPane>,
    },
  ]
  
 
  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
  ];

  const config = {
    data,
    height: 400,
    xField: 'year',
    yField: 'value',
  };

  const config2 = {
  data: [
    { type: 'opcion 1', value: 27 },
    { type: 'opcion 2', value: 25 },
    { type: 'opcion 3', value: 18 },
    { type: 'opcion 4', value: 15 },
    { type: 'opcion 5', value: 10 },
    { type: 'opcion 6', value: 5 },
  ],
  angleField: 'value',
  colorField: 'type',
  label: {
    text: 'value',
    style: {
      fontWeight: 'bold',
    },
  },
  legend: {
    color: {
      title: false,
      position: 'right',
      rowPadding: 5,
    },
  },
};


const data2 = [
   0.16 ,
   0.125 ,
  0.24,
  0.19 ,
  0.22 ,
  0.05,
  0.01,
  0.015,
];

  const config3 = {
    data: data2.map((value) => ({
      index: value.toString(),
      value,
    })),
    xField: 'index',
    yField: 'value',
  }

return (
  <>
   <Tab menu={{ pointing: true }} panes={panes} />
  </>)
}
