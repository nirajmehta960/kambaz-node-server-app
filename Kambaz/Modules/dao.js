import model from "./model.js";
import courseModel from "../Courses/model.js";
import { v4 as uuidv4 } from "uuid";

export default function ModulesDao(db) {
  async function findModulesForCourse(courseId) {
    try {
      return await model.find({ course: courseId });
    } catch (error) {
      console.error("Error in findModulesForCourse:", error);
      throw error;
    }
  }

  async function createModule(courseId, module) {
    try {
      const newModule = { ...module, _id: uuidv4(), course: courseId };
      // Create module in modules collection
      const createdModule = await model.create(newModule);
      // Also add to course's modules array
      await courseModel.updateOne(
        { _id: courseId },
        { $push: { modules: newModule } }
      );
      return createdModule;
    } catch (error) {
      console.error("Error in createModule:", error);
      throw error;
    }
  }

  async function deleteModule(moduleId) {
    try {
      // Delete from modules collection
      const deleteResult = await model.deleteOne({ _id: moduleId });
      // Also remove from course's modules array
      await courseModel.updateOne(
        { "modules._id": moduleId },
        { $pull: { modules: { _id: moduleId } } }
      );
      return deleteResult;
    } catch (error) {
      console.error("Error in deleteModule:", error);
      throw error;
    }
  }

  async function updateModule(moduleId, moduleUpdates) {
    try {
      // Update in modules collection
      const updateResult = await model.updateOne(
        { _id: moduleId },
        { $set: moduleUpdates }
      );
      // Also update in course's modules array
      const updateObj = {};
      Object.keys(moduleUpdates).forEach((key) => {
        if (key !== "_id") {
          updateObj[`modules.$.${key}`] = moduleUpdates[key];
        }
      });
      if (Object.keys(updateObj).length > 0) {
        await courseModel.updateOne(
          { "modules._id": moduleId },
          { $set: updateObj }
        );
      }
      return updateResult;
    } catch (error) {
      console.error("Error in updateModule:", error);
      throw error;
    }
  }

  async function addLessonToModule(moduleId, lesson) {
    try {
      const newLesson = { ...lesson, _id: uuidv4() };
      // Add lesson to module in modules collection
      const updateResult = await model.updateOne(
        { _id: moduleId },
        { $push: { lessons: newLesson } }
      );
      // Also add lesson to module in course's modules array
      await courseModel.updateOne(
        { "modules._id": moduleId },
        { $push: { "modules.$.lessons": newLesson } }
      );
      return newLesson;
    } catch (error) {
      console.error("Error in addLessonToModule:", error);
      throw error;
    }
  }

  return {
    findModulesForCourse,
    createModule,
    deleteModule,
    updateModule,
    addLessonToModule,
  };
}
