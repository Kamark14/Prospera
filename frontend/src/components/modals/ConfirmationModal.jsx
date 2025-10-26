// ConfirmationModal.jsx
import React, { useEffect } from 'react';
import styles from '../../styles/modals.module.css';

export default function ConfirmationModal({ isOpen, onClose, userName }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // 3 segundos
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`${styles['modal-overlay']} ${styles['top-center-modal']}`}>
      <div className={`${styles['modal-confirmation']} ${styles['success-modal']}`}>
        <div className={styles['confirmation-icon']}>
          <img 
            src="/src/assets/Img/check.png" 
            alt="Sucesso" 
            className={styles['confirmation-image']}
          />
        </div>
        <div className={styles['confirmation-content']}>
          <h3 className={styles['confirmation-title']}>
            Conta criada com <strong>Sucesso</strong>
          </h3>
          <p className={styles['confirmation-subtitle']}>
            {userName}!!!
          </p>
        </div>
      </div>
    </div>
  );
}