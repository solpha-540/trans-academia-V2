import  { FC, Fragment, useState } from 'react'
import desktoplogo from "../../../../assets/images/brand-logos/desktop-logo.png";
import desktopdarklogo from "../../../../assets/images/brand-logos/desktop-dark.png";
import face15 from "../../../../assets/images/faces/15.jpg";
import { Link } from 'react-router-dom';
import { LockSwiper } from '../../../../components/ui/data/authentication/swipercoverdata';
import SwiperComponent from '../../../../@spk/spk-packages/swiper-component';
import SpkButton from '../../../../@spk/uielements/spk-button';

interface ScreencoverProps {}

const Screencover: FC<ScreencoverProps> = () => {

    const [passwordshow1, setpasswordshow1] = useState(false);

  return (
    <Fragment>
       <div className="grid grid-cols-12 authentication mx-0 text-defaulttextcolor text-defaultsize">
        <div className="xxl:col-span-7 xl:col-span-7 lg:col-span-12 col-span-12 bg-white dark:!bg-bodybg">
            <div className="grid grid-cols-12 items-center h-full ">
                <div className='xxl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-3 sm:col-span-2'></div>
                <div className='xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-8 col-span-12'>
                    <div className="p-[3rem]">
                        <div className="mb-4">
                            <Link aria-label="anchor" to={`${import.meta.env.BASE_URL}dashboards/crm/`}>
                                <img src={desktoplogo} alt="" className="authentication-brand desktop-logo"/>
                                <img src={desktopdarklogo}alt="" className="authentication-brand desktop-dark"/>
                            </Link>
                        </div>
                        <p className="h5 font-semibold mb-2">Lock Screen</p>
                        <p className="mb-4 text-[#8c9097] dark:text-white/50 opacity-[0.7] font-normal">Hello Jhon !</p>
                        <div className="flex items-center mb-6">
                            <div className="leading-none">
                                <span className="avatar avatar-md avatar-rounded">
                                    <img src={face15} alt=""/>
                                </span>
                            </div>
                            <div className="ms-4">
                                <p className="mb-0 font-semibold text-dark">jhonslicer21@gmail.com</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-y-4">
                            <div className="xl:col-span-12 col-span-12">
                                <label htmlFor="lockscreen-password" className="form-label text-default">Password</label>
                                <div className="input-group">
                                    <input type={(passwordshow1) ? 'text' : "password"} className="form-control form-control-lg !border-s !rounded-e-none" id="lockscreen-password" placeholder="password"/>
                                    <SpkButton onclickfunc={()=>setpasswordshow1(!passwordshow1)} variant="light" customClass="ti-btn !mb-0 !rounded-s-none" Label="button" buttontype="button" Id="button-addon2"><i className={`${passwordshow1 ? 'ri-eye-line' : 'ri-eye-off-line'} align-middle`}></i></SpkButton>
                                </div>
                                <div className="mt-2">
                                    <div className="form-check !ps-0">
                                        <input className="form-check-input" type="checkbox" defaultValue="" id="defaultCheck1"/>
                                        <label className="form-check-label text-[#8c9097] dark:text-white/50 font-normal" htmlFor="defaultCheck1">
                                            Remember password ?
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="xl:col-span-12 col-span-12 grid mt-0">
                                <Link to={`${import.meta.env.BASE_URL}dashboards/crm/`} className="ti-btn ti-btn-lg bg-primary text-white !font-medium dark:border-defaultborder/10">Unlock</Link>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mt-4">Try unlock with different methods <Link className="text-success" to="#" ><u>Finger print</u></Link> / <Link className="text-success" to="#"><u>Face Id</u></Link></p>
                        </div>
                    </div>
                </div>
                <div className="xxl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-3 sm:col-span-2"></div>
            </div>
        </div>
        <div className="xxl:col-span-5 xl:col-span-5 lg:col-span-5 col-span-12 xl:block hidden px-0">
            <div className="authentication-cover">
                <div className="aunthentication-cover-content rounded">
                    <div className="swiper keyboard-control">
                        <div className="swiper-wrapper">
                        <SwiperComponent slides={LockSwiper} spaceBetween={30} navigation={true} centeredSlides={true} autoplay={true} pagination={true}  className="mySwiper"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </Fragment>
  )
}

export default Screencover