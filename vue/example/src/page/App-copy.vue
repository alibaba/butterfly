<template>
  <div>
    <button @click="switchColor">switch</button>
    <div class="flowchart-container">
      <butterfly-vue
        ref="butterfly"
        :canvasData="graphData"
        :canvasConf="canvasConfig"
        @onLoaded="onLoaded"
      >
      </butterfly-vue>
    </div>
  </div>
</template>

<script>
// import ButterflyVue from '../../../butterfly-vue.vue';
import {ButterflyVue} from 'butterfly-vue';
import 'butterfly-vue/dist/index.css';

const endpoints = [
  {
    id: "right",
    orientation: [1, 0],
    pos: [0, 0.5],
  },
  {
    id: "left",
    orientation: [-1, 0],
    pos: [0, 0.5],
  },
];

export default {
  name: "base",
  currentCanvas: null,

  components: {
    ButterflyVue,
  },
  data() {
    return {
      colorSwitch: false,

      graphData: {
        groups: [],
        nodes: [],
        edges: [],
      },
      minimap: true,
      canvasConfig: {
        disLinkable: true, // enable disConnect edges
        linkable: true, // enable connect edges
        draggable: true, // enable drag nodes
        zoomable: true, // enable zoom canvas
        layout: {
          type: "dagreLayout",
          options: {
            rankdir: "TB",
            nodestep: 50,
            rankstep: 50,
            controlPoints: false,
          },
        },
        autoResizeRootSize: true, // automatically adapt to the root size, the default is true
        moveable: true, // enable move canvas
        theme: {
          group: {
            type: "normal", // Node group type: normal (drag in and drag out), inner (can only be dragged in and not out)
          },
          edge: {
            type: "Flow", // edge type：Bezier curve，Polyline ，Straight，Manhattan line，Improved Bezier curve。values ： Bezier/Flow/Straight/Manhattan/AdvancedBezier
            label: "", // edge label
            arrow: true, // whether to show arrow
            arrowPosition: 0.5, // arrow position (0 ~ 1)
            arrowOffset: 0.0, // arrow offset
            isExpandWidth: false, // expand line interaction area
            defaultAnimate: false, // turn on line animation by default
          },
          endpoint: {
            position: [], // limit endpoint position ['Top', 'Bottom', 'Left', 'Right'],
            linkableHighlight: true, // point.linkable method is triggered when connecting, can be highlighted
            limitNum: 10, // limit the number of anchor connections
            expandArea: {
              // when the anchor point is too small, the connection hot zone can be expanded.
              left: 10,
              right: 10,
              top: 10,
              bottom: 10,
            },
          },
          zoomGap: 0.001, // mouse zoom in and out gap settings
          autoFixCanvas: {
            // auto expand canvas when drag nodes or edges near the edge of canvas.
            enable: true,
            autoMovePadding: [20, 20, 20, 20],
          },
          autoResizeRootSize: true, // automatically adapt to the root size, the default is true
        },
      },
    };
  },
  methods: {
    onLoaded: function (e) {
      e.canvas.setMinimap(true, {
        height: 100,
        nodeColor: "rgb(234,217,162)",
        activeNodeColor: "rgb(234,162,176)",
      });
      this.$options.currentCanvas = e;
      this.reconstitute();
    },
    reconstitute: function () {
      this.graphData.groups.splice(0);
      this.graphData.nodes.splice(0);
      this.graphData.edges.splice(0);

      this.graphData.nodes.push(this.createNode("1"));
      this.graphData.nodes.push(this.createNode("2"));
      this.graphData.edges.push({
        id: "1.right-2.left",
        sourceNode: "1",
        targetNode: "2",
        source: "right",
        target: "left",
      });
    },
    createNode: function (id) {
      return {
        id: id,
        endpoints: endpoints,
        render: this.createRenderString(),
      };
    },
    createRenderString: function () {
      return (
        `<div class="` +
        (this.colorSwitch ? "graph-node-input1" : "graph-node-input2") +
        `">NODE</div>`
      );
    },
    switchColor: function () {
      this.colorSwitch = !this.colorSwitch;
      // just redraw the last one
      this.graphData.edges.pop();
      this.graphData.nodes.splice(1, 1);
      let node = this.createNode("2");
      this.graphData.nodes.push(node);
      this.graphData.edges.push({
        id: "1.right-2.left",
        sourceNode: "1",
        targetNode: "2",
        source: "right",
        target: "left",
      });
      this.$options.currentCanvas.redraw();
    },
  },
};
</script>

<style>
.flowchart-container {
  background-color: #1d2331;
}
.graph-node-input1 {
  border-radius: 15px;
  border: medium solid #ff7c03;
  background-color: #313336;
  color: #f1f8e9;
  font-family: Poppins, sans-serif;
}

.graph-node-input2 {
  border-radius: 15px;
  border: medium solid #00c019;
  background-color: #313336;
  color: #f1f8e9;
  font-family: Poppins, sans-serif;
}

</style>
