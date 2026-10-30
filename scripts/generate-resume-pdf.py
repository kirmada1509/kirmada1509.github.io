"""Generate the downloadable simple resume from the same data as its HTML view.

Run with a Python environment containing reportlab. The site itself has no Python
dependency; the generated PDF is committed and its source hash is checked in CI.
"""
import hashlib
import json
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import reportlab

root = Path(__file__).resolve().parent.parent
source = root / "scripts/resume-data.json"
data = json.loads(source.read_text())
target = root / "output/pdf/mohan-krishna-simple-resume.pdf"
target.parent.mkdir(parents=True, exist_ok=True)
digest = hashlib.sha256(source.read_bytes()).hexdigest()
# Embed fonts so PDF viewers do not need an installed font or substitute one.
font_pairs = [
    (Path('/System/Library/Fonts/Supplemental/Arial.ttf'), Path('/System/Library/Fonts/Supplemental/Arial Bold.ttf')),
    (Path('/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf'), Path('/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf')),
    (Path(reportlab.__file__).parent / 'fonts/Vera.ttf', Path(reportlab.__file__).parent / 'fonts/VeraBd.ttf'),
]
regular, bold = next(pair for pair in font_pairs if all(path.exists() for path in pair))
pdfmetrics.registerFont(TTFont('ResumeSans', str(regular)))
pdfmetrics.registerFont(TTFont('ResumeSans-Bold', str(bold)))
pdfmetrics.registerFontFamily('ResumeSans', normal='ResumeSans', bold='ResumeSans-Bold', italic='ResumeSans', boldItalic='ResumeSans-Bold')
styles = {
    "name": ParagraphStyle("Name", fontName="Helvetica-Bold", fontSize=23, leading=26, spaceAfter=3),
    "role": ParagraphStyle("Role", fontName="Helvetica", fontSize=11.5, leading=15, spaceAfter=3),
    "contact": ParagraphStyle("Contact", fontName="Helvetica", fontSize=8.5, leading=11.3),
    "section": ParagraphStyle("Section", fontName="Helvetica-Bold", fontSize=10.5, leading=14, spaceBefore=6, spaceAfter=4, keepWithNext=True, borderWidth=0, borderPadding=0),
    "heading": ParagraphStyle("Heading", fontName="Helvetica-Bold", fontSize=10, leading=12.6, keepWithNext=True),
    "detail": ParagraphStyle("Detail", fontName="Helvetica", fontSize=8.8, leading=11.2, textColor=colors.HexColor("#3b3b3b"), keepWithNext=True),
    "body": ParagraphStyle("Body", fontName="Helvetica", fontSize=9.8, leading=12.4, alignment=TA_LEFT),
    "bullet": ParagraphStyle("Bullet", fontName="Helvetica", fontSize=9.8, leading=12.4, leftIndent=10, firstLineIndent=0, bulletIndent=0, spaceBefore=1),
}
for style in styles.values():
    style.fontName = style.fontName.replace('Helvetica', 'ResumeSans')

def para(text, kind="body"):
    return Paragraph(text, styles[kind])

def link(url, text):
    return f'<link href="{escape(url, {chr(34): "&quot;"})}">{escape(text)}</link>'

def bullet(text):
    return Paragraph(escape(text), styles["bullet"], bulletText="-")

story = [para(escape(data["name"]), "name"), para(escape(data["role"]), "role")]
education = data["education"]
story += [para(f'<b>BITS Pilani</b> | {escape(education["course"])} | {escape(education["date"])}', "contact"),
          para(escape(data["availability"]), "contact"), Spacer(1, 3)]
story += [para(" | ".join([link("mailto:" + data["email"], data["email"]), link(data["phoneUrl"], data["phone"]), link(data["github"], "github.com/kirmada1509")]), "contact"),
          para(" | ".join([link(data["linkedin"], "linkedin.com/in/mohan-krishna-karthik"), link(data["portfolio"], "kirmada1509.github.io")]), "contact")]
story += [para("Education", "section"), para(escape(education["university"]), "heading"),
          para(escape(education["course"] + " | " + education["date"]), "detail"),
          para("Relevant coursework: " + escape(education["coursework"]), "detail")]
story.append(para("Experience", "section"))
for index, job in enumerate(data["experience"]):
    if index: story.append(Spacer(1, 3))
    block = [para(escape(job["title"] + " | " + job["date"]), "heading"), para(escape(job["organization"]), "detail")]
    block.extend(bullet(item) for item in job["bullets"])
    story.append(KeepTogether(block))
story.append(para("Selected projects", "section"))
for index, project in enumerate(data["projects"]):
    if index: story.append(Spacer(1, 3))
    title = link(data["portfolio"].rstrip("/") + project["path"], project["name"])
    block = [para(title + " | " + escape(project["date"]), "heading"), para(escape(project["stack"]), "detail")]
    block.extend(bullet(item) for item in project["bullets"])
    story.append(KeepTogether(block))
story.append(para("Technical skills", "section"))
for label, value in data["skills"]:
    story.append(para("<b>" + escape(label) + ":</b> " + escape(value)))
story.append(para("Achievements", "section"))
story.extend(bullet(item) for item in data["achievements"])

def page_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("ResumeSans", 7)
    canvas.setFillColor(colors.HexColor("#555555"))
    canvas.drawString(36, 18, "Mohan Krishna | Resume")
    canvas.drawRightString(A4[0] - 36, 18, str(doc.page))
    canvas.restoreState()

document = SimpleDocTemplate(str(target), pagesize=A4, rightMargin=36, leftMargin=36, topMargin=30,
    bottomMargin=30, title="Mohan Krishna - Software & AI Engineer - Resume", author=data["name"],
    subject="Resume source SHA-256: " + digest)
document.build(story, onFirstPage=page_footer, onLaterPages=page_footer)
(root / "dist/assets/mohan-krishna-simple-resume.pdf").write_bytes(target.read_bytes())
print(f"Generated {target}")
