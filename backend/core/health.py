# core/health.py

def calculate_health_score(cpu, ram, disk, pred):
    """
    Calculates system health score (0–100) and label
    """

    cpu_score = max(0, 100 - cpu)
    ram_score = max(0, 100 - ram)
    disk_score = max(0, 100 - disk)

    # Stability based on prediction
    if pred == 0:        # Normal
        stability = 100
    elif pred == 1:      # High Load
        stability = 60
    else:                # Hang Risk
        stability = 20

    health_score = (
        cpu_score * 0.35 +
        ram_score * 0.35 +
        disk_score * 0.20 +
        stability * 0.10
    )

    health_score = round(health_score)

    if health_score >= 80:
        label = "Excellent 🟢"
    elif health_score >= 60:
        label = "Fair 🟡"
    else:
        label = "Poor 🔴"

    return health_score, label
