import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, searchOutline, calendarOutline, personOutline } from 'ionicons/icons';

import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

import RecipeDetail from './pages/RecipeDetails/RecipeDetails';
import Profile from './pages/Profile';

// --- LISÄÄ NÄMÄ IMPORTIT ---
import Favorites from './pages/Favorites/Favorites';
import EditProfile from './pages/EditProfile/EditProfile';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
// ---------------------------

import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>

        {/* --- JULKISET REITIT --- */}
        <Route exact path="/login"><Login /></Route>
        <Route exact path="/signup"><Signup /></Route>
        <Route exact path="/"><Redirect to="/login" /></Route>

        {/* --- YKSITTÄISET SIVUT (TABS-ALUEEN ULKOPUOLELLA) --- */}
        
        <Route path="/recipe/:id"><RecipeDetail /></Route>

        {/* Nämä sivut toimivat nyt, kun importit on lisätty ylös */}
        <Route exact path="/profile/favorites"><Favorites /></Route>
        <Route exact path="/profile/edit"><EditProfile /></Route>
        <Route exact path="/profile/about"><About /></Route>
        <Route exact path="/profile/contact"><Contact /></Route>


        {/* --- TABS ALUE --- */}
        <Route path="/tabs">
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/tabs/tab1"><Tab1 /></Route>
              <Route exact path="/tabs/tab2"><Tab2 /></Route>
              <Route exact path="/tabs/tab3"><Tab3 /></Route>
              
              {/* Profile Main Page */}
              <Route exact path="/tabs/profile"><Profile /></Route>

              <Route exact path="/tabs"><Redirect to="/tabs/tab1" /></Route>
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
              <IonTabButton tab="tab1" href="/tabs/tab1">
                <IonIcon aria-hidden="true" icon={homeOutline} />
                <IonLabel>Home</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab2" href="/tabs/tab2">
                <IonIcon aria-hidden="true" icon={searchOutline} />
                <IonLabel>Search</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab3" href="/tabs/tab3">
                <IonIcon aria-hidden="true" icon={calendarOutline} />
                <IonLabel>Planner</IonLabel>
              </IonTabButton>
              <IonTabButton tab="profile" href="/tabs/profile">
                <IonIcon aria-hidden="true" icon={personOutline} />
                <IonLabel>Profile</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </Route>

      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;