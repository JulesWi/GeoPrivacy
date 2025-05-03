// Circuit Noir pour la preuve de localisation
// Vérifie qu'une localisation est dans une zone donnée sans révéler les coordonnées exactes

fn verify_location_proof(
    latitude: Field, 
    longitude: Field, 
    center_lat: Field, 
    center_lon: Field, 
    radius: Field
) -> bool {
    // Calcul de la distance entre deux points géographiques
    let dlat = latitude - center_lat;
    let dlon = longitude - center_lon;
    
    // Distance euclidienne (approximation simplifiée)
    let distance = (dlat * dlat + dlon * dlon).sqrt();
    
    // Vérification si le point est dans le rayon
    distance <= radius
}

// Point d'entrée du circuit
fn main(
    latitude: Field, 
    longitude: Field, 
    timestamp: Field
) -> bool {
    // Coordonnées du centre de Paris comme exemple
    let paris_lat = 48.8566;
    let paris_lon = 2.3522;
    let radius = 10.0; // rayon en km

    verify_location_proof(
        latitude, 
        longitude, 
        paris_lat, 
        paris_lon, 
        radius
    )
}
