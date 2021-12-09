# 布局
<p align="center">
  <img width="900" src="https://img.alicdn.com/imgextra/i4/O1CN01pYwnbh1gGiUMaUIKm_!!6000000004115-2-tps-1418-2839.png">
</p>


## Force Layout

&nbsp;&nbsp;&nbsp;&nbsp;力导向图布局作为较早被发明的一种实际应用布局算法，经过研究者多年改进、扩展，已发展成为一类算法的集合。该类算法的特点是模拟物理世界中的作用力，施加在节点上，并迭代计算以达到合理放置节点、美观布局的一类算法。

#### 代码演示

``` js
this.canvas = new Canvas({
  layout: {
    type: 'forceLayout',
    options: {
      link: {
        // 线条的距离
        distance: 50,
        // 线条的粗细
        strength: 1
      }
    },
  }
});

```


## Dagre Layout

&nbsp;&nbsp;&nbsp;&nbsp;Dagre 是适合有向流程图的布局算法。其根据图数据中边的方向，自动计算节点的层级及位置。

#### 代码演示

``` js
this.canvas = new Canvas({
  layout: {
    type: 'dagreLayout',
    options: {
      rankdir: 'TB',
      nodesep: 40,
      ranksep: 40,
      controlPoints: false,
    },
  }
});
```

#### API


| 名称 | 类型 | 是否必须 | 默认值 | 可选值 | 说明  
| :------ | :------ | :------ | :------ | :------ | :------
| rankdir | String | false | TB| "TB/BT/LR/RL"  |布局的方向。T：top（上）；B：bottom（下）；L：left（左）；R：right（右）。
| align | String | false | 'UL'| 'UL' / 'UR' / 'DL' / 'DR' | 节点对齐方式。U：upper（上）；D：down（下）；L：left（左）；R：right（右）
| nodesep | Number | false | 50 |  | 节点间距（px）。在rankdir 为 'TB' 或 'BT' 时是节点的水平间距；在rankdir 为 'LR' 或 'RL' 时代表节点的竖直方向间距
| ranksep | Number | false | 50 |  | 层间距（px）。在rankdir 为 'TB' 或 'BT' 时是竖直方向相邻层间距；在rankdir 为 'LR' 或 'RL' 时代表水平方向相邻层间距
| controlPoints | Boolean | false | false | |  是否保留布局连线的控制点


## Dagre Group Layout

&nbsp;&nbsp;&nbsp;&nbsp;Dagre 是适合有向流程图的布局算法。其根据图数据中边的方向，自动计算节点的层级及位置。

#### 代码演示

``` js
this.canvas = new Canvas({
  layout: {
    type: 'dagreGroupLayout',
    options: {
      rankdir: 'TB',
      nodesep: 40,
      ranksep: 40,
      controlPoints: false,
    },
  }
});
```

#### API


| 名称 | 类型 | 是否必须 | 默认值 | 可选值 | 说明  
| :------ | :------ | :------ | :------ | :------ | :------
| rankdir | String | false | TB| "TB/BT/LR/RL"  |布局的方向。T：top（上）；B：bottom（下）；L：left（左）；R：right（右）。
| align | String | false | 'UL'| 'UL' / 'UR' / 'DL' / 'DR' | 节点对齐方式。U：upper（上）；D：down（下）；L：left（左）；R：right（右）
| nodesep | Number | false | 50 |  | 节点间距（px）。在rankdir 为 'TB' 或 'BT' 时是节点的水平间距；在rankdir 为 'LR' 或 'RL' 时代表节点的竖直方向间距
| ranksep | Number | false | 50 |  | 层间距（px）。在rankdir 为 'TB' 或 'BT' 时是竖直方向相邻层间距；在rankdir 为 'LR' 或 'RL' 时代表水平方向相邻层间距
| controlPoints | Boolean | false | false | |  是否保留布局连线的控制点

## Grid Layout

&nbsp;&nbsp;&nbsp;&nbsp;Grid 网格布局根据参数指定的排序方式对节点进行排序后，将节点排列在网格上。

#### 代码演示

``` js
import {Canvas} from 'butterfly-dag';
this.canvas = new Canvas({
  layout: {
    type: 'grid',
    options: {
      // group的渲染方法
      width: 150,
      // 布局画布总长度
      height: 100,
      // 布局相对起始点
      begin: [0, 0],
      // prevents node overlap, may overflow boundingBox if not enough space
      preventOverlap: true,
      // extra spacing around nodes when preventOverlap: true
      preventOverlapPadding: 10,
      // uses all available space on false, uses minimal space on true
      condense: false,
      //行数
      rows: undefined,
      // 列数
      cols: undefined,
      // 排序方式 
      sortBy: 'degree',
      nodeSize: 30,
    },
  }
});
```

#### API


