
import media39 from "../../../../../assets/images/media/media-39.jpg";
import media56 from "../../../../../assets/images/media/media-56.jpg";
import media54 from "../../../../../assets/images/media/media-54.jpg";
import media52 from "../../../../../assets/images/media/media-52.jpg";
import media74 from "../../../../../assets/images/media/media-74.jpg";
import media49 from "../../../../../assets/images/media/media-49.jpg";
import media76 from "../../../../../assets/images/media/media-76.jpg";

//blog-tags

interface option1 {
    value:string;
    label:string;
}
export const option :option1[]= [
    { value: 'Landscape', label: 'Landscape' },
    { value: 'Top Blog ', label: 'Top Blog ' },
    { value: 'Blogger', label: 'Blogger' },
    { value: 'Adventure', label: 'Adventure' },
];

interface option2 {
    value:string;
    label:string;
    isDisabled:string;
}
//Published Status

export const option1:option2[] = [
    { value: 'Select ', label: 'Select ', isDisabled: 'isDisabled' },
    { value: 'Hold', label: 'Hold',isDisabled:""},
    { value: 'Published', label: 'Published',isDisabled:""},
];

//blog-category
interface option3 {
    value:string;
    label:string;
}
export const option2 :option3[]= [
    { value: 'Select Category', label: 'Select Category' },
    { value: 'Nature', label: 'Nature' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Food', label: 'Food' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Beauty', label: 'Beauty' },
];

interface blogdata{
    id:number;
    src:string;
    title:string;
    text:string;
    time:string;
}

export const Recentblogdata : blogdata[] = [
    { id: 1, src:media39 , title: 'Animals', text: ' There are many variations of passages of Lorem Ipsum available ', time: '24,Nov 2022 - 18:27' },
    { id: 2, src:media56, title: 'Travel', text: ' Latin words, combined with a handful of model sentence ', time: '28,Nov 2022 - 10:45' },
    { id: 3, src:media54, title: 'Interior', text: ' Contrary to popular belief, Lorem Ipsum is not simply random ', time: '30,Nov 2022 - 08:32' },
    { id: 4, src:media52, title: 'Nature', text: ' It was popularised in the 1960s with the release of Letraset sheets containing ', time: '3,Dec 2022 - 12:56' },
    { id: 5, src:media74, title: 'Health', text: ' It was popularised in the 1960s with the release of Letraset sheets containing ', time: '16,Dec 2022 - 04:56' },
    { id: 6, src:media49, title: 'Food', text: ' It was popularised in the 1960s with the release of Letraset sheets containing ', time: '31,Dec 2022 - 18:06' },
    { id: 7, src:media76, title: 'Travel', text: ' It was popularised in the 1960s with the release of Letraset sheets containing ', time: '15,Dec 2022 - 14:31' }
];