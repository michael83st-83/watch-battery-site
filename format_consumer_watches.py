import pandas as pd

# Load using latin-1 encoding to handle special characters cleanly, with semicolon separator
df = pd.read_csv('watch_db.csv', sep=';', encoding='latin-1', on_bad_lines='skip')

# Combine Brand and Name (or Family if helpful) to form a robust watch_query
# Let's combine Brand, Family, and Name to make sure unique models are distinct
df['watch_query'] = df['Brand'].astype(str).str.strip() + ' ' + \
                    df['Family'].astype(str).str.strip() + ' ' + \
                    df['Name'].astype(str).str.strip()

# Clean up any weird multi-spaces or 'nan' values if columns were blank
df['watch_query'] = df['watch_query'].str.replace('nan', '', regex=False).str.replace(r'\s+', ' ', regex=True).str.strip()

# Filter out empty strings, keep only watch_query, and drop duplicates
output = df[['watch_query']].replace('', pd.NA).dropna().drop_duplicates()

# Save out to your clean pipeline-ready file
output.to_csv('consumer_watches_ready.csv', index=False)

print(f"Success! Formatted {len(output)} consumer watches ready for Supabase.")
