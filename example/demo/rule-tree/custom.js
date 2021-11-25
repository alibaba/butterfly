import React, {useEffect} from 'react';
import {Select} from 'antd';
const options = [
  {value: '半年内企业经营异常记录数'},
  {value: '大于 5'},
  {value: '小于或等于 5'},
  {value: '企业是否吊销'},
  {value: '等于 否'},
  {value: '赋值 xxx'},
  {value: '等于 是'}
];
export default ({node, canvas}) => {
  return <div
    className="custom-node"
  >
    <span className="icon" />
    <span>
      <Select defaultValue={node.text} options={options} onChange={() => {
        setTimeout(() => {
          canvas.redraw();
        });
      }} ></Select>
    </span>
  </div>;
};
