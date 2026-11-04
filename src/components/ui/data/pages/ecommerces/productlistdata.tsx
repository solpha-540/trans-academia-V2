
import ecommerceimg1 from "../../../../../assets/images/ecommerce/png/1.png";
import ecommerceimg2 from "../../../../../assets/images/ecommerce/png/2.png";
import ecommerceimg15 from "../../../../../assets/images/ecommerce/png/15.png";
import ecommerceimg3 from "../../../../../assets/images/ecommerce/png/3.png";
import ecommerceimg4 from "../../../../../assets/images/ecommerce/png/4.png";
import ecommerceimg12 from "../../../../../assets/images/ecommerce/png/12.png";
import ecommerceimg13 from "../../../../../assets/images/ecommerce/png/13.png";
import ecommerceimg16 from "../../../../../assets/images/ecommerce/png/16.png";
import ecommerceimg23 from "../../../../../assets/images/ecommerce/png/23.png";
import ecommerce1  from '../../../../../assets/images/ecommerce/png/1.png';
import ecommerce2  from '../../../../../assets/images/ecommerce/png/2.png';
import ecommerce3  from '../../../../../assets/images/ecommerce/png/3.png';
import ecommerce4  from '../../../../../assets/images/ecommerce/png/4.png';
import ecommerce7  from '../../../../../assets/images/ecommerce/png/7.png';
import ecommerce8  from '../../../../../assets/images/ecommerce/png/8.png';
import ecommerce9  from '../../../../../assets/images/ecommerce/png/9.png';
import ecommerce10  from '../../../../../assets/images/ecommerce/png/10.png';
import ecommerce11  from '../../../../../assets/images/ecommerce/png/11.png';
import ecommerce13  from '../../../../../assets/images/ecommerce/png/13.png';
import ecommerce14  from '../../../../../assets/images/ecommerce/png/14.png';
import ecommerce16  from '../../../../../assets/images/ecommerce/png/16.png';

