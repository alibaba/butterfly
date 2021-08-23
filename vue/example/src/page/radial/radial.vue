<template>
  <div>
    <butterfly-vue
      :canvasData="mockData"
      :canvasConf="canvasConfig"
      @onLoaded="finishLoaded"
      className='radial'
      key="radial"
    />
  </div>
</template>

<script>

import {ButterflyVue} from '../../../../index.js';

import mockData from "./radial-mockData.js";

export default {
  name: 'Grid',
  components: {
    ButterflyVue,
  },
  data(){
    return{
      mockData,
      canvasConfig:{
        disLinkable: true, // 可删除连线
        linkable: false,    // 可连线
        draggable: true,   // 可拖动
        zoomable: true,    // 可放大
        moveable: true,    // 可平移
        layout: {
          type: 'radial',
          options: {
            // 布局画布总宽度
            width: 800,
            // 布局画布总长度
            height: 800,
            /** 停止迭代的最大迭代数 */
            maxIteration: 200,
            /** 布局中心 */
            center: [400, 400],
            /** 中心点，默认为数据中第一个点 */
            focusNode: '0',
            /** 每一圈半径 */
            unitRadius: 80,
            /** 默认边长度 */
            linkDistance: 100,
            /** 是否防止重叠 */
            preventOverlap: true,
            /** 节点直径 */
            nodeSize: 20,
            /** 节点间距，防止节点重叠时节点之间的最小距离（两节点边缘最短距离） */
            nodeSpacing: undefined,
            /** 是否必须是严格的 radial 布局，即每一层的节点严格布局在一个环上。preventOverlap 为 true 时生效 */
            strictRadial: true,
            /** 防止重叠步骤的最大迭代次数 */
            maxPreventOverlapIteration: 200,
            link: {
              // 线条的距离
              distance: 10,
              // 线条的粗细
              strength: 1
            },
          },
        },
      },
      canvansRef:{},
      butterflyVue: {},
      nodeIndex: 0,
    }
  },
  methods:{
    finishLoaded(VueCom) {
      this.butterflyVue = VueCom;
      this.canvansRef = VueCom.canvas;
      console.log("finish");
    },
  }
}
</script>

<style>
  .radial {
    height: 700px;
    min-width: 500px;
    width: 100%;
    display: block;
    position: relative;
  }
</style>
