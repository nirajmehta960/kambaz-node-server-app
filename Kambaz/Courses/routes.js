import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  const createCourse = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      const newCourse = await dao.createCourse(req.body);
      await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
      res.json(newCourse);
    } catch (error) {
      console.error("Error in createCourse route:", error);
      res.status(500).json({ error: "Failed to create course" });
    }
  };
  app.post("/api/users/current/courses", createCourse);

  const findCoursesForCurrentUser = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      const courses = await dao.findCoursesForEnrolledUser(currentUser._id);
      res.json(courses);
    } catch (error) {
      console.error("Error in findCoursesForCurrentUser route:", error);
      res.status(500).json({ error: "Failed to fetch courses for user" });
    }
  };
  app.get("/api/users/current/courses", findCoursesForCurrentUser);

  const findCoursesForEnrolledUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const courses = await dao.findCoursesForEnrolledUser(userId);
      res.json(courses);
    } catch (error) {
      console.error("Error in findCoursesForEnrolledUser route:", error);
      res.status(500).json({ error: "Failed to fetch courses for user" });
    }
  };
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

  const findAllCourses = async (req, res) => {
    try {
      const courses = await dao.findAllCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error in findAllCourses route:", error);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  };
  app.get("/api/courses", findAllCourses);

  const deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const status = await dao.deleteCourse(courseId);
      res.json(status);
    } catch (error) {
      console.error("Error in deleteCourse route:", error);
      res.status(500).json({ error: "Failed to delete course" });
    }
  };
  app.delete("/api/courses/:courseId", deleteCourse);

  const updateCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const courseUpdates = req.body;
      const status = await dao.updateCourse(courseId, courseUpdates);
      res.json(status);
    } catch (error) {
      console.error("Error in updateCourse route:", error);
      res.status(500).json({ error: "Failed to update course" });
    }
  };
  app.put("/api/courses/:courseId", updateCourse);

  const findUsersForCourse = async (req, res) => {
    try {
      const { cid } = req.params;
      const users = await enrollmentsDao.findUsersForCourse(cid);
      res.json(users);
    } catch (error) {
      console.error("Error in findUsersForCourse route:", error);
      res.status(500).json({ error: "Failed to fetch users for course" });
    }
  };
  app.get("/api/courses/:cid/users", findUsersForCourse);
}
