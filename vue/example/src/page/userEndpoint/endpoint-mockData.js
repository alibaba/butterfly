import endpointNode from './node/endpoint-node.vue';

export default {
  groups: [],
  nodes: [
    {
      id: '1',
      top: 25,
      left: 10,
      render: endpointNode,
      userData: {
        endpoints: ['1']
      },
    },
    {
      id: '2',
      top: 25,
      left: 300,
      render: endpointNode,
      userData: {
        endpoints: ['1', '3']
      },
    },
    {
      id: '3',
      top: 25,
      left: 600,
      render: endpointNode,
      userData: {
        endpoints: ['2']
      },
    },
    {
      id: '4',
      top: 250,
      left: 10,
      render: endpointNode,
      userData: {
        endpoints: ['4']
      },
    },
    {
      id: '5',
      top: 250,
      left: 300,
      render: endpointNode,
      userData: {
        endpoints: ['5']
      },
    },
  ],
  edges: [
    {
      id: '1.bf_endpoint_1-2.bf_endpoint_1',
      sourceNode: '1',
      targetNode: '2',
      source: 'bf_endpoint_1',
      target: 'bf_endpoint_1',
      render: '<div>测试label</div>'
    },
    {
      id: '2.bf_endpoint_1-2.bf_endpoint_3',
      sourceNode: '2',
      targetNode: '2',
      source: 'bf_endpoint_1',
      target: 'bf_endpoint_3',
      render: '<div>测试label</div>'
    },
    {
      id: '4.bf_endpoint_4-5.bf_endpoint_5',
      sourceNode: '4',
      targetNode: '5',
      source: 'bf_endpoint_4',
      target: 'bf_endpoint_5',
      render: '<div>测试label</div>'
    }
  ],
};
