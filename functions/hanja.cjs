// Supplementary Korean glosses adapted from libhangul data/hanja/hanja.txt.
// https://github.com/libhangul/libhangul/blob/main/data/hanja/hanja.txt
// Selection also uses Unicode Unihan stroke counts (https://www.unicode.org/license.txt).
/*
# Copyright (c) 2005,2006 Choe Hwanjin
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
#
# 1. Redistributions of source code must retain the above copyright notice,
#    this list of conditions and the following disclaimer.
# 2. Redistributions in binary form must reproduce the above copyright notice,
#    this list of conditions and the following disclaimer in the documentation
#    and/or other materials provided with the distribution.
# 3. Neither the name of the author nor the names of its contributors
#    may be used to endorse or promote products derived from this software
#    without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
# ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
# LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
# CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
# SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
# INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
# CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
# ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
# POSSIBILITY OF SUCH DAMAGE.
*/
const HANJA_SUPPLEMENT_ = {
    1: [
        "大|클|대\n生|날|생\n不|아닐|부\n中|가운데|중\n地|땅|지\n法|법|법\n之|갈|지\n性|성품|성",
        "分|나눌|분\n主|주인|주\n的|과녁|적\n上|위|상\n行|시장|항\n金|성|금\n天|하늘|천\n心|마음|심",
        "物|만물|물\n下|아래|하\n小|작을|소\n石|돌|석\n自|스스로|자\n工|장인|공\n內|안|내\n洞|마을|동",
        "外|바깥|외\n者|놈|자\n公|공변될|공\n入|들|입\n合|합할|합\n出|날|출\n用|쓸|용\n事|일|사",
        "方|모|방\n面|낯|면\n平|평탄할|평\n色|빛|색\n民|백성|민\n國|나라|국\n白|흰|백\n十|열|십",
        "正|바를|정\n定|정할|정\n同|같을|동\n氣|기운|기\n式|법|식\n成|이룰|성\n長|길|장\n動|움직일|동",
        "有|있을|유\n代|대신할|대\n反|돌이킬|반\n作|지을|작\n制|억제할|제\n世|세상|세\n官|벼슬|관\n光|빛|광",
        "立|설|립\n形|모양|형\n花|꽃|화\n無|없을|무\n理|다스릴|리\n安|편안할|안\n音|소리|음\n度|법도|도",
        "名|이름|명\n家|집|가\n全|온전할|전\n所|바|소\n八|여덟|팔\n計|꾀|계\n神|천신|신\n風|바람|풍",
        "曲|굽을|곡\n元|으뜸|원\n高|높을|고\n軍|군사|군\n會|모일|회\n相|서로|상\n言|말씀|언\n半|반|반",
        "社|토지의 신|사\n古|옛|고\n業|일|업\n多|많을|다\n通|뚫릴|통\n海|바다|해\n空|빌|공\n司|맡을|사",
        "電|번개|전\n血|피|혈\n加|더할|가\n千|일천|천\n交|사귈|교\n九|아홉|구\n重|무거울|중\n別|나눌|별",
        "政|정사|정\n車|수레|거\n角|뿔|각\n明|밝을|명\n利|날카로울|리\n部|거느릴|부\n位|벼슬|위\n田|밭|전",
        "流|흐를|류\n信|믿을|신\n道|길|도\n敎|가르침|교",
    ].join('\n'),
    2: [
        "義|옳을|의\n令|명령|령\n科|과정|과\n夫|지아비|부\n七|일곱|칠\n兵|군사|병\n市|저자|시\n症|증세|증",
        "回|돌|회\n狀|형상|상\n皮|가죽|피\n川|내|천\n防|둑|방\n直|곧을|직\n史|역사|사\n老|늙을|노",
        "産|낳을|산\n經|날|경\n發|쏠|발\n支|가를|지\n品|뭇|품\n先|먼저|선\n原|근본|원\n毛|털|모",
        "共|함께|공\n命|목숨|명\n死|죽을|사\n素|흴|소\n次|버금|차\n間|틈|간\n草|풀|초\n靑|푸를|청",
        "身|몸|신\n馬|말|마\n佛|부처|불\n後|뒤|후\n員|관원|원\n前|앞|전\n引|끌|인\n島|섬|도",
        "知|알|지\n判|판단할|판\n病|병|병\n再|두 번|재\n星|별|성\n百|일백|백\n界|지경|계\n林|수풀|림",
        "收|모을|수\n任|맡길|임\n寺|절|사\n機|틀|기\n放|놓을|방\n技|재주|기\n印|도장|인\n非|아닐|비",
        "務|일|무\n可|옳을|가\n布|베|포\n局|부분|국\n表|겉|표\n失|잃을|실\n線|실|선\n波|물결|파",
        "在|있을|재\n期|기약할|기\n和|화할|화\n衣|옷|의\n量|헤아릴|량\n來|올|내\n室|집|실\n受|이을|수",
        "李|오얏|리\n射|궁술|사\n院|원집|원\n甲|갑옷|갑\n船|배|선\n使|하여금|사\n器|그릇|기\n場|마당|장",
        "宗|마루|종\n新|새|신\n城|보루|성\n約|대략|약\n骨|뼈|골\n美|아름다울|미\n念|생각|념\n左|왼|좌",
        "告|알릴|고\n治|다스릴|치\n板|널조각|판\n典|책|전\n刀|칼|도\n肉|고기|육\n果|실과|과\n止|발|지",
        "才|재주|재\n造|지을|조\n仁|어질|인\n術|재주|술\n犯|범할|범\n油|기름|유\n送|보낼|송\n紙|종이|지",
        "赤|붉을|적\n少|적을|소\n眞|참|진\n功|공|공\n料|되질할|료\n牛|소|우\n列|줄|렬\n黃|누를|황",
        "實|열매|실\n酒|술|주\n竹|대|죽\n都|도읍|도\n說|말씀|설\n魚|물고기|어\n右|오른쪽|우\n單|홀로|단",
        "指|손가락|지\n江|가람|강\n去|갈|거\n率|헤아릴|률\n投|던질|투\n向|향할|향\n服|옷|복\n傳|전할|전",
    ].join('\n'),
    3: [
        "萬|일만|만\n初|처음|초\n育|기를|육\n運|움직일|운\n帶|띠|대\n房|방|방\n系|이을|계\n集|모일|집",
        "臣|신하|신\n見|볼|견\n由|말미암을|유\n丁|장정|정\n陽|볕|양\n特|우뚝할|특\n武|굳셀|무\n活|살|활",
        "開|열|개\n接|사귈|접\n節|마디|절\n客|손님|객\n米|쌀|미\n進|나아갈|진\n切|끊을|절\n府|곳집|부",
        "州|고을|주\n限|한정할|한\n低|낮을|저\n戶|지게|호\n査|사실할|사\n常|항상|상\n刑|형벌|형\n格|이를|격",
        "材|재목|재\n細|가늘|세\n示|보일|시\n管|피리|관\n冷|차가울|냉\n結|맺을|결\n決|결단할|결\n型|거푸집|형",
        "兩|두|량\n極|가운데|극\n良|좋을|량\n兒|아이|아\n稅|구실|세\n路|길|노\n情|뜻|정\n孔|구멍|공",
        "尺|자|척\n亡|망할|망\n紅|붉을|홍\n處|살|처\n永|길|영\n差|어긋날|차\n等|가지런할|등\n打|때릴|타",
        "私|사사|사\n語|말씀|어\n感|감동할|감\n異|다를|리\n氷|얼음|빙\n師|스승|사\n然|불사를|연\n好|좋을|호",
        "仙|신선|선\n能|능할|능\n洋|큰 바다|양\n商|헤아릴|상\n如|같을|여\n里|마을|리\n對|마주볼|대\n近|가까울|근",
        "炭|숯|탄\n報|갚을|보\n役|부릴|역\n沙|모래|사\n基|터|기\n戰|싸움|전\n章|문채|장\n考|상고할|고",
        "淸|맑을|청\n派|물 갈래|파\n視|볼|시\n質|바탕|질\n過|지날|과\n象|코끼리|상\n邑|고을|읍\n補|기울|보",
        "吸|숨 들이쉴|흡\n資|재물|자\n守|지킬|수\n炎|불꽃|염\n宮|굴궐|궁\n現|나타날|현\n具|갖출|구\n意|뜻|의",
        "松|소나무|송\n因|인할|인\n片|조각|편\n思|생각할|사\n助|도울|조\n丹|붉을|단\n當|마땅할|당\n君|임금|군",
        "要|구할|요\n巨|클|거\n雲|구름|운\n修|닦을|수\n圖|그림|도\n河|물|하\n族|겨레|족\n雨|비|우",
        "農|농사|농\n毒|독|독\n件|조건|건\n完|완전할|완\n得|얻을|득\n久|오랠|구\n胞|태보|포\n爭|다툴|쟁",
        "隊|군대|대\n條|가지|조\n存|있을|존\n谷|골짜기|곡\n頭|머리|두\n消|다할|소\n委|맡길|위\n占|점칠|점",
        "抗|막을|항\n聖|성인|성\n陰|음기|음\n至|이를|지\n協|조화할|협\n村|마을|촌\n落|떨어질|낙\n灰|재|회",
        "脈|맥|맥\n延|미칠|연\n配|아내|배\n取|거둘|취\n附|붙을|부\n酸|초|산\n契|맺을|계\n戒|경계할|계",
        "居|살|거\n香|향내|향\n破|깨뜨릴|파\n他|다를|타",
    ].join('\n'),
    4: [
        "律|법|률\n周|두루|주\n根|뿌리|근\n植|심을|식\n體|몸|체\n從|좇을|종\n調|고를|조\n速|빠를|속",
        "寸|치|촌\n熱|뜨거울|열\n堂|집|당\n申|펼|신\n罪|허물|죄\n德|큰|덕\n便|똥오줌|변\n建|세울|건",
        "葉|고을이름|섭\n均|고를|균\n球|옥경쇠|구\n匠|장인|장\n華|꽃|화\n乳|젖|유\n飛|날|비\n卵|알|난",
        "費|쓸|비\n苦|쓸|고\n野|들판|야\n畵|그림|화\n財|재물|재\n句|글귀절|구\n免|면할|면\n團|둥글|단",
        "走|달릴|주\n第|집|제\n干|방패|간\n將|장차|장\n急|급할|급\n起|일어날|기\n求|찾을|구\n井|우물|정",
        "級|등급|급\n志|뜻|지\n英|꽃부리|영\n退|물러갈|퇴\n給|넉넉할|급\n問|물을|문\n眼|눈|안\n首|머리|수",
        "坐|앉을|좌\n易|바꿀|역\n郡|고을|군\n弓|활|궁\n種|씨|종\n精|정교할|정\n亞|버금|아\n玄|검을|현",
        "改|고칠|개\n密|빽빽할|밀\n組|끈|조\n準|수준기|준\n吏|벼슬아치|리\n染|꼭두서니|염\n歌|노래|가\n案|책상|안",
        "統|거느릴|통\n祭|제사|제\n住|살|주\n逆|거스를|역\n勞|수고할|노\n巡|돌|순\n換|바꿀|환\n版|조각|판",
        "包|꾸릴|포\n俗|익을|속\n池|못|지\n沈|성|심\n溫|따뜻할|온\n臺|능|대\n强|강할|강\n價|값|가",
        "今|이제|금\n忠|충성|충\n陸|뭍|륙\n例|법식|례\n奴|종|노\n惡|나쁠|악\n瓦|질그릇|와\n容|얼굴|용",
        "步|걸을|보\n備|깆출|비\n航|쌍배|항\n付|줄|부\n京|서울|경\n望|바랄|망\n伏|엎드릴|복\n副|버금|부",
        "害|해할|해\n男|사내|남\n茶|차풀|다\n裝|차려 입을|장\n移|옮길|이\n奇|기이할|기\n着|붙을|착\n貨|재화|화",
        "監|거느릴|감\n點|더러울|점\n折|꺾을|절\n降|내릴|강\n座|자리|좌\n乾|마를|간\n固|굳을|고\n核|실과|핵",
        "尾|꼬리|미\n味|맛|미\n脫|벗어날|탈\n散|흩을|산\n益|더할|익\n養|기를|양\n刻|새길|각\n設|베풀|설",
        "置|베풀|치\n液|즙|액\n阿|언덕|아\n銀|은|은\n龍|용|룡\n域|경계|역\n號|울부짖을|호\n殺|죽일|살",
        "詞|말씀|사\n祖|조상|조\n層|겹|층\n積|포갤|적\n舌|혀|설\n析|가를|석\n兄|맏이|형\n納|바칠|납",
        "遊|놀|유\n宇|집|우\n留|머무를|류\n舍|집|사\n權|권세|권\n宅|집|댁\n區|감출|구\n黑|검을|흑",
        "則|법칙|칙\n粉|가루|분\n奉|받들|봉\n斗|말|두\n冠|갓|관\n善|착할|선\n氏|성|씨\n除|섬돌|제",
        "以|써|이\n吉|길할|길\n磁|자석|자\n冊|책|책\n純|실|순\n柱|기둥|주\n試|시험할|시\n參|석|삼",
        "筆|붓|필\n效|본받을|효\n企|꾀할|기\n寒|찰|한\n爲|할|위\n究|궁리할|구\n牙|어금니|아\n砲|큰 대포|포",
    ].join('\n'),
    5: [
        "承|받들|승\n羊|양|양\n習|익힐|습\n虎|범|호\n甘|달|감\n乙|새|을\n封|봉할|봉\n陵|능|능",
        "始|비로소|시\n革|가죽|혁\n製|만들|제\n胎|아이 밸|태\n深|깊을|심\n遠|멀|원\n宣|베풀|선\n尙|오히려|상",
        "乘|오를|승\n介|낄|개\n弟|아우|제\n假|거짓|가\n詩|귀글|시\n亂|어지러울|난\n丸|알|환\n及|미칠|급",
        "菌|버섯|균\n規|그림쇠|규\n策|채찍|책\n壓|누를|압\n禮|예도|례\n沒|가라 앉을|몰\n達|통달할|달\n背|등|배",
        "席|자리|석\n株|그루|주\n供|이바지할|공\n函|상자|함\n丈|어른|장\n營|지을|영\n標|표시할|표\n注|물댈|주",
        "肥|살찔|비\n浮|뜰|부\n禁|금할|금\n類|무리|류\n虛|빌|허\n候|물을|후\n凶|흉할|흉\n愛|사랑|애",
        "帝|임금|제\n拜|절|배\n絲|실|사\n午|낮|오\n張|베풀|장\n想|생각할|상\n侍|모실|시\n施|베풀|시",
        "庫|곳집|고\n砂|모래|사\n鳥|새|조\n攻|칠|공\n必|반드시|필\n羽|깃|우\n訓|가르칠|훈\n話|말할|화",
        "追|쫓을|추\n債|빚|채\n呼|부를|호\n壯|씩씩할|장\n婚|혼인할|혼\n係|걸릴|계\n孤|외로울|고\n衆|무리|중",
        "奏|아뢸|주\n泉|샘|천\n卜|점|복\n終|끝낼|종\n充|가득찰|충\n復|돌아올|복\n超|뛰어넘을|초\n雪|눈|설",
        "徒|무리|도\n勢|권세|세\n順|좇을|순\n互|서로|호\n導|이끌|도\n仰|우러를|앙\n早|새벽|조\n獨|홀로|독",
        "圓|둥글|원\n階|섬돌|계\n底|밑|저\n劑|약 지을|제\n最|가장|최\n略|다스릴|략\n柳|버들|류\n我|자기|아",
        "應|응당|응\n刺|찌를|자\n孫|손자|손\n恩|은혜|은\n藥|약|약\n轉|구를|전\n陣|줄|진\n鄕|시골|향",
        "省|덜|생\n丘|언덕|구\n振|떨칠|진\n被|이불|피\n賣|팔|매\n痛|아플|통\n錄|기록할|녹\n聲|소리|성",
        "際|사이|제\n危|위태할|위\n店|가게|점\n凡|무릇|범\n孝|효도|효\n御|거느릴|어\n託|맡길|탁\n舞|춤출|무",
        "致|이를|치\n婦|며느리|부\n宿|잘|숙\n央|가운데|앙\n執|잡을|집\n待|기다릴|대\n皇|임금|황\n郞|사나이|랑",
        "微|작을|미\n庭|뜰|정\n福|복|복\n唐|당나라|당\n朴|나무껍질|박\n班|나눌|반\n混|섞을|혼\n汗|땀|한",
        "而|순접의 어조사|이\n殘|해칠|잔\n短|짧을|단\n關|빗장|관\n豫|기쁠|예\n夕|저녁|석\n邪|간사할|사\n段|층계|단",
        "妄|허망할|망\n往|갈|왕\n尹|다스릴|윤\n菜|나물|채\n軟|부드러울|연\n息|숨쉴|식\n束|묶을|속\n仲|버금|중",
        "邦|나라|방\n登|오를|등\n湖|호수|호\n裁|마름질할|재\n伐|칠|벌\n豆|콩|두\n故|옛|고\n尿|오줌|뇨",
        "湯|물 끓일|탕\n票|쪽지|표\n斷|끊을|단\n脂|기름|지\n態|모양|태\n訴|하소연할|소\n濟|나루|제\n遺|잃어버릴|유",
        "垂|드리울|수\n專|오로지|전\n突|부딪칠|돌\n複|겹옷|복\n旨|맛있을|지\n像|형상|상\n穴|굴|혈\n持|가질|지",
        "荷|연|하\n領|옷깃|령\n序|차례|서\n狂|미질|광\n減|덜|감\n證|증거|증\n札|패|찰\n麻|삼|마",
        "卒|군사|졸\n肺|허파|폐\n杖|지팡이|장\n刊|책 펴낼|간",
    ].join('\n'),
    6: [
        "彈|쏠|탄\n許|허락할|허\n佐|도울|좌\n妙|묘할|묘\n珠|구슬|주\n昌|창성할|창\n群|무리|군\n索|동아줄|삭",
        "陳|늘어놓을|진\n親|사랑할|친\n各|각각|각\n探|더듬을|탐\n推|옮길|추\n廣|넓을|광\n程|법|정\n智|슬기|지",
        "興|일|흥\n採|캘|채\n鬼|귀신|귀\n災|재앙|재\n偏|치우칠|편\n妻|아내|처\n泥|막힐|니\n筋|힘줄|근",
        "仕|벼슬할|사\n排|밀칠|배\n險|험할|험\n巾|수건|건\n囚|가둘|수\n幼|어릴|유\n抵|밀칠|저\n塔|탑|탑",
        "硏|연마할|연\n紋|무늬|문\n劇|심할|극\n圈|둥글|권\n威|위엄|위\n負|질|부\n旗|기|기\n枝|가지|지",
        "尊|존귀할|존\n了|마칠|료\n停|머무를|정\n亭|정자|정\n網|그물|망\n離|떼 놓을|리\n勝|이길|승\n責|꾸짖을|책",
        "寫|베낄|사\n針|바늘|침\n洪|큰물|홍\n牧|칠|목\n歲|해|세\n童|아이|동\n岸|물가 언덕|안\n職|벼슬|직",
        "洗|조촐할|선\n檢|교정할|검\n綠|초록빛|녹\n借|빌|차\n景|별|경\n屈|굽을|굴\n弘|넓을|홍\n紀|벼리|기",
        "耕|밭갈|경\n構|집세울|구\n快|기분이 좋을|쾌\n雄|수컷|웅\n幻|변할|환\n芽|싹|아\n浦|물가|포\n傷|상처|상",
        "吐|토할|토\n買|살|매\n秘|숨길|비\n膜|막|막\n何|어찌|하\n更|다시|갱\n批|칠|비\n暗|어두울|암",
        "滿|찰|만\n芳|꽃다울|방\n斜|비낄|사\n漢|한수|한\n輪|바퀴|륜\n宙|집|주\n映|비칠|영\n却|물리칠|각",
        "鐵|쇠|철\n側|곁|측\n胡|턱밑살|호\n尼|여승|니\n唱|노래|창\n照|비출|조\n拂|떨|불\n盲|소경|맹",
        "彩|무늬|채\n貴|높을|귀\n盤|소반|반\n園|동산|원\n弱|약할|약\n紫|자주빛|자\n敗|헐어질|패\n評|평론할|평",
        "韓|나라 이름|한\n卽|곧|즉\n旋|돌|선\n叉|깍지낄|차\n源|근원|원\n烏|까마귀|오\n伯|맏|백\n桃|복숭아 나무|도",
        "疫|염병|역\n祝|빌|축\n耐|견딜|내\n腸|창자|장\n帳|휘장 장막|장\n救|구원할|구\n般|옮길|반\n餘|남을|여",
        "議|말할|의\n殿|대궐|전\n依|의지할|의\n乞|구걸할|걸\n演|펼칠|연\n勇|날랠|용\n津|나루|진\n梅|매화나무|매",
        "總|꿰맬|총\n弔|위문할|조\n述|이을|술\n那|어찌|나\n陀|비탈|타\n境|지경|경\n勿|말|물\n瓜|오이|과",
        "煙|연기|연\n稱|저울질할|칭\n聞|들을|문\n屯|진칠|둔\n旅|군사|려\n舟|배|주\n巧|공교할|교\n缺|이지러질|결",
        "雜|섞일|잡\n銅|구리|동\n季|끝|계\n羅|새 그물|나\n錢|돈|전\n損|덜|손\n腦|머리|뇌\n汚|더러울|오",
        "荒|거칠|황\n樹|나무|수\n勤|부지런할|근\n秀|빼어날|수\n佳|아름다울|가\n昇|해 돋을|승\n値|값|치\n壽|목숨|수",
        "淨|맑을|정\n窓|창|창\n逸|달아날|일\n燈|등잔|등\n端|끝|단\n剛|굳을|강\n疾|병|질\n否|아닐|부",
        "吳|오나라|오\n越|넘을|월\n軸|바디집|축\n倉|곳집|창\n浪|물결|낭\n割|벨|할\n牌|방 붙일|패\n裂|찢을|렬",
        "肝|간|간\n辰|날|신\n捕|사로잡을|포\n腫|부스럼|종\n談|말씀|담\n忘|잊을|망\n啓|열|계\n閉|닫을|폐",
        "健|굳셀|건\n殊|죽을|수\n硬|굳을|경\n弄|희롱할|농",
    ].join('\n'),
};

