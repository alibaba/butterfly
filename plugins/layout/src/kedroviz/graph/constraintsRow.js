import { Constraint, Operator, Strength } from 'kiwi.js';

export const rowConstraint = {
  property: 'x',

  strict: (constraint, constants, variableA, variableB) =>
    new Constraint(
      variableA.minus(variableB),
      Operator.Ge,
      constants.spaceX,
      Strength.required
    ),
};


export const layerConstraint = {
  property: 'x',

  strict: (constraint, constants, variableA, variableB) =>
    new Constraint(
      variableA.minus(variableB),
      Operator.Ge,
      constants.layerSpace,
      Strength.required
    ),
};

export const parallelConstraint = {
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

export const crossingConstraint = {
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

export const separationConstraint = {
  property: 'y',

  strict: (constraint, constants, variableA, variableB) =>
    new Constraint(
      variableB.minus(variableA),
      Operator.Ge,
      constraint.separation,
      Strength.required
    ),
};
