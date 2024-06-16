import { createContext, useContext, useState } from "react";

// OBSERVAÇÃO: A TIPAGEM SO ESTA COM ANY PARA EXEMPLO NORMALMENTE SE PASSA A TIPAGEM
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CyclesContext = createContext({} as any);
// CRIADO O CONTEXTO

function NewCycleForm() {
  const { activeCycle, setActiveCycle } = useContext(CyclesContext);
  // CHAMADA DOS ITENS PASSADO PARA O CONTEXTO
  return (
    <h1>
      NewCycleForm: {activeCycle}
      <button
        onClick={() => {
          setActiveCycle(activeCycle + 1);
        }}
      >
        Alterar
      </button>
    </h1>
  );
}

function Countdown() {
  const { activeCycle } = useContext(CyclesContext);

  return <h1>Countdowm: {activeCycle}</h1>;
}

export function Home() {
  const [activeCycle, setActiveCycle] = useState(0);
  // VARIAVEIS PASSADAS PARA O CONTEXTO DEVE ESTAR NO COMPONENTE MAIS DISTANTE E QUE ABRAÇA TODOS OS COMPONENTES NECESSARIOS
  return (
    // PARA PASSAR AS VARIAVEIS DE ESTADO SE USA O .PROVIDER DO CONTEXTO PARA RECEBER
    <CyclesContext.Provider value={{ activeCycle, setActiveCycle }}>
      <div>
        <NewCycleForm />
        <Countdown />
      </div>
    </CyclesContext.Provider>
  );
}
