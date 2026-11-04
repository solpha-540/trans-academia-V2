
import ecommerceimg16 from "../../../../../assets/images/ecommerce/png/16.png";
import ecommerceimg17 from "../../../../../assets/images/ecommerce/png/17.png";
import ecommerceimg18 from "../../../../../assets/images/ecommerce/png/18.png";
import ecommerceimg19 from "../../../../../assets/images/ecommerce/png/19.png";
import ecommerceimg20 from "../../../../../assets/images/ecommerce/png/20.png";
import ecommerceimg21 from "../../../../../assets/images/ecommerce/png/21.png";
import ecommerceimg22 from "../../../../../assets/images/ecommerce/png/22.png";
// Category
interface Category {
  value: string;
  label: string;
}

export const CategoryData: Category[] = [
  { value: "Category", label: "Category" },
  { value: "Clothing", label: "Clothing" },
  { value: "Footwear", label: "Footwear" },
  { value: "Accessories", label: "Accessories" },
  { value: "Grooming", label: "Grooming" },
  { value: "Watches", label: "Watches" },
  { value: "Ethnic & Festive", label: "Ethnic & Festive" },
  { value: "Jewellery", label: "Jewellery" },
  { value: "Toys & Babycare", label: "Toys & Babycare" },
  { value: "Festive Gifts", label: "Festive Gifts" },
  { value: "Kitchen", label: "Kitchen" },
  { value: "Dining", label: "Dining" },
  { value: "Home Decors", label: "Home Decors" },
  { value: "Stationery", label: "Stationery" },
];

// Gender
interface Gender {
  value: string;
  label: string;
}

export const GenderData: Gender[] = [
  { value: "Select", label: "Select" },
  { value: "All", label: "All" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Others", label: "Others" },
];

// Size
interface Size {
  value: string;
  label: string;
}

export const SizeData: Size[] = [
  { value: "", label: "Select" },
  { value: "Extra Small", label: "Extra Small" },
  { value: "Small", label: "Small" },
  { value: "Medium", label: "Medium" },
  { value: "Large", label: "Large" },
  { value: "Extra Large", label: "Extra Large" },
];

// Brand
interface Brand {
  value: string;
  label: string;
}

export const BrandData: Brand[] = [
  { value: "", label: "Select" },
  { value: "Armani", label: "Armani" },
  { value: "Lacoste", label: "Lacoste" },
  { value: "Puma", label: "Puma" },
  { value: "Spykar", label: "Spykar" },
  { value: "Mufti", label: "Mufti" },
  { value: "Home Town", label: "Home Town" },
  { value: "Arrabi", label: "Arrabi" },
];

// Colors
interface Colors {
  value: string;
  label: string;
}

export const ColorsData: Colors[] = [
  { value: "Blue", label: "Blue" },
  { value: "White", label: "White" },
  { value: "Black", label: "Black" },
  { value: "Red", label: "Red" },
  { value: "Orange", label: "Orange" },
  { value: "Yellow", label: "Yellow" },
  { value: "Green", label: "Green" },
  { value: "Pink", label: "Pink" },
  { value: "Purple", label: "Purple" },
];

// Published Status
interface Publish {
  value: string;
  label: string;
}

export const PublishedData: Publish[] = [
  { value: "Select", label: "Select" },
  { value: "Published", label: "Published" },
  { value: "Scheduled", label: "Scheduled" },
];

// Product Tags
interface ProductData {
  value: string;
  label: string;
}

export const ProductsData: ProductData[] = [
  { value: "Relaxed", label: "Relaxed" },
  { value: "Solid", label: "Solid" },
  { value: "Washed", label: "Washed" },
  { value: "Plain", label: "Plain" },
];

// Availability
interface Availability {
  value: string;
  label: string;
}

export const AvailabilityData: Availability[] = [
  { value: "Select", label: "Select" },
  { value: "In Stock", label: "In Stock" },
  { value: "Out Of Stock", label: "Out Of Stock" },
];

export const productdetailstable=[
  {id:1, image:ecommerceimg16, title:'Omega watch series 3', oldpr:'$1,759', newpr:'$1,099', rating:'4.4', views:'13,256',class:'border border-defaultborder dark:border-defaultborder/10'},
  {id:2, image:ecommerceimg17, title:'Strap on watch(White)',oldpr:'$1,299', newpr:'$7,99',  rating:'3.8', views:'5,289',class:'border border-defaultborder dark:border-defaultborder/10'},
  {id:3, image:ecommerceimg18, title:'Orange watch series 3', oldpr:'$2,599', newpr:'$1,499', rating:'4.1', views:'2,476',class:'border border-defaultborder dark:border-defaultborder/10'},
  {id:4, image:ecommerceimg19, title:'Omega watch special edition', oldpr:'$3,299', newpr:'$2,299', rating:'3.8', views:'1,893',class:'border border-defaultborder dark:border-defaultborder/10'},
  {id:5, image:ecommerceimg20, title:'Fassil smart watch(45mm)', oldpr:'$1,299', newpr:'$8,99', rating:'4.5', views:'12,923',class:'border border-defaultborder dark:border-defaultborder/10'},
  {id:6, image:ecommerceimg21, title:'Electro viintage watch(40mm)', oldpr:'$2,499', newpr:'$1,799', rating:'4.1', views:'453',class:'border border-defaultborder dark:border-defaultborder/10'},
  {id:7, image:ecommerceimg22, title:'Bolts smart watch(Amoled)', oldpr:'$2,999', newpr:'$2,299', rating:'4.3', views:'1,874',class:'border border-defaultborder dark:border-defaultborder/10'},
]