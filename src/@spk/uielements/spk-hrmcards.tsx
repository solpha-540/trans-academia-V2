import  { Fragment } from 'react'
import SpkBadge from '../uielements/spk-badge';

interface SpkHrmcardsProps {
    Customclass?: string; // Custom class for the avatar
    Titletext?: string;   // Title text to display
    Value?: string | number; // Value to display, can be a string or number
    Increment: string ; // Increment value, can also be string or number
    Color?: string; // Color for the badge
    Icon?: string; // Color for the badge
  }

const SpkHrmcards :React.FC<SpkHrmcardsProps>= ({Customclass, Titletext, Value, Increment, Color, Icon}) => {
  return (
    <Fragment>
            <div className={`box hrm-main-card ${Color}`}>
                    <div className="box-body">
                        <div className="flex items-start">
                            <div className="me-4">
                                <span className={`avatar ${Customclass}`}>
                                    <i className={`ri-${Icon} text-[1.125rem]`}></i>
                                </span>
                            </div>
                            <div className="flex-grow">
                                <span className="font-semibold text-[#8c9097] dark:text-white/50 block mb-1">
                                {Titletext}
                                    </span>
                                <h5 className="font-semibold mb-1 text-[1.25rem]">{Value}</h5>
                                <p className="mb-0">
                                    <SpkBadge variant={`${Color}/10`} customClass={`text-${Color}`}>This Month</SpkBadge>
                                </p>
                            </div>
                            <div>
                                <span className={`text-[0.875rem] font-semibold text-${Increment.includes("+")? "success": "danger"}`}>{Increment}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
    </Fragment>
  )
}

export default SpkHrmcards