interface productlist {
    id:number;
    src:string;
    product:string;
    category:string;
    price:string;
    stock:string;
    gender:string;
    seller:string;
    date:string;
    selected:string;
}
export const Productlistdata : productlist[]=[
    {id:1, src:ecommerceimg1, product:'DapZem & Co Blue Hoodie', category:'Clothing', price:'$1,299', stock:'283', gender:'Male', seller:'Apilla.co.in', date:'24,Nov 2022 - 04:42PM', selected:''},
    {id:2, src:ecommerceimg2, product:'Leather jacket for men', category:'Clothing', price:'$799', stock:'98', gender:'Male', seller:'Donzo Company', date:'18,Nov 2022 - 06:53AM', selected:''},
    {id:3, src:ecommerceimg15, product:'Orange Smart Watch', category:'Watches', price:'$349', stock:'1,293', gender:'Male, Female', seller:'SlowTrack Company	', date:'21,Oct 2022 - 11:36AM', selected:''},
    {id:4, src:ecommerceimg3, product:'Winter Coat For Women', category:'Watches', price:'$189', stock:'322', gender:'Female', seller:'WoodHill.co.in', date:'16,Oct 2022 - 12:45AM', selected:''},
    {id:5, src:ecommerceimg4, product:'Vintage White Full Sleeve Tee-Shirt', category:'Clothing', price:'$2,499', stock:'194', gender:'Male, Female', seller:'Watches.co.in', date:'12,Aug 2022 - 11:21AM', selected:''},
    {id:6, src:ecommerceimg13, product:'Orange Watch series (44mm)', category:'Watches', price:'	$899', stock:'267', gender:'Male, Female', seller:'Watches.co.in', date:'05,Sep 2022 - 10:14AM', selected:''},
    {id:7, src:ecommerceimg12, product:'Sweater For Women', category:'Clothing', price:'	$499', stock:'143', gender:'Female', seller:'Louie Philippe', date:'18,Nov 2022 - 14:35PM', selected:''},
    {id:8, src:ecommerceimg16, product:'Ikonic Smart Watch(40mm)', category:'Watches', price:'$999', stock:'365', gender:'Female', seller:'Kohino.zaps.com', date:'27,Nov 2022 - 05:12AM', selected:''},
    {id:9, src:ecommerceimg23, product:'Apple Watch Series 5', category:'Watches', price:'$1,499', stock:'257', gender:'Male, Female', seller:'Apple Corporation', date:'29,Nov 2022 - 16:32PM', selected:''},
];
export const orderedProducts = [
    { id: 1, image: ecommerce1, product: 'Denim Zep.Co Sweat Shirt', price: '1,299', orderId: 'SPK-1203', deliveryAddress: ' mig-1-11,monroe street, georgetown, Washington D.C ', deliveryData: ['13', 'Dec'], deliveredOn: '', deliveryStatus: '', deliveryStatusClass: "", status: 'Shipped', statusClass: "success" },
    { id: 2, image: ecommerce2, product: 'Jimmy Lolfiger Jacket', price: '499', orderId: 'SPK-2936', deliveryAddress: ' mig-1-11,monroe street, georgetown, Washington D.C ', deliveryData: ['25', 'Nov'], deliveredOn: '', deliveryStatus: '', deliveryStatusClass: "", status: 'Confirmed', statusClass: "primary" },
    { id: 3, image: ecommerce3, product: 'Louie Phillippe Coat', price: '1,899', orderId: 'SPK-1855', deliveryAddress: ' mig-1-11,monroe street, georgetown, Washington D.C ', deliveryData: [], deliveredOn: '29,Oct 2022 - 12:47PM', deliveryStatus: 'Delivered', deliveryStatusClass: "bg-success text-white", status: '', statusClass: "" },
    { id: 4, image: ecommerce4, product: 'Denim Corp', price: '2,499', orderId: 'SPK-1234', deliveryAddress: ' mig-1-11,monroe street, georgetown, Washington D.C ', deliveryData: [], deliveredOn: '', deliveryStatus: 'Cancelled', deliveryStatusClass: "bg-danger text-white", status: '', statusClass: "" },
    { id: 5, image: ecommerce13, product: 'Orange Watch', price: '249', orderId: 'SPK-1645', deliveryAddress: ' mig-1-11,monroe street, georgetown, Washington D.C ', deliveryData: [], deliveredOn: '4,Nov 2022 - 10:24AM', deliveryStatus: 'Delivered', deliveryStatusClass: "bg-success text-white", status: '', statusClass: "" },
    { id: 6, image: ecommerce8, product: 'Pufa Sweat Shirt', price: '2,399', orderId: 'SPK-1346', deliveryAddress: ' mig-1-11,monroe street, georgetown, Washington D.C ', deliveryData: ['16', 'Jan'], deliveredOn: '', deliveryStatus: '', deliveryStatusClass: "", status: 'Shipped', statusClass: "success" },
    { id: 7, image: ecommerce9, product: 'Bluberry Co.In', price: '499', orderId: 'SPK-2936', deliveryAddress: ' mig-1-11,monroe street, georgetown, Washington D.C ', deliveryData: ['19', 'Dec'], deliveredOn: '', deliveryStatus: '', deliveryStatusClass: "", status: 'Out For Delivery', statusClass: "warning" },
    { id: 8, image: ecommerce11, product: 'Garage & Co', price: '499', orderId: 'SPK-1376', deliveryAddress: ' mig-1-11,monroe street, georgetown, Washington D.C ', deliveryData: ['24', 'Dec'], deliveredOn: '', deliveryStatus: '', deliveryStatusClass: "", status: 'Shipped', statusClass: "success" },
    { id: 9, image: ecommerce14, product: 'Hadimo Smart Watch(44mm)', price: '499', orderId: 'SPK-2903', deliveryAddress: ' mig-1-11,monroe street, georgetown, Washington D.C ', deliveryData: ['16', 'Nov'], deliveredOn: '', deliveryStatus: '', deliveryStatusClass: "", status: 'Confirmed', statusClass: "primary" },
    { id: 10, image: ecommerce7, product: 'BMW Denim JAcket', price: '1,899', orderId: 'SPK-1976', deliveryAddress: ' mig-1-11,monroe street, georgetown, Washington D.C ', deliveryData: [], deliveredOn: '04,Nov 2022 - 03:12PM', deliveryStatus: 'Delivered', deliveryStatusClass: "bg-success text-white", status: '', statusClass: "" },
    { id: 11, image: ecommerce16, product: 'Totoya Watch For Kids', price: '799', orderId: 'SPK-8765', deliveryAddress: ' mig-1-11,monroe street, georgetown, Washington D.C ', deliveryData: [], deliveredOn: '', deliveryStatus: 'Cancelled', deliveryStatusClass: "bg-danger text-white", status: '', statusClass: "" },
    { id: 12, image: ecommerce10, product: 'Garage & Co', price: '249', orderId: 'SPK-1645', deliveryAddress: ' mig-1-11,monroe street, georgetown, Washington D.C ', deliveryData: [], deliveredOn: '22,Oct 2022 - 05:15PM', deliveryStatus: 'Delivered', deliveryStatusClass: "bg-success text-white", status: '', statusClass: "" },
]