#!/usr/bin/env python3
"""Check public static assets and local links; no app files or network access."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re
root=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self,text):
        super().__init__(); self.ids=[]; self.links=[]; self.languages=[]; self.headings=[]; self.images=[]; self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.append(a['id'])
        if 'data-language' in a:self.languages.append(a['data-language'])
        if tag=='h1':self.headings.append(tag)
        for key in ['href','src']:
            if key in a:self.links.append(a[key])
        if tag=='img':self.images.append(a)
pages={p.name:Page(p.read_text()) for p in root.glob('*.html')}
errors=[]
for name,page in pages.items():
    if sorted(page.languages)!=['en','zh']:errors.append(f'{name}: both languages required')
    if len(page.headings)!=2:errors.append(f'{name}: one h1 per language required')
    if len(page.ids)!=len(set(page.ids)):errors.append(f'{name}: duplicate IDs')
    for image in page.images:
        if not all(k in image for k in ['alt','width','height']):errors.append(f'{name}: image missing accessibility/dimensions')
    for link in page.links:
        u=urlsplit(link)
        if u.scheme or u.netloc:continue
        target=root/unquote(u.path or name)
        if not target.is_file():errors.append(f'{name}: missing {link}')
        elif u.fragment and target.suffix=='.html' and u.fragment not in pages[target.name].ids:errors.append(f'{name}: missing anchor {link}')
for asset in (root/'assets').glob('*.png'):
    if not asset.read_bytes().startswith(b'\x89PNG\r\n\x1a\n'):errors.append(f'{asset.name}: wrong encoding')
if errors:raise SystemExit('\n'.join(errors))
print(f'{len(pages)} bilingual pages; all internal links, fragments, image dimensions and PNG signatures passed.')
