// InvalidSearchModal.jsx
import React from 'react';
import styles from '../../styles/modals.module.css';

export default function InvalidSearchModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div className={`${styles['modal-overlay']} ${styles['top-center-modal']}`}>
      <div className={`${styles['modal-confirmation']} ${styles['error-modal']}`}>
        <div className={styles['confirmation-icon']}>
          <img 
            src="/src/assets/Img/x.png" 
            alt="Erro" 
            className={styles['confirmation-image']}
          />
        </div>
        <div className={styles['confirmation-content']}>
          <h3 className={styles['confirmation-title']}>
            Busca Incorreta ou
          </h3>
          <p className={styles['confirmation-subtitle']}>
            Não encontrada
          </p>
        </div>
        <button className={styles['close-button']} onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}