// import { RefreshCw, Search } from "lucide-react";
// import { useEffect, useState } from "react";

// export default function EmployeeTracker() {
//   const [employeeId, setEmployeeId] = useState("");
//   const [location, setLocation] = useState(null);
//   const [tracking, setTracking] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const fetchLocation = async () => {
//     if (!employeeId) return;
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `http://localhost:8081/api/location/${employeeId}`
//       );
//       if (!res.ok) throw new Error("Failed to fetch location");
//       const data = await res.json();
//       setLocation({
//         lat: data.latitude,
//         lng: data.longitude,
//         accuracy: data.accuracy,
//         timestamp: data.timestamp,
//       });
//     } catch (err) {
//       console.error(err);
//       setLocation(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto refresh every 10 sec when tracking
//   useEffect(() => {
//     let interval;
//     if (tracking && employeeId) {
//       fetchLocation();
//       interval = setInterval(fetchLocation, 10000);
//     }
//     return () => clearInterval(interval);
//   }, [tracking, employeeId]);

//   return (
//     <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       <h1 className="text-2xl font-bold text-indigo-700 mb-6">
//         Employee Live Tracker
//       </h1>

//       <div className="flex gap-2 mb-4">
//         <input
//           type="number"
//           placeholder="Enter Employee ID"
//           value={employeeId}
//           onChange={(e) => setEmployeeId(e.target.value)}
//           className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
//         />
//         {!tracking ? (
//           <button
//             onClick={() => setTracking(true)}
//             disabled={!employeeId}
//             className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
//           >
//             <Search /> Start Tracking
//           </button>
//         ) : (
//           <button
//             onClick={() => setTracking(false)}
//             className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//           >
//             Stop
//           </button>
//         )}

//         {/* Manual Refresh */}
//         <button
//           onClick={fetchLocation}
//           disabled={!employeeId || loading}
//           className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
//         >
//           <RefreshCw className={loading ? "animate-spin" : ""} /> Refresh
//         </button>
//       </div>

//       <div className="w-full max-w-4xl h-[500px] rounded-xl shadow-lg overflow-hidden bg-white flex items-center justify-center">
//         {location ? (
//           <iframe
//             title="Employee Location"
//             width="100%"
//             height="100%"
//             style={{ border: 0 }}
//             loading="lazy"
//             referrerPolicy="no-referrer-when-downgrade"
//             src={`https://www.google.com/maps?q=${location.lat},${location.lng}&hl=en&z=17&output=embed`}
//           ></iframe>
//         ) : (
//           <p className="text-gray-500">Enter Employee ID and start tracking</p>
//         )}
//       </div>

//       {location && (
//         <div className="mt-4 p-4 bg-white shadow rounded-lg text-gray-700">
//           <p>
//             <strong>Employee ID:</strong> {employeeId}
//           </p>
//           <p>
//             <strong>Latitude:</strong> {location.lat}
//           </p>
//           <p>
//             <strong>Longitude:</strong> {location.lng}
//           </p>
//           {location.accuracy && (
//             <p>
//               <strong>Accuracy:</strong> ±{Math.round(location.accuracy)} m
//             </p>
//           )}
//           <p>
//             <strong>Last Updated:</strong>{" "}
//             {new Date(location.timestamp).toLocaleString()}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

