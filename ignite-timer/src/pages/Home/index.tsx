import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { CyclesContext } from "../../contexts/CyclesContext";
import { Countdown } from "./components/Countdown";
import { NewCycleForm } from "./components/NewCycleForm";
import { HomeContainer } from "./style";

const newCycleFormValidationSchema = z.object({
  task: z.string(),
  minutesAmountInput: z.number(),
});

// Sempre que você for referenciar uma variavel JS dentro do TypeScript, necessita o uso do typeof pois o TypeScript não consegue entender a variavel JS de forma autonoma
export type NewCycleFormType = z.infer<typeof newCycleFormValidationSchema>;
//Fazendo isso esse type pega a tipagem de dentro do schema e fazendo assim ele dinamico de acordo que o schema é alterado

export function Home() {
  const { createNewCycle } = useContext(CyclesContext);
  const newCycleForm = useForm<NewCycleFormType>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      minutesAmountInput: 0,
      task: "",
    },
  });

  const { handleSubmit, reset, watch } = newCycleForm;

  function handleCreateNewCycle(data: NewCycleFormType) {
    createNewCycle(data);
    reset();
  }

  const task = watch("task");
  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown task={task} />
      </form>
    </HomeContainer>
  );
}
