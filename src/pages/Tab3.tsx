
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
  IonSpinner,
} from '@ionic/react';
import './Tab3.css';
import MedicalNavigation from '../components/MedicalNavigation';

interface Place {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  class?: string;
  category?: string;
}

const medicalKeywords = [
  'hospital',
  'hospitales',
  'clinica',
  'clinicas',
  'clínica',
  'clínicas',
  'centro medico',
  'centros medicos',
  'centro médico',
  'centros médicos',
  'consultorio',
  'consultorios',
  'centro de salud',
  'centros de salud',
  'medical center',
  'health center',
  'healthcare',
  'doctor',
  'doctores',
  'médico',
  'medico',
  'médicos',
  'medicos',
  'pediatria',
  'pediatría',
  'cardiologia',
  'cardiología',
  'dentista',
  'dentistas',
  'odontologia',
  'odontología',
  'urgencias',
  'laboratorio clinico',
  'laboratorio clínico',
];

const Tab3: React.FC = () => {
  const [search, setSearch] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isMedicalSearch = (value: string) => {
    const normalized = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    return medicalKeywords.some((keyword) => {
      const normalizedKeyword = keyword
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

      return normalized.includes(normalizedKeyword);
    });
  };

  const searchPlaces = async () => {
    const term = search.trim();

    if (!term) {
      setPlaces([]);
      setMessage('Escribe el nombre de un hospital o clínica.');
      return;
    }

    if (!isMedicalSearch(term)) {
      setPlaces([]);
      setMessage(
        'Solo puedes buscar hospitales, clínicas, consultorios o centros médicos. Incluye ese tipo de lugar en tu búsqueda.'
      );
      return;
    }

    setLoading(true);
    setMessage('');
    setPlaces([]);

    try {
      const params = new URLSearchParams({
        q: term,
        format: 'jsonv2',
        limit: '10',
        addressdetails: '1',
      });

      const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data: Place[] = await response.json();

      const medicalResults = data.filter((place) => {
        const category = (
          place.category ??
          place.class ??
          ''
        ).toLowerCase();
        const type = (place.type ?? '').toLowerCase();

        return (
          category === 'healthcare' ||
          (category === 'amenity' &&
            [
              'hospital',
              'clinic',
              'doctors',
              'dentist',
              'doctors_office',
            ].includes(type)) ||
          [
            'hospital',
            'clinic',
            'doctors',
            'dentist',
            'healthcare',
            'medical_centre',
            'medical_center',
            'health_centre',
            'health_center',
          ].includes(type)
        );
      });

      setPlaces(medicalResults);

      if (medicalResults.length === 0) {
        setMessage(
          'No se encontraron centros médicos con ese nombre. Intenta con otro nombre o ciudad.'
        );
      }
    } catch (error) {
      console.error('Error al consultar OpenStreetMap:', error);
      setMessage(
        'No se pudo consultar el servicio. Revisa tu conexión e inténtalo más tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="app-toolbar">
          <IonTitle>Centros médicos</IonTitle>
        </IonToolbar>
        <MedicalNavigation />
      </IonHeader>

      <IonContent className="app-content">
        <div className="page-container">
          <div className="page-heading">
            <span className="medical-eyebrow">
              MEDICLOUD · UBICACIONES
            </span>
            <h1>Encuentra atención médica</h1>
            <p>
              Busca hospitales, clínicas y consultorios médicos
              mediante OpenStreetMap.
            </p>
          </div>

          <section className="app-card medical-search-card">
            <h2>¿Qué centro médico buscas?</h2>

            <p className="search-description">
              Introduce el nombre del lugar y la ciudad para
              localizar opciones disponibles.
            </p>

            <IonInput
              className="medical-search-input"
              label="Hospital, clínica o centro médico"
              labelPlacement="stacked"
              fill="outline"
              type="text"
              placeholder="Ej. Hospital en Valle de Santiago"
              value={search}
              onIonInput={(e) => setSearch(e.detail.value ?? '')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void searchPlaces();
                }
              }}
            />

            <IonButton
              className="medical-search-button"
              expand="block"
              onClick={searchPlaces}
              disabled={loading}
            >
              {loading ? 'Buscando...' : 'Buscar centros médicos'}
            </IonButton>

            {loading && (
              <div className="search-loading">
                <IonSpinner name="crescent" />
                <p>Buscando centros médicos...</p>
              </div>
            )}

            {message && (
              <IonText color={places.length > 0 ? 'success' : 'medium'}>
                <p className="search-message">{message}</p>
              </IonText>
            )}
          </section>

          {places.length > 0 && (
            <section className="medical-results">
              <div className="results-heading">
                <h2>Resultados</h2>
                <span>{places.length} lugares</span>
              </div>

              {places.map((place) => (
                <article
                  className="medical-place-card"
                  key={place.place_id}
                >
                  <div className="medical-place-icon">+</div>

                  <div className="medical-place-info">
                    <h3>{place.display_name}</h3>

                    <p>
                      {place.type
                        ? place.type.replaceAll('_', ' ')
                        : 'Centro médico'}
                    </p>

                    <a
                      href={`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=17/${place.lat}/${place.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver ubicación en el mapa →
                    </a>
                  </div>
                </article>
              ))}
            </section>
          )}

          <p className="medical-api-note">
            Los resultados dependen de la información disponible
            en OpenStreetMap. Confirma los datos y horarios directamente
            con el centro médico.
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
