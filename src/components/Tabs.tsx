
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet
} from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';
import { Navigate, Route } from 'react-router-dom';

import { calendarOutline, listOutline, searchOutline } from 'ionicons/icons';

import Tab1 from '../pages/Tab1';
import Tab2 from '../pages/Tab2';
import Tab3 from '../pages/Tab3';

const Tabs: React.FC = () => {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/tabs/tab1" element={<Tab1 />} />
          
          <Route path="/tabs/tab2" element={<Tab2 />} />
          
          <Route path="/tabs/tab3" element={<Tab3 />} />

          <Route
          path="/tabs"
          element={<Navigate to="/tabs/tab1" replace />}
          />
          <Route
          path="*"
          element={<Navigate to="/tabs/tab1" replace />}
          />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tabs/tab1">
            <IonIcon icon={calendarOutline} />
            <IonLabel>Nueva cita</IonLabel>
          </IonTabButton>

          <IonTabButton tab="tab2" href="/tabs/tab2">
            <IonIcon icon={listOutline} />
            <IonLabel>Mis citas</IonLabel>
          </IonTabButton>

          <IonTabButton tab="tab3" href="/tabs/tab3">
            <IonIcon icon={searchOutline} />
            <IonLabel>Centros médicos</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default Tabs;
