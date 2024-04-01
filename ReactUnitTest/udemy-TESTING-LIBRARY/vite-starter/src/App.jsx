import {useState} from 'react'
import { kebabCaseToTitleCase } from './helpers'
function App() {
  const [buttonColor, setButtonColor] = useState('medium-violet-red')
  const [isButtonEnabled, setIsButtonEnabled] = useState(true)
  const nextColor = buttonColor === 'medium-violet-red' ? 'midnight-blue' : 'medium-violet-red'
  const nextColorTitleCase = kebabCaseToTitleCase(nextColor)
  const className = !isButtonEnabled ? "gray" : buttonColor

  return (
    <div className="container">
      <button
        className={className}
        onClick={() => setButtonColor(nextColor)}
        disabled={!isButtonEnabled}
      >
        Change to {nextColorTitleCase}
      </button>
      <input
        type="checkbox"
        onClick={() => setIsButtonEnabled(!isButtonEnabled)}
        value ={!isButtonEnabled}
        id="disable-button-checkbox"
      />
      <label htmlFor='disabled-button-checkbox'> Disable Button</label>
    </div>
  );
}

export default App;
