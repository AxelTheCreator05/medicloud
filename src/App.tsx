import { useEffect, useState } from 'react';
import {
  IonApp,
  IonContent,
  IonLoading,
} from '@ionic/react';

import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase';

import Login from './pages/Login';
import Tabs from './components/Tabs';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
       setUser(currentUser);
       setChecking(false);
      }
    );

    return () => unsubscribe();
  }, []);

    if (checking) {
    return (
      <IonApp>
        <IonLoading isOpen message="Cargando..." />
      </IonApp>
    );
  }

  return (
    <IonApp>
      {user ? <Tabs /> : <Login />}
    </IonApp>
  );
};

export default App;