import { FC, Fragment } from 'react'
import { Activedata, Basictable, Borderdata, Captiondata, Colortables, Groupdata, Hoverabledata, Responsivedata, Table10data, Table12data, Table13data, Table1data, Table4data, Table5data, Table6data, Table7data, Table9data, Tabledata5, Tabledata6, Topcaptuiondata, tablehead } from '../../../components/ui/data/tables/tabledata'
import { basictabledata, datatable10, datatable16, datatable17, datatable19, datatable2, datatable20, datatable24, datatable25, datatable26, datatable27, datatable28, datatable29, datatable31, datatable32, datatable4, datatable5, datatable6, datatable7, datatable8, datatable9, reacttabledata1, reacttabledata10, reacttabledata11, reacttabledata12, reacttabledata13, reacttabledata14, reacttabledata15, reacttabledata16, reacttabledata17, reacttabledata18, reacttabledata19, reacttabledata2, reacttabledata20, reacttabledata21, reacttabledata22, reacttabledata23, reacttabledata24, reacttabledata25, reacttabledata26, reacttabledata27, reacttabledata28, reacttabledata29, reacttabledata3, reacttabledata30, reacttabledata31, reacttabledata32, reacttabledata4, reacttabledata5, reacttabledata6, reacttabledata7, reacttabledata8, reacttabledata9, reusetabledata1, reusetabledata10, reusetabledata11, reusetabledata12, reusetabledata13, reusetabledata14, reusetabledata15, reusetabledata16, reusetabledata17, reusetabledata18, reusetabledata19, reusetabledata2, reusetabledata20, reusetabledata21, reusetabledata22, reusetabledata23, reusetabledata24, reusetabledata25, reusetabledata26, reusetabledata27, reusetabledata28, reusetabledata29, reusetabledata3, reusetabledata30, reusetabledata31, reusetabledata32, reusetabledata4, reusetabledata5, reusetabledata6, reusetabledata7, reusetabledata8, reusetabledata9} from '../../../components/prism-code/tables-prism'
import Pageheader from '../../../components/common/page-header/pageheader'
import Showcode from '../../../components/common/showcode/showcode'
import { Link } from 'react-router-dom'
import SpkBadge from '../../../@spk/uielements/spk-badge'
import Spktables from '../../../@spk/tables/spk-tables'
import SpkButton from '../../../@spk/uielements/spk-button'

interface TableProps {}

