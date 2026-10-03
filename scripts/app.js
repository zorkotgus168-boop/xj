/**
 * 天山绿谷·云杉秘境 | 巩留库尔德宁 H5 交互引擎
 * 功能模块：
 * 1. 竖向翻页滑动控制器 (Touch / Wheel / Drag / Indicator)
 * 2. Web Audio API 原生草原风与冬不拉自然氛围音合成器
 * 3. 交互式手绘景区地图与点位轮播 (Interactive Tour Map)
 * 4. 一谷四季图文交互展示 (Four Seasons Showcase)
 * 5. 生态研学科普小测试系统 (Ecology Quiz)
 * 6. 游客打卡留言墙 (Localstorage持久化)
 * 7. HTML5 Canvas 专属天山明信片合成导出
 * 8. 中英双语研学对照切换 (i18n Engine)
 * 9. 微信分享蒙层与通用复制交互
 */

(function () {
  'use strict';

  // ================= State Management =================
  const state = {
    currentPage: 0,
    totalPages: 8,
    isSliding: false,
    currentLang: 'zh', // 'zh' or 'en'
    isAudioPlaying: false,
    audioInitialized: false,
    currentSpotIdx: 0,
    currentSeason: 'spring'
  };

  // ================= I18N Data Dictionary =================
  const i18nData = {
    zh: {
      'nav.subtitle': '全景导览目录',
      'nav.title': '库尔德宁秘境之旅',
      'menu.p1': '天山绿谷·秘境封页',
      'menu.p2': '横沟奇迹·世界自然遗产',
      'menu.p3': '手绘导览·风光景点漫游',
      'menu.p4': '一谷四季·四时斑斓画卷',
      'menu.p5': '游牧古韵·哈萨克人文风情',
      'menu.p6': '实用手册·自驾食宿攻略',
      'menu.p7': '自然研学·雪岭云杉水库基因',
      'menu.p8': '相约天山·互动打卡与分享',
      
      'p1.heritage': '世界自然遗产 · 新疆天山核心区 ｜ 国家4A级景区',
      'p1.subline': '天山绿谷 · 云杉秘境',
      'p1.mainline': '巩留 · 库尔德宁',
      'p1.tag1': '雪岭云杉的故乡',
      'p1.tag2': '罕见南北横向阔谷',
      'p1.tag3': '哈萨克游牧风情',
      'p1.summary': '欧亚大陆野生生物天然基因库，这里汇聚天山至为壮丽的雪峰、林海与高山草甸。',
      'p1.btn': '开启秘境之旅',
      'common.swipeUp': '向上轻扫 探寻秘境',
      'common.nextChapter': '继续向下探索',

      'p2.tag': 'CHAPTER 01 · 秘境认知',
      'p2.title': '天山横沟，大美阔谷',
      'p2.lead': '哈萨克语意为“横沟”——天山山脉绝无仅有的南北走向山间阔谷',
      'p2.card1Title': '独特的地理奇观',
      'p2.card1Desc': '天山山系绝大多数山谷呈东西走向，唯有库尔德宁是罕见的南北向谷地。特殊的走向截留了大西洋吹来的丰沛暖湿水汽，孕育了极度茂盛的冷杉林海与生物多样性。',
      'p2.card2Title': '雪岭云杉之王',
      'p2.card2Desc': '西天山国家级自然保护区核心，中国森林蓄积量最高的高山针叶林区。这里拥有树龄超千年的“云杉王”，被中国国家地理誉为“中国最美十大森林”。',
      'p2.card3Title': '生态基因宝库',
      'p2.card3Desc': '喀班巴依峰（海拔4257米）雄踞谷底，冰川融水汇聚成碧澈的库尔德宁河。雪豹、天山马鹿、金雕与野果林在此生息，构成欧亚大陆极其珍贵的物种庇护所。',
      'p2.stat1': '喀班巴依峰海拔',
      'p2.stat2': '云杉王古树树龄',
      'p2.stat3': '世界自然遗产核心',

      'p3.tag': 'CHAPTER 02 · 景点漫游',
      'p3.title': '手绘导览 · 探索六大胜境',
      'p3.lead': '点击地图中的金色发光点位，沉浸查看景点图文与游玩亮点',

      'p4.tag': 'CHAPTER 03 · 时序变幻',
      'p4.title': '一谷四季 · 旷野华章',
      'p4.lead': '从漫山野花到水墨雪国，领略天山秘境在365天里的无尽流转',
      'p4.spring': '春·花海',
      'p4.summer': '夏·林海',
      'p4.autumn': '秋·彩林',
      'p4.winter': '冬·雪国',

      'p5.tag': 'CHAPTER 04 · 游牧记忆',
      'p5.title': '哈萨克风情 · 旷野长歌',
      'p5.lead': '世代驻牧于此的哈萨克牧民，将诗歌、琴弦与转场刻入群山血脉',
      'p5.item1Title': '冬不拉与阿肯阿依特斯',
      'p5.item1Desc': '“没有歌声的地方就像没有草的荒原”。两根琴弦的冬不拉能弹奏风声与马蹄声；每年夏秋的阿肯弹唱对歌会（国家级非遗），是草原最深情的智慧较量。',
      'p5.item2Title': '白毡房、咸奶茶与手抓肉',
      'p5.item2Desc': '毡房被称为“会呼吸的草原居所”，冬暖夏凉易于迁徙。推门而入，热腾腾的砖茶熬煮鲜牛奶加一撮青盐，搭配喷香的纳仁、手抓羊肉与包尔萨克，尽显极度纯朴的热情好客。',
      'p5.item3Title': '喀班巴依英雄传说与壮丽转场',
      'p5.item3Desc': '库尔德宁主峰以哈萨克民族英雄喀班巴依巴图鲁命名。每年春秋两季，浩荡的牛羊马群在云杉狭谷间踏起黄色烟尘转场迁徙，构成人类游牧文明活化石般的壮烈图景。',
      'p5.item4Title': '赛马叼羊与黑走马舞',
      'p5.item4Desc': '叼羊比赛速度与力量交织，姑娘追欢声笑语响彻草甸；夕阳西下篝火燃起，男女老幼踩着“黑走马（卡拉角勒哈）”的节奏摇肩踏足，欢聚直至星空璀璨。',

      'p6.tag': 'CHAPTER 05 · 行前指南',
      'p6.title': '畅行秘境 · 实用游玩手册',
      'p6.lead': '交通、门票、食宿、自驾环线与生态准则全指南',
      'p6.acc1Title': '交通路线与自驾环线',
      'p6.acc2Title': '门票开放与用时推荐',
      'p6.acc3Title': '特色食宿推荐',
      'p6.acc4Title': '装备指南与生态保护守则',

      'p7.tag': 'CHAPTER 06 · 自然研学',
      'p7.title': '一木一世界 · 天山云杉水库',
      'p7.lead': '雪岭云杉（Schrenk\'s Spruce）——天山高山森林生态系统的灵魂守护者',
      'p7.speciesTitle': '库尔德宁珍稀野生动植物名录',

      'p8.slogan': '赴一场天山之约\n遇见库尔德宁',
      'p8.subSlogan': '把心留在云杉深处，把天山清风带回家',
      'p8.shareCard': '生成旅行明信片海报',
      'p8.copyLink': '转发微信朋友圈',
      'p8.boardTitle': '游客互动留言打卡墙',
      'p8.submitBtn': '提交祝福打卡'
    },
    en: {
      'nav.subtitle': 'NAVIGATION INDEX',
      'nav.title': 'Journey to Kurdening',
      'menu.p1': '01 · Secret Haven Cover',
      'menu.p2': '02 · World Heritage Wonder',
      'menu.p3': '03 · Interactive Scenic Tour',
      'menu.p4': '04 · Four Seasons Harmony',
      'menu.p5': '05 · Kazakh Nomadic Culture',
      'menu.p6': '06 · Travel & Driving Guide',
      'menu.p7': '07 · Ecological Science Study',
      'menu.p8': '08 · Rendezvous & Share',

      'p1.heritage': 'UNESCO World Natural Heritage · Central Tien Shan | 4A Scenic Spot',
      'p1.subline': 'Tien Shan Green Valley · Spruce Sanctuary',
      'p1.mainline': 'Gongliu · Kurdening',
      'p1.tag1': 'Home of Schrenk\'s Spruce',
      'p1.tag2': 'Rare North-South Wide Valley',
      'p1.tag3': 'Authentic Kazakh Heritage',
      'p1.summary': 'A natural genetic treasure of Eurasian wildlife, uniting snow-capped peaks, evergreen spruce sea, and vast alpine pastures.',
      'p1.btn': 'Explore the Sanctuary',
      'common.swipeUp': 'Swipe up to explore',
      'common.nextChapter': 'Scroll down to discover',

      'p2.tag': 'CHAPTER 01 · DISCOVERY',
      'p2.title': 'Tien Shan Cross Valley Wonder',
      'p2.lead': '"Kurdening" means "Transverse Ditch" in Kazakh — a rare north-south valley in the east-west Tien Shan range',
      'p2.card1Title': 'Unique Geographic Marvel',
      'p2.card1Desc': 'Unlike most east-west ranges in Tien Shan, Kurdening runs north-south, capturing moisture carried all the way from the Atlantic to nurture lush fir forests.',
      'p2.card2Title': 'King of Schrenk\'s Spruce',
      'p2.card2Desc': 'The core of West Tien Shan Nature Reserve, hosting the highest forest stock in China. Home to a 1,000-year-old Spruce King tree.',
      'p2.card3Title': 'Ecological Gene Sanctuary',
      'p2.card3Desc': 'Mount Kabanbayi (4,257m) towers over crystal meltwater streams. Snow leopards, golden eagles, red deer, and wild apples thrive peacefully here.',
      'p2.stat1': 'Mt. Kabanbayi Peak',
      'p2.stat2': 'Spruce King Tree Age',
      'p2.stat3': 'World Heritage Core',

      'p3.tag': 'CHAPTER 02 · SCENIC TOUR',
      'p3.title': 'Scenic Spots Tour Guide',
      'p3.lead': 'Tap glowing golden pins on the map to explore highlights & photo spots',

      'p4.tag': 'CHAPTER 03 · SEASONS',
      'p4.title': 'Four Seasons of Kurdening',
      'p4.lead': 'From spring wild blooms to ink-wash winter snow, witness the eternal cycle of nature',
      'p4.spring': 'Spring·Blossom',
      'p4.summer': 'Summer·Green',
      'p4.autumn': 'Autumn·Gold',
      'p4.winter': 'Winter·Snow',

      'p5.tag': 'CHAPTER 04 · NOMADIC CULTURE',
      'p5.title': 'Kazakh Nomadic Heritage',
      'p5.lead': 'For generations, Kazakh nomads have carved poetry, dombra chords, and seasonal migrations into the mountains',
      'p5.item1Title': 'Dombra & Aken Singing',
      'p5.item1Desc': 'Two-stringed Dombra resonates with the sound of mountain wind and gallop. The annual Aken poet duel is an intangible cultural treasure.',
      'p5.item2Title': 'White Yurts, Milk Tea & Mutton',
      'p5.item2Desc': 'The felt yurt breathes with the seasons. Step inside for hot salted milk tea, hand-pulled mutton, and crunchy Baursak served with open warmth.',
      'p5.item3Title': 'Epic Kabanbay Hero Legend',
      'p5.item3Desc': 'Named after the legendary hero Kabanbay. Each spring and autumn, massive herds migrate through valleys, echoing ancient pastoral civilization.',
      'p5.item4Title': 'Horse Racing & Kara Zhorga Dance',
      'p5.item4Desc': 'Thrilling lamb-grabbing races and "Girl Chasing" games light up the meadows; when evening falls, fires burn for rhythmic shoulder-shaking dances.',

      'p6.tag': 'CHAPTER 05 · TRAVEL GUIDE',
      'p6.title': 'Practical Travel Handbook',
      'p6.lead': 'Directions, tickets, lodging, one-way loop, and Leave No Trace ethics',
      'p6.acc1Title': 'Transportation & Driving Loop',
      'p6.acc2Title': 'Tickets & Recommended Itineraries',
      'p6.acc3Title': 'Lodging & Local Delicacies',
      'p6.acc4Title': 'Gear Checklist & Eco Guidelines',

      'p7.tag': 'CHAPTER 06 · NATURE SCIENCE',
      'p7.title': 'Living Reservoir · Schrenk Spruce',
      'p7.lead': 'Schrenk\'s Spruce — the guardian soul of Tien Shan\'s alpine watershed ecosystem',
      'p7.speciesTitle': 'Rare Wildlife & Plants in Kurdening',

      'p8.slogan': 'Keep an Appointment with Tien Shan\nMeet Kurdening',
      'p8.subSlogan': 'Leave your soul in the spruce forest, take the alpine breeze home',
      'p8.shareCard': 'Generate Travel Postcard',
      'p8.copyLink': 'Share to Moments',
      'p8.boardTitle': 'Travelers Message Board',
      'p8.submitBtn': 'Submit Travel Wish'
    }
  };

  // ================= Spots Data =================
  const spotsData = [
    {
      id: 'qimengde',
      nameZh: '齐梦德观景台',
      nameEn: 'Qimengde Platform',
      elevation: '海拔 2150m',
      badge: '经典必打卡',
      img: 'assets/qimengde.jpg',
      descZh: '库尔德宁最为震撼的“神级机位”。站在此处，雪山冰川、墨绿云杉林海、波浪起伏的草甸毡房与晨昏云海同框，是摄影师与游客向往的梦幻胜景。',
      descEn: 'The iconic photo spot where snow-capped glaciers, deep spruce forest, rolling pastures with yurts, and misty clouds come together in one breathtaking panorama.',
      tips: ['📸 晨曦出片机位', '🚶 适合木栈道漫步', '☁️ 观常态化云海']
    },
    {
      id: 'spruce-king',
      nameZh: '千年雪岭云杉王',
      nameEn: '1000-Yr Spruce King',
      elevation: '海拔 1850m',
      badge: '千年神木',
      img: 'assets/spruce_king.jpg',
      descZh: '生长于西天山国家级自然保护区腹地，树高近50米、胸径数人合抱，树龄超过1000年，是天山林海生生不息的活图腾与自然水库典范。',
      descEn: 'Towering nearly 50 meters with a thousand years of age, this ancient giant is a living totem of the West Tien Shan and a prime ecological marvel.',
      tips: ['🌲 原始森林木栈道', '💧 负氧离子爆表', '🔬 生态研学必到']
    },
    {
      id: 'ten-li-gallery',
      nameZh: '十里画廊自驾景观带',
      nameEn: 'Ten-Li River Gallery',
      elevation: '海拔 1600m',
      badge: '风景自驾公路',
      img: 'assets/ten_li_gallery.jpg',
      descZh: '沿着库尔德宁清澈碧蓝的溪流蜿蜒延伸，公路两侧崖壁云杉如屏，牛羊漫步在河滩草甸，牧民毡房炊烟袅袅，宛若一幅长卷山水油画。',
      descEn: 'A cinematic driving route winding along the turquoise river, flanked by dramatic spruce slopes, grazing herds, and nomadic smoke.',
      tips: ['🚗 景交/自驾必经', '🌊 亲水徒步浅滩', '⛺ 露营野餐胜地']
    },
    {
      id: 'cloud-meadow',
      nameZh: '云上草原',
      nameEn: 'Meadow Above Clouds',
      elevation: '海拔 2300m',
      badge: '高山空中草甸',
      img: 'assets/spring.jpg',
      descZh: '高居峡谷之上的空中高山草甸，每年5-7月各色野花织就锦毯。策马奔腾其间，仿佛行走在云端，俯瞰整条深邃横沟。',
      descEn: 'An alpine plateau elevated high above the canyon. Wildflowers carpet the slope in summer where travelers ride horses touching the clouds.',
      tips: ['🏇 体验哈萨克策马', '🌸 高山野花花海', '🔭 俯瞰横谷地貌']
    },
    {
      id: 'ayousai',
      nameZh: '阿尤赛观景台',
      nameEn: 'Ayousai Panoramic Point',
      elevation: '海拔 2450m',
      badge: '雪山云海近景',
      img: 'assets/autumn.jpg',
      descZh: '正对喀班巴依峰的险峻冰斗，视野极为开阔。秋季层林尽染，金黄桦木与墨绿冷杉在此交错碰撞出摄人心魄的浓烈色彩。',
      descEn: 'Faces the glacial cirque of Kabanbay Peak directly. In autumn, golden birches and deep spruce form a fiery visual symphony.',
      tips: ['🍁 金秋彩林机位', '🦅 常遇金雕盘旋', '🏔️ 冰川近距离合影']
    },
    {
      id: 'kabanbay',
      nameZh: '喀峰大本营',
      nameEn: 'Kabanbay Base Camp',
      elevation: '海拔 2800m',
      badge: '天山勇士集结地',
      img: 'assets/winter.jpg',
      descZh: '天山喀班巴依主峰（4257m）登山与冰川科考大本营，星空极其纯净璀璨，是资深徒步穿越爱好者向往的净土。',
      descEn: 'Base camp for adventurers gazing at the 4,257m Kabanbay summit. A pristine sanctuary under starlit skies.',
      tips: ['🌌 银河星空观测点', '🥾 资深徒步穿越', '❄️ 冰川舌地质遗迹']
    }
  ];

  // ================= Seasons Data =================
  const seasonsData = {
    spring: {
      headlineZh: '春烟薄雾 · 幽谷仙境',
      headlineEn: 'Misty Spring · Sanctuary Awakening',
      poemZh: '“冰消泉涌白云深，云杉黛色染层林；雾锁横谷毡房隐，牧歌轻起向春茵。”',
      poemEn: '"Clouds veil the spruce as mountain brooks flow, misty valley shelters nomad yurts below; spring grass awakens in emerald sheen, echoing songs across hills serene."',
      palette: '#雨后青翠 & 谷雾白',
      img: 'assets/spring.jpg',
      traitsZh: [
        '特色景观：山间云雾在雪岭云杉梢头如丝绢流动，毡房骏马点缀湿润草甸',
        '气候体感：12℃ ~ 20℃，清新湿润，空气中弥漫雪岭云杉天然负氧离子',
        '不可错过：清晨漫步观赏薄雾穿透森林、若隐若现的天山仙境'
      ],
      traitsEn: [
        'Key Feature: Silky mountain mists drift through spruce treetops and nomad yurts',
        'Temperature: 12°C - 20°C, fresh air enriched with negative oxygen ions',
        'Must-See: Magical morning mist weaving through the spruce forest'
      ]
    },
    summer: {
      headlineZh: '夏日晴空 · 绿野雪峰',
      headlineEn: 'Sunny Summer · Emerald & Snow Peaks',
      poemZh: '“雪峰晴映蔚蓝天，万顷云杉锁翠烟；绿毯如茵毡房聚，清凉夏日胜神仙。”',
      poemEn: '"Snow-capped peaks shine against skies so blue, dense fir forest greets the morning dew; white yurts dot the emerald meadow floor, summer haven forever to adore."',
      palette: '#晴空湛蓝 & 云杉翠绿',
      img: 'assets/summer.jpg',
      traitsZh: [
        '特色景观：远处喀班巴依雪峰与眼前万顷云杉、白毡房构筑经典伊犁夏景',
        '避暑天堂：白天平均22℃，阳光透亮纯净，夜晚繁星银河肉眼清晰可见',
        '游牧风貌：毡房升起袅袅炊烟，牛羊马匹在无垠高山草甸惬意漫步'
      ],
      traitsEn: [
        'Key Feature: Distant snow peaks, evergreen spruces, and white yurts create iconic summer vistas',
        'Cool Haven: Avg 22°C daytime temperature with crystal-clear skies and starry nights',
        'Nomadic Life: Gentle smoke rises from yurts while horses graze across rolling green slopes'
      ]
    },
    autumn: {
      headlineZh: '秋高气爽 · 草原甘甜',
      headlineEn: 'Golden Autumn · Mountain Harvest',
      poemZh: '“天高气爽自驾行，手捧甘甜望远峰；盘山天路蜿蜒过，一谷秋实满目晴。”',
      poemEn: '"Brisk alpine breeze on the winding road, sweet melon in hand where memories glow; azure skies over endless golden green, the sweetest autumn ever seen."',
      palette: '#西瓜蜜红 & 天高云淡',
      img: 'assets/autumn.jpg',
      traitsZh: [
        '特色风情：秋季自驾盘山天路，在云上草甸手捧沙瓤冰甜的新疆大西瓜',
        '开阔视野：山高天阔，俯瞰深邃横谷盘山公路与远山连绵树阵',
        '最佳时节：9月少雨晴好，云卷云舒，昼夜温差适宜深度自驾与露营'
      ],
      traitsEn: [
        'Key Feature: Self-drive mountain roads and tasting sweet Xinjiang melon above the clouds',
        'Panoramic View: Overlooking the winding transverse valley routes and rolling ridges',
        'Golden Travel: Crisp autumn weather, dramatic cloudscapes, and pleasant scenic driving'
      ]
    },
    winter: {
      headlineZh: '水墨雪原 · 踏雪神驹',
      headlineEn: 'Winter Silence · Steed on Snow',
      poemZh: '“素雪千重覆万松，雕鞍骏马立苍穹；冰峰寂静冬阳暖，水墨天山意境浓。”',
      poemEn: '"Pristine white snow blankets pine and hill, a noble steed stands proud and still; winter sun warms the frozen air, ink-wash Tian Shan beyond compare."',
      palette: '#纯净雪白 & 蓝天暖阳',
      img: 'assets/winter.jpg',
      traitsZh: [
        '特色景观：哈萨克俊美骏马佩鞍傲立雪原，深蓝晴空与雪岭云杉相映生辉',
        '冬游体验：体验雪地骑马穿越雪岭云杉原始森林，拍摄绝美冬景大片',
        '天地至静：避开喧嚣，领略库尔德宁最纯净震撼的冬日冰雪秘境'
      ],
      traitsEn: [
        'Key Feature: Elegant saddled horse standing tall on pristine snow under deep blue skies',
        'Winter Ride: Ride through snowy spruce forests for unforgettable photography',
        'Absolute Peace: Escape the crowds to experience the ultimate tranquility of Tian Shan winter'
      ]
    }
  };

  // ================= DOM Elements Selection =================
  const dom = {
    slider: document.getElementById('h5Slider'),
    pages: document.querySelectorAll('.h5-page'),
    indicatorDots: document.querySelectorAll('.indicator-dot'),
    pageNumberDisplay: document.getElementById('pageNumberDisplay'),
    langToggleBtn: document.getElementById('langToggleBtn'),
    audioToggleBtn: document.getElementById('audioToggleBtn'),
    menuToggleBtn: document.getElementById('menuToggleBtn'),
    navDrawer: document.getElementById('navDrawer'),
    navDrawerBackdrop: document.getElementById('navDrawerBackdrop'),
    drawerCloseBtn: document.getElementById('drawerCloseBtn'),
    drawerMenuItems: document.querySelectorAll('.drawer-menu li'),
    startExploreBtn: document.getElementById('startExploreBtn'),
    cloudsCanvas: document.getElementById('cloudsCanvas'),
    heroBgVideo: document.getElementById('heroBgVideo'),
    
    // Page 3 Map & Spot elements
    mapPins: document.querySelectorAll('.map-pin'),
    spotMediaBox: document.getElementById('spotMediaBox'),
    spotImg: document.getElementById('spotImg'),
    spotTag: document.getElementById('spotTag'),
    spotName: document.getElementById('spotName'),
    spotElevation: document.getElementById('spotElevation'),
    spotDesc: document.getElementById('spotDesc'),
    spotTips: document.getElementById('spotTips'),
    spotCounter: document.getElementById('spotCounter'),
    spotDotsRail: document.getElementById('spotDotsRail'),
    spotPrevBtn: document.getElementById('spotPrevBtn'),
    spotNextBtn: document.getElementById('spotNextBtn'),

    // Page 4 Seasons elements
    seasonTabs: document.querySelectorAll('.season-tab-btn'),
    seasonBanner: document.getElementById('seasonBanner'),
    seasonPalette: document.getElementById('seasonPalette'),
    seasonHeadline: document.getElementById('seasonHeadline'),
    seasonPoem: document.getElementById('seasonPoem'),
    seasonTraits: document.getElementById('seasonTraits'),
    seasonPrevBtn: document.getElementById('seasonPrevBtn'),
    seasonNextBtn: document.getElementById('seasonNextBtn'),

    // Page 6 Accordion elements
    accordionHeaders: document.querySelectorAll('.accordion-header'),

    // Page 7 Quiz elements
    quizOptBtns: document.querySelectorAll('.quiz-opt-btn'),
    quizFeedback: document.getElementById('quizFeedback'),

    // Page 8 Postcard & Form elements
    genPostcardBtn: document.getElementById('genPostcardBtn'),
    copyLinkBtn: document.getElementById('copyLinkBtn'),
    backToTopBtn: document.getElementById('backToTopBtn'),
    commentForm: document.getElementById('commentForm'),
    commentAuthor: document.getElementById('commentAuthor'),
    commentContent: document.getElementById('commentContent'),
    commentStream: document.getElementById('commentStream'),
    shareGuideMask: document.getElementById('shareGuideMask'),
    closeShareMaskBtn: document.getElementById('closeShareMaskBtn'),
    postcardModalMask: document.getElementById('postcardModalMask'),
    closePostcardModalBtn: document.getElementById('closePostcardModalBtn'),
    downloadPostcardBtn: document.getElementById('downloadPostcardBtn'),
    canvasRenderContainer: document.getElementById('canvasRenderContainer'),
    toastTip: document.getElementById('toastTip')
  };

  // ================= Helper Utilities =================
  function showToast(msg) {
    if (!dom.toastTip) return;
    dom.toastTip.textContent = msg;
    dom.toastTip.classList.add('show');
    clearTimeout(dom.toastTip._timer);
    dom.toastTip._timer = setTimeout(() => {
      dom.toastTip.classList.remove('show');
    }, 2400);
  }

  // ================= Navigation Engine (Smooth Vertical Swiper) =================
  function goToPage(targetIndex) {
    if (state.isSliding || targetIndex === state.currentPage) return;
    if (targetIndex < 0 || targetIndex >= state.totalPages) return;

    state.isSliding = true;
    const prevPage = state.currentPage;
    state.currentPage = targetIndex;

    // Manage cover background video playback to save mobile memory/battery
    if (dom.heroBgVideo) {
      if (targetIndex === 0) {
        dom.heroBgVideo.play().catch(() => {});
      } else {
        dom.heroBgVideo.pause();
      }
    }

    // Update classes on pages
    dom.pages.forEach((page, idx) => {
      page.classList.remove('active', 'prev-page');
      if (idx === targetIndex) {
        page.classList.add('active');
      } else if (idx < targetIndex) {
        page.classList.add('prev-page');
      }
    });

    // Update indicator dots
    dom.indicatorDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === targetIndex);
    });

    // Update page number display (e.g. 03 / 08)
    if (dom.pageNumberDisplay) {
      const curStr = String(targetIndex + 1).padStart(2, '0');
      const totalStr = String(state.totalPages).padStart(2, '0');
      dom.pageNumberDisplay.textContent = `${curStr} / ${totalStr}`;
    }

    // Scroll inner container to top when entering
    const activeContent = dom.pages[targetIndex].querySelector('.page-scrollable');
    if (activeContent) {
      activeContent.scrollTop = 0;
    }

    setTimeout(() => {
      state.isSliding = false;
    }, 650);
  }

  function nextSlide() {
    if (state.currentPage < state.totalPages - 1) {
      goToPage(state.currentPage + 1);
    }
  }

  function prevSlide() {
    if (state.currentPage > 0) {
      goToPage(state.currentPage - 1);
    }
  }

  // Touch gesture handler for mobile
  let touchStartY = 0;
  let touchStartX = 0;
  let touchStartTime = 0;

  dom.slider.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
    touchStartTime = Date.now();
  }, { passive: true });

  dom.slider.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaY = touchEndY - touchStartY;
    const deltaX = touchEndX - touchStartX;
    const timeDiff = Date.now() - touchStartTime;

    // Check if horizontal swipe dominates (let internal carousels handle it)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      return;
    }

    const curPageElem = dom.pages[state.currentPage];
    const scrollContainer = curPageElem ? curPageElem.querySelector('.page-scrollable') : null;

    // Check inner scroll bounds
    if (scrollContainer) {
      const isAtTop = scrollContainer.scrollTop <= 2;
      const isAtBottom = (scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight) <= 2;

      if (deltaY < -55 && isAtBottom) {
        nextSlide();
      } else if (deltaY > 55 && isAtTop) {
        prevSlide();
      }
      return;
    }

    if (deltaY < -55) {
      nextSlide();
    } else if (deltaY > 55) {
      prevSlide();
    }
  }, { passive: true });

  // Mouse wheel handler for desktop preview
  let wheelTimeout = null;
  window.addEventListener('wheel', (e) => {
    if (wheelTimeout) return;
    const curPageElem = dom.pages[state.currentPage];
    const scrollContainer = curPageElem ? curPageElem.querySelector('.page-scrollable') : null;

    if (scrollContainer) {
      const isAtTop = scrollContainer.scrollTop <= 2;
      const isAtBottom = (scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight) <= 2;
      if (e.deltaY > 30 && isAtBottom) {
        nextSlide();
      } else if (e.deltaY < -30 && isAtTop) {
        prevSlide();
      }
    } else {
      if (e.deltaY > 30) {
        nextSlide();
      } else if (e.deltaY < -30) {
        prevSlide();
      }
    }

    wheelTimeout = setTimeout(() => {
      wheelTimeout = null;
    }, 600);
  }, { passive: true });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      nextSlide();
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      prevSlide();
    }
  });

  // Indicator dot clicks
  dom.indicatorDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      goToPage(idx);
    });
  });

  // Drawer menu clicks
  dom.drawerMenuItems.forEach((item) => {
    item.addEventListener('click', () => {
      const target = parseInt(item.getAttribute('data-goto'), 10);
      closeDrawer();
      goToPage(target);
    });
  });

  // Cover start button
  if (dom.startExploreBtn) {
    dom.startExploreBtn.addEventListener('click', () => {
      initAndToggleAudio();
      nextSlide();
    });
  }

  // Back to top button on page 8
  if (dom.backToTopBtn) {
    dom.backToTopBtn.addEventListener('click', () => {
      goToPage(0);
    });
  }

  // Drawer toggling
  function openDrawer() {
    dom.navDrawer.classList.add('open');
    dom.navDrawerBackdrop.classList.add('show');
  }

  function closeDrawer() {
    dom.navDrawer.classList.remove('open');
    dom.navDrawerBackdrop.classList.remove('show');
  }

  dom.menuToggleBtn.addEventListener('click', openDrawer);
  dom.drawerCloseBtn.addEventListener('click', closeDrawer);
  dom.navDrawerBackdrop.addEventListener('click', closeDrawer);

  // ================= Subtle Mountain Clouds Animation (Canvas) =================
  function initCloudsAnimation() {
    const canvas = dom.cloudsCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.offsetWidth || 375);
    let height = (canvas.height = canvas.parentElement.offsetHeight || 667);

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.parentElement.offsetWidth || 375;
      height = canvas.height = canvas.parentElement.offsetHeight || 667;
    });

    const clouds = [
      { x: 30, y: height * 0.35, r: 120, speed: 0.15, opacity: 0.22 },
      { x: 180, y: height * 0.45, r: 160, speed: 0.22, opacity: 0.28 },
      { x: 320, y: height * 0.38, r: 140, speed: 0.18, opacity: 0.20 },
      { x: -50, y: height * 0.48, r: 130, speed: 0.12, opacity: 0.25 }
    ];

    function renderClouds() {
      ctx.clearRect(0, 0, width, height);

      clouds.forEach((cloud) => {
        cloud.x += cloud.speed;
        if (cloud.x - cloud.r > width) {
          cloud.x = -cloud.r * 1.5;
        }

        const gradient = ctx.createRadialGradient(
          cloud.x, cloud.y, 0,
          cloud.x, cloud.y, cloud.r
        );
        gradient.addColorStop(0, `rgba(240, 248, 245, ${cloud.opacity})`);
        gradient.addColorStop(0.5, `rgba(220, 238, 230, ${cloud.opacity * 0.6})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(renderClouds);
    }

    renderClouds();
  }
  initCloudsAnimation();

  // ================= Native Web Audio Soundscape (Alpine Wind + Stream + Dombra) =================
  let audioCtx = null;
  let masterGain = null;
  let windNode = null;
  let melodyInterval = null;

  function initAudioSynthesizer() {
    if (state.audioInitialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);

      // Create gentle mountain breeze (Pink Noise filtered)
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.12;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter to simulate soft breeze through pine branches
      const windFilter = audioCtx.createBiquadFilter();
      windFilter.type = 'lowpass';
      windFilter.frequency.setValueAtTime(450, audioCtx.currentTime);

      const windGain = audioCtx.createGain();
      windGain.gain.setValueAtTime(0.4, audioCtx.currentTime);

      whiteNoise.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(masterGain);
      whiteNoise.start(0);

      // Kazakh Dombra Pentatonic plucked note generator (F, G, Bb, C, D)
      const dombraPitches = [174.61, 196.00, 233.08, 261.63, 293.66, 349.23, 392.00, 466.16];

      function pluckDombraString(freq, time, vel = 0.25) {
        if (!audioCtx || audioCtx.state !== 'running') return;
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();

        // Rich triangle wave with subtle harmonic
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        // Acoustic plucked decay envelope
        oscGain.gain.setValueAtTime(0.001, time);
        oscGain.gain.exponentialRampToValueAtTime(vel, time + 0.02);
        oscGain.gain.exponentialRampToValueAtTime(0.001, time + 1.6);

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start(time);
        osc.stop(time + 1.7);
      }

      // Schedule occasional pastoral chords
      melodyInterval = setInterval(() => {
        if (state.isAudioPlaying && audioCtx && audioCtx.state === 'running') {
          const now = audioCtx.currentTime;
          const rootNote = dombraPitches[Math.floor(Math.random() * dombraPitches.length)];
          pluckDombraString(rootNote, now, 0.18);
          // 40% chance of double pluck harmony
          if (Math.random() > 0.5) {
            pluckDombraString(rootNote * 1.5, now + 0.15, 0.12);
          }
        }
      }, 2200);

      state.audioInitialized = true;
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
    }
  }

  function initAndToggleAudio() {
    if (!state.audioInitialized) {
      initAudioSynthesizer();
    }

    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    state.isAudioPlaying = !state.isAudioPlaying;

    if (state.isAudioPlaying) {
      masterGain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 1.2);
      dom.audioToggleBtn.classList.remove('muted');
      showToast(state.currentLang === 'zh' ? '🎵 已开启山谷风声与冬不拉氛围音' : '🎵 Alpine wind & Dombra music on');
    } else {
      masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      dom.audioToggleBtn.classList.add('muted');
      showToast(state.currentLang === 'zh' ? '🔇 背景氛围音已静音' : '🔇 Audio muted');
    }
  }

  dom.audioToggleBtn.addEventListener('click', initAndToggleAudio);

  // ================= Page 3: Interactive Spots & Map =================
  function renderSpot(index) {
    const spot = spotsData[index];
    if (!spot) return;
    state.currentSpotIdx = index;

    // Highlight map pin
    dom.mapPins.forEach((pin) => {
      const pinId = pin.getAttribute('data-spot');
      pin.classList.toggle('active', pinId === spot.id);
    });

    // Update details & large picture with subtle zoom effect
    dom.spotImg.style.transform = 'scale(1.06)';
    dom.spotImg.style.backgroundImage = `url('${spot.img}')`;
    setTimeout(() => {
      dom.spotImg.style.transform = 'scale(1)';
    }, 150);

    dom.spotTag.textContent = spot.badge;
    dom.spotName.textContent = state.currentLang === 'zh' ? spot.nameZh : spot.nameEn;
    dom.spotElevation.textContent = spot.elevation;
    dom.spotDesc.textContent = state.currentLang === 'zh' ? spot.descZh : spot.descEn;

    // Update progress counter (e.g. 02 / 06)
    if (dom.spotCounter) {
      dom.spotCounter.textContent = `${String(index + 1).padStart(2, '0')} / 06`;
    }

    // Update 6 progress dots
    if (dom.spotDotsRail) {
      const dots = dom.spotDotsRail.querySelectorAll('.dot-item');
      dots.forEach((dot, dIdx) => {
        dot.classList.toggle('active', dIdx === index);
      });
    }

    // Update tips tags
    if (dom.spotTips && spot.tips) {
      dom.spotTips.innerHTML = spot.tips.map(t => `<span class="tip-tag">${t}</span>`).join('');
    }
  }

  // Map pin clicks
  dom.mapPins.forEach((pin) => {
    pin.addEventListener('click', () => {
      const spotId = pin.getAttribute('data-spot');
      const idx = spotsData.findIndex((s) => s.id === spotId);
      if (idx !== -1) renderSpot(idx);
    });
  });

  // Huge left/right buttons for spots
  if (dom.spotPrevBtn && dom.spotNextBtn) {
    dom.spotPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const prevIdx = (state.currentSpotIdx - 1 + spotsData.length) % spotsData.length;
      renderSpot(prevIdx);
    });
    dom.spotNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nextIdx = (state.currentSpotIdx + 1) % spotsData.length;
      renderSpot(nextIdx);
    });
  }

  // Dots direct clicks
  if (dom.spotDotsRail) {
    dom.spotDotsRail.querySelectorAll('.dot-item').forEach((dot, dIdx) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        renderSpot(dIdx);
      });
    });
  }

  // Touch Swipe Gesture for Page 3 Spot Card (Left / Right swipe)
  if (dom.spotMediaBox) {
    let spotTouchStartX = 0;
    let spotTouchStartY = 0;

    dom.spotMediaBox.addEventListener('touchstart', (e) => {
      spotTouchStartX = e.touches[0].clientX;
      spotTouchStartY = e.touches[0].clientY;
    }, { passive: true });

    dom.spotMediaBox.addEventListener('touchend', (e) => {
      const deltaX = e.changedTouches[0].clientX - spotTouchStartX;
      const deltaY = e.changedTouches[0].clientY - spotTouchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 35) {
        if (deltaX < 0) {
          // Swipe left -> next spot
          const nextIdx = (state.currentSpotIdx + 1) % spotsData.length;
          renderSpot(nextIdx);
        } else {
          // Swipe right -> prev spot
          const prevIdx = (state.currentSpotIdx - 1 + spotsData.length) % spotsData.length;
          renderSpot(prevIdx);
        }
      }
    }, { passive: true });
  }

  // ================= Page 4: Four Seasons Showcase =================
  const seasonKeys = ['spring', 'summer', 'autumn', 'winter'];

  function renderSeason(seasonKey) {
    const data = seasonsData[seasonKey];
    if (!data) return;
    state.currentSeason = seasonKey;

    dom.seasonTabs.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-season') === seasonKey);
    });

    dom.seasonBanner.style.backgroundImage = `url('${data.img}')`;
    dom.seasonPalette.textContent = data.palette;
    dom.seasonHeadline.textContent = state.currentLang === 'zh' ? data.headlineZh : data.headlineEn;
    dom.seasonPoem.textContent = state.currentLang === 'zh' ? data.poemZh : data.poemEn;

    const traits = state.currentLang === 'zh' ? data.traitsZh : data.traitsEn;
    dom.seasonTraits.innerHTML = traits
      .map((t) => `<div class="trait-item"><span class="trait-bullet">✦</span><span class="trait-txt">${t}</span></div>`)
      .join('');
  }

  dom.seasonTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const season = btn.getAttribute('data-season');
      renderSeason(season);
    });
  });

  // Huge left/right buttons for seasons
  if (dom.seasonPrevBtn && dom.seasonNextBtn) {
    dom.seasonPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const curIdx = seasonKeys.indexOf(state.currentSeason);
      const prevIdx = (curIdx - 1 + seasonKeys.length) % seasonKeys.length;
      renderSeason(seasonKeys[prevIdx]);
    });
    dom.seasonNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const curIdx = seasonKeys.indexOf(state.currentSeason);
      const nextIdx = (curIdx + 1) % seasonKeys.length;
      renderSeason(seasonKeys[nextIdx]);
    });
  }

  // Touch Swipe Gesture for Page 4 Season Banner
  if (dom.seasonBanner) {
    let seasonTouchStartX = 0;
    let seasonTouchStartY = 0;

    dom.seasonBanner.addEventListener('touchstart', (e) => {
      seasonTouchStartX = e.touches[0].clientX;
      seasonTouchStartY = e.touches[0].clientY;
    }, { passive: true });

    dom.seasonBanner.addEventListener('touchend', (e) => {
      const deltaX = e.changedTouches[0].clientX - seasonTouchStartX;
      const deltaY = e.changedTouches[0].clientY - seasonTouchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 35) {
        const curIdx = seasonKeys.indexOf(state.currentSeason);
        if (deltaX < 0) {
          // Swipe left -> next season
          const nextIdx = (curIdx + 1) % seasonKeys.length;
          renderSeason(seasonKeys[nextIdx]);
        } else {
          // Swipe right -> prev season
          const prevIdx = (curIdx - 1 + seasonKeys.length) % seasonKeys.length;
          renderSeason(seasonKeys[prevIdx]);
        }
      }
    }, { passive: true });
  }

  renderSeason('spring');

  // ================= Page 6: Guide Accordion =================
  dom.accordionHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('open');

      // Close all items
      document.querySelectorAll('.accordion-item').forEach((i) => i.classList.remove('open'));

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // ================= Page 7: Ecology Quiz System =================
  dom.quizOptBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.getAttribute('data-correct') === 'true';

      dom.quizOptBtns.forEach((b) => {
        b.classList.remove('correct', 'wrong');
        if (b.getAttribute('data-correct') === 'true') {
          b.classList.add('correct');
        }
      });

      if (!isCorrect) {
        btn.classList.add('wrong');
        dom.quizFeedback.style.display = 'block';
        dom.quizFeedback.style.color = '#ff9999';
        dom.quizFeedback.textContent = state.currentLang === 'zh'
          ? '❌ 回答不准确。正确答案是 B：南北走向阔谷截留大西洋水汽，降水量达800-1000毫米，为云杉提供了最理想的生长环境！'
          : '❌ Incorrect. Correct answer is B: The rare N-S valley traps Atlantic moisture to provide ample precipitation!';
      } else {
        dom.quizFeedback.style.display = 'block';
        dom.quizFeedback.style.color = '#9ae6b4';
        dom.quizFeedback.textContent = state.currentLang === 'zh'
          ? '🎉 回答完全正确！库尔德宁南北向横谷宛若天赐聚宝盆，截留大西洋温湿水汽，孕育了西天山最茂密的云杉水库！'
          : '🎉 Exactly right! The north-south valley traps moist Atlantic winds to foster the densest spruce forest!';
      }
    });
  });

  // ================= Page 8: Guestbook & Wish Wall =================
  const STORAGE_KEY = 'kurdening_guestbook_comments';

  function loadComments() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const list = JSON.parse(saved);
      if (Array.isArray(list) && list.length > 0) {
        list.reverse().forEach((item) => {
          prependCommentDOM(item.author, item.content, item.time);
        });
      }
    } catch (e) {}
  }

  function prependCommentDOM(author, content, time) {
    const bubble = document.createElement('div');
    bubble.className = 'comment-bubble animate-in';
    bubble.innerHTML = `
      <div class="cb-header">
        <span class="cb-user">🌲 ${escapeHTML(author)}</span>
        <span class="cb-time">${escapeHTML(time)}</span>
      </div>
      <div class="cb-text">${escapeHTML(content)}</div>
    `;
    dom.commentStream.insertBefore(bubble, dom.commentStream.firstChild);
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  if (dom.commentForm) {
    dom.commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = dom.commentAuthor.value.trim();
      const content = dom.commentContent.value.trim();
      if (!author || !content) return;

      const time = state.currentLang === 'zh' ? '刚刚' : 'Just now';
      prependCommentDOM(author, content, time);

      // Save to localStorage
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        saved.push({ author, content, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      } catch (err) {}

      dom.commentAuthor.value = '';
      dom.commentContent.value = '';
      showToast(state.currentLang === 'zh' ? '✨ 感谢您的天山寄语打卡！' : '✨ Thanks for leaving your travel wish!');
    });
  }
  loadComments();

  // ================= Page 8: Postcard Canvas Generator =================
  function generatePostcard() {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 920;
    const ctx = canvas.getContext('2d');

    // 1. Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 920);
    bgGrad.addColorStop(0, '#0d2820');
    bgGrad.addColorStop(0.5, '#133e2b');
    bgGrad.addColorStop(1, '#081712');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 640, 920);

    // 2. Draw Scenic Photo
    const img = new Image();
    img.src = 'assets/qimengde.jpg';
    img.onload = () => {
      ctx.save();
      // Rounded image
      ctx.beginPath();
      ctx.roundRect(40, 40, 560, 400, 16);
      ctx.clip();
      ctx.drawImage(img, 40, 40, 560, 400);
      ctx.restore();

      // Border around photo
      ctx.strokeStyle = '#df9b58';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(40, 40, 560, 400, 16);
      ctx.stroke();

      // 3. Cultural badge
      ctx.fillStyle = 'rgba(7, 21, 17, 0.75)';
      ctx.beginPath();
      ctx.roundRect(60, 60, 290, 36, 10);
      ctx.fill();
      ctx.fillStyle = '#f7e0b5';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('✦ 世界自然遗产 · 新疆天山核心区', 72, 84);

      // 4. Postcard Body Card
      ctx.fillStyle = '#fbf9f4';
      ctx.beginPath();
      ctx.roundRect(40, 465, 560, 395, 18);
      ctx.fill();

      // Stamp
      ctx.save();
      ctx.translate(520, 520);
      ctx.rotate(0.08);
      ctx.strokeStyle = '#c67d43';
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 2;
      ctx.strokeRect(-40, -40, 80, 80);
      ctx.fillStyle = '#c67d43';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('新疆·巩留', 0, -8);
      ctx.font = '12px sans-serif';
      ctx.fillText('库尔德宁', 0, 14);
      ctx.fillText('POSTMARK', 0, 28);
      ctx.restore();

      // Postcard texts
      ctx.fillStyle = '#133e2b';
      ctx.font = 'bold 26px serif';
      ctx.fillText('天山绿谷 · 云杉秘境', 70, 525);

      ctx.fillStyle = '#507563';
      ctx.font = '13px sans-serif';
      ctx.fillText('KURDENING · TIEN SHAN NATURE SANCTUARY', 70, 550);

      ctx.fillStyle = '#263b31';
      ctx.font = 'italic 16px serif';
      const quote = '“在欧亚大陆最辽阔的雪岭云杉林海中漫步，';
      const quote2 = ' 聆听喀班巴依雪峰与库尔德宁河的长歌。”';
      ctx.fillText(quote, 70, 605);
      ctx.fillText(quote2, 70, 635);

      // Divider line
      ctx.strokeStyle = 'rgba(19, 62, 43, 0.15)';
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(70, 675);
      ctx.lineTo(570, 675);
      ctx.stroke();

      // Bottom Signature
      ctx.fillStyle = '#7a8c82';
      ctx.font = '13px sans-serif';
      ctx.fillText('邀请人：天山绿谷·库尔德宁景区管委会', 70, 715);
      ctx.fillText('官方认证：世界自然遗产 · 国家级雪岭云杉自然保护区', 70, 738);

      // Render into dialog
      dom.canvasRenderContainer.innerHTML = '';
      dom.canvasRenderContainer.appendChild(canvas);
      dom.postcardModalMask.classList.add('show');
    };
  }

  if (dom.genPostcardBtn) {
    dom.genPostcardBtn.addEventListener('click', generatePostcard);
  }

  if (dom.closePostcardModalBtn) {
    dom.closePostcardModalBtn.addEventListener('click', () => {
      dom.postcardModalMask.classList.remove('show');
    });
  }

  if (dom.downloadPostcardBtn) {
    dom.downloadPostcardBtn.addEventListener('click', () => {
      const canvas = dom.canvasRenderContainer.querySelector('canvas');
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = 'Kurdening_TianShan_Postcard.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.92);
      link.click();
      showToast(state.currentLang === 'zh' ? '📸 明信片已开始下载保存' : '📸 Postcard downloaded');
    });
  }

  // WeChat Share Guide
  if (dom.copyLinkBtn) {
    dom.copyLinkBtn.addEventListener('click', () => {
      const isWeChat = /MicroMessenger/i.test(navigator.userAgent);
      if (isWeChat) {
        dom.shareGuideMask.classList.add('show');
      } else {
        // Copy url to clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href);
          showToast(state.currentLang === 'zh' ? '📋 网页链接已复制，可分享至微信！' : '📋 Link copied to clipboard!');
        } else {
          dom.shareGuideMask.classList.add('show');
        }
      }
    });
  }

  if (dom.closeShareMaskBtn) {
    dom.closeShareMaskBtn.addEventListener('click', () => {
      dom.shareGuideMask.classList.remove('show');
    });
  }

  // ================= Internationalization (i18n) Engine =================
  function toggleLanguage() {
    state.currentLang = state.currentLang === 'zh' ? 'en' : 'zh';
    dom.langToggleBtn.querySelector('.lang-text').textContent = state.currentLang === 'zh' ? 'EN' : '中文';

    const dict = i18nData[state.currentLang];
    document.querySelectorAll('[data-i18n]').forEach((elem) => {
      const key = elem.getAttribute('data-i18n');
      if (dict[key]) {
        elem.textContent = dict[key];
      }
    });

    // Refresh dynamic components with new language
    renderSpot(state.currentSpotIdx);
    renderSeason(state.currentSeason);

    showToast(state.currentLang === 'zh' ? '🇨🇳 已切换为中文' : '🌐 Switched to English');
  }

  dom.langToggleBtn.addEventListener('click', toggleLanguage);

  // Initial load spot
  renderSpot(0);

  // Ensure cover video autoplays or activates on first touch
  const playCoverVideo = () => {
    if (dom.heroBgVideo && dom.heroBgVideo.paused) {
      dom.heroBgVideo.play().catch(() => {});
    }
  };
  window.addEventListener('click', playCoverVideo, { once: true });
  window.addEventListener('touchstart', playCoverVideo, { once: true });

})();