// Keep a version's card order and options stable so an older tab can retry a submission.
const HANJA_VERSION_ = 'v2';
const HANJA_V1_ROWS_ = {
    1: [
        ['一', '하나', '일', '일등은 첫 번째예요.', '●'],
        ['二', '둘', '이', '이 인분은 두 사람 몫이에요.', '● ●'],
        ['三', '셋', '삼', '삼각형에는 모서리가 세 개 있어요.', '● ● ●'],
        ['四', '넷', '사', '사각형에는 변이 네 개 있어요.', '● ● ● ●'],
        ['五', '다섯', '오', '오각형에는 변이 다섯 개 있어요.', '● ● ● ● ●'],
        ['六', '여섯', '육', '육각형에는 변이 여섯 개 있어요.', '● ● ● ● ● ●'],
        ['山', '산', '산', '등산은 산에 오르는 일이에요.', '▲'],
        ['水', '물', '수', '수영은 물에서 헤엄치는 일이에요.', '졸졸 흐르는 것'],
        ['火', '불', '화', '화재는 불이 난 사고예요.', '타닥타닥 타는 것'],
        ['木', '나무', '목', '목재는 만들기에 쓰는 나무 재료예요.', '뿌리와 가지가 있어요'],
        ['日', '해', '일', '일출은 해가 떠오르는 일이에요.', '낮 하늘에서 밝게 빛나요'],
        ['月', '달', '월', '월식은 달이 지구의 그림자에 가려지는 일이에요.', '밤하늘에서 모양이 달라져요']
    ],
    2: [
        ['父', '아버지', '부', '부모는 아버지와 어머니를 뜻해요.'],
        ['母', '어머니', '모', '모녀는 어머니와 딸을 뜻해요.'],
        ['子', '아들', '자', '자녀는 아들과 딸을 뜻해요.'],
        ['女', '여자', '녀', '여성의 첫 글자에서는 소리를 ‘여’로 읽어요.'],
        ['人', '사람', '인', '인구는 일정한 곳에 사는 사람의 수예요.'],
        ['手', '손', '수', '악수는 서로 손을 잡고 인사하는 일이에요.'],
        ['足', '발', '족', '족적은 발이 남긴 흔적이에요.'],
        ['目', '눈', '목', '목격은 어떤 일을 눈으로 직접 보는 일이에요.'],
        ['口', '입', '구', '구강은 입 안을 말해요.'],
        ['耳', '귀', '이', '이비인후과의 ‘이’는 귀를 가리켜요.'],
        ['力', '힘', '력', '체력은 몸을 움직이고 버틸 수 있는 힘이에요.'],
        ['門', '문', '문', '교문은 학교에 들어가는 문이에요.']
    ],
    3: [
        ['東', '동쪽', '동', '동쪽 하늘에서 해가 떠요.'],
        ['西', '서쪽', '서', '해가 서쪽 하늘로 져요.'],
        ['南', '남쪽', '남', '남향 창은 남쪽을 바라보는 창이에요.'],
        ['北', '북쪽', '북', '북극은 지구의 가장 북쪽에 있어요.'],
        ['年', '해', '년', '학년은 학교에서 배우는 해의 차례예요.'],
        ['朝', '아침', '조', '조식은 아침 식사를 뜻해요.'],
        ['夜', '밤', '야', '야간은 밤 시간대를 뜻해요.'],
        ['春', '봄', '춘', '춘분 무렵에는 낮과 밤의 길이가 비슷해요.'],
        ['夏', '여름', '하', '하계 방학은 여름 방학이에요.'],
        ['秋', '가을', '추', '추계 운동회는 가을에 열리는 운동회예요.'],
        ['冬', '겨울', '동', '동계 스포츠는 겨울에 즐기는 스포츠예요.'],
        ['時', '때', '시', '시각은 어느 한 시점을 말해요.']
    ],
    4: [
        ['學', '배우다', '학', '학생은 학교에서 배우는 사람이에요.', '학교'],
        ['校', '학교', '교', '교실은 학교에서 수업을 하는 방이에요.', '교실'],
        ['書', '책', '서', '독서는 책을 읽는 활동이에요.', '독서'],
        ['文', '글', '문', '문장은 생각을 전하는 글의 한 단위예요.', '문장'],
        ['字', '글자', '자', '문자는 말을 적는 글자나 기호예요.', '문자'],
        ['算', '셈하다', '산', '계산은 수를 셈하는 일이에요.', '계산'],
        ['數', '수', '수', '수량은 물건이 얼마나 많은지 나타내요.', '수량'],
        ['讀', '읽다', '독', '낭독은 소리 내어 글을 읽는 일이에요.', '낭독'],
        ['友', '벗', '우', '우정은 친구 사이의 정이에요.', '우정'],
        ['樂', '즐겁다', '락', '오락은 재미로 즐기는 일이에요.', '오락'],
        ['食', '먹다', '식', '급식은 정해진 곳에서 음식을 나누어 주는 일이에요.', '급식'],
        ['休', '쉬다', '휴', '휴식은 하던 일을 멈추고 쉬는 일이에요.', '휴식']
    ],
    5: [
        ['未', '아직 아니다', '미', '미완성은 아직 끝까지 만들지 않았다는 뜻이에요.', '미완성', '末', '木'],
        ['末', '끝', '말', '주말은 한 주의 끝 무렵이에요.', '주말', '未', '本'],
        ['土', '흙', '토', '토양은 식물이 자라는 땅의 흙이에요.', '토양', '士', '王'],
        ['士', '선비', '사', '학사(學士)의 ‘사’에는 학문을 닦은 사람이라는 뜻이 들어 있어요.', '학사', '土', '王'],
        ['王', '임금', '왕', '왕국은 임금이 다스리는 나라예요.', '왕국', '玉', '主'],
        ['玉', '구슬', '옥', '옥석은 옥과 돌을 말해요. 옥은 빛깔이 고운 돌이에요.', '옥석', '王', '主'],
        ['本', '근본', '본', '기본은 바탕이 되는 것이에요.', '기본', '木', '末'],
        ['朱', '붉다', '주', '주홍색은 붉은빛이 강한 색이에요.', '주홍색', '未', '米'],
        ['犬', '개', '견', '반려견은 사람과 함께 살아가는 개예요.', '반려견', '大', '太'],
        ['太', '크다', '태', '태양은 지구에 빛을 비추는 아주 큰 별이에요.', '태양', '犬', '大'],
        ['己', '자기', '기', '자기(自己)는 바로 자기 자신을 뜻해요.', '자기', '已', '巳'],
        ['已', '이미', '이', '이미 지난 일을 이왕(已往)이라고도 해요.', '이왕', '己', '巳']
    ],
    6: [
        ['保', '지키다', '보', '보호는 위험이나 손상에서 지키는 일이에요.', '우리는 하천을 보호(保護)하려고 쓰레기를 주웠어요.'],
        ['觀', '살펴보다', '관', '관찰은 사물의 모습이나 변화를 자세히 보는 일이에요.', '돋보기로 잎맥을 관찰(觀察)했어요.'],
        ['察', '자세히 살피다', '찰', '고찰은 어떤 문제를 깊이 생각하고 살피는 일이에요.', '그 보고서에는 실험 결과에 대한 고찰(考察)이 담겼어요.'],
        ['測', '재다', '측', '측정은 길이·무게·온도 같은 값을 재는 일이에요.', '온도계로 물의 온도를 측정(測定)했어요.'],
        ['變', '바뀌다', '변', '변화는 모습이나 상태가 달라지는 일이에요.', '물이 얼음으로 바뀌는 변화(變化)를 기록했어요.'],
        ['化', '다른 상태가 되다', '화', '액체화는 어떤 물질이 액체 상태가 되는 일이에요.', '따뜻해지자 고체였던 물질이 액체화(液體化)되었어요.'],
        ['比', '견주다', '비', '비교는 둘 이상을 서로 견주어 차이를 살펴보는 일이에요.', '두 지도의 크기와 표시를 비교(比較)했어요.'],
        ['解', '풀다', '해', '해결은 문제를 풀어 어려움을 없애는 일이에요.', '친구들과 의논해 갈등을 해결(解決)했어요.'],
        ['選', '고르다', '선', '선택은 여럿 가운데 필요한 것을 고르는 일이에요.', '여러 방법 가운데 하나를 선택(選擇)했어요.'],
        ['記', '적다', '기', '기록은 나중에 볼 수 있도록 적어 두는 일이에요.', '날마다 싹의 길이를 기록(記錄)했어요.'],
        ['連', '잇다', '련', '연결은 서로 떨어진 것을 잇는 일이에요.', '두 전선을 연결(連結)하니 전등이 켜졌어요.'],
        ['論', '의논하다', '론', '토론은 서로의 의견과 근거를 주고받는 일이에요.', '모둠별로 쓰레기를 줄일 방법을 토론(討論)했어요.']
    ]
};

