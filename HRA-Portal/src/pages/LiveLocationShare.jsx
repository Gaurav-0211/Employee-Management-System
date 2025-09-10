import { MapPin, Play, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function LiveLocationShare() {
  const [employeeId, setEmployeeId] = useState("");
  const [tracking, setTracking] = useState(false);
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState("Not sharing");
  const watchIdRef = useRef(null);

  const startTracking = () => {
    if (!employeeId) {
      alert("Please enter your Employee ID");
      return;
    }

    if ("geolocation" in navigator) {
      setStatus("Starting location sharing...");

      watchIdRef.current = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const timestamp = new Date(position.timestamp);

          setCoords({ latitude, longitude, accuracy, timestamp });

          try {
            // Send live location to backend
            await fetch(
              `http://localhost:8081/api/location/update?employeeId=${employeeId}&latitude=${latitude}&longitude=${longitude}`,
              { method: "POST" }
            );
            setStatus("Sharing live location...");
          } catch (err) {
            console.error("Error sending location:", err);
            setStatus("Error sending location");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setStatus("Location access denied or unavailable");
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );

      setTracking(true);
    } else {
      alert("Geolocation not supported in this browser.");
    }
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setTracking(false);
    setCoords(null);
    setStatus("Not sharing");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <h1 className="text-2xl font-bold text-teal-700 mb-6 flex items-center gap-2">
        <MapPin /> Share Live Location
      </h1>

      {/* Employee ID Input */}
      <input
        type="number"
        placeholder="Enter Your Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        className="px-4 py-2 mb-4 w-64 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-400 outline-none"
      />

      {/* Start / Stop Buttons */}
      {!tracking ? (
        <button
          onClick={startTracking}
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          <Play /> Start Sharing
        </button>
      ) : (
        <button
          onClick={stopTracking}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          <Square /> Stop Sharing
        </button>
      )}

      {/* Status Message */}
      <p className="mt-4 text-gray-700 font-medium">{status}</p>

      {/* Current Location Info */}
      {coords && (
        <div className="mt-6 p-4 bg-white shadow rounded-lg w-80 text-gray-700">
          <p>
            <strong>Employee ID:</strong> {employeeId}
          </p>
          <p>
            <strong>Latitude:</strong> {coords.latitude.toFixed(6)}
          </p>
          <p>
            <strong>Longitude:</strong> {coords.longitude.toFixed(6)}
          </p>
          <p>
            <strong>Accuracy:</strong> ±{Math.round(coords.accuracy)} meters
          </p>
          <p>
            <strong>Last Updated:</strong> {coords.timestamp.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

// import { MapPin, Play, Square } from "lucide-react";
// import { useEffect, useRef, useState } from "react";

// export default function LiveLocationShare() {
//   const [employeeId, setEmployeeId] = useState("");
//   const [tracking, setTracking] = useState(false);
//   const [coords, setCoords] = useState(null);
//   const [status, setStatus] = useState("Not sharing");
//   const watchIdRef = useRef(null);
//   const lastSentRef = useRef(0); // for throttling

//   const startTracking = () => {
//     if (!employeeId) {
//       alert("Please enter your Employee ID");
//       return;
//     }

//     if ("geolocation" in navigator) {
//       setStatus("Starting location sharing...");

//       watchIdRef.current = navigator.geolocation.watchPosition(
//         async (position) => {
//           const { latitude, longitude, accuracy } = position.coords;
//           const timestamp = new Date(position.timestamp);

//           // Ignore bad accuracy (>50m)
//           if (accuracy > 50) {
//             console.warn("Skipped inaccurate reading:", accuracy);
//             return;
//           }

//           setCoords({ latitude, longitude, accuracy, timestamp });

//           // Throttle updates (10 sec)
//           const now = Date.now();
//           if (now - lastSentRef.current >= 10000) {
//             try {
//               await fetch(
//                 `http://localhost:8081/api/location/update?employeeId=${employeeId}&latitude=${latitude}&longitude=${longitude}&accuracy=${accuracy}&timestamp=${timestamp.toISOString()}`,
//                 { method: "POST" }
//               );
//               setStatus("Sharing live location...");
//               lastSentRef.current = now;
//             } catch (err) {
//               console.error("Error sending location:", err);
//               setStatus("Error sending location");
//             }
//           }
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//           setStatus("Location access denied or unavailable");
//         },
//         { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
//       );

//       setTracking(true);
//     } else {
//       alert("Geolocation not supported in this browser.");
//     }
//   };

//   const stopTracking = () => {
//     if (watchIdRef.current !== null) {
//       navigator.geolocation.clearWatch(watchIdRef.current);
//       watchIdRef.current = null;
//     }
//     setTracking(false);
//     setCoords(null);
//     setStatus("Not sharing");
//   };

//   // Cleanup
//   useEffect(() => {
//     return () => {
//       if (watchIdRef.current !== null) {
//         navigator.geolocation.clearWatch(watchIdRef.current);
//       }
//     };
//   }, []);

//   return (
//     <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
//       <h1 className="text-2xl font-bold text-teal-700 mb-6 flex items-center gap-2">
//         <MapPin /> Share Live Location
//       </h1>

//       <input
//         type="number"
//         placeholder="Enter Your Employee ID"
//         value={employeeId}
//         onChange={(e) => setEmployeeId(e.target.value)}
//         className="px-4 py-2 mb-4 w-64 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-400 outline-none"
//       />

//       {!tracking ? (
//         <button
//           onClick={startTracking}
//           className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
//         >
//           <Play /> Start Sharing
//         </button>
//       ) : (
//         <button
//           onClick={stopTracking}
//           className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//         >
//           <Square /> Stop Sharing
//         </button>
//       )}

//       <p className="mt-4 text-gray-700 font-medium">{status}</p>

//       {coords && (
//         <div className="mt-6 p-4 bg-white shadow rounded-lg w-80 text-gray-700">
//           <p>
//             <strong>Employee ID:</strong> {employeeId}
//           </p>
//           <p>
//             <strong>Latitude:</strong> {coords.latitude.toFixed(6)}
//           </p>
//           <p>
//             <strong>Longitude:</strong> {coords.longitude.toFixed(6)}
//           </p>
//           <p>
//             <strong>Accuracy:</strong> ±{Math.round(coords.accuracy)} m
//           </p>
//           <p>
//             <strong>Last Updated:</strong> {coords.timestamp.toLocaleString()}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
