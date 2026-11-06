import React, { useEffect, useState } from 'react';
import { Card, Flex } from '@radix-ui/themes';
import { MapPin, Clock3, Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudDrizzle, CloudRain, Snowflake, CloudLightning } from 'lucide-react';

const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=28.36&longitude=75.59&current=temperature_2m,weather_code,is_day&timezone=Asia%2FKolkata&temperature_unit=celsius&forecast_days=1';
const refreshEvery = 15 * 60 * 1000;
const cacheKey = 'portfolio-pilani-weather-v1';
const clock = new Intl.DateTimeFormat('en-IN', { timeZone:'Asia/Kolkata', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true });

function conditions(code, day) {
 if (code === 0) return [day ? Sun : Moon, 'Clear sky'];
 if (code === 1) return [day ? CloudSun : CloudMoon, 'Mainly clear'];
 if (code === 2) return [day ? CloudSun : CloudMoon, 'Partly cloudy'];
 if (code === 3) return [Cloud, 'Overcast'];
 if ([45,48].includes(code)) return [CloudFog, 'Foggy'];
 if ([51,53,55,56,57].includes(code)) return [CloudDrizzle, 'Drizzle'];
 if ([61,63,65,66,67].includes(code)) return [CloudRain, 'Rain'];
 if ([71,73,75,77,85,86].includes(code)) return [Snowflake, 'Snow'];
 if ([80,81,82].includes(code)) return [CloudRain, 'Rain showers'];
 if ([95,96,97,99].includes(code)) return [CloudLightning, 'Thunderstorms'];
 return [Cloud, 'Current weather'];
}

export function LocalStatus() {
 const [now,setNow] = useState(null);
 const [weather,setWeather] = useState(null);
 const [unavailable,setUnavailable] = useState(false);
 useEffect(() => {
  const tick = () => setNow(new Date());
  tick();
  const timer = setInterval(tick,1000);
  return () => clearInterval(timer);
 },[]);
 useEffect(() => {
  let stopped = false, controller;
  async function update() {
   // Reuse a recent reading across page visits; never display an old one as current.
   try {
    const cached = JSON.parse(sessionStorage.getItem(cacheKey) || 'null');
    if (cached && Number.isFinite(cached.temperature) && Number.isInteger(cached.code) && cached.fetchedAt <= Date.now() && Date.now() - cached.fetchedAt < refreshEvery) {
     setWeather(cached); setUnavailable(false); return;
    }
   } catch {}
   controller?.abort();
   const request = new AbortController(); controller = request;
   const timeout = setTimeout(() => request.abort(),8000);
   try {
    const response = await fetch(weatherUrl,{signal:request.signal});
    if (!response.ok) throw new Error('Weather request failed');
    const { current } = await response.json();
    if (!Number.isFinite(current?.temperature_2m) || !Number.isInteger(current?.weather_code)) throw new Error('Weather data unavailable');
    const reading = { temperature:Math.round(current.temperature_2m), code:current.weather_code, day:current.is_day === 1, fetchedAt:Date.now() };
    if (stopped) return;
    setWeather(reading); setUnavailable(false);
    try { sessionStorage.setItem(cacheKey,JSON.stringify(reading)); } catch {}
   } catch {
    if (!stopped) { setWeather(null); setUnavailable(true); }
   } finally { clearTimeout(timeout); }
  }
  update();
  const timer = setInterval(update,refreshEvery);
  const onVisible = () => { if (document.visibilityState === 'visible') update(); };
  document.addEventListener('visibilitychange',onVisible);
  return () => { stopped = true; controller?.abort(); clearInterval(timer); document.removeEventListener('visibilitychange',onVisible); };
 },[]);
 const [WeatherIcon,description] = weather ? conditions(weather.code,weather.day) : [Cloud,unavailable ? 'Weather unavailable' : 'Checking the skies…'];
 return <Card className="local-status" size="2" aria-label="Location, local time and weather in Pilani">
  <Flex align="center" justify="between" gap="3" className="local-status-top"><span className="local-place"><MapPin size={13} aria-hidden="true"/>Pilani, India</span><span className="local-clock"><Clock3 size={11} aria-hidden="true"/><time dateTime={now?.toISOString()} aria-label={now ? `Local time in Pilani: ${clock.format(now)}, India Standard Time` : 'India Standard Time'}>{now ? clock.format(now).toUpperCase() : 'Local time'}<span> IST</span></time></span></Flex>
  <Flex align="center" justify="between" gap="2" className="local-weather"><span><WeatherIcon size={16} aria-hidden="true"/>{weather && <strong>{weather.temperature}°C</strong>}{description}</span><a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" aria-label="Weather data by Open-Meteo">Open-Meteo</a></Flex>
 </Card>;
}
