import React, {useState, useRef, useEffect} from "react";
import './TwoFAModal.css';

const TwoFAModal = ({isOpen, onClose, onVerify, userEmail}) => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);

    useEffect(() => {
        if (isOpen) {
            setCode(['', '', '', '', '', '']);
            setError('');
            setTimeout(() =>{
                if (inputRefs.current[0]) {
                    inputRefs.current[0].focus();
                }
            }, 100);
        }
    }, [isOpen]);

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }

        if (newCode.every(digit => digit !== '') && index === 5) {
            handleVerify();
        }
    };

    const handleKeyDown = (index, e) => {
        if(e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    //Verificacion del codigo
    const handleVerify = async () => {
        const fullCode = code.join('');

        if(fullCode.length !== 6) {
            setError('Por favor ingresa los 6 digitos');
            return;
        }

        setLoading(true);
        setError('')

        try {
            await onVerify(fullCode);
            onClose();
        } catch (err) {
            setError('Codigo incorrecto. Intente de nuevo');
            setCode(['','','','','','']);
            if (inputRefs.current[0]){
                inputRefs.current[0].focus();
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Codigo de verificacion</h3>
                    <p>Se te mando un codigo a tu correo: <strong>{userEmail}</strong></p>
                </div>

                <div className="code-inputs">
                    {code.map((digit, index) =>(
                        <input
                            key={index}
                            ref={el => inputRefs.current[index] = el}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            disabled={loading}
                            className="code-input"
                        />
                    ))}
                </div>
                    {error && <div className="error-message">{error}</div>}

                    <div className="modal-actions">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="btn-cancel"
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={handleVerify}
                            disabled={loading || code.join('').length !== 6}
                            className="btn-verify"
                        >
                            {loading ? 'Verificando...' : 'Verificar'}
                        </button>
                    </div>
            </div>
        </div>
    );
};

export default TwoFAModal;