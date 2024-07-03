
import {
    AdvancedMarker,
    APIProvider,
    InfoWindow,
    Map,
    Marker,
    Pin
} from '@vis.gl/react-google-maps';
import { OctagonX } from 'lucide-react';
import { useEffect, useState } from 'react';


interface Geom {
    y: number;
    x: number;
}

interface Facility {
    facility_id: number;
    facility_name: string;
    facility_description: string;
    facility_image_url: string;
    city: string;
    region: string;
    address: string;
    postal_code: number | null;
    distance: number;
    geom: Geom
}
    
interface GoogleMapComponentProps {
    userLocation: Geom;
    facilities: Facility[];
}

const GoogleMapComp: React.FC<GoogleMapComponentProps> = ({ userLocation, facilities }) => {
    const [userCenter, setUserCenter] = useState({lat: 0, lng: 0});
    const [complexes, setComplexes] = useState<Facility[]>([]);
    const [displayMap, setDisplayMap] = useState<boolean>(true);

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        throw new Error('Missing GOOGLE_MAPS_API_KEY in environment variables');
    }

    useEffect(() => {
        setDisplayMap(true)
        if(userLocation.x && userLocation.y > 0){
            if(facilities.length > 0){
                setComplexes(facilities)
                // setUserCenter({lat: userLocation.y, lng: userLocation.x})
                setUserCenter({lat: facilities[0].geom.y, lng: facilities[0].geom.x})
            } else {
                setDisplayMap(false)
                setComplexes([])
                setUserCenter({lat: 0, lng: 0})
            }
            // setUserCenter({lat: userLocation.y, lng: userLocation.x}) need to fix this use case
        } else if(facilities.length > 0) {
            setComplexes(facilities)
            setUserCenter({lat: facilities[0].geom.y, lng: facilities[0].geom.x})
        } else {
            setDisplayMap(false)
            setUserCenter({lat: 0, lng: 0})
        }
    }, [userLocation, facilities])
    

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} libraries={['marker']}>
            { displayMap ? (
                <Map 
                    center={userCenter} 
                    defaultZoom={10} 
                    mapId={'a0836553190bc0d0'} 
                    style={{width: '100%', height: '550px'}}
                    mapTypeControl={false}
                    zoomControl={true}
                    fullscreenControl={false}
                    streetViewControl={false}
                >
                    {complexes && complexes.map((item, index) => (
                        <AdvancedMarker key={index} position={{lat: item.geom.y, lng: item.geom.x}}/>
                    ))}
                    <AdvancedMarker position={userCenter} title={'AdvancedMarker with customized pin.'}>
                        <Pin
                            background={'#0f9d58'}
                            borderColor={'#006425'}
                            glyphColor={'#60d98f'}
                        />
                    </AdvancedMarker>
                </Map>
                ) : (
                    <div className='flex flex-col w-full h-[550px] justify-center items-center'>
                        <OctagonX size={36}/>
                        <p className='text-xl font-semibold'>No results</p>
                    </div>
                )
            }   
        </APIProvider>
    );
}

export default GoogleMapComp;