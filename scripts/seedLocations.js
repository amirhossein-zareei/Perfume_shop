const path = require("path");
const fs = require("fs");

const { connectMongoDB } = require("../src/config/index");
const { State, City } = require("../src/models/Location");

function loadJSONData(fileName) {
  const filePath = path.join(__dirname, `../data/${fileName}`);

  return JSON.parse(fs.readFileSync(filePath), "utf-8");
}

function filterByCountry(data, countryName) {
  return data.filter((item) => item.countryName === countryName);
}

async function insertStates(states) {
  await State.deleteMany();

  const formattedStates = states.map((state) => ({
    _id: state.id,
    name: state.name,
  }));

  await State.insertMany(formattedStates);

  console.log(`✅ Inserted ${formattedStates.length} states`);
}

async function insertCities(cities) {
  await City.deleteMany();

  const formattedCities = cities.map((city) => ({
    name: city.name,
    stateId: city.stateId,
    latitude: Number(city.latitude),
    longitude: Number(city.longitude),
  }));

  await City.insertMany(formattedCities);

  console.log(`✅ Inserted ${formattedCities.length} cities`);
}

(async () => {
  try {
    const countryName = process.argv[2];

    if (!countryName) {
      console.log(
        `⚠️  Please provide a country name as a command-line argument.`
      );
      process.exit(1);
    }

    await connectMongoDB();
    console.log("✅ Connected to MongoDB");

    const allStates = loadJSONData("states.json");
    const allCities = loadJSONData("cities.json");

    const filteredStates = filterByCountry(allStates, countryName);
    const filteredCities = filterByCountry(allCities, countryName);

    if (filteredStates.length === 0 && filteredCities.length === 0) {
      console.log(
        `⚠️  No states or cities found for the country: "${countryName}"`
      );

      process.exit(1);
    }

    await insertStates(filteredStates);
    await insertCities(filteredCities);

    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);

    process.exit(1);
  }
})();
