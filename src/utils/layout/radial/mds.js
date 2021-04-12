
// to: https://github.com/antvis/G6/tree/3.5.1/src/layout/radial
'use strict';

import { Matrix as MLMatrix, SingularValueDecomposition } from 'ml-matrix';
export default class MDS {
 
  constructor(params) {
    this.distances = params.distances;
    this.dimension = params.dimension || 2;
    this.linkDistance = params.linkDistance;
  }

  layout() {
    const self = this;
    const { dimension, distances, linkDistance } = self;
    try {
        // square distances
        const M = MLMatrix.mul(MLMatrix.pow(distances, 2), -0.5);
  
        // double centre the rows/columns
        const rowMeans = M.mean('row');
        const colMeans = M.mean('column');
        const totalMean = M.mean();
        M.add(totalMean).subRowVector(rowMeans).subColumnVector(colMeans);
  
        // take the SVD of the double centred matrix, and return the
        // points from it
        const ret = new SingularValueDecomposition(M);
        const eigenValues = MLMatrix.sqrt(ret.diagonalMatrix).diagonal();
        return ret.leftSingularVectors.toJSON().map((row) => {
          return MLMatrix.mul([row], [eigenValues]).toJSON()[0].splice(0, dimension);
        });
      } catch {
        const res = [];
        for (let i = 0; i < distances.length; i++) {
          const x = Math.random() * linkDistance;
          const y = Math.random() * linkDistance;
          res.push([x, y]);
        }
        return res;
      }
  }
}