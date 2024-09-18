import "./index.css";
import { ThreeDots } from 'react-loader-spinner';

const Loaderr = () => {
    return (
        <div className="loader-container" data-testid="loader">
            <ThreeDots color="#0b69ff" height={50} width={50} />
        </div>
    );
}

export default Loaderr;
