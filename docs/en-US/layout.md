# Auto Layout
<p align="center">
  <img width="900" src="https://img.alicdn.com/imgextra/i4/O1CN01pYwnbh1gGiUMaUIKm_!!6000000004115-2-tps-1418-2839.png">
</p>


## Force Layout
&nbsp;&nbsp;&nbsp;&nbsp;Force-directed layout is a set of algorithms which are improved and extended by lots of researchers based on the earliest classical force-directed algorithm. They simulate the nodes and edges in the graph as the physical objects. There are attractive forces and repulsive forces between nodes to iteratively move them to reach a reasonable layout.


#### Examples

``` js
this.canvas = new Canvas({
  layout: {
    type: 'forceLayout',
    options: {
      link: {
        // link distance
        distance: 50,
        // link strength
        strength: 1
      }
    },
  }
});

```


## Dagre Layout

&nbsp;&nbsp;&nbsp;&nbsp;Dagre Layout is an appropriate layout method for directed flow graph.It will calculate the levels and positions of nodes automatically according to the edge directions in the data. 

#### Examples

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


| name | Type | Required | Default | Options | Description  
| :------ | :------ | :------ | :------ | :------ | :------
| rankdir | String | false | TB| "TB/BT/LR/RL"  | The alignment of the nodes. T: top; B：bottom; L: left; R: right
| align | String | false | 'UL'| 'UL' / 'UR' / 'DL' / 'DR' | The alignment of the nodes. U: upper; D: down; L: left; R: right
| nodesep | Number | false | 50 |  | The separation between nodes with unit px. When rankdir is 'TB' or 'BT', nodesep represents the horizontal separations between nodes; When rankdir is 'LR' or 'RL', nodesep represents the vertical separations between nodes
| ranksep | Number | false | 50 |  | The separations between adjacent levels with unit px. When rankdir is 'TB' or 'BT', ranksep represents the vertical separations between adjacent levels; when rankdir is 'LR' or 'RL', rankdir represents the horizontal separations between adjacent levels
| controlPoints | Boolean | false | false | | Whether to keep the control points of layout



## Dagre Group Layout

&nbsp;&nbsp;&nbsp;&nbsp;Dagre Group Layout is an appropriate layout method for directed flow graph.It will calculate the levels and positions of nodes automatically according to the edge directions in the data. 

#### Examples

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


| name | Type | Required | Default | Options | Description  
| :------ | :------ | :------ | :------ | :------ | :------
| rankdir | String | false | TB| "TB/BT/LR/RL"  | The alignment of the nodes. T: top; B：bottom; L: left; R: right
| align | String | false | 'UL'| 'UL' / 'UR' / 'DL' / 'DR' | The alignment of the nodes. U: upper; D: down; L: left; R: right
| nodesep | Number | false | 50 |  | The separation between nodes with unit px. When rankdir is 'TB' or 'BT', nodesep represents the horizontal separations between nodes; When rankdir is 'LR' or 'RL', nodesep represents the vertical separations between nodes
| ranksep | Number | false | 50 |  | The separations between adjacent levels with unit px. When rankdir is 'TB' or 'BT', ranksep represents the vertical separations between adjacent levels; when rankdir is 'LR' or 'RL', rankdir represents the horizontal separations between adjacent levels
| controlPoints | Boolean | false | false | | Whether to keep the control points of layout

## Grid Layout

&nbsp;&nbsp;&nbsp;&nbsp;Grid Layout will order the nodes according to the parameters, and then place the nodes on the grids.

#### Examples

``` js
import {Canvas} from 'butterfly-dag';
this.canvas = new Canvas({
  layout: {
    type: 'grid',
    options: {
      // canvas width
      width: 150,
      // canvas height
      height: 100,
      // layout begin position
      begin: [0, 0],
      // prevents node overlap, may overflow boundingBox if not enough space
      preventOverlap: true,
      // extra spacing around nodes when preventOverlap: true
      preventOverlapPadding: 10,
      // uses all available space on false, uses minimal space on true
      condense: false,
      // row number
      rows: undefined,
      // column number
      cols: undefined,
      // sort method
      sortBy: 'degree',
      nodeSize: 30,
    },
  }
});
```

#### API


| Name | Type | Required | Default | Description  
| :------ | :------ | :------ | :------ | :------ 
| begin | Array | false | [0,0] | The place where the grid begin (left top)
| preventOverlap | Boolean | false | false |  Whether to prevent node overlappings. To activate preventing node overlappings, nodeSize is required, which is used for collide detection. The size in the node data will take effect if nodeSize is not assigned. If the size in node data does not exist either, nodeSize is assigned to 30 by default
| nodeSize | Number | false | 30 |  The diameter of the node. It is used for preventing node overlappings.
| preventOverlapPadding | Number | false | 10 | The minimum padding between nodes to prevent node overlappings. Takes effect when preventOverlap is true
| rows | Number | false | undefined |  The row number of the grid. If rows is undefined, the algorithm will calculate it according to the space and node numbers automatically
| cols | Number | false | undefined | The column number of the grid. If cols is undefined, the algorithm will calculate it according to the space and node numbers automatically
| sortBy | String | false | undefined | The ordering method for nodes. Smaller the index in the ordered array, more center the node will be placed. If sortBy is undefined, the algorithm order the nodes according to their degrees


## Fruchterman Layout

&nbsp;&nbsp;&nbsp;&nbsp;The Fruchterman Reingold layout algorithm is a force-oriented layout algorithm in principle.

#### Examples

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


