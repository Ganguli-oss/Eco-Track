import os
import random
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

regions = [("Norway", 40), ("France", 60), ("USA", 400), ("India", 700), ("China", 650)]

def seed_historical_data():
    print("⏳ Seeding 30 days of historical data...")
    all_data = []
    
    # Generate data for the last 30 days
    for i in range(30 * 24): # 30 days * 24 hours
        past_time = datetime.now() - timedelta(hours=i)
        
        for name, base_intensity in regions:
            # Add some randomness to intensity
            intensity = base_intensity + random.randint(-20, 20)
            carbon = (150 / 1000) * 1 * intensity
            
            all_data.append({
                "region": name,
                "watts": 150,
                "carbon_output": round(carbon, 2),
                "created_at": past_time.isoformat()
            })
            
        # Insert in batches of 100 to avoid errors
        if len(all_data) >= 100:
            supabase.table("carbon_logs").insert(all_data).execute()
            all_data = []
            
    print("✅ Success! Your chart now has 30 days of history.")

if __name__ == "__main__":
    seed_historical_data()