import os

# Folders and files to ignore
IGNORE_DIRS = {'.git', '__pycache__', '.venv', 'venv', '.pytest_cache'}
IGNORE_FILES = {'.env', 'aura.db', 'pack_code.py', 'verify_aura.py'}

OUTPUT_FILE = "aura_codebase.txt"
TARGET_DIR = "D:\ CATA\ backend"  # <-- Changed to scan the current directory

with open(OUTPUT_FILE, 'w', encoding='utf-8') as outfile:
    for root, dirs, files in os.walk(TARGET_DIR):
        # Remove ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        for file in files:
            if file in IGNORE_FILES or not file.endswith(('.py', '.json', '.md')):
                continue
                
            filepath = os.path.join(root, file)
            
            outfile.write(f"\n{'='*50}\n")
            outfile.write(f"FILE: {filepath}\n")
            outfile.write(f"{'='*50}\n\n")
            
            try:
                with open(filepath, 'r', encoding='utf-8') as infile:
                    outfile.write(infile.read() + "\n")
            except Exception as e:
                outfile.write(f"[Error reading file: {e}]\n")

print(f"✅ Codebase packed successfully into {OUTPUT_FILE}")