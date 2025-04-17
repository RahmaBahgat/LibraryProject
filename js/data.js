// Sample book data
const books = [
    {
        id: '1',
        title: 'Iron Flame',
        author: 'Rebecca Yarros',
        cover: '../images/books/Iron Flame (The Empyrean Book 2).jpeg',
        genre: 'Fiction',
        category: ['Dystopian Sci-Fi', 'Psychological Thriller'],
        rating: 4,
        status: 'Reading',
        progress: 65,
        isFavorite: false,
        description: `
        In a future where emotions are outlawed and minds are encased in digital Iron Frames, 
        one rogue engineer discovers a glitch in the system — a way to feel again. As he navigates a 
        world of surveillance, synthetic relationships, and mental imprisonment, he must decide: escape the frame 
        or shatter the world built around it.
        `,
        expanded: false,
        reviews: []
    },
    {
        id: '2',
        title: 'Onyx Storm',
        author: 'Rebecca Yarros',
        cover: '../images/books/Onyx Storm von Rebecca Yarros - Taschenbuch - 978-0-349-43707-1 _ Thalia.jpeg',
        genre: 'Fiction',
        category: ['Fantasy Romance', 'High Fantasy', 'New Adult'],
        rating: 4.8,
        status: 'Completed',
        progress: 100,
        isFavorite: false,
        description: `Onyx Storm is the third installment in Rebecca Yarros Empyrean series, 
        following Fourth Wing and Iron Flame. The story continues with Violet Sorrengail, 
        who has been training at Basgiath War College for over eighteen months, facing external threats and internal betrayals. 
        Violet embarks on a perilous journey beyond the deteriorating Aretian wards to seek alliances with unfamiliar lands to strengthen Navarre. 
        The novel delves into themes of loyalty, sacrifice, and the relentless pursuit of truth in a world teetering on the brink of chaos.`,
        expanded: false,
        reviews: []
    },
    {
        id: '3',
        title: 'في ممر الفئران',
        author: 'أحمد خالد توفيق',
        cover: '../images/books/أحمد خالد توفيق_ في ممر الفئران.jpeg',
        genre: 'Fiction',
        category: ['Psychology'],
        rating: 4,
        status: 'Want to Read',
        progress: 0,
        isFavorite: false,
        description: `
        تدور أحداث الرواية حول شخصية تُدعى "الشرقاوي" الذي يدخل في غيبوبة غير مفسرة.
        أثناء وجوده في المستشفى، ينتقل إلى عالم مظلم نتج عن سقوط نيزك حجب ضوء الشمس، مما أدى إلى اختفاء
        مصادر الطاقة وغرق العالم في الظلام.​ في هذا العالم، يظهر شخصية تُدعى "القومندان" الذي يفرض عقيدة الظلام كمذهب جديد، 
        حيث يُعاقب بالإعدام كل من يُضبط وهو يُنتج الضوء، حتى وإن كان إشعال نار بسيطة ينضم الشرقاوي إلى مجموعة متمردة تُدعى "النورانيين" تسعى لاستعادة 
        الضوء كحق طبيعي للجميع، مما يجعله مطاردًا من قبل السلطات تأخذهم مغامرتهم إلى جبال الهيمالايا على أمل إعادة الشمس أو على الأقل الانتقال من عالم الظلام إلى عالم النور.الرواية تتميز بنهاية مفاجئة وسوداوية تختلف عن النهايات التقليدية السعيدة
        `,
        expanded: false,
        reviews: []
    },
    {
        id: '4',
        title: '1948',
        author: 'George Orwell',
        cover: '../images/books/1984 by George Orwell.jpeg',
        genre: 'Fiction',
        category: ['Historical Fiction', 'Dystopian Fiction'],
        rating: 5,
        status: 'Completed',
        progress: 100,
        isFavorite: false,
        description: `
        "1984" is a dystopian novel set in a totalitarian society controlled by the Party, 
        led by the omnipresent and omnipotent figure known as Big Brother.The story follows Winston Smith, 
        an employee of the Ministry of Truth, who begins to question the oppressive regime and its control 
        over every aspect of life, including language, thought, and history. <br> The novel explores themes such as 
        surveillance, censorship, individuality versus state control, and the manipulation of truth. Orwells chilling vision of 
        a future society dominated by propaganda and authoritarianism remains relevant and thought-provoking, warning against the dangers 
        of absolute power and the loss of personal freedoms.
        `,
        expanded: false,
        reviews: []
    },
    {
        id: '5',
        title: 'الطنطورية',
        author: 'رُوىة الحسن',
        cover: '../images/books/رواية الطنطورية.jpeg',
        genre: 'Fiction',
        category: ['رواية أدبية', 'دراما سياسية', 'واقعية'],
        rating: 4.7,
        status: 'Completed',
        progress: 100,
        isFavorite: false,
        description: `
        تحكي الرواية قصة رُلى الطنطوري، فتاة فلسطينية من جنوب لبنان، 
        تعيش أحداثًا مؤلمة منذ طفولتها بسبب الاجتياح الإسرائيلي عام 1982
        تُجبر على ترك بيتها بعد أن ترى والدها يُقتل أمام عينيها، فتبدأ رحلة تنقّل بين المدن والمخيمات
        الفلسطينية من صور إلى صيدا إلى بيروت وطرابلس لتقدم لنا الرواية شهادة إنسانية مؤثرة عن معاناة اللاجئين الفلسطينيين في الشتات، وعن الحب، والفقد، والهوية
        `,
        expanded: false,
        reviews: []
    },
    {
        id: '6',
        title: 'ألف شمس ساطعة',
        author: 'khaled hussain',
        cover: '../images/books/ألف شمس ساطعة.jpeg',
        genre: 'Fiction',
        category: ['Social Commentary'],
        rating: 4.7,
        status: 'Completed',
        progress: 100,
        isFavorite: true,
        description: `
        تدور أحداث الرواية حول مريم، الابنة غير الشرعية لرجل أفغاني ثري،
        وليلى، الفتاة الجميلة والذكية التي تعيش حياة مرفهة حتى تندلع الحرب. 
        تجمعهما معاناة مشتركة في ظل الصراعات والحروب التي شهدتها أفغانستان، مما يؤدي إلى تطور علاقة قوية بينهما.
        تسلط الرواية الضوء على معاناة النساء الأفغانيات، التضحيات،
        والأمل في ظل الظروف القاسية تتميز بأسلوب سردي مؤثر وشخصيات عميقة، مما يجعلها قراءة لا تُنسى.​
        `,
        expanded: false,
        reviews: []
    },
    {
    id: '7',
    title: 'عداء الطائرة الورقية',
    author: 'khaled hussain',
    cover: '../images/books/عداء الطائرة الورقية.jpeg',
    genre: 'Fiction',
    category: ['رواية درامية', 'خيالية تاريخية'],
    rating: 4.7,
    status: 'Completed',
    progress: 100,
    isFavorite: false,
    description: `
    تدور أحداث الرواية حول "أمير"، فتى من حي وزير أكبر خان في كابل، وصديقه المقرب "حسن"، 
    خادم والده المنتمي إلى أقلية الهزارة. تتناول الرواية مواضيع الصداقة، الخيانة، والفداء، وتستعرض التغيرات السياسية
    والاجتماعية في أفغانستان، بدءًا من سقوط النظام الملكي، مرورًا بالتدخل العسكري السوفييتي، وصولًا إلى صعود نظام طالبان.
    `,
    expanded: false,
    reviews: []
    },
    {
        id: '8',
        title: 'As Long as the Lemon Trees Grow',
        author: 'Zoulfa Katouh',
        cover: '../images/books/As long as the lemon trees grow.jpeg',
        genre: 'Historical Fiction',
        category: ['War Drama', 'Political Fiction'],
        rating: 4.6,
        status: 'Want to Read',
        progress: 0,
        isFavorite: true,
        description: `
        A harrowing tale set during the Syrian revolution, 
        following Salama Kassab as she navigates her duties as a hospital volunteer 
        while planning her escape to Europe. Torn between loyalty to her country and survival, 
        she finds unexpected hope through a mysterious stranger.
        `,
        expanded: false,
        reviews: []
    },
    {
        id: '9',
        title: 'Fourth Wing',
        author: 'Rebecca Yarros',
        cover: '../images/books/Fourth Wing (International Edition).jpeg',
        genre: 'Fantasy',
        category: ['Dragon Fantasy', 'Romantasy'],
        rating: 4.8,
        status: 'Completed',
        progress: 100,
        isFavorite: true,
        description: `
        At Basgiath War College, twenty-year-old Violet Sorrengail defies expectations 
        by joining the elite dragon riders. In a deadly training program where riders bond with dragons or perish, 
        Violet must survive political intrigue and growing attraction to her enemy Xaden Riorson.
        `,
        expanded: false,
        reviews: []
    },
    {
        id: '10',
        title: 'Never Lie',
        author: 'Freida McFadden',
        cover: '../images/books/Never Lie.jpeg',
        genre: 'Thriller',
        category: ['Psychological Thriller', 'Mystery'],
        rating: 4.3,
        status: 'Reading',
        progress: 35,
        isFavorite: false,
        description: `
        Newlyweds Tricia and Ethan discover secret audio recordings in a 
        psychiatrist\'s isolated mansion during a snowstorm. As they listen to the late doctor\'s sessions 
        with a dangerous patient, they realize the killer might still be in the house.
        `,
        expanded: false,
        reviews: []
    },
    {
        id: '11',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        cover: '../images/books/Pride and Prejudice Book Covers - Choose Your Favorite! - Book Review - Hasty Book List.jpeg',
        genre: 'Classic',
        category: ['Regency Romance', 'Social Satire'],
        rating: 4.9,
        status: 'Completed',
        progress: 100,
        isFavorite: true,
        description: `
        The timeless story of Elizabeth Bennet navigating societal pressures and her complicated relationship
        with the proud Mr. Darcy. Austen\'s masterpiece explores class, reputation, and the dangers of 
        first impressions in 19th-century England.
        `,
        expanded: false,
        reviews: []
    },
    {
        id: '12',
        title: 'Reckless',
        author: 'Lauren Roberts',
        cover: '../images/books/New Fantasy Release - July 2024.jpeg',
        genre: 'Fantasy',
        category: ['Romantasy', 'Young Adult'],
        rating: 4.5,
        status: 'Reading',
        progress: 60,
        isFavorite: false,
        description: `
        In the kingdom of Ilya, Paedyn Gray, a Ordinary posing as a Psychic, 
        and Prince Kai Azer team up to survive the Purging Trials. 
        A dangerous game develops between the street thief and the warrior prince in this fantasy romance.`,
        expanded: false,
        reviews: []
    },
    {
        id: '13',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        cover: '../images/books/The Great Gatsby (Paper Mill Press Classics).jpeg',
        genre: 'Classic',
        category: ['American Literature', 'Tragedy'],
        rating: 4.7,
        status: 'Completed',
        progress: 100,
        isFavorite: true,
        description: `
        Jay Gatsby\'s extravagant parties and obsession with the married Daisy Buchanan reveal the dark underbelly of the Jazz Age. 
        Fitzgerald\'s seminal work explores the corruption of the American Dream through lavish prose and tragic romance.`,
        expanded: false,
        reviews: []
    },
    {
        id: '14',
        title: 'The Seven Year Slip',
        author: 'Ashley Poston',
        cover: '../images/books/The Seven Year Slip.jpeg',
        genre: 'Romance',
        category: ['Magical Realism', 'Time Travel'],
        rating: 4.4,
        status: 'Want to Read',
        progress: 0,
        isFavorite: false,
        description: `
        A publicist inherits a magical apartment where she meets a man from seven years in the past. 
        As they fall in love across time, they must confront whether their connection can survive different life stages.`,
        expanded: false,
        reviews: []
    },
    {
        id: '15',
        title: 'The Silent Patient',
        author: 'Alex Michaelides',
        cover: '../images/books/books I recommend.jpeg',
        genre: 'Thriller',
        category: ['Psychological Thriller', 'Mystery'],
        rating: 4.6,
        status: 'Completed',
        progress: 100,
        isFavorite: false,
        description: `
        Alicia Berenson hasn\'t spoken since shooting her husband five times. 
        Criminal psychotherapist Theo Faber becomes obsessed with uncovering her 
        secret in this gripping psychological thriller with a shocking twist.
        `,
        expanded: false,
        reviews: []
    },
    {
        id: '16',
        title: 'القصر الأسود',
        author: 'منى سلامة',
        cover: '../images/books/القصر الأسود.jpg',
        genre: 'Crime',
        category: ['Noir Fiction', 'Political Thriller', 'Investigative Journalism'],
        rating: 4.7,
        status: 'Completed',
        progress: 100,
        isFavorite: true,
        description: `
            رواية investigativa مثيرة تكشف الواقع المظلم خلف القصور الفاخرة في القاهرة. 
            الصحفية الشابة "نور" تكتشف جثة مسؤول رفيع في إحدى قصور الزعفرانة الفاخرة، 
            لتبدأ رحلة خطيرة تكشف خلالها شبكة فساد تمتد من صغار البلطجية إلى كبار رجال الدولة. 
            بين المافيا الإعلامية والصراع على السلطة، تتحول نور من كاتبة تقارير تافهة إلى هدف للاغتيال. 
            رواية تشريح دقيق للعلاقة بين الجريمة المنظمة والسلطة في المجتمع العربي المعاصر.
        `,
        expanded: false,
        reviews: []
    },
    {
        id: '17',
        title: 'جريمة في قطارالشرق',
        author: 'Agatha Christie',
        cover: '../images/books/جريمة في قطار الشرق.jpeg',
        genre: 'Mystery',
        category: ['Detective Fiction', 'Classic'],
        rating: 4.8,
        status: 'Completed',
        progress: 100,
        isFavorite: true,
        description: 'أشهر روايات أجاثا كريستي: المحقق هيركيول بوارو يحقق في جريمة قتل غامطة على متن قطار الشرق السريع المحاصر بالثلوج. كل الركاب مشتبه بهم في هذه التحفة البوليسية ذات النهاية الصادمة.',
        expanded: false,
        reviews: []
    },
    {
        id: '18',
        title: 'كافكا على الشاطئ (Kafka on the Shore)',
        author: 'هاروكي موراكامي',
        cover: '../images/books/كافكا على الشاطئ - هاروكي موراكامي _ books4all_net _ Free Download, Borrow, and Streaming _ Internet Archive.jpeg',
        genre: 'Magical Realism',
        category: ['Surreal Fiction', 'Philosophical'],
        rating: 4.7,
        status: 'Reading',
        progress: 45,
        isFavorite: true,
        description: 'رحلة كافكا تامورا المراهق هاربًا من لعبة أبيه، تتشابك مع قصة ناكاتا العجيب الذي يتحدث مع القطط. رواية سحرية تبحث عن الهوية عبر حدود الواقع والخيال.',
        expanded: false,
        reviews: []
    }
];

const authors = [
    {
      name: "Rebecca Yarros",
      bio: "Rebecca Yarros is a bestselling author known for emotional and gripping romance novels. Her book 'Fourth Wing' brought her massive acclaim, and she continues to captivate readers with her storytelling.",
      image: "Authors/Rebecca Yarros.jpeg"
    }
  ];
  


  // Related books data
const relatedBooks = {
    '1': ['2', '3', '9'],
    '2': ['1', '4', '9'],
    '3': ['5', '4', '18'],
    '4': ['3', '5', '13'],
    '5': ['3', '4', '18'], 
    '6': ['1-5', '7', '19'],
    '7': ['6', '8', '9'], 
    '8': ['7', '18'],
    '9': ['1', '2', '12'],
    '10': ['15'],  
    '11': ['13'],          
    '12': ['9', '14'],
    '13': ['11', '19'],
    '14': ['12', '19'], 
    '15': ['10', '16'],
    '16': ['15', '17'],
    '17': ['16', '18'], 
    '18': ['13', '14', '18'] 
};

function getRelatedBooks(bookId) {
    return relatedBooks[bookId]
        .map(id => books.find(book => book.id === id))
        .filter(book => book !== undefined);
}