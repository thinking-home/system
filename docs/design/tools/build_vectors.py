"""Rebuild outlined SVG masters from pinned fonts and approved geometry."""
from pathlib import Path
import json, io
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

ROOT=Path(__file__).resolve().parents[1]
G=json.loads((ROOT/'source/geometry.json').read_text())
def shaped(text,weight,size):
 data=(ROOT/f'source/fonts/NunitoSans-{weight}.ttf').read_bytes()
 tt=TTFont(io.BytesIO(data)); gs=tt.getGlyphSet(); order=tt.getGlyphOrder()
 font=hb.Font(hb.Face(data)); up=font.face.upem; font.scale=(up,up)
 buf=hb.Buffer();buf.add_str(text);buf.guess_segment_properties();hb.shape(font,buf)
 x=0;paths=[];bounds=[];scale=size/up
 for info,pos in zip(buf.glyph_infos,buf.glyph_positions):
  glyph=gs[order[info.codepoint]];pen=SVGPathPen(gs);glyph.draw(pen)
  tx=x+pos.x_offset*scale;ty=-pos.y_offset*scale
  if pen.getCommands():paths.append(f'<path d="{pen.getCommands()}" transform="translate({tx:.6f} {ty:.6f}) scale({scale:.8f} {-scale:.8f})"/>')
  bp=BoundsPen(gs);glyph.draw(bp)
  if bp.bounds:
   a,b,c,d=bp.bounds;bounds.append((tx+a*scale,ty-d*scale,tx+c*scale,ty-b*scale))
  x+=pos.x_advance*scale-.015*size
 return ''.join(paths),x,(min(b[0] for b in bounds),min(b[1] for b in bounds),max(b[2] for b in bounds),max(b[3] for b in bounds))

variants={'teal-light':('#005B6B','#20232A',False),'teal-dark':('#076B7B','#F5F7FB',False),'blue-light':('#1E47B3','#20232A',False),'blue-dark':('#2B55C3','#F5F7FB',False),'mono':('#111111','#111111',True),'inverse':('#FFFFFF','#FFFFFF',True)}
manifest=[]
for kind in ['logo','icon']:
 for name,(fill,ink,knockout) in variants.items():
  if kind=='logo':
   a,aw,ab=shaped('th',600,100);b,bw,bb=shaped('inking home',600,100)
   r=G['rect'];x,y,w,h,rx=r['x'],r['y'],r['width'],r['height'],r['rx']
   letters=f'<g transform="translate(0 {G["baseline"]})">{a}</g>'
   rest=f'<g fill="{ink}" transform="translate({G["restX"]} {G["baseline"]})">{b}</g>'
   vx=x-1;vy=y-1;vw=G['restX']+max(bw,bb[2])-vx+1;vh=h+2
  else:
   a,aw,ab=shaped('th',700,42);x=y=0;w=h=64;rx=12
   tx=32-aw/2+.8;baseline=32-(ab[1]+ab[3])/2-2
   letters=f'<g transform="translate({tx:.6f} {baseline:.6f})">{a}</g>';rest='';vx=vy=0;vw=vh=64
  rect=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}"'
  if knockout:
   body=f'<defs><mask id="cut" maskUnits="userSpaceOnUse" x="{vx}" y="{vy}" width="{vw}" height="{vh}"><rect x="{vx}" y="{vy}" width="{vw}" height="{vh}" fill="white"/><g fill="black">{letters}</g></mask></defs>{rect} fill="{fill}" mask="url(#cut)"/>{rest}'
  else:body=f'{rect} fill="{fill}"/><g fill="white">{letters}</g>{rest}'
  svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{vw:.6f}" height="{vh:.6f}" viewBox="{vx:.6f} {vy:.6f} {vw:.6f} {vh:.6f}" role="img" aria-label="thinking home"><title>thinking home - {kind} - {name}</title>{body}</svg>'
  target=ROOT/f'assets/{kind}/svg/{name}.svg';target.parent.mkdir(parents=True,exist_ok=True);target.write_text(svg,encoding='utf-8')
  manifest.append({'kind':kind,'variant':name,'svg':str(target.relative_to(ROOT)).replace('\\','/'),'width':vw,'height':vh})
fav=ROOT/'favicon';fav.mkdir(exist_ok=True)
for color in ['teal','blue']:
 svg=(ROOT/f'assets/icon/svg/{color}-light.svg').read_text()
 light=variants[color+'-light'][0];dark=variants[color+'-dark'][0]
 svg=svg.replace(f'fill="{light}"', 'class="tile"').replace('<title>',f'<style>.tile{{fill:{light}}}@media(prefers-color-scheme:dark){{.tile{{fill:{dark}}}}}</style><title>')
 (fav/f'{color}-adaptive.svg').write_text(svg)
(ROOT/'manifest.json').write_text(json.dumps(manifest,indent=2))
print('Created',len(manifest),'outlined masters and 2 adaptive favicons')
