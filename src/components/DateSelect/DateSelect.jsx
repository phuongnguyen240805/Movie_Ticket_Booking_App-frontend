import { useState } from 'react';
import BlurCircle from '../BlurCircle';
import { routesConfig } from '@/configs';
import Button from '../Button';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';

const DateSelect = ({ dateTime, id }) => {

    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);

    const onBookHandler = () => {
        if (!selected) {
            return toast('Please select a date');
        };
        navigate(routesConfig.seatLayoutPageGenerator(id, selected));
    };

    return (
        <div id='dateSelect' className='pt-30'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg'>

                <BlurCircle top='-100px' left='-100px' />
                <BlurCircle top='100px' right='0px' />

                <div>
                    <p className='text-lg font-semibold'>Choose Date</p>
                    <div className='flex items-center gap-6 text-sm mt-5'>
                        <Button ><ChevronLeftIcon width={28} /></Button>

                        <span className='grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4'>
                            {Object.keys(dateTime).map((date) => (
                                <button
                                    key={date}
                                    className={`flex flex-col items-center justify-center 
                                    h-14 w-14 aspect-square rounded cursor-pointer 
                                    ${selected === date ? "bg-primary text-white" : "border border-primary/70"}`}
                                    onClick={() => setSelected(date)}
                                >
                                    <span>{new Date(date).getDate()}</span>
                                    <span>{new Date(date).toLocaleDateString("en-US", { month: "short" })}</span>
                                </button>
                            ))}
                        </span>

                        <Button><ChevronRightIcon width={28} /></Button>
                    </div>
                </div>

                <Button
                    primary
                    rounded_sm
                    onClick={onBookHandler}
                    className="px-8 py-2 mt-10">
                    Book Now
                </Button>
            </div>
        </div>
    );
};

DateSelect.propTypes = {
    dateTime: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
}

export default DateSelect;