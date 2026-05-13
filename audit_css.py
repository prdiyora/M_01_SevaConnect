import os
import glob

def check_css_files():
    css_files = glob.glob('seva-connect-fronted/src/**/*.css', recursive=True)
    for file_path in css_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            open_braces = content.count('{')
            close_braces = content.count('}')
            if open_braces != close_braces:
                print(f"ERROR in {file_path}: {open_braces} open, {close_braces} close")
            
            # Check for "orphaned" content after a closing brace
            # e.g. } some content {
            # or } content without brace
            
            # Check for :: space
            if ':: ' in content:
                print(f"SUSPICIOUS space in {file_path}: ':: ' found")
            
            # Check for : :
            if ': :' in content:
                print(f"SUSPICIOUS space in {file_path}: ': :' found")

            # Check for : space pseudo
            import re
            if re.search(r':[ \t]+:[a-z]', content):
                 print(f"SUSPICIOUS space in {file_path}: ': :pseudo' found")

if __name__ == "__main__":
    check_css_files()
