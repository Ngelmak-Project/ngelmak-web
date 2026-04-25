import os
import re
import json
import sys

# Directories to scan
SCAN_DIRS = ["src/app", "src/components", "src/pages"]

# Translation files
TRANSLATION_FILES = {
    "en": "src/assets/i18n/en.json",
    "fr": "src/assets/i18n/fr.json",
}

# Your chosen prefix
PREFIX = "ngelmakTranslation."

# Regex: match keys starting with ngelmakTranslation.
KEY_PATTERN = rf"{PREFIX}[A-Za-z0-9_.-]+"

def extract_used_keys():
    keys = set()

    for base in SCAN_DIRS:
        for root, _, files in os.walk(base):
            for file in files:
                if file.endswith((".ts", ".html")):
                    path = os.path.join(root, file)
                    with open(path, "r", encoding="utf-8") as f:
                        content = f.read()
                        matches = re.findall(KEY_PATTERN, content)
                        keys.update(matches)

    return sorted(keys)

def load_translations():
    translations = {}
    for lang, path in TRANSLATION_FILES.items():
        with open(path, "r", encoding="utf-8") as f:
            translations[lang] = json.load(f)
    return translations

def flatten_json(d, prefix=""):
    keys = []
    for k, v in d.items():
        full = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            keys.extend(flatten_json(v, full))
        else:
            keys.append(full)
    return keys

def main():
    used_keys = extract_used_keys()
    translations = load_translations()

    missing = {lang: [] for lang in translations}

    for lang, data in translations.items():
        available = set(flatten_json(data))

        for key in used_keys:
            if key not in available:
                missing[lang].append(key)

    has_errors = False
    for lang, keys in missing.items():
        if keys:
            has_errors = True
            print(f"\n❌ Missing keys in {lang}.json:")
            for k in keys:
                print(f"  - {k}")

    if has_errors:
        print("\n⛔ Build failed: missing translation keys detected.")
        sys.exit(1)

    print("✅ All translation keys are present.")
    sys.exit(0)

if __name__ == "__main__":
    main()
