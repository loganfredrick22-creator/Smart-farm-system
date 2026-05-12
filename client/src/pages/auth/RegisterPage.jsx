import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast('Use the Create Account tab to register', { icon: '📝' });
    navigate('/login', { replace: true });
  }, [navigate]);

  return null;
};

export default RegisterPage;
