import os
import time
import requests
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
MAPS_API_KEY = os.getenv("ELECTRICITY_MAPS_API_KEY")

if not url or not key or not MAPS_API_KEY:
    print("❌ Error: Missing environment variables.")
    exit()

supabase = create_client(url, key)

def get_live_intensity(zone_code):
    api_url = f"https://api.electricitymaps.com/v3/carbon-intensity/latest?zone={zone_code}"
    headers = {"auth-token": MAPS_API_KEY}
    try:
        response = requests.get(api_url, headers=headers, timeout=10)
        if response.status_code == 200:
            return response.json()['carbonIntensity']
        return 400 # Default fallback
    except:
        return 400

def run_eco_audit(region_name, zone_code, cpu_watts):
    intensity = get_live_intensity(zone_code)
    carbon_output = (cpu_watts / 1000) * 1 * intensity
    data = {"region": region_name, "watts": cpu_watts, "carbon_output": round(carbon_output, 2)}
    try:
        supabase.table("carbon_logs").insert(data).execute()
        print(f"✅ [{region_name}] Audit Success: {intensity} g/kWh")
    except Exception as e:
        print(f"❌ Error: {e}")

def start_monitoring():
    print("🚀 EcoTrack Monitoring Engine (1-Hour Cycle) Started...")
    
    
    regions = [
    ("Sri Lanka", "LK", 150), ("USA", "US", 200), ("France", "FR", 120),
    ("India", "IN", 180), ("China", "CN", 220), ("Germany", "DE", 160),
    ("Norway", "NO-1", 110), ("Australia", "AUS-NSW", 190), ("Canada", "CA-ON", 130),
    ("Japan", "JP-TK", 175), ("Brazil", "BR", 140), ("Singapore", "SG", 160),     
    ("South Africa", "ZA", 190), ("Sweden", "SE-3", 120), ("Denmark", "DK-1", 120),       
    ("South Korea", "KR", 180), ("Italy", "IT-NO", 140), ("Mexico", "MX", 160), 
    ("United Kingdom", "GB", 150), ("Netherlands", "NL", 130), ("Spain", "ES", 140), 
    ("Russia", "RU", 200), ("Turkey", "TR", 170), ("Argentina", "AR", 150), 
    ("Egypt", "EG", 180), ("Indonesia", "ID", 190), ("Saudi Arabia", "SA", 210), 
    ("Poland", "PL", 160)
    ]

    while True:
        for name, zone, watts in regions:
            run_eco_audit(name, zone, watts)
        
        # 3600 seconds = 1 Hour
        print("\n😴 Cycle Complete. Waiting 1 hour for next update...")
        time.sleep(3600) 

if __name__ == "__main__":
    start_monitoring()