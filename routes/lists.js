const router = require('express').Router();
const verify = require("../verifyToken");
const List = require("../models/List");

// List means where bunch of movies are stored in array in mongodb 

// CREATE List
router.post('/', verify, async (req, res) => {
    if (!req.user.isAdmin) {
        const newList = new List(req.body);
        try {
            const savedList = await newList.save();
            res.status(201).json(savedList);

        } catch (err) {
            console.log(err);
            res.status(404).json('You are not allowed');

        }
    }

});


// DELETE List
router.delete('/:id', verify, async (req, res) => {
    if (!req.user.isAdmin) {
        try {
            await List.findByIdAndDelete(req.params.id);
            res.status(201).json("Your Id Has Been Deleted");

        } catch (err) {
            console.log(err);
            res.status(404).json('You are not allowed');

        }
    }

});

// GET List
router.get("/", verify, async (req, res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    console.log(typeQuery);
    console.log(genreQuery);
    let list = [];
    try {
        if (typeQuery) {
            if (genreQuery) {
                list = await List.aggregate([
                    { $sample: { size: 10 } },
                    { $match: { type: typeQuery, genre: genreQuery } },
                ]);
                console.log("c",list);

            } else {
                list = await List.aggregate([
                    { $sample: { size: 5 } },
                    { $match: { type: typeQuery } },
                ]);
                console.log("b",list);

            }
        } else {
            list = await List.aggregate([{ $sample: { size: 10 } }]);
            console.log("c",list);

        }
        console.log(list);
        res.status(200).json(list);
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;