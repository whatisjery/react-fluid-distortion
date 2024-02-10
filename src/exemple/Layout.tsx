import { Link, Outlet } from 'react-router-dom';
import Canvas from './Canvas';

const Layout = () => {
    return (
        <>
            <div className='layout'>
                <div className='title'>react three fiber</div>

                <nav className='nav'>
                    <Link to='/'>exemple1</Link>
                    <Link to='/exemple2'>exemple2</Link>
                </nav>
            </div>

            <Canvas />
            <Outlet />
        </>
    );
};

export default Layout;
