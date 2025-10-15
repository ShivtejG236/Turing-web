export async function getCurrentWeather(location = 'New Delhi') {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}&aqi=no`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`WeatherAPI error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log(`[WEATHER] Fetched weather data for: ${location}`);
    
    return {
      success: true,
      weather: {
        location: {
          name: data.location.name,
          region: data.location.region,
          country: data.location.country,
          localtime: data.location.localtime
        },
        current: {
          temp_c: data.current.temp_c,
          temp_f: data.current.temp_f,
          condition: {
            text: data.current.condition.text,
            icon: data.current.condition.icon
          },
          wind_kph: data.current.wind_kph,
          wind_dir: data.current.wind_dir,
          humidity: data.current.humidity,
          feelslike_c: data.current.feelslike_c,
          feelslike_f: data.current.feelslike_f,
          uv: data.current.uv,
          pressure_mb: data.current.pressure_mb,
          vis_km: data.current.vis_km
        }
      }
    };
  } catch (error) {
    console.error('[WEATHER] Error fetching weather:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
