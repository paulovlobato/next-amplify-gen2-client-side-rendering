"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

import "@aws-amplify/ui-react/styles.css";
import TodoCreateForm from "@/ui-components/TodoCreateForm";
import { Button } from "@aws-amplify/ui-react";

// generates data client using the Schema from BE
const client = generateClient<Schema>();

export default function TodoList() {
    const [ todos, setTodos ] = useState<Schema["Todo"][]>([]);

    async function listTodos() {
        const { data } = await client.models.Todo.list();
        setTodos(data);
    }

    async function handleCreateTodo() {
        const { errors, data: newTodo } = await client.models.Todo.create({
            // shows popup to enter title
            content: window.prompt("title"),
            done: false,
            priority: 'medium'
        })
        
        console.log(errors, newTodo);
    }

    async function handleDeleteTodo(id: string) {
        const { errors } = await client.models.Todo.delete({ id: id });

        if (errors) {
            console.error('Error deleting: ', errors);
        }
    }

    useEffect(() => {
        const sub = client.models.Todo.observeQuery().subscribe(({ items }) => setTodos([...items]));

        return () => sub.unsubscribe();
    }, []);

    return (
        <div>
            <h1>Todos</h1>
            <TodoCreateForm/>
            {/* <button onClick={handleCreateTodo}>Create</button> */}

            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        {todo.content}
                        <Button
                            onClick={() => handleDeleteTodo(todo.id)}
                            style={{ marginLeft: '10px' }}
                        >Delete</Button>
                        </li>
                ))}
            </ul>
        </div>
    );
}