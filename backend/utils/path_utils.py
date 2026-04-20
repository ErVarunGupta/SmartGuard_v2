import os
import sys

def get_base_path():
    """
    Returns base path for both:
    - Development
    - PyInstaller EXE
    """
    if hasattr(sys, "_MEIPASS"):
        return sys._MEIPASS  # PyInstaller temp folder
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def get_resource_path(relative_path: str):
    """
    Safe path resolver for models, data, etc.
    """
    base_path = get_base_path()
    return os.path.join(base_path, relative_path)