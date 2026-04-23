import os

OUTPUT_FILE = "project_details.txt"
ROOT_DIR = "."  # current project folder

EXCLUDE_FOLDERS = ["venv", "__pycache__", "node_modules", ".git"]
EXCLUDE_EXT = [".png", ".jpg", ".jpeg", ".gif", ".exe", ".dll", ".env"]


def is_excluded(path):
    for folder in EXCLUDE_FOLDERS:
        if folder in path:
            return True
    return False


def should_read_file(file):
    for ext in EXCLUDE_EXT:
        if file.endswith(ext):
            return False
    return True


def write_line(f, text=""):
    f.write(text + "\n")


def export_project():
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        write_line(f, "===== SMARTGUARD PROJECT EXPORT =====\n")

        for root, dirs, files in os.walk(ROOT_DIR):
            if is_excluded(root):
                continue

            write_line(f, f"\n📁 Folder: {root}")

            for file in files:
                file_path = os.path.join(root, file)

                if not should_read_file(file):
                    continue

                write_line(f, f"\n📄 File: {file}")

                try:
                    with open(file_path, "r", encoding="utf-8") as code_file:
                        content = code_file.read()

                        # limit large files
                        if len(content) > 2000:
                            content = content[:2000] + "\n... (truncated)\n"

                        write_line(f, content)

                except Exception as e:
                    write_line(f, f"[Could not read file: {e}]")

    print(f"\n✅ Project details exported to {OUTPUT_FILE}")


if __name__ == "__main__":
    export_project()