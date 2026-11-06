import React, { useEffect, useRef, useState, useSyncExternalStore, createContext, useContext } from 'react';
import { Theme, Button, IconButton, Badge, Card, Flex, Grid, Box, Heading, Text, Tabs, Avatar, Tooltip, DropdownMenu, Separator, Dialog } from '@radix-ui/themes';
import * as Accordion from '@radix-ui/react-accordion';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { motion, MotionConfig, useScroll, useTransform, useMotionValueEvent, useInView } from 'motion/react';
import { ArrowUpRight, ArrowDown, ArrowRight, Mail, FileDown, Menu, Plus, ChevronDown, Code2, Mic, Layers, Check, Circle, Copy, Pause, Play, Terminal, Braces, Database, Globe2, ShieldCheck, RotateCcw, Send, X, Phone, MessageCircle, MapPin, Search, AudioLines, ScanLine, Receipt, Users, Briefcase, GraduationCap, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { Marquee } from './components/magicui/marquee';
import { NumberTicker } from './components/magicui/number-ticker';
import { BlurFade } from './components/magicui/blur-fade';
import { TextAnimate } from './components/magicui/text-animate';
import { TypingAnimation } from './components/magicui/typing-animation';
import { LocalStatus } from './components/local-status';
import useEmblaCarousel from 'embla-carousel-react';
import technologies from './technologies.json';
import { GitHubLogoIcon as Github, LinkedInLogoIcon as Linkedin } from '@radix-ui/react-icons';
import resume from '../scripts/resume-data.json';

const projects = [
 { id:'interviehire', name:'IntervieHire', category:'Real-time voice infrastructure', title:'A conversation,\nwithout the friction.', description:'Self-hosted voice infrastructure for AI interviews. Built around real-time audio, consistent session state, and a pipeline the team can actually control.', stack:['LiveKit Agents','Fastify','WebSockets','PostgreSQL'], icon:Mic },
 { id:'reentry', name:'ReEntry', category:'Browser agents · Technical preview', title:'Pick up exactly\nwhere you left off.', description:'An evidence-linked browser agent that preserves unfinished work. Checkpoint history, draft recovery, and a clear next step when you return.', stack:['TypeScript','Browser extension','Ollama','NVIDIA'], icon:RotateCcw },
 { id:'precedent', name:'Precedent', category:'Agent action checks · Prototype', title:'A little context.\nA better decision.', description:'Retrieval over approved and blocked tool calls. Argument evidence, provenance, and human review help check what an agent is about to do.', stack:['Python','Moss','Hybrid retrieval','Evaluation'], icon:ShieldCheck },
 { id:'onetap', name:'OneTap Vendor', category:'Offline-first desktop engineering', title:'The backbone of\ncampus commerce.', description:'Our campus credit system, built from scratch, supports more than US$1.2 million in annual purchases. OneTap Vendor and the SU app form a backbone of everyday life at BITS Pilani: vendors scan a student’s QR, purchases reach their mess account, and balances are billed at semester end.', stack:['Go','Fyne','SQLite','sqlc'], icon:Database },
 { id:'bosm', name:'BOSM ’25', category:'Mobile engineering · Production', title:'Campus life.\nIn your pocket.', description:'Live schedules, leaderboards, participant verification, and food ordering. A cross-platform sports festival app shipped to iOS and Android. Explore the actual BOSM and BPL app screens below.', stack:['React Native','Expo','TypeScript','EAS'], icon:Layers },
];
const nav = [['Work','#work'],['Experience','#experience'],['About','#about']];
const tech = ['TypeScript','Python','Go','React','Next.js','PostgreSQL','LiveKit','React Native','Docker','Redis'];
function LinkButton({href,children,secondary=false,...props}) { return <Button asChild size="3" variant={secondary?'soft':'solid'} radius="full" className={`pill ${secondary?'pill-secondary':''}`} {...props}><a href={href}>{children}</a></Button>; }
function Eyebrow({children}) {return <Text as="p" className="eyebrow">{children}</Text>;}
function Reveal({children,className='',delay=0}) {return <BlurFade inView delay={delay} duration={.7} offset={18} blur="4px" className={`reveal ${className}`}>{children}</BlurFade>;}

const MotionPaused = createContext(false);
// Compose Magic UI's typewriter with Radix headings. The original text reserves
// layout and remains readable in server HTML, with JavaScript off, or motion off.
function TypeHeading({children,className='',...props}) {
 const paused=useContext(MotionPaused), ref=useRef(null);
 const inView=useInView(ref,{once:true,amount:.3});
 const [mounted,setMounted]=useState(false);
 useEffect(()=>setMounted(true),[]);
 const active=mounted&&inView&&!paused;
 let delay=100;
 const plain=node=>React.Children.toArray(node).map(c=>typeof c==='string'||typeof c==='number'?c:React.isValidElement(c)?c.type==='br'?' ':plain(c.props.children):'').join('');
 const typed=node=>React.Children.map(node,(c,i)=>{
  if(typeof c==='string'||typeof c==='number') { const value=String(c),start=delay;delay+=Array.from(value).length*25;return <TypingAnimation key={i} duration={25} delay={start} showCursor={false} startOnView={false}>{value}</TypingAnimation>; }
  return React.isValidElement(c)&&c.props.children?React.cloneElement(c,{},typed(c.props.children)):c;
 });
 return <Heading ref={ref} className={`typing-heading ${active?'is-typing-enabled':''} ${className}`} aria-label={plain(children).replace(/([.!?])(?=[A-Z])/g,'$1 ')} {...props}><span className="typing-layout" aria-hidden="true">{children}</span>{active&&<span className="typing-overlay" aria-hidden="true">{typed(children)}</span>}</Heading>;
}

const defaultDarkTheme = () => true;
const noThemeSubscription = () => () => {};

function ThemeToggle() {
 const paused = useContext(MotionPaused);
 const store = typeof window === 'undefined' ? undefined : window.portfolioTheme;
 const dark = useSyncExternalStore(store?.subscribe ?? noThemeSubscription, store?.isDark ?? defaultDarkTheme, defaultDarkTheme);
 return <Tooltip content={dark ? 'Switch to light mode' : 'Switch to dark mode'}><IconButton className="theme-toggle" variant="ghost" radius="full" aria-label="Dark mode" aria-pressed={dark} onClick={() => store?.toggle({ animate: !paused })}><Moon className="theme-moon" size={16} aria-hidden="true"/><Sun className="theme-sun" size={16} aria-hidden="true"/></IconButton></Tooltip>;
}

function Header({paused,onToggle,casePage=false}) {
 const home=casePage?'/':'';
 const {scrollY}=useScroll(); const [compact,setCompact]=useState(false);
 useMotionValueEvent(scrollY,'change',y=>setCompact(y>90));
 return <header className={`header ${compact?'is-scrolled':''}`}>
  <NavigationMenu.Root className="nav-shell" aria-label="Main navigation">
   <a className="wordmark" href={`${home}#main`} aria-label="Mohan Krishna, home">{compact?'Krishna':<>mohan<span>krishna</span></>}<i>.</i></a>
   <NavigationMenu.List className="nav-links">
    <NavigationMenu.Item><NavigationMenu.Trigger className="nav-trigger">Work <ChevronDown size={12}/></NavigationMenu.Trigger><NavigationMenu.Content className="nav-projects"><Text as="p" className="menu-label">Selected engineering work</Text>{projects.map(p=><NavigationMenu.Link key={p.id} href={`${home}#${p.id}`} className="nav-project-link"><p.icon size={17}/><span>{p.name}<small>{p.category}</small></span><ArrowUpRight size={14}/></NavigationMenu.Link>)}</NavigationMenu.Content></NavigationMenu.Item>
    {nav.slice(1).map(([label,href])=><NavigationMenu.Item key={href}><NavigationMenu.Link href={`${home}${href}`}>{label}</NavigationMenu.Link></NavigationMenu.Item>)}
    <NavigationMenu.Item><NavigationMenu.Link href={`${home}#contact`}>Contact</NavigationMenu.Link></NavigationMenu.Item>
   </NavigationMenu.List>
   <Flex gap="2" align="center" className="nav-utilities"><ThemeToggle/><Tooltip content={paused?'Enable animations':'Pause animations'}><IconButton className={`motion-control ${paused?'is-paused':''}`} variant="ghost" radius="full" aria-label={paused?'Enable animations':'Pause animations'} onClick={onToggle}>{paused?<><Play size={14}/><span className="motion-hint">Motion off</span></>:<Pause size={14}/>}</IconButton></Tooltip><DropdownMenu.Root><DropdownMenu.Trigger><IconButton className="mobile-menu" variant="soft" radius="full" aria-label="Open navigation"><Menu size={20}/></IconButton></DropdownMenu.Trigger><DropdownMenu.Content>{[...nav,['Contact','#contact'],['Resume','/resume.html']].map(([label,href])=><DropdownMenu.Item asChild key={href}><a href={href.startsWith('#')?home+href:href}>{label}<ArrowUpRight size={14}/></a></DropdownMenu.Item>)}</DropdownMenu.Content></DropdownMenu.Root></Flex>
  </NavigationMenu.Root>
  <LinkButton href="/resume.html" aria-label="Resume" secondary><FileDown size={15}/> Resume</LinkButton>
 </header>;
}

function HeroDemo() {
 const [tab,setTab]=useState('voice');
 const previews={
  voice:{name:'IntervieHire',label:'REAL-TIME VOICE',metric:'58%+ lower infrastructure cost',description:'AI interviews with a voice pipeline we control. LiveKit Agents, Deepgram, and Cartesia, working as one system.',href:'/work/interviehire.html',tags:['LiveKit Agents','Real-time audio'],Icon:Mic},
  agents:{name:'Precedent',label:'EVIDENCE BEFORE ACTION',metric:'Past decisions. Better next steps.',description:'An agent’s next tool call, checked against approved and blocked actions. Evidence and human review stay close to the decision.',href:'/work/precedent.html',tags:['Hybrid retrieval','Action checks'],Icon:ShieldCheck},
  software:{name:'OneTap Vendor',label:'CAMPUS INFRASTRUCTURE',metric:'US$1.2M+ in annual campus purchases',description:'The SU app and OneTap Vendor connect 5,000+ students to a credit system we built from scratch, with semester-end mess billing.',href:'/work/onetap.html',tags:['Offline-first','Campus credit'],Icon:ScanLine}
 };
 const p=previews[tab];
 return <motion.div className="hero-demo" initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:.9,delay:.25}}>
  <Flex className="demo-handle" align="center" gap="2"><Braces size={20}/><span>Krishna’s workspace</span><span className="status-dot"/><span className="handle-status">Building</span></Flex>
  <Card className="glass demo-card" size="3"><Flex justify="between" align="center" className="demo-top"><Flex gap="2" className="traffic"><i/><i/><i/></Flex><Text className="micro">A FEW THINGS I WORK ON</Text><Code2 size={15}/></Flex>
   <Tabs.Root value={tab} onValueChange={setTab}>
    <Tabs.List className="demo-tabs" aria-label="Explore my work"><Tabs.Trigger value="voice"><Mic size={13}/> Voice systems</Tabs.Trigger><Tabs.Trigger value="agents"><Braces size={13}/> AI agents</Tabs.Trigger><Tabs.Trigger value="software"><Layers size={13}/> Software</Tabs.Trigger></Tabs.List>
    <Tabs.Content value={tab} className="work-preview-panel"><motion.div key={tab} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:.25}}><Flex align="center" gap="3" className="preview-project-title"><span className="preview-project-icon"><p.Icon size={23}/></span><div><Text as="p" className="preview-kicker">{p.label}</Text><TypeHeading as="h3">{p.name}</TypeHeading></div></Flex><Text as="p" className="preview-metric">{p.metric}</Text><Text as="p" className="preview-description">{p.description}</Text><Flex gap="2" wrap="wrap" className="preview-tags">{p.tags.map(t=><Badge key={t} radius="full" variant="soft">{t}</Badge>)}</Flex><Flex align="center" justify="between" gap="3" className="preview-actions"><Text as="p">The decisions behind the build.</Text><Button asChild variant="soft" radius="full" size="2"><a href={p.href}>Read case study <ArrowUpRight size={14}/></a></Button></Flex></motion.div></Tabs.Content>
   </Tabs.Root>
  </Card>
 </motion.div>;
}