| Name | Type | Required | Default | Description  
| :------ | :------ | :------ | :------ | :------ 
| center | Array | false | [0,0] | The center of the layout
| maxIteration | Number | false | 1000 | The maximum iteration number
| gravity | Number | false | 10 |  The gravity, which will affect the compactness of the layout
| speed | Number | false | 1 | The moving speed of each iteraction. Large value of the speed might lead to violent swing
| clustering | Boolean | false | false |  Whether to layout by cluster
| clusterGravity | Number | false | 10 | The gravity of each cluster, which will affect the compactness of each cluster. Takes effect only when clustering is true


## Concentric Layout

&nbsp;&nbsp;&nbsp;&nbsp;Concentric Layout places the nodes on concentric circles.

#### Example

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


| Name | Type | Required | Default | Description  
| :------ | :------ | :------ | :------ | :------ 
| center | Array | false | [0,0] | The center of the layout
| preventOverlap | Boolean | false | false | Whether to prevent node overlappings. To activate preventing node overlappings, nodeSize is required, which is used for collide detection. The size in the node data will take effect if nodeSize is not assigned. If the size in node data does not exist either, nodeSize is assigned to 30 by default
| nodeSize | Number | false | 30 |   The diameter of the node. It is used for preventing node overlappings
| minNodeSpacing | Number | false | 10 | The minimum separation between adjacent circles
| sweep | Number | false | undefined |  How many radians should be between the first and last node (defaults to full circle). If it is undefined, 2 _ Math.PI _ (1 - 1 / |level.nodes|) will be used, where level.nodes is nodes set of each level, |level.nodes| is the number of nodes of the level
| equidistant | Boolean | false | false | Whether levels have an equal radial distance between them, may cause bounding box overflow
| startAngle | Number | false | 3 / 2 * Math.PI | Where nodes start in radians
| clockwise | Boolean | false | false | lace the nodes in clockwise or not
| maxLevelDiff | Number | false | undefines |  The sum of concentric values in each level. If it is undefined, maxValue / 4 will take place, where maxValue is the max value of ordering properties. For example, if sortBy is 'degree', maxValue is the max degree value of all the nodes
| sortBy | String | false | undefined | Order the nodes according to this parameter. It is the property's name of node. The node with higher value will be placed to the center. If it is undefined, the algorithm will order the nodes by their degree


## Radial Layout

&nbsp;&nbsp;&nbsp;&nbsp;Radial layout is a kind of layout method to make the graph radial. Taking a focusnode as the center, the rest of the nodes are arranged on rings with different distances according to the degree relationship with focusnode. Nodes one degree away from focusnode are placed on the first ring nearest to it, nodes two degrees away from focusnode are placed on the second ring, and so on.

#### Examples

``` js
this.canvas = new Canvas({
  layout: {
    type: 'Radial',
    options: {
      // total width of layout canvas
      width:800,
      // total length of layout canvas
      height:800,
      /** the maximum iteration number of stopping iteration */
      maxIteration: 200,
      /** layout Center */
      center: [400, 400],
      /** center point, the default is the first point in the data */
      focusNode: '0',
      /** radius of each circle */
      unitRadius: 80,
      /** default edge length */
      linkDistance: 100,
      /** Is overlapping prevented */
      preventOverlap: true,
      /** node diameter */
      nodeSize: 20,
      /** node spacing, the minimum distance between nodes to prevent node overlap (the shortest distance between the edges of two nodes) */
      nodeSpacing: undefined,
      /** whether it must be a strict radial layout, that is, the nodes of each layer are strictly arranged on a ring. When preventoverlap is true  */
      strictRadial: true,
      /** maximum number of iterations to prevent overlapping steps */
      maxPreventOverlapIteration: 200,
      link: {
          // the distance between lines
          distance: 50,
          // the thickness of the line
          strength: 1
      }
    }
  }
});
```

#### API


| Name | Type | Required | Default | Description   
| :------ | :------ | :------ | :------ | :------ 
| center | Array | false | [0,0] | the center of the layout
| maxIteration | Number | false | 1000 | the maximum iteration number of stopping iteration
| focusNode | String/Object | false | null | the center point of the radiation, which is the first node in the data by default. You can pass in the node ID or the node itself
| unitRadius | Number | false | 100 | the distance between each lap and the previous lap. The entire canvas is filled by default, which is determined by the size of the graph
| linkDistance | Number | false | 50 | default edge length
| preventOverlap | Boolean | false | false | whether to prevent overlapping or not must cooperate with the following attribute nodesize. Only when the nodesize value is set to be the same as the current graph node size, can the collision detection of node overlapping be carried out
| nodeSize | Number | false | 10 | node size (diameter, used to prevent collision detection when nodes overlap)
| strictRadial | Boolean | false | true | whether it must be a strict radial layout, that is, the nodes of each layer are strictly arranged on a ring. It takes effect when preventoverlap is true. When preventoverlap is true and strictradial is false, the overlapped nodes expand strictly along the ring. However, if there are too many nodes in a ring, the overlapped nodes may not be completely avoided. When preventoverlap is true and strictradial is true, the overlapped nodes on the same ring are not strictly arranged along the ring, and the overlapped nodes can be offset before and after the ring to avoid overlapping.
| maxPreventOverlapIteration | Number | false | 200 | maximum number of iterations to prevent overlapping steps

## Tree Layout

&nbsp;&nbsp;&nbsp;&nbsp;reference：[antvis/hierarchy](https://github.com/antvis/hierarchy)

### compactBox

``` js
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
