import { ACTIONS } from './App'
import "./styles.css"

export default function OtherButtons({dispatch, signs}){
    return (
        <button className='operators' onClick={() => 
            dispatch({type: ACTIONS.SINGLE_OPERATION, params: {signs}})}>
                {signs}
        </button>
    )
} 