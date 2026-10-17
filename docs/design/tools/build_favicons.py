from pathlib import Path
from PIL import Image
import shutil
root=Path(__file__).resolve().parents[1]
for color in ['teal','blue']:
 for theme in ['light','dark']:
  variant=f'{color}-{theme}'
  source=root/'assets/icon/png'/variant
  for size in [16,32,48,180,192,512]:
   shutil.copyfile(source/f'{size}.png',root/'favicon'/f'{variant}-{size}.png')
  im=Image.open(source/'48.png')
  im.save(root/'favicon'/f'{variant}.ico',sizes=[(16,16),(32,32),(48,48)],append_images=[Image.open(source/'16.png'),Image.open(source/'32.png')])
print('4 ICO files and PNG favicon/app icon sizes created')
