import React, { useRef } from 'react';

interface NewTodoProps {
    onAddTodo: (text: string) => void
}

const NewTodo: React.FC<NewTodoProps> = props => {
    const textInputRef = useRef<HTMLInputElement>(null);
    const todoSubmitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        const text = textInputRef.current!.value;
        props.onAddTodo(text);
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