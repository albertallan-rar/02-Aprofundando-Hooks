import { ReactNode, createContext, useReducer, useState } from "react";
import {
  addNewCycleAction,
  markCurrentCycleAsFinishedAction,
  markCurrentCycleAsInterruptedAction,
} from "../reducers/cycles/action";
import { cyclesReducer } from "../reducers/cycles/reducer";

interface CreateCycleData {
  task: string;
  minutesAmountInput: number;
}

export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  amountSecondPassed: number;
  createNewCycle: (data: CreateCycleData) => void;
  setSecondsPassed: (seconds: number) => void;
  markCurrentCycleAsFinished: () => void;
  markCurrentCycleAsInterrupted: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

interface CyclesContextProviderProps {
  children: ReactNode;
}

export interface CyclesState {
  cycles: Cycle[];
  activeCycleId: string | null;
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  });
  const [amountSecondPassed, setAmountSecondsPassed] = useState(0);

  const { activeCycleId, cycles } = cyclesState;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction());
  }

  function markCurrentCycleAsInterrupted() {
    dispatch(markCurrentCycleAsInterruptedAction());
  }

  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmountInput,
      startDate: new Date(),
    };
    // OS nomes Type e Payload é um padrão seguido pela comunidade, pode ser chamado do que quiser
    dispatch(addNewCycleAction(newCycle));

    setAmountSecondsPassed(0);
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        amountSecondPassed,
        createNewCycle,
        setSecondsPassed,
        markCurrentCycleAsFinished,
        markCurrentCycleAsInterrupted,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
