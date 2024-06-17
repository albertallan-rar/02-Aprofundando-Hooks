import { Cycle } from "../../contexts/CyclesContext";

export enum ActionTypes {
  ADD_NEW_CYCLE = "ADD_NEW_CYCLE",
  INTERRUPTED_CYCLE = "INTERRUPTED_CYCLE",
  FINISHED_CYCLE = "FINISHED_CYCLE",
}

export function addNewCycleAction(newCycle: Cycle) {
  return {
    type: ActionTypes.ADD_NEW_CYCLE,
    payload: {
      newCycle,
    },
  };
}

export function markCurrentCycleAsInterruptedAction() {
  return {
    type: ActionTypes.INTERRUPTED_CYCLE,
  };
}

export function markCurrentCycleAsFinishedAction() {
  return {
    type: ActionTypes.FINISHED_CYCLE,
  };
}
