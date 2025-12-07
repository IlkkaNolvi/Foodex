import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, 
  IonTitle, IonList, IonItem, IonThumbnail, IonLabel, IonIcon, IonButton,
  useIonViewWillEnter, useIonToast 
} from '@ionic/react';
import { trashOutline, timeOutline } from 'ionicons/icons';
import { getFavorites, removeFavorite } from '../../services/favoritesService';
import { Recipe } from '../../interfaces/recipe';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [presentToast] = useIonToast();

  // Load favorites every time the view is entered
  useIonViewWillEnter(() => {
    setFavorites(getFavorites());
  });

  const handleDelete = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation(); // Prevent clicking the item itself
    e.preventDefault(); // ignore the default navigation behavior of the parent element
    removeFavorite(id);
    setFavorites(getFavorites()); // Refresh list
    presentToast({ message: 'Removed from favorites', duration: 1500 });
  };

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/profile" text="" color="dark" />
          </IonButtons>
          <IonTitle>My Favorites</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {favorites.length === 0 ? (
          <div className="ion-text-center ion-padding" style={{ marginTop: '50px', color: '#888' }}>
            <h3>No favorites yet</h3>
            <p>Save recipes here by clicking the heart icon.</p>
          </div>
        ) : (
          <IonList>
            {favorites.map(recipe => (
              <IonItem key={recipe.id} button routerLink={`/recipe/${recipe.id}`} detail={false}>
                <IonThumbnail slot="start" style={{width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden'}}>
                  <img src={recipe.image} alt={recipe.title} style={{objectFit: 'cover', width: '100%', height: '100%'}} />
                </IonThumbnail>
                <IonLabel>
                  <h2 style={{fontWeight: 'bold'}}>{recipe.title}</h2>
                  <p style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                    <IonIcon icon={timeOutline} style={{fontSize: '14px'}}/> 
                    {recipe.readyInMinutes} min
                  </p>
                </IonLabel>
                <IonButton fill="clear" color="medium" slot="end" onClick={(e) => handleDelete(e, recipe.id)}>
                   <IonIcon icon={trashOutline} />
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Favorites;