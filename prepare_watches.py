import pandas as pd
import os
import urllib.request

# 1. Define the target URL and filenames
# Replace this URL with the raw link to whatever GitHub or Hugging Face CSV you find
RAW_DATA_URL = "https://raw.githubusercontent.com/example-user/watch-database/main/heavy_raw_data.csv" 
RAW_FILENAME = "heavy_raw_data.csv"
CLEAN_FILENAME = "ready_for_supabase.csv"

# 2. Download the heavy raw file
print(f"Downloading massive dataset from {RAW_DATA_URL}...")
urllib.request.urlretrieve(RAW_DATA_URL, RAW_FILENAME)
print("Download complete.")

# 3. Process the file in chunks to save RAM
print("Cleaning data and extracting reference numbers...")
chunk_size = 10000
first_chunk = True

# We assume the raw CSV has a column called 'title' or 'watch_name'
# Pandas processes this 10,000 rows at a time so your Chromebook doesn't freeze
for chunk in pd.read_csv(RAW_FILENAME, chunksize=chunk_size):
    # Create the clean dataframe with just the 2 columns your Supabase table needs
    clean_chunk = pd.DataFrame()
    
    # IMPORTANT: Change 'title' to whatever the source column is actually named in the dataset
    clean_chunk['watch_query'] = chunk['title'] 
    
    # Hardcode the status column so n8n knows to pick it up
    clean_chunk['status'] = 'pending'
    
    # Drop any rows where watch_query ended up blank
    clean_chunk.dropna(subset=['watch_query'], inplace=True)
    
    # Append to the clean CSV
    if first_chunk:
        clean_chunk.to_csv(CLEAN_FILENAME, index=False, mode='w')
        first_chunk = False
    else:
        clean_chunk.to_csv(CLEAN_FILENAME, index=False, mode='a', header=False)

print(f"Clean data saved to {CLEAN_FILENAME}.")

# 4. The Cleanup: Delete the massive raw file to save your local storage
print("Deleting heavy raw files to free up space...")
if os.path.exists(RAW_FILENAME):
    os.remove(RAW_FILENAME)
    
print("Cleanup complete. The lightweight CSV is ready for Supabase upload!")
