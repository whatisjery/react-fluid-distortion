import { Link, Outlet } from 'react-router-dom';
import Canvas from './Canvas';
import Github from '@/assets/github-mark-white.svg';

const Layout = () => {
    return (
        <>
            <div className='layout'>
                <a target='_blank' href='https://github.com/whatisjery/post-fluid-distortion'>
                    <img className='icon' src={Github} alt='icon' />
                </a>

                <nav className='nav'>
                    <Link to='/'>exemple1</Link>
                    <Link to='/exemple2'>exemple2</Link>
                    <Link to='/exemple3'>exemple3</Link>
                </nav>
            </div>

            <Canvas />
            <Outlet />
        </>
    );
};

export default Layout;