function hanjaCatalog_(version = HANJA_VERSION_, additions = []) {
    if (version !== 'v1' && version !== HANJA_VERSION_) return null;
    const grades = {};
    for (let grade = 1; grade <= 6; grade += 1) {
        const rows = HANJA_V1_ROWS_[grade];
        grades[grade] = {
            questionCount: version === 'v1' ? (grade <= 2 ? 3 : 5) : 20,
            cards: rows.map((row, index) => hanjaCard_(grade, rows, row, index))
        };
        if (version === HANJA_VERSION_) {
            const added = new Set(additions.filter(card => card.grade === grade).map(card => card.character));
            for (const line of HANJA_SUPPLEMENT_[grade].split('\n')) {
                const [character, meaning, reading] = line.split('|');
                if (!added.has(character)) grades[grade].cards.push(simpleHanjaCard_({
                    id: 'base-' + grade + '-' + character.codePointAt(0).toString(16), character, meaning, reading
                }, rows, grade));
            }
        }
    }
    for (const entry of additions) {
        const base = HANJA_V1_ROWS_[entry.grade];
        grades[entry.grade].cards.push(simpleHanjaCard_(entry, base, entry.grade));
    }
    return { version, grades };
}

function simpleHanjaCard_(entry, rows, grade) {
    const labels = [entry.meaning, ...rows.map(row => row[1])];
    return {
        ...entry,
        prompt: entry.character + '의 뜻은 무엇일까요?',
        options: [...new Set(labels)].slice(0, grade === 1 ? 2 : 3)
            .map((label, index) => ({ id: 'abc'[index], label })),
        correctOptionId: 'a',
    };
}

