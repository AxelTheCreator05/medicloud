
import { IonIcon } from '@ionic/react';
import {
  calendarOutline,
  clipboardOutline,
  medkitOutline,
} from 'ionicons/icons';
import { NavLink } from 'react-router-dom';
import './MedicalNavigation.css';

const MedicalNavigation: React.FC = () => {
  return (
    <nav className="medical-navigation" aria-label="Navegación principal">
      <div className="medical-navigation-inner">
        <NavLink
          to="/tabs/tab1"
          className={({ isActive }) =>
            `medical-nav-link ${isActive ? 'active' : ''}`
          }
        >
          <IonIcon icon={calendarOutline} />
          <span>Nueva cita</span>
        </NavLink>

        <NavLink
          to="/tabs/tab2"
          className={({ isActive }) =>
            `medical-nav-link ${isActive ? 'active' : ''}`
          }
        >
          <IonIcon icon={clipboardOutline} />
          <span>Mis citas</span>
        </NavLink>

        <NavLink
          to="/tabs/tab3"
          className={({ isActive }) =>
            `medical-nav-link ${isActive ? 'active' : ''}`
          }
        >
          <IonIcon icon={medkitOutline} />
          <span>Centros médicos</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default MedicalNavigation;
