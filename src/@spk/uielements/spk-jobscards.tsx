import React, { Fragment, ReactNode } from 'react'

interface SpkJobsCardsProps {
    svg?: ReactNode;        
    title?: string;        
    ratio?: string | number; 
    text: string;        
    color?: string;   
}

const SpkJobsCards :React.FC<SpkJobsCardsProps> = ({svg, text, ratio, title, color}) => {
  return (
    <Fragment>
          <div className="box">
                <div className="box-body !pb-[0.9rem]">
                    <div className="flex items-start">
                        <div className="me-4 gap-0">
                            <span className={`avatar avatar-md p-2 ${color}`}>
                                {svg}
                            </span>
                        </div>
                        <div className="flex-grow">
                            <div className="flex mb-1 items-start justify-between">
                                <h5 className="font-semibold mb-0 leading-none text-[1.25rem]">{ratio}</h5>
                                <div className={`text-${text.includes("+")? "success":"danger"} font-semibold`}><i
                                    className={`ri-arrow-${text.includes("+")? "up":"down"}-s-fill me-1 align-middle`}></i>{text}</div>
                            </div>
                            <p className="mb-0 text-[0.625rem] opacity-[0.7] text-[#8c9097] dark:text-white/50 font-semibold">{title}</p>
                        </div>
                    </div>
                </div>
            </div> 
    </Fragment>
  )
}

export default SpkJobsCards