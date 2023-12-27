import { Poll } from "../Models/PollSchema.js";
import { errHandler, responseHandler } from "../helper/response.js";

const createPoll = async (req, res) => {
    const { question, options } = req.body;
    try {
        const newPoll = new Poll({ question, options });
        await newPoll.save();
        res.json(newPoll);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updatePool = async (req, res) => {
    const { id } = req.params;
    const { optionIndex } = req.body;

    try {
        const poll = await Poll.findById(id);
        poll.options[optionIndex].votes += 1;
        await poll.save();
        res.json(poll);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Import necessary modules and Poll model

const getAllPolls = async (req, res) => {
    try {
        // Retrieve all polls from the database
        const allPolls = await Poll.find();

        // Calculate option percentages and votes for each poll
        const pollsWithVotesAndPercentages = allPolls.map(poll => {
            const totalVotes = poll.options.reduce((acc, option) => acc + option.votes, 0);

            const optionsWithVotesAndPercentage = poll.options.map(option => ({
                optionText: option.optionText,
                votes: option.votes,
                percentage: totalVotes === 0 ? 0 : (option.votes / totalVotes) * 100
            }));

            return {
                _id: poll._id,
                question: poll.question,
                options: optionsWithVotesAndPercentage
            };
        });

        // Respond with the polls including question, answers, votes, and option percentages
        res.json(pollsWithVotesAndPercentages);
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export { createPoll, updatePool, getAllPolls };

