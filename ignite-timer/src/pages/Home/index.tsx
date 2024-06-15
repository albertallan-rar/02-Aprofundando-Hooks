import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInSeconds } from "date-fns";
import { Play, Stop } from "phosphor-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from "./style";

// interface NewCycleFormType {
//   task: string;
//   minutesAmount: number;
// }

const newCycleFormValidationSchema = z.object({
  task: z.string(),
  minutesAmountInput: z.number(),
});

// Sempre que você for referenciar uma variavel JS dentro do TypeScript, necessita o uso do typeof pois o TypeScript não consegue entender a variavel JS de forma autonoma
type NewCycleFormType = z.infer<typeof newCycleFormValidationSchema>;
//Fazendo isso esse type pega a tipagem de dentro do schema e fazendo assim ele dinamico de acordo que o schema é alterado

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondPassed, setAmountSecondsPassed] = useState(0);
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormType>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      minutesAmountInput: 0,
      task: "",
    },
  });

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
  const currentSeconds = activeCycle ? totalSeconds - amountSecondPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, "0");
  const seconds = String(secondsAmount).padStart(2, "0");
  // PADSTART faz que quando se passa um tamanho especifico e o conteudo que ta
  // sendo entregue não tem tamanho suficiente para todo o tamanho designado, ele complete com 0

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        setAmountSecondsPassed(differenceInSeconds(new Date(), activeCycle.startDate));
      }, 1000);
    }
    // TODO RETURN DENTRO DE UM UseEffect é uma função
    return () => {
      clearInterval(interval);
    };
  }, [activeCycle]);

  useEffect(() => {
    if (activeCycle) {
      document.title = `Ignite Timer / ${minutes}:${seconds} `;
    }
  }, [activeCycle, minutes, seconds]);

  function handleCreateNewCycle(data: NewCycleFormType) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmountInput,
      startDate: new Date(),
    };

    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(newCycle.id);
    setAmountSecondsPassed(0);
    reset();
  }

  function handleInterruptCycle() {
    setCycles(
      cycles.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() };
        } else {
          return cycle;
        }
      }),
    );
    setActiveCycleId(null);
  }

  console.log("Cycles", cycles);
  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          {/* Quando se coloca !! ele vai converter o dado para um bolean, se tiver dado dentro é true senao é false */}
          <TaskInput
            disabled={!!activeCycle}
            type="text"
            list="task-suggestion"
            id="task"
            placeholder="Dê um nome para o seu projeto"
            {...register("task")}
          />
          <datalist id="task-suggestion">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
          </datalist>

          <label htmlFor="minutesAmount">durantes</label>
          <MinutesAmountInput
            disabled={!!activeCycle}
            step={5}
            min={5}
            max={60}
            type="number"
            id="minutesAmount"
            placeholder="00"
            {...register("minutesAmountInput", { valueAsNumber: true })}
          />
          {/* QUANDO FOR MEXER COM NUMERO NO REACT HOOK FORM PASSAR A PROPRIEDADE VALUESASNUMBER PARA QUE O NUMERO ENVIADO ENTRE "" SEJA PASSADO SEM AS ASPAS CONSERVANDO A TIPAGEM DE NUMBER, EVITANDO ASSIM O ERRO NO ZOD */}
          <span>minutos.</span>
        </FormContainer>
        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>
        {/* Pode-se passar posicionamento de um elemento para um numero igual em um vetor */}
        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <Stop size={24} />
            Parar
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={!watch("task")}>
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
