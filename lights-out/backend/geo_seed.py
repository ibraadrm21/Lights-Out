# geo_seed.py - seed de puntos Mapillary/coords F1 (ejemplo)
from database import get_connection

def seed_geo_examples():
    coords = [
        # Ejemplo: lat, lon, description, mapillary_image_id (mock)
        (45.630, 9.281, "Autodromo Nazionale Monza - Entradas", "mapid_example_1"),
        (43.7347, 7.4206, "Circuit de Monaco - Casino", "mapid_example_2"),
    ]
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute("SELECT COUNT(*) as c FROM geo_locations")
    if cur.fetchone()["c"] > 0:
        conn.close()
        return

    for lat, lon, desc, mid in coords:
        cur.execute("INSERT INTO geo_locations (lat, lon, description, mapillary_image_id) VALUES (?, ?, ?, ?)", (lat, lon, desc, mid))
    conn.commit()
    conn.close()
