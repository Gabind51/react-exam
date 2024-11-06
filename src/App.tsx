import './App.css'
import Autocomplete from './Component/Autocomplete'

function App() {
  return (
    <>
      <div>2. Autocomplete User avec selection unique</div>
      <Autocomplete /> 
      <div>3. Autocomplete User avec selection multiple</div>
      <Autocomplete multiple={true} />
    </>
  )
}

export default App
