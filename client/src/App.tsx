import React from "react"
import "./App.css"
import { alert } from "./service"

const App: React.FC = () => {
  return (
    <div className="app">
      <button className="button" onClick={() => alert()}>
        Alert
      </button>
    </div>
  )
}

export default App
