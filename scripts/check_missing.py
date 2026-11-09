import json
import re

api_js = open('js/api.js', 'r', encoding='utf-8').read()
scoring_js = open('js/scoring.js', 'r', encoding='utf-8').read()

api_rollnos = re.findall(r'\"?registerNo\"?:\s*[\'\"](24VL\d+)[\'\"]', api_js)
scoring_rollnos = re.findall(r'\'(24VL\d+)\':\s*\[', scoring_js)

missing = set(api_rollnos) - set(scoring_rollnos)
extra = set(scoring_rollnos) - set(api_rollnos)

print('API:', len(set(api_rollnos)))
print('Scoring:', len(set(scoring_rollnos)))
print('Missing in scoring:', missing)
print('Extra in scoring:', extra)