const skyStars = [
 [5, 29, 0.8], [9, 56, 1.1], [12, 19, 0.6], [16, 37, 1.25],
 [20, 9, 0.7], [23, 47, 0.75], [28, 22, 1], [30, 61, 0.7],
 [35, 13, 0.75], [38, 40, 1.45], [42, 26, 0.65], [46, 59, 0.8],
 [49, 17, 1.15], [52, 32, 0.6], [56, 10, 0.8], [58, 48, 1],
 [63, 24, 0.7], [66, 37, 1.25], [70, 13, 0.8], [74, 25, 1.1],
 [78, 12, 0.65], [80, 45, 0.9], [89, 14, 0.7], [93, 32, 1.35],
 [96, 19, 0.65], [97, 52, 0.8]
];

function Hero({paused}) {
 const target=useRef(null);
 const {scrollYProgress}=useScroll({target,offset:['start start','end start']});
 const ridgeY=useTransform(scrollYProgress,[0,1],[0,150]);
 const ridgeScale=useTransform(scrollYProgress,[0,1],[1.02,1.13]);
 const farCloudY=useTransform(scrollYProgress,[0,1],[0,190]);
 const nearCloudY=useTransform(scrollYProgress,[0,1],[0,-95]);
 const contentY=useTransform(scrollYProgress,[0,1],[0,-80]);
 const opacity=useTransform(scrollYProgress,[0,.85],[1,0]);
 return <section ref={target} className="hero" aria-labelledby="hero-title">
  <motion.div className="mountain-scene" aria-hidden="true" style={paused?{}:{y:ridgeY,scale:ridgeScale}}/>
  <div className="hero-celestial" aria-hidden="true">
   <svg className="hero-stars">
    {skyStars.map(([x,y,radius])=><circle key={x} cx={`${x}%`} cy={`${y}%`} r={radius}/>)}
   </svg>
  </div>
  <motion.div className="clouds clouds-distant" aria-hidden="true" style={paused?{}:{y:farCloudY}}><div className="cloud-bank"/></motion.div>
  <motion.div className="clouds clouds-near" aria-hidden="true" style={paused?{}:{y:nearCloudY}}><div className="cloud-bank"/></motion.div>
  <motion.div className="hero-content" style={paused?{}:{y:contentY,opacity}}>
   <div className="hero-copy"><BlurFade duration={.8}>
    <Badge radius="full" className="available"><span className="status-dot"/> Open to roles & internships</Badge>
    <Text as="p" className="hero-role">SOFTWARE & AI ENGINEER · BITS PILANI</Text>
    <TypeHeading as="h1" id="hero-title" className="hero-name-heading">Mohan<br/>Krishna.</TypeHeading>
    <Text as="p" className="hero-description">I build intelligent systems and thoughtful software.<br/><span>Voice systems, AI agents, and campus products.</span></Text>
    <Flex gap="3" wrap="wrap" className="hero-actions"><LinkButton href="#work"><ArrowDown size={17}/> Explore my work</LinkButton><LinkButton href={resume.github} secondary><Github size={17}/> View on GitHub</LinkButton></Flex>
   </BlurFade></div>
   <HeroDemo/>
  </motion.div>
  <Grid columns="3" className="hero-proof">
   {[['$1.2M+','annual campus purchases supported','onetap',Receipt],['5,000+','students connected through SU app credit billing','onetap',Users],['58%+','lower voice infrastructure cost','interviehire',Mic]].map(([value,label,id,Icon])=><Card asChild key={value} className="hero-proof-card glass"><a href={`#${id}`}><Icon size={18}/><span><strong>{value}</strong><small>{label}</small></span><ArrowUpRight size={13}/></a></Card>)}
  </Grid>
  <div className="hero-fade"/><a href="#about" className="scroll-cue"><span>SCROLL TO EXPLORE</span><ArrowDown size={13}/></a>
 </section>;
}