| 名称 | 类型 | 是否必须 | 默认值 | 说明  
| :------ | :------ | :------ | :------ | :------ 
| begin | Array | false | [0,0] | 格开始位置（左上角）
| preventOverlap | Boolean | false | false | 是否防止重叠，必须配合下面属性 nodeSize，只有设置了与当前图节点大小相同的 nodeSize 值，才能够进行节点重叠的碰撞检测
| nodeSize | Number | false | 30 |  节点大小（直径）。用于防止节点重叠时的碰撞检测
| preventOverlapPadding | Number | false | 10 | 避免重叠时节点的间距 padding。preventOverlap 为 true 时生效
| rows | Number | false | undefined |  网格的行数，为 undefined 时算法根据节点数量、布局空间、cols（若指定）自动计算
| cols | Number | false | undefined | 网格的列数，为 undefined 时算法根据节点数量、布局空间、rows（若指定）自动计算
| sortBy | String | false | undefined | 指定排序的依据（节点属性名），数值越高则该节点被放置得越中心。若为 undefined，则会计算节点的度数，度数越高，节点将被放置得越中心


## Fruchterman Layout

&nbsp;&nbsp;&nbsp;&nbsp;Fruchterman Reingold 布局算法在原理上而言属于力导向布局算法。

#### 代码演示

``` js
import {Canvas} from 'butterfly-dag';
 this.canvas = new Canvas({
      layout: {
        type: 'fruchterman',
        options: {
          // 布局画布总宽度
          width: 500,
          // 布局画布总长度
          height: 500,
          /** 停止迭代的最大迭代数 */
          // maxIteration: 1000,
          /** 布局中心 */
          center: [250, 250],
          /** 重力大小，影响图的紧凑程度 */
          gravity: 5,
          /** 速度 */
          speed: 5,
          /** 是否产生聚类力 */
          clustering: true,
          /** 聚类力大小 */
          clusterGravity: 8,
          link: {
              // 线条的距离
              distance: 50,
              // 线条的粗细
              strength: 1
          }
        },
      },
      theme: {
        edge: {
          type: 'Straight', // 线条类型
          arrow: true, // 是否有箭头
          arrowPosition: 0.8, // 箭头位置
        }
      }
    });
```

#### API


| 名称 | 类型 | 是否必须 | 默认值 | 说明  
| :------ | :------ | :------ | :------ | :------ 
| center | Array | false | [0,0] | 布局的中心
| maxIteration | Number | false | 1000 | 最大迭代次数
| gravity | Number | false | 10 |  重力的大小，影响布局的紧凑程度
| speed | Number | false | 1 | 每次迭代节点移动的速度。速度太快可能会导致强烈震荡
| clustering | Boolean | false | false |  是否按照聚类布局
| clusterGravity | Number | false | 10 | 聚类内部的重力大小，影响聚类的紧凑程度，在 clustering 为 true 时生效


## Concentric Layout

&nbsp;&nbsp;&nbsp;&nbsp;Concentric 同心圆布局将所有节点放置在同心圆上。

#### 代码演示

``` js
import {Canvas} from 'butterfly-dag';
 this.canvas = new Canvas({
      layout: {
        type: 'fruchterman',
        options: {
          maxLevelDiff: 0.5,
          sortBy: 'degree',
          minNodeSpacing: 40,
          preventOverlap: true,
        },
      },
    });
```

#### API


| 名称 | 类型 | 是否必须 | 默认值 | 说明  
| :------ | :------ | :------ | :------ | :------ 
| center | Array | false | [0,0] | 布局的中心
| preventOverlap | Boolean | false | false | 是否防止重叠，必须配合下面属性 nodeSize，只有设置了与当前图节点大小相同的 nodeSize 值，才能够进行节点重叠的碰撞检测
| nodeSize | Number | false | 30 |  节点大小（直径）。用于防止节点重叠时的碰撞检测
| minNodeSpacing | Number | false | 10 | 环与环之间最小间距，用于调整半径
| sweep | Number | false | undefined |  第一个节点与最后一个节点之间的弧度差。若为 undefined ，则将会被设置为  2 _ Math.PI _ (1 - 1 / |level.nodes|) ，其中 level.nodes 为该算法计算出的每一层的节点，|level.nodes| 代表该层节点数量
| equidistant | Boolean | false | false | 环与环之间的距离是否相等
| startAngle | Number | false | 3 / 2 * Math.PI | 开始方式节点的弧度 
| clockwise | Boolean | false | false | 是否按照顺时针排列
| maxLevelDiff | Number | false | undefines | 每一层同心值的求和。若为 undefined，则将会被设置为 maxValue / 4 ，其中 maxValue 为最大的排序依据的属性值。例如，若 sortBy 为 'degree'，则 maxValue 为所有节点中度数最大的节点的度数
| sortBy | String | false | undefined | 指定排序的依据（节点属性名），数值越高则该节点被放置得越中心。若为 undefined，则会计算节点的度数，度数越高，节点将被放置得越中心。


