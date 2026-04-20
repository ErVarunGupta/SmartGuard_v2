import psutil
import random
import pandas as pd
import time

data = []

for i in range(500):
    cpu = psutil.cpu_percent()
    ram = psutil.virtual_memory().percent

    packet_size = random.randint(40, 1500)
    packet_rate = random.randint(1, 200)
    unique_ips = random.randint(1, 50)

    # Label logic (temporary)
    if cpu > 80 or packet_rate > 150:
        label = 1  # attack
    else:
        label = 0  # normal

    data.append([
        cpu, ram, packet_size, packet_rate, unique_ips, label
    ])

    time.sleep(0.05)

df = pd.DataFrame(data, columns=[
    "cpu", "ram", "packet_size", "packet_rate", "unique_ips", "label"
])

df.to_csv("data/ids_dataset.csv", index=False)

print("✅ Dataset generated")