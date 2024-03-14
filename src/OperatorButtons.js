import { ACTIONS } from './App'
import "./styles.css"

export default function OperatorButtons({dispatch, operator}){
    return (
        <button className='operators' onClick={() => 
            dispatch({type: ACTIONS.CHOOSE_OPERATION, params: {operator}})}>
                {operator}
        </button>
    )
} 