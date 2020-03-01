import React, { useRef } from 'react';

const NewTodo: React.FC = () => {
    const textInputRef = useRef<HTMLInputElement>(null);
    const todoSubmitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        const text = textInputRef.current?.value;
        console.log(text);
    };

    return (
        <form onSubmit={todoSubmitHandler}>
            <div>
                <label htmlFor="">Todo Text</label>
                <input type="text" id="todo-text" ref={textInputRef}/>
            </div>

            <button type="submit">ADD TODO</button>
        </form>
    );
};

export default NewTodo;