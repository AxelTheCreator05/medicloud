
import { useEffect, useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import './Tab2.css';
import MedicalNavigation from '../components/MedicalNavigation';

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: string;
}

const Tab2: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [message, setMessage] = useState('Cargando citas...');

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setAppointments([]);
      setMessage('Inicia sesión para consultar tus citas.');
      return;
    }

    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('uid', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      appointmentsQuery,
      (snapshot) => {
        const data = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        })) as Appointment[];

        setAppointments(data);
        setMessage(
          data.length === 0
            ? 'Todavía no tienes citas registradas.'
            : ''
        );
      },
      (error) => {
        console.error('Error al cargar citas:', error);
        setMessage('No se pudieron cargar las citas.');
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setMessage('No se pudo cerrar la sesión. Intenta de nuevo.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="app-toolbar">
          <IonTitle>Mis citas</IonTitle>
        </IonToolbar>
        <MedicalNavigation />
      </IonHeader>

      <IonContent className="app-content">
        <div className="page-container">
          <div className="page-heading">
            <span className="medical-eyebrow">MEDICLOUD · MI SALUD</span>
            <h1>Mis citas médicas</h1>
            <p>
              Consulta las citas que has registrado y revisa
              los datos de tus próximas consultas.
            </p>
          </div>

          {appointments.length > 0 ? (
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <article
                  className="appointment-card"
                  key={appointment.id}
                >
                  <div className="appointment-card-header">
                    <div>
                      <span className="appointment-label">
                        ESPECIALIDAD
                      </span>
                      <h2>{appointment.specialty}</h2>
                    </div>

                    <span className="appointment-status">
                      {appointment.status}
                    </span>
                  </div>

                  <div className="appointment-details">
                    <p>
                      <strong>Médico</strong>
                      <span>{appointment.doctor}</span>
                    </p>

                    <p>
                      <strong>Fecha</strong>
                      <span>{appointment.date}</span>
                    </p>

                    <p>
                      <strong>Hora</strong>
                      <span>{appointment.time}</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-appointments">
              <div className="empty-icon">+</div>
              <h2>Aún no tienes citas</h2>
              <p>{message}</p>
              <p>
                Entra en la pestaña Nueva cita para registrar
                tu primera consulta médica.
              </p>
            </div>
          )}

          <IonButton
            className="logout-button"
            expand="block"
            fill="outline"
            onClick={handleSignOut}
          >
            Cerrar sesión
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
