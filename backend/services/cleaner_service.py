import os
import tempfile

def get_cleaner_data():

    temp_path = tempfile.gettempdir()

    total_size = 0

    file_count = 0

    for root, dirs, files in os.walk(temp_path):

        for file in files:
            try:
                fp = os.path.join(root, file)

                total_size += os.path.getsize(fp)

                file_count += 1

            except:
                pass

    gb = round(total_size / (1024 ** 3), 2)

    return {
        "junk_files": gb,
        "cache_files": round(gb * 0.4, 2),
        "temp_files": round(gb * 0.2, 2),
        "cleaned": 0
    }