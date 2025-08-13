
import style from './Modal.module.scss';
export default function Modal({ children, onClose }) {
    return (
      <div className={style.modalOverlay} onClick={onClose}>
        <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
          <button className={style.closeButton} onClick={onClose}>×</button>
          {children}
        </div>
      </div>
    );
  }
  