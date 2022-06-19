import { Constraint, Operator, Strength } from 'kiwi.js';

export const rowConstraint = {
  property: 'y',

  strict: (constraint, constants, variableA, variableB) =>
    new Constraint(
      variableA.minus(variableB),
      Operator.Ge,
      constants.spaceY,
      Strength.required
    ),
};


export const layerConstraint = {
  property: 'y',

  strict: (constraint, constants, variableA, variableB) =>
    new Constraint(
      variableA.minus(variableB),
      Operator.Ge,
      constants.layerSpace,
      Strength.required
    ),
};

export const parallelConstraint = {
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

export const crossingConstraint = {
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

export const separationConstraint = {
  property: 'x',

  strict: (constraint, constants, variableA, variableB) =>
    new Constraint(
      variableB.minus(variableA),
      Operator.Ge,
      constraint.separation,
      Strength.required
    ),
};
