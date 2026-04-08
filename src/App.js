import { useState, useEffect, useRef, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════
   نُــــور — THE QURAN REIMAGINED
   In loving memory of Sarwat Baig · رحمه الله
   ═══════════════════════════════════════════════════════════════ */

const API = "https://api.alquran.cloud/v1";
const audioSrc = (r, n) => `https://cdn.islamic.network/quran/audio/128/${r}/${String(n).padStart(3,"0")}.mp3`;

// ── All 114 Surahs ──
const SU=[{n:1,a:"الفاتحة",e:"Al-Fatihah",m:"The Opening",v:7,t:"M",j:1},{n:2,a:"البقرة",e:"Al-Baqarah",m:"The Cow",v:286,t:"D",j:1},{n:3,a:"آل عمران",e:"Ali 'Imran",m:"Family of Imran",v:200,t:"D",j:3},{n:4,a:"النساء",e:"An-Nisa",m:"The Women",v:176,t:"D",j:4},{n:5,a:"المائدة",e:"Al-Ma'idah",m:"The Table",v:120,t:"D",j:6},{n:6,a:"الأنعام",e:"Al-An'am",m:"The Cattle",v:165,t:"M",j:7},{n:7,a:"الأعراف",e:"Al-A'raf",m:"The Heights",v:206,t:"M",j:8},{n:8,a:"الأنفال",e:"Al-Anfal",m:"Spoils of War",v:75,t:"D",j:9},{n:9,a:"التوبة",e:"At-Tawbah",m:"Repentance",v:129,t:"D",j:10},{n:10,a:"يونس",e:"Yunus",m:"Jonah",v:109,t:"M",j:11},{n:11,a:"هود",e:"Hud",m:"Hud",v:123,t:"M",j:11},{n:12,a:"يوسف",e:"Yusuf",m:"Joseph",v:111,t:"M",j:12},{n:13,a:"الرعد",e:"Ar-Ra'd",m:"Thunder",v:43,t:"D",j:13},{n:14,a:"ابراهيم",e:"Ibrahim",m:"Abraham",v:52,t:"M",j:13},{n:15,a:"الحجر",e:"Al-Hijr",m:"Rocky Tract",v:99,t:"M",j:14},{n:16,a:"النحل",e:"An-Nahl",m:"The Bee",v:128,t:"M",j:14},{n:17,a:"الإسراء",e:"Al-Isra",m:"Night Journey",v:111,t:"M",j:15},{n:18,a:"الكهف",e:"Al-Kahf",m:"The Cave",v:110,t:"M",j:15},{n:19,a:"مريم",e:"Maryam",m:"Mary",v:98,t:"M",j:16},{n:20,a:"طه",e:"Taha",m:"Ta-Ha",v:135,t:"M",j:16},{n:21,a:"الأنبياء",e:"Al-Anbiya",m:"Prophets",v:112,t:"M",j:17},{n:22,a:"الحج",e:"Al-Hajj",m:"Pilgrimage",v:78,t:"D",j:17},{n:23,a:"المؤمنون",e:"Al-Mu'minun",m:"Believers",v:118,t:"M",j:18},{n:24,a:"النور",e:"An-Nur",m:"The Light",v:64,t:"D",j:18},{n:25,a:"الفرقان",e:"Al-Furqan",m:"Criterion",v:77,t:"M",j:18},{n:26,a:"الشعراء",e:"Ash-Shu'ara",m:"Poets",v:227,t:"M",j:19},{n:27,a:"النمل",e:"An-Naml",m:"The Ant",v:93,t:"M",j:19},{n:28,a:"القصص",e:"Al-Qasas",m:"Stories",v:88,t:"M",j:20},{n:29,a:"العنكبوت",e:"Al-Ankabut",m:"Spider",v:69,t:"M",j:20},{n:30,a:"الروم",e:"Ar-Rum",m:"Romans",v:60,t:"M",j:21},{n:31,a:"لقمان",e:"Luqman",m:"Luqman",v:34,t:"M",j:21},{n:32,a:"السجدة",e:"As-Sajdah",m:"Prostration",v:30,t:"M",j:21},{n:33,a:"الأحزاب",e:"Al-Ahzab",m:"Forces",v:73,t:"D",j:21},{n:34,a:"سبإ",e:"Saba",m:"Sheba",v:54,t:"M",j:22},{n:35,a:"فاطر",e:"Fatir",m:"Originator",v:45,t:"M",j:22},{n:36,a:"يس",e:"Ya-Sin",m:"Ya-Sin",v:83,t:"M",j:22},{n:37,a:"الصافات",e:"As-Saffat",m:"Rows",v:182,t:"M",j:23},{n:38,a:"ص",e:"Sad",m:"Sad",v:88,t:"M",j:23},{n:39,a:"الزمر",e:"Az-Zumar",m:"Groups",v:75,t:"M",j:23},{n:40,a:"غافر",e:"Ghafir",m:"Forgiver",v:85,t:"M",j:24},{n:41,a:"فصلت",e:"Fussilat",m:"Explained",v:54,t:"M",j:24},{n:42,a:"الشورى",e:"Ash-Shura",m:"Consultation",v:53,t:"M",j:25},{n:43,a:"الزخرف",e:"Az-Zukhruf",m:"Gold",v:89,t:"M",j:25},{n:44,a:"الدخان",e:"Ad-Dukhan",m:"Smoke",v:59,t:"M",j:25},{n:45,a:"الجاثية",e:"Al-Jathiyah",m:"Kneeling",v:37,t:"M",j:25},{n:46,a:"الأحقاف",e:"Al-Ahqaf",m:"Dunes",v:35,t:"M",j:26},{n:47,a:"محمد",e:"Muhammad",m:"Muhammad",v:38,t:"D",j:26},{n:48,a:"الفتح",e:"Al-Fath",m:"Victory",v:29,t:"D",j:26},{n:49,a:"الحجرات",e:"Al-Hujurat",m:"Rooms",v:18,t:"D",j:26},{n:50,a:"ق",e:"Qaf",m:"Qaf",v:45,t:"M",j:26},{n:51,a:"الذاريات",e:"Adh-Dhariyat",m:"Winds",v:60,t:"M",j:26},{n:52,a:"الطور",e:"At-Tur",m:"Mount",v:49,t:"M",j:27},{n:53,a:"النجم",e:"An-Najm",m:"Star",v:62,t:"M",j:27},{n:54,a:"القمر",e:"Al-Qamar",m:"Moon",v:55,t:"M",j:27},{n:55,a:"الرحمن",e:"Ar-Rahman",m:"Most Merciful",v:78,t:"D",j:27},{n:56,a:"الواقعة",e:"Al-Waqi'ah",m:"Inevitable",v:96,t:"M",j:27},{n:57,a:"الحديد",e:"Al-Hadid",m:"Iron",v:29,t:"D",j:27},{n:58,a:"المجادلة",e:"Al-Mujadila",m:"Pleading",v:22,t:"D",j:28},{n:59,a:"الحشر",e:"Al-Hashr",m:"Exile",v:24,t:"D",j:28},{n:60,a:"الممتحنة",e:"Al-Mumtahanah",m:"Examined",v:13,t:"D",j:28},{n:61,a:"الصف",e:"As-Saf",m:"Ranks",v:14,t:"D",j:28},{n:62,a:"الجمعة",e:"Al-Jumu'ah",m:"Friday",v:11,t:"D",j:28},{n:63,a:"المنافقون",e:"Al-Munafiqun",m:"Hypocrites",v:11,t:"D",j:28},{n:64,a:"التغابن",e:"At-Taghabun",m:"Loss & Gain",v:18,t:"D",j:28},{n:65,a:"الطلاق",e:"At-Talaq",m:"Divorce",v:12,t:"D",j:28},{n:66,a:"التحريم",e:"At-Tahrim",m:"Prohibition",v:12,t:"D",j:28},{n:67,a:"الملك",e:"Al-Mulk",m:"Sovereignty",v:30,t:"M",j:29},{n:68,a:"القلم",e:"Al-Qalam",m:"The Pen",v:52,t:"M",j:29},{n:69,a:"الحاقة",e:"Al-Haqqah",m:"Reality",v:52,t:"M",j:29},{n:70,a:"المعارج",e:"Al-Ma'arij",m:"Stairways",v:44,t:"M",j:29},{n:71,a:"نوح",e:"Nuh",m:"Noah",v:28,t:"M",j:29},{n:72,a:"الجن",e:"Al-Jinn",m:"The Jinn",v:28,t:"M",j:29},{n:73,a:"المزمل",e:"Al-Muzzammil",m:"Wrapped",v:20,t:"M",j:29},{n:74,a:"المدثر",e:"Al-Muddaththir",m:"Cloaked",v:56,t:"M",j:29},{n:75,a:"القيامة",e:"Al-Qiyamah",m:"Resurrection",v:40,t:"M",j:29},{n:76,a:"الانسان",e:"Al-Insan",m:"Man",v:31,t:"D",j:29},{n:77,a:"المرسلات",e:"Al-Mursalat",m:"Emissaries",v:50,t:"M",j:29},{n:78,a:"النبإ",e:"An-Naba",m:"Tidings",v:40,t:"M",j:30},{n:79,a:"النازعات",e:"An-Nazi'at",m:"Extractors",v:46,t:"M",j:30},{n:80,a:"عبس",e:"Abasa",m:"He Frowned",v:42,t:"M",j:30},{n:81,a:"التكوير",e:"At-Takwir",m:"Folding Up",v:29,t:"M",j:30},{n:82,a:"الإنفطار",e:"Al-Infitar",m:"Cleaving",v:19,t:"M",j:30},{n:83,a:"المطففين",e:"Al-Mutaffifin",m:"Defrauding",v:36,t:"M",j:30},{n:84,a:"الإنشقاق",e:"Al-Inshiqaq",m:"Splitting",v:25,t:"M",j:30},{n:85,a:"البروج",e:"Al-Buruj",m:"Stars",v:22,t:"M",j:30},{n:86,a:"الطارق",e:"At-Tariq",m:"Nightcomer",v:17,t:"M",j:30},{n:87,a:"الأعلى",e:"Al-A'la",m:"Most High",v:19,t:"M",j:30},{n:88,a:"الغاشية",e:"Al-Ghashiyah",m:"Overwhelming",v:26,t:"M",j:30},{n:89,a:"الفجر",e:"Al-Fajr",m:"Dawn",v:30,t:"M",j:30},{n:90,a:"البلد",e:"Al-Balad",m:"City",v:20,t:"M",j:30},{n:91,a:"الشمس",e:"Ash-Shams",m:"Sun",v:15,t:"M",j:30},{n:92,a:"الليل",e:"Al-Layl",m:"Night",v:21,t:"M",j:30},{n:93,a:"الضحى",e:"Ad-Duhaa",m:"Morning",v:11,t:"M",j:30},{n:94,a:"الشرح",e:"Ash-Sharh",m:"Relief",v:8,t:"M",j:30},{n:95,a:"التين",e:"At-Tin",m:"The Fig",v:8,t:"M",j:30},{n:96,a:"العلق",e:"Al-Alaq",m:"The Clot",v:19,t:"M",j:30},{n:97,a:"القدر",e:"Al-Qadr",m:"Power",v:5,t:"M",j:30},{n:98,a:"البينة",e:"Al-Bayyinah",m:"Proof",v:8,t:"D",j:30},{n:99,a:"الزلزلة",e:"Az-Zalzalah",m:"Earthquake",v:8,t:"D",j:30},{n:100,a:"العاديات",e:"Al-Adiyat",m:"Chargers",v:11,t:"M",j:30},{n:101,a:"القارعة",e:"Al-Qari'ah",m:"Calamity",v:11,t:"M",j:30},{n:102,a:"التكاثر",e:"At-Takathur",m:"Rivalry",v:8,t:"M",j:30},{n:103,a:"العصر",e:"Al-Asr",m:"Time",v:3,t:"M",j:30},{n:104,a:"الهمزة",e:"Al-Humazah",m:"Slanderer",v:9,t:"M",j:30},{n:105,a:"الفيل",e:"Al-Fil",m:"Elephant",v:5,t:"M",j:30},{n:106,a:"قريش",e:"Quraysh",m:"Quraysh",v:4,t:"M",j:30},{n:107,a:"الماعون",e:"Al-Ma'un",m:"Kindness",v:7,t:"M",j:30},{n:108,a:"الكوثر",e:"Al-Kawthar",m:"Abundance",v:3,t:"M",j:30},{n:109,a:"الكافرون",e:"Al-Kafirun",m:"Disbelievers",v:6,t:"M",j:30},{n:110,a:"النصر",e:"An-Nasr",m:"Help",v:3,t:"D",j:30},{n:111,a:"المسد",e:"Al-Masad",m:"Fibre",v:5,t:"M",j:30},{n:112,a:"الإخلاص",e:"Al-Ikhlas",m:"Sincerity",v:4,t:"M",j:30},{n:113,a:"الفلق",e:"Al-Falaq",m:"Dawn",v:5,t:"M",j:30},{n:114,a:"الناس",e:"An-Nas",m:"Mankind",v:6,t:"M",j:30}];
const REC=[{id:"ar.alafasy",n:"Mishary Alafasy",f:"🇰🇼"},{id:"ar.abdulbasitmurattal",n:"Abdul Basit",f:"🇪🇬"},{id:"ar.abdurrahmaanas-sudais",n:"As-Sudais",f:"🇸🇦"},{id:"ar.husary",n:"Al-Husary",f:"🇪🇬"},{id:"ar.minshawi",n:"Al-Minshawi",f:"🇪🇬"},{id:"ar.ahmedajamy",n:"Al-Ajamy",f:"🇸🇦"},{id:"ar.muhammadayyoub",n:"Muhammad Ayyub",f:"🇸🇦"},{id:"ar.muhammadjibreel",n:"M. Jibreel",f:"🇪🇬"}];
const LNG=[{c:"en",id:"en.sahih",n:"English",f:"🇬🇧"},{c:"ur",id:"ur.jalandhry",n:"Urdu",f:"🇵🇰"},{c:"fr",id:"fr.hamidullah",n:"French",f:"🇫🇷"},{c:"tr",id:"tr.diyanet",n:"Turkish",f:"🇹🇷"},{c:"bn",id:"bn.bengali",n:"Bengali",f:"🇧🇩"},{c:"id",id:"id.indonesian",n:"Indonesian",f:"🇮🇩"},{c:"de",id:"de.aburida",n:"German",f:"🇩🇪"},{c:"es",id:"es.cortes",n:"Spanish",f:"🇪🇸"},{c:"ru",id:"ru.kuliev",n:"Russian",f:"🇷🇺"},{c:"zh",id:"zh.majian",n:"Chinese",f:"🇨🇳"},{c:"fa",id:"fa.makarem",n:"Persian",f:"🇮🇷"},{c:"it",id:"it.piccardo",n:"Italian",f:"🇮🇹"}];
const MOODS={anxious:{emoji:"😰",label:"Anxious",color:"#4A90D9",reciter:"ar.alafasy",verses:["2:286","3:139","94:5","94:6","65:3","13:28"],desc:"Allah does not burden a soul beyond what it can bear"},grateful:{emoji:"🤲",label:"Grateful",color:"#4CAF50",reciter:"ar.abdulbasitmurattal",verses:["14:7","31:12","2:152","16:18","55:13","27:19"],desc:"If you are grateful, I will surely increase you"},sad:{emoji:"💔",label:"Sad",color:"#7E57C2",reciter:"ar.minshawi",verses:["94:5","94:6","2:155","2:156","2:286","3:139"],desc:"Verily, with hardship comes ease"},hopeful:{emoji:"🌅",label:"Hopeful",color:"#FF9800",reciter:"ar.husary",verses:["2:186","40:60","42:25","39:53","12:87","15:56"],desc:"Do not despair of the mercy of Allah"},scared:{emoji:"😟",label:"Fearful",color:"#E91E63",reciter:"ar.abdurrahmaanas-sudais",verses:["3:173","2:286","8:46","9:51","33:3","65:3"],desc:"Allah is sufficient for us"},seeking:{emoji:"🔍",label:"Seeking Guidance",color:"#00BCD4",reciter:"ar.alafasy",verses:["1:6","2:2","3:8","20:114","2:269","6:125"],desc:"Guide us to the straight path"},peaceful:{emoji:"🕊️",label:"At Peace",color:"#8BC34A",reciter:"ar.ahmedajamy",verses:["13:28","89:27","89:28","89:29","89:30","10:62"],desc:"In the remembrance of Allah do hearts find rest"},lonely:{emoji:"🌙",label:"Lonely",color:"#9C27B0",reciter:"ar.muhammadayyoub",verses:["2:186","50:16","57:4","58:7","9:40","20:46"],desc:"We are closer to him than his jugular vein"}};
const THEMES=[{id:"patience",name:"Patience",icon:"🏔️",cnt:90},{id:"mercy",name:"Allah's Mercy",icon:"💧",cnt:114},{id:"paradise",name:"Paradise",icon:"🌿",cnt:70},{id:"stories",name:"Prophet Stories",icon:"📖",cnt:150},{id:"science",name:"Scientific Signs",icon:"🔬",cnt:45},{id:"women",name:"Women in Quran",icon:"👩",cnt:35},{id:"justice",name:"Justice",icon:"⚖️",cnt:55},{id:"nature",name:"Nature Signs",icon:"🌍",cnt:80},{id:"dua",name:"Quranic Du'as",icon:"🤲",cnt:40},{id:"night",name:"Night & Reflection",icon:"🌙",cnt:30}];
const CHAT_KEYS={"pillar":"pillars","five pillars":"pillars","arkan":"pillars","iman":"iman","faith":"iman","belief":"iman","article":"iman","salah":"prayer","prayer":"prayer","namaz":"prayer","salat":"prayer","quran":"quran","koran":"quran","mushaf":"quran","prophet":"prophets","nabi":"prophets","messenger":"prophets","rasul":"prophets","ramadan":"ramadan","fasting":"ramadan","sawm":"ramadan","roza":"ramadan","iftar":"ramadan","suhoor":"ramadan","hajj":"hajj","pilgrim":"hajj","mecca":"hajj","makkah":"hajj","umrah":"hajj","kaaba":"hajj","kabah":"hajj","wudu":"wudu","ablution":"wudu","wudhu":"wudu","ghusl":"wudu","zakat":"zakat","charity":"zakat","sadaqah":"zakat","alms":"zakat","dua":"dua","supplication":"dua","dhikr":"dua","azkar":"dua","jannah":"jannah","paradise":"jannah","heaven":"jannah","jahannam":"jahannam","hell":"jahannam","fire":"jahannam","angel":"angels","malaika":"angels","jibreel":"angels","fatihah":"fatihah","fatiha":"fatihah","opening":"fatihah","baqarah":"baqarah","cow":"baqarah","ikhlas":"ikhlas","sincerity":"ikhlas","ayat":"ayatul","kursi":"ayatul","surah":"surahinfo","meaning":"surahinfo","tafsir":"tafsir","tafseer":"tafsir","explanation":"tafsir","nikah":"nikah","marriage":"nikah","wedding":"nikah","death":"death","janazah":"death","burial":"death","funeral":"death","halal":"halal","haram":"halal","food":"halal","seerah":"seerah","muhammad":"seerah","biography":"seerah","hijab":"hijab","modest":"hijab","women":"hijab","tawhid":"tawhid","monotheism":"tawhid","oneness":"tawhid","shirk":"tawhid"};
const KB={pillars:"**Five Pillars of Islam:**\n1. **Shahādah** — Declaration of faith\n2. **Ṣalāh** — Five daily prayers\n3. **Zakāh** — 2.5% annual charity\n4. **Ṣawm** — Fasting in Ramadan\n5. **Ḥajj** — Pilgrimage to Makkah\n\n📖 Bukhari 8; Muslim 16",iman:"**Six Articles of Iman:** Belief in Allah, Angels, Divine Books, Prophets, Day of Judgment, and Divine Decree (Al-Qadr).\n\n📖 Hadith of Jibreel — Muslim 8",prayer:"**Five Daily Prayers:**\nFajr (2), Dhuhr (4), Asr (4), Maghrib (3), Isha (4)\nAdditional: Sunnah, Witr, Tahajjud, Duha\n\n📖 Quran 4:103; Bukhari 528",quran:"**The Holy Quran:** 114 Surahs · 6,236 Verses · 30 Juz · Revealed over 23 years to Prophet Muhammad ﷺ through Angel Jibreel. 86 Meccan + 28 Medinan surahs. Preserved unchanged.\n\n\"We sent down the reminder, and We will be its guardian.\" — **Quran 15:9**",prophets:"**25 Prophets in the Quran:** Adam, Idris, Nuh, Hud, Salih, Ibrahim, Lut, Ismail, Ishaq, Ya'qub, Yusuf, Ayyub, Shu'ayb, Musa, Harun, Dhul-Kifl, Dawud, Sulayman, Ilyas, Al-Yasa, Yunus, Zakariya, Yahya, Isa, Muhammad ﷺ\n\n📖 Quran 6:83-86",ramadan:"**Ramadan:** 9th Islamic month. Fast dawn to sunset. Quran first revealed in Ramadan. **Laylatul Qadr** is better than 1,000 months. Tarawih prayers nightly. Ends with Eid al-Fitr.\n\n📖 Quran 2:185; Bukhari 1899",hajj:"**Hajj Rituals:** Ihram, Tawaf (7 circuits), Sa'i (Safa-Marwa), Day of Arafat, Muzdalifah, Rami al-Jamarat, Sacrifice. Obligatory once if able.\n\n📖 Quran 22:27; Muslim 1218",wudu:"**Wudu Steps:** 1. Niyyah + Bismillah 2. Hands ×3 3. Mouth ×3 4. Nose ×3 5. Face ×3 6. Arms to elbows ×3 7. Head once 8. Ears once 9. Feet to ankles ×3\n\n📖 Quran 5:6; Bukhari 159",zakat:"**Zakat:** 2.5% of savings held one lunar year. Nisab: ~85g gold. 8 recipient categories in Quran 9:60: poor, needy, collectors, new Muslims, slaves, debtors, Allah's cause, travelers.\n\n📖 Quran 2:43; Bukhari 1395",dua:"**Essential Du'as:**\nBefore eating: Bismillah · After: Alhamdulillah\nSleep: Bismika Allahumma amootu wa ahya\nWaking: Alhamdulillahil-ladhi ahyana\nDistress: La ilaha illa Anta, Subhanaka\nIstighfar: Astaghfirullaha wa atoobu ilayh\n\n📖 Hisn al-Muslim",jannah:"**Jannah (Paradise):** 8 gates, multiple levels. Firdaus is highest. Gardens with rivers, eternal youth, no sorrow. Greatest reward: seeing Allah's face. \"In Paradise is what no eye has seen, no ear has heard.\"\n\n📖 Bukhari 3244; Muslim 2824",jahannam:"**Jahannam:** 7 gates (Quran 15:44). Punishment for disbelief and major sins. But Allah's mercy prevails — He kept 99 of 100 parts of mercy for Judgment Day.\n\n📖 Muslim 2752",fatihah:"**Surah Al-Fatihah (The Opening):** Greatest Surah. Recited in every rak'ah. Called **Umm al-Kitab** (Mother of the Book). It praises Allah, affirms His mercy, acknowledges Judgment Day, declares exclusive worship, and asks for guidance. Prayer is invalid without it.\n\n📖 Bukhari 756; Quran 15:87",baqarah:"**Surah Al-Baqarah:** Longest Surah (286 verses). Contains **Ayat al-Kursi** (2:255) — greatest verse. Covers laws of fasting, Hajj, marriage, finance. Last 2 verses protect whoever recites them at night.\n\n📖 Muslim 804",ikhlas:"**Surah Al-Ikhlas:** Equal to **one-third of the Quran**. Summarizes Tawhid: Allah is One (Ahad), Self-Sufficient (As-Samad), does not beget nor was begotten, nothing is comparable to Him.\n\n📖 Bukhari 5015; Muslim 811",ayatul:"**Ayat al-Kursi (2:255):** Greatest verse. Affirms Allah's sovereignty and power. Recite after each prayer — nothing prevents entering Paradise except death. Recite before sleep for protection.\n\n📖 Muslim 810",surahinfo:"**Quran Surahs:** 114 total. 86 Meccan (faith, Tawhid, prophets) + 28 Medinan (laws, community). Longest: Al-Baqarah (286). Shortest: Al-Kawthar (3). Study Tafsir Ibn Kathir for deep understanding.\n\n📖 Use Study mode for Tafsir!",tafsir:"**Tafsir (Quran Explanation):** Major works: **Ibn Kathir** (Hadith-based), **Al-Tabari** (earliest), **Al-Qurtubi** (legal), **Al-Jalalayn** (concise). This app includes Tafsir Ibn Kathir.\n\n📖 Quran 47:24",nikah:"**Nikah (Marriage):** Requirements: consent of both, wali (guardian), mahr (dowry), two witnesses, public announcement. \"When a man marries, he has completed half of his religion.\"\n\n📖 Quran 4:4; Muslim 1006",death:"**Janazah (Funeral):** At death say Shahādah. Ghusl (washing), Kafan (shrouds), Salat al-Janazah (4 takbeers), burial facing Qiblah. Say: Inna lillahi wa inna ilayhi raji'un.\n\n📖 Quran 2:156; Bukhari 1240",halal:"**Halal & Haram:** All food halal except: pork, alcohol, blood, carrion, animals not slaughtered in Allah's name. \"He has forbidden dead animals, blood, pork, and that dedicated to other than Allah.\" — **Quran 2:173**",seerah:"**Prophet Muhammad ﷺ:** Born Makkah 570 CE. First revelation age 40 in Cave Hira. Hijrah to Madinah 622 CE. Conquered Makkah 630 CE. Farewell Sermon on Arafat. Passed away 632 CE. Sent as mercy to all mankind (Quran 21:107).\n\n📖 Ar-Rahiq Al-Makhtum",hijab:"**Hijab & Modesty:** Islam prescribes modesty for both genders. Women: cover body except face and hands (Quran 33:59). Men: lower gaze, cover navel to knee. \"Modesty is a branch of Iman.\" — Prophet ﷺ\n\n📖 Quran 24:30-31; Bukhari 9",tawhid:"**Tawhid (Monotheism):** Core of Islam. 3 categories: Rububiyyah (Allah is Creator), Uluhiyyah (worship Him alone), Asma wa Sifat (unique Names & Attributes). Shirk (partners with Allah) is the greatest sin.\n\n📖 Quran 112:1-4",angels:"**Angels:** Created from light, always obey Allah. Key angels: **Jibreel** (revelation), **Mikail** (sustenance), **Israfil** (trumpet), **Malak al-Mawt** (death), **Munkar & Nakir** (grave), **Kiraman Katibin** (recording deeds).\n\n📖 Quran 2:97; Muslim 2637"};
const ft=s=>{if(!s||isNaN(s))return"0:00";return`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`};

// Convert Western numerals to Arabic-Indic (١٢٣٤٥٦٧٨٩٠)
const toArabicNum = (n) => String(n).replace(/[0-9]/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);

// ═══════════════════════════════════════════
// TIME-OF-DAY DETECTION & THEME SYSTEM
// ═══════════════════════════════════════════
const getTimeOfDay = () => {
  const h = new Date().getHours();
  if (h >= 4 && h < 6) return "fajr";
  if (h >= 6 && h < 12) return "morning";
  if (h >= 12 && h < 15) return "dhuhr";
  if (h >= 15 && h < 18) return "asr";
  if (h >= 18 && h < 20) return "maghrib";
  if (h >= 20 && h < 22) return "isha";
  return "night";
};

const TIME_SCENES = {
  fajr:    { emoji:"🌅", label:"Fajr Time", greeting:"May your day begin with barakah", darkText:false, gradient:"linear-gradient(180deg,#1a1a2e 0%,#16213e 30%,#e94560 60%,#f5a623 100%)" },
  morning: { emoji:"☀️", label:"Dhuha · Morning", greeting:"Alhamdulillah for a new day", darkText:true, gradient:"linear-gradient(180deg,#87CEEB 0%,#98D8F0 30%,#E8F5E9 60%,#FFF8E1 100%)" },
  dhuhr:   { emoji:"🌤️", label:"Dhuhr Time", greeting:"Take a moment to remember Allah", darkText:true, gradient:"linear-gradient(180deg,#64B5F6 0%,#90CAF9 40%,#E3F2FD 70%,#FFFDE7 100%)" },
  asr:     { emoji:"🌥️", label:"Asr Time", greeting:"The afternoon belongs to the mindful", darkText:true, gradient:"linear-gradient(180deg,#F0C27F 0%,#E8D5B7 30%,#FFF1D0 60%,#FCE4A8 100%)" },
  maghrib: { emoji:"🌇", label:"Maghrib Time", greeting:"SubhanAllah, what a beautiful sunset", darkText:false, gradient:"linear-gradient(180deg,#1a1a3e 0%,#e74c3c 30%,#f39c12 60%,#f1c40f 100%)" },
  isha:    { emoji:"🌆", label:"Isha Time", greeting:"May Allah accept your prayers tonight", darkText:false, gradient:"linear-gradient(180deg,#0c0c24 0%,#1a1a4e 40%,#2c3e6b 70%,#e67e22 100%)" },
  night:   { emoji:"🌙", label:"Tahajjud · Night", greeting:"The night is for those who seek Allah", darkText:false, gradient:"linear-gradient(180deg,#020111 0%,#0a0a2e 40%,#161638 70%,#1a1a3e 100%)" },
};

const DARK = {
  bg:"#05080D",bg2:"#0A1018",bg3:"#0F1720",bg4:"#152030",
  g:"#C4A448",gl:"#E0CC7A",gd:"#96792E",em:"#127B56",el:"#1FAF7A",ed:"#0A5139",
  tx:"#E8E2D0",tx2:"#8E99A8",tx3:"#556070",bd:"#182535",
  hdr:"rgba(5,8,13,.95)",cardBg:"#0F1720",
  arabicColor:"#E8E2D0",trColor:"#8E99A8",
};

const LIGHT = {
  bg:"#F7F4EE",bg2:"#EFEBE3",bg3:"#FFFFFF",bg4:"#E8E3D9",
  g:"#8B6914",gl:"#6B4F0A",gd:"#A07D1C",em:"#0E6B47",el:"#0B5438",ed:"#D4EDDA",
  tx:"#1A1A1A",tx2:"#4A4A4A",tx3:"#7A7A7A",bd:"#D6D0C4",
  hdr:"rgba(247,244,238,.95)",cardBg:"#FFFFFF",
  arabicColor:"#1A1A1A",trColor:"#4A4A4A",
};

// Icons
const IC={
  moon:<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  sun:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  auto:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20" fill="currentColor"/></svg>,
  book:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  search:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  play:<svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><polygon points="5 3 19 12 5 21"/></svg>,
  pause:<svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  chat:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  send:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="m22 2-7 20-4-9-9-4z"/><path d="m22 2-11 11"/></svg>,
  heart:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  compass:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"/></svg>,
  brain:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><path d="M12 2C8 2 5 5 5 8c0 2 1 3.5 2 4.5V16l2 2v3h6v-3l2-2v-3.5c1-1 2-2.5 2-4.5 0-3-3-6-7-6z"/></svg>,
  sparkle:<svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z"/></svg>,
  pen:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>,
  layers:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><polygon points="12 2 2 7 12 12 22 7"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  target:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  x:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  left:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="m15 18-6-6 6-6"/></svg>,
  right:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="m9 18 6-6-6-6"/></svg>,
  bm:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  globe:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  hp:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
};

export default function NoorApp() {
  const [themeMode, setThemeMode] = useState(() => { try { return localStorage?.getItem?.("noor_theme")||"auto" } catch{return"auto"} });
  const [tod, setTod] = useState(getTimeOfDay());
  const isDark = themeMode==="dark" || (themeMode==="auto" && ["night","isha","fajr","maghrib"].includes(tod));
  const T = isDark ? DARK : LIGHT;
  const scene = TIME_SCENES[tod];

  useEffect(() => { try{localStorage?.setItem?.("noor_theme",themeMode)}catch{} }, [themeMode]);
  useEffect(() => { const i=setInterval(()=>setTod(getTimeOfDay()),60000); return()=>clearInterval(i); }, []);

  const cycleTheme = () => setThemeMode(p => p==="auto"?"light":p==="light"?"dark":"auto");

  const [tab,setTab]=useState("home");
  const [surah,setSurah]=useState(null);
  const [q,setQ]=useState("");const [filter,setFilter]=useState("all");const [juz,setJuz]=useState(0);
  const [lang,setLang]=useState(LNG[0]);const [lang2,setLang2]=useState(null);
  const [rec,setRec]=useState(REC[0]);const [showTlit,setShowTlit]=useState(true);
  const [showTaf,setShowTaf]=useState({});
  const [bm,setBm]=useState(()=>{try{return JSON.parse(localStorage?.getItem?.("noor_bm")||"[]")}catch{return[]}});
  const [vrs,setVrs]=useState([]);const [trVrs,setTrVrs]=useState([]);const [trVrs2,setTrVrs2]=useState([]);
  const [ld,setLd]=useState(false);
  const [audio]=useState(()=>typeof Audio!=="undefined"?new Audio():null);
  const [playing,setPlaying]=useState(null);const [prog,setProg]=useState(0);const [dur,setDur]=useState(0);
  const [daily,setDaily]=useState(null);
  const [msgs,setMsgs]=useState([]);const [chatIn,setChatIn]=useState("");const [chatLd,setChatLd]=useState(false);
  const chatRef=useRef(null);
  const [journal,setJournal]=useState(()=>{try{return JSON.parse(localStorage?.getItem?.("noor_journal")||"{}")}catch{return{}}});
  const [editingNote,setEditingNote]=useState(null);const [noteText,setNoteText]=useState("");
  const [moodMode,setMoodMode]=useState(null);const [moodVerses,setMoodVerses]=useState([]);const [moodLd,setMoodLd]=useState(false);
  const [hifzMode,setHifzMode]=useState(false);const [hiddenWords,setHiddenWords]=useState({});
  const [readMode,setReadMode]=useState("study"); // "mushaf" = pure Arabic flow, "study" = full verse-by-verse, "mixed" = Arabic + translation only
  const [mushafPage,setMushafPage]=useState(1); // Current Mushaf page (1-604)
  const [mushafLines,setMushafLines]=useState(null); // QPC v2 word data grouped by line
  const [mushafLd,setMushafLd]=useState(false);
  const [qfToken,setQfToken]=useState(null); // Quran Foundation OAuth token
  
  // Quran Foundation API credentials
  const QF_ID="9c9dd24f-9873-4211-a6b5-502ac85754bf";
  const QF_SECRET="d6uetkamUhnfIhHoFedfaVGcFG";
  const QF_AUTH="https://prelive-oauth2.quran.foundation";
  const QF_API="https://apis-prelive.quran.foundation/content/api/v4";
  const QF_FONTS="https://verses.quran.foundation/fonts/quran/hafs/v2/woff2";

  // Get OAuth2 token
  const getToken=async()=>{
    if(qfToken)return qfToken;
    try{
      const r=await fetch(`${QF_AUTH}/oauth2/token`,{
        method:"POST",
        headers:{"Content-Type":"application/x-www-form-urlencoded",
          "Authorization":"Basic "+btoa(`${QF_ID}:${QF_SECRET}`)},
        body:"grant_type=client_credentials&scope=content"
      });
      const d=await r.json();
      if(d.access_token){setQfToken(d.access_token);return d.access_token}
    }catch(e){console.log("Token error:",e)}
    return null;
  };

  // Fetch Mushaf page word data
  useEffect(()=>{
    if(readMode!=="mushaf")return;
    (async()=>{
      setMushafLd(true);setMushafLines(null);
      try{
        const token=await getToken();
        if(!token)throw new Error("No token");
        const r=await fetch(`${QF_API}/verses/by_page/${mushafPage}?words=true&word_fields=code_v2,v2_page,line_number,char_type_name&per_page=50`,{
          headers:{"x-auth-token":token,"x-client-id":QF_ID}
        });
        const d=await r.json();
        if(d.verses){
          // Group ALL words across all verses by line_number
          const lineMap={};
          d.verses.forEach(v=>{
            (v.words||[]).forEach(w=>{
              const ln=w.line_number||1;
              if(!lineMap[ln])lineMap[ln]=[];
              lineMap[ln].push({code:w.code_v2||"",page:w.v2_page||mushafPage,type:w.char_type_name||"word"});
            });
          });
          // Convert to sorted array of lines
          const sorted=Object.keys(lineMap).sort((a,b)=>+a-+b).map(k=>lineMap[k]);
          setMushafLines(sorted);
        }else throw new Error("No verses");
      }catch(e){console.log("Mushaf API:",e);setMushafLines(null)}
      setMushafLd(false);
    })();
  },[mushafPage,readMode]);
  
  // Surah to Mushaf page mapping (start page of each surah in Madani Mushaf)
  const SURAH_PAGES=[0,1,2,50,77,106,128,151,177,187,208,221,235,249,255,262,267,282,293,305,312,322,332,342,350,359,367,377,385,396,404,411,415,418,428,434,440,446,453,458,467,477,483,489,495,499,502,507,511,515,518,520,523,526,528,531,534,537,542,545,549,551,553,554,556,558,560,562,564,566,568,570,572,574,575,577,578,580,582,583,585,586,587,587,589,590,591,591,592,593,594,595,595,596,596,597,597,598,598,599,599,599,600,600,601,601,601,602,602,602,603,603,603,604,604];
  const [readSurahs,setReadSurahs]=useState(()=>{try{return JSON.parse(localStorage?.getItem?.("noor_read")||"[]")}catch{return[]}});
  const [aiQuery,setAiQuery]=useState("");const [aiResults,setAiResults]=useState(null);const [aiLd,setAiLd]=useState(false);
  const [showSplash,setShowSplash]=useState(true);
  const [splashPhase,setSplashPhase]=useState(0); // 0=bismillah, 1=dedication, 2=hadith, 3=fadeout

  // Splash sequence
  useEffect(()=>{
    if(!showSplash)return;
    const t1=setTimeout(()=>setSplashPhase(1),2200);
    const t2=setTimeout(()=>setSplashPhase(2),6500);
    const t3=setTimeout(()=>setSplashPhase(3),10000);
    const t4=setTimeout(()=>setShowSplash(false),11000);
    return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4)};
  },[showSplash]);

  useEffect(()=>{try{localStorage?.setItem?.("noor_bm",JSON.stringify(bm))}catch{}},[bm]);
  useEffect(()=>{try{localStorage?.setItem?.("noor_journal",JSON.stringify(journal))}catch{}},[journal]);
  useEffect(()=>{try{localStorage?.setItem?.("noor_read",JSON.stringify(readSurahs))}catch{}},[readSurahs]);

  // Daily ayah
  useEffect(()=>{(async()=>{try{const d=new Date().getDate();const vn=((d*7+42)%6236)+1;const r=await fetch(`${API}/ayah/${vn}/editions/quran-uthmani,en.sahih`);const data=await r.json();if(data.code===200&&data.data?.length>=2)setDaily({ar:data.data[0].text,tr:data.data[1].text,s:data.data[0].surah.englishName,v:data.data[0].numberInSurah,sn:data.data[0].surah.number})}catch{setDaily({ar:"بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",tr:"In the name of Allah, the Entirely Merciful, the Especially Merciful.",s:"Al-Fatihah",v:1,sn:1})}})()},[]);

  const [fetchErr,setFetchErr]=useState(false);

  // ── OFFLINE FALLBACK DATA for when API is blocked (sandbox/preview) ──
  const OFFLINE={
    1:[{num:1,ar:"بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",tl:"Bismillahir Rahmanir Raheem",tr:"In the name of Allah, the Entirely Merciful, the Especially Merciful.",gn:1,jz:1,pg:1},{num:2,ar:"ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",tl:"Alhamdu lillahi Rabbil 'aalameen",tr:"[All] praise is [due] to Allah, Lord of the worlds –",gn:2,jz:1,pg:1},{num:3,ar:"ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",tl:"Ar-Rahmanir-Raheem",tr:"The Entirely Merciful, the Especially Merciful,",gn:3,jz:1,pg:1},{num:4,ar:"مَـٰلِكِ يَوْمِ ٱلدِّينِ",tl:"Maaliki Yawmid-Deen",tr:"Sovereign of the Day of Recompense.",gn:4,jz:1,pg:1},{num:5,ar:"إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",tl:"Iyyaaka na'budu wa lyyaaka nasta'een",tr:"It is You we worship and You we ask for help.",gn:5,jz:1,pg:1},{num:6,ar:"ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",tl:"Ihdinas-Siraatal-Mustaqeem",tr:"Guide us to the straight path –",gn:6,jz:1,pg:1},{num:7,ar:"صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",tl:"Siraatal-lazeena an'amta 'alaihim ghayril-maghdoobi 'alaihim wa lad-daaalleen",tr:"The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray.",gn:7,jz:1,pg:1}],
    112:[{num:1,ar:"قُلْ هُوَ ٱللَّهُ أَحَدٌ",tl:"Qul huwal laahu ahad",tr:"Say, 'He is Allah, [who is] One,'",gn:6222,jz:30,pg:604},{num:2,ar:"ٱللَّهُ ٱلصَّمَدُ",tl:"Allahus-samad",tr:"Allah, the Eternal Refuge.",gn:6223,jz:30,pg:604},{num:3,ar:"لَمْ يَلِدْ وَلَمْ يُولَدْ",tl:"Lam yalid wa lam yoolad",tr:"He neither begets nor is born,",gn:6224,jz:30,pg:604},{num:4,ar:"وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ",tl:"Wa lam yakul-lahu kufuwan ahad",tr:"Nor is there to Him any equivalent.",gn:6225,jz:30,pg:604}],
    113:[{num:1,ar:"قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ",tl:"Qul a'udhu bi Rabbil-falaq",tr:"Say, 'I seek refuge in the Lord of daybreak'",gn:6226,jz:30,pg:604},{num:2,ar:"مِن شَرِّ مَا خَلَقَ",tl:"Min sharri ma khalaq",tr:"From the evil of that which He created",gn:6227,jz:30,pg:604},{num:3,ar:"وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",tl:"Wa min sharri ghasiqin idha waqab",tr:"And from the evil of darkness when it settles",gn:6228,jz:30,pg:604},{num:4,ar:"وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلْعُقَدِ",tl:"Wa min sharrin-naffaathaati fil 'uqad",tr:"And from the evil of the blowers in knots",gn:6229,jz:30,pg:604},{num:5,ar:"وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",tl:"Wa min sharri haasidin idha hasad",tr:"And from the evil of an envier when he envies.",gn:6230,jz:30,pg:604}],
    114:[{num:1,ar:"قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ",tl:"Qul a'udhu bi Rabbin-naas",tr:"Say, 'I seek refuge in the Lord of mankind,'",gn:6231,jz:30,pg:604},{num:2,ar:"مَلِكِ ٱلنَّاسِ",tl:"Malikin-naas",tr:"The Sovereign of mankind,",gn:6232,jz:30,pg:604},{num:3,ar:"إِلَـٰهِ ٱلنَّاسِ",tl:"Ilaahin-naas",tr:"The God of mankind,",gn:6233,jz:30,pg:604},{num:4,ar:"مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ",tl:"Min sharril waswaasil khannaas",tr:"From the evil of the retreating whisperer –",gn:6234,jz:30,pg:604},{num:5,ar:"ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ",tl:"Alladhee yuwaswisu fee sudoorin-naas",tr:"Who whispers in the breasts of mankind –",gn:6235,jz:30,pg:604},{num:6,ar:"مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ",tl:"Minal jinnati wannaas",tr:"From among the jinn and mankind.",gn:6236,jz:30,pg:604}],
    103:[{num:1,ar:"وَٱلْعَصْرِ",tl:"Wal-'asr",tr:"By time,",gn:6205,jz:30,pg:601},{num:2,ar:"إِنَّ ٱلْإِنسَـٰنَ لَفِى خُسْرٍ",tl:"Innal-insaana lafee khusr",tr:"Indeed, mankind is in loss,",gn:6206,jz:30,pg:601},{num:3,ar:"إِلَّا ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّـٰلِحَـٰتِ وَتَوَاصَوْا۟ بِٱلْحَقِّ وَتَوَاصَوْا۟ بِٱلصَّبْرِ",tl:"Illal-lazeena aamanoo wa 'amilus-saalihaati wa tawaassaw bilhaqqi wa tawaassaw bis-sabr",tr:"Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.",gn:6207,jz:30,pg:601}],
    108:[{num:1,ar:"إِنَّآ أَعْطَيْنَـٰكَ ٱلْكَوْثَرَ",tl:"Innaa a'taynakal kawthar",tr:"Indeed, We have granted you al-Kawthar.",gn:6216,jz:30,pg:602},{num:2,ar:"فَصَلِّ لِرَبِّكَ وَٱنْحَرْ",tl:"Fasalli li Rabbika wanhar",tr:"So pray to your Lord and sacrifice [to Him alone].",gn:6217,jz:30,pg:602},{num:3,ar:"إِنَّ شَانِئَكَ هُوَ ٱلْأَبْتَرُ",tl:"Inna shaani'aka huwal abtar",tr:"Indeed, your enemy is the one cut off.",gn:6218,jz:30,pg:602}],
    110:[{num:1,ar:"إِذَا جَآءَ نَصْرُ ٱللَّهِ وَٱلْفَتْحُ",tl:"Idha jaa'a nasrullahi wal-fath",tr:"When the victory of Allah has come and the conquest,",gn:6219,jz:30,pg:603},{num:2,ar:"وَرَأَيْتَ ٱلنَّاسَ يَدْخُلُونَ فِى دِينِ ٱللَّهِ أَفْوَاجًۭا",tl:"Wa ra-aytan naasa yadkhuloona fee deenil laahi afwaaja",tr:"And you see the people entering into the religion of Allah in multitudes,",gn:6220,jz:30,pg:603},{num:3,ar:"فَسَبِّحْ بِحَمْدِ رَبِّكَ وَٱسْتَغْفِرْهُ إِنَّهُۥ كَانَ تَوَّابًۢا",tl:"Fasabbih bihamdi Rabbika wastaghfirh innahu kaana tawwaaba",tr:"Then exalt [Him] with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance.",gn:6221,jz:30,pg:603}],
    109:[{num:1,ar:"قُلْ يَـٰٓأَيُّهَا ٱلْكَـٰفِرُونَ",tl:"Qul yaa ayyuhal kaafiroon",tr:"Say, 'O disbelievers,'",gn:6210,jz:30,pg:603},{num:2,ar:"لَآ أَعْبُدُ مَا تَعْبُدُونَ",tl:"Laa a'budu ma ta'budoon",tr:"I do not worship what you worship.",gn:6211,jz:30,pg:603},{num:3,ar:"وَلَآ أَنتُمْ عَـٰبِدُونَ مَآ أَعْبُدُ",tl:"Wa laa antum 'aabidoona maa a'bud",tr:"Nor are you worshippers of what I worship.",gn:6212,jz:30,pg:603},{num:4,ar:"وَلَآ أَنَا۠ عَابِدٌۭ مَّا عَبَدتُّمْ",tl:"Wa laa ana 'abidum ma 'abadtum",tr:"Nor will I be a worshipper of what you worship.",gn:6213,jz:30,pg:603},{num:5,ar:"وَلَآ أَنتُمْ عَـٰبِدُونَ مَآ أَعْبُدُ",tl:"Wa laa antum 'aabidoona maa a'bud",tr:"Nor will you be worshippers of what I worship.",gn:6214,jz:30,pg:603},{num:6,ar:"لَكُمْ دِينُكُمْ وَلِىَ دِينِ",tl:"Lakum deenukum waliya deen",tr:"For you is your religion, and for me is my religion.",gn:6215,jz:30,pg:603}],
    36:[{num:1,ar:"يسٓ",tl:"Yaa-Seeen",tr:"Ya, Sin.",gn:3462,jz:22,pg:440},{num:2,ar:"وَٱلْقُرْءَانِ ٱلْحَكِيمِ",tl:"Wal-Qur-aanil-Hakeem",tr:"By the wise Quran.",gn:3463,jz:22,pg:440},{num:3,ar:"إِنَّكَ لَمِنَ ٱلْمُرْسَلِينَ",tl:"Innaka laminal mursaleen",tr:"Indeed you, [O Muhammad], are from among the messengers,",gn:3464,jz:22,pg:440},{num:4,ar:"عَلَىٰ صِرَٰطٍۢ مُّسْتَقِيمٍۢ",tl:"'Alaa siraatim mustaqeem",tr:"On a straight path.",gn:3465,jz:22,pg:440},{num:5,ar:"تَنزِيلَ ٱلْعَزِيزِ ٱلرَّحِيمِ",tl:"Tanzeelal 'Azeezir-Raheem",tr:"[This is] a revelation of the Exalted in Might, the Merciful,",gn:3466,jz:22,pg:440}],
    67:[{num:1,ar:"تَبَـٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌ",tl:"Tabaarakal lazee biyadihil mulku wa huwa 'alaa kulli shai-in qadeer",tr:"Blessed is He in whose hand is dominion, and He is over all things competent –",gn:5242,jz:29,pg:562},{num:2,ar:"ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًۭا وَهُوَ ٱلْعَزِيزُ ٱلْغَفُورُ",tl:"Allazee khalaqal mawta wal hayaata liyabluwakum ayyukum ahsanu 'amalaa wa huwal 'Azeezul Ghafoor",tr:"[He] who created death and life to test you [as to] which of you is best in deed – and He is the Exalted in Might, the Forgiving –",gn:5243,jz:29,pg:562}],
    55:[{num:1,ar:"ٱلرَّحْمَـٰنُ",tl:"Ar-Rahmaan",tr:"The Most Merciful",gn:5093,jz:27,pg:531},{num:2,ar:"عَلَّمَ ٱلْقُرْءَانَ",tl:"'Allamal-Qur-aan",tr:"Taught the Quran,",gn:5094,jz:27,pg:531},{num:3,ar:"خَلَقَ ٱلْإِنسَـٰنَ",tl:"Khalaqal-insaan",tr:"Created man,",gn:5095,jz:27,pg:531},{num:4,ar:"عَلَّمَهُ ٱلْبَيَانَ",tl:"'Allamahul-bayaan",tr:"[And] taught him eloquence.",gn:5096,jz:27,pg:531},{num:5,ar:"ٱلشَّمْسُ وَٱلْقَمَرُ بِحُسْبَانٍۢ",tl:"Ash-shamsu wal qamaru bi husbaan",tr:"The sun and the moon [move] by precise calculation,",gn:5097,jz:27,pg:531}],
    97:[{num:1,ar:"إِنَّآ أَنزَلْنَـٰهُ فِى لَيْلَةِ ٱلْقَدْرِ",tl:"Innaa anzalnaahu fee lailatil qadr",tr:"Indeed, We sent it [the Quran] down during the Night of Decree.",gn:6188,jz:30,pg:598},{num:2,ar:"وَمَآ أَدْرَىٰكَ مَا لَيْلَةُ ٱلْقَدْرِ",tl:"Wa maa adraaka ma lailatul qadr",tr:"And what can make you know what the Night of Decree is?",gn:6189,jz:30,pg:598},{num:3,ar:"لَيْلَةُ ٱلْقَدْرِ خَيْرٌۭ مِّنْ أَلْفِ شَهْرٍۢ",tl:"Lailatul qadri khairum min alfi shahr",tr:"The Night of Decree is better than a thousand months.",gn:6190,jz:30,pg:598},{num:4,ar:"تَنَزَّلُ ٱلْمَلَـٰٓئِكَةُ وَٱلرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍۢ",tl:"Tanazzalul malaa-ikatu war-Roohu feeha bi-idhni Rabbihim min kulli amr",tr:"The angels and the Spirit descend therein by permission of their Lord for every matter.",gn:6191,jz:30,pg:598},{num:5,ar:"سَلَـٰمٌ هِىَ حَتَّىٰ مَطْلَعِ ٱلْفَجْرِ",tl:"Salaamun hiya hattaa matla'il fajr",tr:"Peace it is until the emergence of dawn.",gn:6192,jz:30,pg:598}],
    102:[{num:1,ar:"أَلْهَىٰكُمُ ٱلتَّكَاثُرُ",tl:"Alhaakumut-takaathur",tr:"Competition in [worldly] increase diverts you",gn:6198,jz:30,pg:600},{num:2,ar:"حَتَّىٰ زُرْتُمُ ٱلْمَقَابِرَ",tl:"Hattaa zurtumul-maqaabir",tr:"Until you visit the graveyards.",gn:6199,jz:30,pg:600},{num:3,ar:"كَلَّا سَوْفَ تَعْلَمُونَ",tl:"Kalla sawfa ta'lamoon",tr:"No! You are going to know.",gn:6200,jz:30,pg:600},{num:4,ar:"ثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ",tl:"Thumma kalla sawfa ta'lamoon",tr:"Then no! You are going to know.",gn:6201,jz:30,pg:600},{num:5,ar:"كَلَّا لَوْ تَعْلَمُونَ عِلْمَ ٱلْيَقِينِ",tl:"Kalla law ta'lamoona 'ilmal yaqeen",tr:"No! If you only knew with knowledge of certainty...",gn:6202,jz:30,pg:600},{num:6,ar:"لَتَرَوُنَّ ٱلْجَحِيمَ",tl:"Latarawunnal jaheem",tr:"You will surely see the Hellfire.",gn:6203,jz:30,pg:600},{num:7,ar:"ثُمَّ لَتَرَوُنَّهَا عَيْنَ ٱلْيَقِينِ",tl:"Thumma latarawunnaha 'ainal yaqeen",tr:"Then you will surely see it with the eye of certainty.",gn:6203,jz:30,pg:600},{num:8,ar:"ثُمَّ لَتُسْـَٔلُنَّ يَوْمَئِذٍ عَنِ ٱلنَّعِيمِ",tl:"Thumma latus-alunna yawma-idhin 'anin-na'eem",tr:"Then you will surely be asked that Day about pleasure.",gn:6204,jz:30,pg:600}],
    104:[{num:1,ar:"وَيْلٌۭ لِّكُلِّ هُمَزَةٍۢ لُّمَزَةٍ",tl:"Waylul-likulli humazatil-lumaza",tr:"Woe to every scorner and mocker",gn:6208,jz:30,pg:601},{num:2,ar:"ٱلَّذِى جَمَعَ مَالًۭا وَعَدَّدَهُۥ",tl:"Allazee jama'a maalan wa 'addadah",tr:"Who collects wealth and [continuously] counts it.",gn:6209,jz:30,pg:601},{num:3,ar:"يَحْسَبُ أَنَّ مَالَهُۥٓ أَخْلَدَهُۥ",tl:"Yahsabu anna maalahu akhladah",tr:"He thinks that his wealth will make him immortal.",gn:6209,jz:30,pg:601},{num:4,ar:"كَلَّا لَيُنۢبَذَنَّ فِى ٱلْحُطَمَةِ",tl:"Kalla la-yunbadhanna fil hutamah",tr:"No! He will surely be thrown into the Crusher.",gn:6209,jz:30,pg:601},{num:5,ar:"وَمَآ أَدْرَىٰكَ مَا ٱلْحُطَمَةُ",tl:"Wa maa adraaka mal hutamah",tr:"And what can make you know what the Crusher is?",gn:6209,jz:30,pg:601},{num:6,ar:"نَارُ ٱللَّهِ ٱلْمُوقَدَةُ",tl:"Naarul laahil-mooqadah",tr:"It is the fire of Allah, [eternally] fueled,",gn:6209,jz:30,pg:601},{num:7,ar:"ٱلَّتِى تَطَّلِعُ عَلَى ٱلْأَفْـِٔدَةِ",tl:"Allatee tattali'u 'alal af'idah",tr:"Which mounts directed at the hearts.",gn:6209,jz:30,pg:601},{num:8,ar:"إِنَّهَا عَلَيْهِم مُّؤْصَدَةٌۭ",tl:"Innaha 'alaihim mu'sadah",tr:"Indeed, it [i.e., Hellfire] will be closed down upon them",gn:6209,jz:30,pg:601},{num:9,ar:"فِى عَمَدٍۢ مُّمَدَّدَةٍۭ",tl:"Fee 'amadim mumaddadah",tr:"In extended columns.",gn:6209,jz:30,pg:601}],
    105:[{num:1,ar:"أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَـٰبِ ٱلْفِيلِ",tl:"Alam tara kaifa fa'ala Rabbuka bi-ashaabil feel",tr:"Have you not considered how your Lord dealt with the companions of the elephant?",gn:6210,jz:30,pg:601},{num:2,ar:"أَلَمْ يَجْعَلْ كَيْدَهُمْ فِى تَضْلِيلٍۢ",tl:"Alam yaj'al kaidahum fee tadleel",tr:"Did He not make their plan into misguidance?",gn:6211,jz:30,pg:601},{num:3,ar:"وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ",tl:"Wa arsala 'alaihim tairan abaabeel",tr:"And He sent against them birds in flocks,",gn:6212,jz:30,pg:601},{num:4,ar:"تَرْمِيهِم بِحِجَارَةٍۢ مِّن سِجِّيلٍۢ",tl:"Tarmeehim bihijaaratim min sijjeel",tr:"Striking them with stones of hard clay,",gn:6213,jz:30,pg:601},{num:5,ar:"فَجَعَلَهُمْ كَعَصْفٍۢ مَّأْكُولٍۭ",tl:"Faja'alahum ka'asfim ma'kool",tr:"And He made them like eaten straw.",gn:6214,jz:30,pg:601}],
    106:[{num:1,ar:"لِإِيلَـٰفِ قُرَيْشٍ",tl:"Li-eelaafi Quraish",tr:"For the accustomed security of the Quraysh –",gn:6215,jz:30,pg:602},{num:2,ar:"إِۦلَـٰفِهِمْ رِحْلَةَ ٱلشِّتَآءِ وَٱلصَّيْفِ",tl:"Elaafihim rihlatash-shitaa-i was-saif",tr:"Their accustomed security [in] the caravan of winter and summer –",gn:6215,jz:30,pg:602},{num:3,ar:"فَلْيَعْبُدُوا۟ رَبَّ هَـٰذَا ٱلْبَيْتِ",tl:"Fal ya'budoo Rabba haadhal-bait",tr:"Let them worship the Lord of this House,",gn:6215,jz:30,pg:602},{num:4,ar:"ٱلَّذِىٓ أَطْعَمَهُم مِّن جُوعٍۢ وَءَامَنَهُم مِّنْ خَوْفٍۭ",tl:"Alladhee at'amahum min joo'in wa aamanahum min khawf",tr:"Who has fed them, [saving them] from hunger and made them safe, [saving them] from fear.",gn:6215,jz:30,pg:602}],
    107:[{num:1,ar:"أَرَءَيْتَ ٱلَّذِى يُكَذِّبُ بِٱلدِّينِ",tl:"Ara-aytal ladhee yukadhdhibu bid-deen",tr:"Have you seen the one who denies the Recompense?",gn:6216,jz:30,pg:602},{num:2,ar:"فَذَٰلِكَ ٱلَّذِى يَدُعُّ ٱلْيَتِيمَ",tl:"Fa-dhaalikal ladhee yadu''ul yateem",tr:"For that is the one who drives away the orphan",gn:6216,jz:30,pg:602},{num:3,ar:"وَلَا يَحُضُّ عَلَىٰ طَعَامِ ٱلْمِسْكِينِ",tl:"Wa laa yahuddu 'alaa ta'aamil miskeen",tr:"And does not encourage the feeding of the poor.",gn:6216,jz:30,pg:602},{num:4,ar:"فَوَيْلٌۭ لِّلْمُصَلِّينَ",tl:"Fa wailul-lil musalleen",tr:"So woe to those who pray",gn:6216,jz:30,pg:602},{num:5,ar:"ٱلَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ",tl:"Alladhina hum 'an salaatihim saahoon",tr:"[But] who are heedless of their prayer –",gn:6216,jz:30,pg:602},{num:6,ar:"ٱلَّذِينَ هُمْ يُرَآءُونَ",tl:"Alladheena hum yuraa-oon",tr:"Those who make show [of their deeds]",gn:6216,jz:30,pg:602},{num:7,ar:"وَيَمْنَعُونَ ٱلْمَاعُونَ",tl:"Wa yamna'oonal maa'oon",tr:"And withhold [simple] assistance.",gn:6216,jz:30,pg:602}],
    111:[{num:1,ar:"تَبَّتْ يَدَآ أَبِى لَهَبٍۢ وَتَبَّ",tl:"Tabbat yadaa abee Lahabin wa tabb",tr:"May the hands of Abu Lahab be ruined, and ruined is he.",gn:6219,jz:30,pg:603},{num:2,ar:"مَآ أَغْنَىٰ عَنْهُ مَالُهُۥ وَمَا كَسَبَ",tl:"Maa aghnaa 'anhu maaluhu wa ma kasab",tr:"His wealth will not avail him or that which he gained.",gn:6220,jz:30,pg:603},{num:3,ar:"سَيَصْلَىٰ نَارًۭا ذَاتَ لَهَبٍۢ",tl:"Sa-yaslaa naaran dhaata lahab",tr:"He will [enter to] burn in a Fire of [blazing] flame",gn:6221,jz:30,pg:603},{num:4,ar:"وَٱمْرَأَتُهُۥ حَمَّالَةَ ٱلْحَطَبِ",tl:"Wam-ra-atuhu hammaalatal hatab",tr:"And his wife [as well] – the carrier of firewood.",gn:6221,jz:30,pg:603},{num:5,ar:"فِى جِيدِهَا حَبْلٌۭ مِّن مَّسَدٍۭ",tl:"Fee jeedihaa hablum mim-masad",tr:"Around her neck is a rope of [twisted] fiber.",gn:6221,jz:30,pg:603}],
    2:[{num:1,ar:"الٓمٓ",tl:"Alif-Laam-Meem",tr:"Alif, Lam, Mim.",gn:8,jz:1,pg:2},{num:2,ar:"ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ فِيهِ هُدًۭى لِّلْمُتَّقِينَ",tl:"Dhaalikal Kitaabu laa raiba feeh; hudal lilmuttaqeen",tr:"This is the Book about which there is no doubt, a guidance for those conscious of Allah –",gn:9,jz:1,pg:2},{num:3,ar:"ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقْنَـٰهُمْ يُنفِقُونَ",tl:"Allazeena yu'minoona bilghaibi wa yuqeemoonas-salaata wa mimmaa razaqnaahum yunfiqoon",tr:"Who believe in the unseen, establish prayer, and spend out of what We have provided for them,",gn:10,jz:1,pg:2},{num:4,ar:"وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ وَمَآ أُنزِلَ مِن قَبْلِكَ وَبِٱلْـَٔاخِرَةِ هُمْ يُوقِنُونَ",tl:"Wallazeena yu'minoona bimaa unzila ilaika wa maa unzila min qablika wa bil-aakhirati hum yooqinoon",tr:"And who believe in what has been revealed to you, [O Muhammad], and what was revealed before you, and of the Hereafter they are certain [in faith].",gn:11,jz:1,pg:2},{num:5,ar:"أُو۟لَـٰٓئِكَ عَلَىٰ هُدًۭى مِّن رَّبِّهِمْ وَأُو۟لَـٰٓئِكَ هُمُ ٱلْمُفْلِحُونَ",tl:"Ulaa-ika 'alaa hudam mir-Rabbihim wa ulaa-ika humul muflihoon",tr:"Those are upon [right] guidance from their Lord, and it is those who are the successful.",gn:12,jz:1,pg:2}],
  };

  const openSurah=async(s)=>{setLd(true);setFetchErr(false);setVrs([]);setTrVrs([]);setTrVrs2([]);setSurah(s);setTab("read");setShowTaf({});setMushafPage(SURAH_PAGES[s.n]||1);window.scrollTo(0,0);
    try{
      const[ar,tr]=await Promise.all([fetch(`${API}/surah/${s.n}/editions/quran-uthmani,en.transliteration`),fetch(`${API}/surah/${s.n}/${lang.id}`)]);
      const ad=await ar.json(),td=await tr.json();
      if(ad.code===200){const a=ad.data[0]?.ayahs||[],tl=ad.data[1]?.ayahs||[];setVrs(a.map((x,i)=>({num:x.numberInSurah,ar:x.text,tl:tl[i]?.text||"",gn:x.number,jz:x.juz,pg:x.page,sj:x.sajda})));if(td.code===200)setTrVrs(td.data?.ayahs||[])}
      else throw new Error("API error");
      if(lang2){const t2=await fetch(`${API}/surah/${s.n}/${lang2.id}`);const d2=await t2.json();if(d2.code===200)setTrVrs2(d2.data?.ayahs||[])}
    }catch(e){
      // Use offline fallback if available
      if(OFFLINE[s.n]){
        setVrs(OFFLINE[s.n]);
        setTrVrs(OFFLINE[s.n].map(v=>({text:v.tr})));
        setFetchErr(false);
      }else{setFetchErr(true)}
    }
    if(!readSurahs.includes(s.n))setReadSurahs(p=>[...p,s.n]);
    setLd(false);
  };
  useEffect(()=>{if(!surah)return;(async()=>{try{const r=await fetch(`${API}/surah/${surah.n}/${lang.id}`);const d=await r.json();if(d.code===200)setTrVrs(d.data?.ayahs||[])}catch{}})()},[lang]);
  useEffect(()=>{if(!surah||!lang2){setTrVrs2([]);return}(async()=>{try{const r=await fetch(`${API}/surah/${surah.n}/${lang2.id}`);const d=await r.json();if(d.code===200)setTrVrs2(d.data?.ayahs||[])}catch{}})()},[lang2]);

  useEffect(()=>{if(!audio)return;const t=()=>{setProg(audio.currentTime);setDur(audio.duration||0)};const e=()=>{setPlaying(null);setProg(0)};audio.addEventListener("timeupdate",t);audio.addEventListener("ended",e);return()=>{audio.removeEventListener("timeupdate",t);audio.removeEventListener("ended",e)}},[audio]);
  const playV=(v,cr)=>{if(!audio)return;const r=cr||rec.id;const k=`${surah?.n||0}:${v.num}`;if(playing===k){audio.pause();setPlaying(null);return}audio.src=audioSrc(r,v.gn);audio.play().catch(()=>{});setPlaying(k)};
  const stopA=()=>{if(audio){audio.pause();audio.currentTime=0}setPlaying(null);setProg(0)};

  const loadMood=async(mood)=>{setMoodMode(mood);setMoodLd(true);setMoodVerses([]);setTab("mood");try{const ps=MOODS[mood].verses.map(v=>fetch(`${API}/ayah/${v}/editions/quran-uthmani,en.sahih`).then(r=>r.json()));const rs=await Promise.all(ps);setMoodVerses(rs.filter(r=>r.code===200).map(r=>({ar:r.data[0].text,tr:r.data[1].text,ref:`${r.data[0].surah.englishName} ${r.data[0].numberInSurah}`,gn:r.data[0].number,num:r.data[0].numberInSurah})))}catch{}setMoodLd(false)};

  const aiExplore=async()=>{if(!aiQuery.trim())return;setAiLd(true);setAiResults(null);try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:'You are a Quran verse finder. Return ONLY a JSON array: [{"surah":number,"ayah":number,"text":"brief translation","relevance":"why relevant"}]. 6-8 verses. No markdown.',messages:[{role:"user",content:`Find Quran verses about: ${aiQuery}`}]})});const d=await r.json();const tx=d.content?.[0]?.text||"";setAiResults(JSON.parse(tx.replace(/```json|```/g,"").trim()))}catch{setAiResults([{surah:2,ayah:286,text:"Allah does not burden a soul beyond what it can bear",relevance:"Comfort in difficulty"},{surah:94,ayah:5,text:"For indeed, with hardship will be ease",relevance:"Promise of relief after struggle"},{surah:3,ayah:139,text:"Do not weaken and do not grieve, for you are superior if you are believers",relevance:"Strength through faith"},{surah:13,ayah:28,text:"Verily, in the remembrance of Allah do hearts find rest",relevance:"Peace through dhikr"},{surah:65,ayah:3,text:"Whoever relies upon Allah, He is sufficient for him",relevance:"Trust in Allah's plan"},{surah:39,ayah:53,text:"Do not despair of the mercy of Allah",relevance:"Allah's mercy encompasses all"},{surah:2,ayah:155,text:"We will surely test you with fear, hunger, and loss of wealth and lives and fruits",relevance:"Tests are part of life"},{surah:29,ayah:69,text:"Those who strive for Us, We will surely guide them to Our ways",relevance:"Effort brings guidance"}])}setAiLd(false)};

  useEffect(()=>{chatRef.current?.scrollIntoView({behavior:"smooth"})},[msgs]);
  const sendChat=async()=>{if(!chatIn.trim())return;const m=chatIn.trim();setChatIn("");setChatLd(true);setMsgs(p=>[...p,{t:"u",x:m}]);let res=null;try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:"You are an Islamic scholar assistant named Noor. ONLY answer about Islam, Quran, Hadith, Fiqh, Seerah, Islamic history, and Muslim practices. Cite Quran ayah numbers and Hadith (Sahih Bukhari/Muslim). If the question is not about Islam, politely say you only cover Islamic topics. Use **bold** for key terms. Be warm, accurate, and cite authentic Sunni sources. End with 📖 and the source reference.",messages:[{role:"user",content:m}]})});const d=await r.json();if(d.content?.[0]?.text)res=d.content[0].text}catch{}
    if(!res){const lo=m.toLowerCase();for(const[kw,key]of Object.entries(CHAT_KEYS)){if(lo.includes(kw)){res=KB[key];break}}
    if(!res){
      const islamTerms=["islam","allah","quran","hadith","sunnah","prophet","mosque","masjid","salah","prayer","zakat","hajj","ramadan","eid","jannah","jahannam","angel","jinn","sharia","fiqh","tawhid","hijab","wudu","nikah","halal","haram","fard","dua","dhikr","surah","juz","tajweed","iman","tawbah","sabr","taqwa","seerah","sahabah","ummah","dawah","imam","sheikh","mufti","fatwa","ayah","verse","recit","memor","hifz","arabic","muslim","mosque","mecca","medina","kabah","arafat","umrah","quraysh","companion","khilaf","caliph","sunni","hanafi","shafi","maliki","hanbali","bukhari","muslim","tirmidhi","ibn","tafsir","scholar"];
      const isIslamic=islamTerms.some(t=>lo.includes(t));
      if(isIslamic){res="That\u2019s a wonderful question about Islam! While I have detailed answers on many topics (try tapping the topic buttons above), for this specific question I\u2019d recommend:\n\n\uD83D\uDCDA **Authentic Sources:**\n\u2022 Sahih Al-Bukhari & Sahih Muslim\n\u2022 Tafsir Ibn Kathir\n\u2022 Riyad us-Saliheen\n\n\uD83D\uDC68\u200D\uD83C\uDFEB Or consult a qualified **Islamic scholar** in your area.\n\nAsk me about: Five Pillars, Prayer, Quran, Prophets, Ramadan, Hajj, Wudu, Zakat, Du\u2019as, Jannah, Marriage, Tawhid, Hijab, Halal/Haram, and more! \uD83C\uDF19"}
      else{res="Assalamu Alaikum! \uD83C\uDF19 I\u2019m **Noor**, your Islamic knowledge assistant.\n\nI answer questions about **Islam, the Quran, Hadith, and Islamic teachings** from authentic sources.\n\n**Topics I cover:**\n\u2022 Quran \u2014 Surahs, meanings, Tafsir\n\u2022 Hadith \u2014 Sahih collections\n\u2022 Five Pillars \u2014 Shahādah, Prayer, Zakat, Fasting, Hajj\n\u2022 Faith \u2014 Six Articles of Iman\n\u2022 Prophets \u2014 All 25 named in the Quran\n\u2022 Daily Life \u2014 Du\u2019as, Wudu, Halal/Haram, Marriage\n\u2022 History \u2014 Seerah of Prophet Muhammad \uFDFA\n\u2022 Beliefs \u2014 Tawhid, Angels, Jannah, Day of Judgment\n\nTap any topic button above or ask me anything! \uD83D\uDCDA"}
    }}setChatLd(false);setMsgs(p=>[...p,{t:"b",x:res}])};

  const saveNote=(key)=>{if(noteText.trim())setJournal(p=>({...p,[key]:noteText.trim()}));else{const j={...journal};delete j[key];setJournal(j)}setEditingNote(null);setNoteText("")};

  const filtered=useMemo(()=>SU.filter(s=>{const lo=q.toLowerCase();return(!lo||s.a.includes(q)||s.e.toLowerCase().includes(lo)||s.m.toLowerCase().includes(lo)||String(s.n)===lo)&&(filter==="all"||(filter==="mk"&&s.t==="M")||(filter==="md"&&s.t==="D"))&&(!juz||s.j===juz)}),[q,filter,juz]);
  const kPct=Math.round((readSurahs.length/114)*100);

  // Shared style helpers
  const btn=(on)=>({display:"inline-flex",alignItems:"center",gap:4,padding:"5px 11px",borderRadius:7,border:`1px solid ${on?T.em:T.bd}`,background:on?(isDark?T.ed:T.ed):T.bg2,color:on?T.gl:T.tx3,fontSize:10.5,fontFamily:"'Manrope'",cursor:"pointer",fontWeight:500,transition:"all .2s"});
  const crd={padding:18,background:T.cardBg,border:`1px solid ${T.bd}`,borderRadius:13};
  const sel={padding:"5px 8px",background:T.bg2,border:`1px solid ${T.bd}`,borderRadius:6,color:T.tx,fontFamily:"'Manrope'",fontSize:11,outline:"none",cursor:"pointer"};

  return(
  <div style={{fontFamily:"'Manrope',sans-serif",minHeight:"100vh",background:T.bg,color:T.tx,overflowX:"hidden",width:"100%",transition:"background .5s,color .5s"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Noto+Naskh+Arabic:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Manrope:wght@300;400;500;600;700;800&display=swap');
    @font-face{font-family:'UthmanicHafs';src:url('https://verses.quran.foundation/fonts/quran/hafs/uthmanic_hafs/UthmanicHafs1Ver18.woff2') format('woff2');font-display:swap}
    *{margin:0;padding:0;box-sizing:border-box}html,body{overflow-x:hidden}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${T.bd};border-radius:2px}
    nav::-webkit-scrollbar{display:none}nav{scrollbar-width:none}
    .fi{animation:fi .4s ease}@keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}@keyframes spin{to{transform:rotate(360deg)}}
    @keyframes splashIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes splashGlow{0%,100%{text-shadow:0 0 20px rgba(196,164,72,.2)}50%{text-shadow:0 0 40px rgba(196,164,72,.5)}}
    @keyframes splashFade{from{opacity:1}to{opacity:0}}
    @keyframes starTwinkle{0%,100%{opacity:.2}50%{opacity:.8}}
    @keyframes lineDraw{from{width:0}to{width:60px}}
    input::placeholder,textarea::placeholder{color:${T.tx3}}`}</style>

    {/* ═══ SPLASH SCREEN ═══ */}
    {showSplash&&<div style={{
      position:"fixed",inset:0,zIndex:9999,
      background:"linear-gradient(180deg,#020810 0%,#0A1628 40%,#0D1F2D 70%,#091118 100%)",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      padding:"40px 30px",textAlign:"center",
      animation:splashPhase===3?"splashFade 1s ease forwards":"none",
      overflow:"hidden"
    }}>
      {/* Subtle stars background */}
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        {Array.from({length:30}).map((_,i)=><div key={i} style={{
          position:"absolute",width:i%3===0?2:1,height:i%3===0?2:1,
          background:"#C4A448",borderRadius:"50%",
          left:`${(i*37+13)%100}%`,top:`${(i*23+7)%100}%`,
          opacity:.15+Math.random()*.3,
          animation:`starTwinkle ${3+Math.random()*4}s ease infinite ${Math.random()*3}s`
        }}/>)}
      </div>

      {/* Phase 0: Bismillah */}
      <div style={{
        opacity:splashPhase===0?1:0,
        transform:splashPhase===0?"translateY(0)":"translateY(-20px)",
        transition:"all 1s ease",
        position:splashPhase===0?"relative":"absolute",
      }}>
        <div style={{fontFamily:"'Amiri Quran',serif",fontSize:"clamp(26px,7vw,42px)",color:"#C4A448",
          lineHeight:1.8,animation:"splashIn 1.5s ease,splashGlow 3s ease infinite",marginBottom:16}}>
          بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
        </div>
        <div style={{width:0,height:1,background:"linear-gradient(90deg,transparent,#C4A448,transparent)",
          margin:"0 auto",animation:"lineDraw 2s ease forwards",animationDelay:".5s"}}/>
      </div>

      {/* Phase 1: Dedication */}
      <div style={{
        opacity:splashPhase===1?1:0,
        transform:splashPhase===1?"translateY(0)":"translateY(20px)",
        transition:"all 1s ease",
        position:splashPhase===1?"relative":"absolute",
        maxWidth:500,
      }}>
        <div style={{fontFamily:"'Amiri Quran',serif",fontSize:16,color:"#C4A44880",
          marginBottom:16,letterSpacing:2}}>
          إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ
        </div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:"#B8B0A0",
          lineHeight:1.9,animation:splashPhase===1?"splashIn 1.2s ease":"none"}}>
          This app is built as a <span style={{color:"#C4A448",fontWeight:600}}>sadaqah jariyah</span> in loving memory of
        </div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,5vw,32px)",
          color:"#C4A448",fontWeight:700,margin:"14px 0",letterSpacing:1,
          animation:splashPhase===1?"splashIn 1.5s ease":"none"}}>
          Sarwat Baig
        </div>
        <div style={{fontFamily:"'Amiri Quran',serif",fontSize:14,color:"#C4A44880"}}>
          رحمه الله
        </div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:12.5,color:"#8090A0",
          marginTop:14,lineHeight:1.8,fontStyle:"italic"}}>
          Every ayah read, every heart healed, every word memorized through this app — may the reward reach him
        </div>
      </div>

      {/* Phase 2: Hadith */}
      <div style={{
        opacity:splashPhase===2?1:0,
        transform:splashPhase===2?"translateY(0)":"translateY(20px)",
        transition:"all 1s ease",
        position:splashPhase===2?"relative":"absolute",
        maxWidth:480,
      }}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:"#B8B0A0",
          lineHeight:2,fontStyle:"italic",animation:splashPhase===2?"splashIn 1.2s ease":"none"}}>
          "When a person dies, their deeds come to an end except for three: ongoing charity, beneficial knowledge, or a righteous child who prays for them."
        </div>
        <div style={{width:40,height:1,background:"#C4A448",margin:"18px auto",opacity:.4}}/>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:12,color:"#C4A448",fontWeight:600,letterSpacing:1}}>
          Prophet Muhammad ﷺ
        </div>
        <div style={{fontFamily:"'Manrope',sans-serif",fontSize:10,color:"#607080",marginTop:4}}>
          Sahih Muslim 1631
        </div>
      </div>

      {/* Skip button */}
      <button onClick={()=>{setSplashPhase(3);setTimeout(()=>setShowSplash(false),600)}}
        style={{position:"absolute",bottom:40,padding:"8px 20px",borderRadius:20,
          border:"1px solid rgba(196,164,72,.2)",background:"transparent",
          color:"#607080",fontFamily:"'Manrope'",fontSize:10,cursor:"pointer",
          letterSpacing:1,textTransform:"uppercase",transition:"all .3s"}}>
        Enter App
      </button>
    </div>}

    {/* ── HEADER ── */}
    <header style={{position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)",background:T.hdr,borderBottom:`1px solid ${T.bd}`,padding:"0 12px"}}>
      <div style={{maxWidth:1400,margin:"0 auto",display:"flex",alignItems:"center",height:50,gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",flexShrink:0}} onClick={()=>{setTab("home");setSurah(null);stopA();setMoodMode(null)}}>
          <div style={{width:32,height:32,background:`linear-gradient(135deg,${DARK.ed},${DARK.gd})`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:DARK.gl,flexShrink:0}}>{IC.moon}</div>
          <div style={{fontFamily:"'Amiri Quran',serif",fontSize:17,color:T.g,lineHeight:1}}>نُــور</div>
        </div>

        <nav style={{display:"flex",gap:1,background:T.bg2,padding:2,borderRadius:9,border:`1px solid ${T.bd}`,flex:1,minWidth:0,overflowX:"auto",WebkitOverflowScrolling:"touch",scrollbarWidth:"none"}}>
          {[{id:"home",l:"Home",i:IC.compass},{id:"explore",l:"Explore",i:IC.sparkle},{id:"mood",l:"Heal",i:IC.heart},{id:"hifz",l:"Hifz",i:IC.brain},{id:"chat",l:"Ask",i:IC.chat}].map(x=>(
            <button key={x.id} onClick={()=>{setTab(x.id);if(x.id==="home"){setSurah(null);stopA();setMoodMode(null)}if(x.id==="chat"||x.id==="explore"||x.id==="hifz"){setSurah(null);stopA()}}}
              style={{display:"flex",alignItems:"center",gap:3,padding:"5px 8px",borderRadius:7,border:"none",
                background:tab===x.id?`linear-gradient(135deg,${DARK.ed},${DARK.em})`:"transparent",
                color:tab===x.id?DARK.gl:T.tx3,fontFamily:"'Manrope'",fontSize:10,fontWeight:600,
                cursor:"pointer",whiteSpace:"nowrap",transition:"all .2s",flexShrink:0}}>
              {x.i}<span>{x.l}</span>
            </button>
          ))}
        </nav>

        {/* Theme Toggle */}
        <button onClick={cycleTheme} title={`Theme: ${themeMode}`}
          style={{width:32,height:32,borderRadius:8,border:`1px solid ${T.bd}`,background:T.bg2,
            color:T.tx2,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all .2s"}}>
          {themeMode==="dark"?IC.moon:themeMode==="light"?IC.sun:IC.auto}
        </button>
      </div>
    </header>

    <main style={{maxWidth:1400,margin:"0 auto",padding:`14px 14px ${playing?78:14}px`,position:"relative",zIndex:1}}>

    {/* ═══ HOME ═══ */}
    {tab==="home"&&!surah&&<div className="fi">

      {/* Memorial — In Loving Memory */}
      <div style={{textAlign:"center",padding:"18px 18px",marginBottom:16,borderRadius:14,
        background:isDark?"linear-gradient(135deg,rgba(196,164,72,.08),rgba(10,81,57,.06))":"linear-gradient(135deg,rgba(196,164,72,.15),rgba(10,81,57,.08))",
        border:`1px solid ${isDark?"rgba(196,164,72,.2)":"rgba(196,164,72,.35)"}`,
        boxShadow:isDark?"0 0 30px rgba(196,164,72,.06)":"0 0 20px rgba(196,164,72,.1)"}}>
        <div style={{fontFamily:"'Amiri Quran',serif",fontSize:18,color:T.g,marginBottom:6,lineHeight:1.5}}>
          إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ
        </div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:isDark?"#D4C9A8":T.tx,lineHeight:1.7}}>
          In loving memory of <span style={{color:T.g,fontWeight:700,fontSize:15}}>Sarwat Baig</span>
        </div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:11.5,color:T.tx2,marginTop:5,lineHeight:1.5}}>
          May Allah grant him the highest ranks in Jannah · <span style={{fontFamily:"'Amiri Quran',serif",color:T.g}}>رحمه الله</span>
        </div>
        <div style={{width:40,height:1,background:T.g,margin:"10px auto 0",opacity:.3,borderRadius:1}}/>
        <div style={{fontSize:9,color:T.tx3,marginTop:8,fontStyle:"italic"}}>This app is a Sadaqah Jariyah — an ongoing charity for his soul</div>
      </div>

      {/* ── TIME-OF-DAY AMBIENT SCENE ── */}
      <div style={{borderRadius:16,overflow:"hidden",marginBottom:18,position:"relative"}}>
        <div style={{background:scene.gradient,padding:"28px 20px",textAlign:"center",position:"relative"}}>
          {/* Animated elements based on time */}
          {tod==="night"&&<div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
            {Array.from({length:20}).map((_,i)=><div key={i} style={{position:"absolute",width:2,height:2,background:"white",borderRadius:"50%",opacity:Math.random()*.8+.2,left:`${Math.random()*100}%`,top:`${Math.random()*70}%`,animation:`pulse ${2+Math.random()*3}s ease infinite ${Math.random()*2}s`}}/>)}
          </div>}
          {tod==="fajr"&&<div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:120,height:60,background:"radial-gradient(ellipse,rgba(245,166,35,.4),transparent)",borderRadius:"50%"}}/>}
          {(tod==="morning"||tod==="dhuhr"||tod==="asr")&&<div style={{position:"absolute",top:12,right:20,width:40,height:40,background:"radial-gradient(circle,rgba(255,220,100,.8),rgba(255,200,50,.3),transparent)",borderRadius:"50%"}}/>}
          {tod==="maghrib"&&<div style={{position:"absolute",bottom:0,left:"40%",width:80,height:40,background:"radial-gradient(ellipse,rgba(231,76,60,.5),transparent)",borderRadius:"50%"}}/>}

          <div style={{position:"relative",zIndex:1}}>
            <div style={{fontSize:28,marginBottom:4}}>{scene.emoji}</div>
            <div style={{fontSize:10,color:scene.darkText?"rgba(60,40,10,.7)":"rgba(255,255,255,.7)",textTransform:"uppercase",letterSpacing:2,fontWeight:600,marginBottom:6}}>{scene.label}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:scene.darkText?"rgba(60,40,10,.85)":"rgba(255,255,255,.9)",fontStyle:"italic"}}>{scene.greeting}</div>
          </div>
        </div>
      </div>

      {/* Daily Ayah */}
      {daily&&<div onClick={()=>{const s=SU.find(x=>x.n===daily.sn);if(s)openSurah(s)}}
        style={{...crd,padding:"24px 18px",marginBottom:18,borderRadius:16,textAlign:"center",cursor:"pointer"}}>
        <div style={{fontSize:9,color:T.gd,textTransform:"uppercase",letterSpacing:3,fontWeight:700,marginBottom:10}}>✦ Verse of the Day ✦</div>
        <div style={{fontFamily:"'Amiri Quran',serif",fontSize:"clamp(18px,4.5vw,28px)",lineHeight:2,direction:"rtl",marginBottom:10,color:T.arabicColor}}>{daily.ar}</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontStyle:"italic",color:T.trColor,lineHeight:1.7,maxWidth:600,margin:"0 auto 6px"}}>"{daily.tr}"</div>
        <div style={{fontSize:10.5,color:T.gd,fontWeight:600}}>— {daily.s} {daily.v}</div>
      </div>}

      {/* Khatmah */}
      <div style={{...crd,marginBottom:18,borderRadius:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontSize:12,fontWeight:700,color:T.g,display:"flex",alignItems:"center",gap:5}}>{IC.target} Spiritual Journey</div>
          <div style={{fontSize:20,fontWeight:800,color:T.g,fontFamily:"'Cormorant Garamond'"}}>{kPct}%</div>
        </div>
        <div style={{height:7,background:T.bd,borderRadius:4,overflow:"hidden",marginBottom:8}}>
          <div style={{height:"100%",background:`linear-gradient(90deg,${DARK.em},${DARK.g})`,borderRadius:4,width:`${kPct}%`,transition:"width .5s"}}/>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:2.5}}>
          {SU.map(s=><div key={s.n} title={`${s.n}. ${s.e}`} onClick={()=>openSurah(s)}
            style={{width:8,height:8,borderRadius:2,cursor:"pointer",background:readSurahs.includes(s.n)?DARK.em:T.bd,opacity:readSurahs.includes(s.n)?1:.35}}/>)}
        </div>
        <div style={{fontSize:9.5,color:T.tx3,marginTop:6}}>{readSurahs.length}/114 Surahs · Each dot = 1 Surah</div>
      </div>

      {/* Moods */}
      <div style={{marginBottom:18}}>
        <div style={{fontSize:12,fontWeight:700,color:T.g,marginBottom:8,display:"flex",alignItems:"center",gap:5}}>{IC.heart} How Are You Feeling?</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(140px,45%),1fr))",gap:7}}>
          {Object.entries(MOODS).slice(0,6).map(([k,m])=>(
            <div key={k} onClick={()=>loadMood(k)} style={{...crd,padding:12,cursor:"pointer",textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:3}}>{m.emoji}</div>
              <div style={{fontSize:11,fontWeight:600,color:T.tx}}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{position:"relative",marginBottom:14}}>
        <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:T.tx3}}>{IC.search}</span>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search surah..."
          style={{width:"100%",padding:"12px 14px 12px 38px",background:T.cardBg,border:`1px solid ${T.bd}`,borderRadius:11,color:T.tx,fontFamily:"'Manrope'",fontSize:13,outline:"none"}}/>
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:5,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        {[["all","All"],["mk","Meccan"],["md","Medinan"]].map(([k,l])=><button key={k} onClick={()=>setFilter(k)} style={btn(filter===k)}>{l}</button>)}
        <select value={juz} onChange={e=>setJuz(+e.target.value)} style={sel}><option value={0}>All Juz</option>{Array.from({length:30},(_,i)=><option key={i+1} value={i+1}>Juz {i+1}</option>)}</select>
        <span style={{marginLeft:"auto",fontSize:10,color:T.tx3}}>{filtered.length}</span>
      </div>

      {/* Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(310px,100%),1fr))",gap:7}}>
        {filtered.map(s=>(
          <div key={s.n} onClick={()=>openSurah(s)} style={{display:"flex",alignItems:"center",gap:11,padding:"11px 13px",background:T.cardBg,border:`1px solid ${T.bd}`,borderRadius:11,cursor:"pointer",transition:"all .2s"}}>
            <div style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(135deg,${DARK.ed},${DARK.em})`,color:DARK.gl,fontFamily:"'Amiri Quran'",fontSize:13,fontWeight:700,borderRadius:9,flexShrink:0}}>{s.n}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"'Noto Naskh Arabic',serif",fontSize:16,fontWeight:600,color:T.g,lineHeight:1.4}}>{s.a}</div>
              <div style={{fontSize:11.5,fontWeight:500,color:T.tx}}>{s.e} — {s.m}</div>
              <div style={{fontSize:9.5,color:T.tx3}}>{s.v} ayat · Juz {s.j}</div>
            </div>
            <span style={{padding:"2px 7px",borderRadius:10,fontSize:8.5,fontWeight:600,background:s.t==="M"?`${T.g}18`:`${DARK.el}18`,color:s.t==="M"?T.g:DARK.el}}>{s.t==="M"?"Meccan":"Medinan"}</span>
          </div>
        ))}
      </div>
    </div>}

    {/* ═══ READER ═══ */}
    {tab==="read"&&surah&&<div className="fi">
      <div style={{display:"flex",gap:5,marginBottom:14,flexWrap:"wrap"}}>
        <button onClick={()=>{setSurah(null);stopA();setTab("home")}} style={btn(false)}>{IC.left} Back</button>
        {surah.n>1&&<button onClick={()=>openSurah(SU[surah.n-2])} style={btn(false)}>{IC.left} {SU[surah.n-2].e}</button>}
        {surah.n<114&&<button onClick={()=>openSurah(SU[surah.n])} style={btn(false)}>{SU[surah.n].e} {IC.right}</button>}
      </div>
      <div style={{textAlign:"center",padding:"24px 14px",marginBottom:18,...crd,borderRadius:16}}>
        <div style={{fontFamily:"'Amiri Quran',serif",fontSize:"clamp(26px,6vw,40px)",color:T.g}}>{surah.a}</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:T.tx,marginTop:3}}>{surah.e} — {surah.m}</div>
        <div style={{fontSize:11,color:T.tx3,marginTop:6}}>{surah.t==="M"?"Meccan":"Medinan"} · {surah.v} Ayat · Juz {surah.j}</div>
      </div>
      {/* Reading Mode Selector */}
      <div style={{display:"flex",gap:0,marginBottom:14,borderRadius:10,overflow:"hidden",border:`1px solid ${T.bd}`}}>
        {[{id:"mushaf",label:"Mushaf",desc:"Pure Arabic"},{id:"mixed",label:"Read",desc:"Arabic + Translation"},{id:"study",label:"Study",desc:"Full Features"}].map(m=>(
          <button key={m.id} onClick={()=>setReadMode(m.id)}
            style={{flex:1,padding:"10px 8px",border:"none",cursor:"pointer",transition:"all .2s",
              background:readMode===m.id?`linear-gradient(135deg,${DARK.ed},${DARK.em})`:T.cardBg,
              color:readMode===m.id?DARK.gl:T.tx3,fontFamily:"'Manrope'",textAlign:"center"}}>
            <div style={{fontSize:11,fontWeight:700}}>{m.label}</div>
            <div style={{fontSize:8,marginTop:2,opacity:.7}}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Controls - hide some in Mushaf mode */}
      {readMode!=="mushaf"&&<div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:18,padding:11,...crd,alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{color:T.tx3}}>{IC.globe}</span>
          <select value={lang.c} onChange={e=>setLang(LNG.find(l=>l.c===e.target.value))} style={sel}>{LNG.map(l=><option key={l.c} value={l.c}>{l.f} {l.n}</option>)}</select></div>
        {readMode==="study"&&<div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:9,color:T.gd,fontWeight:600}}>+</span>
          <select value={lang2?.c||""} onChange={e=>{const v=e.target.value;setLang2(v?LNG.find(l=>l.c===v):null)}} style={sel}><option value="">Compare</option>{LNG.filter(l=>l.c!==lang.c).map(l=><option key={l.c} value={l.c}>{l.f} {l.n}</option>)}</select></div>}
        <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{color:T.tx3}}>{IC.hp}</span>
          <select value={rec.id} onChange={e=>setRec(REC.find(r=>r.id===e.target.value))} style={sel}>{REC.map(r=><option key={r.id} value={r.id}>{r.f} {r.n}</option>)}</select></div>
        {readMode==="study"&&<div style={{marginLeft:"auto",display:"flex",gap:5}}>
          <button onClick={()=>setShowTlit(!showTlit)} style={btn(showTlit)}>Translit</button>
          <button onClick={()=>setHifzMode(!hifzMode)} style={{...btn(hifzMode),borderColor:hifzMode?"#FF9800":T.bd}}>{IC.brain} Hifz</button>
        </div>}
      </div>}
      {readMode!=="mushaf"&&surah.n!==9&&surah.n!==1&&<div style={{textAlign:"center",fontFamily:"'Amiri Quran',serif",fontSize:26,color:T.g,padding:"14px 0",marginBottom:12}}>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>}
      {ld?<div style={{textAlign:"center",padding:60,color:T.tx3}}><div style={{width:30,height:30,border:`3px solid ${T.bd}`,borderTopColor:T.g,borderRadius:"50%",animation:"spin .8s linear infinite",margin:"0 auto 12px"}}/>Loading {surah.e}...</div>:
      fetchErr?<div style={{textAlign:"center",padding:50,color:T.tx3}}>
        <div style={{fontSize:18,marginBottom:8}}>📡</div>
        <div style={{fontSize:13,fontWeight:600,color:T.tx,marginBottom:6}}>Surah not available offline</div>
        <div style={{fontSize:11,marginBottom:14,lineHeight:1.6}}>This surah requires an internet connection. In the preview environment, API calls are sandboxed. When deployed to a real browser or app, all 114 surahs will load instantly.</div>
        <button onClick={()=>openSurah(surah)} style={{...btn(true),background:DARK.em,color:"white",borderColor:DARK.em,padding:"8px 20px",fontSize:12}}>↻ Retry</button>
        <div style={{fontSize:10,color:T.tx3,marginTop:12}}>Tip: Try Al-Fatihah, Al-Ikhlas, Ya-Sin, Al-Mulk, Al-Qadr, or any Juz 30 surah — these work offline</div>
      </div>:
      vrs.length===0?<div style={{textAlign:"center",padding:50,color:T.tx3}}>No verses loaded. <button onClick={()=>openSurah(surah)} style={{...btn(true),background:DARK.em,color:"white",borderColor:DARK.em,marginTop:8}}>Retry</button></div>:<div>
      {OFFLINE[surah.n]&&surah.v>vrs.length&&<div style={{padding:"10px 14px",marginBottom:12,borderRadius:8,background:`${T.g}0A`,border:`1px solid ${T.g}15`,fontSize:10.5,color:T.tx2,textAlign:"center"}}>
        Showing {vrs.length} of {surah.v} verses (offline preview) · Full surah loads when deployed with internet
      </div>}

      {/* ══ MUSHAF MODE — LIVE QPC V2 (same rendering as Quran.com) ══ */}
      {readMode==="mushaf"&&(()=>{
        const pg = mushafPage;
        const jz = vrs[0]?.jz || surah.j;
        
        const mt = isDark ? "#4E5E70" : "#8B7D5E";
        const mk = isDark ? "#B89B3E" : "#7A5C10";
        const bd = isDark ? "#141E2A" : "#D8D0C0";
        const hd = isDark ? "#060A10" : "#EDE5D4";
        const tx = isDark ? "#DDD6C4" : "#1C1C1C";
        const endColor = isDark ? "#B89B3E" : "#7A5C10";

        let pageSurah = surah.a;
        for (let i=114; i>=1; i--) { if (SURAH_PAGES[i] <= pg) { pageSurah = SU[i-1].a; break; } }

        const goPrev = () => { if (pg > 1) { setMushafPage(pg - 1); window.scrollTo(0,0); } };
        const goNext = () => { if (pg < 604) { setMushafPage(pg + 1); window.scrollTo(0,0); } };
        
        // Image fallback URL
        const imgUrl = (p) => `https://raw.githubusercontent.com/nichealpham/Quran-Page-Image/master/images/page${String(p).padStart(3,"0")}.png`;

        // Collect unique page numbers for font loading
        const fontPages = new Set([pg]);
        if (mushafLines) mushafLines.forEach(line => line.forEach(w => fontPages.add(w.page)));
        const fontStyles = [...fontPages].map(p => 
          `@font-face{font-family:'qpc-p${p}';src:url('${QF_FONTS}/p${p}.woff2') format('woff2');font-display:block}`
        ).join("\n");

        return (
          <div style={{background:isDark?"#080D14":"#F5F0E2",borderRadius:10,overflow:"hidden",border:`1px solid ${bd}`}}>
            <style>{fontStyles}</style>
            
            {/* Page Header */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 16px",borderBottom:`1px solid ${bd}`,background:hd}}>
              <span style={{fontSize:10,color:mt,fontFamily:"'Manrope'",fontWeight:600}}>Juz {jz}</span>
              <span style={{fontFamily:"'UthmanicHafs','Amiri Quran',serif",fontSize:14,color:mk}}>{pageSurah}</span>
              <span style={{fontSize:10,color:mt,fontFamily:"'Manrope'",fontWeight:600}}>{pg}</span>
            </div>

            {/* ── MUSHAF PAGE ── */}
            <div style={{minHeight:400,background:isDark?"#0B1018":"#FBF7EF",position:"relative"}}>
              
              {/* Loading state */}
              {mushafLd&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:80}}>
                <div style={{width:24,height:24,border:`3px solid ${bd}`,borderTopColor:mk,borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
              </div>}

              {/* QPC V2 RENDERED — live from Quran Foundation API */}
              {!mushafLd&&mushafLines&&<div style={{padding:"20px 14px 24px",direction:"rtl"}}>
                {mushafLines.map((line,li) => (
                  <div key={li} style={{
                    display:"flex",justifyContent:"center",flexWrap:"nowrap",gap:0,
                    direction:"rtl",
                    minHeight:"2.2em",
                    lineHeight:2.2,
                    fontSize:"clamp(22px,6.5vw,36px)",
                  }}>
                    {line.map((word,wi) => (
                      <span key={wi} style={{
                        fontFamily:`'qpc-p${word.page}','UthmanicHafs','Amiri Quran',serif`,
                        color:word.type==="end"?endColor:tx,
                        fontSize:word.type==="end"?"0.65em":"inherit",
                        verticalAlign:word.type==="end"?"middle":"baseline",
                        display:"inline-block",
                      }} dangerouslySetInnerHTML={{__html:word.code}}/>
                    ))}
                  </div>
                ))}
              </div>}

              {/* IMAGE FALLBACK — when API unavailable */}
              {!mushafLd&&!mushafLines&&<div style={{overflow:"hidden",position:"relative",minHeight:350}}>
                <img src={imgUrl(pg)} alt={`Page ${pg}`}
                  style={{width:"138%",marginLeft:"-19%",marginTop:"-4%",marginBottom:"-4%",display:"block",
                    filter:isDark?"invert(0.92) hue-rotate(180deg) brightness(1.2) contrast(1.1) sepia(0.08)":"none"}}
                  onError={(e)=>{e.target.style.display="none";e.target.nextSibling.style.display="block"}}/>
                {/* TEXT FALLBACK — styled to resemble Mushaf layout */}
                <div style={{display:"none",padding:"16px 10px",direction:"rtl",textAlign:"center"}}>
                  {/* Bismillah */}
                  {surah.n!==1&&surah.n!==9&&<div style={{fontFamily:"'UthmanicHafs','Amiri Quran',serif",
                    fontSize:"clamp(18px,4.5vw,26px)",color:isDark?"#B89B3E":"#7A5C10",
                    padding:"12px 0 16px",marginBottom:8,letterSpacing:2}}>
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                  </div>}
                  {/* Verses — each on own line, centered */}
                  {vrs.map((v,i)=>(
                    <div key={v.num} style={{
                      fontFamily:"'UthmanicHafs','Amiri Quran','Noto Naskh Arabic',serif",
                      fontSize:"clamp(22px,6vw,36px)",
                      lineHeight:2.3,
                      color:isDark?"#DCD5C2":"#1C1C1C",
                      padding:"2px 0",
                    }}>
                      {v.ar}{" "}
                      <span style={{fontSize:"0.45em",color:isDark?"#B89B3E":"#7A5C10",verticalAlign:"middle"}}>
                        {"\uFD3F"}{toArabicNum(v.num)}{"\uFD3E"}
                      </span>
                    </div>
                  ))}
                  <div style={{fontSize:10,color:mt,marginTop:14,paddingTop:10,borderTop:`1px solid ${bd}`}}>
                    Preview mode · Deploy to see authentic QPC Mushaf rendering
                  </div>
                </div>
              </div>}
            </div>

            {/* Page Navigation */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",borderTop:`1px solid ${bd}`,background:hd}}>
              <button onClick={goNext} disabled={pg>=604}
                style={{display:"flex",alignItems:"center",gap:4,background:"none",border:"none",
                  color:pg<604?mk:mt,fontSize:11,fontFamily:"'Manrope'",cursor:"pointer",fontWeight:600,opacity:pg<604?1:.3,padding:"4px 8px"}}>
                {IC.right} Previous
              </button>
              <div style={{textAlign:"center"}}>
                <span style={{fontSize:11,color:mk,fontWeight:700,fontFamily:"'Manrope'"}}>{pg}</span>
                <span style={{fontSize:9,color:mt,fontFamily:"'Manrope'"}}> / 604</span>
              </div>
              <button onClick={goPrev} disabled={pg<=1}
                style={{display:"flex",alignItems:"center",gap:4,background:"none",border:"none",
                  color:pg>1?mk:mt,fontSize:11,fontFamily:"'Manrope'",cursor:"pointer",fontWeight:600,opacity:pg>1?1:.3,padding:"4px 8px"}}>
                Next {IC.left}
              </button>
            </div>
          </div>
        );
      })()}

      {/* ══ MIXED MODE — Arabic + Translation, clean flow ══ */}
      {readMode==="mixed"&&vrs.map((v,i)=>{
        const tr=trVrs[i]?.text||"";
        return(
          <div key={v.num} style={{marginBottom:6,padding:"16px 16px",background:T.cardBg,
            border:`1px solid ${playing===`${surah.n}:${v.num}`?DARK.em:T.bd}`,borderRadius:10,
            cursor:"pointer",transition:"all .2s"}} onClick={()=>playV(v)}>
            <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",
                background:`${T.g}12`,color:T.g,borderRadius:"50%",fontSize:11,fontWeight:700,flexShrink:0,marginTop:4,
                fontFamily:"'Amiri Quran',serif"}}>
                {toArabicNum(v.num)}
              </div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Amiri Quran',serif",fontSize:"clamp(20px,4.5vw,28px)",lineHeight:2,
                  direction:"rtl",textAlign:"right",color:T.arabicColor,marginBottom:8}}>{v.ar}</div>
                {showTlit&&v.tl&&<div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",
                  fontSize:12.5,color:T.g,marginBottom:5,lineHeight:1.6,opacity:.8}}>{v.tl}</div>}
                {tr&&<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:13,lineHeight:1.7,
                  color:T.trColor}}>{tr}</div>}
              </div>
            </div>
          </div>
        );
      })}

      {/* ══ STUDY MODE — Full features, verse-by-verse ══ */}
      {readMode==="study"&&vrs.map((v,i)=>{const k=`${surah.n}:${v.num}`;const isP=playing===k;const isB=bm.includes(k);const tr=trVrs[i]?.text||"";const tr2=trVrs2[i]?.text||"";const hasN=journal[k];const words=v.ar.split(/\s+/);
      return(<div key={k} style={{marginBottom:9,padding:18,...crd,borderRadius:12,borderColor:isP?DARK.em:T.bd,transition:"all .3s"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(135deg,${DARK.ed},${DARK.em})`,color:DARK.gl,borderRadius:"50%",fontSize:11.5,fontWeight:700}}>{v.num}</div>
          <div style={{display:"flex",gap:4}}><span style={{fontSize:9,color:T.gd,background:`${T.g}0A`,padding:"2px 6px",borderRadius:3,fontWeight:600}}>Juz {v.jz}</span>{v.sj&&<span style={{fontSize:9,color:DARK.el,background:`${DARK.el}12`,padding:"2px 6px",borderRadius:3,fontWeight:600}}>۩</span>}{hasN&&<span style={{fontSize:9,color:"#FF9800"}}>📝</span>}</div>
        </div>
        {hifzMode?<div style={{fontFamily:"'Amiri Quran',serif",fontSize:26,lineHeight:2.2,textAlign:"right",direction:"rtl",marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${T.bd}`,display:"flex",flexWrap:"wrap",justifyContent:"flex-end",gap:"3px 8px"}}>
          {words.map((w,wi)=>{const h=hiddenWords[`${k}-${wi}`];return<span key={wi} onClick={()=>setHiddenWords(p=>({...p,[`${k}-${wi}`]:!p[`${k}-${wi}`]}))} style={{cursor:"pointer",padding:"1px 3px",borderRadius:3,background:h?`${T.g}15`:"transparent",color:h?"transparent":T.arabicColor,userSelect:"none"}}>{w}</span>})}
        </div>:
        <div style={{fontFamily:"'Amiri Quran',serif",fontSize:28,fontWeight:500,lineHeight:2.1,textAlign:"right",direction:"rtl",color:T.arabicColor,marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${T.bd}`,wordBreak:"break-word"}}>{v.ar}</div>}
        {showTlit&&v.tl&&<div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:13.5,color:T.g,marginBottom:7,lineHeight:1.7,opacity:.85}}>{v.tl}</div>}
        {tr&&<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:13.5,lineHeight:1.8,color:T.trColor,marginBottom:lang2?6:12}}>{lang2&&<span style={{fontSize:8.5,color:T.gd,fontWeight:600}}>{lang.f} </span>}{tr}</div>}
        {tr2&&<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:13.5,lineHeight:1.8,color:T.trColor,marginBottom:12,paddingTop:6,borderTop:`1px dashed ${T.bd}`,opacity:.8}}><span style={{fontSize:8.5,color:DARK.el,fontWeight:600}}>{lang2?.f} </span>{tr2}</div>}
        <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
          <button onClick={()=>playV(v)} style={{width:32,height:32,borderRadius:"50%",border:"none",background:`linear-gradient(135deg,${DARK.em},${DARK.el})`,color:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{isP?IC.pause:IC.play}</button>
          <button onClick={()=>setShowTaf(p=>({...p,[k]:!p[k]}))} style={btn(showTaf[k])}>{IC.layers} Tafseer</button>
          <button onClick={()=>setBm(p=>p.includes(k)?p.filter(b=>b!==k):[...p,k])} style={btn(isB)}>{IC.bm}</button>
          <button onClick={()=>{setEditingNote(editingNote===k?null:k);setNoteText(journal[k]||"")}} style={btn(editingNote===k||hasN)}>{IC.pen}</button>
          <button onClick={()=>navigator.clipboard?.writeText(`${v.ar}\n${tr}\n— ${surah.e} ${v.num}`)} style={btn(false)}>Copy</button>
        </div>
        {isP&&<div style={{marginTop:8,padding:"5px 9px",background:`${DARK.em}11`,borderRadius:5,fontSize:10.5,color:DARK.el,display:"flex",alignItems:"center",gap:5}}>{IC.hp} {rec.f} {rec.n}<span style={{marginLeft:"auto",fontSize:9.5,color:T.tx3}}>{ft(prog)}/{ft(dur)}</span></div>}
        {showTaf[k]&&<TafPanel sn={surah.n} vn={v.num} T={T}/>}
        {editingNote===k&&<div style={{marginTop:10,padding:10,background:`${T.g}08`,border:`1px solid ${T.g}1A`,borderRadius:8}}>
          <textarea value={noteText} onChange={e=>setNoteText(e.target.value)} placeholder="Your reflection..." style={{width:"100%",minHeight:70,padding:8,background:T.bg2,border:`1px solid ${T.bd}`,borderRadius:6,color:T.tx,fontFamily:"'Cormorant Garamond'",fontSize:13,outline:"none",resize:"vertical",lineHeight:1.7}}/>
          <div style={{display:"flex",gap:5,marginTop:6}}><button onClick={()=>saveNote(k)} style={{...btn(true),background:DARK.em,color:"white",borderColor:DARK.em}}>Save</button><button onClick={()=>{setEditingNote(null)}} style={btn(false)}>Cancel</button></div>
        </div>}
        {hasN&&editingNote!==k&&<div style={{marginTop:8,padding:8,background:`${T.g}06`,border:`1px solid ${T.g}12`,borderRadius:6}}>
          <div style={{fontFamily:"'Cormorant Garamond'",fontSize:12,color:T.tx2,lineHeight:1.7,fontStyle:"italic"}}>📝 {journal[k]}</div></div>}
      </div>)})}
      </div>}
      {!ld&&vrs.length>0&&<div style={{display:"flex",justifyContent:"space-between",marginTop:18,gap:7}}>
        {surah.n>1&&<button onClick={()=>openSurah(SU[surah.n-2])} style={{...btn(false),flex:1,justifyContent:"center",padding:9}}>{IC.left} {SU[surah.n-2].e}</button>}
        {surah.n<114&&<button onClick={()=>openSurah(SU[surah.n])} style={{...btn(false),flex:1,justifyContent:"center",padding:9}}>{SU[surah.n].e} {IC.right}</button>}
      </div>}
    </div>}

    {/* ═══ EXPLORE ═══ */}
    {tab==="explore"&&!surah&&<div className="fi">
      <div style={{...crd,borderRadius:16,padding:24,marginBottom:18,textAlign:"center"}}>
        <div style={{fontSize:24,marginBottom:4}}>{IC.sparkle}</div>
        <h2 style={{fontFamily:"'Cormorant Garamond'",fontSize:22,color:T.g,marginBottom:4}}>AI Verse Explorer</h2>
        <p style={{fontSize:11,color:T.tx3}}>Ask any theme and AI finds relevant Quran verses</p>
      </div>
      <div style={{display:"flex",gap:7,marginBottom:18}}>
        <input value={aiQuery} onChange={e=>setAiQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&aiExplore()} placeholder="e.g. patience, forgiveness, gratitude..." style={{flex:1,padding:"12px 14px",background:T.cardBg,border:`1px solid ${T.bd}`,borderRadius:11,color:T.tx,fontFamily:"'Manrope'",fontSize:12.5,outline:"none"}}/>
        <button onClick={aiExplore} style={{padding:"0 18px",borderRadius:11,border:"none",background:`linear-gradient(135deg,${DARK.em},${DARK.el})`,color:"white",cursor:"pointer",fontFamily:"'Manrope'",fontSize:11,fontWeight:600,opacity:aiLd?.6:1}}>{aiLd?"...":"Find"}</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(150px,45%),1fr))",gap:7,marginBottom:18}}>
        {THEMES.map(t=><div key={t.id} onClick={()=>setAiQuery(t.name)} style={{...crd,padding:12,cursor:"pointer",textAlign:"center"}}><div style={{fontSize:20,marginBottom:3}}>{t.icon}</div><div style={{fontSize:10.5,fontWeight:600,color:T.tx}}>{t.name}</div><div style={{fontSize:8.5,color:T.tx3}}>{t.cnt}+ ayat</div></div>)}
      </div>
      {aiResults&&<div>{aiResults.map((r,i)=><div key={i} onClick={()=>{const s=SU.find(x=>x.n===r.surah);if(s)openSurah(s)}} style={{...crd,marginBottom:7,padding:14,cursor:"pointer"}}><div style={{fontSize:10.5,color:T.g,fontWeight:600,marginBottom:4}}>{SU[r.surah-1]?.e} {r.ayah}</div><div style={{fontFamily:"'Cormorant Garamond'",fontSize:13,color:T.tx,lineHeight:1.7,marginBottom:4}}>"{r.text}"</div><div style={{fontSize:9.5,color:T.tx3,fontStyle:"italic"}}>{r.relevance}</div></div>)}</div>}
    </div>}

    {/* ═══ MOOD ═══ */}
    {tab==="mood"&&<div className="fi">
      {!moodMode?<div>
        <div style={{...crd,borderRadius:16,padding:24,marginBottom:18,textAlign:"center"}}><div style={{fontSize:24,marginBottom:4}}>{IC.heart}</div><h2 style={{fontFamily:"'Cormorant Garamond'",fontSize:22,color:T.g}}>Mood-Based Healing</h2><p style={{fontSize:11,color:T.tx3,marginTop:4}}>Curated Quran verses for your emotional state</p></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(160px,45%),1fr))",gap:8}}>
          {Object.entries(MOODS).map(([k,m])=><div key={k} onClick={()=>loadMood(k)} style={{...crd,padding:16,cursor:"pointer",textAlign:"center"}}><div style={{fontSize:28,marginBottom:4}}>{m.emoji}</div><div style={{fontSize:12,fontWeight:700,color:T.tx}}>{m.label}</div><div style={{fontSize:10,color:T.tx3,marginTop:3,lineHeight:1.4}}>{m.desc}</div></div>)}
        </div>
      </div>:<div>
        <button onClick={()=>setMoodMode(null)} style={{...btn(false),marginBottom:14}}>{IC.left} All Moods</button>
        <div style={{...crd,borderRadius:16,padding:22,marginBottom:18,textAlign:"center"}}><div style={{fontSize:36,marginBottom:6}}>{MOODS[moodMode].emoji}</div><h2 style={{fontFamily:"'Cormorant Garamond'",fontSize:20,color:T.g}}>{MOODS[moodMode].label}</h2><p style={{fontFamily:"'Cormorant Garamond'",fontSize:14,fontStyle:"italic",color:T.tx2,marginTop:4}}>"{MOODS[moodMode].desc}"</p></div>
        {moodLd?<div style={{textAlign:"center",padding:36,color:T.tx3}}><div style={{width:22,height:22,border:`3px solid ${T.bd}`,borderTopColor:MOODS[moodMode].color,borderRadius:"50%",animation:"spin .8s linear infinite",margin:"0 auto 6px"}}/>Loading...</div>:
        moodVerses.map((mv,i)=><div key={i} style={{...crd,marginBottom:8,padding:16}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:10.5,color:T.g,fontWeight:600}}>{mv.ref}</span><button onClick={()=>playV({gn:mv.gn,num:mv.num},MOODS[moodMode].reciter)} style={{width:28,height:28,borderRadius:"50%",border:"none",background:`linear-gradient(135deg,${DARK.em},${DARK.el})`,color:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{IC.play}</button></div>
          <div style={{fontFamily:"'Amiri Quran',serif",fontSize:22,lineHeight:2,direction:"rtl",textAlign:"right",color:T.arabicColor,marginBottom:8}}>{mv.ar}</div>
          <div style={{fontFamily:"'Cormorant Garamond'",fontSize:13,lineHeight:1.7,color:T.trColor}}>{mv.tr}</div>
        </div>)}
      </div>}
    </div>}

    {/* ═══ HIFZ ═══ */}
    {tab==="hifz"&&!surah&&<div className="fi">
      <div style={{...crd,borderRadius:16,padding:24,marginBottom:18,textAlign:"center"}}><div style={{fontSize:24,marginBottom:4}}>{IC.brain}</div><h2 style={{fontFamily:"'Cormorant Garamond'",fontSize:22,color:T.g,marginBottom:4}}>Smart Memorization</h2><p style={{fontSize:11,color:T.tx3}}>Tap words to hide them · Test yourself</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(190px,100%),1fr))",gap:7}}>
        {SU.filter(s=>s.j===30).map(s=><div key={s.n} onClick={()=>{setHifzMode(true);openSurah(s)}} style={{...crd,padding:12,cursor:"pointer",display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(135deg,${DARK.ed},${DARK.em})`,color:DARK.gl,borderRadius:7,fontFamily:"'Amiri Quran'",fontSize:12,fontWeight:700,flexShrink:0}}>{s.n}</div>
          <div><div style={{fontFamily:"'Noto Naskh Arabic',serif",fontSize:14,color:T.g}}>{s.a}</div><div style={{fontSize:10.5,color:T.tx2}}>{s.e} · {s.v} ayat</div></div>
        </div>)}
      </div>
    </div>}

    {/* ═══ CHAT ═══ */}
    {tab==="chat"&&!surah&&<div className="fi" style={{maxWidth:800,margin:"0 auto",height:"calc(100vh - 150px)",display:"flex",flexDirection:"column"}}>
      <div style={{...crd,borderRadius:16,padding:22,marginBottom:12,textAlign:"center"}}><h2 style={{fontFamily:"'Amiri Quran'",fontSize:22,color:T.g,marginBottom:3}}>🌙 AI Islamic Scholar</h2><p style={{fontSize:11,color:T.tx3}}>Quran · Hadith · Classical Scholars</p></div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
        {["Five Pillars","Wudu","Ramadan","Prophets","Tawhid","Zakat"].map(s=><button key={s} onClick={()=>setChatIn(s)} style={btn(false)}>{s}</button>)}
      </div>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:9,padding:"3px 0"}}>
        {msgs.length===0&&<div style={{textAlign:"center",padding:28,color:T.tx3,fontSize:11.5}}>Ask about Islam...</div>}
        {msgs.map((m,i)=><div key={i} style={{maxWidth:"85%",padding:"11px 15px",borderRadius:13,fontSize:12.5,lineHeight:1.8,whiteSpace:"pre-wrap",alignSelf:m.t==="u"?"flex-end":"flex-start",background:m.t==="u"?`linear-gradient(135deg,${DARK.em},${DARK.ed})`:T.cardBg,border:m.t==="b"?`1px solid ${T.bd}`:"none",color:m.t==="u"?"#E8E2D0":T.tx2,borderBottomRightRadius:m.t==="u"?3:13,borderBottomLeftRadius:m.t==="b"?3:13}} dangerouslySetInnerHTML={{__html:m.x.replace(/\*\*(.*?)\*\*/g,`<strong style="color:${T.g}">$1</strong>`)}}/>)}
        {chatLd&&<div style={{alignSelf:"flex-start",padding:11,borderRadius:13,background:T.cardBg,border:`1px solid ${T.bd}`}}><div style={{display:"flex",gap:3}}>{[0,1,2].map(i=><div key={i} style={{width:5,height:5,background:T.g,borderRadius:"50%",animation:`pulse 1s infinite ${i*.2}s`}}/>)}</div></div>}
        <div ref={chatRef}/>
      </div>
      <div style={{display:"flex",gap:7,padding:"8px 0",borderTop:`1px solid ${T.bd}`,marginTop:5}}>
        <input value={chatIn} onChange={e=>setChatIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="Ask about Islam..." style={{flex:1,padding:"11px 14px",background:T.cardBg,border:`1px solid ${T.bd}`,borderRadius:11,color:T.tx,fontFamily:"'Manrope'",fontSize:12.5,outline:"none"}}/>
        <button onClick={sendChat} style={{width:42,height:42,borderRadius:11,border:"none",background:`linear-gradient(135deg,${DARK.em},${DARK.el})`,color:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{IC.send}</button>
      </div>
    </div>}

    </main>

    {/* Audio Bar */}
    {playing&&<div style={{position:"fixed",bottom:0,left:0,right:0,background:isDark?"rgba(5,8,13,.96)":"rgba(247,244,238,.96)",borderTop:`1px solid ${T.bd}`,padding:"7px 14px",display:"flex",alignItems:"center",gap:9,zIndex:200,backdropFilter:"blur(18px)"}}>
      <button onClick={stopA} style={{width:30,height:30,borderRadius:"50%",border:"none",background:`linear-gradient(135deg,${DARK.em},${DARK.el})`,color:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>{IC.pause}</button>
      <div style={{flex:"0 1 auto",minWidth:0}}><div style={{fontSize:11.5,fontWeight:500,color:T.tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{surah?.e} — {playing.split(":")[1]}</div><div style={{fontSize:9.5,color:T.tx3}}>{rec.f} {rec.n}</div></div>
      <span style={{fontSize:9.5,color:T.tx3,minWidth:30,textAlign:"center"}}>{ft(prog)}</span>
      <div onClick={e=>{if(!audio||!dur)return;const r=e.currentTarget.getBoundingClientRect();audio.currentTime=(e.clientX-r.left)/r.width*dur}} style={{flex:2,height:3,background:T.bd,borderRadius:2,overflow:"hidden",cursor:"pointer"}}><div style={{height:"100%",background:`linear-gradient(90deg,${DARK.em},${DARK.g})`,borderRadius:2,width:`${dur?prog/dur*100:0}%`}}/></div>
      <span style={{fontSize:9.5,color:T.tx3,minWidth:30,textAlign:"center"}}>{ft(dur)}</span>
      <button onClick={stopA} style={{background:"none",border:"none",color:T.tx3,cursor:"pointer"}}>{IC.x}</button>
    </div>}
  </div>);
}

function TafPanel({sn,vn,T}){
  const[tx,setTx]=useState("");const[ld,setLd]=useState(true);
  useEffect(()=>{setLd(true);setTx("");(async()=>{try{const r=await fetch(`${API}/ayah/${sn}:${vn}/en.ibn-kathir`);const d=await r.json();setTx(d.code===200&&d.data?.text?d.data.text:"Loading...")}catch{setTx("Unable to load.")}setLd(false)})()},[sn,vn]);
  return(<div style={{marginTop:10,padding:12,background:`${T.g}06`,border:`1px solid ${T.g}12`,borderRadius:8}}>
    <div style={{fontSize:9.5,fontWeight:600,color:T.g,textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>📖 Tafsir Ibn Kathir</div>
    {ld?<div style={{display:"flex",gap:3}}>{[0,1,2].map(i=><div key={i} style={{width:4,height:4,background:T.g,borderRadius:"50%",animation:`pulse 1s infinite ${i*.2}s`}}/>)}</div>
    :<div style={{fontFamily:"'Cormorant Garamond'",fontSize:12.5,lineHeight:1.9,color:T.tx2}}>{tx}</div>}
  </div>);
}
