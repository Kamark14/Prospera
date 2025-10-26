import React, { useState } from 'react';
import { useUser } from '../../components/UserContext';
import styles from '../../styles/modals.module.css';
import loguinho from '../../assets/Img/loguinho.png';

const EyeIcon = ({ ...props }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>  );
const EyeOffIcon = ({ ...props }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>  );

export default function RegisterModal({ isOpen, onClose, onRegisterSuccess, onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ 
    fullName: '', // Mantemos apenas o nome completo
    email: '', 
    password: ''
  });
  const { register } = useUser();

  if (!isOpen) return null;

  function handleChange(e) { 
    setForm({ ...form, [e.target.name]: e.target.value }); 
  }

  function handleSubmit(e) { 
    e.preventDefault(); 
    
    // Criar objeto de usuário
    const userData = {
      name: form.fullName, // Usamos o nome completo como nome de exibição
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      createdAt: new Date().toISOString()
    };
    
    // Registrar no context
    register(userData);
    
    // Chamar callback de sucesso
    onRegisterSuccess(form.fullName); 
    
    // Limpar formulário
    setForm({ fullName: '', email: '', password: '' }); 
  }

  function handleSwitchToLogin() {
    onClose();
    if (onSwitchToLogin) {
      onSwitchToLogin();
    }
  }

  return (
    <div className={styles['modal-overlay']} onClick={onClose}>
      <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
        <button className={styles['modal-close']} onClick={onClose} aria-label="Fechar modal">×</button>
        
        <div className={styles['modal-img-side']}>
          <img src={loguinho} alt="Logo Prospera" />
        </div>

        <div className={styles['modal-form-side']}>
          <div className={styles['form-container']}>
            <h2>Abra sua conta</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Nome
                <input 
                  name="fullName" 
                  type="text" 
                  required 
                  value={form.fullName} 
                  onChange={handleChange} 
                  placeholder="Digite seu nome" 
                />
              </label>
              
              <label>
                E-mail
                <input 
                  name="email" 
                  type="email" 
                  required 
                  value={form.email} 
                  onChange={handleChange} 
                  placeholder="Seu email" 
                />
              </label>
              
              <label>
                Senha
                <div className={styles['password-field']}>
                  <input 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    minLength={8} 
                    value={form.password} 
                    onChange={handleChange} 
                    placeholder="Crie uma senha forte" 
                  />
                  <button 
                    type="button" 
                    className={styles['toggle-password']} 
                    onClick={() => setShowPassword((v) => !v)} 
                    tabIndex={-1} 
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </label>
              
              <button type="submit" className={styles['btn-block']}>Cadastrar</button>
            </form>

            <div className={styles['form-switch']}>
              <p>
                Já tem uma conta?{' '}
                <button type="button" className={styles['form-link']} onClick={handleSwitchToLogin}>
                  Faça login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}