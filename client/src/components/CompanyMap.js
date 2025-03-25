import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

const CompanyMap = ({ lat, lng }) => {
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={{ width: "100%", height: "300px" }} center={{ lat, lng }} zoom={15}>
        <Marker position={{ lat, lng }} />
      </GoogleMap>
    </LoadScript>
  );
};

export default CompanyMap;
