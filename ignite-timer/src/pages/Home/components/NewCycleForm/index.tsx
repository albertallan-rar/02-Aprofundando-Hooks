import { useContext } from "react";

import { useFormContext } from "react-hook-form";

import { CyclesContext } from "../../../../contexts/CyclesContext";
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";

export const NewCycleForm = () => {
  const { activeCycle } = useContext(CyclesContext);
  const { register } = useFormContext();

  return (
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
        min={1}
        max={60}
        type="number"
        id="minutesAmount"
        placeholder="00"
        {...register("minutesAmountInput", { valueAsNumber: true })}
      />
      {/* QUANDO FOR MEXER COM NUMERO NO REACT HOOK FORM PASSAR A PROPRIEDADE VALUESASNUMBER PARA QUE O NUMERO ENVIADO ENTRE "" SEJA PASSADO SEM AS ASPAS CONSERVANDO A TIPAGEM DE NUMBER, EVITANDO ASSIM O ERRO NO ZOD */}
      <span>minutos.</span>
    </FormContainer>
  );
};
