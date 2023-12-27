import mongoose from "mongoose";

const storySchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    });

const Story = mongoose.model("Story", storySchema);
export { Story };
