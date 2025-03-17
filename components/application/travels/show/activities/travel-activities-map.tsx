import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useEffect, useRef, useState } from "react";

interface TravelActivitiesMapProps {
    activities: IActivity[];
    isLoading: boolean;
}

const TravelActivitiesMap = ({
    activities,
    isLoading
}: TravelActivitiesMapProps) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [geocodedActivities, setGeocodedActivities] = useState<(IActivity & { coordinates?: [number, number] })[]>([]);
    const [isGeocodingComplete, setIsGeocodingComplete] = useState(false);

    useEffect(() => {
        if (isLoading || activities.length === 0) return
    
        const geocodeAddresses = async () => {
            const activitiesWithCoordinates = await Promise.all(
                activities.map(async (activity) => {
                    if (!activity.address) {
                        return { ...activity }
                    }
            
                    try {
                        const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
                        const encodedAddress = encodeURIComponent(activity.address);
                        const response = await fetch(
                            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${accessToken}`,
                        );
            
                        const data = await response.json()
            
                        if (data.features && data.features.length > 0) {
                            const [longitude, latitude] = data.features[0].center;
                            return {
                                ...activity,
                                coordinates: [longitude, latitude] as [number, number],
                            };
                        }
                    } catch (error) {
                        console.error("Geocoding error:", error);
                    }
            
                    return { ...activity };
                }),
            );
        
            setGeocodedActivities(activitiesWithCoordinates);
            setIsGeocodingComplete(true);
        }
    
        geocodeAddresses();
    }, [activities, isLoading]);

    useEffect(() => {
        if (!map.current || !isGeocodingComplete || geocodedActivities.length === 0) return;
    
        const bounds = new mapboxgl.LngLatBounds();
        let hasValidCoordinates = false;
    
        geocodedActivities.forEach((activity) => {
            if (activity.coordinates) {
                hasValidCoordinates = true;
    
                const el = document.createElement("div");
                el.className = "flex items-center justify-center";
                el.innerHTML = `
                    <div class="text-primary bg-white p-1 rounded-full shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-map-pin">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                    </div>
                `;
    
                const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
                    <div class="p-2">
                        <h3 class="font-bold">${activity.title}</h3>
                        ${activity.description ? `<p class="text-sm">${activity.description.substring(0, 100)}${activity.description.length > 100 ? "..." : ""}</p>` : ""}
                        ${activity.address ? `<p class="text-xs mt-1">${activity.address}</p>` : ""}
                        ${activity.date ? `<p class="text-xs mt-1">${new Date(activity.date).toLocaleDateString()}</p>` : ""}
                    </div>
                `);
        
                new mapboxgl.Marker(el).setLngLat(activity.coordinates).setPopup(popup).addTo(map.current!);
        
                bounds.extend(activity.coordinates);
            }
        });
    
        if (hasValidCoordinates && !bounds.isEmpty()) {
            map.current.fitBounds(bounds, {
                padding: 50,
                maxZoom: 12,
            });
        }
    }, [geocodedActivities, isGeocodingComplete]);

    useEffect(() => {
        if (!mapContainer.current || map.current || isLoading) return;

        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

        const newMap = new mapboxgl.Map({
            container: mapContainer.current,
            center: [2.3522, 48.8566],
            zoom: 5,
        });

        map.current = newMap;

        return () => {
            newMap.remove();
            map.current = null;
        }
    }, [isLoading]);

    if (isLoading) {
        return <Skeleton className="h-[500px] w-full rounded-xl mt-4" />
    }
    
    if (activities.length <= 0) {
        return (
            <div className="mt-4 h-[500px] flex flex-col items-center justify-center bg-muted rounded-lg">
                <MapPin className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Vous n'avez pas encore d'activités !</p>
                <p className="text-muted-foreground">Veuillez ajouter une activité pour commencer.</p>
            </div>
        )
    }
    
    return (
        <Card className="mt-4 overflow-hidden">
            <CardContent className="p-0">
                <div ref={mapContainer} className="h-[500px] w-full" />
            </CardContent>
        </Card>
    )
}

export default TravelActivitiesMap;