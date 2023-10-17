import { useEffect, useState } from "react"

interface FieldProps {
  label: string
  placeholder: string
  onChange: (v: string) => void
}

function Field(props: FieldProps) {
  return (
    <div className="mt-2">
      <label>{props.label}</label>
      <input
        type="number"
        className="bg-gray-800 rounded p-2"
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  )
}

export function App() {
  const [peso, setPeso] = useState<number>()
  const [altura, setAltura] = useState<number>()
  const [resultado, setResultado] = useState<string>()


  const calc = () => {
    if (!!peso && !!altura) {
      const imc = peso / (altura * altura)
      setResultado(`Seu IMC é ${imc.toFixed(2)}`)
    } else {
      setResultado(undefined)
    }
  }

  useEffect(() => {
    calc()
  }, [peso, altura])


  return (
    <div className="bg-gray-950 flex  text-white flex-col justify-center items-start w-[100vw] h-[100vh] p-4">
      <h1 className="text-center w-full">Calculadora IMC</h1>

      <Field
        label="Peso"
        placeholder="insira seu peso"
        onChange={(v) => setPeso(Number(v))}
      />
      <Field
        label="Altura"
        placeholder="insira sua altura"
        onChange={(v) => setAltura(Number(v))}
      />

      {/* <button className="bg-gray-800 mt-4 p-2 rounded" onClick={calc}>
        Calcular
      </button> */}

      {!!resultado && (
        <h2>{resultado}</h2>
      )}
    </div >
  )
}
