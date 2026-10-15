
import { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText,
} from '@ionic/react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import './Tab1.css';
import MedicalNavigation from '../components/MedicalNavigation';

const specialties = [
  'Medicina general',
  'Cardiología',
  'Dermatología',
  'Pediatría',
  'Ginecología',
  'Oftalmología',
  'Odontología',
  'Traumatología',
];

const Tab1: React.FC = () => {
  const [doctor, setDoctor] = useState('');
  const [specialty, setSpecialty] = useState('Medicina general');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const saveAppointment = async () => {
    const user = auth.currentUser;

    if (!user) {
      setMessage('Debes iniciar sesión para registrar una cita.');
      return;
    }

    if (!doctor.trim() || !date || !time || !specialty) {
      setMessage('Completa todos los campos.');
      return;
    }

    const appointmentDate = new Date(`${date}T${time}`);

    if (
      Number.isNaN(appointmentDate.getTime()) ||
      appointmentDate.getTime() <= Date.now()
    ) {
      setMessage('Selecciona una fecha y hora futuras.');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      await addDoc(collection(db, 'appointments'), {
        uid: user.uid,
        doctor: doctor.trim(),
        specialty,
        date,
        time,
        status: 'Pendiente',
        createdAt: Timestamp.now(),
      });

      setDoctor('');
      setDate('');
      setTime('');
      setSpecialty('Medicina general');
      setMessage('¡Tu cita se guardó correctamente!');
    } catch (error) {
      console.error('Error al guardar la cita:', error);
      setMessage('No se pudo guardar la cita. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="app-toolbar">
          <IonTitle>Nueva cita</IonTitle>
        </IonToolbar>
        <MedicalNavigation />
      </IonHeader>

      <IonContent className="app-content">
        <div className="page-container">
          <div className="page-heading">
            <span className="medical-eyebrow">MEDICLOUD · SALUD</span>
            <h1>Solicitar cita médica</h1>
            <p>
              Programa tu próxima consulta completando los datos
              y seleccionando una especialidad.
            </p>
          </div>

          <section className="app-card appointment-form">
            <h2 className="form-section-title">1. Datos de la consulta</h2>

            <IonInput
              className="form-field"
              label="Nombre del médico"
              labelPlacement="stacked"
              fill="outline"
              value={doctor}
              onIonInput={(e) => setDoctor(e.detail.value ?? '')}
              placeholder="Ej. Dra. Ana López"
              required
            />

            <div className="specialty-heading">
              <h3>2. Especialidad médica</h3>
              <p>Selecciona una opción</p>
            </div>

            <div className="specialty-grid">
              {specialties.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`specialty-option ${
                    specialty === item ? 'selected' : ''
                  }`}
                  onClick={() => setSpecialty(item)}
                  aria-pressed={specialty === item}
                >
                  <span className="specialty-check">
                    {specialty === item ? '✓' : '+'}
                  </span>
                  <span>{item}</span>
                </button>
              ))}
            </div>

            <div className="form-section-title date-section-title">
              3. Fecha y hora
            </div>

            <div className="form-grid">
              <IonInput
                className="form-field"
                label="Fecha"
                labelPlacement="stacked"
                fill="outline"
                type="date"
                value={date}
                min={new Date().toLocaleDateString('en-CA')}
                onIonChange={(e) => setDate(e.detail.value ?? '')}
                required
              />

              <IonInput
                className="form-field"
                label="Hora"
                labelPlacement="stacked"
                fill="outline"
                type="time"
                value={time}
                onIonChange={(e) => setTime(e.detail.value ?? '')}
                required
              />
            </div>

            <div className="selected-specialty">
              <span>Especialidad seleccionada</span>
              <strong>{specialty}</strong>
            </div>

            <IonButton
              className="save-appointment-button"
              expand="block"
              onClick={saveAppointment}
              disabled={saving}
            >
              {saving ? 'Guardando cita...' : 'Guardar cita'}
            </IonButton>

            {message && (
              <IonText
                color={message.startsWith('¡') ? 'success' : 'danger'}
              >
                <p className="form-message">{message}</p>
              </IonText>
            )}
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
