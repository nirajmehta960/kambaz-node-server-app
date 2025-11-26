import EnrollmentsDao from "./dao.js";
import UsersDao from "../Users/dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);
  const usersDao = UsersDao(db);

  const enrollUserInCourse = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      const { courseId } = req.params;
      const enrollment = await dao.enrollUserInCourse(
        currentUser._id,
        courseId
      );
      res.json(enrollment);
    } catch (error) {
      console.error("Error in enrollUserInCourse route:", error);
      res.status(500).json({ error: "Failed to enroll user in course" });
    }
  };
  app.post("/api/users/current/enrollments/:courseId", enrollUserInCourse);

  const unenrollUserFromCourse = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      const { courseId } = req.params;
      const status = await dao.unenrollUserFromCourse(
        currentUser._id,
        courseId
      );
      res.json(status);
    } catch (error) {
      console.error("Error in unenrollUserFromCourse route:", error);
      res.status(500).json({ error: "Failed to unenroll user from course" });
    }
  };
  app.delete(
    "/api/users/current/enrollments/:courseId",
    unenrollUserFromCourse
  );

  const findEnrollmentsForUser = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      const enrollments = await dao.findCoursesForUser(currentUser._id);
      res.json(enrollments);
    } catch (error) {
      console.error("Error in findEnrollmentsForUser route:", error);
      res.status(500).json({ error: "Failed to fetch enrollments for user" });
    }
  };
  app.get("/api/users/current/enrollments", findEnrollmentsForUser);

  const findUsersForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const users = await dao.findUsersForCourse(courseId);
      res.json(users);
    } catch (error) {
      console.error("Error in findUsersForCourse route:", error);
      res.status(500).json({ error: "Failed to fetch users for course" });
    }
  };
  app.get("/api/courses/:courseId/users", findUsersForCourse);

  const enrollUserInCourseByFaculty = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser || currentUser.role !== "FACULTY") {
        res.sendStatus(403);
        return;
      }
      const { courseId, userId } = req.params;
      const enrollment = await dao.enrollUserInCourse(userId, courseId);
      res.json(enrollment);
    } catch (error) {
      console.error("Error in enrollUserInCourseByFaculty route:", error);
      res.status(500).json({ error: "Failed to enroll user in course" });
    }
  };
  app.post(
    "/api/courses/:courseId/users/:userId/enroll",
    enrollUserInCourseByFaculty
  );
}
