const News = require('../model/newsModel');

let getAllNews = async (req, res) => {
    try {
        let filter = {};
        
        // 👇 UPDATED: Skip the userId filter entirely if the user is a Super Admin
        if (req.query.userId && req.query.isSuperAdmin !== 'true') {
            filter.userId = req.query.userId;
        }

        let news = await News.find(filter);
        res.send(news);
    } catch (error) {
        res.status(500).send({ message: "Error fetching news" });
    }
}

let getNewsById = async (req, res) => {
    try {
        let id = req.params.id; 
        let newsItem = await News.findById(id);
        
        if (!newsItem) {
            return res.status(404).send({ message: "News not found" });
        }
        res.send(newsItem);
    } catch (error) {
        res.status(500).send({ message: "Invalid ID format or Server Error" });
    }
}

let addNews = async (req, res) => {
    try {
        let data = req.body;
        let newNews = await News.create(data);
        res.send(newNews);
    } catch (error) {
        res.status(500).send(error);
    }
}

let updateNews = async (req, res) => {
    let id = req.query.id;
    let data = req.body;
    let updatedNews = await News.findByIdAndUpdate(id, data, { returnDocument: "after" });
    res.send(updatedNews);
}

let deleteNews = async (req, res) => {
    let id = req.query.id;
    let deletedNews = await News.findByIdAndDelete(id);
    if (!deletedNews) {
        return res.status(404).send("News not found");
    }
    res.send(deletedNews);
}
const createNews = async (req, res) => {
    try {
        // req.body contains all the dynamic blocks and data sent from React
        const newArticle = await News.create(req.body);
        res.status(201).send(newArticle);
    } catch (error) {
        console.error("Crash while creating news:", error);
        res.status(500).send("Failed to create article");
    }
};

module.exports = { getAllNews, getNewsById, addNews, updateNews, deleteNews, createNews };