function drawHanjaMission_(grade, additions) {
    if (!/^[1-6]$/.test(String(grade))) throw new Error('학년을 골라 주세요.');
    const catalog = hanjaCatalog_(HANJA_VERSION_, additions);
    const { cards, questionCount } = catalog.grades[grade];
    const pool = cards.slice();
    for (let index = 0; index < questionCount; index += 1) {
        const swap = index + Math.floor(Math.random() * (pool.length - index));
        [pool[index], pool[swap]] = [pool[swap], pool[index]];
    }
    return { version: catalog.version, cards: pool.slice(0, questionCount) };
}

function validateTeacherCard_(input) {
    const text = key => typeof input[key] === 'string' ? input[key].trim() : '';
    const grade = Number(text('grade'));
    const character = text('character');
    const meaning = text('meaning');
    const reading = text('reading');
    const example = text('example');
    if (!/^[1-6]$/.test(text('grade')) || !/^\p{Script=Han}$/u.test(character) ||
        !meaning || meaning.length > 30 || !/^[가-힣]{1,4}$/.test(reading) || example.length > 100 ||
        /[\u0000-\u001f\u007f]/.test(meaning + example)) {
        throw new Error('학년, 한자 한 글자, 뜻과 한글 음을 확인해 주세요. 예문은 100자 이내예요.');
    }
    return { grade, character, meaning, reading, example };
}

