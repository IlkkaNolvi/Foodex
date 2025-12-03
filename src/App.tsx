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

// Import Login and Signup pages
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

import RecipeDetails from './pages/RecipeDetails/RecipeDetails'
import Profile from './pages/Profile';

// Import existing Tab pages directly
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      {/* This main outlet handles high-level navigation: Login vs. Tabs area */}
      <IonRouterOutlet>

        {/* --- PUBLIC ROUTES (No bottom bar) --- */}
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        {/* Default redirect to login */}
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>

        {/* --- SINGLE RECIPE ROUTE --- */}
        <Route path="/recipe/:id">
          <RecipeDetails />
        </Route>

        {/* --- PRIVATE ROUTES (Tabs area) --- */}
        {/* All routes starting with /tabs render this section */}
        <Route path="/tabs">
          <IonTabs>
            <IonRouterOutlet>
              {/* Define which page appears in which tab */}
              <Route exact path="/tabs/tab1">
                <Tab1 />
              </Route>
              <Route exact path="/tabs/tab2">
                <Tab2 />
              </Route>
              <Route exact path="/tabs/tab3">
                <Tab3 />
              </Route>
              <Route exact path="/tabs/profile">
                <Profile />
              </Route>
              {/* If navigating to just /tabs, redirect to the first tab */}
              <Route exact path="/tabs">
                <Redirect to="/tabs/tab1" />
              </Route>
            </IonRouterOutlet>

            {/* Bottom navigation bar (visible only in this /tabs section) */}
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