import { differenceInSeconds } from "date-fns";
import { ReactNode, createContext, useEffect, useReducer, useState } from "react";
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
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJSON = localStorage.getItem("@ignite-timer:cycless-state-1.0.0");

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON);
      }

      return initialState;
    },
  );
  const { activeCycleId, cycles } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const [amountSecondPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
    }
    return 0;
  });
  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState);

    localStorage.setItem("@ignite-timer:cycless-state-1.0.0", stateJSON);
  }, [cyclesState]);

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
  // Salvar no localstorage no navegador

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
