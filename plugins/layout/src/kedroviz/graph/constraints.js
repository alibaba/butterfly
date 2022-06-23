/*
* Copyright 2020 QuantumBlack Visual Analytics Limited
* SPDX-License-Identifier: Apache-2.0
*/
import { Constraint, Operator, Strength } from 'kiwi.js';

//上下方向的行约束
export const rowConstraint = {
  property: 'y',

  strict: (constraint, constants, variableA, variableB) =>
    new Constraint(
      variableA.minus(variableB),
      Operator.Ge,
      constants.spaceReverseDirection,
      Strength.required
    ),
};

//左右方向的列约束
export const columnConstraint = {
  property: 'x',

  strict: (constraint, constants, variableA, variableB) =>
    new Constraint(
      variableA.minus(variableB),
      Operator.Ge,
      constants.spaceReverseDirection,
      Strength.required
    ),
};

//上下方向的layer约束
export const columnLayerConstraint = {
  property: 'y',

  strict: (constraint, constants, variableA, variableB) =>
    new Constraint(
      variableA.minus(variableB),
      Operator.Ge,
      constants.layerSpace,
      Strength.required
    ),
};

//左右方向的layer约束
export const rowLayerConstraint = {
  property: 'x',

  strict: (constraint, constants, variableA, variableB) =>
    new Constraint(
      variableA.minus(variableB),
      Operator.Ge,
      constants.layerSpace,
      Strength.required
    ),
};

// 上下方向
export const columnParallelConstraint = {
  property: 'x',

  solve: (constraint) => {
    const { a, b, strength } = constraint;
    const resolve = strength * (a.x - b.x);
    a.x -= resolve;
    b.x += resolve;
  },

  strict: (constraint, constants, variableA, variableB) =>
    new Constraint(
      variableA.minus(variableB),
      Operator.Eq,
      0,
      Strength.create(1, 0, 0, constraint.strength)
    ),
};

// 左右方向
export const rowParallelConstraint = {
  property: 'y',

  solve: (constraint) => {
    const { a, b, strength } = constraint;
    const resolve = strength * (a.y - b.y);
    a.y -= resolve;
    b.y += resolve;
  },

  strict: (constraint, constants, variableA, variableB) =>
    new Constraint(
      variableA.minus(variableB),
      Operator.Eq,
      0,
      Strength.create(1, 0, 0, constraint.strength)
    ),
};

// 上下方向
export const columnCrossingConstraint = {
  property: 'x',

  solve: (constraint) => {
    const { edgeA, edgeB, separationA, separationB, strength } = constraint;

    const resolveSource =
      strength *
      ((edgeA.sourceNodeObj.x - edgeB.sourceNodeObj.x - separationA) / separationA);

    const resolveTarget =
      strength *
      ((edgeA.targetNodeObj.x - edgeB.targetNodeObj.x - separationB) / separationB);

    edgeA.sourceNodeObj.x -= resolveSource;
    edgeB.sourceNodeObj.x += resolveSource;
    edgeA.targetNodeObj.x -= resolveTarget;
    edgeB.targetNodeObj.x += resolveTarget;
  },
};
// 左右方向
export const rowCrossingConstraint = {
  property: 'y',

  solve: (constraint) => {
    const { edgeA, edgeB, separationA, separationB, strength } = constraint;

    const resolveSource =
      strength *
      ((edgeA.sourceNodeObj.y - edgeB.sourceNodeObj.y - separationA) / separationA);

    const resolveTarget =
      strength *
      ((edgeA.targetNodeObj.y - edgeB.targetNodeObj.y - separationB) / separationB);

    edgeA.sourceNodeObj.y -= resolveSource;
    edgeB.sourceNodeObj.y += resolveSource;
    edgeA.targetNodeObj.y -= resolveTarget;
    edgeB.targetNodeObj.y += resolveTarget;
  },
};

// 上下方向
export const columnSeparationConstraint = {
  property: 'x',

  strict: (constraint, constants, variableA, variableB) =>
    new Constraint(
      variableB.minus(variableA),
      Operator.Ge,
      constraint.separation,
      Strength.required
    )
   
};

// 左右方向
export const rowSeparationConstraint = {
  property: 'y',

  strict: (constraint, constants, variableA, variableB) =>
    new Constraint(
      variableB.minus(variableA),
      Operator.Ge,
      constraint.separation,
      Strength.required
    ),
};
