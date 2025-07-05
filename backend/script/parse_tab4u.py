#!/usr/bin/env python3

import json
from bs4 import BeautifulSoup
import argparse
import re

parser = argparse.ArgumentParser()
parser.add_argument('--html',required=True, help="Input HTML file with song lyrics and chords")
parser.add_argument('--json', required=True, help="Output file to save the parsed song JSON")
parser.add_argument('--rtl', action='store_true', help="Set if the song is in a right-to-left language (e.g., Hebrew)")

args = parser.parse_args()

def cord_indexes(s):
    # Find all start positions of consecutive non-* character groups
    return [match.start() for match in re.finditer(r'[^*]+', s)]

def word_indexes(s):
    return [( match.start(),match.group()) for match in re.finditer(r'[^*]+', s)]

def check_zipping(els):
    for i,el in enumerate(els):
        c = el.get('class')[0]
        if i%2 == 0:                    
            if not c.startswith("chords"):
                return False
        else:
            if c != "song":
                return False
    return True

def out(wi,ci):
    
    res = []
    while len(wi)>0:
        if len(ci) == 0:
            while len(wi)>0:
                res.append({"lyrics":wi[0][1]})
                wi.pop(0)
            break
        if wi[0][0] + len(wi[0][1]) >= ci[0][0]:
            if ci[0][1]:
                res.append({"lyrics":wi[0][1],"chords": ci[0][1]})
            else:
                res.append({"lyrics":wi[0][1]})
            wi.pop(0)
            ci.pop(0)
        else:
            res.append({"lyrics":wi[0][1]})
            wi.pop(0)
            
    return res
    
    
def is_cord_table(table):    
    clsasses = set()
    tds = table.find_all('td')
    for td in tds:
        clsasses |= set(td.get('class', []))
        
    
    if len(clsasses) != 2:
        return False
    
    if 'song' not in clsasses:
        return False 
    
    if ('chords_en' in clsasses) or ('chords' in clsasses):
        return True
    
    
    return False
    
def make_chord_list(chord_t,he):
    if he:
        chord_t = chord_t[::-1]    
    ii = cord_indexes(chord_t)

    cords = re.split(r"\*+", chord_t)
    if cords[-1]=='':
        cords.pop()
    if cords[0]=='':
        ii.insert(0, 0)
    assert len(cords) == len(ii), f"Length mismatch: {len(cords)} vs {len(ii)}"
    if he:
        cords = [c[::-1] for c in cords]
    ci = list(zip(ii,cords))
    if cords[0]=='':
        ci.pop(0)
    return ci
    
    
def parse_tab4u_song(file_name, he=False):
    text= open(file_name, 'r', encoding='utf-8').read()
    text = text.replace("&nbsp;","*")  # Replace non-breaking spaces with regular spaces
    text = text.replace(' ',"*")
    soup = BeautifulSoup(text, 'html.parser')
    res = []
    tables = soup.find_all('table')
    for table in tables:
        if not is_cord_table(table):
            continue

        els = table.find_all('td', class_=lambda c: c and ('chords' in c.split() or 'chords_en' in c.split() or 'song' in c.split()))
        if not check_zipping(els):
            continue
        pairs = list(zip(els[::2], els[1::2]))
        for chord_el, lyric_el in pairs:
            assert chord_el.get('class')[0].startswith('chords')
            assert lyric_el.get('class')[0] == 'song'
            lyric_t = lyric_el.get_text(strip=True)
            chord_t = chord_el.get_text(strip=True)
            
            ci = make_chord_list(chord_t,he)
            
            wi = word_indexes(lyric_t)
            res.append(out(wi,ci))
    return res

#url = 'https://www.tab4u.com/tabs/songs/2760_The_Beatles_-_Let_It_Be.html'
#parsed_song = parse_tab4u_song("ShlomoArzi.html",True) 
#parsed_song = parse_tab4u_song("Let_It_Be.html")

#parsed_song = parse_tab4u_song("6750_Lukas_Graham_-_Seven_years.html") # "Let_It_Be.html")
#print(json.dumps(parsed_song, indent=4, ensure_ascii=False))
#print(parsed_song)


data = parse_tab4u_song(args.html, args.rtl)
with open(args.json, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)