import {
  Copy,
  Download,
  MapPin,
  Play,
  RefreshCw,
  Square,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function LiveLocationShare() {
  // inputs & toggles
  const [employeeId, setEmployeeId] = useState("");
  const [tracking, setTracking] = useState(false);
  const [coords, setCoords] = useState(null); // latest coords
  const [status, setStatus] = useState("Not sharing");
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [maxAge, setMaxAge] = useState(0);
  const [timeoutMs, setTimeoutMs] = useState(5000);
  const [sampleIntervalMs, setSampleIntervalMs] = useState(0); // 0 = rely on browser updates
  const watchIdRef = useRef(null);

  // history of sent points
  const [history, setHistory] = useState([]); // array of { latitude, longitude, accuracy, timestamp }
  const MAX_HISTORY = 50;

  // retries and network state
  const [lastSendError, setLastSendError] = useState(null);
  const [autoRetry, setAutoRetry] = useState(true);
  const retryTimeoutRef = useRef(null);

  // map centering (lat,lng) for the embedded map preview
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // default India center
  const [mapZoom, setMapZoom] = useState(12);

  // UI: panel expand
  const [showHistory, setShowHistory] = useState(true);

  // Helper: calculate approximate speed between two points (meters / sec)
  function haversineDistanceMeters(lat1, lon1, lat2, lon2) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371000; // meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Build OpenStreetMap embed URL centered on mapCenter with a marker for the latest coords.
  // Using the "marker" style in OSM static tile viewers is inconsistent; easiest is to create
  // a map link (maps.openrouteservice.org or openstreetmap.org). We'll use an iframe pointing to
  // a simple OSM map with a marker via an `?mlat&mlon` pattern that OpenStreetMap supports.
  function buildOSMEmbedUrl(lat, lng, zoom = 14) {
    // OpenStreetMap doesn't provide embeddable static map with marker params consistently,
    // but this URL will show a map centered and allows the user to open the full map.
    // For in-iframe marker, we can use a small third-party viewer (leaflet via html) but remote
    // resources are not guaranteed. We'll rely on the `www.openstreetmap.org/export/embed.html?` pattern.
    if (!lat || !lng) {
      return `https://www.openstreetmap.org/export/embed.html?bbox=78.9%2C20.5%2C79.1%2C20.7&layer=mapnik`;
    }
    // bbox centered around point (small box) so it appears centered in embed
    const delta = 0.01; // small bounding box
    const left = lng - delta;
    const right = lng + delta;
    const bottom = lat - delta;
    const top = lat + delta;
    const bbox = `${left}%2C${bottom}%2C${right}%2C${top}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  }

  // Save a new point to state.history and cap the array
  function pushHistoryPoint(point) {
    setHistory((h) => {
      const next = [point, ...h];
      if (next.length > MAX_HISTORY) next.length = MAX_HISTORY;
      return next;
    });
  }

  // Download history as CSV
  function downloadHistoryCSV() {
    if (!history.length) {
      alert("No history to download.");
      return;
    }
    const headers = ["timestamp", "latitude", "longitude", "accuracy"];
    const rows = history
      .map(
        (p) =>
          `${encodeURIComponent(p.timestamp)} , ${p.latitude} , ${
            p.longitude
          } , ${p.accuracy}`
      )
      .join("\n");
    const csv = `${headers.join(",")}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `live_location_history_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Copy coordinates to clipboard
  async function copyCoords(lat, lng) {
    try {
      await navigator.clipboard.writeText(`${lat}, ${lng}`);
      alert("Coordinates copied to clipboard.");
    } catch (e) {
      alert("Failed to copy coordinates.");
    }
  }

  // Build a quick map link to open in a new tab
  function buildMapLink(lat, lng) {
    if (!lat || !lng) return "https://www.openstreetmap.org";
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${mapZoom}/${lat}/${lng}`;
  }

  // Send location to backend (keeps your original implementation)
  async function sendLocationToBackend(employeeIdParam, latitude, longitude) {
    // Keep the sending location implementation same as provided by the user
    try {
      await fetch(
        `http://localhost:8081/api/location/update?employeeId=${employeeIdParam}&latitude=${latitude}&longitude=${longitude}`,
        { method: "POST" }
      );
      setLastSendError(null);
      setStatus("Sharing live location...");
      return true;
    } catch (err) {
      console.error("Error sending location:", err);
      setLastSendError(String(err));
      setStatus("Error sending location");
      return false;
    }
  }

  // Start tracking: sets up watchPosition with given options and handles messages
  const startTracking = () => {
    if (!employeeId) {
      alert("Please enter your Employee ID");
      return;
    }

    if (!("geolocation" in navigator)) {
      alert("Geolocation not supported in this browser.");
      return;
    }

    setStatus("Requesting location permission...");
    setLastSendError(null);

    // Build options
    const options = {
      enableHighAccuracy: !!highAccuracy,
      maximumAge: Number(maxAge) || 0,
      timeout: Number(timeoutMs) || 5000,
    };

    // Use a watcher to get continuous updates
    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const timestamp = new Date(position.timestamp).toISOString();

          const newCoords = { latitude, longitude, accuracy, timestamp };
          setCoords(newCoords);
          setMapCenter({ lat: latitude, lng: longitude });

          // derive speed from last recorded point (if exists)
          let speed = null;
          if (history.length) {
            const prev = history[0];
            const dtSec =
              (new Date(timestamp).getTime() -
                new Date(prev.timestamp).getTime()) /
              1000;
            if (dtSec > 0) {
              const dist = haversineDistanceMeters(
                prev.latitude,
                prev.longitude,
                latitude,
                longitude
              );
              speed = dist / dtSec; // m/s
            }
          }
          // record in history (include speed)
          pushHistoryPoint({ latitude, longitude, accuracy, timestamp, speed });

          // send to backend (user required to keep this implementation)
          const sent = await sendLocationToBackend(
            employeeId,
            latitude,
            longitude
          );

          // If sending fails and autoRetry is on, schedule retry
          if (!sent && autoRetry) {
            if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = setTimeout(async () => {
              // try to resend the last point
              await sendLocationToBackend(employeeId, latitude, longitude);
            }, 3000);
          }

          // handle optional manual sample interval throttle
          if (sampleIntervalMs > 0 && watchIdRef.current !== null) {
            // Some browsers ignore frequent watchPosition requests; we can clear and re-register
            // after sampleIntervalMs. To keep logic simple, we clear and set a delayed re-watch.
            navigator.geolocation.clearWatch(watchIdRef.current);
            const latCopy = latitude;
            const lngCopy = longitude;
            const accCopy = accuracy;
            setTimeout(() => {
              // re-register watchPosition to continue tracking after sample interval
              if (watchIdRef.current === null) {
                watchIdRef.current = navigator.geolocation.watchPosition(
                  async (pos) => {
                    // repetition of the handler - to keep code concise we rely on the original watch handler
                    // but this branch will rarely be needed in typical browsers.
                    const {
                      latitude: la,
                      longitude: lo,
                      accuracy: ac,
                    } = pos.coords;
                    const timestamp2 = new Date(pos.timestamp).toISOString();
                    setCoords({
                      latitude: la,
                      longitude: lo,
                      accuracy: ac,
                      timestamp: timestamp2,
                    });
                    pushHistoryPoint({
                      latitude: la,
                      longitude: lo,
                      accuracy: ac,
                      timestamp: timestamp2,
                    });
                    await sendLocationToBackend(employeeId, la, lo);
                  },
                  (error) => {
                    console.error("Error getting location:", error);
                    setStatus("Location access denied or unavailable");
                  },
                  options
                );
              }
            }, sampleIntervalMs);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          if (error && error.code === 1) {
            setStatus("Permission denied — please allow location access.");
          } else {
            setStatus("Location access denied or unavailable");
          }
        },
        options
      );

      setTracking(true);
      setStatus("Starting location sharing...");
    } catch (err) {
      console.error("startTracking error:", err);
      setStatus("Error starting location sharing");
    }
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    setTracking(false);
    setStatus("Not sharing");
    // We intentionally do not clear history here so user can download or inspect last points
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Small formatted timestamp for UI
  function niceTimestamp(iso) {
    try {
      return new Date(iso).toLocaleString();
    } catch (e) {
      return iso;
    }
  }

  // UI Colors: yellow, blue, white, orange, red (applied across buttons / accents)
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-yellow-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-700 flex items-center gap-3">
              <MapPin className="text-orange-500" /> Share Live Location
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Real-time location sharing with live preview, history, and export.
              Your location is sent to the server exactly as before.
            </p>
          </div>

          <div className="flex gap-2 items-center w-full sm:w-auto">
            <div className="flex gap-2 items-center bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
              <input
                aria-label="Employee ID"
                type="number"
                placeholder="Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-36 px-3 py-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              <button
                onClick={() => {
                  // quick refresh permission prompt on some browsers by attempting getCurrentPosition
                  if (!("geolocation" in navigator)) {
                    alert("Geolocation not supported.");
                    return;
                  }
                  navigator.geolocation.getCurrentPosition(
                    () => alert("Location permission available."),
                    () => alert("Permission denied or location unavailable.")
                  );
                }}
                className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                title="Check permission"
              >
                <RefreshCw size={16} /> Check
              </button>
            </div>

            {!tracking ? (
              <button
                onClick={startTracking}
                className="ml-2 px-4 py-2 rounded-lg bg-orange-500 text-white flex items-center gap-2 hover:bg-orange-600 shadow"
                title="Start sharing location"
              >
                <Play size={16} /> Start
              </button>
            ) : (
              <button
                onClick={stopTracking}
                className="ml-2 px-4 py-2 rounded-lg bg-red-600 text-white flex items-center gap-2 hover:bg-red-700 shadow"
                title="Stop sharing location"
              >
                <Square size={16} /> Stop
              </button>
            )}
          </div>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: controls & status */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="text-sm font-medium text-slate-600 mb-2">
              Sharing Controls
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-500">High accuracy</label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={highAccuracy}
                    onChange={(e) => setHighAccuracy(e.target.checked)}
                    className="rounded text-yellow-500 focus:ring-yellow-300"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-500">
                  Sample interval (ms)
                </label>
                <input
                  type="number"
                  min={0}
                  value={sampleIntervalMs}
                  onChange={(e) => setSampleIntervalMs(Number(e.target.value))}
                  className="w-24 px-2 py-1 rounded-lg border border-gray-200"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-500">
                  Auto-retry on fail
                </label>
                <input
                  type="checkbox"
                  checked={autoRetry}
                  onChange={(e) => setAutoRetry(e.target.checked)}
                  className="rounded text-yellow-500 focus:ring-yellow-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-500">Max age (ms)</label>
                <input
                  type="number"
                  min={0}
                  value={maxAge}
                  onChange={(e) => setMaxAge(Number(e.target.value))}
                  className="w-24 px-2 py-1 rounded-lg border border-gray-200"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-500">Timeout (ms)</label>
                <input
                  type="number"
                  min={1000}
                  value={timeoutMs}
                  onChange={(e) => setTimeoutMs(Number(e.target.value))}
                  className="w-24 px-2 py-1 rounded-lg border border-gray-200"
                />
              </div>
            </div>

            <div className="mt-4 border-t pt-3">
              <div className="text-xs text-slate-500">Status</div>
              <div className="mt-2 flex items-center gap-2">
                {/* status pill colors: active -> orange/blue, error -> red */}
                <div
                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                    status.toLowerCase().includes("error") ||
                    status.toLowerCase().includes("denied")
                      ? "bg-red-100 text-red-700"
                      : status.toLowerCase().includes("sharing")
                      ? "bg-orange-100 text-orange-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {status}
                </div>
                <div className="text-xs text-slate-400">
                  {" "}
                  {lastSendError ? " • Last send error" : ""}{" "}
                </div>
              </div>

              <div className="mt-3 text-sm text-slate-600">
                <strong>Latest:</strong>{" "}
                {coords
                  ? `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(
                      6
                    )}`
                  : "No coordinates yet."}
                <div className="mt-1 text-xs text-slate-400">
                  {coords ? niceTimestamp(coords.timestamp) : ""}
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    if (coords)
                      copyCoords(
                        coords.latitude.toFixed(6),
                        coords.longitude.toFixed(6)
                      );
                  }}
                  className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2 justify-center hover:bg-blue-700"
                >
                  <Copy size={16} /> Copy
                </button>

                <button
                  onClick={() => {
                    if (coords)
                      window.open(
                        buildMapLink(coords.latitude, coords.longitude),
                        "_blank"
                      );
                  }}
                  className="flex-1 px-3 py-2 rounded-lg bg-yellow-400 text-white flex items-center gap-2 justify-center hover:bg-yellow-500"
                >
                  <Zap size={16} /> Open Map
                </button>
              </div>
            </div>
          </div>

          {/* Middle column: map preview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-medium text-slate-600">
                    Live Map Preview
                  </h3>
                  <div className="text-xs text-slate-400">
                    Preview recent location in the embedded OpenStreetMap.
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-xs text-slate-500">Zoom</div>
                  <input
                    type="range"
                    min={5}
                    max={18}
                    value={mapZoom}
                    onChange={(e) => setMapZoom(Number(e.target.value))}
                    className="w-36"
                  />
                </div>
              </div>

              <div className="w-full h-72 bg-slate-50 rounded-lg overflow-hidden border border-gray-100">
                {/* OSM embed iframe */}
                <iframe
                  title="osm-preview"
                  src={buildOSMEmbedUrl(
                    coords?.latitude,
                    coords?.longitude,
                    mapZoom
                  )}
                  style={{ width: "100%", height: "100%", border: 0 }}
                  loading="lazy"
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Center: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
                </div>
                <div className="text-xs text-slate-400">Zoom: {mapZoom}</div>
              </div>
            </div>

            {/* History & actions */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-600">
                    Recent Location History
                  </h3>
                  <div className="text-xs text-slate-400">
                    Latest {history.length} sent points (most recent first)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      // clear history confirm
                      if (!history.length) return alert("No history to clear.");
                      if (confirm("Clear location history?")) setHistory([]);
                    }}
                    className="px-3 py-2 rounded-lg bg-white border text-sm"
                    title="Clear history"
                  >
                    Clear
                  </button>

                  <button
                    onClick={() => downloadHistoryCSV()}
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2"
                    title="Download history"
                  >
                    <Download size={14} /> Download CSV
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xs text-slate-400 mb-2">
                  Toggle to show/hide
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHistory((s) => !s)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      showHistory
                        ? "bg-orange-500 text-white"
                        : "bg-white border"
                    }`}
                  >
                    {showHistory ? "Hide" : "Show"} History
                  </button>
                  <div className="text-xs text-slate-400 ml-2">
                    Actions on entries are available on each row
                  </div>
                </div>

                {showHistory && (
                  <div className="mt-3 max-h-60 overflow-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-xs text-slate-500 border-b">
                          <th className="py-2 px-2">Time</th>
                          <th className="py-2 px-2">Lat</th>
                          <th className="py-2 px-2">Lon</th>
                          <th className="py-2 px-2">Acc (m)</th>
                          <th className="py-2 px-2">Speed (m/s)</th>
                          <th className="py-2 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="py-4 text-xs text-slate-400"
                            >
                              No history yet — start sharing to collect points.
                            </td>
                          </tr>
                        ) : (
                          history.map((p, i) => (
                            <tr key={i} className="border-b hover:bg-slate-50">
                              <td className="py-2 px-2 text-xs">
                                {niceTimestamp(p.timestamp)}
                              </td>
                              <td className="py-2 px-2 text-xs font-mono">
                                {p.latitude.toFixed(6)}
                              </td>
                              <td className="py-2 px-2 text-xs font-mono">
                                {p.longitude.toFixed(6)}
                              </td>
                              <td className="py-2 px-2 text-xs">
                                {Math.round(p.accuracy)}
                              </td>
                              <td className="py-2 px-2 text-xs">
                                {p.speed ? p.speed.toFixed(2) : "-"}
                              </td>
                              <td className="py-2 px-2 text-xs">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      copyCoords(
                                        p.latitude.toFixed(6),
                                        p.longitude.toFixed(6)
                                      )
                                    }
                                    className="px-2 py-1 rounded bg-white border text-xs"
                                  >
                                    <Copy size={12} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      window.open(
                                        buildMapLink(p.latitude, p.longitude),
                                        "_blank"
                                      )
                                    }
                                    className="px-2 py-1 rounded bg-yellow-400 text-white text-xs"
                                  >
                                    Open
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Footer quick snapshot */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Snapshot & quick actions
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (!coords)
                      return alert("No coordinates yet to snapshot.");
                    const payload = {
                      timestamp: coords.timestamp,
                      lat: coords.latitude,
                      lon: coords.longitude,
                      accuracy: coords.accuracy,
                      employeeId,
                    };
                    // Small client-side download of snapshot
                    const blob = new Blob([JSON.stringify(payload, null, 2)], {
                      type: "application/json",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `snapshot_${new Date().toISOString()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2"
                >
                  <Download size={14} /> Snapshot
                </button>

                <button
                  onClick={() => {
                    setHistory([]);
                    setCoords(null);
                    alert(
                      "Local state cleared (history + latest coords). Note: server-side data is not affected."
                    );
                  }}
                  className="px-3 py-2 rounded-lg bg-white border"
                >
                  Reset Local
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* bottom notes */}
        <div className="mt-6 text-xs text-slate-500">
          <div>
            Note: This UI sends the location exactly the same way as your
            original implementation. The embedded map is an OpenStreetMap embed
            for preview purposes only.
          </div>
          <div className="mt-1">
            Privacy: ensure your backend receives and stores locations securely
            (HTTPS recommended for production).
          </div>
        </div>
      </div>
    </div>
  );
}
