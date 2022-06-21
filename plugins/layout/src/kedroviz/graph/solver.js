/*
* Copyright 2020 QuantumBlack Visual Analytics Limited
* SPDX-License-Identifier: Apache-2.0
*/
import { Solver, Variable } from 'kiwi.js';

export const solveLoose = (constraints, iterations, constants) => {
  for (let i = 0; i < iterations; i += 1) {
    for (const constraint of constraints) {
      constraint.base.solve(constraint, constants);
    }
  }
};

export const solveStrict = (constraints, constants) => {
  const solver = new Solver();
  const variables = {};

  const variableId = (obj, property) => `${obj.id}_${property}`;

  const addVariable = (obj, property) => {
    const id = variableId(obj, property);

    if (!variables[id]) {
      const variable = (variables[id] = new Variable());
      variable.property = property;
      variable.obj = obj;
    }
  };

  for (const constraint of constraints) {
    addVariable(constraint.a, constraint.base.property);
    addVariable(constraint.b, constraint.base.property);
  }

  let unsolvableCount = 0;

  for (const constraint of constraints) {
    try {
      solver.addConstraint(
        constraint.base.strict(
          constraint,
          constants,
          variables[variableId(constraint.a, constraint.base.property)],
          variables[variableId(constraint.b, constraint.base.property)]
        )
      );
    } catch (err) {
      unsolvableCount += 1;
    }
  }

  if (unsolvableCount > 0) {
    console.warn(`Skipped ${unsolvableCount} unsolvable constraints`);
  }

  solver.updateVariables();

  const variablesList = Object.values(variables);

  for (const variable of variablesList) {
    variable.obj[variable.property] = variable.value();
  }
};
