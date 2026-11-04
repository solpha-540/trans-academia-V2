import  { FC, Fragment } from 'react'
import { Link } from 'react-router-dom';
import { DayCounter } from '../../../components/ui/data/authentication/comingsoondata';
import media87 from "../../../assets/images/media/media-87.svg";
import togglelogo from "../../../assets/images/brand-logos/toggle-logo.png";
import SpkButton from '../../../@spk/uielements/spk-button';

interface ComingsoonProps {}

const Comingsoon: FC<ComingsoonProps> = () => {
  return (
    <Fragment>
        <div className="grid grid-cols-12 gap-0 w-full authentication under-maintenance mx-0 text-defaulttextcolor text-defaultsize">
        <div className="lg:col-span-7 col-span-12 bg-white dark:!bg-bodybg">
            <div className="authentication-page md:h-full sm:py-16 w-full flex items-center justify-center">
                <main id="content"  className="w-full lg:max-w-[37rem] p-6 ">
                    <div className="mt-7">
                        <div className="p-0 md:p-7">
                            <div className="text-center">
                                <div className="mb-2 flex justify-center">
                                    <Link aria-label="anchor" to={`${import.meta.env.BASE_URL}dashboards/crm/`}>
                                        <img src={togglelogo} alt="" className="authentication-brand"/>
                                    </Link>
                                </div>
                                <p className="font-semibold text-[0.75rem] mb-1 opacity-[0.4]">STAY TUNED</p>
                                <h1 className="font-bold mb-4 text-[2.5rem]">Coming Soon</h1>
                                <p className="mb-6">Our website is currently under construction, enter your email id to get latest updates and notifications about the website.</p>
                                <div className="input-group mb-[3em]">
                                    <input type="email" className="form-control w-full !rounded-s-md form-control-lg !border-s" placeholder="info@gmail.com" aria-label="info@gmail.com" aria-describedby="button-addon2"/>
                                    <SpkButton customClass="ti-btn bg-primary text-white !rounded-s-none !mb-0" buttontype="button" Id="button-addon2">Subscribe</SpkButton>
                                </div>
                                <DayCounter/>
                                <div className="mt-[3rem]">
                                    <div className="btn-list">
                                        <SpkButton Label="button" buttontype="button" customClass="ti-btn ti-btn-icon bg-primary text-white font-medium me-[0.365rem]">
                                            <i className="ri-facebook-line font-bold"></i>
                                        </SpkButton>
                                        <SpkButton Label="button" buttontype="button" customClass="ti-btn ti-btn-icon bg-secondary text-white font-medium me-[0.365rem]">
                                            <i className="ri-twitter-x-line font-bold"></i>
                                        </SpkButton>
                                        <SpkButton Label="button" buttontype="button" customClass="ti-btn ti-btn-icon bg-warning text-white font-medium me-[0.365rem]">
                                            <i className="ri-instagram-line font-bold"></i>
                                        </SpkButton>
                                        <SpkButton Label="button" buttontype="button" customClass="ti-btn ti-btn-icon bg-success text-white font-medium me-[0.365rem]">
                                            <i className="ri-github-line font-bold"></i>
                                        </SpkButton>
                                        <SpkButton Label="button" buttontype="button" customClass="ti-btn ti-btn-icon bg-danger text-white font-medium">
                                            <i className="ri-youtube-line font-bold"></i>
                                        </SpkButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        <div className="lg:col-span-5 col-span-12 hidden lg:block relative px-0">
            <div className="bg-light w-full h-full flex items-center justify-center under-maintenance-image-container">
                <img src={media87} alt="" className="imig-fluid"/>
            </div>
        </div>

        </div>
    </Fragment>
  )
}


export default Comingsoon;
