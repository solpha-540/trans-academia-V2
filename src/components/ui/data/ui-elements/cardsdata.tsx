import face11 from "../../../../assets/images/faces/11.jpg";
import face12 from "../../../../assets/images/faces/12.jpg";
import face1 from "../../../../assets/images/faces/1.jpg";
import face2 from "../../../../assets/images/faces/2.jpg";
import face8 from "../../../../assets/images/faces/8.jpg";
import face5 from "../../../../assets/images/faces/5.jpg";
import face14 from "../../../../assets/images/faces/14.jpg";
import face13 from "../../../../assets/images/faces/13.jpg";
import face16 from "../../../../assets/images/faces/16.jpg";
import media43 from "../../../../assets/images/media/media-43.jpg"
import media44 from "../../../../assets/images/media/media-44.jpg"
import media45 from "../../../../assets/images/media/media-45.jpg"
import media46 from "../../../../assets/images/media/media-46.jpg"
import face15 from "../../../../assets/images/faces/15.jpg";
import face3 from "../../../../assets/images/faces/3.jpg";
import face4 from "../../../../assets/images/faces/4.jpg";
import face6 from "../../../../assets/images/faces/6.jpg";
import face7 from "../../../../assets/images/faces/7.jpg";
import face9 from "../../../../assets/images/faces/9.jpg";
import face10 from "../../../../assets/images/faces/10.jpg";
import media29 from "../../../../assets/images/media/media-29.jpg";
import media28 from "../../../../assets/images/media/media-28.jpg";
import media27 from "../../../../assets/images/media/media-27.jpg";

//Background Colored Cards

interface Background1 {
  id:number;
  src:string;
  text1:string;
  text2:string;
  color:string;
  class:string;
}
export const Backgroundcards:Background1[] = [
    { id: 1, src: face11, text1: 'Adam Smith', text2: 'Finished by today', color: 'primary', class: 'white' },
    { id: 2, src: face12, text1: 'Elisha Corner', text2: 'Completed 24 days back', color: 'secondary', class: 'white' },
    { id: 3, src: face1, text1: 'Sarah Alina', text2: 'Completed today', color: 'warning', class: 'white' },
    { id: 4, src: face8, text1: 'Monica Karen', text2: 'Pending from 4 days', color: 'info', class: 'white' },
    { id: 5, src: face5, text1: 'Samantha sid', text2: 'In leave for 1 month', color: 'success', class: 'white' },
    { id: 6, src: face14, text1: 'Sebastien steyn', text2: 'Completed by Tomorrow', color: 'danger', class: 'white' },
    { id: 7, src: face13, text1: 'Jacob Smith', text2: 'Finished by 24,Nov', color: 'light', class: '[.9375rem]' },
    { id: 8, src: face16, text1: 'Pope Adam', text2: 'Completed on 24,may', color: 'black', class: 'white' }
  ];

  //Grids Cards

  interface Gridcards1 {
    id:number;
    src:string;
    text1:string;
  }
  export const Gridcards :Gridcards1[]= [
    { id: 1, src: media44, text1: 'Morphology of a typical fruit.' },
    { id: 2, src: media43, text1: 'Research improves ability & agility !' },
    { id: 3, src: media45, text1: 'Most tropical areas are suitable' },
    { id: 4, src: media46, text1: 'Are They seasonal fruits ?' },
  ];

  export const Bordercarddata = [
    {
      title: "Home Page Design",
      badges: [
        { text: 'Framework', className: 'bg-primary/10 text-primary' },
        { text: 'Angular', className: 'bg-secondary/10 text-secondary' },
        { text: 'Php', className: 'bg-info/10 text-info' },
      ],
      images: [
        face2,
        face8,
        face2,
      ],
      Class: 'primary',
      cardclass:'border-primary !rounded-md'
  
    },
    {
      title: "Landing Page Design",
      badges: [
        { text: 'Laravel', className: 'bg-danger/10 text-danger' },
        { text: 'Codeignitor', className: 'bg-teal-transparent' },
        { text: 'Php', className: 'bg-success/10 text-success' },
      ],
      images: [
        face4,
        face6,
      ],
      Class: 'secondary',
      cardclass:'border-primary !rounded-md'
    },
    {
      title: "Update New Project",
      badges: [
        { text: 'Html', className: 'bg-warning/10 text-warning' },
        { text: 'Bootstrap', className: 'bg-secondary/10 text-secondary' },
        { text: 'React', className: 'bg-info/10 text-info' },
      ],
      images: [
        face1,
        face12,
        face10,
       face16,
      ],
      Class: 'warning',
      cardclass:'border-primary !rounded-md'
    },
    {
      title: "New Project Discussion",
      badges: [
        { text: 'React', className: 'bg-info/10 text-info' },
        { text: 'Typescript', className: 'bg-primary/10 text-primary' },
      ],
      images: [
        face3,
        face14,
        face11,
      ],
      Class: 'info',
      cardclass:'border-primary !rounded-md'
    },
    {
      title: "Recent Projects Testing",
      badges: [
        { text: 'Ui', className: 'bg-primary/10 text-primary' },
        { text: 'Angular', className: 'bg-secondary/10 text-secondary' },
        { text: 'Java', className: 'bg-info/10 text-info' },
      ],
      images: [
        face15,
      ],
      Class: 'danger',
      cardclass:'border-primary !rounded-md'
    },
    {
      title: "About Us Page redesign",
      badges: [
        { text: 'Html', className: 'bg-danger/10 text-danger' },
        { text: 'Symphony', className: 'bg-warning/10 text-warning' },
        { text: 'Php', className: 'bg-success/10 text-success' },
      ],
      images: [
        face6,
        face9,
      ],
      Class: 'success',
      cardclass:'border-primary !rounded-md'
    },
    {
      title: "New Employees",
      badges: [
        { text: 'Html', className: 'bg-warning/10 text-warning' },
        { text: 'Cake Php', className: 'bg-info/10 text-info' },
        { text: 'React', className: 'bg-success/10 text-success' },
      ],
      images: [
        face5,
        face6,
        face7,
      ],
      Class: 'default',
      cardclass:'border-primary !rounded-md'
    },
    {
      title: "Terminated Employees",
      badges: [
        { text: 'Angular', className: 'bg-primary/10 text-primary' },
      ],
      images: [
        face9,
        face11,
        face12,
        face15,
      ],
      Class: 'dark',
      cardclass:'border-primary !rounded-md'
    }
  ]

 export const Cardgroupdata=[
  {id:1, src:media27, text:' This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.'},
  {id:2, src:media28, text:'This card has supporting text below as a natural lead-in to additional content.'},
  {id:3, src:media29, text:'This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.'},
 ]