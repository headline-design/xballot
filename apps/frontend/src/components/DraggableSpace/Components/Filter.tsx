const Filter = ({ 
    itemsLeft, 
    clearCompleted,
    changeFilter }) => {
        
    return (
        <section className="filter-container">
                <div className="filter-box">

                    <p className="items-left"> { itemsLeft() } </p>
                    <p 
                        className="clear"
                        onClick={clearCompleted}> Clear Completed </p> 
                </div>
                <div className="mobile-box">
                    <p 
                        id="all" 
                        className="filter-item activated" 
                        onClick={changeFilter}>All</p>
                    <p 
                        id="active" 
                        className="filter-item" 
                        onClick={changeFilter}>Active</p>
                    <p 
                        id="completed" 
                        className="filter-item" 
                        onClick={changeFilter}>Completed</p> 
                </div>
        </section>
    )
}

export default Filter;