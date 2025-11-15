import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function CoursesDao(db) {
  async function findAllCourses() {
    return model.find({}, { name: 1, description: 1 });
  }

  async function findCoursesForEnrolledUser(userId) {
    try {
      const { enrollments } = db || {};
      const courses = await model.find({}, { name: 1, description: 1 });
      if (!enrollments || !Array.isArray(enrollments)) {
        return courses; // Return all courses if enrollments not available
      }
      const enrolledCourses = courses.filter((course) =>
        enrollments.some(
          (enrollment) =>
            enrollment.user === userId && enrollment.course === course._id
        )
      );
      return enrolledCourses;
    } catch (error) {
      console.error("Error in findCoursesForEnrolledUser:", error);
      throw error;
    }
  }

  async function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    return model.create(newCourse);
  }

  async function deleteCourse(courseId) {
    try {
      if (db && db.enrollments && Array.isArray(db.enrollments)) {
        db.enrollments = db.enrollments.filter(
          (enrollment) => enrollment.course !== courseId
        );
      }
      return model.deleteOne({ _id: courseId });
    } catch (error) {
      console.error("Error in deleteCourse:", error);
      throw error;
    }
  }

  async function updateCourse(courseId, courseUpdates) {
    return model.updateOne({ _id: courseId }, { $set: courseUpdates });
  }

  return {
    findAllCourses,
    findCoursesForEnrolledUser,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}
