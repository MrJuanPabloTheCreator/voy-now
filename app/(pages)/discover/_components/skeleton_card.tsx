
const SkeletonCard = () => {
    return (
        <div>
            <div className="skeleton w-full h-64 rounded-xl" />
            <div className="flex flex-col w-full py-2 space-y-2">
                <h2 className="skeleton py-2 w-2/3"/>
                <h3 className="skeleton py-2 w-1/3"/>
            </div>
        </div>
    )
}

export default SkeletonCard;