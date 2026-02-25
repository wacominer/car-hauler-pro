import React, { useState, useMemo, useEffect } from "react";

// =====================================
// CAR HAULER PRO v1.3 (STABLE LOCKED VERSION + REALISM UPGRADE)
// =====================================

const DOT_LIMIT = 80000;
const HEIGHT_LIMIT_IN = 162; // 13ft 6in

const AXLE_LIMITS = {
  steer: 12000,
  drive: 34000,
  trailer: 34000
};

const BASE_POSITIONS = [
  "TB", "OC", "TTR",
  "TFB", "TMB", "TTF", "TTR2",
  "EX1", "EX2"
];

const STINGER_LIBRARY = {
  "Cottrell CX-09": { Aluminum: 9000, Steel: 11000 },
  "Boydstun 9-Car": { Aluminum: 9200, Steel: 11200 },
  "Boydstun 7-Car": { Aluminum: 8800, Steel: 10500 },
  "Kaufman 9-Car": { Aluminum: 9100, Steel: 11300 },
  "NextGen 8-Car": { Aluminum: 8700, Steel: 10800 },
  "Wally-Mo 9-Car": { Aluminum: 9300, Steel: 11500 },
  "Lohr 9-Car": { Aluminum: 9500, Steel: 12000 },
  "Lohr 8-Car": { Aluminum: 9200, Steel: 11500 }
};

// ================= FULL DEALERSHIP LIBRARY =================
const VEHICLE_LIBRARY = {
  // FORD
  "Ford F-150 (Gas)": { weight: 5200, height: 75 },
  "Ford F-150 Hybrid": { weight: 5400, height: 75 },
  "Ford F-150 Lightning (EV)": { weight: 6500, height: 78 },
  "Ford Maverick (Hybrid)": { weight: 3800, height: 68 },
  "Ford Ranger": { weight: 4500, height: 72 },
  "Ford Explorer": { weight: 4500, height: 70 },
  "Ford Expedition": { weight: 5800, height: 76 },
  "Ford Bronco": { weight: 4700, height: 73 },
  "Ford Mustang": { weight: 3700, height: 55 },
  "Ford Mustang Mach-E (EV)": { weight: 4800, height: 64 },

  // CHEVROLET
  "Chevrolet Silverado 1500": { weight: 5300, height: 75 },
  "Chevrolet Silverado EV": { weight: 8000, height: 78 },
  "Chevrolet Colorado": { weight: 4600, height: 72 },
  "Chevrolet Tahoe": { weight: 5800, height: 76 },
  "Chevrolet Suburban": { weight: 6000, height: 76 },
  "Chevrolet Traverse": { weight: 4400, height: 70 },
  "Chevrolet Blazer": { weight: 4100, height: 67 },
  "Chevrolet Equinox": { weight: 3500, height: 65 },
  "Chevrolet Corvette": { weight: 3500, height: 49 },

  // RAM / JEEP
  "Ram 1500 (Gas)": { weight: 5400, height: 77 },
  "Ram 1500 REV (EV)": { weight: 7800, height: 78 },
  "Jeep Grand Cherokee": { weight: 4700, height: 69 },
  "Jeep Wrangler": { weight: 4200, height: 74 },
  "Jeep Gladiator": { weight: 4700, height: 73 },
  "Jeep Compass": { weight: 3300, height: 65 },
  "Jeep Wagoneer": { weight: 5900, height: 75 },

  // TOYOTA
  "Toyota Corolla": { weight: 2900, height: 57 },
  "Toyota Camry": { weight: 3400, height: 57 },
  "Toyota Prius": { weight: 3100, height: 57 },
  "Toyota RAV4": { weight: 3800, height: 67 },
  "Toyota Highlander": { weight: 4300, height: 68 },
  "Toyota Tacoma": { weight: 4400, height: 72 },
  "Toyota Tundra": { weight: 5500, height: 75 },
  "Toyota 4Runner": { weight: 4800, height: 72 },
  "Toyota Land Cruiser": { weight: 5900, height: 74 },

  // HONDA
  "Honda Civic": { weight: 3000, height: 55 },
  "Honda Accord": { weight: 3400, height: 57 },
  "Honda CR-V": { weight: 3700, height: 66 },
  "Honda Pilot": { weight: 4300, height: 70 },
  "Honda Passport": { weight: 4100, height: 70 },
  "Honda Ridgeline": { weight: 4500, height: 70 },
  "Honda Prologue (EV)": { weight: 5000, height: 66 },

  // NISSAN
  "Nissan Sentra": { weight: 3000, height: 56 },
  "Nissan Altima": { weight: 3300, height: 57 },
  "Nissan Rogue": { weight: 3600, height: 66 },
  "Nissan Pathfinder": { weight: 4600, height: 70 },
  "Nissan Frontier": { weight: 4500, height: 72 },
  "Nissan Ariya (EV)": { weight: 4800, height: 66 },

  // HYUNDAI / KIA
  "Hyundai Elantra": { weight: 3000, height: 56 },
  "Hyundai Sonata": { weight: 3400, height: 57 },
  "Hyundai Tucson": { weight: 3600, height: 65 },
  "Hyundai Santa Fe": { weight: 4100, height: 67 },
  "Hyundai Palisade": { weight: 4300, height: 69 },
  "Hyundai Ioniq 5 (EV)": { weight: 4200, height: 63 },
  "Hyundai Ioniq 6 (EV)": { weight: 4100, height: 58 },
  "Kia Forte": { weight: 2900, height: 56 },
  "Kia K5": { weight: 3400, height: 57 },
  "Kia Sportage": { weight: 3600, height: 65 },
  "Kia Sorento": { weight: 4100, height: 67 },
  "Kia Telluride": { weight: 4400, height: 69 },
  "Kia EV6 (EV)": { weight: 4300, height: 61 },
  "Kia EV9 (EV)": { weight: 5600, height: 70 },

  // TESLA / EV
  "Tesla Model 3 (EV)": { weight: 4000, height: 57 },
  "Tesla Model Y (EV)": { weight: 4400, height: 64 },
  "Tesla Model S (EV)": { weight: 4900, height: 57 },
  "Tesla Model X (EV)": { weight: 5500, height: 66 },
  "Tesla Cybertruck (EV)": { weight: 6800, height: 75 },
  "Rivian R1T (EV)": { weight: 7100, height: 79 },
  "Rivian R1S (EV)": { weight: 7000, height: 78 },
  "Lucid Air (EV)": { weight: 5200, height: 57 },

  // EUROPEAN
  "BMW 3 Series": { weight: 3600, height: 57 },
  "BMW 5 Series": { weight: 4000, height: 57 },
  "BMW X5": { weight: 4800, height: 69 },
  "BMW iX (EV)": { weight: 5700, height: 67 },
  "Audi A4": { weight: 3700, height: 57 },
  "Audi Q5": { weight: 4200, height: 66 },
  "Audi Q8 e-tron (EV)": { weight: 5800, height: 67 },
  "Mercedes C-Class": { weight: 3700, height: 57 },
  "Mercedes GLE": { weight: 5000, height: 70 },
  "Mercedes-Benz G-Wagen": { weight: 5700, height: 77 },
  "Volvo XC60": { weight: 4200, height: 65 },
  "Volvo XC90": { weight: 4700, height: 69 },
  "Land Rover Defender": { weight: 5200, height: 77 },
  "Range Rover Sport": { weight: 5100, height: 71 }
};

