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
        <div className="bg-gradient-to-r from-blue-400 to-purple-500 min-h-screen flex flex-col items-center py-10">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-white shadow-lg p-6 rounded-lg flex items-center justify-between mb-6"
            >
                <Input
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    className="w-[70%] mr-4"
                    placeholder="Add a new task"
                    size="large"
                    allowClear
                    style={{
                        borderRadius: '30px',
                        borderColor: '#40a9ff',
                    }}
                />
                <Button
                    htmlType="submit"
                    type="primary"
                    size="large"
                    style={{
                        backgroundColor: '#1890ff',
                        borderColor: '#1890ff',
                        borderRadius: '30px',
                    }}
                >
                    Add Task
                </Button>
            </form>
            <ul className="w-full max-w-lg">
                {data.todos.map((item, index) => (
                    <li
                        key={item.id}
                        className="bg-white shadow-md p-4 rounded-lg flex items-center justify-between mb-4 hover:shadow-lg transition-shadow duration-300 ease-in-out"
                    >
                        <div className="flex-1 text-lg font-semibold text-gray-800">
                            {editId === item.id ? (
                                <Input
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="w-full"
                                    style={{ borderRadius: '30px', borderColor: '#40a9ff' }}
                                />
                            ) : (
                                <span>{`${index + 1}. ${item.value}`}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => dispatch({ type: LIKE_TODO, payload: item })}
                                className="text-red-500 hover:text-red-600 transition-colors"
                                aria-label="Like"
                            >
                                {data.likedlist.some(likedItem => likedItem.id === item.id) ? (
                                    <HeartFilled />
                                ) : (
                                    <HeartOutlined />
                                )}
                            </button>
                            <button
                                onClick={() => dispatch({ type: DELETE_TODO, payload: item.id })}
                                className="text-gray-600 hover:text-gray-800 transition-colors"
                                aria-label="Delete"
                            >
                                <DeleteOutlined />
                            </button>
                            {editId === item.id ? (
                                <button
                                    onClick={() => handleSave(item)}
                                    className="text-green-500 hover:text-green-600 transition-colors"
                                    aria-label="Save"
                                >
                                    <SaveOutlined />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="text-blue-500 hover:text-blue-600 transition-colors"
                                    aria-label="Edit"
                                >
                                    <EditOutlined />
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Todos;
