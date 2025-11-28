from database import get_connection
from geo_seed import seed_geo_examples

def reset_geo():
    print("Resetting geo locations...")
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM geo_locations")
    conn.commit()
    conn.close()
    print("Geo locations cleared.")
    
    seed_geo_examples()
    print("Geo locations re-seeded.")

if __name__ == "__main__":
    reset_geo()
