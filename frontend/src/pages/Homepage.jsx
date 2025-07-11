import { useNavigate } from 'react-router-dom';

 

export default function Homepage() {
    const navigate = useNavigate();
   return <div>
    <button onClick={() => navigate('/login')}>Login</button>
    <button onClick={() => navigate('/register/user')}>Register</button>
    <button onClick={() => navigate('/register/developer')}>developer</button>

    <button onClick={() => navigate('/admin')}>Admin</button>
    <button onClick={() => navigate('/login/developer')}>Developer login</button>
    <button onClick={() => navigate('/login/user')}>User login</button>
   </div>
}