function About() {
 return <section id="about" className="about-section section-wrap"><Reveal><Eyebrow>A little about me</Eyebrow><TypeHeading as="h2" className="statement">Curious by nature.<br/>An engineer <em>by doing.</em></TypeHeading></Reveal><Reveal className="about-bottom"><Box className="about-identity"><Flex align="center" gap="4" className="about-person"><img className="halftone-portrait" src="/assets/mohan-krishna-halftone-v1.png" alt="Purple dot portrait of Mohan Krishna, based on his photograph" width="220" height="220" loading="lazy"/><div><Text as="p" weight="medium">Mohan Krishna</Text><Text as="p" className="muted">Mathematics & Computing · BITS Pilani</Text></div></Flex><LocalStatus/></Box><Box className="about-story"><Text as="p" className="about-bio">I’m a software and AI engineer who likes getting the details right. I work on voice systems, browser agents, and products that hold up in the real world.</Text><Flex gap="3" align="start" className="about-detail"><Users size={17}/><Text as="p">I lead 20 student engineers in the Students’ Union Technical Team at BITS Pilani, building the campus products we use ourselves.</Text></Flex><Flex gap="3" align="start" className="about-detail"><GraduationCap size={18}/><Text as="p">Studying Mathematics & Computing, with graduation expected in May 2028.</Text></Flex></Box></Reveal><div className="stack-strip"><Text as="p" className="micro muted">SOME OF THE TOOLS I BUILD WITH</Text><Marquee pauseOnHover repeat={3} className="tech-marquee" aria-label="Technologies I use">{tech.map(t=><span className="tech-word" key={t}><TechBadge name={t}/></span>)}</Marquee></div></section>;
}
function CampusScale({paused}) {
 return <Reveal className="campus-scale"><Card className="campus-scale-card glass" size="4"><Flex justify="between" align="center" gap="3" wrap="wrap" className="campus-scale-top"><Eyebrow>OneTap Vendor × SU app</Eyebrow><Badge radius="full"><span className="status-dot"/> Campus infrastructure</Badge></Flex><Grid columns={{initial:'1',sm:'2'}} gap="7" align="center"><Box className="campus-scale-figure"><Text as="p" className="campus-scale-currency">US DOLLARS</Text><div className="campus-scale-amount" aria-label="More than 1.2 million US dollars in annual campus purchase volume">$<span>{paused?'1.2':<NumberTicker value={1.2} decimalPlaces={1}/>}</span>M<span className="campus-scale-plus">+</span></div><Text as="p">in annual campus purchase volume</Text></Box><Box className="campus-scale-story"><TypeHeading as="h2">A backbone of<br/><em>everyday campus life.</em></TypeHeading><Text as="p">A credit system we built from scratch, connecting the SU app, campus vendors, and student mess accounts. Used across BITS Pilani by 5,000+ students, with purchases billed at semester end.</Text><a className="text-link" href="/work/onetap.html">Explore the system behind the scale <ArrowUpRight size={15}/></a></Box></Grid><Flex gap="3" wrap="wrap" className="campus-scale-tags"><Badge radius="full"><Users size={12}/> 5,000+ students</Badge><Badge radius="full"><ScanLine size={12}/> SU app QR → vendor</Badge><Badge radius="full"><Receipt size={12}/> Semester-end mess billing</Badge></Flex></Card></Reveal>;
}
function Stats({paused}) {
 const metrics=[[58,'%+','Lower voice infrastructure cost after the LiveKit migration','IntervieHire'],[5000,'+','Students supported by our campus credit billing system','OneTap Vendor'],[6000,'+','Participants connected through the festival app','BOSM ’25'],[20,'','Engineers on the student team I lead','Students’ Union Technical Team · BITS Pilani']];
 return <section className="stats-section section-wrap" aria-label="Engineering impact"><CampusScale paused={paused}/><Reveal className="stats-intro"><TypeHeading as="h2">Built with care.<br/>Used <em>for real.</em></TypeHeading><Text as="p">Campus products, real-time AI, and the student team behind the work. Each number belongs to a specific project or responsibility.</Text><a className="text-link" href="/resume-v2.html">Explore my experience in Resume v2 <ArrowUpRight size={14}/></a></Reveal><Grid columns="2" className="metrics">{metrics.map(([n,s,label,context],i)=><Reveal key={label} className={`metric metric-${i}`}><div className="metric-value">{paused?n.toLocaleString('en-US'):<NumberTicker value={n}/>}<span>{s}</span></div><Text as="p">{label}</Text><Text as="p" className="metric-context">{context}</Text></Reveal>)}</Grid></section>;
}

