import  { FC, Fragment } from 'react'
import Pageheader from '../../components/common/page-header/pageheader'
import { Link } from 'react-router-dom'
import SpkOverlay from '../../@spk/uielements/spk-overlay'
import { Bootstrapicons, Boxicons, Feathericons, LineAwesomeicons, Remixiconsdata, Tablericons } from '../../components/ui/data/icons/iconsdata'

interface IconsProps {}

const Icons: FC<IconsProps> = () => {
    return (
        <Fragment>
            <Pageheader currentpage="Icons" activepage="Icons" mainpage="Icons" />
            <div className="grid grid-cols-12 gap-x-6">
                <div className="col-span-12">
                    <div className="box custom-box">
                        <div className="box-header">
                            <div className="box-title">Bootstrap Icons</div>
                        </div>
                        <div className="box-body">
                            <p className="mb-1">Simply beautiful open source icons. For more info <Link to="https://icons.getbootstrap.com/" target="_blank" className="text-primary">click here</Link>.</p>
                            <p className="mb-4"><code>&lt;i className="bi bi-ICON_NAME"&gt;&lt;/i&gt;</code></p>
                            <ul className="icons-list list-none">
                                {Bootstrapicons.map((idx)=>(
                                    <SpkOverlay customClass="icons-list-item" as="li">

                                        <i className={`hs-tooltip-toggle  bi bi-${idx.text}`}></i>
                                        <span
                                            className="hs-tooltip-content ti-main-tooltip-content py-1 px-2 !border-0 !bg-black !text-xs !font-medium !text-white shadow-sm "
                                            role="tooltip">
                                            bi bi-{idx.text}
                                        </span>
                                    </SpkOverlay>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-span-12">
                    <div className="box custom-box">
                        <div className="box-header">
                            <div className="box-title">Remix Icons</div>
                        </div>
                        <div className="box-body">
                            <p className="mb-1">Simply beautiful open source icons. For more info <Link to="https://remixicon.com/" target="_blank" className="text-primary">click here</Link>.</p>
                            <p className="mb-4"><code>&lt;i className="ri-ICON_NAME"&gt;&lt;/i&gt;</code></p>
                            <ul className="icons-list list-none">
                                {Remixiconsdata.map((idx)=>(
                                     <SpkOverlay customClass="icons-list-item" as="li" key={Math.random()}>
                                        <i className={`hs-tooltip-toggle ri ri-${idx.text}`}></i>
                                        <span
                                            className="hs-tooltip-content ti-main-tooltip-content py-1 px-2 !border-0 !bg-black !text-xs !font-medium !text-white shadow-sm "
                                            role="tooltip">
                                            ri ri-{idx.text}
                                        </span>
                                    </SpkOverlay>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-span-12">
                    <div className="box custom-box">
                        <div className="box-header">
                            <div className="box-title">Feather Icons</div>
                        </div>
                        <div className="box-body">
                            <p className="mb-1">Simply beautiful open source icons. For more info <Link to="https://feathericons.com/" target="_blank" className="text-primary">click here</Link>.</p>
                            <p className="mb-4"><code>&lt;i className="fe fe-ICON_NAME"&gt;&lt;/i&gt;</code></p>
                            <ul className="icons-list list-none">
                                {Feathericons.map((idx)=>(
                                    <SpkOverlay customClass="icons-list-item" as="li" key={Math.random()}>
                                        <i className={`hs-tooltip-toggle fe fe-${idx.text}`}></i>
                                        <span
                                            className="hs-tooltip-content ti-main-tooltip-content py-1 px-2 !border-0 !bg-black !text-xs !font-medium !text-white shadow-sm "
                                            role="tooltip">
                                            fe fe-{idx.text}
                                        </span>
                                    </SpkOverlay>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-span-12">
                    <div className="box custom-box">
                        <div className="box-header">
                            <div className="box-title">Tabler Icons</div>
                        </div>
                        <div className="box-body">
                            <p className="mb-1">Simply beautiful open source icons. For more info <Link to="https://tabler-icons.io/" target="_blank" className="text-primary">click here</Link>.</p>
                            <p className="mb-4"><code>&lt;i className="ti ti-ICON_NAME"&gt;&lt;/i&gt;</code></p>
                            <ul className="icons-list list-none">
                                {Tablericons.map((idx)=>(
                                    <SpkOverlay customClass="icons-list-item" as="li" key={Math.random()}>
                                            <i className={`hs-tooltip-toggle ti ti-${idx.text}`}></i>
                                            <span
                                                className="hs-tooltip-content ti-main-tooltip-content py-1 px-2 !border-0 !bg-black !text-xs !font-medium !text-white shadow-sm "
                                                role="tooltip">
                                                ti ti-{idx.text}
                                            </span>
                                    </SpkOverlay>
                                ))} 
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-span-12">
                    <div className="box custom-box">
                        <div className="box-header">
                            <div className="box-title">Line Awesome Icons</div>
                        </div>
                        <div className="box-body">
                            <p className="mb-1">Simply beautiful open source icons. For more info <Link to="https://icons8.com/line-awesome" target="_blank" className="text-primary">click here</Link>.</p>
                            <p className="mb-4"><code>&lt;i className="las la-ICON_NAME"&gt;&lt;/i&gt;</code></p>
                            <ul className="icons-list list-none">
                                {LineAwesomeicons.map((idx)=>(
                                    <SpkOverlay customClass="icons-list-item" as="li" key={Math.random()}>
                                        <i className={`hs-tooltip-toggle las la-${idx.text}`}></i>
                                        <span
                                            className="hs-tooltip-content ti-main-tooltip-content py-1 px-2 !border-0 !bg-black !text-xs !font-medium !text-white shadow-sm "
                                            role="tooltip">
                                            las la-{idx.text}
                                        </span>
                                    </SpkOverlay>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-span-12">
                    <div className="box custom-box">
                        <div className="box-header">
                            <div className="box-title">Boxicons</div>
                        </div>
                        <div className="box-body">
                            <p className="mb-1">Simply beautiful open source icons. For more info <Link to="https://boxicons.com/" target="_blank" className="text-primary">click here</Link>.</p>
                            <p className="mb-4"><code>&lt;i className="bx bx-ICON_NAME"&gt;&lt;/i&gt;</code></p>
                            <ul className="icons-list list-none">
                                {Boxicons.map((idx)=>(
                                    <SpkOverlay customClass="icons-list-item" as="li" key={Math.random()}>
                                        <i className={`hs-tooltip-toggle bx bx-${idx.text}`}></i>
                                        <span
                                            className="hs-tooltip-content ti-main-tooltip-content py-1 px-2 !border-0 !bg-black !text-xs !font-medium !text-white shadow-sm "
                                            role="tooltip">
                                            bx bx-{idx.text}
                                        </span>
                                    </SpkOverlay>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Icons