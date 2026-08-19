import os
import pandas as pd
from supabase import create_client

SUPABASE_URL = "https://qzcjanfxvaxpjgxznpel.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6Y2phbmZ4dmF4cGpneHpucGVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQ5MDYwOSwiZXhwIjoyMDk2MDY2NjA5fQ.-wHRxXru7F9yoFjVvRgxwvAnPYq44UB9GCcwcXArcc8"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Loading metadata_ready.csv...")
df = pd.read_csv('metadata_ready.csv')

records = []
for watch in df['watch_query'].dropna():
    records.append({
        'watch_query': watch,
        'status': 'pending'
    })

print(f"Prepared {len(records)} watches for upload.")

batch_size = 500
for i in range(0, len(records), batch_size):
    batch = records[i:i + batch_size]
    response = supabase.table('Raw Watches').insert(batch).execute()
    print(f"Uploaded batch {i // batch_size + 1} / {(len(records) + batch_size - 1) // batch_size}")

print("All metadata watches successfully uploaded to Raw Watches waiting room!")
