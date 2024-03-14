import { ACTIONS } from './App'
import "./styles.css"

export default function NumberButtons({dispatch, digit}){
    return (
        <button className='digits' onClick={() => 
            dispatch({type: ACTIONS.ADD_NUMBER, params: {digit}})}>
                {digit}
        </button>
    )
} 