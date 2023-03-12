import React, { useState, useContext } from "react";
import { TodoContext } from "../../state/todo/todo-context";
import { TodoActions } from "../../state/todo/todo.reducer";

export const Todo = () => {
  const [input, setInput] = useState("");
  const { todoState, todoDispatch } = useContext(TodoContext);

  const onInput = (event) => {
    console.log(event.target.value);
    setInput(event.target.value);
  };

  const addTodo = () => {
    todoDispatch({
      type: TodoActions.ADD,
      todo: { title: input, isComplete: false },
    });

    setInput("");
  };

  const toggleChecked = (todo) => {
    todoDispatch({
      type: TodoActions.TOGGLE,
      todo,
    });
  };

  return (
    <div>
      <h1>Todos</h1>
      <input onInput={onInput} value={input} />
      <button onClick={addTodo}>Add</button>
      {todoState.todos.map((todo, index) => (
        <p key={index}>
          <input
            type="checkbox"
            checked={todo.isComplete}
            onChange={() => toggleChecked(todo)}
          />
          {todo.title}
        </p>
      ))}
    </div>
  );
};
