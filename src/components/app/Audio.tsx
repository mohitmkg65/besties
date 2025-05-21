import Button from "../shared/Button"
import Card from "../shared/Card"

const Audio = () => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
                <Card title="Er Mohit">
                    <div className="flex flex-col items-center">
                        <img src="/images/avt.avif" alt="avt" className="w-40 h-40 rounded-full object-cover" />
                    </div>
                </Card>
                <Card title="Er Deepak">
                    <div className="flex flex-col items-center">
                        <img src="/images/avt.avif" alt="avt" className="w-40 h-40 rounded-full object-cover" />
                    </div>
                </Card>
            </div>

            <div className="flex justify-between">
                <div className="space-x-4">
                    <button className="bg-amber-500 text-white w-12 h-12 rounded-full hover:bg-amber-400">
                        <i className="ri-mic-line"></i>
                    </button>
                </div>
                <Button icon="close-circle-fill" type="danger">End</Button>
            </div>  
        </div>
    )
}

export default Audio