import Card from "../shared/Card"
import Divider from "../shared/Divider"
import IconButton from "../shared/IconButton"
import Button from "../shared/Button"

const Post = () => {
    return (
        <div className="space-y-8">
            {
                Array(20).fill(0).map((item, index) => (
                    <Card uniqueKey={index}>
                        <div className="space-y-3">
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, alias? Praesentium culpa eum ipsum. Delectus animi dignissimos aut vero odit voluptates minus obcaecati recusandae impedit neque rem sit, veritatis perspiciatis?</p>
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-normal">Jan 2, 2025 07:00 PM</label>
                                <div className="flex gap-4">
                                    <IconButton type="info" icon="edit-line"/>
                                    <IconButton type="primary" icon="delete-bin-4-line"/>
                                </div>
                            </div>
                            <Divider />
                            <div className="space-x-4">
                                <Button type="info" icon="thumb-up-line">20K</Button>
                                <Button type="warning" icon="thumb-down-line">20K</Button>
                                <Button type="danger" icon="chat-ai-line">20K</Button>
                            </div>
                        </div>
                    </Card>
                ))
            }
        </div>
    )
}

export default Post