function hanjaCard_(grade, rows, row, index) {
    const [character, meaning, reading, example, detail, similarA, similarB] = row;
    let prompt = character + '의 뜻은 무엇일까요?';
    let labels = hanjaChoices_(rows, index, 1, grade === 1 ? 2 : 3);
    if (grade === 3 && index % 2 === 0) {
        prompt = character + '의 음은 무엇일까요?';
        labels = hanjaChoices_(rows, index, 2, 3);
    }
    if (grade === 4) prompt = '‘' + detail + '’에 들어가는 ' + character + '의 뜻은 무엇일까요?';
    if (grade === 5) {
        prompt = '‘' + detail + '’에 쓰이는 한자 중 뜻이 ‘' + meaning + '’인 글자를 골라요.';
        labels = [character, similarA, similarB];
    }
    if (grade === 6) {
        prompt = detail + ' 여기에서 ' + character + '의 뜻은 무엇일까요?';
        labels = [meaning, rows[(index + 4) % rows.length][1], rows[(index + 8) % rows.length][1]];
    }
    const shift = index % labels.length;
    const ordered = labels.slice(shift).concat(labels.slice(0, shift));
    const options = ordered.map((label, i) => ({ id: 'abc'[i], label }));
    return {
        id: grade + '-' + String(index + 1).padStart(2, '0'),
        character,
        meaning,
        reading,
        example,
        clue: grade === 1 ? detail : '',
        prompt,
        options,
        correctOptionId: options.find(option => option.label === labels[0]).id
    };
}

