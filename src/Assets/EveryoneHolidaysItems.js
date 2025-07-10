import dam1 from '../Assets/Images/dam1-land.jpg';
import dam2 from '../Assets/Images/dam2-land.jpg';
import dam3 from '../Assets/Images/dam3-land.jpg';
import dam4 from '../Assets/Images/dam4-land.jpg';
import dam5 from '../Assets/Images/dam5-land.jpg';
import ale1 from '../Assets/Images/ale1-land.jpg';
import ale2 from '../Assets/Images/ale2-land.jpg';
import ale3 from '../Assets/Images/ale3-land.jpg';
import ale4 from '../Assets/Images/ale4-land.jpg';
import ale5 from '../Assets/Images/ale5-land.jpg';
import homs1 from '../Assets/Images/homs1-land.jpg';
import homs2 from '../Assets/Images/homs2-land.jpg';
import homs3 from '../Assets/Images/homs3-land.jpg';
import homs4 from '../Assets/Images/homs4-land.jpg';
import homs5 from '../Assets/Images/homs5-land.jpg';



const EveryoneHolidaysItems = [
    {
        id: 1,
        itemSubTitle: 'دمشق',

        images: [
            { url: dam1, title: 'متحف دمشق الوطني' },
            { url: dam2, title: 'حديقة السبكي ' },
            { url: dam3, title: 'جسر الثورة ' },
            { url: dam4, title: 'حي القنوات ' },
            { url: dam5, title: 'تلَة العباسيين ' }
        ],
        tags: ['family', 'all-inclusive']
    },
    {
        id: 2,
        itemSubTitle: 'حلب',

        images: [
            { url: ale1, title: 'خان الوزير' },
            { url: ale2, title: 'باب الفرج' },
            { url: ale3, title: 'حديقة السبيل' },
            { url: ale4, title: 'متحف حلب الوطني ' },
            { url: ale5, title: 'سوق العتمة' }
        ],
        tags: ['beach', 'luxury']
    },

    {
        id: 3,

        itemSubTitle: 'حمص',

        images: [
            { url: homs4, title: 'متحف حمص' },
            { url: homs5, title: 'حديقة الأرز' },
            { url: homs3, title: 'نهر العاصي' },
            { url: homs2, title: 'قلعة شيزر' },
            { url: homs1, title: 'بحيرة قطينة' }
        ],
        tags: ['beach', 'luxury']
    },

    {
        id: 4,

        itemSubTitle: 'إدلب',

        images: [
            { url: homs1, title: 'قلعة حارم ' },
            { url: homs2, title: 'آثار إيبلا' },
            { url: homs3, title: 'جبل الزاوية' },
            { url: homs4, title: 'نهر العاصي' },
            { url: homs5, title: 'سوق إدلب القديم' }
        ],
        tags: ['beach', 'luxury']
    },

    {
        id: 5,

        itemSubTitle: 'حماة',

        images: [
            { url: ale1, title: 'سوق الحمام' },
            { url: ale2, title: 'متحف حمة ' },
            { url: ale3, title: 'نهر العاصي' },
            { url: ale4, title: 'حديقة العامرية' },
            { url: ale5, title: 'تل المشرفة' }
        ],
        tags: ['beach', 'luxury']
    },
    {
        id: 6,

        itemSubTitle: 'اللاذقية',
        images: [
            { url: dam1, title: 'شاطئ الكورنيش ' },
            { url: dam2, title: 'مشتى الحلو' },
            { url: dam3, title: 'غابة الفرلق' },
            { url: dam4, title: 'قلعة المهالبة' },
            { url: dam5, title: 'نهر السن' }
        ],
        tags: ['beach', 'luxury']
    },
    {
        id: 7,

        itemSubTitle: 'طرطوس',
        images: [
            { url: homs1, title: 'شاطئ البدروسية' },
            { url: homs2, title: 'جزيرة أرواد' },
            { url: homs3, title: 'قلعة المرقب' },
            { url: homs4, title: 'نهر الجلبية' },
            { url: homs5, title: 'غابة طرطوس' }
        ],
        tags: ['beach', 'luxury']
    },
    {
        id: 8,

        itemSubTitle: 'الرقة',
        images: [
            { url: ale1, title: 'قلعة جعبر ' },
            { url: ale2, title: 'نهر الفرات' },
            { url: ale3, title: 'سوق الرقة' },
            { url: ale4, title: 'متحف الرقة' },
            { url: ale5, title: 'حديقة النهر' }
        ],
        tags: ['beach', 'luxury']
    },
    {
        id: 9,

        itemSubTitle: 'الحسكة',
        images: [
            { url: dam1, title: 'نهر الخابور' },
            { url: dam2, title: 'تل حلف' },
            { url: dam3, title: 'متحف الحسكة' },
            { url: dam4, title: 'سوق المدينة' },
            { url: dam5, title: 'حديقة العروبة' }
        ],
        tags: ['beach', 'luxury']
    },
    {
        id: 10,

        itemSubTitle: 'دير الزور',
        images: [
            { url: ale1, title: 'نهر الفرات' },
            { url: ale2, title: 'متحف دير الزور' },
            { url: ale3, title: 'سوق الحبوب' },
            { url: ale4, title: 'جسر دير الزور' },
            { url: ale5, title: 'حديقة الفرات' }
        ],
        tags: ['beach', 'luxury']
    },
    {
        id: 11,

        itemSubTitle: 'السويداء',
        images: [
            { url: homs1, title: 'تل قنوات' },
            { url: homs2, title: 'متحف السويداء' },
            { url: homs3, title: 'سوق السويداء' },
            { url: homs4, title: 'حديقة البلدية' },
            { url: homs5, title: 'جبل العرب' }
        ],
        tags: ['beach', 'luxury']
    },
    {
        id: 12,

        itemSubTitle: 'درعا',
        images: [
            { url: ale1, title: 'نهر اليرموك' },
            { url: ale2, title: 'سوق درعا' },
            { url: ale3, title: 'متحف درعا' },
            { url: ale4, title: 'حديقة المدينة ' },
            { url: ale5, title: 'تل الأشعري' }
        ],
        tags: ['beach', 'luxury']
    },

];

export default EveryoneHolidaysItems;
