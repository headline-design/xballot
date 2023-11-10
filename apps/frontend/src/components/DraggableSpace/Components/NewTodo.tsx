const NewTodo = ({ handleNewTodo, addTodo }) => {
    return (
        <section className="todo-container">
            <div className="todo-box">
                <label className="radio-container">
                    <div className="top-radio"></div>
                </label>
            

                <input className="todo-input"
                    type="text"
                    placeholder="Create a new todo..."
                    onChange={handleNewTodo}
                    onKeyDown={addTodo}
                ></input>
            </div>
        </section>
    )
}

export default NewTodo;