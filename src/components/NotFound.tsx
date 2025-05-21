import { Link } from "react-router-dom"; 

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
            <h1 className="text-7xl font-bold text-blue-600">404</h1>
            <p className="text-2xl mt-4 text-gray-700 font-semibold">Page Not Found</p>
            <p className="text-gray-500 mt-2 max-w-md">Oops! The page you are looking for doesn't exist or has been moved.</p>
            <Link to="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">Go Back Home</Link>
        </div>
    );
};

export default NotFound;