const autoAssign = (cars) => {
  const sorted = [...cars].sort((a, b) => b.weight - a.weight);
  return sorted.map((car, index) => ({
    ...car,
    position: BASE_POSITIONS[index] || ""
  }));
};

// ================= AUTO CLASSIFICATION =================
const classifyVehicle = (model, weight, height) => {
  if (model.includes("EV")) return "EV";
  if (model.includes("1500") || model.includes("F-150") || model.includes("Silverado") || model.includes("Ram")) return "Pickup";
  if (height > 72) return "Large SUV";
  if (height > 65) return "SUV";
  if (height < 55) return "Low Profile";
  return "Sedan";
};

export default function DeliverWarrior() {
  const [cars, setCars] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [search, setSearch] = useState("");
  const [stingerModel, setStingerModel] = useState("Cottrell CX-09");
  const [stingerMaterial, setStingerMaterial] = useState("Aluminum");
  const [optimizeMessage, setOptimizeMessage] = useState("");
    const [tandemSlide, setTandemSlide] = useState(0);
	useEffect(() => {
  const stored = localStorage.getItem("carHaulerTrip");

  if (stored) {
    const trip = JSON.parse(stored);

    setCars(trip.cars || []);
    setStingerModel(trip.stingerModel || "Cottrell CX-09");
    setStingerMaterial(trip.stingerMaterial || "Aluminum");
    setTandemSlide(trip.tandemSlide || 0);

    console.log("Auto-loaded saved trip");
  }
}, []);
 
    const truckBaseWeight = 18000;

  
  const stingerWeight = STINGER_LIBRARY[stingerModel][stingerMaterial];

  // Determine capacity based on stinger name (7, 8, or 9 car)
  const getStingerCapacity = () => {
    if (stingerModel.includes("7")) return 7;
    if (stingerModel.includes("8")) return 8;
    return 9;
  };

  const maxCapacity = getStingerCapacity();

  const filteredModels = useMemo(() => {
    return Object.keys(VEHICLE_LIBRARY).filter((m) =>
      m.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const autoCars = cars;

  const totalVehicleWeight = autoCars.reduce((s, c) => s + c.weight, 0);
  const grossWeight = totalVehicleWeight + truckBaseWeight + stingerWeight;
  const dotWarning = grossWeight > DOT_LIMIT;
  const dotPercentage = Math.min(100, Math.round((grossWeight / DOT_LIMIT) * 100));

  const maxVehicleHeight = autoCars.length
    ? Math.max(...autoCars.map((c) => c.height))
    : 0;

  const estimatedTotalHeight = maxVehicleHeight
    ? maxVehicleHeight + 40
    : 0;

  const heightWarning = estimatedTotalHeight > HEIGHT_LIMIT_IN;
 

  // Axle distribution per position realism
  const axleDistribution = autoCars.map((car, index) => {
    const factor = index < 3 ? 0.6 : 0.4;
    return {
      ...car,
      axleImpact: Math.round(car.weight * factor)
    };
  });

// ================= CENTER OF GRAVITY =================

const positionWeight = autoCars.reduce((acc, car, index) => {
  const positionBias =
    (BASE_POSITIONS.length - index) / BASE_POSITIONS.length;
  return acc + car.weight * positionBias;
}, 0);

const totalWeight = totalVehicleWeight || 1;

const balancePercent =
  ((positionWeight / totalWeight) - 0.5) * 100;

const clampedBalance = Math.max(-50, Math.min(50, balancePercent));
const balancePosition = 50 + clampedBalance;


// ================= SMART WARNINGS =================

const evCount = autoCars.filter(car => car.model.includes("EV")).length;

const isFrontHeavy = clampedBalance > 15;
const isRearHeavy = clampedBalance < -15;
const isNearDotLimit = dotPercentage > 95;
const tooManyEVs = evCount >= 4;


// ================= REAL AXLE + TANDEM SLIDE =================

const baseSteer = truckBaseWeight * 0.2;
const baseDrive = truckBaseWeight * 0.8;

const biasFactor = clampedBalance / 100;

const frontShift = totalVehicleWeight * (0.5 + biasFactor);
const rearShift = totalVehicleWeight * (0.5 - biasFactor);

const slideEffect = tandemSlide * 400;

const steerAxle = baseSteer + frontShift * 0.1;

const driveAxle =
  baseDrive + frontShift * 0.6 + slideEffect;

const trailerAxle =
  stingerWeight + rearShift * 0.9 - slideEffect;

  const axleColor = (value, limit) => {
    if (value > limit) return "text-red-600 font-bold";
    if (value > limit * 0.9) return "text-yellow-600 font-bold";
    return "text-green-600 font-bold";
  };

  const addVehicle = () => {
    if (cars.length >= maxCapacity) return;
    if (!selectedModel) return;
    const data = VEHICLE_LIBRARY[selectedModel];
    setCars((prev) => [...prev, { ...data, model: selectedModel, id: Date.now() }]);
    setSelectedModel("");
  };
  
  const optimizeLoad = () => {
  const sorted = [...cars].sort((a, b) => b.weight - a.weight);

  const middle = Math.floor(BASE_POSITIONS.length / 2);

  const optimized = sorted.map((car, index) => {
    const positionIndex =
      index % 2 === 0
        ? middle - Math.floor(index / 2)
        : middle + Math.floor(index / 2) + 1;

    return {
      ...car,
      position: BASE_POSITIONS[positionIndex] || ""
    };
  });

  setCars(optimized);
    setOptimizeMessage("Load Optimized Successfully ?");

  setTimeout(() => {
    setOptimizeMessage("");
  }, 3000);
};

  const removeVehicle = (id) => {
    setCars((prev) => prev.filter((c) => c.id !== id));
  };
  
const saveTrip = () => {
  const trip = {
    cars,
    stingerModel,
    stingerMaterial,
    tandemSlide
  };

  localStorage.setItem("carHaulerTrip", JSON.stringify(trip));
  console.log("Trip saved");
};

const clearSavedTrip = () => {
  localStorage.removeItem("carHaulerTrip");

  setCars([]);
  setTandemSlide(0);
  setStingerModel("Cottrell CX-09");
  setStingerMaterial("Aluminum");

  console.log("Trip cleared");
};

const loadTrip = () => {
  const stored = localStorage.getItem("carHaulerTrip");
  if (!stored) return;

  const trip = JSON.parse(stored);

  setCars(trip.cars || []);
  setStingerModel(trip.stingerModel || "Cottrell CX-09");
  setStingerMaterial(trip.stingerMaterial || "Aluminum");
  setTandemSlide(trip.tandemSlide || 0);

  console.log("Trip loaded");
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex justify-center items-start py-10">
  <div className="w-full max-w-5xl bg-white p-8 text-black shadow-2xl rounded-2xl">
      <div className="mb-8 border-b pb-4">
  <h1 className="flex items-center gap-4 text-3xl font-extrabold tracking-widest uppercase">
  <svg
    width="60"
    height="30"
    viewBox="0 0 120 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-purple-600"
  >
    {/* Head */}
    <rect x="5" y="15" width="25" height="10" fill="currentColor" />
    
    {/* Cab */}
    <rect x="30" y="10" width="20" height="15" fill="currentColor" />
    
    {/* Stinger frame */}
    <rect x="50" y="5" width="60" height="5" fill="currentColor" />
    <rect x="50" y="20" width="60" height="5" fill="currentColor" />
    
    {/* Wheels */}
    <circle cx="20" cy="30" r="5" fill="currentColor" />
    <circle cx="45" cy="30" r="5" fill="currentColor" />
    <circle cx="80" cy="30" r="5" fill="currentColor" />
    <circle cx="105" cy="30" r="5" fill="currentColor" />
  </svg>

  Car Hauler Pro
</h1>
  
  

    

  <p className="text-sm text-gray-500 mt-1">
    Professional Load Optimization System
  </p>
</div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search vehicle..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      {/* Stinger Config */}
      <div className="mb-6 border p-4 rounded bg-gray-100">
        <h2 className="font-bold mb-2">Stinger Configuration</h2>
        <select
          value={stingerModel}
          onChange={(e) => setStingerModel(e.target.value)}
          className="border p-2 w-full mb-2"
        >
          {Object.keys(STINGER_LIBRARY).map((model) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
        <select
          value={stingerMaterial}
          onChange={(e) => setStingerMaterial(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="Aluminum">Aluminum</option>
          <option value="Steel">Steel</option>
        </select>
      </div>

      {/* Vehicle Add */}
      <div className="mb-6">
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="border p-2 w-full mb-2"
        >
          <option value="">Choose Model</option>
          {filteredModels.map((m) => (
            <option key={m} value={m}>
              {m} — {VEHICLE_LIBRARY[m].weight} lbs / {VEHICLE_LIBRARY[m].height} in
            </option>
          ))}
        </select>
        <button
          onClick={addVehicle}
          disabled={cars.length >= maxCapacity}
          className={`px-4 py-2 rounded-xl shadow-md transition-all duration-200 ${
  cars.length >= maxCapacity
    ? "bg-gray-400 text-white"
    : "bg-blue-600 hover:bg-blue-700 text-white"
}`}

        >
          {cars.length >= maxCapacity ? "Capacity Reached" : "Add Vehicle"}
        </button>
		<button
  onClick={optimizeLoad}
  className="mt-3 ml-3 bg-purple-600 hover:bg-purple-700 transition-all duration-200 text-white px-4 py-2 rounded-xl shadow-md"
>
  Optimize Load
</button>
  {optimizeMessage && (
  <div className="text-green-600 font-bold mt-2">
    {optimizeMessage}
  </div>
)}
		 
		 <button
            onClick={saveTrip}
            className="mt-3 bg-green-600 hover:bg-green-700 transition-all duration-200 text-white px-4 py-2 rounded-xl shadow-md"
>
  Save Current Trip
</button>
<button
  onClick={loadTrip}
  className="mt-3 ml-3 bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white px-4 py-2 rounded-xl shadow-md"
>
  Load Saved Trip
</button>
<button
  onClick={clearSavedTrip}
  className="mt-3 ml-3 bg-red-600 hover:bg-red-700 transition-all duration-200 text-white px-4 py-2 rounded-xl shadow-md"
>
  Clear Saved Trip
</button>
        {cars.length >= maxCapacity && (
          <div className="text-red-600 font-bold mt-2">
            Stinger capacity limit reached ({maxCapacity} vehicles)
          </div>
        )}
      </div>

      {autoCars.length > 0 && (
        <>
          <div className="mb-6 border p-4 rounded bg-gray-100">
            <h2 className="font-bold mb-2">Load Order</h2>
            <div className="text-sm mb-3 bg-white p-3 rounded border">
              <strong>Position Legend (Simple Explanation):</strong>
              <div>TB = Truck Bed (top of head rack)</div>
              <div>OC = Over Cab (above truck cab)</div>
              <div>TTR = Top Trailer Rear</div>
              <div>TFB = Trailer Front Bottom</div>
              <div>TMB = Trailer Middle Bottom</div>
              <div>TTF = Top Trailer Front</div>
              <div>TTR2 = Top Trailer Rear (second rear slot)</div>
              <div>EX1 / EX2 = Extra rear extension slots</div>
            </div>
            {axleDistribution.map((car, i) => {
              const type = classifyVehicle(car.model, car.weight, car.height);
              const heavyClass = car.weight > 6500 ? "text-red-600 font-bold" : "";
              const tallWarning = car.height > 76 ? "text-orange-600 font-bold" : "";

              return (
                <div key={car.id} className="flex justify-between border-b py-1">
                  <span className={`${heavyClass} ${tallWarning}`}>
                    #{i + 1} {car.model} ({car.position}) [{type}]
                  </span>
                  <span className="text-sm">Axle Impact: {car.axleImpact} lbs</span>
                  <button
                    onClick={() => removeVehicle(car.id)}
                    className="text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mb-6 border p-4 rounded bg-gray-50">
            <h2 className="font-bold mb-2">Unload Order</h2>
            {[...autoCars].reverse().map((car, i) => (
              <div key={car.id} className="border-b py-1">
                #{i + 1} {car.model} ({car.position})
              </div>
            ))}
          </div>

          <div className="border p-4 rounded bg-white">
            <h2 className="font-bold mb-4">Weight & Height Summary</h2>
            <div>Gross Weight: {grossWeight} lbs</div>
            <div className="mt-2">
              DOT Usage: {dotPercentage}% of 80,000 lbs
              <div className="w-full bg-gray-200 rounded h-3 mt-1">
                <div
                  className={`h-3 rounded ${dotPercentage > 100 ? "bg-red-600" : dotPercentage > 90 ? "bg-yellow-500" : "bg-green-600"}`}
                  style={{ width: `${dotPercentage}%` }}
                ></div>
              </div>
            </div>
            <div className={heightWarning ? "text-red-600 font-bold" : ""}>
              Height: {estimatedTotalHeight} in
            </div>
            {dotWarning && (
              <div className="text-red-600 font-bold">
                DOT WARNING: Over 80,000 lbs
              </div>
            )}
          </div>
		  {/* SMART LOAD WARNINGS */}
<div className="mt-6 border p-4 rounded bg-red-50">
  <h2 className="font-bold mb-3 text-red-700">Load Risk Analysis</h2>

  <div className="space-y-2 text-sm font-semibold">

    {isFrontHeavy && (
      <div className="text-red-600">
        ? Front Heavy — Shift weight rearward
      </div>
    )}

    {isRearHeavy && (
      <div className="text-red-600">
        ? Rear Heavy — Risk of trailer overload
      </div>
    )}

    {isNearDotLimit && (
      <div className="text-orange-600">
        ? Approaching DOT 80,000 lb limit
      </div>
    )}

    {heightWarning && (
      <div className="text-red-600">
        ? Height Risk — May exceed 13'6"
      </div>
    )}

    {tooManyEVs && (
      <div className="text-yellow-600">
        ? High EV Concentration — Heavy battery load
      </div>
    )}

    {!isFrontHeavy && !isRearHeavy && !isNearDotLimit && !heightWarning && !tooManyEVs && (
  <div className="text-green-600">
    ? Load configuration looks safe
  </div>
)}

  </div>
</div>
{/* CENTER OF GRAVITY */}
<div className="mt-6 border p-4 rounded bg-white">
  <h2 className="font-bold mb-4">Center of Gravity</h2>

  <div className="relative w-full h-6 bg-gray-300 rounded">

    {/* Center Line */}
    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-black"></div>

    {/* Moving Indicator */}
    <div
      className="absolute top-0 h-6 w-4 bg-red-600 rounded transition-all duration-500"
      style={{ left: `${balancePosition}%`, transform: "translateX(-50%)" }}
    ></div>
  </div>

  <div className="flex justify-between text-xs mt-2 font-semibold">
    <span>Front Heavy</span>
    <span>Balanced</span>
    <span>Rear Heavy</span>
  </div>

  <div className="text-center mt-3 font-bold">
    {clampedBalance > 10
  ? "? Front Heavy"
  : clampedBalance < -10
  ? "? Rear Heavy"
  : "? Balanced"}
  </div>
</div>
          {/* AXLE SCREEN */}
		  
		  <div className="mt-6 border p-4 rounded bg-white">
  <h2 className="font-bold mb-3">Tandem Slide Adjustment</h2>

  <input
    type="range"
    min="-5"
    max="5"
    step="1"
    value={tandemSlide}
    onChange={(e) => setTandemSlide(Number(e.target.value))}
    className="w-full"
  />

  <div className="flex justify-between text-sm font-semibold mt-2">
    <span>Forward</span>
    <span>Position: {tandemSlide}</span>
    <span>Backward</span>
  </div>
  
</div>
<div className="mt-6 border p-4 rounded bg-gray-100">
  <h2 className="font-bold mb-4">Axle Screen</h2>

  {[
    { label: "Steer Axle", value: steerAxle, limit: AXLE_LIMITS.steer },
    { label: "Drive Axle", value: driveAxle, limit: AXLE_LIMITS.drive },
    { label: "Trailer Axle", value: trailerAxle, limit: AXLE_LIMITS.trailer }
  ].map((axle) => {
    const percent = Math.min(100, (axle.value / axle.limit) * 100);
    const barColor =
      percent > 100
        ? "bg-red-600"
        : percent > 90
        ? "bg-yellow-500"
        : "bg-green-600";

    return (
      <div key={axle.label} className="mb-4">
        <div className="flex justify-between text-sm font-semibold mb-1">
          <span>{axle.label}</span>
          <span>{Math.round(axle.value)} / {axle.limit} lbs</span>
        </div>

        <div className="w-full bg-gray-300 h-4 rounded">
          <div
            className={`h-4 rounded transition-all duration-700 ease-out ${barColor}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  })}
</div>
         {/* VISUAL TRUCK DIAGRAM */}
          <div className="mt-6 border p-4 rounded bg-white">
  <h2 className="font-bold mb-3">Visual Truck Layout</h2>

  <div className="flex items-center overflow-x-auto gap-4">

    {/* Truck Head */}
    <div className="flex flex-col items-center">
     {["TB", "OC"].map((pos, index) => {
  const carInPosition = autoCars.find(car => car.position === pos);

  return (
    <div
      key={pos}
      className={`w-20 h-14 ${
        index === 0 ? "bg-blue-500" : "bg-blue-600"
      } text-white flex flex-col items-center justify-center text-[10px] rounded p-1 ${index === 1 ? "mt-1" : ""}`}
    >
      <div className="font-bold">{pos}</div>
      {carInPosition && (
        <div className="truncate w-full text-center">
          {carInPosition.model}
        </div>
      )}
    </div>
  );
})} 
      <div className="text-xs mt-1 font-semibold">HEAD</div>
    </div>

    <div className="text-2xl">?</div>

    {/* Trailer */}
    <div className="flex gap-2">
  {BASE_POSITIONS.slice(2).map((pos) => {
    const carInPosition = autoCars.find(car => car.position === pos);
	let weightColor = "bg-gray-400";

if (carInPosition) {
  if (carInPosition.weight > 6500) {
    weightColor = "bg-red-500";
  } else if (carInPosition.weight > 4000) {
    weightColor = "bg-yellow-500";
  } else {
    weightColor = "bg-green-500";
  }
}

    return (
      <div
        key={pos}
        className={`w-28 h-16 ${weightColor} text-white flex flex-col items-center justify-center text-[9px] rounded-xl p-2`}
      >
        <div className="font-bold">{pos}</div>
        {carInPosition && (
          <div className="truncate w-full text-center">
            {carInPosition.model}
          </div>
        )}
      </div>
    );
  })}
</div>
  </div>

    <div className="text-xs mt-3 text-gray-600">
    Blue = Head Rack | Gray = Trailer Positions
  </div>
</div>

        </>
      )}
    </div>
  </div>
);
}