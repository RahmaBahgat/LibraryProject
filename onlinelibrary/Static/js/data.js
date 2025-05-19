// Sample book data
let books = JSON.parse(localStorage.getItem('books')) || [
  {
    id: "1",
    title: "Iron Flame",
    author: "Rebecca Yarros",
    cover: "images/books/Iron Flame Cover.jpeg",
    spine: "images/books/Iron Flame spine.png",
    genre: "Fiction",
    category: ["Dystopian Sci-Fi", "Psychological Thriller"],
    rating: 4,
    status: "Reading",
    progress: 65,
    isFavorite: false,
    isBorrowed: false,
    description: `
        In a future where emotions are outlawed and minds are encased in digital Iron Frames, 
        one rogue engineer discovers a glitch in the system — a way to feel again. As he navigates a 
        world of surveillance, synthetic relationships, and mental imprisonment, he must decide: escape the frame 
        or shatter the world built around it.
        `,
    expanded: false,
    reviews: [],
  },
  {
    id: "2",
    title: "Onyx Storm",
    author: "Rebecca Yarros",
    cover: "images/books/Onyx Storm Cover.jpeg",
    spine: "images/books/Onyx Storm spine.jpg",
    genre: "Fiction",
    category: ["Fantasy Romance", "High Fantasy", "New Adult"],
    rating: 4.8,
    status: "Completed",
    progress: 100,
    isFavorite: false,
    isBorrowed: false,
    description: `Onyx Storm is the third installment in Rebecca Yarros Empyrean series, 
        following Fourth Wing and Iron Flame. The story continues with Violet Sorrengail, 
        who has been training at Basgiath War College for over eighteen months, facing external threats and internal betrayals. 
        Violet embarks on a perilous journey beyond the deteriorating Aretian wards to seek alliances with unfamiliar lands to strengthen Navarre. 
        The novel delves into themes of loyalty, sacrifice, and the relentless pursuit of truth in a world teetering on the brink of chaos.`,
    expanded: false,
    reviews: [],
    badge: "new-release",
  },
  {
    id: "3",
    title: "في ممر الفئران",
    author: "أحمد خالد توفيق",
    cover: "images/books/في ممر الفئران.jpeg",
    genre: "Fiction",
    category: ["Psychology"],
    rating: 4,
    status: "Want to Read",
    progress: 0,
    isFavorite: false,
    isBorrowed: false,
    description: `
        تدور أحداث الرواية حول شخصية تُدعى "الشرقاوي" الذي يدخل في غيبوبة غير مفسرة.
        أثناء وجوده في المستشفى، ينتقل إلى عالم مظلم نتج عن سقوط نيزك حجب ضوء الشمس، مما أدى إلى اختفاء
        مصادر الطاقة وغرق العالم في الظلام.​ في هذا العالم، يظهر شخصية تُدعى "القومندان" الذي يفرض عقيدة الظلام كمذهب جديد، 
        حيث يُعاقب بالإعدام كل من يُضبط وهو يُنتج الضوء، حتى وإن كان إشعال نار بسيطة ينضم الشرقاوي إلى مجموعة متمردة تُدعى "النورانيين" تسعى لاستعادة 
        الضوء كحق طبيعي للجميع، مما يجعله مطاردًا من قبل السلطات تأخذهم مغامرتهم إلى جبال الهيمالايا على أمل إعادة الشمس أو على الأقل الانتقال من عالم الظلام إلى عالم النور.الرواية تتميز بنهاية مفاجئة وسوداوية تختلف عن النهايات التقليدية السعيدة
        `,
    expanded: false,
    reviews: [],
    badge: "bestselling",
  },
  {
    id: "4",
    title: "1984",
    author: "George Orwell",
    cover: "images/books/1984.jpeg",
    genre: "Fiction",
    category: ["Historical Fiction", "Dystopian Fiction"],
    rating: 5,
    status: "Completed",
    progress: 100,
    isFavorite: false,
    isBorrowed: false,
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
    reviews: [],
  },
  {
    id: "5",
    title: "الطنطورية",
    author: "رضوى عاشور",
    cover: "images/books/الطنطورية.jpeg",
    genre: "Fiction",
    category: ["رواية أدبية", "دراما سياسية", "واقعية"],
    rating: 4.7,
    status: "Completed",
    progress: 100,
    isFavorite: false,
    isBorrowed: false,
    description: `
        تحكي الرواية قصة رُلى الطنطوري، فتاة فلسطينية من جنوب لبنان، 
        تعيش أحداثًا مؤلمة منذ طفولتها بسبب الاجتياح الإسرائيلي عام 1982
        تُجبر على ترك بيتها بعد أن ترى والدها يُقتل أمام عينيها، فتبدأ رحلة تنقّل بين المدن والمخيمات
        الفلسطينية من صور إلى صيدا إلى بيروت وطرابلس لتقدم لنا الرواية شهادة إنسانية مؤثرة عن معاناة اللاجئين الفلسطينيين في الشتات، وعن الحب، والفقد، والهوية
        `,
    expanded: false,
    reviews: [],
  },
  {
    id: "6",
    title: "ألف شمس ساطعة",
    author: "Khaled Hosseini",
    cover: "images/books/ألف شمس ساطعة.jpeg",
    genre: "Fiction",
    category: ["Social Commentary"],
    rating: 4.7,
    status: "Completed",
    progress: 100,
    isFavorite: false,
    isBorrowed: false,
    description: `
        تدور أحداث الرواية حول مريم، الابنة غير الشرعية لرجل أفغاني ثري،
        وليلى، الفتاة الجميلة والذكية التي تعيش حياة مرفهة حتى تندلع الحرب. 
        تجمعهما معاناة مشتركة في ظل الصراعات والحروب التي شهدتها أفغانستان، مما يؤدي إلى تطور علاقة قوية بينهما.
        تسلط الرواية الضوء على معاناة النساء الأفغانيات، التضحيات،
        والأمل في ظل الظروف القاسية تتميز بأسلوب سردي مؤثر وشخصيات عميقة، مما يجعلها قراءة لا تُنسى.​
        `,
    expanded: false,
    reviews: [],
    badge: "bestselling",
  },
  {
    id: "7",
    title: "عداء الطائرة الورقية",
    author: "Khaled Hosseini",
    cover: "images/books/عداء الطائرة الورقية.jpeg",
    genre: "Fiction",
    category: ["رواية درامية", "خيالية تاريخية"],
    rating: 4.7,
    status: "Completed",
    progress: 100,
    isFavorite: false,
    isBorrowed: false,
    description: `
    تدور أحداث الرواية حول "أمير"، فتى من حي وزير أكبر خان في كابل، وصديقه المقرب "حسن"، 
    خادم والده المنتمي إلى أقلية الهزارة. تتناول الرواية مواضيع الصداقة، الخيانة، والفداء، وتستعرض التغيرات السياسية
    والاجتماعية في أفغانستان، بدءًا من سقوط النظام الملكي، مرورًا بالتدخل العسكري السوفييتي، وصولًا إلى صعود نظام طالبان.
    `,
    expanded: false,
    reviews: [],
    badge: "bestselling",
  },
  {
    id: "8",
    title: "As Long as the Lemon Trees Grow",
    author: "Zoulfa Katouh",
    cover: "images/books/As long as the lemon trees grow.jpeg",
    genre: "Historical Fiction",
    category: ["War Drama", "Political Fiction"],
    rating: 4.6,
    status: "Want to Read",
    progress: 0,
    isFavorite: false,
    isBorrowed: false,
    description: `
        A harrowing tale set during the Syrian revolution, 
        following Salama Kassab as she navigates her duties as a hospital volunteer 
        while planning her escape to Europe. Torn between loyalty to her country and survival, 
        she finds unexpected hope through a mysterious stranger.
        `,
    expanded: false,
    reviews: [],
    badge: "trending",
  },
  {
    id: "9",
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    cover: "images/books/Fourth Wing Cover.jpeg",
    spine: "images/books/Fourth Wing spine.jpg",
    genre: "Fantasy",
    category: ["Dragon Fantasy", "Romantasy"],
    rating: 4.8,
    status: "Completed",
    progress: 100,
    isFavorite: false,
    isBorrowed: false,
    description: `
        At Basgiath War College, twenty-year-old Violet Sorrengail defies expectations 
        by joining the elite dragon riders. In a deadly training program where riders bond with dragons or perish, 
        Violet must survive political intrigue and growing attraction to her enemy Xaden Riorson.
        `,
    expanded: false,
    reviews: [],
  },
  {
    id: "10",
    title: "Never Lie",
    author: "Freida McFadden",
    cover: "images/books/Never Lie.jpeg",
    genre: "Thriller",
    category: ["Psychological Thriller", "Mystery"],
    rating: 4.3,
    status: "Reading",
    progress: 35,
    isFavorite: false,
    isBorrowed: false,
    description: `
        Newlyweds Tricia and Ethan discover secret audio recordings in a 
        psychiatrist\'s isolated mansion during a snowstorm. As they listen to the late doctor\'s sessions 
        with a dangerous patient, they realize the killer might still be in the house.
        `,
    expanded: false,
    reviews: [],
    badge: "trending",
  },
  {
    id: "11",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "images/books/Pride and Prejudice.jpeg",
    genre: "Classic",
    category: ["Regency Romance", "Social Satire"],
    rating: 4.9,
    status: "Completed",
    progress: 100,
    isFavorite: false,
    isBorrowed: false,
    description: `
        The timeless story of Elizabeth Bennet navigating societal pressures and her complicated relationship
        with the proud Mr. Darcy. Austen\'s masterpiece explores class, reputation, and the dangers of 
        first impressions in 19th-century England.
        `,
    expanded: false,
    reviews: [],
  },
  {
    id: "12",
    title: "Reckless",
    author: "Lauren Roberts",
    cover: "images/books/Reckless.jpeg",
    genre: "Fantasy",
    category: ["Romantasy", "Young Adult"],
    rating: 4.5,
    status: "Reading",
    progress: 60,
    isFavorite: false,
    isBorrowed: false,
    description: `
        In the kingdom of Ilya, Paedyn Gray, a Ordinary posing as a Psychic, 
        and Prince Kai Azer team up to survive the Purging Trials. 
        A dangerous game develops between the street thief and the warrior prince in this fantasy romance.`,
    expanded: false,
    reviews: [],
    badge: "trending",
  },
  {
    id: "13",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "images/books/The Great Gatsby.jpeg",
    genre: "Classic",
    category: ["American Literature", "Tragedy"],
    rating: 4.7,
    status: "Completed",
    progress: 100,
    isFavorite: false,
    isBorrowed: false,
    description: `
        Jay Gatsby\'s extravagant parties and obsession with the married Daisy Buchanan reveal the dark underbelly of the Jazz Age. 
        Fitzgerald\'s seminal work explores the corruption of the American Dream through lavish prose and tragic romance.`,
    expanded: false,
    reviews: [],
  },
  {
    id: "14",
    title: "The Seven Year Slip",
    author: "Ashley Poston",
    cover: "images/books/The Seven Year Slip.jpeg",
    genre: "Romance",
    category: ["Magical Realism", "Time Travel"],
    rating: 4.4,
    status: "Want to Read",
    progress: 0,
    isFavorite: false,
    isBorrowed: false,
    description: `
        A publicist inherits a magical apartment where she meets a man from seven years in the past. 
        As they fall in love across time, they must confront whether their connection can survive different life stages.`,
    expanded: false,
    reviews: [],
  },
  {
    id: "15",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    cover: "images/books/The Silent Patient.jpeg",
    genre: "Thriller",
    category: ["Psychological Thriller", "Mystery"],
    rating: 4.6,
    status: "Completed",
    progress: 100,
    isFavorite: false,
    isBorrowed: false,
    description: `
        Alicia Berenson hasn\'t spoken since shooting her husband five times. 
        Criminal psychotherapist Theo Faber becomes obsessed with uncovering her 
        secret in this gripping psychological thriller with a shocking twist.
        `,
    expanded: false,
    reviews: [],
    badge: "trending",
  },
  {
    id: "16",
    title: "القصر الأسود",
    author: "محمد المنسي قنديل",
    cover: "images/books/القصر الأسود.jpg",
    genre: "Crime",
    category: [
      "Noir Fiction",
      "Political Thriller",
      "Investigative Journalism",
    ],
    rating: 4.7,
    status: "Completed",
    progress: 100,
    isFavorite: false,
    isBorrowed: false,
    description: `
            رواية investigativa مثيرة تكشف الواقع المظلم خلف القصور الفاخرة في القاهرة. 
            الصحفية الشابة "نور" تكتشف جثة مسؤول رفيع في إحدى قصور الزعفرانة الفاخرة، 
            لتبدأ رحلة خطيرة تكشف خلالها شبكة فساد تمتد من صغار البلطجية إلى كبار رجال الدولة. 
            بين المافيا الإعلامية والصراع على السلطة، تتحول نور من كاتبة تقارير تافهة إلى هدف للاغتيال. 
            رواية تشريح دقيق للعلاقة بين الجريمة المنظمة والسلطة في المجتمع العربي المعاصر.
        `,
    expanded: false,
    reviews: [],
  },
  {
    id: "17",
    title: "جريمة في قطارالشرق",
    author: "Agatha Christie",
    cover: "images/books/جريمة في قطار الشرق.jpeg",
    genre: "Mystery",
    category: ["Detective Fiction", "Classic"],
    rating: 4.8,
    status: "Completed",
    progress: 100,
    isFavorite: false,
    isBorrowed: false,
    description:
      "أشهر روايات أجاثا كريستي: المحقق هيركيول بوارو يحقق في جريمة قتل غامطة على متن قطار الشرق السريع المحاصر بالثلوج. كل الركاب مشتبه بهم في هذه التحفة البوليسية ذات النهاية الصادمة.",
    expanded: false,
    reviews: [],
  },
  {
    id: "18",
    title: "كافكا على الشاطئ",
    author: "هاروكي موراكامي",
    cover: "images/books/كافكا على الشاطئ.jpeg",
    genre: "Magical Realism",
    category: ["Surreal Fiction", "Philosophical"],
    rating: 4.7,
    status: "Reading",
    progress: 45,
    isFavorite: false,
    isBorrowed: false,
    description:
      "رحلة كافكا تامورا المراهق هاربًا من لعبة أبيه، تتشابك مع قصة ناكاتا العجيب الذي يتحدث مع القطط. رواية سحرية تبحث عن الهوية عبر حدود الواقع والخيال.",
    expanded: false,
    reviews: [],
  },

  {
    id: "19",
    title: "Yellow Face",
    author: "R. F. Kuang",
    cover: "images/books/Yellow Face.jpg",
    genre: "Fiction",
    category: [" Fiction", "Contemporary"],
    rating: 3.7,
    status: "Want to read",
    progress: 0,
    isFavorite: false,
    description:
      "June Hayward, an unsuccessful young author, finds herself the only witness to the death of her former classmate and casual friend, Athena Liu, a Chinese-American author who is an industry darling. She decides to position herself as the best friend of the author and begins to edit and re-write Athena's latest unpublished manuscript, a novel about Chinese laborers in World War I",
    expanded: false,
    reviews: [],
    badge: "trending",
  },

  {
    id: "20",
    title: "يوتوبيا",
    author: "أحمد خالد توفيق",
    cover: "images/books/يوتوبيا.jpeg",
    genre: "Fiction",
    category: [" Fiction", "Contemporary"],
    rating: 5,
    status: "Want to read",
    progress: 0,
    isFavorite: false,
    isBorrowed: false,
    description:
      "تدور أحداث الرواية في سنة 2023 حيث تحولت مصر إلى طبقتين، الأولى بالغة الثراء والرفاهية وهي (يوتوبيا) المدينة المحاطة بسور ويحرسها جنود المارينز التي تقع في الساحل الشمالي والثانية فقر مدقع وتعيش في عشوائيات ويتقاتلون من أجل الطعام ",
    expanded: false,
    reviews: [],
  },
  {
    id: "21",
    title: "قنبلة للاستخدام الشخصي",
    author: "ميرنا المهدي",
    cover: "images/books/قنبلة للاستخدام الشخصي.jpg",
    genre: "Crime",
    category: ["Crime", "Mystery"],
    rating: 3.7,
    status: "Want to read",
    progress: 0,
    isFavorite: false,
    isBorrowed: false,
    description: "",
    expanded: false,
    reviews: [],
    badge: "trending",
  },
  {
    id: "22",
    title: "حذاء فادي",
    author: "فاطمة شرف الدين",
    cover: "images/books/حذاء فادي.jpeg",
    genre: "Social",
    category: [" Social", "Realist"],
    rating: 3,
    status: "Want to read",
    progress: 0,
    isFavorite: false,
    isBorrowed: false,
    description:
      "June Hayward, an unsuccessful young author, finds herself the only witness to the death of her former classmate and casual friend, Athena Liu, a Chinese-American author who is an industry darling. She decides to position herself as the best friend of the author and begins to edit and re-write Athena's latest unpublished manuscript, a novel about Chinese laborers in World War I",
    expanded: false,
    reviews: [],
  },

  {
    id: "23",
    title: "Watch Me",
    author: "Sophia Amoruso",
    cover: "images/books/Watch Me.jpg",
    genre: "Fantasy",
    category: [" Romance", "Dystopia"],
    rating: 4.3,
    status: "Want to read",
    progress: 0,
    isFavorite: false,
    isBorrowed: false,
    description:
      "James Anderson had a plan. Or half of one. All that matters is that he managed to do what his older brother, the famous Aaron Warner Anderson, never did: infiltrate Ark Island, the last refuge of The Reestablishment. In the past decade no outsider has breached the stronghold of the authoritarian regime, but James is in. In a prison cell, sure, but as far as James is concerned, a win is a win.",
    expanded: false,
    reviews: [],
    badge: "coming-soon",
  },

  {
    id: "24",
    title: "Great Big Beautiful Life",
    author: "Ava Reid",
    cover: "images/books/Great Big Beautiful Life.jpg",
    genre: "Fiction",
    category: ["Romance", "Contemporary"],
    rating: 4.19,
    status: "Want to read",
    progress: 0,
    isFavorite: false,
    isBorrowed: false,
    description:
      "Two writers compete for the chance to tell the larger-than-life story of a woman with more than a couple of plot twists up her sleeve in this dazzling and sweeping new novel from Emily Henry.",
    expanded: false,
    reviews: [],
    badge: "coming-soon",
  },

  {
    id: "25",
    title: "Fearless",
    author: "Rebecca Yarros",
    cover: "images/books/Fearless.jpg",
    genre: "Fantasy",
    category: ["Romantasy", "Young Adult"],
    rating: 4.35,
    status: "Want to read",
    progress: 0,
    isFavorite: false,
    isBorrowed: false,
    description:
      "Paedyn and Kai are reunited but face a terrible decision in this thrilling conclusion to the New York Times bestselling romantic fantasy trilogy perfect for fans of Sarah J. Maas and The Red Queen.",
    expanded: false,
    reviews: [],
    badge: "coming-soon",
  },
];

