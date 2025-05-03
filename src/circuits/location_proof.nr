// GeoPrivacy Location Verification Circuit

// Haversine formula for distance calculation
// Adapted for Noir's field arithmetic
fn calculate_distance(
    lat1: Field, 
    lon1: Field, 
    lat2: Field, 
    lon2: Field
) -> Field {
    // Earth's radius in kilometers
    let R = 6371.0;

    // Convert degrees to radians
    let lat1_rad = lat1 * (std::math::PI / 180.0);
    let lon1_rad = lon1 * (std::math::PI / 180.0);
    let lat2_rad = lat2 * (std::math::PI / 180.0);
    let lon2_rad = lon2 * (std::math::PI / 180.0);

    // Differences
    let dlat = lat2_rad - lat1_rad;
    let dlon = lon2_rad - lon1_rad;

    // Haversine formula components
    let a = std::math::sin(dlat/2.0) * std::math::sin(dlat/2.0) +
            std::math::cos(lat1_rad) * std::math::cos(lat2_rad) *
            std::math::sin(dlon/2.0) * std::math::sin(dlon/2.0);
    
    let c = 2.0 * std::math::atan2(std::math::sqrt(a), std::math::sqrt(1.0 - a));

    // Distance in kilometers
    R * c
}

// Main circuit to verify location within a specified radius
fn main(
    user_lat: Field,     // User's latitude
    user_lon: Field,     // User's longitude
    center_lat: Field,   // Center point latitude
    center_lon: Field,   // Center point longitude
    max_radius: Field    // Maximum allowed radius in kilometers
) {
    // Calculate distance between user and center point
    let distance = calculate_distance(
        user_lat, 
        user_lon, 
        center_lat, 
        center_lon
    );

    // Verify that the distance is within the specified radius
    // This proves the user is within the area without revealing exact location
    assert(distance <= max_radius, "Location is outside specified radius");
}

// Optional: Add a function to generate a proof token
fn generate_location_token(
    user_lat: Field,
    user_lon: Field,
    center_lat: Field,
    center_lon: Field,
    max_radius: Field
) -> Field {
    // Create a unique token based on location proof
    let distance = calculate_distance(
        user_lat, 
        user_lon, 
        center_lat, 
        center_lon
    );

    // Hash of the distance as a proof token
    std::hash::pedersen([distance])
}