const campusScreens = {
 bosm:[
  {file:'bosm-home.jpeg',title:'Home & sign-in',alt:'Actual BOSM 2025 app home and sign-in screens with the BITS Pilani clock tower'},
  {file:'bosm-matches.jpeg',title:'Matches & food',alt:'Actual BOSM app showing sports matches and food ordering'},
  {file:'bosm-events.jpeg',title:'Events & merchandise',alt:'Actual BOSM app event tickets and merchandise screens'}
 ],
 bpl:[
  {file:'bpl-home.jpeg',title:'Home & sign-in',alt:'Actual BPL app sign-in screen and campus home screen'},
  {file:'bpl-food.jpeg',title:'Food ordering',alt:'Actual campus app stalls and food ordering screen'},
  {file:'bpl-matches.jpeg',title:'Match day',alt:'Actual campus sports app showing ongoing and upcoming matches'},
  {file:'bpl-events.jpeg',title:'Events & store',alt:'Actual campus app event ticket and merchandise screens'}
 ]
};
function ScreenshotPreview({src,alt,title,description,className='',children,showCaption=true}) {
 return <Dialog.Root><Dialog.Trigger><motion.button type="button" className={`screenshot-button ${className}`} aria-label={`Enlarge ${title}`} whileHover={{y:-3}} transition={{duration:.25}}>{children||<img src={src} alt={alt} loading="lazy"/>}{showCaption&&<span className="screenshot-caption">{title}<Plus size={12}/></span>}</motion.button></Dialog.Trigger><Dialog.Content maxWidth="1100px" className="image-dialog"><Flex justify="between" align="center"><Dialog.Title as="h2">{title}</Dialog.Title><Dialog.Close><IconButton variant="ghost" aria-label="Close screenshot"><X size={19}/></IconButton></Dialog.Close></Flex><Dialog.Description size="2">{description}</Dialog.Description><img src={src} alt={alt}/></Dialog.Content></Dialog.Root>;
}
function AppPanorama({app,screens}) {
 const [viewport,api]=useEmblaCarousel({align:'start',containScroll:'trimSnaps'});
 const [navigation,setNavigation]=useState({prev:false,next:false,index:0});
 useEffect(()=>{if(!api)return;const update=()=>setNavigation({prev:api.canScrollPrev(),next:api.canScrollNext(),index:api.selectedScrollSnap()});update();api.on('select',update);api.on('reInit',update);return()=>{api.off('select',update);api.off('reInit',update);};},[api]);
 return <div className={`app-panorama panorama-${app}`}><div className="app-carousel-viewport" ref={viewport} role="region" aria-roledescription="carousel" aria-label={`${app==='bosm'?'BOSM ’25':'BPL'} continuous app showcase`}><div className="app-carousel-track">{screens.map((screen,i)=><div className="app-carousel-slide" key={screen.file} role="group" aria-roledescription="slide" aria-label={`Panel ${i+1} of ${screens.length}`}><ScreenshotPreview src={`/assets/campus-apps/${screen.file}`} alt={screen.alt} title={`${app==='bosm'?'BOSM ’25':'BPL'} · ${screen.title}`} description="An original panel from the supplied panoramic app showcase." className="panorama-panel"/></div>)}</div></div><Flex align="center" justify="between" className="panorama-controls"><Text as="p">One continuous showcase · {screens.length} original panels</Text>{(navigation.prev||navigation.next)&&<Flex gap="2" align="center"><IconButton variant="soft" radius="full" size="1" aria-label="Previous app panel" disabled={!navigation.prev} onClick={()=>api?.scrollPrev()}><ChevronLeft size={15}/></IconButton><span>{navigation.index+1} / {screens.length}</span><IconButton variant="soft" radius="full" size="1" aria-label="Next app panel" disabled={!navigation.next} onClick={()=>api?.scrollNext()}><ChevronRight size={15}/></IconButton></Flex>}</Flex></div>;
}
function CampusGallery() {
 return <div className="campus-gallery">
  <Flex justify="between" align="center" className="campus-gallery-heading">
   <div>
    <Text as="p" className="bosm-brand">Built for <em>campus life.</em></Text>
    <Text as="p" className="bosm-subtitle">BOSM &amp; BPL APP SHOWCASES</Text>
   </div>
   <Layers size={19}/>
  </Flex>
  <Tabs.Root defaultValue="bosm">
   <Tabs.List aria-label="Campus apps" className="campus-app-tabs">
    <Tabs.Trigger value="bosm">BOSM ’25</Tabs.Trigger>
    <Tabs.Trigger value="bpl">BPL</Tabs.Trigger>
   </Tabs.List>
   <Tabs.Content value="bosm">
    <Tabs.Root defaultValue="showcase" className="banner-treatment">
     <Tabs.List aria-label="BOSM ’25 gallery">
      <Tabs.Trigger value="showcase">Showcase</Tabs.Trigger>
      <Tabs.Trigger value="original">App screenshots</Tabs.Trigger>
     </Tabs.List>
     <Tabs.Content value="showcase">
      <ScreenshotPreview
       src="/assets/campus-apps/bosm-app-showcase.png"
       alt="BOSM ’25 app showcase with the clocktower, sign-in, stalls, matches, events, and merchandise screens"
       title="BOSM ’25 · App showcase"
       description="Portfolio artwork based on the original BOSM ’25 app screens."
       className="bosm-themed-banner"
       showCaption={false}
      />
     </Tabs.Content>
     <Tabs.Content value="original">
      <AppPanorama app="bosm" screens={campusScreens.bosm}/>
      <Text as="p" className="campus-gallery-note">Three original panels, joined in sequence. Swipe on mobile or tap to inspect.</Text>
     </Tabs.Content>
    </Tabs.Root>
   </Tabs.Content>
   <Tabs.Content value="bpl">
    <AppPanorama app="bpl" screens={campusScreens.bpl}/>
    <Text as="p" className="campus-gallery-note">Original BPL artwork, joined in sequence. Swipe on mobile or tap to inspect.</Text>
   </Tabs.Content>
  </Tabs.Root>
 </div>;
}
function ProjectVisual({project:p}) {
 if(['interviehire','reentry','precedent'].includes(p.id))return <div className="concept-showcase"><ScreenshotPreview src={`/assets/project-concepts/${p.id}-v2.png`} alt={`Generated ${p.name} interface concept illustrating ${p.category.toLowerCase()}`} title={`${p.name} · Interface concept`} description="AI-generated interface concept illustrating the documented project. This is a visual interpretation, not a screenshot of the released product." className="project-concept-image"/><Badge radius="full" className="concept-label">Generated interface concept</Badge></div>;
 if(p.id==='onetap')return <Card className="product-window credit-window" size="3"><Flex justify="between" align="center"><Flex gap="2" align="center"><span className="product-logo"><ScanLine size={17}/></span><Text weight="medium">OneTap Vendor</Text></Flex><Badge radius="full">Built from scratch</Badge></Flex><Text as="p" className="window-kicker">OUR CAMPUS CREDIT SYSTEM</Text><Heading as="h4" className="window-heading">Scan now. Settle at semester end.</Heading><div className="credit-flow">{[[ScanLine,'SU app QR','A student presents their QR'],[Database,'Mess account','The purchase is added to their account'],[Receipt,'Semester bill','Charges are billed at semester end']].map(([Icon,title,detail],i)=><React.Fragment key={title}>{i>0&&<ArrowDown size={15} className="credit-connector"/>}<Flex align="center" gap="3" className="credit-step"><span><Icon size={20}/></span><div><Text as="p" weight="medium">{title}</Text><Text as="p">{detail}</Text></div><Check size={15}/></Flex></React.Fragment>)}</div><Flex className="window-footer" justify="between"><span>GO · FYNE · SQLITE · SQLC</span><span>OFFLINE STORAGE + RELIABLE SYNC</span></Flex></Card>;
 return <CampusGallery/>;
}

