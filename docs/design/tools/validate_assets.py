from pathlib import Path
import json, xml.etree.ElementTree as ET
from PIL import Image
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'manifest.json').read_text())
assert len(manifest)==12
count=0
for item in manifest:
 tree=ET.parse(root/item['svg'])
 assert not tree.findall('.//{http://www.w3.org/2000/svg}text')
 assert tree.findall('.//{http://www.w3.org/2000/svg}path')
 sizes=[256,512,1024,2048] if item['kind']=='logo' else [16,24,32,48,64,96,128,180,192,256,512]
 for size in sizes:
  im=Image.open(root/'assets'/item['kind']/'png'/item['variant']/f'{size}.png')
  assert im.width==size and im.mode=='RGBA'
  # At 16 px the rounded corner can retain a few alpha levels after filtering.
  assert im.getchannel('A').getextrema()[0]<=8
  if item['kind']=='icon': assert im.height==size
  else: assert abs(im.height-size*item['height']/item['width'])<=1
  count+=1
for color in ['teal','blue']:
 for theme in ['light','dark']:
  im=Image.open(root/'favicon'/f'{color}-{theme}.ico')
  assert im.ico.sizes()=={(16,16),(32,32),(48,48)}
  for size in [16,32,48]:
   assert im.ico.getimage((size,size)).convert('RGBA').tobytes()==Image.open(root/'assets/icon/png'/f'{color}-{theme}'/f'{size}.png').convert('RGBA').tobytes()
print(f'Validated: 12 outlined SVG masters, {count} transparent PNG files, 4 multi-size ICO files')
