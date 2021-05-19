<template>
  <div style="padding: 20px">
    <div style="margin-bottom: 20px">
      <el-button @click="showData">查看数据</el-button>
      <el-button @click="handleAddNode">添加节点（默认根节点）</el-button>
    </div>
    <butterfly-vue
      ref="bv"
      :canvasConf="canvasConf"
      :canvasData="mockData"
      :baseCanvas="baseCanvas"
      @onCreateEdge="logEvent"
      @onChangeEdges="logEvent"
      @onDeleteEdge="logEvent"
      @onOtherEvent="logEvent"
      @onLoaded="finishLoaded"
    />
  </div>
</template>

<script>
import mockData, { endpoints } from './data';
import { TreeCanvas } from 'butterfly-dag';
import { v4 as uuidv4 } from 'uuid';
import { ButterflyVue } from '../../../../index'
import BaseNode from './BaseNode.vue';

export default {
  components: {
    ButterflyVue
  },
  data() {
    const canvasConf = {
      disLinkable: false, // 可删除连线
      linkable: true, // 可连线
      draggable: true, // 可拖动
      zoomable: true, // 可放大
      moveable: true, // 可平移
      theme: {
        // 主题定制(可传)
        group: {
          type: 'normal', // 节点组类型(可传): normal(随意拖入拖出),inner(只能拖入不能拖出)
        },
        edge: {
          shapeType: 'Manhattan', // 线条默认类型：贝塞尔曲线，折线，直线，曼哈顿路由线，更美丽的贝塞尔曲线。分别为Bezier/Flow/Straight/Manhattan/AdvancedBezier
          // label: "test", // 线条默认label
          arrow: true, // 线条默认是否带箭头
          arrowPosition: 0.5, // 箭头位置(0 ~ 1)
          arrowOffset: 0.0, // 箭头偏移
          // Class: XXClass, // 自己拓展的class,拖动连线的时候会采用该拓展类
          isExpandWidth: false, // 增加线条交互区域
          defaultAnimate: false, // 默认开启线条动画
        },
        endpoint: {
          position: [], // 限制锚点位置['Top', 'Bottom', 'Left', 'Right'],
          linkableHighlight: true, // 连线时会触发point.linkable的方法，可做高亮
          limitNum: 10, // 限制锚点的连接数目
          expandArea: {
            // 锚点过小时，可扩大连线热区
            left: 10,
            right: 10,
            top: 10,
            botton: 10,
          },
        },
        zoomGap: 0.001, // 鼠标放大缩小间隙设置
        autoFixCanvas: {
          // 节点拖动或连线拖动到画布边缘时，画布自动延展
          enable: false,
          autoMovePadding: [20, 20, 20, 150], // 触发自动延展的画布内边距
        },
        autoResizeRootSize: true, // 自动适配root大小，默认为true
      },
      global: {
        // 自定义配置，会贯穿所有canvas，group，node，edge，endpoint对象
        isScopeStrict: false, // scope是否为严格模式(默认为false)
      },
      layout: {
        type: 'indented',
        isFlatNode: true,
        options: {
          direction: 'LR', // H / V / LR / RL / TB / BT   https://github.com/antvis/hierarchy (V, TB, BT 不可用)
          isHorizontal: true,
          indent: 100, // 水平间隔
          getHeight: function getHeight() {
            return 40;
          },
          getWidth: function getWidth() {
            return 16;
          },
        },
      },
    };
    return {
      mockData,
      canvasConf,
      baseCanvas: TreeCanvas,
    };
  },
  watch: {
    mockData: {
      handler(val) {
        console.log(val);
      },
      deep: true,
    },
  },
  computed: {
    canvas() {
      return this.$refs.bv && this.$refs.bv.canvas;
    },
  },
  mounted() {
    // console.log(this.$refs.bv.re())
  },
  methods: {
    logEvent(e) {
      // console.log(e)
    },
    finishLoaded(canvans) {
      console.log(canvans);
      console.log('finish');
    },
    showData() {
      console.log(this.$refs.bv);
      console.log(this.mockData);
    },
    handleAddNode(parentId = '0') {
      let id = uuidv4();
      // addNode，removeNode可以还需要重写下
      this.mockData.nodes.children.push({
        id,
        parentId,
        condition: 'and',
        render: BaseNode,
        desc: '近X个月X万元交易次数',
        value: `近<"name":"param.month","type":"text","code":"month">个月交易金额超过<"name":"param.money","type":"number">元的交易次数`,
        endpoints,
      });
      this.mockData.edges.push({
        id: parentId + '-' + id,
        source: 'bottom',
        target: 'left',
        sourceNode: '0',
        targetNode: id,
        type: 'endpoint',
      });
    },
  },
};
</script>

<style>
</style>