const projectOutcomes={
 interviehire:['Lower-cost voice infrastructure, with control over the session.','Migrating from Vapi to self-hosted LiveKit Agents reduced voice infrastructure cost by 58%+, while keeping interview timing and turn progression under server control.'],
 reentry:['A saved task comes with evidence and a way back.','Users can recover drafts, inspect the evidence behind a suggested next step, and restore any of the ten most recent checkpoint revisions. ReEntry remains a technical preview.'],
 precedent:['Review the evidence before making the call.','Each proposed tool call is compared with prior approved and blocked actions. Unfamiliar cases can be escalated to a person, and their decision becomes evidence for the next check.'],
 onetap:['US$1.2M+ in annual campus purchases. One connected credit system.','Together, the SU app and OneTap Vendor support 5,000+ students across BITS Pilani. The QR in the SU app connects vendors to a student’s mess account, making everyday campus purchases possible on credit and settling those charges at semester end.'],
 bosm:['Festival information and campus services, in one app.','BOSM ’25 brought schedules, scores, participant verification, and food ordering to 6,000+ participants across iOS and Android. The showcase also includes supplied BPL app screens.']
};
function Work() {
 const [active,setActive]=useState('interviehire');
 useEffect(()=>{const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)setActive(e.target.id);},{rootMargin:'-30% 0px -40% 0px'});projects.forEach(p=>{const e=document.getElementById(p.id);if(e)observer.observe(e);});return()=>observer.disconnect();},[]);
 return <section id="work" className="work-section section-wrap"><Reveal className="section-heading"><Eyebrow>Selected work · 2025—2026</Eyebrow><TypeHeading as="h2">Different challenges.<br/><em>The same care.</em></TypeHeading></Reveal><div className="work-layout"><nav className="project-rail" aria-label="Selected projects">{projects.map((p,i)=><a key={p.id} href={`#${p.id}`} className={active===p.id?'active':''} aria-current={active===p.id?'location':undefined}><span>0{i+1}</span>{p.name}{active===p.id&&<motion.i layoutId="project-marker" transition={{type:'spring',stiffness:260,damping:30}}/>}</a>)}</nav><div className="project-list">{projects.map((p,i)=><article key={p.id} id={p.id} className="project"><Reveal><Flex justify="between" align="center" className="project-eyebrow"><Eyebrow>{p.category}</Eyebrow><span>0{i+1}</span></Flex><TypeHeading as="h3">{p.title.split('\n').map((line,i)=><React.Fragment key={line}>{i>0&&<br/>}{line}</React.Fragment>)}</TypeHeading><Text as="p" className="project-description">{p.description}</Text><div className={`project-stage stage-${p.id}`}><ProjectVisual project={p}/><span className="stage-caption">0{i+1}. {p.name} · {p.id==='bosm'?'BOSM and BPL app showcases':['interviehire','reentry','precedent'].includes(p.id)?'Generated interface concept':'Interface illustration'}</span></div><Flex className="project-meta" justify="between" align="center" gap="3" wrap="wrap"><Flex wrap="wrap" gap="2">{p.stack.map(name=><TechBadge name={name} key={name}/>)}</Flex><a className="text-link" href={`/work/${p.id}.html`}>Read case study <ArrowUpRight size={15}/></a></Flex><Card className="project-outcome"><Text as="p" className="outcome-label">WHAT THIS WORK DOES</Text><Heading as="h4">{projectOutcomes[p.id][0]}</Heading><Text as="p">{projectOutcomes[p.id][1]}</Text></Card></Reveal></article>)}</div></div></section>;
}

