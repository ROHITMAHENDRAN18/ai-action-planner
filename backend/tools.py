def calculate_time_budget(tasks):
    total_hours = sum(task["hours"] for task in tasks)

    if total_hours <= 5:
        status = "REALISTIC"
    elif total_hours <= 10:
        status = "MODERATE"
    else:
        status = "HEAVY"

    return {
        "total_hours": total_hours,
        "status": status
    }