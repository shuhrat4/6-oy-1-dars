import { DeleteOutlined, EditOutlined, HeartOutlined, HeartFilled, SaveOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { useReducer, useState } from 'react';

const CREATE_TODO = 'CREATE';
const LIKE_TODO = 'LIKED';
const DELETE_TODO = 'DELETE';
const EDIT_TODO = 'EDIT';

function reducer(state, action) {
    switch (action.type) {
        case CREATE_TODO:
            return {
                ...state,
                todos: [...state.todos, action.payload],
            };
        case LIKE_TODO:
            const isAlreadyLiked = state.likedlist.some(item => item.id === action.payload.id);
            return {
                ...state,
                likedlist: isAlreadyLiked
                    ? state.likedlist.filter(item => item.id !== action.payload.id)
                    : [...state.likedlist, action.payload],
            };
        case DELETE_TODO:
            return {
                ...state,
                todos: state.todos.filter(item => item.id !== action.payload),
            };
        case EDIT_TODO:
            return {
                ...state,
                todos: state.todos.map(item =>
                    item.id === action.payload.id ? { ...item, value: action.payload.value } : item
                ),
            };
        default:
            return state;
    }
}


const initialState = {
    todos: [],
    likedlist: [],
};

function Todos() {
    const [data, dispatch] = useReducer(reducer, initialState);
    const [editId, setEditId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [newTodo, setNewTodo] = useState(''); 

    function handleSubmit(e) {
        e.preventDefault();
        if (newTodo.trim()) {
            const newValue = {
                id: Date.now(), 
                value: newTodo,
            };
            dispatch({ type: CREATE_TODO, payload: newValue });
            setNewTodo(''); 
        }
    }

    function handleEdit(item) {
        setEditId(item.id);
        setEditValue(item.value);
    }

    function handleSave(item) {
        if (editValue.trim()) {
            dispatch({ type: EDIT_TODO, payload: { id: item.id, value: editValue } });
            setEditId(null);
            setEditValue('');
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className='w-[500px] mx-auto flex items-center justify-between bg-white p-5 rounded-md mt-10'>
                <Input
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    className='w-[80%]'
                    placeholder='Add Todo'
                    size='large'
                    allowClear
                />
                <Button htmlType='submit' type='primary' size='large'>Submit</Button>
            </form>
            <ul className='w-[500px] mx-auto bg-white p-5 rounded-md mt-5'>
                {data.todos.map((item, index) => (
                    <li className='p-2 rounded-md flex items-center justify-between bg-slate-400' key={item.id}>
                        <div>
                            {editId === item.id ? (
                                <Input
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className='w-[80%]'
                                />
                            ) : (
                                `${index + 1}. ${item.value}`
                            )}
                        </div>
                        <div className='flex items-center gap-5'>
                            <button onClick={() => dispatch({ type: LIKE_TODO, payload: item })}>
                                {data.likedlist.some(likedItem => likedItem.id === item.id) ? (
                                    <HeartFilled style={{ color: 'red' }} />
                                ) : (
                                    <HeartOutlined />
                                )}
                            </button>
                            <button onClick={() => dispatch({ type: DELETE_TODO, payload: item.id })}>
                                <DeleteOutlined />
                            </button>
                            {editId === item.id ? (
                                <button onClick={() => handleSave(item)}>
                                    <SaveOutlined style={{ color: 'green' }} />
                                </button>
                            ) : (
                                <button onClick={() => handleEdit(item)}>
                                    <EditOutlined />
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default Todos;
