import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function CoursesDao(db) {
  async function findAllCourses() {
    try {
      return await model.find({}, { name: 1, description: 1 });
    } catch (error) {
      console.error("Error in findAllCourses:", error);
      throw error;
    }
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
    try {
      const newCourse = { ...course, _id: uuidv4() };
      return await model.create(newCourse);
    } catch (error) {
      console.error("Error in createCourse:", error);
      throw error;
    }
  }

  async function deleteCourse(courseId) {
    try {
      if (db && db.enrollments && Array.isArray(db.enrollments)) {
        db.enrollments = db.enrollments.filter(
          (enrollment) => enrollment.course !== courseId
        );
      }
      return await model.deleteOne({ _id: courseId });
    } catch (error) {
      console.error("Error in deleteCourse:", error);
      throw error;
    }
  }

  async function updateCourse(courseId, courseUpdates) {
    try {
      return await model.updateOne({ _id: courseId }, { $set: courseUpdates });
    } catch (error) {
      console.error("Error in updateCourse:", error);
      throw error;
    }
  }

  return {
    findAllCourses,
    findCoursesForEnrolledUser,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}
