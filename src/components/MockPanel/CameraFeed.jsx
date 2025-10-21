import React, { useEffect, useRef } from "react";

const CameraFeed = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing webcam:", err);
            }
        };

        startCamera();
    }, []);

    return (
        <div>
            <video ref={videoRef} autoPlay playsInline className="rounded w-64 h-48 border" />
        </div>
    );
};

export default CameraFeed;