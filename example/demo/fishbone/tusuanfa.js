var SelfNode = /** @class */ (function () {
    function SelfNode(id, name, cost) {
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.inEdge = [];
        this.outEdge = [];
        this.initLayer = 0;
        this.layerPos = -1;
        this.layerOrder = -1;
        this.posOrder = -1;
        this.layerX = 0;
    }
    return SelfNode;
}());
var SelfEdge = /** @class */ (function () {
    function SelfEdge(id, inNode, outNode) {
        this.id = id;
        this.source = inNode;
        this.target = outNode;
        this.isTreeEdge = false;
    }
    return SelfEdge;
}());
var SelfTree = /** @class */ (function () {
    function SelfTree(data) {
        var _this = this;
        this.timer = Date.now();
        this.isTreeFromTop = false;
        this.nodes = [];
        this.edges = [];
        this.treeNodes = [];
        data.nodes.forEach(function (n) {
            var tmpNode = new SelfNode(n.id, n.name, n.index);
            _this.nodes.push(tmpNode);
        });
        data.edges.forEach(function (e) {
            if (e.source === e.target) {
                return;
            }
            var sourceNode = _this.nodes.find(function (n) { return n.id === e.source; });
            var targetNode = _this.nodes.find(function (n) { return n.id === e.target; });
            if (sourceNode && targetNode) {
                var tmpEdge = new SelfEdge(e.id, sourceNode, targetNode);
                sourceNode.outEdge.push(tmpEdge);
                targetNode.inEdge.push(tmpEdge);
                _this.edges.push(tmpEdge);
            }
            else {
                throw new Error('找不到对应边的节点');
            }
        });
        // 目前先将边的target的cost作为权重值降序排列，之后可能会修改
        this.nodes.forEach(function (n) {
            n.outEdge.sort(function (a, b) {
                return b.target.cost - a.target.cost;
            });
        });
        // console.log('-----------------------------------')
        // console.log("nodes count: " + this.nodes.length)
        // console.log("edges count: " + this.edges.length)
    }
    /**
     * 初始化
     */
    SelfTree.prototype.init = function () {
        this.nodes.forEach(function (n) {
            n.initLayer = 0;
            n.initTreeInEdge = undefined;
            n.visited = undefined;
        });
        this.edges.forEach(function (e) {
            e.cutValue = undefined;
            e.isTreeEdge = false;
            e.hiddened = undefined;
        });
    };
    /**
     *  减小切值，让所有边切值非负
     */
    SelfTree.prototype.minusCircleValue = function () {
    };
    /**
     * 去环，并生成一棵合适的最大生成树
     */
    SelfTree.prototype.reduceCircle = function () {
        var findPath = function (n, floor) {
            n.visited = 'visiting';
            n.initLayer = floor;
            if (n.outEdge.length === 0) {
                // 遍历到了最下层的叶子节点
                n.visited = 'visited';
                return;
            }
            for (var _i = 0, _a = n.outEdge; _i < _a.length; _i++) {
                var cc = _a[_i];
                var targetNode = cc.target;
                if (targetNode) {
                    if (targetNode.visited === 'visiting') {
                        // 出现了有环情况，证明是这条边是后向边
                        cc.hiddened = true;
                    }
                    else if (!targetNode.visited) {
                        // 这条边没被遍历过，暂时作为树边
                        targetNode.initTreeInEdge = cc;
                        findPath(targetNode, floor + 1);
                    }
                    else if (targetNode.visited === 'visited') {
                        if (targetNode.initLayer < floor) {
                            targetNode.initTreeInEdge = cc;
                            findPath(targetNode, floor + 1);
                        }
                    }
                }
                else {
                    throw new Error("去环->某条边的target节点没找到");
                }
            }
            n.visited = 'visited';
        };
        this.nodes.forEach(function (n) {
            if (n.inEdge.length === 0) {
                findPath(n, 1);
            }
        });
        this.nodes.forEach(function (n) {
            if (n.initTreeInEdge) {
                n.initTreeInEdge.isTreeEdge = true;
            }
        });
    };
    /**
     * 去环，并生成一棵合适的最大生成树
     */
    SelfTree.prototype.reduceCircleFromBottom = function () {
        var findPath = function (n, floor) {
            n.visited = 'visiting';
            n.initLayer = floor;
            if (n.inEdge.length === 0) {
                // 遍历到了最上层的叶子节点
                n.visited = 'visited';
                return;
            }
            for (var _i = 0, _a = n.inEdge; _i < _a.length; _i++) {
                var cc = _a[_i];
                var sourceNode = cc.source;
                if (sourceNode) {
                    if (sourceNode.visited === 'visiting') {
                        // 出现了有环情况，证明是这条边是后向边
                        cc.hiddened = true;
                    }
                    else if (!sourceNode.visited) {
                        // 这条边没被遍历过，暂时作为树边
                        sourceNode.initTreeInEdge = cc;
                        findPath(sourceNode, floor + 1);
                    }
                    else if (sourceNode.visited === 'visited') {
                        if (sourceNode.initLayer < floor) {
                            sourceNode.initTreeInEdge = cc;
                            findPath(sourceNode, floor + 1);
                        }
                    }
                }
                else {
                    throw new Error("去环->某条边的target节点没找到");
                }
            }
            n.visited = 'visited';
        };
        this.nodes.forEach(function (n) {
            if (n.outEdge.length === 0) {
                findPath(n, 1);
            }
        });
        this.nodes.forEach(function (n) {
            if (n.initTreeInEdge) {
                n.initTreeInEdge.isTreeEdge = true;
            }
        });
    };
    /**
     * 计算边切值
     */
    SelfTree.prototype.getSingleEdgeCutValue = function (e) {
        var getValue = function (n) {
            var childValue = 0;
            n.outEdge.forEach(function (outE) {
                if (outE.isTreeEdge) {
                    childValue += getValue(outE.target);
                }
            });
            return n.inEdge.length - n.outEdge.length + childValue;
        };
        return getValue(e.target);
    };
    /**
     * 更新整条树的切值
     */
    SelfTree.prototype.updateTreeCutValue = function () {
        var _this = this;
        var tmp = [];
        this.edges.forEach(function (e) {
            if (e.isTreeEdge) {
                e.cutValue = _this.getSingleEdgeCutValue(e);
                tmp.push(e.cutValue);
            }
        });
        // console.log('-----------------------------------')
        // console.log('切值为负的边数量: ' + tmp.filter(function (t) { return t < 0; }).length);
        return tmp.filter(function (t) { return t < 0; }).length;
    };
    /**
     * 添加虚拟节点
     */
    SelfTree.prototype.addVirtualNode = function () {
        this.edges.forEach(function (e) {
            if (!e.hiddened && Math.abs(e.source.initLayer - e.target.initLayer) > 1) {
                // 边的路径上添加虚拟节点
                var cycle1 = e.source.initLayer < e.target.initLayer ? 1 : -1;
                for (var cc = e.source.initLayer + cycle1; (e.source.initLayer < e.target.initLayer ? cc < e.target.initLayer : cc > e.target.initLayer); cc += cycle1) {
                    var virNode = new SelfNode(e.source.name + e.target.name + cc, 'virtualNode', 0);
                    virNode.layerPos = (e.target.layerPos - e.source.layerPos) / (e.target.initLayer - e.source.initLayer)
                        * (cc - e.source.initLayer) + e.source.layerPos;
                }
            }
        });
    };
    /**
     * 检测是否存在环
     */
    SelfTree.prototype.checkCircle = function () {
        console.log('-----------------------------------');
        console.log('检验是否有环！');
        var findPath = function (n) {
            n.visited = 'visiting';
            if (n.outEdge.length === 0) {
                // 遍历到了最下层的叶子节点
                n.visited = 'visited';
                return;
            }
            edgeCount += n.outEdge.length;
            for (var _i = 0, _a = n.outEdge; _i < _a.length; _i++) {
                var cc = _a[_i];
                if (cc.hiddened) {
                    continue;
                }
                // 找到对应id的node,向深处遍历
                var targetNode = cc.target;
                if (targetNode) {
                    if (targetNode.visited === 'visiting') {
                        // 出现了有环情况，证明是这条边导致的，暂时先反转这条边
                        throw new Error('出现了环！');
                    }
                    else if (!targetNode.visited) {
                        findPath(targetNode);
                    }
                }
                else {
                    // console.log("去环->某条边的target节点没找到")
                    throw new Error("去环->某条边的target节点没找到");
                }
            }
            n.visited = 'visited';
        };
        var edgeCount = 0;
        this.nodes.forEach(function (n) { return n.visited = undefined; });
        this.nodes.forEach(function (n) {
            if (n.inEdge.length === 0) {
                findPath(n);
            }
        });
        var visitedNode = 0;
        this.nodes.forEach(function (n) {
            if (n.visited === 'visited') {
                visitedNode += 1;
            }
        });
    };
    /**
     * 获取最优的生成树层级分配
     */
    SelfTree.prototype.getMinRankTree = function () {
        this.reduceCircle();
        var positCutValueFromTop = this.updateTreeCutValue();
        this.init();
        this.reduceCircleFromBottom();
        var positCutValueFromBottom = this.updateTreeCutValue();
        if (positCutValueFromTop < positCutValueFromBottom) {
            // 证明从顶向下构建生成树优于从底向上
            this.isTreeFromTop = true;
            this.init();
            this.reduceCircle();
            this.updateTreeCutValue();
        }
        this.minusCircleValue();
        // this.checkCircle();
    };
    /**
     * 获取节点层级后，在二维数组中存储所有节点的层信息
     */
    SelfTree.prototype.updateTreeLayerNodes = function () {
        var _this = this;
        var maxLayer = -1;
        this.nodes.forEach(function (n) {
            if (n.initLayer > maxLayer) {
                maxLayer = n.initLayer;
            }
        });
        for (var cc = 0; cc < maxLayer + 1; cc++) {
            this.treeNodes.push([]);
        }
        this.nodes.forEach(function (n) {
            _this.treeNodes[n.initLayer].push(n);
        });
    };
    /**
     * 获取一个初始的每层的节点顺序，首先保证生成树的边没有交叉
     */
    SelfTree.prototype.initOrder = function () {
        var _this = this;
        var maxLayer = -1;
        this.nodes.forEach(function (n) {
            if (n.initLayer > maxLayer) {
                maxLayer = n.initLayer;
            }
        });
        var layerCache = [];
        for (var cc = 0; cc < maxLayer + 1; cc++) {
            layerCache.push(0);
        }
        // 从根部开始进行遍历，遍历到的元素按照对应的层数从左向右排序
        var getNodeOrder = function (n) {
            n.layerPos = layerCache[n.initLayer];
            n.layerOrder = layerCache[n.initLayer];
            layerCache[n.initLayer] += 1;
            for (var _i = 0, _a = (_this.isTreeFromTop ? n.outEdge : n.inEdge); _i < _a.length; _i++) {
                var cc = _a[_i];
                if (cc.isTreeEdge) {
                    getNodeOrder(_this.isTreeFromTop ? cc.target : cc.source);
                }
            }
        };
        this.nodes.forEach(function (n) {
            if (n.initLayer === 1) {
                getNodeOrder(n);
            }
        });
    };
    /**
     * 获取一个节点的权重，使用了中位数法
     */
    SelfTree.prototype.getMedianValue = function (n) {
        // !!!TODO 自底向上和自顶向下是反着的，要修改一下
        var nearNodes = [];
        if (this.isTreeFromTop) {
            n.inEdge.forEach(function (e) {
                Math.abs(e.source.initLayer - n.initLayer) === 1 && nearNodes.push(e.source);
            });
        }
        else {
            n.outEdge.forEach(function (e) {
                Math.abs(e.target.initLayer - n.initLayer) === 1 && nearNodes.push(e.target);
            });
        }
        nearNodes.sort(function (nodeA, nodeB) { return nodeA.layerPos - nodeB.layerPos; });
        if (nearNodes.length === 0) {
            return -1;
        }
        else if (nearNodes.length % 2 === 1) {
            return nearNodes[Math.floor(nearNodes.length / 2)].layerPos;
        }
        else if (nearNodes.length === 2) {
            return (nearNodes[0].layerPos + nearNodes[1].layerPos) / 2;
        }
        else {
            var tmpLeft = nearNodes[nearNodes.length / 2 - 1].layerPos - nearNodes[0].layerPos;
            var tmpRight = nearNodes[nearNodes.length - 1].layerPos - nearNodes[nearNodes.length / 2].layerPos;
            return (nearNodes[nearNodes.length / 2 - 1].layerPos * tmpRight +
                nearNodes[nearNodes.length - 1].layerPos * tmpLeft) / (tmpLeft + tmpRight);
        }
    };
    SelfTree.prototype.wmedian = function (iter) {
        var _this = this;
        if (iter % 5 === 0) {
            this.nodes.forEach(function (n) {
                // 更新节点的排序权重
                n.layerOrder = _this.getMedianValue(n);
            });
            this.treeNodes.forEach(function (nArray) {
                nArray.sort(function (aNode, bNode) { return aNode.layerOrder - bNode.layerOrder; });
            });
            this.updateNodePos();
        }
    };
    /**
     * 计算两层之间的交叉值
     */
    SelfTree.prototype.getLayersCrossValue = function (layer) {
        if (layer >= this.treeNodes.length - 1 || layer <= 0) {
            return 0;
        }
        var calEdges = [];
        var cross = 0;
        this.edges.forEach(function (e) {
            if ((e.source.initLayer === layer && e.target.initLayer === layer + 1) ||
                (e.target.initLayer === layer && e.source.initLayer === layer + 1)) {
                calEdges.push(e);
            }
        });
        for (var cc = 0; cc < calEdges.length - 1; cc++) {
            for (var dd = cc + 1; dd < calEdges.length; dd++) {
                var ccX1 = calEdges[cc].source.layerPos;
                var ccX2 = calEdges[cc].target.layerPos;
                var ddX1 = calEdges[dd].source.layerPos;
                var ddX2 = calEdges[dd].target.layerPos;
                if ((ddX1 - ccX1) * (ddX2 - ccX2) < 0 || (ddX1 - ccX2) * (ddX2 - ccX1) < 0) {
                    cross += 1;
                }
            }
        }
        return cross;
    };
    SelfTree.prototype.getTotalCrossValue = function () {
        var cross = 0;
        for (var cc = 0; cc < this.edges.length - 1; cc++) {
            for (var dd = cc + 1; dd < this.edges.length; dd++) {
                var ccX1 = this.edges[cc].source.layerPos;
                var ccX2 = this.edges[cc].target.layerPos;
                var ddX1 = this.edges[dd].source.layerPos;
                var ddX2 = this.edges[dd].target.layerPos;
                if ((ddX1 - ccX1) * (ddX2 - ccX2) < 0 || (ddX1 - ccX2) * (ddX2 - ccX1) < 0) {
                    cross += 1;
                }
            }
        }
        return cross;
    };
    /**
     * 将节点按照顺序排好，然后尝试交换看边交叉次数有没有减少
     */
    SelfTree.prototype.transpose = function (times) {
        var cycle1 = (times % 2 === 0 ? 1 : this.treeNodes.length - 1);
        var cycle3 = (times % 2 === 0 ? 1 : -1);
        for (var cc = cycle1; (times % 2 === 0 ? cc < this.treeNodes.length : cc > 0); cc += cycle3) {
            var preCrossValue = this.getLayersCrossValue(cc) + this.getLayersCrossValue(cc - 1) + this.getLayersCrossValue(cc + 1);
            // let preCrossValue = this.getTotalCrossValue();
            for (var dd = 0; dd < this.treeNodes[cc].length - 1; dd++) {
                var bestChangeNode = -1;
                for (var ee = dd + 1; ee < this.treeNodes[cc].length; ee++) {
                    // 尝试交换两个节点，查看cross值是否减少
                    var tmpPos = this.treeNodes[cc][dd].layerPos;
                    this.treeNodes[cc][dd].layerPos = this.treeNodes[cc][ee].layerPos;
                    this.treeNodes[cc][ee].layerPos = tmpPos;
                    var currCrossValue = this.getLayersCrossValue(cc) + this.getLayersCrossValue(cc - 1) + this.getLayersCrossValue(cc + 1);
                    // const currCrossValue = this.getTotalCrossValue();
                    if (currCrossValue < preCrossValue) {
                        bestChangeNode = ee;
                        preCrossValue = currCrossValue;
                    }
                    var tmpPos2 = this.treeNodes[cc][dd].layerPos;
                    this.treeNodes[cc][dd].layerPos = this.treeNodes[cc][ee].layerPos;
                    this.treeNodes[cc][ee].layerPos = tmpPos2;
                }
                if (bestChangeNode !== -1) {
                    // 如果交换完成之后成功优化，那就彻底交换
                    var tmpNode = this.treeNodes[cc][dd];
                    this.treeNodes[cc][dd] = this.treeNodes[cc][bestChangeNode];
                    this.treeNodes[cc][bestChangeNode] = tmpNode;
                    var tmpPos = this.treeNodes[cc][dd].layerPos;
                    this.treeNodes[cc][dd].layerPos = this.treeNodes[cc][bestChangeNode].layerPos;
                    this.treeNodes[cc][bestChangeNode].layerPos = tmpPos;
                }
            }
            // for (let dd = 0; dd < this.treeNodes[cc].length - 1; dd++) {
            //   // 尝试交换两个节点，查看cross值是否减少
            //   const tmpOrder = this.treeNodes[cc][dd].layerOrder;
            //   this.treeNodes[cc][dd].layerOrder = this.treeNodes[cc][dd + 1].layerOrder;
            //   this.treeNodes[cc][dd + 1].layerOrder = tmpOrder;
            //   const currCrossValue = this.getLayersCrossValue(cc);
            //   if (currCrossValue < preCrossValue) {
            //     // 如果交换完成之后成功优化，那就彻底交换
            //     const tmpNode = this.treeNodes[cc][dd];
            //     this.treeNodes[cc][dd] = this.treeNodes[cc][dd + 1];
            //     this.treeNodes[cc][dd + 1] = tmpNode;
            //     preCrossValue = currCrossValue;
            //   } else {
            //     const tmpOrder = this.treeNodes[cc][dd].layerOrder;
            //     this.treeNodes[cc][dd].layerOrder = this.treeNodes[cc][dd + 1].layerOrder;
            //     this.treeNodes[cc][dd + 1].layerOrder = tmpOrder;
            //   }
            // }
        }
    };
    SelfTree.prototype.updateNodePos = function () {
        for (var _i = 0, _a = this.treeNodes; _i < _a.length; _i++) {
            var cc = _a[_i];
            cc.forEach(function (n, idx) {
                n.layerPos = idx;
            });
        }
    };
    /**
     * 变换层中节点的顺序，使得边交叉最少
     */
    SelfTree.prototype.updateNodeOrder = function () {
        this.initOrder();
        this.updateTreeLayerNodes();
        // let preCross = 0;
        // for (let cc = 1; cc < this.treeNodes.length; cc++) {
        //   preCross += this.getLayersCrossValue(cc);
        // }
        // console.log(preCross)
        // 迭代一定次数，优化边的交叉顺序
        for (var cc = 0; cc < 20; cc++) {
            this.wmedian(cc);
            this.transpose(cc);
        }
        // preCross = 0;
        // for (let cc = 1; cc < this.treeNodes.length; cc++) {
        //   preCross += this.getLayersCrossValue(cc);
        // }
        // console.log(preCross);
    };
    SelfTree.prototype.initPos = function (horInterval) {
        var _this = this;
        var maxValue = 0;
        for (var _i = 0, _a = this.treeNodes; _i < _a.length; _i++) {
            var cc = _a[_i];
            if (cc.length > maxValue)
                maxValue = cc.length;
        }
        this.nodes.forEach(function (n) {
            n.layerOrder = n.layerPos;
            n.layerPos = (n.layerPos + 1) * ((maxValue - 1) * horInterval / (_this.treeNodes[n.initLayer].length + 1));
        });
    };
    SelfTree.prototype.getNodeMedianPos = function (n) {
        var tmpArr = [];
        n.inEdge.forEach(function (e) { return tmpArr.push(e.source); });
        n.outEdge.forEach(function (e) { return tmpArr.push(e.target); });
        tmpArr.sort(function (a, b) { return a.layerPos - b.layerPos; });
        if (tmpArr.length % 2 === 1) {
            return tmpArr[(tmpArr.length - 1) / 2].layerPos;
        }
        else {
            if ((tmpArr[tmpArr.length / 2 - 1].inEdge.length + tmpArr[tmpArr.length / 2 - 1].outEdge.length) >
                (tmpArr[tmpArr.length / 2].inEdge.length + tmpArr[tmpArr.length / 2].outEdge.length)) {
                return tmpArr[tmpArr.length / 2 - 1].layerPos;
            }
            else {
                return tmpArr[tmpArr.length / 2].layerPos;
            }
            // return tmpArr[tmpArr.length / 2].layerPos / 2 + tmpArr[tmpArr.length / 2 - 1].layerPos / 2;
        }
    };
    SelfTree.prototype.getNodeMedianPos2 = function (n) {
        var tmpArr = [];
        n.inEdge.forEach(function (e) { return tmpArr.push(e.source); });
        n.outEdge.forEach(function (e) { return tmpArr.push(e.target); });
        tmpArr.sort(function (a, b) { return a.layerPos - b.layerPos; });
        if (tmpArr.length % 2 === 1) {
            return tmpArr[(tmpArr.length - 1) / 2].layerPos;
        }
        else {
            // if ((tmpArr[tmpArr.length / 2 - 1].inEdge.length + tmpArr[tmpArr.length / 2 - 1].outEdge.length) >
            //   (tmpArr[tmpArr.length / 2].inEdge.length + tmpArr[tmpArr.length / 2].outEdge.length)) {
            //   return tmpArr[tmpArr.length / 2 - 1].layerPos;
            // } else {
            //   return tmpArr[tmpArr.length / 2].layerPos;
            // }
            return tmpArr[tmpArr.length / 2].layerPos / 2 + tmpArr[tmpArr.length / 2 - 1].layerPos / 2;
        }
    };
    /**
     * 排位置时中位数启发
     */
    SelfTree.prototype.medianPos = function () {
        var _this = this;
        this.treeNodes.forEach(function (nArray) {
            nArray.forEach(function (n) {
                n.posOrder = _this.getNodeMedianPos(n);
            });
        });
    };
    SelfTree.prototype.medianPos2 = function () {
        var _this = this;
        this.treeNodes.forEach(function (nArray) {
            nArray.forEach(function (n) {
                n.posOrder = _this.getNodeMedianPos2(n);
            });
        });
    };
    /**
     *  根据权重调整节点坐标
     */
    SelfTree.prototype.minnode = function (times, mode, horInterval) {
        var nodeCache = [];
        this.nodes.forEach(function (n) {
            n.visited = 'visiting';
            nodeCache.push(n);
        });
        nodeCache.sort(function (nodeA, nodeB) {
            if (times % 2 === 0) {
                if (nodeA.initLayer > nodeB.initLayer) {
                    return 1;
                }
                return Math.abs(nodeB.posOrder - nodeB.layerPos) - Math.abs(nodeA.posOrder - nodeA.layerPos);
            }
            else {
                if (nodeA.initLayer < nodeB.initLayer) {
                    return 1;
                }
                return Math.abs(nodeB.posOrder - nodeB.layerPos) - Math.abs(nodeA.posOrder - nodeA.layerPos);
            }
        });
        while (nodeCache.length > 0) {
            var rdyNode = nodeCache.shift();
            if (rdyNode) {
                rdyNode.posOrder = mode === 1 ? this.getNodeMedianPos(rdyNode) : this.getNodeMedianPos2(rdyNode);
                var leftNode = this.treeNodes[rdyNode.initLayer].slice(0, rdyNode.layerOrder)
                    .reverse().find(function (node) { return node.visited === 'visited'; });
                var rightNode = this.treeNodes[rdyNode.initLayer].slice(rdyNode.layerOrder + 1)
                    .find(function (node) { return node.visited === 'visited'; });
                var limLeft = leftNode ? leftNode.layerPos + horInterval : -10000000;
                var limRight = rightNode ? rightNode.layerPos - horInterval : 10000000;
                var prePos = rdyNode.layerPos;
                if (rdyNode.posOrder >= limLeft && rdyNode.posOrder <= limRight) {
                    rdyNode.layerPos = rdyNode.posOrder;
                }
                else if (rdyNode.posOrder <= limLeft) {
                    rdyNode.layerPos = limLeft;
                }
                else if (rdyNode.posOrder >= limRight) {
                    rdyNode.layerPos = limRight;
                }
                // 和rdyNode相关的节点要更新横坐标，目前先全部更新
                if (Math.abs(rdyNode.layerPos - prePos) >= horInterval) {
                    rdyNode.inEdge.forEach(function (e) {
                        if (e.source.visited !== 'visiting') {
                            nodeCache.push(e.source);
                        }
                    });
                    rdyNode.outEdge.forEach(function (e) {
                        if (e.target.visited !== 'visiting') {
                            nodeCache.push(e.target);
                        }
                    });
                    this.treeNodes[rdyNode.initLayer].forEach(function (n) {
                        if (n.visited !== 'visiting') {
                            nodeCache.push(n);
                        }
                    });
                }
                rdyNode.visited = "visited";
            }
        }
    };
    /**
     * 将节点摆放到正确的坐标上
     */
    SelfTree.prototype.updateNodePosition = function (horInterval) {
        this.initPos(horInterval);
        this.medianPos();
        for (var cc = 0; cc < 8; cc++) {
            this.minnode(cc, 1, horInterval);
        }
    };
    SelfTree.prototype.updateNodePosition2 = function (horInterval) {
        this.initPos(horInterval);
        this.medianPos();
        for (var cc = 0; cc < 8; cc++) {
            this.minnode(cc, 2, horInterval);
        }
    };
    SelfTree.prototype.alignNodes = function () {
        var total = 0;
        this.nodes.forEach(function (n) {
            total += n.layerPos;
        });
        var aver = total / this.nodes.length;
        this.nodes.forEach(function (n) {
            n.layerPos -= aver;
        });
    };
    SelfTree.prototype.getTrueLayout = function (horInterval) {
        this.getMinRankTree();
        this.updateNodeOrder();
        this.updateNodePosition(horInterval);
        this.alignNodes();
        console.log("\u5E03\u5C40\u7B97\u6CD5\u7528\u65F6: ".concat((Date.now() - this.timer), "ms"));
    };
    SelfTree.prototype.getTrueLayout2 = function (horInterval) {
        this.getMinRankTree();
        this.updateNodeOrder();
        this.updateNodePosition2(horInterval);
        this.alignNodes();
        console.log("\u5E03\u5C40\u7B97\u6CD5\u7528\u65F6: ".concat((Date.now() - this.timer), "ms"));
    };
    return SelfTree;
}());
module.exports = {
    layout: function (data, horInterval, verInterval) {
        if (horInterval === void 0) { horInterval = 120; }
        if (verInterval === void 0) { verInterval = 70; }
        var dataTree = new SelfTree(data);
        dataTree.getTrueLayout(horInterval);
        return {
            nodes: dataTree.nodes.map(function (n) {
                return {
                    id: n.id,
                    label: n.name,
                    top: n.initLayer * verInterval,
                    left: n.layerPos
                };
            }),
            edges: data.edges
        };
    },
    layout2: function (data, horInterval, verInterval) {
        if (horInterval === void 0) { horInterval = 120; }
        if (verInterval === void 0) { verInterval = 70; }
        var dataTree = new SelfTree(data);
        dataTree.getTrueLayout2(horInterval);
        return {
            nodes: dataTree.nodes.map(function (n) {
                return {
                    id: n.id,
                    label: n.name,
                    top: n.initLayer * verInterval,
                    left: n.layerPos
                };
            }),
            edges: data.edges
        };
    }
};
