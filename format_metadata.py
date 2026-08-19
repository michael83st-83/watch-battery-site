import pandas as pd

# Load the metadata file
df = pd.read_csv('watches/watches/metadata.csv', encoding='utf-8', on_bad_lines='skip')

# Combine brand and name to form a robust watch_query
df['watch_query'] = df['brand'].astype(str).str.strip() + ' ' + \
                    df['name'].astype(str).str.strip()

# Clean up any blank/nan values and duplicate spaces
df['watch_query'] = df['watch_query'].str.replace('nan', '', regex=False).str.replace(r'\s+', ' ', regex=True).str.strip()

# Keep unique watch queries
output = df[['watch_query']].replace('', pd.NA).dropna().drop_duplicates()

# Save out to a new ready file
output.to_csv('metadata_ready.csv', index=False)

print(f"Success! Formatted {len(output)} watches ready for Supabase.")
