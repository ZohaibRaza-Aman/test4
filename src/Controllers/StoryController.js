import { Story } from "../Models/StoriesSchema.js";


const createStory = async (req, res) => {
    try {
        const { title, image } = req.body;
        const newArticle = new Story({ title, image });
        const savedArticle = await newArticle.save();
        res.json(savedArticle);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const getStoryById = async (req, res) => {
    try {
        const article = await Story.findById(req.params.id);
        if (!article) {
            return res.status(404).send('Article not found');
        }
        res.json(article);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const getAllStories = async (req, res) => {
    try {
        const allStories = await Story.find();
        res.json(allStories);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export { createStory, getStoryById, getAllStories }