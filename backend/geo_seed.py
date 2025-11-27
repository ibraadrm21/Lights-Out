# geo_seed.py - seed de puntos Mapillary/coords F1 (ejemplo)
from database import get_connection

def seed_geo_examples():
    coords = [
        (45.630, 9.281, "Autodromo Nazionale Monza", "https://upload.wikimedia.org/wikipedia/commons/3/36/Monza_banking.jpg"),
        (43.7347, 7.4206, "Circuit de Monaco", "https://upload.wikimedia.org/wikipedia/commons/3/3d/Monte_Carlo_Casino_Square.jpg"),
        (52.0786, -1.0169, "Silverstone Circuit", "https://upload.wikimedia.org/wikipedia/commons/2/29/Silverstone_Circuit_-_The_Wing.jpg"),
        (30.1328, -97.6411, "Circuit of the Americas", "https://upload.wikimedia.org/wikipedia/commons/6/66/Turn_1_at_COTA.jpg"),
        (41.5700, 2.2611, "Circuit de Barcelona-Catalunya", "https://upload.wikimedia.org/wikipedia/commons/9/9c/Circuit_de_Barcelona.jpg"),
    ]
    conn = get_connection()
    cur = conn.cursor()
    # Clear existing to avoid duplicates of bad data
    cur.execute("DELETE FROM geo_locations")
    for lat, lon, desc, mid in coords:
        cur.execute("INSERT INTO geo_locations (lat, lon, description, mapillary_image_id) VALUES (?, ?, ?, ?)", (lat, lon, desc, mid))
    conn.commit()
    conn.close()
