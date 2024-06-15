import { zodResolver } from "@hookform/resolvers/zod";
import { Play } from "phosphor-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
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
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<NewCycleFormType>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      minutesAmountInput: 0,
      task: "",
    },
  });
  console.log("ERRO", errors);
  function handleCreateNewCycle(data: NewCycleFormType) {
    console.log("DATA", data);
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmountInput,
    };

    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(newCycle.id);
    reset();
  }

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  console.log("ACTIVE", activeCycle);
  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
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
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton type="submit" disabled={!watch("task")}>
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}