import { Clock, Loader2, MapPin, RefreshCw, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function EmployeeTracker() {
  const [employeeId, setEmployeeId] = useState("");
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState([]);
  const [refreshCountdown, setRefreshCountdown] = useState(10);

  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  // Fetch employee location
  const fetchLocation = async () => {
    if (!employeeId) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(
        `http://localhost:8081/api/location/${employeeId}`
      );
      if (!res.ok) throw new Error("Failed to fetch location");
      const data = await res.json();

      const newLoc = {
        lat: parseFloat(data.latitude),
        lng: parseFloat(data.longitude),
        accuracy: data.accuracy,
        timestamp: data.timestamp,
      };
      setLocation(newLoc);

      // Save trail of coordinates
      setHistory((prev) => {
        const updated = [...prev, newLoc];
        return updated.slice(-20); // keep last 20 points
      });
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not fetch employee location.");
      setLocation(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto refresh every 10 sec when tracking
  useEffect(() => {
    if (tracking && employeeId) {
      fetchLocation();
      intervalRef.current = setInterval(fetchLocation, 10000);

      // countdown timer
      setRefreshCountdown(10);
      countdownRef.current = setInterval(() => {
        setRefreshCountdown((prev) => (prev > 1 ? prev - 1 : 10));
      }, 1000);
    }

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(countdownRef.current);
    };
  }, [tracking, employeeId]);

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Page Header */}
      <div className="flex items-center justify-between w-full max-w-6xl mb-6">
        <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-2">
          <MapPin /> Employee Live Tracker
        </h1>
        {tracking && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow">
            <Clock size={16} />
            Auto refresh in {refreshCountdown}s
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6 w-full max-w-6xl">
        <input
          type="number"
          placeholder="Enter Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-300 flex-1 min-w-[200px] focus:ring-2 focus:ring-indigo-400 outline-none shadow-sm"
        />

        {!tracking ? (
          <button
            onClick={() => setTracking(true)}
            disabled={!employeeId}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg shadow text-white transition ${
              employeeId
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <Search /> Start Tracking
          </button>
        ) : (
          <button
            onClick={() => setTracking(false)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg shadow bg-red-600 text-white hover:bg-red-700 transition"
          >
            <X /> Stop Tracking
          </button>
        )}

        {/* Manual Refresh */}
        <button
          onClick={fetchLocation}
          disabled={!employeeId || loading}
          className="flex items-center gap-2 px-6 py-3 rounded-lg shadow bg-gray-700 text-white hover:bg-gray-800 transition"
        >
          {loading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="mb-4 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200 shadow">
          {errorMsg}
        </div>
      )}

      {/* Map Section */}
      <div className="w-full max-w-6xl h-[500px] rounded-2xl shadow-lg overflow-hidden bg-white flex items-center justify-center relative">
        {location ? (
          <iframe
            title="Employee Location"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${location.lat},${location.lng}&hl=en&z=17&output=embed`}
          ></iframe>
        ) : (
          <p className="text-gray-500">Enter Employee ID and start tracking</p>
        )}

        {location && (
          <div className="absolute top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow">
            <strong>Live</strong>
          </div>
        )}
      </div>

      {/* Current Location Info */}
      {location && (
        <div className="mt-6 w-full max-w-6xl grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white shadow rounded-xl">
            <h2 className="text-lg font-semibold text-indigo-700 mb-4">
              Current Location Details
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Employee ID:</strong> {employeeId}
              </p>
              <p>
                <strong>Latitude:</strong> {location.lat.toFixed(6)}
              </p>
              <p>
                <strong>Longitude:</strong> {location.lng.toFixed(6)}
              </p>
              {location.accuracy && (
                <p>
                  <strong>Accuracy:</strong> ±{Math.round(location.accuracy)} m
                </p>
              )}
              <p>
                <strong>Last Updated:</strong>{" "}
                {new Date(location.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Location History */}
          <div className="p-6 bg-white shadow rounded-xl overflow-auto max-h-64">
            <h2 className="text-lg font-semibold text-indigo-700 mb-4">
              Location History (Last {history.length} points)
            </h2>
            {history.length > 0 ? (
              <ul className="space-y-2 text-sm text-gray-700">
                {history.map((h, idx) => (
                  <li
                    key={idx}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex justify-between"
                  >
                    <span>
                      📍 {h.lat.toFixed(6)}, {h.lng.toFixed(6)}
                    </span>
                    <span className="text-gray-500">
                      {new Date(h.timestamp).toLocaleTimeString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No history yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-10 text-sm text-gray-500">
        Employee Tracker © {new Date().getFullYear()} • Built with 💙
      </footer>
    </div>
  );
}
