import urllib.request
import urllib.error
import os

SUPABASE_URL = "https://fptnqolkmagfyjpedbix.supabase.co"
save_dir = "assets/images/students"

# Map: supabase filename -> local filename needed by the code
files_to_download = {
    "v-t-raghul-vasun.jpeg": "v-t-raghul-vasun.jpg",
    "k-r-nitin.jpeg": "k-r-nitin.jpg",
    "sakthishree-d.jpeg": "sakthishree-d.jpg",
    "kiruthika-s.jpeg": "kiruthika-s.jpg",
    "soorya-velaa-p.jpeg": "soorya-velaa-p.jpg",
    "sri-vatsan-p.jpeg": "sri-vatsan-p.jpg",
    "pratheep-d.jpeg": "pratheep-d.jpg",
    "pugazhendhi-s.jpeg": "pugazhendhi-s.jpg",
    "mohammed-ayman-m.jpeg": "mohammed-ayman-m.jpg",
    "s-thirumurugan.jpeg": "s-thirumurugan.jpg",
    # Also update ones that might have better versions in Supabase
    "sanjeev-gh.jpeg": "sanjeev-gh.jpg",
    "santhosh-kumar-s.jpeg": "santhosh-kumar-s.jpg",
}

os.makedirs(save_dir, exist_ok=True)

for supabase_name, local_name in files_to_download.items():
    url = f"{SUPABASE_URL}/storage/v1/object/public/photo/sttudents/{supabase_name}"
    save_path = os.path.join(save_dir, local_name)
    try:
        urllib.request.urlretrieve(url, save_path)
        size = os.path.getsize(save_path)
        print(f"OK: {supabase_name} -> {local_name} ({size} bytes)")
    except Exception as e:
        print(f"FAIL: {supabase_name} -> {e}")
