'Npm install' pour les dépendances.

'Node index.js' ou 'npm start' pour lancer le serveur.

Le serveur, si lancer en local, tourne sur le port 8080.

Pour récuperer tous les parkings de Bordeaux en JSON -> 'http://localhost:8080/api/parkings/'

Pour récuperer tous les parkings proche de ma position, il suffit de rajouter la latitude/longitude séparé par un espace ->
'http://localhost:8080/api/parkings/{{MyLat MyLong}}'

La requete renvoie les parkings dans un cercle de 2 KMs (A VOL D'OISEAU) en fonction du parametre Latitude/Longitude.

exemple: GET -> 'http://localhost:8080/api/parkings/44.837788 -0.579180'

Pour changer la distance de renvoie des parkings proches, allez dans parkingModel.js, ligne 89, changez la valeur 2:
        -       if (parking.distance <= 2)      -       