const Table: FC<TableProps> = () => {
    const footertext= (
            <tr className="border-b border-defaultborder">
            <th scope="row">
                Total
            </th>
            <td>
                United States
            </td>
            <td>
                558
            </td>
            <td><SpkBadge variant="primary" customClass="text-white">56%</SpkBadge></td>
            </tr>
    );
    
    return (
        <Fragment>
            <Pageheader currentpage="Tables" activepage="Tables" mainpage="Tables" />
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-6 col-span-12">
                    <Showcode title="Basic Table" reactCode={reacttabledata1} reusableCode={reusetabledata1} dataCode={basictabledata}  customCardClass="custom box">
                        <div className="table-responsive">
                            <Spktables tableClass="table whitespace-nowrap min-w-full" tableRowclass="border-b border-defaultborder" header={[{ title: 'Name' }, { title: 'Created On' }, { title: 'Number' }, { title: 'Status' }]}>
                                {Basictable.map((idx) => (
                                    <tr key={Math.random()} className='border-b border-defaultborder'>
                                        <th scope="row" className="text-start">{idx.name}</th>
                                        <td>{idx.date}</td>
                                        <td>{idx.number}</td>
                                        <td><span className={`badge bg-outline-${idx.color}`}>{idx.status}</span></td>
                                    </tr>
                                ))}
                            </Spktables>
                        </div>
                    </Showcode>
                </div>
                <div className="xl:col-span-6 col-span-12">
                    <Showcode title="Bordered Table" reactCode={reacttabledata2} reusableCode={reusetabledata2} dataCode={datatable2} customCardClass="custom box">
                        <div className="table-responsive">
                            <Spktables tableClass="table whitespace-nowrap table-bordered min-w-full" tableRowclass='border-b border-defaultborder' header={[{ title: 'User' }, { title: 'Status' }, { title: 'Email' }, { title: 'Action' }]}>
                                {Table1data.map((idx) => (
                                    <tr className="border-b border-defaultborder" key={Math.random()}>
                                        <th scope="row">
                                            <div className="flex items-center">
                                                <span className={`avatar avatar-xs me-2 ${idx.class1} avatar-rounded`}>
                                                    <img src={idx.src} alt="img" />
                                                </span>{idx.name}
                                            </div>
                                        </th>
                                        <td><SpkBadge variant={idx.color} customClass={`text-${idx.color1}`}>{idx.text}</SpkBadge></td>
                                        <td>{idx.mail}</td>
                                        <td>
                                            <div className="hstack gap-2 flex-wrap">
                                                <Link aria-label="anchor" to="#" className="text-info text-[.875rem] leading-none me-2"><i
                                                    className="ri-edit-line"></i></Link>
                                                <Link aria-label="anchor" to="#" className="text-danger text-[.875rem] leading-none"><i
                                                    className="ri-delete-bin-5-line"></i></Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </Spktables>
                        </div>
                    </Showcode>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-4 col-span-12">
                    <Showcode title="Bordered Primary" reactCode={reacttabledata3} reusableCode={reusetabledata3} dataCode={datatable4} customCardClass="custom box">
                        <div className="table-responsive">
                            <Spktables tableRowclass='border-b border-primary/10' tableClass="table whitespace-nowrap table-bordered table-bordered-primary border-primary/10 min-w-full" header={[{ title: 'Order' }, { title: 'Date' }, { title: 'Customer' }, { title: 'Action' }]}>
                                    {Table4data.map((idx) => (
                                        <tr key={Math.random()} className='border-b border-primary/10'>
                                            <th scope="row" className="text-start">
                                                {idx.order}
                                            </th>
                                            <td>
                                                <span className="badge bg-light text-dark">{idx.date}</span>
                                            </td>
                                            <td>
                                            <div className="flex items-center">
                                                    <span className="avatar avatar-xs me-2 online avatar-rounded">
                                                        <img src={idx.src} alt="img" />
                                                    </span>{idx.name}
                                                </div>
                                            </td>
                                        
                                            <td>
                                            <span className="badge bg-primary/10 text-primary">Booked</span>
                                            </td>
                                        </tr>
                                    ))}
                            </Spktables>
                        </div>
                    </Showcode>
                </div>
                <div className="xl:col-span-4 col-span-12">
                    <Showcode title="Bordered Success" customCardClass="custom box" reactCode={reacttabledata4} reusableCode={reusetabledata4} dataCode={datatable5}>
                        <div className="table-responsive">
                                <Spktables tableRowclass="border-b border-success/10" tableClass="table whitespace-nowrap table-bordered table-bordered-success min-w-full" header={[{ title: 'Order' }, { title: 'Date' }, { title: 'Customer' }, { title: 'Status' }]}>
                                    {Tabledata5.map((idx) => (
                                        <tr className="border-b border-success/10" key={Math.random()}>
                                            <th scope="row" className="text-start">
                                            {idx.order}
                                            </th>
                                            <td>
                                                <span className="badge bg-light text-dark">{idx.date}</span>
                                            </td>
                                            <td>
                                                <div className="flex items-center">
                                                    <span className="avatar avatar-xs me-2 online avatar-rounded">
                                                        <img src={idx.src} alt="img" />
                                                    </span>{idx.name}
                                                </div>
                                            </td>
                                            <td><SpkBadge variant="success/10" customClass="text-success">Delivered</SpkBadge></td>
                                        </tr>
                                    ))}
                             </Spktables>
                        </div>
                    </Showcode>
                </div>
                <div className="xl:col-span-4 col-span-12">
                    <Showcode title="Bordered Warning" customCardClass="custom box" reactCode={reacttabledata5} reusableCode={reusetabledata5} dataCode={datatable6}>
                        <div className="table-responsive">
                                <Spktables tableRowclass='border-b border-warning/10' tableClass="table whitespace-nowrap table-bordered table-bordered-warning min-w-full" header={[{ title: 'Order' }, { title: 'Date' }, { title: 'Customer' }, { title: 'Action' }]}>
                                    {Tabledata6.map((idx) => (
                                        <tr className="border-b border-warning/10" key={Math.random()}>
                                            <th scope="row" className="text-start">
                                            {idx.order}
                                            </th>
                                            <td>
                                                <span className="badge bg-light text-dark">{idx.date}</span>
                                            </td>
                                            <td>
                                                <div className="flex items-center">
                                                    <span className="avatar avatar-xs me-2 online avatar-rounded">
                                                        <img src={idx.src} alt="img" />
                                                    </span>{idx.name}
                                                </div>
                                            </td>
                                            <td><SpkBadge variant="warning/10" customClass="text-warning">Accepted</SpkBadge></td>
                                        </tr>
                                    ))}
                            </Spktables>
                        </div>
                    </Showcode>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-6 col-span-12">
                    <Showcode title="Table Without Borders" customCardClass="custom box" reactCode={reacttabledata6} reusableCode={reusetabledata6} dataCode={datatable7}>
                        <div className="table-responsive">
                            <Spktables tableClass="table whitespace-nowrap table-borderless min-w-full" header={[{ title: 'User Name' }, { title: 'Transaction Id' }, { title: 'Created' }, { title: 'Status' }]}>
                                {Borderdata.map((idx) => (
                                    <tr  key={Math.random()}>
                                        <th scope="row" className="text-start">{idx.name}</th>
                                        <td>{idx.transactionid}</td>
                                        <td>{idx.date}</td>
                                        <td><span className={`badge bg-${idx.color} text-white`}>{idx.status}</span></td>
                                    </tr>
                                ))}
                            </Spktables>
                        </div>
                    </Showcode>
                </div>
                <div className="xl:col-span-6 col-span-12">
                    <Showcode title="Table Group Divideres" reactCode={reacttabledata7} reusableCode={reusetabledata7} dataCode={datatable8} customCardClass="custom box">
                        <div className="table-responsive">
                             <Spktables tableClass="table whitespace-nowrap min-w-full" tBodyClass="table-group-divider dark:border-defaultborder/10" header={[{ title: 'Product' }, { title: 'Seller' }, { title: 'Sale Percentage' }, { title: 'Quantity Sold' }]}>
                                    {Groupdata.map((idx) => (
                                        <tr className="border-b border-defaultborder" key={Math.random()}>
                                        <th scope="row" className="text-start">{idx.product}</th>
                                        <td>{idx.seller}</td>
                                        <td><Link to="#" className={`text-${idx.color}`}>{idx.percent}<i
                                                    className={`ri-arrow-${idx.icon}-fill ms-1`}></i></Link></td>
                                        <td>{idx.sold}</td>
                                    </tr>
                                    ))}
                             </Spktables>
                        </div>
                    </Showcode>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-6 col-span-12">
                    <Showcode title="Striped Rows" reactCode={reacttabledata8}  reusableCode={reusetabledata8} dataCode={datatable9} customCardClass="custom box">
                        <div className="table-responsive">
                            <Spktables tableRowclass="border-b border-defaultborder" tableClass="table whitespace-nowrap ti-striped-table min-w-full" header={[{ title: 'ID' }, { title: 'Date' }, { title: 'Customer' }, { title: 'Status' }]}>
                                {Table5data.map((idx) => (
                                    <tr className="border-b border-defaultborder " key={Math.random()}>
                                        <th scope="row">{idx.order}</th>
                                        <td>{idx.date}</td>
                                        <td>{idx.name}</td>
                                        <td>
                                            <SpkButton buttontype="button" variant="" customClass="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-success-full btn-wave">
                                                <i className="ri-download-2-line align-middle me-2 inline-block"></i>Download
                                            </SpkButton>
                                        </td>
                                    </tr>
                                ))}
                            </Spktables>
                        </div>
                    </Showcode>
                </div>
                <div className="xl:col-span-6 col-span-12">
                    <Showcode title="Striped Columns" reactCode={reacttabledata9} reusableCode={reusetabledata9}  dataCode={datatable9} customCardClass="custom box">
                        <div className="table-responsive">
                                <Spktables tableRowclass="border-b border-defaultborder" tableClass="table whitespace-nowrap table-striped-columns min-w-full" header={[{ title: 'ID' }, { title: 'Date' }, { title: 'Customer' }, { title: 'Action' }]}>
                                    {Table5data.map((idx) => (
                                        <tr className="border-b border-defaultborder " key={Math.random()}>
                                            <th scope="row">{idx.order}</th>
                                            <td>{idx.date}</td>
                                            <td>{idx.name}</td>
                                            <td>
                                                <SpkButton buttontype="button" variant="" customClass="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-danger-full btn-wave">
                                                <i className="ri-delete-bin-line align-middle me-2 d-inline-block"></i>Delete
                                                </SpkButton>
                                            </td>
                                        </tr>
                                    ))}
                                </Spktables>
                        </div>
                    </Showcode>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-4 col-span-12">
                    <Showcode title="Primary Table" reactCode={reacttabledata10} reusableCode={reusetabledata10} dataCode={datatable10} customCardClass="custom box">
                        <div className="table-responsive">
                                <Spktables tableRowclass='border-b border-primary/10' tableClass="table whitespace-nowrap table-primary !rounded-none min-w-full" header={[{ title: '#' }, { title: 'First' }, { title: 'Last' }, { title: 'Handle' }]}>
                                    {Table6data.map((idx) => (
                                        <tr key={Math.random()}>
                                            <th scope="row" className="text-start">{idx.id}</th>
                                            <td>{idx.text1}</td>
                                            <td>{idx.text2}</td>
                                            <td>{idx.text3}</td>
                                        </tr>
                                    ))}
                                </Spktables>
                        </div>
                    </Showcode>
                </div>
                <div className="xl:col-span-4 col-span-12">
                    <Showcode title="Secondary Table" reactCode={reacttabledata11} reusableCode={reusetabledata11} dataCode={datatable10}  customCardClass="custom box">
                        <div className="table-responsive">
                                <Spktables tableRowclass='border-b border-secondary/10' tableClass="table whitespace-nowrap table-secondary  !rounded-none min-w-full" header={[{ title: '#' }, { title: 'First' }, { title: 'Last' }, { title: 'Handle' }]}>
                                    {Table6data.map((idx) => (
                                        <tr key={Math.random()}>
                                            <th scope="row" className="text-start">{idx.id}</th>
                                            <td>{idx.text1}</td>
                                            <td>{idx.text2}</td>
                                            <td>{idx.text3}</td>
                                        </tr>
                                    ))}
                                </Spktables>
                        </div>
                    </Showcode>
                </div>
                <div className="xl:col-span-4 col-span-12">
                    <Showcode title="Warning Table" reactCode={reacttabledata12} reusableCode={reusetabledata12} dataCode={datatable10}  customCardClass="custom box">
                        <div className="table-responsive">
                                <Spktables tableRowclass='border-b border-warning/10' tableClass="table whitespace-nowrap table-warning  !rounded-none min-w-full" header={[{ title: '#' }, { title: 'First' }, { title: 'Last' }, { title: 'Handle' }]}>
                                    {Table6data.map((idx) => (
                                        <tr key={Math.random()}>
                                            <th scope="row" className="text-start">{idx.id}</th>
                                            <td>{idx.text1}</td>
                                            <td>{idx.text2}</td>
                                            <td>{idx.text3}</td>
                                        </tr>
                                    ))}
                                </Spktables>
                        </div>
                    </Showcode>
                </div>
                <div className="xl:col-span-4 col-span-12">
                    <Showcode title="Danger Table" reactCode={reacttabledata13} reusableCode={reusetabledata13} dataCode={datatable10}  customCardClass="custom box">
                        <div className="table-responsive">
                                <Spktables tableRowclass='border-b border-danger/10' tableClass="table whitespace-nowrap table-danger  !rounded-none min-w-full" header={[{headerClassname:'text-start', title: '#' }, {headerClassname:'text-start', title: 'First' }, {headerClassname:'text-start', title: 'Last' }, {headerClassname:'text-start', title: 'Handle' }]}>
                                    {Table6data.map((idx) => (
                                        <tr key={Math.random()}>
                                            <th scope="row" className="text-start">{idx.id}</th>
                                            <td>{idx.text1}</td>
                                            <td>{idx.text2}</td>
                                            <td>{idx.text3}</td>
                                        </tr>
                                    ))}
                                </Spktables>
                        </div>
                    </Showcode>
                </div>
                <div className="xl:col-span-4 col-span-12">
                    <Showcode title="Dark Table" reactCode={reacttabledata14} reusableCode={reusetabledata14} dataCode={datatable10}  customCardClass="custom box">
                        <div className="table-responsive">
                                <Spktables tableRowclass='border-b border-success/10' tableClass="table whitespace-nowrap table-dark !rounded-none min-w-full" header={[{headerClassname:'text-start', title: '#' }, {headerClassname:'text-start', title: 'First' }, {headerClassname:'text-start', title: 'Last' }, {headerClassname:'text-start', title: 'Handle' }]}>
                                        {Table6data.map((idx) => (
                                            <tr key={Math.random()}>
                                                <th scope="row" className="text-start">{idx.id}</th>
                                                <td>{idx.text1}</td>
                                                <td>{idx.text2}</td>
                                                <td>{idx.text3}</td>
                                            </tr>
                                        ))}
                                </Spktables>
                        </div>
                    </Showcode>
                </div>
                <div className="xl:col-span-4 col-span-12">
                    <Showcode title="Success Table With Striped Rows" reactCode={reacttabledata15} reusableCode={reusetabledata15} dataCode={datatable10}  customCardClass="custom box">
                        <div className="table-responsive">
                                <Spktables tableRowclass='border-b border-success/10' tableClass="table whitespace-nowrap table-success table-striped  !rounded-none min-w-full" header={[{headerClassname:'text-start', title: '#' }, {headerClassname:'text-start',  title: 'First' }, { headerClassname:'text-start', title: 'Last' }, {headerClassname:'text-start',  title: 'Handle' }]}>
                                        {Table6data.map((idx) => (
                                            <tr key={Math.random()}>
                                                <th scope="row" className="text-start">{idx.id}</th>
                                                <td>{idx.text1}</td>
                                                <td>{idx.text2}</td>
                                                <td>{idx.text3}</td>
                                            </tr>
                                        ))}
                                </Spktables>
                        </div>
                    </Showcode>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-6 col-span-12">
                    <Showcode title="Hoverable Rows" reactCode={reacttabledata16} reusableCode={reusetabledata16} dataCode={datatable16}   customCardClass="custom box">
                        <div className="table-responsive">
                            <Spktables tableRowclass='border-b border-defaultborder' tableClass="table whitespace-nowrap table-hover min-w-full ti-custom-table-hover" header={[{ title: 'Product Manager' }, { title: 'Category' }, { title: 'Team' }, { title: 'Status' }]}>
                                {Hoverabledata.map((idx) => (
                                    <tr className="border-b border-defaultborder " key={Math.random()}>
                                        <td>
                                            <div className="flex items-center">
                                                <div className="avatar avatar-sm me-2 avatar-rounded">
                                                    <img src={idx.src} alt="img" />
                                                </div>
                                                <div>
                                                    <div className="leading-none">
                                                        <span>{idx.product}</span>
                                                    </div>
                                                    <div className="leading-none">
                                                        <span
                                                            className="text-[0.6875rem] text-[#8c9097] dark:text-white/50">{idx.mail}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><SpkBadge customClass={`badge bg-${idx.color}/10 text-${idx.color}`}>{idx.category}</SpkBadge></td>
                                        <td>
                                        {idx.team}
                                        </td>
                                        <td>
                                            <div className="progress progress-xs">
                                                <div className={`progress-bar bg-primary w-${idx.status}`} role="progressbar" aria-valuenow={52} aria-valuemin={0}
                                                    aria-valuemax={100}>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </Spktables>
                        </div>
                    </Showcode>
                </div>
                <div className="xl:col-span-6 col-span-12">
                    <Showcode title="Hoverable Rows With Striped Rows" reactCode={reacttabledata17}  reusableCode={reusetabledata17} dataCode={datatable17} customCardClass="custom box">
                        <div className="table-responsive">
                                <Spktables tableRowclass='border-b border-defaultborder' tableClass="table whitespace-nowrap ti-striped-table table-hover min-w-full ti-custom-table-hover" header={[{ title: 'Invoice' }, { title: 'Customer' }, { title: 'Status' }, { title: 'Date' }]}>
                                    {Table13data.map((idx) => (
                                        <tr className="border-b border-defaultborder " key={Math.random()}>
                                            <th scope="row">{idx.text1}</th>
                                            <td>
                                                <div className="flex items-center">
                                                    <div className="avatar avatar-sm me-2 avatar-rounded">
                                                        <img src={idx.src} alt="img" />
                                                    </div>
                                                    <div>
                                                        <div className="leading-none">
                                                            <span>{idx.name}</span>
                                                        </div>
                                                        <div className="leading-none">
                                                            <span
                                                                className="text-[0.6875rem] text-[#8c9097] dark:text-white/50">{idx.mail}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><SpkBadge customClass={`bg-${idx.color}/10 text-${idx.color} ${idx.customclass}`}><i
                                                className={`ri-${idx.icon} align-middle me-1`}></i>{idx.text2}</SpkBadge></td>
                                            <td>{idx.date}</td>
                                        </tr>
                                    ))}
                               </Spktables>
                        </div>
                    </Showcode>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-6 col-span-12">
                    <Showcode title="Table Head Primary" reactCode={reacttabledata18}  reusableCode={reusetabledata18} dataCode={datatable7} customCardClass="custom box">
                        <div className="table-responsive">
                            <Spktables tableRowclass='border-b border-primary/10' headerClass="bg-primary/10" tableClass="table whitespace-nowrap min-w-full" header={[{ headerClassname:"text-start",title: 'User Name' }, {headerClassname:"text-start", title: 'Transaction Id' }, {headerClassname:"text-start", title: 'Created' }, {headerClassname:"text-start", title: 'Status' }]}>
                                {Table7data.map((idx) => (
                                    <tr className="border-b border-primary/10" key={Math.random()}>
                                        <th scope="row" className="text-start">{idx.name}</th>
                                        <td>{idx.text}</td>
                                        <td>{idx.date}</td>
                                        <td>
                                            <div className="hstack flex gap-3 text-[.9375rem]">
                                                <Link aria-label="anchor" to="#"
                                                    className="ti-btn ti-btn-sm ti-btn-success !rounded-full"><i
                                                        className="ri-download-2-line"></i></Link>
                                                <Link aria-label="anchor" to="#"
                                                    className="ti-btn ti-btn-sm ti-btn-info !rounded-full"><i
                                                        className="ri-edit-line"></i></Link>
                                                <Link aria-label="anchor" to="#"
                                                    className="ti-btn ti-btn-sm ti-btn-danger !rounded-full"><i
                                                        className="ri-delete-bin-line"></i></Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </Spktables>
                        </div>
                    </Showcode>
                </div>
                <div className="xl:col-span-6 col-span-12">
                    <Showcode title="Table Head Warning" reactCode={reacttabledata19} reusableCode={reusetabledata19}  dataCode={datatable19} customCardClass="custom box">
                        <div className="table-responsive">
                            <Spktables tableRowclass='border-b border-defaultborder' tableClass="table whitespace-nowrap min-w-full" headerClass="bg-warning/10" header={[{ title: 'User Name' }, { title: 'Transaction Id' }, { title: 'Created' }, { title: 'Status' }]}>
                                    {tablehead.map((idx) => (
                                        <tr key={Math.random()} className="border-b border-defaultborder">
                                            <th scope="row" className="text-start">{idx.name}</th>
                                            <td>{idx.text}</td>
                                            <td>{idx.date}</td>
                                            <td>
                                                <SpkButton buttontype="button" variant={idx.color} customClass="ti-btn !py-1 !px-2 !text-[0.75rem]">{idx.btn}</SpkButton>
                                            </td>
                                        </tr>
                                    ))}
                            </Spktables>
                        </div>
                    </Showcode>
                </div>
                <div className="xl:col-span-6 col-span-12">
                    <Showcode title="Table Head Success" reactCode={reacttabledata20}  reusableCode={reusetabledata20} dataCode={datatable20} customCardClass="custom box">
                        <div className="table-responsive">
                            <Spktables tableRowclass='border-b border-defaultborder' tableClass="table whitespace-nowrap min-w-full" headerClass="bg-success/10" header={[{ title: 'User Name' }, { title: 'Transaction Id' }, { title: 'Created' }, { title: 'Status' }]}>
                                    {tablehead.map((idx) => (
                                        <tr key={Math.random()} className="border-b border-defaultborder">
                                            <th scope="row" className="text-start">{idx.name}</th>
                                            <td>{idx.text}</td>
                                            <td>{idx.date}</td>
                                            <td>
                                                <SpkButton buttontype="button" variant={idx.color} customClass="ti-btn !py-1 !px-2 !text-[0.75rem]">{idx.btn}</SpkButton>
                                            </td>
                                        </tr>
                                    ))}
                            </Spktables>
                        </div>
                    </Showcode>
                </div>
                <div className="xl:col-span-6 col-span-12">
                    <Showcode title="Table Head Info" reactCode={reacttabledata21} reusableCode={reusetabledata21}  dataCode={datatable20} customCardClass="custom box">
                        <div className="table-responsive">
                                <Spktables tableRowclass='border-b border-defaultborder' tableClass="table whitespace-nowrap min-w-full" headerClass="bg-info/10" header={[{ title: 'User Name' }, { title: 'Transaction Id' }, { title: 'Created' }, { title: 'Status' }]}>
                                    {tablehead.map((idx) => (
                                        <tr key={Math.random()} className="border-b border-defaultborder">
                                            <th scope="row" className="text-start">{idx.name}</th>
                                            <td>{idx.text}</td>
                                            <td>{idx.date}</td>
                                            <td>
                                                <SpkButton buttontype="button" variant={idx.color} customClass="ti-btn !py-1 !px-2 !text-[0.75rem]">{idx.btn}</SpkButton>
                                            </td>
                                        </tr>
                                    ))}
                                 </Spktables>
                        </div>
                    </Showcode>
                </div>
                <div className="xl:col-span-6 col-span-12">
                    <Showcode title="Table Head Secondary" reactCode={reacttabledata22} reusableCode={reusetabledata22} dataCode={datatable20} customCardClass="custom box">
                        <div className="table-responsive ">
                                <Spktables tableRowclass='border-b border-defaultborder' tableClass="table whitespace-nowrap min-w-full" headerClass="bg-secondary/10" header={[{ title: 'User Name' }, { title: 'Transaction Id' }, { title: 'Created' }, { title: 'Status' }]}>
                                    {tablehead.map((idx) => (
                                        <tr key={Math.random()} className="border-b border-defaultborder">
                                            <th scope="row" className="text-start">{idx.name}</th>
                                            <td>{idx.text}</td>
                                            <td>{idx.date}</td>
                                            <td>
                                                <SpkButton buttontype="button" variant={idx.color} customClass="ti-btn !py-1 !px-2 !text-[0.75rem]">{idx.btn}</SpkButton>
                                            </td>
                                        </tr>
                                    ))}
                                </Spktables>
                        </div>
                    </Showcode>
                </div>
                <div className="xl:col-span-6 col-span-12">
                    <Showcode title="Table Head Danger" reactCode={reacttabledata23}  reusableCode={reusetabledata23} dataCode={datatable20} customCardClass="custom box">
                        <div className="table-responsive">
                            <Spktables tableRowclass='border-b border-defaultborder' tableClass="table whitespace-nowrap min-w-full" headerClass="bg-danger/10" header={[{ title: 'User Name' }, { title: 'Transaction Id' }, { title: 'Created' }, { title: 'Status' }]}>
                                {tablehead.map((idx) => (
                                    <tr key={Math.random()} className="border-b border-defaultborder">
                                        <th scope="row" className="text-start">{idx.name}</th>
                                        <td>{idx.text}</td>
                                        <td>{idx.date}</td>
                                        <td>
                                            <SpkButton buttontype="button" variant={idx.color} customClass="ti-btn !py-1 !px-2 !text-[0.75rem]">{idx.btn}</SpkButton>
                                        </td>
                                    </tr>
                                ))}
                            </Spktables>
                        </div>
                    </Showcode>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-4 col-span-12">
                    <Showcode title="Table Foot" reactCode={reacttabledata24} reusableCode={reusetabledata24} dataCode={datatable24} customCardClass="custom box">
                        <div className="table-responsive">
                                <Spktables tableRowclass='border-b border-defaultborder' footchildren={footertext} footerClass="bg-primary/10"  headerClass="bg-primary/10" tableClass="table whitespace-nowrap min-w-full" header={[{title:'S.No'}, {title:'Team'}, {title:'Matches Won'}, {title:'Win Ratio'}]}>
                                        {Table10data.map((idx) => (
                                            <tr className="border-b border-defaultborder" key={Math.random()}>
                                                <th scope="row">
                                                {idx.text1}
                                                </th>
                                                <td>
                                                {idx.text2}
                                                </td>
                                                <td>
                                                {idx.text3}
                                                </td>
                                                <td>
                                                    <span className="badge bg-primary text-white">{idx.text4} </span>
                                                </td>
                                            </tr>
                                        ))}
                                </Spktables>
                        </div>
                    </Showcode>
                </div>
                <div className="xl:col-span-4 col-span-12">
                    <Showcode title="Table With Caption" reactCode={reacttabledata25} reusableCode={reusetabledata25} dataCode={datatable25} customCardClass="custom box">
                        <div className="table-responsive">
                          <Spktables tableRowclass='border-b border-defaultborder' headerContent={<caption>Top 3 Countries</caption>} tableClass="table whitespace-nowrap min-w-full caption-bottom" header={[{headerClassname:'text-start', title: 'S.No' }, {headerClassname:'text-start', title: 'Country' }, {headerClassname:'text-start', title: 'Medals Won' }, {headerClassname:'text-start', title: 'No Of Athletes' }]}>
                                {Captiondata.map((idx) => (
                                    <tr className="border-b border-defaultborder"  key={Math.random()}>
                                        <th scope="row" className="text-start">0{idx.id}</th>
                                        <td>{idx.country}</td>
                                        <td>{idx.won}<i className="ri-medal-line mx-2"></i></td>
                                        <td>{idx.athletes}</td>
                                    </tr>
                                ))}
                          </Spktables>
                        </div>
                    </Showcode>
                </div>
                <div className="xl:col-span-4 col-span-12">
                    <Showcode title="Table With Top Caption" reactCode={reacttabledata26} reusableCode={reusetabledata26} dataCode={datatable26} customCardClass="custom box">
                        <div className="table-responsive">
                            <Spktables headerContent={<caption>Top IT Companies</caption>} tableClass="table whitespace-nowrap caption-top w-full" header={[{ title: 'S.No' }, { title: 'Name' }, { title: 'Revenue' }, { title: 'Country' }]}>
                                    {Topcaptuiondata.map((idx) => (
                                        <tr className="border-b border-defaultborder" key={Math.random()}>
                                            <th scope="row">{idx.id}</th>
                                            <td>{idx.name}</td>
                                            <td>{idx.revenue}</td>
                                            <td>{idx.country}</td>
                                        </tr>
                                    ))}
                            </Spktables>
                        </div>
                    </Showcode>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-6 col-span-12">
                    <Showcode title="Active Tables" reactCode={reacttabledata27} reusableCode={reusetabledata27}  dataCode={datatable27} customCardClass="custom box">
                        <div className="table-responsive">
                            <Spktables tableRowclass='border-b border-defaultborder' tableClass="table whitespace-nowrap min-w-full" header={[{headerClassname:'text-start', title: 'Name' }, {headerClassname:'text-start', title: 'Created On' }, {headerClassname:'text-start', title: 'Number' }, {headerClassname:'text-start', title: 'Status' }]}>
                                {Activedata.map((idx) => (
                                    <tr key={Math.random()} className={idx.class}>
                                        <th scope="row" className="text-start">{idx.name}</th>
                                        <td>{idx.create}</td>
                                        <td className={idx.tdclass}>{idx.number}</td>
                                        <td><span className={`badge bg-${idx.color} text-white`}>{idx.status}</span></td>
                                    </tr>
                                ))}
                            </Spktables>
                        </div>
                    </Showcode>
                </div>
                <div className="xl:col-span-6 col-span-12">
                    <Showcode title="Small Tables" reactCode={reacttabledata28} reusableCode={reusetabledata28} dataCode={datatable28} customCardClass="custom box">
                        <div className="table-responsive">
                                <Spktables tableRowclass='border-b border-defaultborder' tableClass="table whitespace-nowrap table-sm min-w-full" header={[{headerClassname:'text-start', title: 'Invoice' }, {headerClassname:'text-start', title: 'Created Date' }, {headerClassname:'text-start', title: 'Status' }, { headerClassname:'text-start',title: 'Action' }]}>
                                    {Table9data.map((idx) => (
                                        <tr className="border-b border-defaultborder" key={Math.random()}>
                                            <th scope="row" className="text-start">
                                                <div className="form-check">
                                                <input id={idx.id} defaultChecked={idx.checked === 'defaultChecked'}    className="form-check-input me-1"  type="checkbox" value=""   />
                                                    <label className="form-check-label" htmlFor="checkebox-sm">
                                                    {idx.name}
                                                    </label>
                                                </div>
                                            </th>
                                            <td>{idx.date}</td>
                                            <td><span className={`badge bg-${idx.class}/10 text-${idx.class}`}>{idx.text}</span></td>
                                            <td>
                                                <div className="hstack flex gap-3 text-[.9375rem]">
                                                    <Link aria-label="anchor" to="#" className="ti-btn ti-btn-icon ti-btn-sm ti-btn-light"><i className="ri-download-2-line"></i></Link>
                                                    <Link aria-label="anchor" to="#" className="ti-btn ti-btn-icon ti-btn-sm ti-btn-light"><i className="ri-edit-line"></i></Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </Spktables>
                        </div>
                    </Showcode>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-6 col-span-12">
                    <Showcode title="Color Variant Tables" reactCode={reacttabledata29} reusableCode={reusetabledata29}  dataCode={datatable29} customCardClass="custom box">
                        <div className="table-responsive">
                            <Spktables tableRowclass='border-b border-defaultborder' tableClass="table whitespace-nowrap min-w-full" header={[{headerClassname:'text-start', title: 'Color' }, {headerClassname:'headerClassname', title: 'Client' }, { headerClassname:'headerClassname',title: 'State' }, {headerClassname:'headerClassname', title: 'Quantity' }, {headerClassname:'headerClassname', title: 'Total Price' }]}>
                                    {Colortables.map((idx) => (
                                        <tr key={Math.random()} className={`${idx.class1} border-b border-defaultborder`}>
                                            <th scope="row">{idx.text}</th>
                                            <td>{idx.name}</td>
                                            <td><span 
                                             className={`badge ${idx.class2}`}>Processed</span></td>
                                            <td>{idx.quantity}</td>
                                            <td>{idx.price}</td>
                                        </tr>
                                    ))}
                            </Spktables>
                        </div>
                    </Showcode>
                </div>
                <div className="xl:col-span-6 col-span-12">
                    <Showcode title="Nesting" reactCode={reacttabledata30}  reusableCode={reusetabledata30} customCardClass="custom box">
                        <div className="table-responsive">
                                <Spktables tableRowclass='border-b border-defaultborder' tableClass="table whitespace-nowrap table-striped table-bordered min-w-full" header={[{ headerClassname:'text-start', title: '#' }, {headerClassname:'text-start', title: 'First' }, {headerClassname:'text-start', title: 'Last' }, { headerClassname:'text-start',title: 'Handle' }]}>
                                    <tr className="border-b border-defaultborder">
                                        <th scope="row" className="text-start">1</th>
                                        <td>Mark</td>
                                        <td>Otto</td>
                                        <td>@mdo</td>
                                    </tr>
                                    <tr className="border-b border-defaultborder">
                                        <td colSpan={4}>
                                            <Spktables tableClass="table whitespace-nowrap mb-0 min-w-full" tableRowclass="border-b border-defaultborder"
                                              header={[{ headerClassname:'text-start', title: 'Alphabets' }, {headerClassname:'text-start', title: 'Users' }, {headerClassname:'text-start', title: 'Email' }]}>
                                                    <tr className="border-b border-defaultborder">
                                                        <th scope="row" className="text-start">A</th>
                                                        <td>Dino King</td>
                                                        <td>dinoking231@gmail.com</td>
                                                    </tr>
                                                    <tr className="border-b border-defaultborder">
                                                        <th scope="row" className="text-start">B</th>
                                                        <td>Poppins sams</td>
                                                        <td>pops@gmail.com</td>
                                                    </tr>
                                                    <tr className="border-b border-defaultborder">
                                                        <th scope="row" className="text-start">C</th>
                                                        <td>Brian Shaw</td>
                                                        <td>swanbrian@gmail.com</td>
                                                    </tr>
                                            </Spktables>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-defaultborder">
                                        <th scope="row" className="text-start">3</th>
                                        <td>Larry</td>
                                        <td>the Bird</td>
                                        <td>@twitter</td>
                                    </tr>
                                    <tr className="border-b border-defaultborder">
                                        <th scope="row" className="text-start">4</th>
                                        <td>Jimmy</td>
                                        <td>the Ostrich</td>
                                        <td>Dummy Text</td>
                                    </tr>
                                    <tr className="border-b border-defaultborder">
                                        <th scope="row" className="text-start">5</th>
                                        <td>Cobra Kai</td>
                                        <td>the Snake</td>
                                        <td>Another Name</td>
                                    </tr>
                                    </Spktables>
                        </div>
                    </Showcode>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-12 col-span-12">
                    <Showcode title="Always Responsive" reactCode={reacttabledata31} reusableCode={reusetabledata31} dataCode={datatable31} customCardClass="custom box">
                        <div className="table-responsive">
                            <Spktables tableRowclass='border-b border-defaultborder' tableClass="table whitespace-nowrap min-w-full" showCheckbox={true} header={[{ title: 'Team Head' }, { title: 'Category' }, { title: 'Role' }, {headerClassname:"text-start", title: 'Gmail' }, {headerClassname:"text-start", title: 'Team' }, {headerClassname:"text-start", title: 'Work Progress' }, {headerClassname:"text-start", title: 'Revenue' }, {headerClassname:"text-start", title: 'Action' }]}>
                                {Responsivedata.map((idx) => (
                                    <tr className="border-b border-defaultborder" key={Math.random()}>
                                        <th scope="row"><input className="form-check-input" type="checkbox" id="checkboxNoLabel1" defaultValue="" aria-label="..." /></th>
                                        <td>
                                            <div className="flex items-center">
                                                <span className="avatar avatar-xs me-2 online avatar-rounded">
                                                    <img src={idx.src} alt="img" />
                                                </span>{idx.name}
                                            </div>
                                        </td>
                                        <td>{idx.category}</td>
                                        <td><SpkBadge customClass={`bg-${idx.color}/10 text-${idx.color}`}>{idx.role}</SpkBadge></td>
                                        <td>{idx.mail}</td>
                                        <td>
                                            {idx.team}
                                        </td>
                                        <td>
                                            <div className="progress progress-xs">
                                                <div className={`progress-bar bg-primary w-[${idx.progress}%]`} role="progressbar" aria-valuenow={52} aria-valuemin={0} aria-valuemax={100}>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{idx.revenue}</td>
                                        <td>
                                            <div className="hstack flex gap-3 text-[.9375rem]">
                                                <Link aria-label="anchor" to="#" className="ti-btn ti-btn-icon ti-btn-sm ti-btn-success-full"><i className="ri-download-2-line"></i></Link>
                                                <Link aria-label="anchor" to="#" className="ti-btn ti-btn-icon ti-btn-sm ti-btn-info-full"><i className="ri-edit-line"></i></Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </Spktables>
                        </div>
                    </Showcode>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-12 col-span-12">
                    <Showcode title="Vertical Alignment" reactCode={reacttabledata32} reusableCode={reusetabledata32} dataCode={datatable32} customCardClass="custom box">
                        <div className="table-responsive vertical-alignment-table">
                            <Spktables tableRowclass='border-b border-defaultborder' tableClass="table align-middle min-w-full" header={[{ title: 'Heading 1', headerClassname:'w-[25%] text-start' }, { title: 'Heading 2' ,headerClassname:'w-[25%] text-start'  }, { title: 'Heading 3' ,headerClassname:'w-[25%] text-start' }, { title: 'Heading 4',headerClassname:'w-[25%] text-start'  }]}>
                                    {Table12data.map((idx) => (
                                        <tr key={Math.random()} className={idx.class1}>
                                            <td>{idx.text1} <code>{idx.code1}</code> {idx.text2}</td>
                                            <td>{idx.text1} <code>{idx.code1}</code> {idx.text2}</td>
                                            <td className={idx.class2}>{idx.text3} <code>{idx.code2}</code> {idx.text4}</td>
                                            <td>This here is some placeholder text, intended to take up
                                                quite a
                                                bit of vertical space, to demonstrate how the vertical
                                                alignment
                                                works in the preceding cells.</td>
                                        </tr>
                                    ))}
                            </Spktables>
                        </div>
                    </Showcode>
                </div>
            </div>
        </Fragment>
    )
}

export default Table