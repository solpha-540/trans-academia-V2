import media73 from "../../../../../assets/images/media/media-73.jpg";
import media74 from "../../../../../assets/images/media/media-74.jpg";
import media75 from "../../../../../assets/images/media/media-75.jpg";
import media76 from "../../../../../assets/images/media/media-76.jpg";
import media77 from "../../../../../assets/images/media/media-77.jpg";
import media78 from "../../../../../assets/images/media/media-78.jpg";
import media40 from "../../../../../assets/images/media/media-40.jpg";
import media42 from "../../../../../assets/images/media/media-42.jpg";
import media61 from "../../../../../assets/images/media/media-61.jpg";
import media59 from "../../../../../assets/images/media/media-59.jpg";
import face2 from "../../../../../assets/images/faces/2.jpg";
import face7 from "../../../../../assets/images/faces/7.jpg";
import face12 from "../../../../../assets/images/faces/12.jpg";
import face16 from "../../../../../assets/images/faces/16.jpg";
import media70 from "../../../../../assets/images/media/media-70.jpg";
import media71 from "../../../../../assets/images/media/media-71.jpg";
import media72 from "../../../../../assets/images/media/media-72.jpg";
import face15 from "../../../../../assets/images/faces/15.jpg";
import face4 from "../../../../../assets/images/faces/4.jpg";
import media36 from "../../../../../assets/images/media/media-36.jpg";
import media35 from "../../../../../assets/images/media/media-35.jpg";
import media26 from "../../../../../assets/images/media/media-26.jpg";
import media31 from "../../../../../assets/images/media/media-31.jpg";
import face5 from "../../../../../assets/images/faces/5.jpg";
import face3 from "../../../../../assets/images/faces/3.jpg";
import face10 from "../../../../../assets/images/faces/10.jpg";
import face11 from "../../../../../assets/images/faces/11.jpg";
import { Link } from "react-router-dom";
//Popular topics

interface popular {
    id:number;
    src:string;
    text:string;
}
export const Populartopics:popular[] =[
    {id:1, src:media73 , text:'Nature'},
    {id:2, src:media74, text:'Sports'},
    {id:3, src:media75, text:'Food'},
    {id:4, src:media76, text:'Travel'},
    {id:5, src:media77, text:'Fashion'},
    {id:6, src:media78, text:'Animals'}
];

interface SwiperType {
    id:number;
    src:any;
    src1:any;
    heading:string;
    data:string;
    time:string;
    text:string;
}
const Blogswiper:SwiperType[] = [
    {id:1, src:media70, src1:face15, heading:"Json Taylor", data:"The agency has a diverse workforce of just under 18,000 civil servants, and works with many more U.S.", time:"12,Dec 2022 - 04:34PM", text:"N.A.S.A"},
    {id:2, src:media71, src1:face15, heading:"Elisha Keens", data:"NASA is committed to providing all categories of businesses in both NASA prime contracts and subcontracts.", time:"23,Dec 2022 - 11:27AM", text:"NASA Businesses"},
    {id:3, src:media72, src1:face4, heading:"Melissa Blue", data:"NASA Nelson served in the U.S. Senate for 18 years from Florida space shuttle mission 61-C in 1986.", time:"16,Dec 2022 - 9:45AM", text:"NASA Leadership"},
]
export const Blogslide = Blogswiper.map((idx) => (
    <div>
    <div className="rtl:dir-rtl">
        <Link to="#">
            <img src={idx.src} className="block-full" alt="..." />
            <div className="blog-caption text-start">
                <p className="mb-2 text-xs">{idx.data}</p>
                <h6 className="text-base font-semibold mb-2">{idx.text}</h6>
                <div className="flex items-center">
                    <img src={idx.src1} alt="" className="shadow-none ring-transparent avatar avatar-sm !rounded-full me-2" />
                    <div className="font-semibold">{idx.heading} - <span className="text-[.6875rem] opacity-70 font-normal">{idx.time}</span></div>
                </div>
            </div>
        </Link>
    </div>
</div>
))

export const blog = [
    { id: 1, img: media36, title: "Touring excites in winter !", content: "when an unknown printer took a galley of type and scrambled it to make a type specimen book.", src: face10, name: "Justin Kim", date: "20,Dec 2022 - 16:32" },
    { id: 2, img: media35, title: "Boat manufacutrers are in debt !", content: "when an unknown printer took a galley of type and scrambled it to make a type specimen book.", src: face5, name: "Monika Karen", date: "25,Dec 2022 - 12:45" },
]
export const blog1 = [
    { id: 1, img: media26, title: "Features of new car !", content: "The holographic principle, theorized to be a property of quantum gravity, postulates that the description.", src: face11, name: "Alister Chuk", date: "18,Dec 2022 - 12:25" ,class:''},
    { id: 2, img: media31, title: "Beautiful beach on a sunny day !", content: "The holographic principle, theorized to be a property of quantum gravity, postulates that the description.", src: face3, name: "Samantha Nans", date: "25,Dec 2022 - 04:25" ,class:'flex-wrap gap-2'},
]

interface popular1 {
    id:number;
    img:string;
    src:string;
    title:string;
    name:string;
    date:string;
    content:string;
}

export const Populartopics1 :popular1[]=[
{id:1, img:media40, src:face7, title:'Strawberry juice recipe.', name:'Maria Bose', date:'17,Dec 2022 - 12:32', content:'Want to have something different but healthy to drink? Then look no further!! Strawberry Juice is rich in vitamin C.'},
{id:2, img:media61, src:face2, title:'Night Sky is pleasent to watch.', name:'Helsenky', date:'24,Dec 2022 - 14:21', content:'Sky map showing the night sky tonight from any location. What planets are visible tonight? Where is Mars.'},
{id:3, img:media42, src:face12, title:'Is fashion industry growing ?', name:'Jason Mama', date:'19,Dec 2022 - 15:48', content:'The holographic principle, theorized to be a property of quantum gravity, postulates that the description.'},
{id:4, img:media59, src:face16, title:'Raising sun is a blessing to watch ..', name:'Stuart Hall', date:'13,Dec 2022 - 19:08', content:'Rising Sun is a 1993 American buddy cop crime thriller film directed by Philip Kaufman'}
];