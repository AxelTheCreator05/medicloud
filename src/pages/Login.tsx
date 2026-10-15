
import { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonInput,
  IonPage,
  IonText,
} from '@ionic/react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [register, setRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccess = async () => {
    if (!email.trim() || !password) {
      setMessage('Completa el correo y la contraseña.');
      return;
    }

    if (register && password.length < 8) {
      setMessage('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (register) {
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      } else {
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      }
    } catch (error) {
      console.error('Error de autenticación:', error);

      setMessage(
        register
          ? 'No se pudo crear la cuenta. Verifica el correo y la contraseña.'
          : 'No se pudo iniciar sesión. Revisa tus datos.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="login-content">
        <div className="login-brand">
          <img
            className="login-image"
            src="/assets/medicloud-login.png"
            alt="MediCloud, gestión de citas médicas"
          />

          <div className="login-brand-name">MediCloud</div>

          <div className="login-brand-subtitle">
            Tu salud, más cerca
          </div>
        </div>

        <div className="login-container">
          <div className="login-heading">
            <span className="login-eyebrow">
              {register ? 'ÚNETE A MEDICLOUD' : 'BIENVENIDO'}
            </span>

            <h1>{register ? 'Crear cuenta' : 'Bienvenido'}</h1>

            <p>
              {register
                ? 'Crea tu cuenta para organizar tus citas médicas.'
                : 'Gestiona tus citas médicas desde un solo lugar.'}
            </p>
          </div>

          <div className="login-fields">
            <IonInput
              className="login-field"
              label="Correo electrónico"
              labelPlacement="stacked"
              type="email"
              fill="outline"
              value={email}
              onIonInput={(e) => setEmail(e.detail.value ?? '')}
              placeholder="tucorreo@ejemplo.com"
              autocomplete="email"
              required
            />

            <IonInput
              className="login-field"
              label="Contraseña"
              labelPlacement="stacked"
              type="password"
              fill="outline"
              value={password}
              onIonInput={(e) => setPassword(e.detail.value ?? '')}
              placeholder="Mínimo 8 caracteres"
              autocomplete={register ? 'new-password' : 'current-password'}
              required
            />
          </div>

          <IonButton
            className="login-submit"
            expand="block"
            onClick={handleAccess}
            disabled={loading}
          >
            {loading
              ? 'Procesando...'
              : register
                ? 'Crear mi cuenta'
                : 'Iniciar sesión'}
          </IonButton>

          <div className="login-switch">
            <span>
              {register
                ? '¿Ya tienes una cuenta?'
                : '¿Eres nuevo en MediCloud?'}
            </span>

            <IonButton
              fill="clear"
              onClick={() => {
                setRegister(!register);
                setMessage('');
              }}
            >
              {register ? 'Iniciar sesión' : 'Crear una cuenta'}
            </IonButton>
          </div>

          {message && (
            <IonText color="danger">
              <p className="login-message">{message}</p>
            </IonText>
          )}

          <p className="login-footer">
            MediCloud · Gestión de citas médicas
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
