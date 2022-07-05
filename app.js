const express = require("express");
const fs = require("fs");

const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

const app = express();

app.use(express.json());

app.get("/users", (req, res) => {
    return res.status(200).json(data);
})

app.post("/users", (req, res) => {
    const newUser = req.body;
    newUser.id = data.length > 0 ? data.at(-1).id + 1 : 1;

    data.push(newUser);

    fs.writeFileSync("data.json", JSON.stringify(data), "utf8", (err) => {
        return res.status(500).json(err);
    });

    return res.status(200).json(newUser);
})

app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = data.find(user => user.id == id);

    if (!user) return res.status(204).json();

    user.name = name;
    user.email = email;

    fs.writeFileSync("data.json", JSON.stringify(data), "utf8", (err) => {
        return res.status(500).json(err);
    });

    return res.status(200).json(user);
})

app.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    const dataIndex = data.indexOf(data.find(user => user.id == id));

    if (dataIndex < 0) return res.status(204).json();

    data.splice(dataIndex, 1);

    fs.writeFileSync("data.json", JSON.stringify(data), "utf8", (err) => {
        return res.status(500).json(err);
    });

    return res.status(200).json();
})

app.listen(3000, () => {
    console.log("Server is running at port 3000")
})