<template>
  <div class="butterfly-vue" :class="className">
    <div class="butterfly-vue-container" ref="canvas-dag"></div>
  </div>
</template>

<script>
import "butterfly-dag/dist/index.css";
import "./butterfly-vue.css";
import { Canvas } from "butterfly-dag";
import { defaultOptions } from "./util/default-data";
import {
  processNodes,
  processEdge,
  processGroups,
} from "./util/process";


import recalc from "./util/re-calc";
import relayout from "./util/re-layout";


export default {
  name: "butterfly-vue",
  props: {
    className: {
      type: String,
    },
    baseCanvas: {
      type: Function,
      default: Canvas,
    },
    canvasConf: {
      type: Object,
      default: () => {
        return defaultOptions;
      },
    },
    canvasData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      canvas: null,
      nodes: this.canvasData.nodes,
      groups: this.canvasData.groups,
      edges: this.canvasData.edges,
    };
  },
  methods: {
    //初始化
    initCanvas() {
      const root = this.$refs["canvas-dag"];
      if (!root) {
        console.warn("当前canvas没有绑定dom节点，无法渲染");
        return;
      } else {
        this.canvasConf.root = root;
        this.canvas = new this.baseCanvas(this.canvasConf);
      }
    },

    //更新画布信息
    updateCavans() {
      if (!this.canvas) {
        console.warn("当前canvas为null，初始化存在问题");
        return;
      }

      const oldNodes = this.canvas.nodes;
      const oldEdges = this.canvas.edges;
      const oldGroups = this.canvas.groups;

      processGroups(this.canvas, this.groups, oldGroups);
      processNodes(this.canvas, this.nodes, oldNodes);
      processEdge(this.canvas, this.edges, oldEdges);
    },

    //重新计算节点和边的位置
    re() {
      if (!this.canvas) {
        console.warn("当前canvas为null，初始化存在问题");
        return;
      }

      recalc(this.canvas);
      relayout(this.canvas);
    },

    onCreateEdge(data) {
      let edgeInfo = {
        sourceEndpointId: data.links[0].sourceEndpoint.id,
        sourceNodeId: data.links[0].sourceNode.id,
        targetEndpointId: data.links[0].targetEndpoint.id,
        targetNodeId: data.links[0].targetNode.id,
      };
      this.$emit("onCreateEdge", edgeInfo);
    },

    onDeleteEdge(data) {
      let edgeInfo = {
        sourceEndpointId: data.links[0].sourceEndpoint.id,
        sourceNodeId: data.links[0].sourceNode.id,
        targetEndpointId: data.links[0].targetEndpoint.id,
        targetNodeId: data.links[0].targetNode.id,
      };
      this.$emit("onDeleteEdge", edgeInfo);
    },

    onChangeEdges(data) {
      let edgeInfo = {
        addLink: {
          sourceEndpointId: data.addLinks[0].sourceEndpoint.id,
          sourceNodeId: data.addLinks[0].sourceNode.id,
          targetEndpointId: data.addLinks[0].targetEndpoint.id,
          targetNodeId: data.addLinks[0].targetNode.id,
        },
        delLinks: {
          sourceEndpointId: data.delLinks[0].sourceEndpoint.id,
          sourceNodeId: data.delLinks[0].sourceNode.id,
          targetEndpointId: data.delLinks[0].targetEndpoint.id,
          targetNodeId: data.delLinks[0].targetNode.id,
        },
        info: data.info,
      };
      this.$emit("onChangeEdges", edgeInfo);
    },
    onOtherEvent(data) {
      this.$emit("onOtherEvent",data);
    },
  },

  watch: {
    canvasData: {
      handler(newValue) {
        this.nodes = newValue.nodes;
        this.groups = newValue.groups;
        this.edges = newValue.edges;
        this.updateCavans();
        this.re();
      },
      deep: true,
    },
  },
  mounted() {
    this.initCanvas();

    if (!this.canvas) {
      console.warn("当前canvas为null，初始化存在问题");
      return;
    }

    this.updateCavans();

    this.re();

    this.$emit("onLoaded", this.canvas);

    this.canvas.on("events", (data) => {
      if (data.type === "link:connect") {
        this.onCreateEdge(data);
      } else if (data.type === "links:delete" && data.links.length > 0) {
        this.onDeleteEdge(data);
      } else if (data.type === "link:reconnect") {
        this.onChangeEdges(data);
      } else {
        this.onOtherEvent(data);
      }
    });
  },
};
</script>

<style></style>
