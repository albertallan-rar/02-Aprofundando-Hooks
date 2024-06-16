import { differenceInSeconds } from "date-fns";
import { Play, Stop } from "phosphor-react";
import { useContext, useEffect } from "react";

import { CyclesContext } from "../../../../contexts/CyclesContext";
import { CountdownContainer, Separator, StartCountdownButton, StopCountdownButton } from "./styles";

interface CountdownProps {
  task: string;
}

export const Countdown = ({ task }: CountdownProps) => {
  const {
    activeCycle,

    amountSecondPassed,
    setActiveCycle,
    setSecondsPassed,
    markCurrentCycleAsFinished,
    markCurrentCycleAsInterrupted,
  } = useContext(CyclesContext);

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
        const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate);

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished();
          setSecondsPassed(totalSeconds);
          clearInterval(interval);
        } else {
          setSecondsPassed(secondsDifference);
        }
      }, 1000);
    }
    // TODO RETURN DENTRO DE UM UseEffect é uma função
    return () => {
      clearInterval(interval);
    };
  }, [activeCycle, markCurrentCycleAsFinished, setSecondsPassed, totalSeconds]);

  useEffect(() => {
    if (activeCycle) {
      document.title = `Ignite Timer / ${minutes}:${seconds} `;
    }
  }, [activeCycle, minutes, seconds]);

  function handleInterruptCycle() {
    markCurrentCycleAsInterrupted();
    setActiveCycle(null);
  }
  return (
    <div>
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
        <StartCountdownButton disabled={!task} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      )}
    </div>
  );
};

// disabled={!task}