function Experience() {
 return <section id="experience" className="experience-section section-wrap"><Reveal className="section-heading"><Eyebrow>Along the way</Eyebrow><TypeHeading as="h2">Learning by building.<br/><em>Growing with teams.</em></TypeHeading></Reveal><Grid columns={{initial:'1',md:'2'}} gap="5">{resume.experience.map((e,i)=><Reveal key={e.organization} delay={i*.1}><Card className="experience-card glass" size="4"><Flex justify="between" className="experience-top"><span className="experience-monogram">{i===0?'SUTT':'OBS'}</span></Flex><Text as="p" className="experience-date">{e.date}</Text><TypeHeading as="h3">{e.title}</TypeHeading><Text as="p" className="experience-org">{e.organization}</Text><Separator size="4" my="5"/><ul>{e.bullets.map(b=><li key={b}>{b}</li>)}</ul></Card></Reveal>)}</Grid></section>;
}
const technologySlugs={'TypeScript / JavaScript':'typescript','TypeScript':'typescript','JavaScript':'javascript','Python':'python','Go':'go','C++':'cplusplus','LiveKit':'livekit','LiveKit Agents':'livekit','Deepgram STT':'deepgram','Ollama':'ollama','NVIDIA inference':'nvidia','React':'react','Next.js':'nextdotjs','React Native':'react','NestJS':'nestjs','Fastify':'fastify','FastAPI':'fastapi','PostgreSQL':'postgresql','Redis':'redis','SQLite':'sqlite','Docker':'docker','GitLab CI/CD':'gitlab','Nginx':'nginx','Expo':'expo','EAS':'expo'};
function TechBadge({name}) {
 const logo=technologies[technologySlugs[name]];const Icon=/STT|TTS|VAD/.test(name)?AudioLines:/SQL|retrieval/.test(name)?Database:/evaluation/i.test(name)?ShieldCheck:Braces;
 return <Badge radius="full" variant="soft" className="technology-badge" style={{'--tech-color':logo?.color}}>{logo?<img src={logo.src} alt="" width="17" height="17" loading="lazy"/>:<Icon size={17}/>}<span>{name}</span></Badge>;
}
const skillGroups=[['Languages',Code2,['TypeScript','JavaScript','Python','Go','C++','SQL'],'The language follows the problem.','From TypeScript applications to Go desktop systems and Python agent tooling.'],['AI & real-time',Mic,['LiveKit Agents','Deepgram STT','Cartesia TTS','Silero VAD','Ollama','NVIDIA inference','Hybrid retrieval'],'Intelligence, in the loop.','Voice pipelines, retrieval, evaluation, and the orchestration that turns models into useful software.'],['Applications',Layers,['React','Next.js','React Native','NestJS','Fastify','FastAPI'],'From interface to infrastructure.','Web, mobile, and backend applications with clear boundaries and care for the person using them.'],['Data & infrastructure',Database,['PostgreSQL','Redis','SQLite','Docker','GitLab CI/CD','Nginx'],'Built to keep running.','The data, delivery, and reliability work behind a product people can depend on.']];
function Toolkit() {
 return <section className="toolkit-section section-wrap"><Reveal className="section-heading"><Eyebrow>My toolkit</Eyebrow><TypeHeading as="h2">Many tools.<br/><em>One builder’s mindset.</em></TypeHeading></Reveal><Tabs.Root defaultValue="Languages" className="toolkit-tabs" orientation="vertical"><Tabs.List aria-label="Engineering toolkit">{skillGroups.map(([label,Icon],i)=><Tabs.Trigger value={label} key={label}><span>0{i+1}</span><Icon size={17}/>{label}<ChevronRight size={15}/></Tabs.Trigger>)}</Tabs.List>{skillGroups.map(([label,Icon,skills,title,description])=><Tabs.Content value={label} key={label} forceMount><Card size="4" className="toolkit-card glass"><Flex justify="between" align="center"><Badge radius="full">{label}</Badge><Icon size={22}/></Flex><TypeHeading as="h3">{title}</TypeHeading><Text as="p">{description}</Text><Flex gap="2" wrap="wrap" className="skill-chips">{skills.map(name=><TechBadge key={name} name={name}/>)}</Flex><div className="toolkit-foot"><span className="status-dot"/> Always learning. Always building.</div></Card></Tabs.Content>)}</Tabs.Root></section>;
}
const contactLinks=[['Email',Mail,`mailto:${resume.email}`],['Call',Phone,resume.phoneUrl],['WhatsApp',MessageCircle,'https://wa.me/916302539619'],['LinkedIn',Linkedin,resume.linkedin]];
function ContactOptions({compact=false}) {return <Flex gap="2" wrap="wrap" className={`contact-options ${compact?'compact':''}`}>{contactLinks.map(([label,Icon,href])=><Button key={label} asChild variant="soft" radius="full" size={compact?'2':'3'}><a href={href} {...(href.startsWith('https:')?{target:'_blank',rel:'noopener noreferrer'}:{})}><Icon width={16} height={16}/>{label}<ArrowUpRight size={12}/></a></Button>)}</Flex>;}
const faqs=[
 {q:'What would you like to build next?',icon:Briefcase,a:'I’m looking for software and AI engineering roles or internships, especially where I can work on useful AI applications, real-time systems, or products with real users.'},
 {q:'How do you approach a new problem?',icon:Braces,a:'I start with the user’s workflow and the constraints: timing for voice systems, evidence for agents, connectivity for campus billing. Then I build a small end-to-end path, test the difficult parts, and work toward a dependable release.'},
 {q:'What are you studying?',icon:GraduationCap,a:'I’m pursuing a B.E. in Mathematics & Computing at BITS Pilani, with graduation expected in May 2028. I also lead the Students’ Union Technical Team, a team of 20 student engineers.'},
 {q:'Where can I see the implementation?',icon:Code2,a:'Each project has a case study explaining the implementation and its tradeoffs. Public repositories are on GitHub. Technical previews and prototypes include their current limitations; generated interface concepts are labelled.'},
 {q:'How can I get in touch?',icon:MessageCircle,a:'Email me about an opportunity, call or message me on WhatsApp, or connect on LinkedIn. Choose whichever is easiest for you.'}
];
function FAQ() {
 return <section id="questions" className="faq-section section-wrap"><Reveal className="faq-introduction"><Badge radius="full" className="available"><span className="status-dot"/> Open to a conversation</Badge><TypeHeading as="h2">A few things,<br/><em>before we talk.</em></TypeHeading><Text as="p">What I’m working toward, how I build, and where to reach me.</Text><div className="faq-note"><MessageCircle size={23}/><span>A good question is a good place to start.</span></div></Reveal><Accordion.Root type="single" collapsible defaultValue="faq-0" className="faq-list">{faqs.map(({q,a,icon:Icon},i)=><Accordion.Item key={q} value={`faq-${i}`}><Accordion.Header><Accordion.Trigger><span className="faq-topic-icon"><Icon size={17}/></span><span>{q}</span><Plus size={18}/></Accordion.Trigger></Accordion.Header><Accordion.Content forceMount><div className="faq-answer"><Text as="p">{a}</Text>{i===3&&<a className="text-link" href={resume.github} target="_blank" rel="noopener noreferrer">Explore the code on GitHub <ArrowUpRight size={14}/></a>}{i===4&&<><ContactOptions compact/><Text as="p" className="contact-details"><a href={`mailto:${resume.email}`}>{resume.email}</a><a href={resume.phoneUrl}>{resume.phone}</a></Text></>}</div></Accordion.Content></Accordion.Item>)}</Accordion.Root></section>;
}
function Footer({casePage=false}) {
 const home=casePage?'/':'';
 const [copied,setCopied]=useState(false);
 async function copy(){try{await navigator.clipboard.writeText(resume.email);setCopied(true);setTimeout(()=>setCopied(false),2500);}catch{window.location.href=`mailto:${resume.email}`;}}
 return <footer id="contact" className="contact-section"><div className="section-wrap"><Reveal className="contact-intro"><Badge radius="full" className="available"><span className="status-dot"/> Open to what’s next</Badge><TypeHeading as="h2">Have something in mind?<br/><em>Let’s build it.</em></TypeHeading><Text as="p">A thoughtful idea. An interesting problem. A team that cares.<br/>I’d love to hear about it.</Text><ContactOptions/><a className="text-link footer-resume-v2" href="/resume-v2.html"><FileDown size={15}/> Read Resume v2 <ArrowUpRight size={13}/></a><Button variant="ghost" className="copy-email" onClick={copy}>{copied?<Check size={13}/>:<Copy size={13}/>} {copied?'Email copied':resume.email}</Button><span className="sr-only" role="status">{copied?'Email address copied to clipboard':''}</span></Reveal><Grid className="footer-links" columns={{initial:'2',sm:'4'}} gap="5"><Box><a className="footer-brand" href={`${home}#main`}>krishna.</a><Text as="p">Software & AI Engineer.<br/>Curious about what comes next.</Text></Box><Box><Text as="p" className="footer-label">Explore</Text><a href={`${home}#work`}>Selected work</a><a href={`${home}#experience`}>Experience</a><a href={`${home}#about`}>About me</a></Box><Box><Text as="p" className="footer-label">Connect</Text><a href={resume.github}>GitHub <ArrowUpRight size={12}/></a><a href={resume.linkedin}>LinkedIn <ArrowUpRight size={12}/></a><a href={`mailto:${resume.email}`}>Email <ArrowUpRight size={12}/></a><a href={resume.phoneUrl}>Phone <Phone size={12}/></a><a href="https://wa.me/916302539619" target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={12}/></a></Box><Box><Text as="p" className="footer-label">A little more</Text><a href="/resume.html">Resume <ArrowUpRight size={12}/></a><a href="/assets/mohan-krishna-resume.pdf" download="Mohan-Krishna-Resume.pdf">Download PDF <FileDown size={12}/></a><Text as="p">Pilani, India · IST</Text></Box></Grid></div><div className="footer-landscape"><div className="footer-signature"><span className="footer-signature-name">krishna.</span></div><div className="clouds clouds-near" aria-hidden="true"><div className="cloud-bank"/></div></div><Flex className="copyright section-wrap" justify="between" gap="3" wrap="wrap"><span>© 2026 Krishna</span><span className="design-credit">Visual design inspired by <a href="https://heynatively.com/" target="_blank" rel="noopener noreferrer">Natively <ArrowUpRight size={11}/></a></span><a href={`${home}#main`}>Back to top <ArrowUpRight size={12}/></a></Flex></footer>;
}
export function App({caseContent}){
 const [paused,setPaused]=useState(false);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');let saved;try{saved=localStorage.getItem('portfolio-motion');}catch{}setPaused(saved==='off'||media.matches);const update=()=>setPaused(media.matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 function toggle(){setPaused(v=>{try{localStorage.setItem('portfolio-motion',v?'on':'off');}catch{}return !v;});}
 return <MotionPaused.Provider value={paused}><MotionConfig reducedMotion={paused?'always':'user'}><Theme appearance="inherit" accentColor="violet" grayColor="mauve" radius="large" className={paused?'portfolio motion-paused':'portfolio'}><a href="#main" className="skip-link">Skip to content</a><Header paused={paused} onToggle={toggle} casePage={!!caseContent}/>{caseContent?<main id="main" className="case-page section-wrap" dangerouslySetInnerHTML={{__html:caseContent}}/>:<main id="main"><Hero paused={paused}/><About/><Stats paused={paused}/><Work/><Experience/><Toolkit/><FAQ/></main>}<Footer casePage={!!caseContent}/></Theme></MotionConfig></MotionPaused.Provider>;
}
