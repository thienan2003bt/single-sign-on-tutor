import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increaseCounter, decreaseCounter } from '../../redux/action/counterAction';

function HomePage(props) {
    const dispatch = useDispatch();
    const count = useSelector(state => state.counter.count);


    return (
        <div>
            <div>Count: {count}</div>
            <button onClick={() => dispatch(increaseCounter())}
                className='btn btn-primary mx-3'>Increase</button>
            <button onClick={() => dispatch(decreaseCounter())}
                className='btn btn-secondary mx-3'>Decrease</button>
        </div>
    );
}

export default HomePage;