function hanjaChoices_(rows, index, column, count) {
    const labels = rows.slice(index).concat(rows.slice(0, index)).map(row => row[column]);
    return [...new Set(labels)].slice(0, count);
}

function validateHanja_(payload, additions = []) {
    const { version, learningGrade, answers } = payload;
    const catalog = typeof version === 'string' && hanjaCatalog_(version, additions);
    if (!catalog) throw new Error('문제 버전을 확인할 수 없습니다. 새 퀴즈를 시작해 주세요.');
    const validGrade = Number.isInteger(learningGrade) || (typeof learningGrade === 'string' && /^[1-6]$/.test(learningGrade));
    const grade = validGrade ? Number(learningGrade) : 0;
    const level = catalog.grades[grade];
    if (!level || !Array.isArray(answers) || answers.length !== level.questionCount) {
        throw new Error('학습 학년과 퀴즈 답을 확인해 주세요.');
    }
    const seen = new Set();
    let correctCount = 0;
    for (const answer of answers) {
        const card = answer && level.cards.find(item => item.id === answer.questionId);
        if (!card || seen.has(card.id) || !card.options.some(option => option.id === answer.optionId)) {
            throw new Error('퀴즈 문항과 답을 확인해 주세요.');
        }
        seen.add(card.id);
        if (answer.optionId === card.correctOptionId) correctCount += 1;
    }
    return { version, learningGrade: grade, questionCount: level.questionCount, correctCount };
}

module.exports = { hanjaCatalog_, drawHanjaMission_, validateHanja_, validateTeacherCard_ };
