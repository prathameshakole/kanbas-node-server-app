import * as dao from "./dao.js";
// let currentUser = null;
export default function UserRoutes(app) {
    const deleteUser = async (req, res) => {
        const status = await dao.deleteUser(req.params.userId);
        res.json(status);
    };

    app.delete("/api/users/:userId", deleteUser);

    const findUserById = async (req, res) => {
        const user = await dao.findUserById(req.params.userId);
        res.json(user);
    };

    app.get("/api/users/:userId", findUserById);

    const updateUser = async (req, res) => {
        const { userId } = req.params;
        const status = await dao.updateUser(userId, req.body);
        const currentUser = await dao.findUserById(userId);
        req.session["currentUser"] = currentUser;
        res.json(status);
    };


    const signup = async (req, res) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json(
                { message: "Username already taken" });
        }
        const currentUser = await dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };
    app.post("/api/users/signup", signup);

    const signin = async (req, res) => {
        const { username, password } = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);
        if (currentUser) {
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            res.sendStatus(401);
        }
    };


    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };
    app.post("/api/users/signout", signout);

    const profile = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };

    const findAllUsers = async (req, res) => {
        const { role } = req.query;
        if (role) {
            const users = await dao.findUsersByRole(role);
            res.json(users);
            return;
        }
        const users = await dao.findAllUsers();
        res.json(users);
    };

    const createUser = async (req, res) => {
        const user = await dao.createUser(req.body);
        res.json(user);
    };
    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.put("/api/users/:userId", updateUser);
    app.post("/api/users/signin", signin);
    app.post("/api/users/profile", profile);
}

