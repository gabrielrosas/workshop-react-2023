import { AiFillGithub, AiOutlineLoading3Quarters } from "react-icons/ai"
import { TbError404 } from "react-icons/tb"
import { MdError } from "react-icons/md"
import { useCallback, useEffect, useState } from "react"
import axios from "axios"
interface FieldProps {
  label: string
  placeholder: string
  onChange?: (v: string) => void
  value?: string,
  disabled?: boolean
}

function Field(props: FieldProps) {
  return (
    <div className="w-full mt-4 flex flex-col">
      <label className="font-semibold">{props.label}:</label>
      <input
        className="bg-gray-900 rounded p-2 mt-1 text-white outline-none w-full disabled:bg-gray-800 disabled:placeholder:text-gray-700"
        placeholder={props.placeholder}
        onChange={(event) => { if (props.onChange) props.onChange(event.target.value) }}
        value={props.value}
        disabled={props.disabled}
        autoComplete="off"
      />
    </div>
  )
}

interface TitleProps {
  title: string
}
function Title(props: TitleProps) {
  return (
    <h1 className="text-2xl font-semibold">{props.title}</h1>
  )
}

interface ButtonProps {
  onClick?: () => void
  label: string
}

function Button(props: ButtonProps) {
  return (
    <button
      className="mt-2 bg-gray-900 p-2 rounded active:bg-gray-800 font-semibold"
      onClick={props.onClick}
    >
      {props.label}
    </button>
  )
}

function SegmentError() {
  return (
    <div className="mt-6 w-full flex flex-row items-center justify-center bg-gray-800 rounded p-2">
      <MdError className="text-[35px] mr-3" />
      <span className="font-semibold text-xl">ERROR</span>
    </div>
  )
}

function Segment404() {
  return (
    <div className="mt-6 w-full flex flex-row items-center justify-center bg-gray-800 rounded p-2">
      <TbError404 className="text-[50px]" />
    </div>
  )
}

function SegmentLoading() {
  return (
    <div className="mt-6 w-full flex flex-row items-center justify-center bg-gray-800 rounded p-2">
      <AiOutlineLoading3Quarters className="text-[40px] animate-spin" />
    </div>
  )
}

interface IRepo {
  name: string,
  html_url: string,
  language?: string,
  description: string,
  node_id: string,
}

interface ItemProps {
  repo: IRepo
}

function Item(props: ItemProps) {
  const { repo } = props

  return (
    <a href={repo.html_url} className="flex flex-row w-full justify-between bg-gray-800 p-2 mt-6 rounded hover:outline hover:outline-white hover:cursor-pointer">
      <div className="flex flex-col w-[90%]">
        <h2 className="font-bold">{repo.name}</h2>
        <p className="text-sm text-gray-400">{repo.description}</p>
        {!!repo.language && (
          <span className="bg-gray-900 text-xs p-1 text-center rounded font-semibold mt-2 w-fit">{repo.language}</span>
        )}

      </div>
      <div className="w-[10%] flex justify-end">
        <AiFillGithub className="text-3xl" />
      </div>
    </a>
  )
}



type TStatus = "init" | "loading" | "200" | "404" | "error"

export function App() {
  const [fieldValue, setfieldValue] = useState<string>()
  const [status, setStatus] = useState<TStatus>("init")
  const [repos, setRepos] = useState<IRepo[]>([])

  useEffect(() => {
    if (status != "init") {
      setStatus("init")
    }
  }, [fieldValue])

  const carregar = useCallback(async () => {
    try {
      setStatus("loading")
      setRepos([])

      const response = await axios.get(`https://api.github.com/users/${fieldValue}/repos`)
      if (!!response.data && (response.data as IRepo[]).length > 0) {
        setRepos(response.data)

        setStatus("200")
      } else {
        setStatus("404")
      }

    } catch (error) {
      console.log(error)
      setStatus("error")
    }
  }, [fieldValue, status])


  return (
    <div className="flex justify-center items-center w-[100vw] min-h-[100vh] p-2 bg-gray-900">
      <div className="w-[400px] min-h-[200px] bg-gray-700 rounded flex flex-col items-start p-4 text-white">

        <Title title="Repositórios" />

        <Field
          label="Username"
          placeholder="insira o username"
          value={fieldValue}
          onChange={(v) => setfieldValue(v)}
          disabled={status === "loading"}
        />


        {status === "init" && (
          <Button label="Carregar" onClick={carregar} />
        )}
        {status === "404" && (
          <Segment404 />
        )}
        {status === "loading" && (
          <SegmentLoading />
        )}
        {status === "error" && (
          <SegmentError />
        )}
        {status === "error" && (
          <SegmentError />
        )}

        {status === "200" &&
          repos.map((repo) => (
            <Item key={repo.node_id} repo={repo} />
          ))
        }



      </div>
    </div>
  )
}