## Radial Layout

&nbsp;&nbsp;&nbsp;&nbsp;Radial 布局是将图布局成辐射状的布局方法。以一个 focusNode 为中心，其余节点按照与 focusNode 的度数关系排列在不同距离的环上。距离 focusNode 一度的节点布局在与其最近的第一个环上，距离 focusNode 二度的节点布局在第二个环上，以此类推。

#### 代码演示

``` js
this.canvas = new Canvas({
  layout: {
    type: 'Radial',
    options: {
      // 布局画布总宽度
      width:800,
      // 布局画布总长度
      height:800,
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
      /** 是否必须是严格的 radial 布局，即每一层的节点严格布局在一个环上。preventOverlap 为 true 时生  */
      strictRadial: true,
      /** 防止重叠步骤的最大迭代次数 */
      maxPreventOverlapIteration: 200,
      link: {
          // 线条的距离
          distance: 50,
          // 线条的粗细
          strength: 1
      },
    },
  }
});
```

#### API


| 名称 | 类型 | 是否必须 | 默认值 | 说明  
| :------ | :------ | :------ | :------ | :------ 
| center | Array | false | [0,0] | 布局的中心
| maxIteration | Number | false | 1000 | 停止迭代的最大迭代数
| focusNode | String/Object | false | null | 辐射的中心点，默认为数据中第一个节点。可以传入节点 id 或节点本身
| unitRadius | Number | false | 100 | 每一圈距离上一圈的距离。默认填充整个画布，即根据图的大小决定
| linkDistance | Number | false | 50 | 默认边长度
| preventOverlap | Boolean | false | false | 是否防止重叠，必须配合下面属性 nodeSize ，只有设置了与当前图节点大小相同的 nodeSize 值，才能够进行节点重叠的碰撞检测
| nodeSize | Number | false | 10 | 节点大小（直径, 用于防止节点重叠时的碰撞检测)
| strictRadial | Boolean | false | true | 是否必须是严格的 radial 布局，即每一层的节点严格布局在一个环上。preventOverlap 为 true 时生效。当 preventOverlap 为 true，且 strictRadial 为 false 时，有重叠的节点严格沿着所在的环展开，但在一个环上若节点过多，可能无法完全避免节点重叠。当 preventOverlap 为 true，且 strictRadial 为 true 时，允许同环上重叠的节点不严格沿着该环布局，可以在该环的前后偏移以避免重叠。
| maxPreventOverlapIteration | Number | false | 200 | 防止重叠步骤的最大迭代次数


## Tree Layout

&nbsp;&nbsp;&nbsp;&nbsp;参考：[antvis/hierarchy](https://github.com/antvis/hierarchy)

### compactBox

``` js
// 当canvas为TreeCanvas时Node可选TreeNode;
import {TreeCanvas} from 'butterfly-dag';
this.canvas = new TreeCanvas({
  layout: {
    type: 'compactBox',
    options: {
      direction: 'TB', // H / V / LR / RL / TB / BT
      getHeight(d) {
        return 60;
      },
      getWidth(d) {
        return 120;
      },
      getHGap(d) {
        return 20;
      },
      getVGap(d) {
        return 80;
      }
    },
  }
});
```

### dendrogram

``` js
// 当canvas为TreeCanvas时Node可选TreeNode;
import {TreeCanvas} from 'butterfly-dag';
this.canvas = new TreeCanvas({
  layout: {
    type: 'dendrogram',
    options: {
      direction: 'TB', // H / V / LR / RL / TB / BT
      getHeight(d) {
        return 60;
      },
      getWidth(d) {
        return 120;
      },
      getHGap(d) {
        return 20;
      },
      getVGap(d) {
        return 80;
      }
    },
  }
});
```

### indented

``` js
// 当canvas为TreeCanvas时Node可选TreeNode;
import {TreeCanvas} from 'butterfly-dag';
this.canvas = new TreeCanvas({
  layout: {
    type: 'indented',
    options: {
      direction: 'H', // H / LR / RL
      getHeight(d) {
        return 60;
      },
      getWidth(d) {
        return 120;
      },
      getHGap(d) {
        return 20;
      },
      getVGap(d) {
        return 80;
      }
    },
  }
});
```

### mindmap

``` js
// 当canvas为TreeCanvas时Node可选TreeNode;
import {TreeCanvas} from 'butterfly-dag';
this.canvas = new TreeCanvas({
  layout: {
    type: 'mindmap',
    options: {
      direction: 'H',                   // H / LR / RL
      getSide(d) {
        return d.data.side || 'right';  // `left` or right
      },
      getHeight(d) {
        return 10;
      },
      getWidth(d) {
        return 40;
      },
      getHGap(d) {
        return 50;
      },
      getVGap(d) {
        return 20;
      }
    },
  }
});
```
