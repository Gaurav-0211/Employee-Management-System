import { RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function EmployeeTracker() {
  const [employeeId, setEmployeeId] = useState("");
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchLocation = async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8081/api/location/${employeeId}`
      );
      if (!res.ok) throw new Error("Failed to fetch location");
      const data = await res.json();
      setLocation({
        lat: data.latitude,
        lng: data.longitude,
        accuracy: data.accuracy,
        timestamp: data.timestamp,
      });
    } catch (err) {
      console.error(err);
      setLocation(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto refresh every 10 sec when tracking
  useEffect(() => {
    let interval;
    if (tracking && employeeId) {
      fetchLocation();
      interval = setInterval(fetchLocation, 10000);
    }
    return () => clearInterval(interval);
  }, [tracking, employeeId]);

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">
        Employee Live Tracker
      </h1>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Enter Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
        />
        {!tracking ? (
          <button
            onClick={() => setTracking(true)}
            disabled={!employeeId}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Search /> Start Tracking
          </button>
        ) : (
          <button
            onClick={() => setTracking(false)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Stop
          </button>
        )}

        {/* Manual Refresh */}
        <button
          onClick={fetchLocation}
          disabled={!employeeId || loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          <RefreshCw className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="w-full max-w-4xl h-[500px] rounded-xl shadow-lg overflow-hidden bg-white flex items-center justify-center">
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
      </div>

      {location && (
        <div className="mt-4 p-4 bg-white shadow rounded-lg text-gray-700">
          <p>
            <strong>Employee ID:</strong> {employeeId}
          </p>
          <p>
            <strong>Latitude:</strong> {location.lat}
          </p>
          <p>
            <strong>Longitude:</strong> {location.lng}
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
      )}
    </div>
  );
}
