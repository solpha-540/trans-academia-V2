import face10 from "../../../../assets/images/faces/10.jpg";
import face11 from "../../../../assets/images/faces/11.jpg";
import face1 from "../../../../assets/images/faces/1.jpg";
import face12 from "../../../../assets/images/faces/12.jpg";
import face13 from "../../../../assets/images/faces/13.jpg";
import face14 from "../../../../assets/images/faces/14.jpg";
import face15 from "../../../../assets/images/faces/15.jpg";
import face2 from "../../../../assets/images/faces/2.jpg";
import face3 from "../../../../assets/images/faces/3.jpg";
import face4 from "../../../../assets/images/faces/4.jpg";
import face5 from "../../../../assets/images/faces/5.jpg";
import face6 from "../../../../assets/images/faces/6.jpg";
import face7 from "../../../../assets/images/faces/7.jpg";
import face9 from "../../../../assets/images/faces/9.jpg";  
import face16 from "../../../../assets/images/faces/16.jpg";
import face8 from "../../../../assets/images/faces/8.jpg";
import team1 from "../../../../assets/images/media/team-covers/1.jpg";
import team2 from "../../../../assets/images/media/team-covers/2.jpg";
import team3 from "../../../../assets/images/media/team-covers/3.jpg";
import team4 from "../../../../assets/images/media/team-covers/4.jpg";
import team5 from "../../../../assets/images/media/team-covers/5.jpg";
import team6 from "../../../../assets/images/media/team-covers/6.jpg";
import team7 from "../../../../assets/images/media/team-covers/7.jpg";
import team8 from "../../../../assets/images/media/team-covers/8.jpg";
import team9 from "../../../../assets/images/media/team-covers/9.jpg";

interface Teamuidata1 {
    id:number;
    Mainimg:string;
    Avatarimg:string;
    Name:string;
    Mail:string;
    Membership:string;
    Projects:string;
    Position:string;
    Ratingclass:string;
}

export const Teamuidata :Teamuidata1[]= [
    { id: 1, Mainimg: team1, Avatarimg: face11, Name: 'Alexander Smith', Mail: 'alexandersmith2135@gmail.com', Membership: '16 Months', Projects: '45', Position: 'Member', Ratingclass: 'warning' },
    { id: 2, Mainimg: team2, Avatarimg: face2, Name: 'Alicia Sierra', Mail: 'aliciasierra1645@gmail.com', Membership: '2 Years', Projects: '78', Position: 'Associate', Ratingclass: 'white' },
    { id: 3, Mainimg: team3, Avatarimg: face4, Name: 'Angelica Hose', Mail: 'angelica143@gmail.com', Membership: '12 Months', Projects: '35', Position: 'Member', Ratingclass: 'white' },
    { id: 4, Mainimg: team4, Avatarimg: face10, Name: 'Jhope Joseph', Mail: 'jhope.joseph@gmail.com', Membership: '3 Years', Projects: '126', Position: 'Team Lead', Ratingclass: 'white' },
    { id: 5, Mainimg: team5, Avatarimg: face13, Name: 'King Martin', Mail: 'martinking1998@gmail.com', Membership: '28 Months', Projects: '114', Position: 'Member', Ratingclass: 'warning' },
    { id: 6, Mainimg: team6, Avatarimg: face5, Name: 'Susan Sane', Mail: 'susanasane@gmail.com', Membership: '18 Months', Projects: '74', Position: 'Member', Ratingclass: 'white' },
    { id: 7, Mainimg: team7, Avatarimg: face8, Name: 'Brenda Hops', Mail: 'brrendahops245@gmail.com', Membership: '16 Months', Projects: '64', Position: 'Member', Ratingclass: 'white' },
    { id: 8, Mainimg: team8, Avatarimg: face14, Name: 'Paul Rudd', Mail: 'paulrudd143@gmail.com', Membership: '7 Months', Projects: '17', Position: 'Member', Ratingclass: 'white' },
    { id: 9, Mainimg: team9, Avatarimg: face15, Name: 'Elisha Jin', Mail: 'elishajin@gmail.com', Membership: '4 Years', Projects: '321', Position: 'Manager', Ratingclass: 'white' }
];

export const Selectdata1 = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '30', label: '30' },
];

export const Uidata=[
    {id:1, src:face3, name:'Angelica Hale', active:'online', time:''},
    {id:2, src:face5, name:'Mona Magore', active:'offline', time:' 8 min'},
    {id:3, src:face15, name:'Mark Wains', active:'online', time:''},
    {id:4, src:face12, name:'Alex Carey', active:'online', time:''},
    {id:5, src:face7, name:'Monika Karen', active:'offline', time:' 24 mins'},
]
export const Reactdata=[
    {id:1, src:face10, name:'Matthew Ray', active:'online', time:''},
    {id:2, src:face8, name:'Melissa Blue', active:'online', time:''},
    {id:3, src:face2, name:'Brenda Sams', active:'online', time:''},
    {id:4, src:face14, name:'Muhammed Kher', active:'offline', time:'13 mins'},
    {id:5, src:face4, name:'Dorga Boavan', active:'online', time:''},
    {id:6, src:face13, name:'Yashna Polana', active:'offline', time:'19 mins'},
]
export const Testingdata=[
    {id:1, src:face11, name:'Jason Smith', active:'online', time:''},
    {id:2, src:face6, name:'Sasha Hops', active:'offline', time:'21 mins'},
    {id:3, src:face9, name:'Mark Zaker', active:'online', time:'38 mins'},
    {id:4, src:face16, name:'Suarez Adam', active:'online', time:'13 mins'},
    {id:5, src:face1, name:'Kiara Advensh', active:'offline', time:'1 hr'},
]