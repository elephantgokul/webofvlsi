import urllib.request
import urllib.error
import json
import sys

SUPABASE_URL = "https://fptnqolkmagfyjpedbix.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdG5xb2xrbWFnZnlqcGVkYml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1MjkzNjQsImV4cCI6MjEwMzEwNTM2NH0.NdByMySJ_hRyX3F3OB5sUlxF8kEuXYCHd0_9B__iuWA"

def list_files(bucket, folder=""):
    url = f"{SUPABASE_URL}/storage/v1/object/list/{bucket}"
    data = json.dumps({"prefix": folder, "limit": 200, "sortBy": {"column": "name", "order": "asc"}}).encode()
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('apikey', SUPABASE_ANON_KEY)
    req.add_header('Authorization', f'Bearer {SUPABASE_ANON_KEY}')
    req.add_header('Content-Type', 'application/json')
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read().decode())
            return result
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:500]
        print(f"HTTP {e.code}: {body}")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

# Try listing ALL possible bucket/folder combinations
combos = [
    ("photo", ""),
    ("photo", "sttudents"),
    ("photo", "students"),
    ("students", ""),
    ("faculty", ""),
    ("gallery", ""),
]

for bucket, folder in combos:
    print(f"\n=== Bucket: '{bucket}', Folder: '{folder}' ===")
    result = list_files(bucket, folder)
    if result is None:
        print("  (request failed)")
    elif len(result) == 0:
        print("  (empty)")
    else:
        for item in result:
            name = item.get('name', '?')
            metadata = item.get('metadata', None)
            if metadata:
                size = metadata.get('size', '?')
                mimetype = metadata.get('mimetype', '?')
                print(f"  FILE: {name} | {size} bytes | {mimetype}")
            else:
                print(f"  DIR:  {name}/")

# Also test if we can HEAD request a known good file
print("\n=== Testing HEAD requests ===")
test_files = [
    "photo/sttudents/gokul.jpg",
    "students/gokul.jpg",
    "photo/gokul.jpg",
]
for path in test_files:
    url = f"{SUPABASE_URL}/storage/v1/object/public/{path}"
    try:
        req = urllib.request.Request(url, method='HEAD')
        with urllib.request.urlopen(req, timeout=5) as resp:
            print(f"  200 OK: {path} ({resp.headers.get('Content-Length', '?')} bytes)")
    except urllib.error.HTTPError as e:
        print(f"  {e.code}: {path}")
    except Exception as e:
        print(f"  ERR: {path} - {e}")
