import "../style/Home.css"

import React, { useEffect, useState, MouseEventHandler, KeyboardEventHandler, ChangeEventHandler } from "react"
import Axios from "axios"
import session from "./session"

export default function Home() {
  const [todoList, setTodoList] = useState<Todo[]>([])
  const [title, setTitle] = useState("")
  const refresh = () => {
    Axios.get<Todo[]>("/api/v1/todos")
      .then(x => {
        if (x.status === 200) {
          setTodoList(x.data || [])
        }
      })
      .catch(x => console.error(x))
  }
  const saveTodo: KeyboardEventHandler = e => {
    if (e.key === "Enter") {
      Axios.post("/api/v1/todos", { title })
        .then(x => {
          refresh()
          setTitle("")
        })
        .catch(x => console.error(x))
    }
  }
  const deleteTodo: MouseEventHandler<HTMLAnchorElement> = e => {
    const id = e.currentTarget.dataset.id
    if (!window.confirm("Are you sure?")) return
    Axios.delete(`/api/v1/todos/${id}`)
      .then(() => refresh())
      .catch(x => console.error(x))
  }
  const checkTodo: ChangeEventHandler<HTMLInputElement> = e => {
    const id = e.currentTarget.dataset.id
    Axios.put(`/api/v1/todos/${id}`, { completed: e.currentTarget.checked })
      .then(() => refresh())
      .catch(x => console.error(x))
  }
  const logOut = () => {
    Axios.get("/auth/logout")
      .then(x => {
        session.clear()
        window.location.reload();
      })
      .catch(e => console.log(e))
  }
  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className="container">
      <div className="header-container">
        <button className="logout-button" onClick={logOut}>Logout</button>
      </div>
      <table>
        <thead>
          <tr>
            <td colSpan={3}>
              <input type="text" className="input-todo" placeholder="Something to do? type here..."
                onChange={x => setTitle(x.currentTarget.value)}
                onKeyUp={saveTodo} value={title} />
            </td>
          </tr>
        </thead>
        <tbody>
          {
            todoList.map(x => <tr key={x.id}>
              <td className="check">
                <input checked={x.completed} onChange={checkTodo} data-id={x.id} type="checkbox" />
              </td>
              <td className={x.completed ? "completed" : ""}>{x.title}</td>
              <td className="delete">
                <a data-id={x.id} href="#" onClick={deleteTodo}>Delete</a>
              </td>
            </tr>)
          }
        </tbody>
      </table>
    </div>
  );
}