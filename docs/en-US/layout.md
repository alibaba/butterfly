## Force Layout
Force-directed layout is a set of algorithms which are imporved and extended by lots of researchers based on the earliest classical force-directed algorithm. They simulate the nodes and edges in the graph as the physical objects. There are attractive forces and repulsive forces between nodes to iteratively move them to reach a reasonable layout.

#### legend
![Force布局](https://img.alicdn.com/tfs/TB1W2Feh9slXu8jSZFuXXXg7FXa-1092-707.png)

#### Examples

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


## Darge Layout

Dagre Layout is an appropriate layout method for directed flow graph.It will calculate the levels and positions of nodes automatically according to the edge directions in the data. 


#### legend

![Darge布局](https://img.alicdn.com/tfs/TB1kzjEkRFR4u4jSZFPXXanzFXa-1335-782.png)

#### Examples

``` js
this.canvas = new Canvas({
  layout: {
    type: 'drageLayout',
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

Grid Layout will order the nodes according to the parameters, and then place the nodes on the grids.

#### legend

![grid布局](https://img.alicdn.com/tfs/TB1uU6LVxD1gK0jSZFsXXbldVXa-1498-750.png)

#### Examples

``` js
import {TreeCanvas} from 'butterfly-dag';
this.canvas = new TreeCanvas({
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

Fruchterman Reingold 布局算法在原理上而言属于力导向布局算法。
#### legend

![Fruchterman布局](https://img.alicdn.com/tfs/TB1hDH5VpP7gK0jSZFjXXc5aXXa-1171-786.png)

#### Examples

``` js
import {TreeCanvas} from 'butterfly-dag';
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
            },
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
Concentric Layout places the nodes on concentric circles.

#### 图例

![Concentric Layout](https://img.alicdn.com/tfs/TB1f1fPVuH2gK0jSZJnXXaT1FXa-939-681.png)

#### 代码演示

``` js
import {TreeCanvas} from 'butterfly-dag';
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

## Tree Layout

参考：[antvis/hierarchy](https://github.com/antvis/hierarchy)

``` js
import {TreeCanvas} from 'butterfly-dag';
this.canvas = new TreeCanvas({
  layout: {
    type: 'drageLayout',
    options: {
      rankdir: 'TB',
      nodesep: 40,
      ranksep: 40,
      controlPoints: false,
    },
  }
});
```
