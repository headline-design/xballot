import moon from "../images/icon-moon.svg";
import sun from "../images/icon-sun.svg";

const Toogle = ({ handleTheme }) => {
    return (
        <div>
            <img
                id="moon" 
                className="icon-toggle" 
                src={moon} 
                alt="icon-moon"
                onClick={handleTheme}
                ></img>
            <img 
                id="sun"
                className="icon-toggle" 
                src={sun} 
                alt="icon-sun"
                onClick={handleTheme}
                ></img>
        </div>
    )
}

export default Toogle;