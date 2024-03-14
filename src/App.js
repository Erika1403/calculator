import { useReducer} from "react"
import "./styles.css"
import NumberButtons from "./NumberButtons"
import OperatorButtons from "./OperatorButtons"
import OtherButtons from "./OtherButton"

export const ACTIONS = {
  ADD_NUMBER: "add-number",
  CLEAR_ENTRY: "clear-entry",
  CLEAR: "clear",
  DELETE: "delete",
  CHOOSE_OPERATION: "choose-operation",
  SINGLE_OPERATION: "single-operation",
  CALCULATE: "calculate",
}


function reducer(state, {type, params}){
  switch(type){
    case ACTIONS.ADD_NUMBER:
      if(state.overwrite){
        return{
          ...state,
          currNum: params.digit,
          overwrite: false,
        }
      }
      if (params.digit === "0" && state.currNum === "0") return state
      if (params.digit === "." && state.currNum.includes(".")) return state
      return {
        ...state,
        currNum: `${state.currNum || ""}${params.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION:
      if(state.operator === "√")
      return {
        ...state,
        prevNum: compute(state.currNum, state.operator),
        input: state.input + state.currNum + params.operator,
        operator: params.operator,
        currNum: null,
      }
      if(state.operator === "²")
      return {
        ...state,
        prevNum: compute(state.prevNum, state.operator),
        input: state.input + params.operator,
        operator: params.operator,
        currNum: null,
      }
      if(state.currNum === null && state.prevNum === null){
        return state
      }
      if(state.prevNum === null){
        return{
          ...state,
          prevNum: state.currNum,
          operator: params.operator,
          input: state.currNum + params.operator,
          currNum: null,
        }
      }
    {/* statement for when the operator is pressed consecutively*/}
      if(state.currNum === null){
        return{
          ...state, 
          operator: params.operator,
          input: state.input.slice(0, -1) + params.operator,
        }
      }
      
      return{
        ...state,
        prevNum: calculate(state),
        operator: params.operator,
        input: state.input + state.currNum +  params.operator,
        currNum: null,
      }
    case ACTIONS.SINGLE_OPERATION:
      {/* Equation is still looks ugly but it is functional*/}
      if(state.currNum === null && params.signs === "√")
      return {
        ...state,
        input: state.input + "√",
        operator: state.operator + params.signs,
      }
      if(state.prevNum === null && params.signs === "x²")
      return {
        ...state,
        input: state.input + state.currNum + "²",
        prevNum: state.currNum,
        operator: "²",
        currNum: null,
      }
      
      if(state.currNum === null) return state

      return {
        ...state,
        currNum: compute(state.currNum, params.signs),
        operator: null,
      }
    
    case ACTIONS.CALCULATE:
      if(state.operator === "√")
      return {
        ...state,
        prevNum: state.currNum,
        currNum: compute(state.currNum, state.operator),
        history: [...state.history, state.input + state.currNum + "=" + compute(state.currNum, state.operator)],
        input: "",
        operator: null,
      }
      if(state.currNum === null || state.prevNum === null || state.operator === null){
        return state
      }

      return{
        ...state,
        overwrite: true,
        input: state.input + state.currNum,
        currNum: calculate(state),
        history: [...state.history, state.input + state.currNum + "=" + calculate(state)],
        input: "",
        prevNum: null,
        operator: null,
      }
    case ACTIONS.CLEAR_ENTRY:
      return{
        ...state,
        currNum: null,
      }
    case ACTIONS.CLEAR:
      return{
        ...state,
        currNum: null,
        prevNum: null,
        operator: null,
        input: "",
      }

    case ACTIONS.DELETE:
      if(state.overwrite){
        return{
          ...state,
          currNum: null,
          overwrite: false,
        }
      }
      if(state.currNum === null){
        return state
      }
      if(state.currNum.length === 1){
        return{
          ...state,
          currNum: null,
        }
      }

      return{
        ...state,
        currNum: state.currNum.slice(0, -1)
      }
  }
}

function compute(currNum, operator){
  const num = parseFloat(currNum)

  if(isNaN(num)) return ""

  let result = ""
  
  switch(operator){
    case "√":
      result = Math.sqrt(num);
      break
    case "²":
      result = Math.pow(num, 2);
      break
    case "+/-":
      result = num * -1;
      break
    case "%":
      result = num / 100;
      break
  }
  
  return result.toString()
}

function finish_operation(previous, current, operator){
  let result = ""
  switch(operator){
    case "+":
      result = previous + current
      break
    case "-":
      result = previous - current
      break
    case "*":
      result = previous*current
      break
    case "÷":
      result = previous/current
      break
  }
  return result.toString()
}

function calculate({currNum, prevNum, operator}){
  const current = parseFloat(currNum)
  const previous = parseFloat(prevNum)
  if(isNaN(previous) || isNaN(current)) return ""

  let result = ""

  if(operator.length > 1 && operator.includes("√")){
    const temp = Math.sqrt(current)
    let oper = operator.slice(0, -1)
    result = finish_operation(previous, temp, oper)
  }
  else {
    result = finish_operation(previous, current, operator)
  }

  return result
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}
const initialState = {
  currNum: null,
  prevNum: null,
  operator: null,
  input: "",
  history: [], 
};

function App() {
  const [{currNum, prevNum, operator, history}, dispatch] = useReducer(reducer, initialState)
  return (
    <div className="container">
      <div className="calculator">
      <div className="result">
        <div className="prev-number">{formatOperand(prevNum)}{operator}</div>
        <div className="current-number">{formatOperand(currNum)}</div>
      </div>
        <button className='others' onClick={() => dispatch({type: ACTIONS.CLEAR})}>C</button>
        <button className='others' onClick={() => dispatch({type: ACTIONS.CLEAR_ENTRY})}>CE</button>
        <button className='others' onClick={() => dispatch({type: ACTIONS.DELETE})}>Del</button>
        <OtherButtons signs="√" dispatch={dispatch}/>

        <OtherButtons signs="x²" dispatch={dispatch}/>
        <OtherButtons signs="+/-" dispatch={dispatch}/>
        <OtherButtons signs="%" dispatch={dispatch}/>
        <OperatorButtons operator="÷" dispatch={dispatch}/>

        <NumberButtons digit="7" dispatch={dispatch}/>
        <NumberButtons digit="8" dispatch={dispatch}/>
        <NumberButtons digit="9" dispatch={dispatch}/>
        <OperatorButtons operator="*" dispatch={dispatch}/>

        <NumberButtons digit="4" dispatch={dispatch}/>
        <NumberButtons digit="5" dispatch={dispatch}/>
        <NumberButtons digit="6" dispatch={dispatch}/>
        <OperatorButtons operator="-" dispatch={dispatch}/>

        <NumberButtons digit="1" dispatch={dispatch}/>
        <NumberButtons digit="2" dispatch={dispatch}/>
        <NumberButtons digit="3" dispatch={dispatch}/>
        <OperatorButtons operator="+" dispatch={dispatch}/>

        <NumberButtons digit="00" dispatch={dispatch}/>
        <NumberButtons digit="0" dispatch={dispatch}/>
        <NumberButtons digit="." dispatch={dispatch}/>
        <button className="spann" onClick={() => {dispatch({type: ACTIONS.CALCULATE})}}>=</button>
        
      </div>
      <div>
      <h2>History</h2>
      <div className="history">
        <ul>
          {history.map((entry, index) => (
            <p className="data" key={index}>{entry}</p>
          ))}
        </ul>
      </div>
      </div>
    </div>
  )
}

export default App;
