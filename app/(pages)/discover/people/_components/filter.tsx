"use client"

const Filter = () => {
    return (
        <div className="grid h-[400px] pr-5 border-r-2 border-b-2 rounded-lg mr-5">
            <div className="flex items-center">
                <p>Time: 6:00 pm</p>
                <input className="bg-slate-100 rounded-lg"/>
            </div>
            <div className="flex items-center">
                Place: Penalolen
            </div>
            <div className="flex items-center">
                Amount per person: $3.500
            </div>
            <div className="flex items-center">
                Radio: 5km
            </div>
        </div>
    )
}

export default Filter;