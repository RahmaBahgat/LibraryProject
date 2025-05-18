import os
import django
from decimal import Decimal

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'onlinelibrary.settings')
django.setup()

from books.models import Book, Genre

# Book data in Python format
BOOKS_DATA = [
    {
        "title": "Iron Flame",
        "author": "Rebecca Yarros",
        "description": "In a future where emotions are outlawed and minds are encased in digital Iron Frames, one rogue engineer discovers a glitch in the system — a way to feel again. As he navigates a world of surveillance, synthetic relationships, and mental imprisonment, he must decide: escape the frame or shatter the world built around it.",
        "genre": "Fiction",
        "category": ["Dystopian Sci-Fi", "Psychological Thriller"],
        "rating": 4,
        "badge": None
    },
    {
        "title": "Onyx Storm",
        "author": "Rebecca Yarros",
        "description": "Onyx Storm is the third installment in Rebecca Yarros Empyrean series, following Fourth Wing and Iron Flame. The story continues with Violet Sorrengail, who has been training at Basgiath War College for over eighteen months, facing external threats and internal betrayals. Violet embarks on a perilous journey beyond the deteriorating Aretian wards to seek alliances with unfamiliar lands to strengthen Navarre. The novel delves into themes of loyalty, sacrifice, and the relentless pursuit of truth in a world teetering on the brink of chaos.",
        "genre": "Fiction",
        "category": ["Fantasy Romance", "High Fantasy", "New Adult"],
        "rating": 4.8,
        "badge": "new-release"
    },
    {
        "title": "في ممر الفئران",
        "author": "أحمد خالد توفيق",
        "description": "تدور أحداث الرواية حول شخصية تُدعى 'الشرقاوي' الذي يدخل في غيبوبة غير مفسرة. أثناء وجوده في المستشفى، ينتقل إلى عالم مظلم نتج عن سقوط نيزك حجب ضوء الشمس، مما أدى إلى اختفاء مصادر الطاقة وغرق العالم في الظلام. في هذا العالم، يظهر شخصية تُدعى 'القومندان' الذي يفرض عقيدة الظلام كمذهب جديد، حيث يُعاقب بالإعدام كل من يُضبط وهو يُنتج الضوء، حتى وإن كان إشعال نار بسيطة.",
        "genre": "Fiction",
        "category": ["Psychology"],
        "rating": 4,
        "badge": "bestselling"
    },
    {
        "title": "1984",
        "author": "George Orwell",
        "description": "'1984' is a dystopian novel set in a totalitarian society controlled by the Party, led by the omnipresent and omnipotent figure known as Big Brother. The story follows Winston Smith, an employee of the Ministry of Truth, who begins to question the oppressive regime and its control over every aspect of life, including language, thought, and history.",
        "genre": "Fiction",
        "category": ["Historical Fiction", "Dystopian Fiction"],
        "rating": 5,
        "badge": None
    },
    {
        "title": "الطنطورية",
        "author": "رضوى عاشور",
        "description": "تحكي الرواية قصة رُلى الطنطوري، فتاة فلسطينية من جنوب لبنان، تعيش أحداثًا مؤلمة منذ طفولتها بسبب الاجتياح الإسرائيلي عام 1982 تُجبر على ترك بيتها بعد أن ترى والدها يُقتل أمام عينيها، فتبدأ رحلة تنقّل بين المدن والمخيمات الفلسطينية من صور إلى صيدا إلى بيروت وطرابلس لتقدم لنا الرواية شهادة إنسانية مؤثرة عن معاناة اللاجئين الفلسطينيين في الشتات، وعن الحب، والفقد، والهوية",
        "genre": "Fiction",
        "category": ["رواية أدبية", "دراما سياسية", "واقعية"],
        "rating": 4.7,
        "badge": None
    },
    {
        "title": "ألف شمس ساطعة",
        "author": "Khaled Hosseini",
        "description": "تدور أحداث الرواية حول مريم، الابنة غير الشرعية لرجل أفغاني ثري، وليلى، الفتاة الجميلة والذكية التي تعيش حياة مرفهة حتى تندلع الحرب. تجمعهما معاناة مشتركة في ظل الصراعات والحروب التي شهدتها أفغانستان، مما يؤدي إلى تطور علاقة قوية بينهما. تسلط الرواية الضوء على معاناة النساء الأفغانيات، التضحيات، والأمل في ظل الظروف القاسية",
        "genre": "Fiction",
        "category": ["Social Commentary"],
        "rating": 4.7,
        "badge": "bestselling"
    },
    {
        "title": "عداء الطائرة الورقية",
        "author": "Khaled Hosseini",
        "description": "تدور أحداث الرواية حول 'أمير'، فتى من حي وزير أكبر خان في كابل، وصديقه المقرب 'حسن'، خادم والده المنتمي إلى أقلية الهزارة. تتناول الرواية مواضيع الصداقة، الخيانة، والفداء، وتستعرض التغيرات السياسية والاجتماعية في أفغانستان.",
        "genre": "Fiction",
        "category": ["رواية درامية", "خيالية تاريخية"],
        "rating": 4.7,
        "badge": "bestselling"
    },
    {
        "title": "As Long as the Lemon Trees Grow",
        "author": "Zoulfa Katouh",
        "description": "A harrowing tale set during the Syrian revolution, following Salama Kassab as she navigates her duties as a hospital volunteer while planning her escape to Europe. Torn between loyalty to her country and survival, she finds unexpected hope through a mysterious stranger.",
        "genre": "Historical Fiction",
        "category": ["War Drama", "Political Fiction"],
        "rating": 4.6,
        "badge": "trending"
    },
    {
        "title": "Fourth Wing",
        "author": "Rebecca Yarros",
        "description": "At Basgiath War College, twenty-year-old Violet Sorrengail defies expectations by joining the elite dragon riders. In a deadly training program where riders bond with dragons or perish, Violet must survive political intrigue and growing attraction to her enemy Xaden Riorson.",
        "genre": "Fantasy",
        "category": ["Dragon Fantasy", "Romantasy"],
        "rating": 4.8,
        "badge": None
    },
    {
        "title": "Never Lie",
        "author": "Freida McFadden",
        "description": "Newlyweds Tricia and Ethan discover secret audio recordings in a psychiatrist's isolated mansion during a snowstorm. As they listen to the late doctor's sessions with a dangerous patient, they realize the killer might still be in the house.",
        "genre": "Thriller",
        "category": ["Psychological Thriller", "Mystery"],
        "rating": 4.3,
        "badge": "trending"
    },
    {
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "description": "The timeless story of Elizabeth Bennet navigating societal pressures and her complicated relationship with the proud Mr. Darcy. Austen's masterpiece explores class, reputation, and the dangers of first impressions in 19th-century England.",
        "genre": "Classic",
        "category": ["Regency Romance", "Social Satire"],
        "rating": 4.9,
        "badge": None
    },
    {
        "title": "Reckless",
        "author": "Lauren Roberts",
        "description": "In the kingdom of Ilya, Paedyn Gray, a Ordinary posing as a Psychic, and Prince Kai Azer team up to survive the Purging Trials. A dangerous game develops between the street thief and the warrior prince in this fantasy romance.",
        "genre": "Fantasy",
        "category": ["Romantasy", "Young Adult"],
        "rating": 4.5,
        "badge": "trending"
    },
    {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "description": "Jay Gatsby's extravagant parties and obsession with the married Daisy Buchanan reveal the dark underbelly of the Jazz Age. Fitzgerald's seminal work explores the corruption of the American Dream through lavish prose and tragic romance.",
        "genre": "Classic",
        "category": ["American Literature", "Tragedy"],
        "rating": 4.7,
        "badge": None
    },
    {
        "title": "The Seven Year Slip",
        "author": "Ashley Poston",
        "description": "A publicist inherits a magical apartment where she meets a man from seven years in the past. As they fall in love across time, they must confront whether their connection can survive different life stages.",
        "genre": "Romance",
        "category": ["Magical Realism", "Time Travel"],
        "rating": 4.4,
        "badge": None
    },
    {
        "title": "The Silent Patient",
        "author": "Alex Michaelides",
        "description": "Alicia Berenson hasn't spoken since shooting her husband five times. Criminal psychotherapist Theo Faber becomes obsessed with uncovering her secret in this gripping psychological thriller with a shocking twist.",
        "genre": "Thriller",
        "category": ["Psychological Thriller", "Mystery"],
        "rating": 4.6,
        "badge": "trending"
    },
    {
        "title": "القصر الأسود",
        "author": "منى سلامة",
        "description": "رواية investigativa مثيرة تكشف الواقع المظلم خلف القصور الفاخرة في القاهرة. الصحفية الشابة 'نور' تكتشف جثة مسؤول رفيع في إحدى قصور الزعفرانة الفاخرة، لتبدأ رحلة خطيرة تكشف خلالها شبكة فساد تمتد من صغار البلطجية إلى كبار رجال الدولة.",
        "genre": "Crime",
        "category": ["Noir Fiction", "Political Thriller", "Investigative Journalism"],
        "rating": 4.7,
        "badge": None
    },
    {
        "title": "جريمة في قطارالشرق",
        "author": "Agatha Christie",
        "description": "أشهر روايات أجاثا كريستي: المحقق هيركيول بوارو يحقق في جريمة قتل غامطة على متن قطار الشرق السريع المحاصر بالثلوج. كل الركاب مشتبه بهم في هذه التحفة البوليسية ذات النهاية الصادمة.",
        "genre": "Mystery",
        "category": ["Detective Fiction", "Classic"],
        "rating": 4.8,
        "badge": None
    },
    {
        "title": "كافكا على الشاطئ",
        "author": "هاروكي موراكامي",
        "description": "رحلة كافكا تامورا المراهق هاربًا من لعبة أبيه، تتشابك مع قصة ناكاتا العجيب الذي يتحدث مع القطط. رواية سحرية تبحث عن الهوية عبر حدود الواقع والخيال.",
        "genre": "Magical Realism",
        "category": ["Surreal Fiction", "Philosophical"],
        "rating": 4.7,
        "badge": None
    },
    {
        "title": "Yellow Face",
        "author": "R. F. Kuang",
        "description": "June Hayward, an unsuccessful young author, finds herself the only witness to the death of her former classmate and casual friend, Athena Liu, a Chinese-American author who is an industry darling. She decides to position herself as the best friend of the author and begins to edit and re-write Athena's latest unpublished manuscript, a novel about Chinese laborers in World War I",
        "genre": "Fiction",
        "category": ["Fiction", "Contemporary"],
        "rating": 3.7,
        "badge": "trending"
    },
    {
        "title": "يوتوبيا",
        "author": "أحمد خالد توفيق",
        "description": "تدور أحداث الرواية في سنة 2023 حيث تحولت مصر إلى طبقتين، الأولى بالغة الثراء والرفاهية وهي (يوتوبيا) المدينة المحاطة بسور ويحرسها جنود المارينز التي تقع في الساحل الشمالي والثانية فقر مدقع وتعيش في عشوائيات ويتقاتلون من أجل الطعام",
        "genre": "Fiction",
        "category": ["Fiction", "Contemporary"],
        "rating": 5,
        "badge": None
    },
    {
        "title": "قنبلة للاستخدام الشخصي",
        "author": "ميرنا المهدي",
        "description": "",
        "genre": "Crime",
        "category": ["Crime", "Mystery"],
        "rating": 3.7,
        "badge": "trending"
    },
    {
        "title": "حذاء فادي",
        "author": "يوسف الدموكي",
        "description": "June Hayward, an unsuccessful young author, finds herself the only witness to the death of her former classmate and casual friend, Athena Liu, a Chinese-American author who is an industry darling. She decides to position herself as the best friend of the author and begins to edit and re-write Athena's latest unpublished manuscript, a novel about Chinese laborers in World War I",
        "genre": "Social",
        "category": ["Social", "Realist"],
        "rating": 3,
        "badge": None
    },
    {
        "title": "Watch Me",
        "author": "Tahereh Mafi",
        "description": "James Anderson had a plan. Or half of one. All that matters is that he managed to do what his older brother, the famous Aaron Warner Anderson, never did: infiltrate Ark Island, the last refuge of The Reestablishment. In the past decade no outsider has breached the stronghold of the authoritarian regime, but James is in. In a prison cell, sure, but as far as James is concerned, a win is a win.",
        "genre": "Fantasy",
        "category": ["Romance", "Dystopia"],
        "rating": 4.3,
        "badge": "coming-soon"
    },
    {
        "title": "Great Big Beautiful Life",
        "author": "Emily Henry",
        "description": "Two writers compete for the chance to tell the larger-than-life story of a woman with more than a couple of plot twists up her sleeve in this dazzling and sweeping new novel from Emily Henry.",
        "genre": "Fiction",
        "category": ["Romance", "Contemporary"],
        "rating": 4.19,
        "badge": "coming-soon"
    },
    {
        "title": "Fearless",
        "author": "Lauren Roberts",
        "description": "In the kingdom of Ilya, where magic is power and lies are the foundation of society, Paedyn Gray must navigate a dangerous world of deception and betrayal to protect those she loves.",
        "genre": "Fantasy",
        "category": ["Romantasy", "Young Adult"],
        "rating": 4.35,
        "badge": None
    }
]

def add_books_to_database():
    for book_data in BOOKS_DATA:
        # Check if book already exists
        if not Book.objects.filter(title=book_data['title']).exists():
            try:
                # Create the book
                book = Book.objects.create(
                    title=book_data['title'],
                    author=book_data['author'],
                    description=book_data['description'].strip(),
                    badge=book_data.get('badge'),
                    average_rating=float(book_data.get('rating', 0))
                )
                
                # Add genres
                for category in book_data.get('category', []):
                    genre, _ = Genre.objects.get_or_create(name=category)
                    book.genres.add(genre)
                
                print(f"Added book: {book.title}")
            except Exception as e:
                print(f"Error adding book {book_data['title']}: {str(e)}")
        else:
            print(f"Book already exists: {book_data['title']}")

if __name__ == '__main__':
    add_books_to_database() 