import UsersDao from "./dao.js";
import CoursesDao from "../Courses/dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app, db) {
  const dao = UsersDao();
  const courseDao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  const findCoursesForUser = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      if (currentUser.role === "ADMIN") {
        const courses = await courseDao.findAllCourses();
        res.json(courses);
        return;
      }
      let { uid } = req.params;
      if (uid === "current") {
        uid = currentUser._id;
      }
      const courses = await enrollmentsDao.findCoursesForUser(uid);
      res.json(courses);
    } catch (error) {
      console.error("Error in findCoursesForUser route:", error);
      res.status(500).json({ error: "Failed to fetch courses for user" });
    }
  };
  app.get("/api/users/:uid/courses", findCoursesForUser);

  const createUser = async (req, res) => {
    try {
      const user = await dao.createUser(req.body);
      res.json(user);
    } catch (error) {
      console.error("Error in createUser route:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  };
  app.post("/api/users", createUser);

  const deleteUser = async (req, res) => {
    try {
      const status = await dao.deleteUser(req.params.userId);
      res.json(status);
    } catch (error) {
      console.error("Error in deleteUser route:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  };
  app.delete("/api/users/:userId", deleteUser);

  const findAllUsers = async (req, res) => {
    try {
      const { role, name } = req.query;
      if (role) {
        const users = await dao.findUsersByRole(role);
        res.json(users);
        return;
      }
      if (name) {
        const users = await dao.findUsersByPartialName(name);
        res.json(users);
        return;
      }
      const users = await dao.findAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error in findAllUsers route:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  };
  app.get("/api/users", findAllUsers);

  const findUserById = async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await dao.findUserById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      console.error("Error in findUserById route:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  };
  app.get("/api/users/:userId", findUserById);

  const updateUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const userUpdates = req.body;
      await dao.updateUser(userId, userUpdates);
      const updatedUser = await dao.findUserById(userId);
      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const currentUser = req.session["currentUser"];
      if (currentUser && currentUser._id === userId) {
        req.session["currentUser"] = updatedUser;
      }
      res.json(updatedUser);
    } catch (error) {
      console.error("Error in updateUser route:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  };
  app.put("/api/users/:userId", updateUser);

  const signup = async (req, res) => {
    try {
      const user = await dao.findUserByUsername(req.body.username);
      if (user) {
        res.status(400).json({ message: "Username already taken" });
        return;
      }
      const currentUser = await dao.createUser(req.body);
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } catch (error) {
      console.error("Error in signup route:", error);
      res.status(500).json({ error: "Failed to sign up user" });
    }
  };
  app.post("/api/users/signup", signup);

  const signin = async (req, res) => {
    try {
      const { username, password } = req.body;
      const currentUser = await dao.findUserByCredentials(username, password);
      if (currentUser) {
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
      } else {
        res.status(401).json({ message: "Unable to login. Try again later." });
      }
    } catch (error) {
      console.error("Error in signin route:", error);
      res.status(500).json({ error: "Failed to sign in user" });
    }
  };
  app.post("/api/users/signin", signin);

  const signout = (req, res) => {
    try {
      req.session.destroy();
      res.sendStatus(200);
    } catch (error) {
      console.error("Error in signout route:", error);
      res.status(500).json({ error: "Failed to sign out" });
    }
  };
  app.post("/api/users/signout", signout);

  const profile = (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.status(200).json(null);
        return;
      }
      res.json(currentUser);
    } catch (error) {
      console.error("Error in profile route:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  };
  app.post("/api/users/profile", profile);

  const enrollUserInCourse = async (req, res) => {
    try {
      let { uid, cid } = req.params;
      if (uid === "current") {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
          res.sendStatus(401);
          return;
        }
        uid = currentUser._id;
      }
      const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
      res.json(status);
    } catch (error) {
      console.error("Error in enrollUserInCourse route:", error);
      res.status(500).json({ error: "Failed to enroll user in course" });
    }
  };
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);

  const unenrollUserFromCourse = async (req, res) => {
    try {
      let { uid, cid } = req.params;
      if (uid === "current") {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
          res.sendStatus(401);
          return;
        }
        uid = currentUser._id;
      }
      const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
      res.json(status);
    } catch (error) {
      console.error("Error in unenrollUserFromCourse route:", error);
      res.status(500).json({ error: "Failed to unenroll user from course" });
    }
  };
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
}
