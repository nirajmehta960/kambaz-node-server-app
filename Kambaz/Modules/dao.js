import { v4 as uuidv4 } from "uuid";
import model from "../Courses/model.js";

export default function ModulesDao(db) {
  async function createModule(courseId, module) {
    try {
      const newModule = { ...module, _id: uuidv4() };
      const status = await model.updateOne(
        { _id: courseId },
        { $push: { modules: newModule } }
      );
      return newModule;
    } catch (error) {
      console.error("Error in createModule:", error);
      throw error;
    }
  }

  async function deleteModule(moduleId) {
    try {
      // Find the course that contains this module and remove it using $pull
      const status = await model.updateOne(
        { "modules._id": moduleId },
        { $pull: { modules: { _id: moduleId } } }
      );
      return status;
    } catch (error) {
      console.error("Error in deleteModule:", error);
      throw error;
    }
  }

  async function updateModule(moduleId, moduleUpdates) {
    try {
      // Build the update object for nested fields
      const updateObj = {};
      Object.keys(moduleUpdates).forEach((key) => {
        if (key !== "_id") {
          updateObj[`modules.$.${key}`] = moduleUpdates[key];
        }
      });

      // Use $set with positional operator to update the module
      const status = await model.updateOne(
        { "modules._id": moduleId },
        { $set: updateObj }
      );
      return status;
    } catch (error) {
      console.error("Error in updateModule:", error);
      throw error;
    }
  }

  async function findModulesForCourse(courseId) {
    try {
      const course = await model.findById(courseId);
      return course ? course.modules || [] : [];
    } catch (error) {
      console.error("Error in findModulesForCourse:", error);
      throw error;
    }
  }

  return {
    createModule,
    updateModule,
    deleteModule,
    findModulesForCourse,
  };
}
