import EnrollmentsDao from "./dao.js";
import UsersDao from "../Users/dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);
  const usersDao = UsersDao(db);

  const enrollUserInCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.params;
    const enrollment = dao.enrollUserInCourse(currentUser._id, courseId);
    res.json(enrollment);
  };

  const unenrollUserFromCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.params;
    const status = dao.unenrollUserFromCourse(currentUser._id, courseId);
    res.json(status);
  };

  const findEnrollmentsForUser = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const enrollments = dao.findEnrollmentsForUser(currentUser._id);
    res.json(enrollments);
  };

  const findUsersForCourse = (req, res) => {
    const { courseId } = req.params;
    const userIds = dao.findUsersForCourse(courseId);
    const users = userIds.map((userId) => usersDao.findUserById(userId)).filter(Boolean);
    res.json(users);
  };

  const enrollUserInCourseByFaculty = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      res.sendStatus(403);
      return;
    }
    const { courseId, userId } = req.params;
    const enrollment = dao.enrollUserInCourse(userId, courseId);
    res.json(enrollment);
  };

  app.post("/api/users/current/enrollments/:courseId", enrollUserInCourse);
  app.post("/api/courses/:courseId/users/:userId/enroll", enrollUserInCourseByFaculty);
  app.delete("/api/users/current/enrollments/:courseId", unenrollUserFromCourse);
  app.get("/api/users/current/enrollments", findEnrollmentsForUser);
  app.get("/api/courses/:courseId/users", findUsersForCourse);
}