const authors = [
  {
    name: "Rebecca Yarros",
    bio: "Rebecca Yarros is a bestselling author known for emotional and gripping romance novels. Her book 'Fourth Wing' brought her massive acclaim, and she continues to captivate readers with her storytelling.",
    image: "Authors/Rebecca Yarros.jpeg",
  },
];

// Related books data
const relatedBooks = {
  1: ["2", "3", "9"],
  2: ["1", "4", "9"],
  3: ["5", "4", "18"],
  4: ["3", "5", "13"],
  5: ["3", "4", "18"],
  6: ["1-5", "7", "19"],
  7: ["6", "8", "9"],
  8: ["7", "18"],
  9: ["1", "2", "12"],
  10: ["15"],
  11: ["13"],
  12: ["9", "14"],
  13: ["11", "19"],
  14: ["12", "19"],
  15: ["10", "16"],
  16: ["15", "17"],
  17: ["16", "18"],
  18: ["13", "14", "18"],
  19: ["13", "14", "18"],
  20: ["16", "18"],
  21: ["20", "24"],
  22: ["21", "25"],
  23: ["22", "10"],
  24: ["23", "16"],
  25: ["24", "6"]
};

if (!localStorage.getItem('books')) {
  // Initialize all books with explicit false values
  books = books.map(book => ({
    ...book,
    isFavorite: Boolean(book.isFavorite) // Ensure boolean
  }));
  localStorage.setItem('books', JSON.stringify(books));
}

function getRelatedBooks(bookId) {
  return relatedBooks[bookId]
    .map((id) => books.find((book) => book.id === id))
    .filter((book) => book !== undefined);
}

const bookSeries = {
  empyrean: {
    title: "The Empyrean Series",
    author: "Rebecca Yarros",
    books: [
      books.find((book) => book.id === "9"), // Fourth Wing
      books.find((book) => book.id === "1"), // Iron Flame
      books.find((book) => book.id === "2"), // Onyx Storm
    ],
    authorLink: "Author page.html?name=Rebecca%20Yarros",
  },
};

document.addEventListener("DOMContentLoaded", function () {
  const dataDiv = document.getElementById("data-book");
  if (dataDiv) {
    dataDiv.setAttribute("data-books", JSON.stringify(books));
  }
});
