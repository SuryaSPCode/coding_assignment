import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const CompanyDetails = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);

    const customMarker = new L.Icon({
      iconUrl: "https://png.pngtree.com/png-clipart/20191120/original/pngtree-map-location-marker-icon-in-red-png-image_5004115.jpg", // Replace with your marker image path
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await axios.get(`http://localhost:8085/api/companies/${id}`);
                console.log("RESPONSE", response.data.data);
                setCompany(response.data.data);
            } catch (error) {
                console.error("Error fetching company details:", error);
            }
        };

        fetchCompany();
    }, []);

    if (!company) return <p>Loading...</p>;

    return (
        <div>
            <h2>{company.name}</h2>
            <p>{company.address}</p>

            <MapContainer 
                center={[company.lat, company.lng]} 
                zoom={15} 
                style={{ height: "400px", width: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[company.lat, company.lng]} icon={customMarker}>
                    <Popup>{company.name}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default CompanyDetails;
