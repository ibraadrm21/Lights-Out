import requests

urls = [
    "https://upload.wikimedia.org/wikipedia/commons/3/36/Monza_banking.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Monza_banking.jpg/640px-Monza_banking.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Monte_Carlo_Casino_Square.jpg/640px-Monte_Carlo_Casino_Square.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Silverstone_Circuit_-_The_Wing.jpg/640px-Silverstone_Circuit_-_The_Wing.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Turn_1_at_COTA.jpg/640px-Turn_1_at_COTA.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Circuit_de_Barcelona.jpg/640px-Circuit_de_Barcelona.jpg"
]

print("Testing URLs...")
for url in urls:
    try:
        r = requests.head(url, timeout=5)
        print(f"{r.status_code}: {url}")
    except Exception as e:
        print(f"Error: {url} - {e}")
